import express from 'express';
import { getPairs, getCandlesticks } from '../controllers/forexController';

const router = express.Router();

router.get('/pairs', getPairs);
router.get('/candlesticks', getCandlesticks);

export default router;