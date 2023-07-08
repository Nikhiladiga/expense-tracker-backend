import { 
    getTransactions,
    addTransaction, 
    updateTransaction,  
    deleteTransaction
} from '../repositories/TransactionRepository.js';
import { authorize } from '../config/auth.js';
import { parseMessage } from '../utils/index.js'
import {listMessages,getMessage} from '../config/auth.js';

export const getTransactionsService = async (req, res) => {
    try {
        const result = await getTransactions(req.params.monthStartDay,req.params.month,req.params.year);
        res.status(200).json({ success: true, result });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}

export const getDashboardData = async (req, res) => {
    try {
        const result = await getTransactions(req.params.monthStartDay, req.params.month, req.params.year);

        // Calculate total expense
        const totalExpense = result
            ? result.reduce((total, transaction) => {
                if (transaction.transactionType === 'DEBIT') {
                    return total + Math.abs(transaction.amount);
                } else {
                    return total;
                }
            }, 0)
            : 0;

        // Calculate total income
        const totalIncome = result
            ? result.reduce((total, transaction) => {
                if (transaction.transactionType === 'CREDIT') {
                    return total + transaction.amount;
                } else {
                    return total;
                }
            }, 0)
            : 0;

        const totalBalance = totalIncome - totalExpense;

        // Return the dashboard data
        res.json({
            totalExpense,
            totalIncome,
            totalBalance
        });
    } catch (error) {
        console.error("Error getting dashboard data: ", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


export const addTransactionService = async (req,res) => {
    try {
        const result = await addTransaction(req.body);
        if (result) {
            res.status(200).json({success:true,result});
        } else {
            res.status(500).json({success:false});
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: e.message });
    }
}

export const updateTransactionService = async (req,res) => {
    try {
        const result = await updateTransaction(req.body,req.params.id);
        if (result) {
            res.status(200).json({success:true,result});
        } else {
            res.status(500).json({success:false});
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}

export const deleteTransactionService = async (req,res) => {
    try {
        const result = await deleteTransaction(req.params.id);
        if (result) {
            res.status(200).json({success:true,result});
        } else {
            res.status(500).json({success:false});
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}

export const refreshTransactionService = async (req,res) => {
    try {
        const auth = await authorize();
        listMessages(auth, 'me', 'from:alerts@axisbank.com', async (messages) => {
            console.log("No of messages read:",messages.length);
            const promises = messages.map((message) =>
                new Promise((resolve, reject) => {
                    getMessage(auth, 'me', message.id, (body) => {
                        if (body.data.length > 0) {
                            resolve(parseMessage(body.data, body.createdAt, message.id));
                        } else {
                            resolve("");
                        }
                    });
                })
            );

            const result = await Promise.all(promises);

            console.log(result.length);

            const finalRes = [];
            
            //Check if transaction already exists and add here if it does not.
            const addTransactionPromises = result.map(res => {
                if (res) {
                    return new Promise((resolve,reject)=>{
                        finalRes.push(res);
                        resolve(addTransaction(res));
                    });
                }
            });

            await Promise.all(addTransactionPromises);
            res.status(200).json({success:true});
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}