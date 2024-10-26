import { pool } from '../lib/database.js';

export const getTransaction = async (req, res) => {
  try {
    const today = new Date();

    const _sevenDaysAgo = new Date(today);

    _sevenDaysAgo.setDate(today.getDate() - 7);

    const sevenDaysAgo = _sevenDaysAgo.toISOString().split('T')[0];

    const { df, dt, s } = req.query; //df date from, dt date to, s is searched variable

    const { userId } = req.body.user;

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
    resizeBy.status(500).json({ status: 'failed', message: error.message });
  }
};

export const getDashboardInformation = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    resizeBy.status(500).json({ status: 'failed', message: error.message });
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
    const { from_account, to_account } = req.body;

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
  } catch (error) {
    console.log(error);
    resizeBy.status(500).json({ status: 'failed', message: error.message });
  }
};
