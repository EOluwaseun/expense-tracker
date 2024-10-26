import { pool } from '../lib/database.js';

export const getAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const accounts = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1`,
      values: [userId],
    });

    res.status(200).json({
      status: 'success',
      data: accounts.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const { name, amount, account_number } = req.body;

    const accountExistQuery = {
      //if the user has account and the id already exist
      text: `SELECT * FROM tblaccount WHERE account_name = $1 AND user_id = $2`,
      values: [name, userId],
    };

    //check if account exist in d database
    const accountQueryResult = await pool.query(accountExistQuery);

    const accountExist = accountQueryResult.rows[0];

    if (accountExist) {
      return res
        .status(400)
        .json({ status: 'failed', message: 'Account already exist' });
    }

    // otherwise create account
    const createAccountResult = await pool.query({
      text: `INSERT INTO tblaccount(user_id, account_name, account_number, account_balance) VALUES($1, $2, $3, $4) RETURNING *`,
      values: [userId, name, account_number, amount],
    });

    //the account
    const account = createAccountResult.rows[0];

    //CHECK IF ACCOUNT NAME IS IN ARRAY, OTHERWISE MAKE IT AN ARRAY
    const userAccounts = Array.isArray(name) ? name : [name];

    const updateUserAccountQuery = {
      //array_cat allows us to add another value to d array and preserve the existing value in it
      //UPDATE tbluser SET accounts === this set values into account array
      text: `UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [userAccounts, userId],
    };
    await pool.query(updateUserAccountQuery);

    //add initial dEposit transaction
    const description = account.account_name + '(Initial Deposit)';

    const initialDepositQuery = {
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        userId,
        description,
        'income',
        'Completed',
        amount,
        account.account_name,
      ],
    };

    await pool.query(initialDepositQuery);

    res.status(201).json({
      status: 'success',
      message: account.account_name + ' Operation completed successfully',
      data: account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const addMoneyToAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const { amount } = req.body;

    //the amount is converted to a number
    const newAmount = Number(amount);

    const result = await pool.query({
      //add new amount and preseve the existing amount
      text: `UPDATE tblaccount SET account_balance = (account_balance + $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [newAmount, id],
    });

    const accountInformation = result.rows[0];

    const description = accountInformation.account_name + ' (Deposit)';

    const transactionQuery = {
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        userId,
        description,
        'income',
        'Completed',
        amount,
        accountInformation.account_name,
      ],
    };

    await pool.query(transactionQuery);

    res.status(200).json({
      status: 'success',
      message: 'Operation completed successfully',
      data: accountInformation,
    });

    await pool.query(transactionQuery);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
