import express from 'express';
import authRoute from './authroute.js';
import accountRoute from './accounteroutes.js';
import transactionRoute from './transactionroute.js';
import userRoute from './usersroute.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/account', accountRoute);
router.use('/transaction', transactionRoute);

export default router;
