'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Bell, Settings, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCard } from '@/components/AlertCard';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { CurrencyPair, Alert } from '@/types/types';
import PriceChart from '@/components/PriceChart';
import io from 'socket.io-client';

const socket = io('http://localhost:8085', {
    auth: { token: localStorage.getItem('token') }
});

interface PriceData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

const Dashboard = () => {
    const router = useRouter();
    // const [socket, setSocket] = useState<any>(null);
    const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
    const [chartData, setChartData] = useState<PriceData[]>([]);
    const [interval, setInterval] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('1m');
    const [pairs, setPairs] = useState<Record<string, {
        bidPrice: number;
        askPrice: number;
        midPrice: number;
        isUp: boolean;
        change24h: number;
    }>>({});
    const [loading, setLoading] = useState(false);
    const [showAlertCard, setShowAlertCard] = useState(false);
    const [selectedPair, setSelectedPair] = useState('EUR/USD');
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [newAlert, setNewAlert] = useState<Alert>({ id: '', isActive: true, pair: selectedPair, condition: 'above', targetRate: 0 });

    useEffect(() => {
        // const token = localStorage.getItem('token');
        // if (!token) {
        //     router.push('/dashboard');
        //     return;
        // }

        

        socket.on('connect', () => {
            console.log('Socket connected');
            socket.emit('subscribePairs', ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF']);
        });

        socket.on('forexUpdate', (data) => {
            console.log('Received forex update:', data);
            setPairs(prevPairs => {
                const prevPairData = prevPairs[data.ticker];
                return {
                    ...prevPairs,
                    [data.ticker.toUpperCase()]: {
                        bidPrice: data.bidPrice,
                        askPrice: data.askPrice,
                        midPrice: data.midPrice,
                        isUp: prevPairData ? data.midPrice > prevPairData.midPrice : true,
                        change24h: prevPairData 
                            ? ((data.midPrice - prevPairData.midPrice) / prevPairData.midPrice) * 100 
                            : 0
                    }
                };
            });
            setLoading(false);
        });

        console.log('Requesting historical data for:', selectedPair, interval);
        // Convert pair format from EUR/USD to eurusd for the backend
        const formattedPair = selectedPair.toLowerCase().replace('/', '');
        
        socket.emit('getHistoricalData', { 
            pair: formattedPair, 
            interval 
        });

        socket.on('historicalData', (data: PriceData[]) => {
            console.log('Received historical data:', data);
            if (data && data.length > 0) {
                setChartData(data);
                setLoading(false);
            }
        });
        socket.on('connect_error', (error) => {
            console.error('Socket.IO error:', error);
            setLoading(false);
        });


        return () => {
            socket.close();
        };
    }, []);
    
    const handleCreateAlert = (newAlert: Alert) => {
        setAlerts([...alerts, newAlert]);
        setShowAlertCard(false);
    };

    const handleDeleteAlert = (id: string) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    };

    const handleToggleAlert = (id: string) => {
        setAlerts(alerts.map(alert => alert.id === id ? { ...alert, isActive: !alert.isActive } : alert));
    };

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation */}
            <nav className="bg-background border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-semibold">FxMate</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Bell className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
                            <Settings className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Quick Actions */}
                <div className="flex justify-between items-center mb-8">
                    <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search currency pairs..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowAlertCard(true)}>
                        Create Alert
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-500">Loading...</div>
                    </div>
                ) : (
                    <>
                        {/* Popular Pairs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {Object.entries(pairs).map(([ticker, data]) => (
                                <Card
                                    key={ticker}
                                    className="hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => {
                                        setSelectedPair(ticker);
                                        setNewAlert({ ...newAlert, pair: ticker });
                                    }}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{ticker}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-semibold">{data.midPrice.toFixed(4)}</span>
                                            <div className={`flex items-center ${data.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                                {data.isUp ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                                                <span className="ml-1">{Math.abs(data.change24h).toFixed(2)}%</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Price Chart - {selectedPair}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-96">
                                    <PriceChart pair={selectedPair} socket={socket} setChartType={setChartType} chartData={chartData} loading={loading} interval={interval} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Market Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* MarketOverview component will be rendered here */}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </main>

            {showAlertCard && (
                <AlertDialog open={showAlertCard} onOpenChange={setShowAlertCard}>
                <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Create Alert</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="my-4">
                            <AlertCard
                                alert={newAlert}
                                onCreateAlert={handleCreateAlert}
                                onDelete={handleDeleteAlert}
                                onToggle={handleToggleAlert}
                            />
                        </div>
                        <AlertDialogAction
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => setShowAlertCard(false)}
                        >
                            Close
                        </AlertDialogAction>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Render existing alerts */}
            {alerts.map(alert => (
                <AlertCard
                    key={alert.id}
                    alert={alert}
                    onDelete={handleDeleteAlert}
                    onToggle={handleToggleAlert}
                />
            ))}
        </div>
    );
};

export default Dashboard;