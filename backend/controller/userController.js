import { pool } from '../lib/database.js';
import { comparePassword, hashPassword } from '../lib/index.js';

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body.user;
    // get auth user

    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found.',
      });
    }
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User nott found.',
      });
    }

    //   if user exist

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        status: 'failed',
        message: 'New password does not match',
      });
    }

    const isMatch = await comparePassword(currentPassword, user?.password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'failed',
        message: 'Current passoword is incorrect',
      });
    }

    //if it matches
    const hashedPassword = await hashPassword(newPassword);

    await pool.query({
      //all password will be updated if we did'nt use d where clause
      text: `UPDATE tbluser SET password = $1 WHERE id = $2`,
      values: [hashedPassword, userId],
    });
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const { firstname, lastname, country, currency, contact } = req.body;

    // check if user exist
    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'User not found.',
      });
    }

    const updateUser = await pool.query({
      text: `UPDATE tbluser SET firstname = $1, lastname = $2, currency = $3, country = $4, contact = $5, updatedat = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
      values: [firstname, lastname, currency, country, contact, userId],
    });

    //set password to undefined when sending d data
    updateUser.rows[0].password = undefined;

    res.status(200).json({
      status: 'success',
      message: 'User information updated successfully',
      user: updateUser.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
