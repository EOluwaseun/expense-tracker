import bycrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const hashPassword = async (userValue) => {
  const salt = await bycrypt.genSaltSync(10);

  const hashPassword = await bycrypt.hash(userValue, salt);
  return hashPassword;
};

export const comparePassword = async (userPassword, password) => {
  try {
    const isMatch = await bycrypt.compare(userPassword, password);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

///create JWT
export const createJWT = (id) => {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
