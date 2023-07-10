import express from 'express';
import {config} from 'dotenv';
import cors from 'cors';

import TransactionsController from './controllers/TransactionController.js';
import UserController from './controllers/UserController.js';

const app = express();

//Middleware
app.use(express.json());
app.use(cors());
config();   

app.use('/api/transactions',TransactionsController);
app.use('/api/user',UserController);

app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
});