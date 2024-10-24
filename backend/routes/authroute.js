import express from 'express';
import { signinUser, signupUser } from '../controller/signupUser.js';

const router = express.Router();

router.post('/sign-up', signupUser);
router.post('/sign-in', signinUser);

export default router;
