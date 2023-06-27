import express from 'express';
import {getUserDataService,setUserDataService} from '../services/UserService.js';

const router = express.Router();

router.get('/getUserData',getUserDataService);
router.post('/setUserData',setUserDataService);

export default router;