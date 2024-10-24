import { pool } from '../lib/database.js';

export const getAccount = async (req, res) => {
  try {
    const { userId } = req.body;

    const accounts = await pool.query({
      text: `SELECT * FROM tblaccount user_id = $1`,
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
      text: `UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [userAccounts, userId],
    };
    await pool.query(updateUserAccountQuery);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const addMoneyToAccount = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
