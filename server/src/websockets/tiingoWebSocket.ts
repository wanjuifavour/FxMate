import { Server, Socket } from 'socket.io';
import WebSocket from 'ws';
import { prisma } from '../server';

interface TiingoMessage {
    messageType: string;
    service: string;
    data: [string, string, string, number, number, number, number, number];
}

let lastPrices: { [key: string]: number[] } = {};
const CANDLE_INTERVALS = ['1m', '5m', '15m', '1h'];

export function connectToTiingo(io: Server) {
    const ws = new WebSocket('wss://api.tiingo.com/fx');

    ws.on('open', function open() {
        const subscribe = {
            eventName: 'subscribe',
            authorization: process.env.TIINGO_API_KEY,
            eventData: {
                thresholdLevel: 5,
                tickers: ['eurusd', 'gbpusd', 'usdjpy', 'audusd']
            }
        };
        ws.send(JSON.stringify(subscribe));
    });

    ws.on('message', async function (data) {
        const message: TiingoMessage = JSON.parse(data.toString());
        if (message.messageType === 'A' && message.service === 'fx') {
            const [, ticker, timestamp, , bidPrice, midPrice, , askPrice] = message.data;
            //console.log('Processing Tiingo message:', { ticker, bidPrice, askPrice, midPrice });
            
            try {
                await updateForexPair(ticker, bidPrice, askPrice, midPrice);
                await updateCandlestick(ticker, midPrice);
                //console.log('Successfully updated candlestick for', ticker);
                
                io.emit('forexUpdate', { ticker, bidPrice, askPrice, midPrice });
                //console.log('Emitted forexUpdate');
                
                io.emit('pairUpdate', {
                    base: ticker.slice(0,3).toUpperCase(),
                    quote: ticker.slice(3).toUpperCase(),
                    rate: midPrice,
                    type: 'pairUpdate'
                });
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
    });

    ws.on('error', console.error);
}

async function updateForexPair(ticker: string, bidPrice: number, askPrice: number, lastPrice: number) {
    await prisma.forexPair.upsert({
        where: { id: ticker },
        update: { bidPrice, askPrice, lastPrice, updatedAt: new Date() },
        create: { id: ticker, bidPrice, askPrice, lastPrice, updatedAt: new Date() }
    });
}

async function updateCandlestick(ticker: string, price: number) {
    const now = new Date();
    
    // Store last 100 prices for each ticker
    if (!lastPrices[ticker]) {
        lastPrices[ticker] = [];
    }
    lastPrices[ticker].push(price);
    if (lastPrices[ticker].length > 100) {
        lastPrices[ticker].shift();
    }

    // Update candlesticks for each interval
    for (const interval of CANDLE_INTERVALS) {
        const startTime = getIntervalStart(now, interval);
        
        const existingCandle = await prisma.candleStick.findFirst({
            where: {
                pair: ticker,
                interval,
                timestamp: {
                    gte: startTime,
                    lt: new Date(startTime.getTime() + getIntervalMilliseconds(interval)),
                },
            },
        });

        const prices = lastPrices[ticker];
        if (existingCandle) {
            await prisma.candleStick.update({
                where: { id: existingCandle.id },
                data: {
                    high: Math.max(existingCandle.high, price),
                    low: Math.min(existingCandle.low, price),
                    close: price,
                    volume: existingCandle.volume + 1,
                },
            });
        } else {
            await prisma.candleStick.create({
                data: {
                    pair: ticker,
                    timestamp: startTime,
                    open: prices.length > 0 ? prices[0] : price,
                    high: price,
                    low: price,
                    close: price,
                    volume: 1,
                    interval,
                },
            });
        }
    }
}

function getIntervalStart(date: Date, interval: string): Date {
    const d = new Date(date);
    switch (interval) {
        case '1m':
            d.setSeconds(0, 0);
            break;
        case '5m':
            d.setMinutes(Math.floor(d.getMinutes() / 5) * 5, 0, 0);
            break;
        case '15m':
            d.setMinutes(Math.floor(d.getMinutes() / 15) * 15, 0, 0);
            break;
        case '1h':
            d.setMinutes(0, 0, 0);
            break;
        default:
            d.setMinutes(0, 0, 0);
    }
    return d;
}

function getIntervalMilliseconds(interval: string): number {
    switch (interval) {
        case '1m': return 60 * 1000;
        case '5m': return 5 * 60 * 1000;
        case '15m': return 15 * 60 * 1000;
        case '1h': return 60 * 60 * 1000;
        default: return 60 * 1000;
    }
}