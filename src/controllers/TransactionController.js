import express from 'express';
import { 
    getTransactionsService,
    addTransactionService,
    refreshTransactionService,
    updateTransactionService,
    deleteTransactionService,
    getDashboardData 
} from '../services/TransactionService.js';

const router = express.Router();

router.get("/getDashboardData/monthStartDay/:monthStartDay/month/:month/year/:year",getDashboardData);
router.get("/monthStartDay/:monthStartDay/month/:month/year/:year",getTransactionsService);
router.post("/addTransaction",addTransactionService);
router.put("/updateTransaction/:id",updateTransactionService);
router.delete("/deleteTransaction/:id",deleteTransactionService);
router.post("/refreshTransactions",refreshTransactionService);

export default router;