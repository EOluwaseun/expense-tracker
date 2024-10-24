import { pool } from '../lib/database.js';
import { comparePassword, createJWT, hashPassword } from '../lib/index.js';

export const signupUser = async (req, res) => {
  try {
    // get data from body
    const { firstName, email, password } = req.body;

    if (!(firstName || email || password)) {
      return res.status(404).json({
        status: 'failed',
        message: 'Provide Required Field',
      });
    }

    const userExist = await pool.query({
      //select it if it exist
      text: 'SELECT EXISTS (SELECT * FROM tbluser WHERE email = $1)',
      values: [email],
    });

    //there will rows of user but single, thats y we provide [0]
    if (userExist.rows[0].userExist) {
      return res.status(409).json({
        status: 'failed',
        message: 'Email Address already exist, Try login with correct email',
      });
    }

    const hashedPassword = await hashPassword(password);
    //create d user
    const user = await pool.query({
      text: `INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
      values: [firstName, email, hashedPassword],
    });

    //don't send password to user
    user.rows[0].password = undefined;

    res.status(201).json({
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
    const { firstname, email, password } = req.body;

    const result = await pool.query({
      //select it if it exist
      text: 'SELECT * FROM tbluser WHERE email = $1',
      values: [email],
    });

    const user = result.rows[0]; //this is user with this email

    if (!user) {
      return res.status(404).json({
        // user: user.rows[0],
        status: 'falied',
        message: 'Invalid email or password',
      });
    }

    const isMatchPassword = await comparePassword(password, user?.password);

    if (!isMatchPassword) {
      return res.status(404).json({
        status: 'falied',
        message: 'Invalid email or password',
      });
    }

    // create token everything are correct
    const token = createJWT(user.id);
    user.password = undefined;

    res.status(404).json({
      user: user,
      status: 'success',
      message: 'User login succsessfully',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

// export const signinUser = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: 'failed', message: error.message });
//   }
// };
