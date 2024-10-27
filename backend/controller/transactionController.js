import { pool } from '../lib/database.js';
import { getMonthName } from '../lib/index.js';

export const getTransaction = async (req, res) => {
  try {
    const today = new Date();

    const _sevenDaysAgo = new Date(today);

    _sevenDaysAgo.setDate(today.getDate() - 7);

    const sevenDaysAgo = _sevenDaysAgo.toISOString().split('T')[0];

    const { df, dt, s } = req.query; //df date from, dt date to, s is searched variable

    const { userId } = req.body.user; //this is coming from token

    const startDate = new Date(df || sevenDaysAgo); //if the start date does't exist, start from seven days
    const endDate = new Date(dt || new Date()); // end date or current date new Date()

    const transactions = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 AND (description ILIKE
        '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%' ) ORDER BY id DESC`, //description OR status
      values: [userId, startDate, endDate, s],
    });

    res.status(200).json({
      status: 'success',
      data: transactions.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const getDashboardInformation = async (req, res) => {
  try {
    const { userId } = req.body.user;

    let totalIncome = 0;
    let totalExpense = 0;

    const transactionResult = await pool.query({
      text: `SELECT type, SUM(amount) AS totalAmount FROM tbltransaction WHERE user_id = $1 GROUP BY type`,
      values: [userId],
    });

    const transactions = transactionResult.rows; //get all transaction

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += transaction.totalamount;
      } else {
        totalExpense += transaction.totalamount;
      }
    });

    const availableBalance = totalIncome - totalExpense;

    // Aggregate transaction to sum by type and  group by month
    const year = new Date().getFullYear();
    const start_Date = new Date(year, 0, 1); //january 1st of the year
    const end_Date = new Date(year, 11, 31, 23, 59, 59); //december 31st of the yeari

    const result = await pool.query({
      text: `SELECT EXTRACT(MONTH FROM createdat) AS month,
        type,
        SUM(amount) AS totalAmount
        FROM
        tbltransaction
        WHERE
        user_id = $1
        AND createdat BETWEEN $2 AND $3
        GROUP BY
        EXTRACT(MONTH FROM createdat), type`,
      values: [userId, start_Date, end_Date],
    });

    //organise data
    const data = new Array(12).fill().map((_, index) => {
      const monthDate = result.rows.filter(
        (item) => parseInt(item.month) === index + 1
      );

      const income =
        monthDate.find((item) => item.type === 'income')?.totalamount || 0;

      const expense =
        monthDate.find((item) => item.type === 'expense')?.totalamount || 0;

      return {
        label: getMonthName(index),
        income,
        expense,
      };
    });

    // fetch last transaction
    const lastTransactionsResults = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY id DESC LIMIT 5`,
      values: [userId],
    });

    const lastTransaction = lastTransactionsResults.rows;

    // fetch last account
    const lastAccountResults = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY id DESC LIMIT 4`,
      values: [userId],
    });

    const lastAccount = lastAccountResults.rows;

    res.status(200).json({
      status: 'success',
      availableBalance,
      totalIncome,
      totalExpense,
      chartData: data,
      lastTransaction,
      lastAccount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { account_id } = req.params;
    const { description, source, amount } = req.body;

    if (!(description || source || amount)) {
      return res.status(403).json({
        status: 'failed',
        message: 'Provide Required field!',
      });
    }

    if (Number(amount <= 0)) {
      //amount must not be less than zero
      return res.status(403).json({
        status: 'failed',
        message: 'Amount should be greater than 0.',
      });
    }

    const result = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [account_id],
    });

    const accountInfo = result.rows[0]; //get the account ID AND IT'S INFORMATION

    if (!accountInfo) {
      return res.status(403).json({
        status: 'failed',
        message: 'Invalid account information,',
      });
    }

    if (
      accountInfo.account_balance <= 0 || //if the account is 0
      accountInfo.account_balance < Number(amount) //or may be d money u have in ur account is less than money u wnt to transfer
    ) {
      return res.status(403).json({
        status: 'failed',
        message: 'Transaction failed, insufficient account balance,',
      });
    }

    //start of a transaction
    //if the below query doesn't go through, the transacion won't commmit
    await pool.query('BEGIN');

    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updateat = CURRENT_TIMESTAMP WHERE id = $2`,
      valus: [amount, account_id],
    });
    //after updating the account, it will then be added to transaction
    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [userId, description, 'expense', 'Completed', amount, source],
    });

    await pool.query('COMMIT');
  } catch (error) {
    console.log(error);
    resizeBy.status(500).json({ status: 'failed', message: error.message });
  }
};

export const transferMoneyToAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { from_account, to_account, amount } = req.body;

    if (!(from_account || to_account || amount)) {
      return res.status(403).json({
        status: 'failed',
        message: 'Provide Required field!',
      });
    }

    const newAmount = Number(amount); //amount you are sending

    if (newAmount <= 0) {
      //amount you are sending must be greater than zero
      return res.status(403).json({
        status: 'failed',
        message: 'Amount should be greater than 0',
      });
    }

    //check the account balance, that's sending the money
    const fromAcountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [from_account],
    });

    // get the accountInfo out
    const fromAccountDetails = fromAcountResult.rows[0];

    if (!fromAccountDetails) {
      //if the account details is invalid
      return res.status(404).json({
        status: 'failed',
        message: 'Account information not found',
      });
    }

    if (newAmount > fromAccountDetails.account_balance) {
      return res.status(404).json({
        status: 'failed',
        message: 'Transaction failed, due to insufficient balance',
      });
    }

    // begin transaction
    await pool.query('BEGIN');

    // transfer from account
    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, from_account],
    });

    // transfer to account
    const toAccount = await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [newAmount, to_account],
    });

    // Insert transaction record
    const description = `Transfer (${fromAccountDetails.account_name} - ${toAccount.rows[0].account_name})`;

    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount,source), VALUES($1, $2, $3, $4, $5, $6))`,
      values: [
        userId,
        description,
        'expense',
        'Completed',
        amount,
        fromAccountDetails.account_name,
      ],
    });

    await pool.query('COMMIT');
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
