import express from 'express';
import {config} from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';

import TransactionsController from './controllers/TransactionController.js';
import UserController from './controllers/UserController.js';

import {google} from 'googleapis';

const app = express();

//Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(hpp());
config();   

app.use('/api/transactions',TransactionsController);
app.use('/api/user',UserController);

app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
});