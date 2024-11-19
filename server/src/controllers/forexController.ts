import { Request, Response } from 'express';
import { prisma } from '../server';

export const getPairs = async (req: Request, res: Response) => {
    try {
        const pairs = await prisma.forexPair.findMany();
        res.json(pairs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Forex pairs' });
    }
};

export const getCandlesticks = async (req: Request, res: Response) => {
    try {
        const { pair, interval, start, end } = req.query;
        const candlesticks = await prisma.candleStick.findMany({
            where: {
                pair: pair as string,
                interval: interval as string,
                timestamp: {
                    gte: new Date(start as string),
                    lte: new Date(end as string),
                },
            },
            orderBy: {
                timestamp: 'asc',
            },
        });
        res.json(candlesticks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching candlesticks' });
    }
};