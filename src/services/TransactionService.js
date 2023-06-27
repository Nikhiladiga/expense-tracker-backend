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
        const result = await getTransactions(req.params.createdAt);
        res.status(200).json({ success: true, result });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}

export const addTransactionService = async (req,res) => {
    try {
        const result = await addTransaction(req.body);
        if (result) {
            res.status(200).json({success:true,result});
        } else {
            res.status(500).json({success:false});
        }
    } catch (e) {
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
            const promises = messages.map((message) =>
                new Promise((resolve, reject) => {
                    getMessage(auth, 'me', message.id, (body) => {
                        if (body.data.length > 0) {
                            // Regular expression to match date followed by "Dear Nikhil Adiga"
                            const startPattern = /\d{2}-\d{2}-\d{4} Dear Nikhil Adiga/;
                            const startMatch = body.data.match(startPattern);
                            const end = body.data.indexOf("Axis Bank Ltd") + "Axis Bank Ltd".length;
                            let mainContent = '';

                            if (startMatch) {
                                const start = body.data.indexOf(startMatch[0]);
                                // Extract the main content
                                mainContent = body.data.slice(start, end);
                            }
                            resolve(parseMessage(mainContent, body.createdAt, message.id));
                        } else {
                            resolve("");
                        }
                    });
                })
            );

            const result = await Promise.all(promises);
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
            res.status(200).json({success:true,finalRes});
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}