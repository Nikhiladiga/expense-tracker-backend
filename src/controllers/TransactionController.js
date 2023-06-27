import express from 'express';
import { 
    getTransactionsService,
    addTransactionService,
    refreshTransactionService,
    updateTransactionService,
    deleteTransactionService 
} from '../services/TransactionService.js';

const router = express.Router();

router.get("/timeframe/:createdAt",getTransactionsService);
router.post("/addTransaction",addTransactionService);
router.put("/updateTransaction/:id",updateTransactionService);
router.delete("/deleteTransaction/:id",deleteTransactionService);
router.post("/refreshTransactions",refreshTransactionService);

export default router;