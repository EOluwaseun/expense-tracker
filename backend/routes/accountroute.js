import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addMoneyToAccount,
  createAccount,
  getAccount,
} from '../controller/accountController.js';

const router = express.Router();

router.get('/:id', authMiddleware, getAccount);
router.put('/create', authMiddleware, createAccount);
router.put('/add-money/:id', authMiddleware, addMoneyToAccount);

export default router;
