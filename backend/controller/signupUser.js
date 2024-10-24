import { pool } from '../lib/database.js';
import { hashPassword } from '../lib/index.js';

export const signupUser = async (req, res) => {
  try {
    // get data from body
    const { firstname, email, password } = req.body;

    if (!(firstname || email || password)) {
      return res.status(404).json({
        status: 'failed',
        message: 'Provide Required Field',
      });
    }

    const userExist = await pool.query({
      //select it if it exist
      text: 'SELECT EXISTS (SELECT * FROM tblser WHERE email = $1)',
      values: [email],
    });

    //there will rows of user but single, thats y we provide [0]
    if (userExist.rows[0].userExist) {
      return res.status(404).json({
        status: 'failed',
        message: 'Email Address already exist, Try login with correct email',
      });
    }

    const hashPassword = await hashPassword(password);
    //create d user
    const user = await pool.query({
      text: `INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
      values: [firstname, email, hashPassword],
    });

    //don't send password to user
    user.rows[0].password = undefined;

    res.status(404).json({
      user: user.rows[0],
      status: 'success',
      message: 'User account created succsessfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
