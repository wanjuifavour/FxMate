'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import io from 'socket.io-client';

const ApexChart = dynamic(() => import('react-apexcharts'), { 
    ssr: false,
    loading: () => <div>Loading Chart...</div>
});

interface PriceData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

interface PriceChartProps {
    pair: string;
    interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
    height?: number;
    loading?: boolean;
    chartData?: PriceData[];
    chartType?: 'candlestick' | 'line';
    setChartType: (type: 'candlestick' | 'line') => void;
    socket?: any;
}

// Add interface for Tiingo data format
interface TiingoUpdate {
    ticker: string;
    bidPrice: number;
    askPrice: number;
    midPrice: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
    pair,
    interval,
    height = 400,
    loading,
    chartData,
    chartType,
    setChartType,
    socket
}) => {
    // const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
    // // const [chartData, setChartData] = useState<PriceData[]>([]);
    // const [loading, setLoading] = useState(true);

    // Add client-side only check for rendering chart
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>;
    }

    // useEffect(() => {
    //     // if (!socket) {
    //     //     console.log('No socket connection');
    //     //     return;
    //     // }

    //     // console.log('Requesting historical data for:', pair, interval);
    //     // // Convert pair format from EUR/USD to eurusd for the backend
    //     // const formattedPair = pair.toLowerCase().replace('/', '');
        
    //     // socket.emit('getHistoricalData', { 
    //     //     pair: formattedPair, 
    //     //     interval 
    //     // });

    //     // socket.on('historicalData', (data: PriceData[]) => {
    //     //     console.log('Received historical data:', data);
    //     //     if (data && data.length > 0) {
    //     //         setChartData(data);
    //     //         setLoading(false);
    //     //     }
    //     // });

    //     return () => {
    //         socket.off('historicalData');
    //     };
    // }, [socket]);

    // Add debug render
    console.log('Rendering PriceChart with:', {
        loading,
        chartDataLength: chartData?.length,
        pair,
        interval
    });

    const getChartOptions = () => {
        const baseOptions = {
            chart: {
                type: chartType,
                height: height,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                    },
                },
                animations: {
                    enabled: true,
                },
            },
            title: {
                text: `${pair} Price Chart`,
                align: 'left' as const,
            },
            xaxis: {
                type: 'datetime' as const,
                labels: {
                    datetimeUTC: false,
                },
            },
            yaxis: {
                tooltip: {
                    enabled: true,
                },
                labels: {
                    formatter: (value: number) => value.toFixed(5),
                },
            },
            tooltip: {
                x: {
                    format: 'MMM dd HH:mm',
                },
            },
            grid: {
                borderColor: '#f1f1f1',
            },
            theme: {
                mode: 'light' as const,
            },
        };

        if (chartType === 'line') {
            return {
                ...baseOptions,
                stroke: {
                    curve: 'smooth' as const,
                    width: 2,
                },
                markers: {
                    size: 0,
                    hover: {
                        size: 5,
                    },
                },
            };
        }

        return baseOptions;
    };

    const getSeries = () => {
        if (!chartData) return [{ name: pair, data: [] }];

        if (chartType === 'line') {
            return [{
                name: pair,
                data: chartData.map(d => ([d.time, d.close])),
            }];
        }

        return [{
            name: pair,
            data: chartData.map(d => ({
                x: d.time,
                y: [d.open, d.high, d.low, d.close],
            })),
        }];
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            chartType === 'candlestick'
                                ? 'bg-blue-600 text-white'
                                : 'bg-background hover:bg-gray-200'
                        }`}
                        onClick={() => setChartType('candlestick')}
                    >
                        Candlestick
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            chartType === 'line'
                                ? 'bg-blue-600 text-white'
                                : 'bg-background hover:bg-gray-200'
                        }`}
                        onClick={() => setChartType('line')}
                    >
                        Line
                    </button>
                </div>
                <select
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
                    value={interval}
                    aria-label="Select time interval"
                    onChange={(e) => {
                        const newInterval = e.target.value as PriceChartProps['interval'];
                        if (socket && newInterval) {
                            socket.emit('getHistoricalData', { pair, interval: newInterval });
                        }
                    }}
                >
                    <option value="1m">1 Minute</option>
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                    <option value="1d">1 Day</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                    <div className="text-lg text-gray-500">Loading chart...</div>
                </div>
            ) : (
                <ApexChart
                    options={getChartOptions()}
                    series={getSeries()}
                    type={chartType}
                    height={height}
                />
            )}
        </div>
    );
};

export default PriceChart;