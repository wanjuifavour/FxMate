"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, Bell, Settings, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CurrencyPair } from '../../types/types';

const Dashboard = () => {
    const [pairs, setPairs] = useState<CurrencyPair[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPair, setSelectedPair] = useState('EUR/USD');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/forex/pairs');
                const data = await response.json();
                setPairs(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Sample data if API is non existent/fails
                setPairs([
                    { base: 'EUR', quote: 'USD', rate: 1.0865, change24h: 0.05, isUp: true },
                    { base: 'GBP', quote: 'USD', rate: 1.2634, change24h: -0.12, isUp: false },
                    { base: 'USD', quote: 'JPY', rate: 148.05, change24h: 0.28, isUp: true },
                    { base: 'USD', quote: 'CHF', rate: 0.8845, change24h: -0.03, isUp: false },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

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
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
                            {pairs.map((pair) => (
                                <Card
                                    key={`${pair.base}${pair.quote}`}
                                    className="hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => setSelectedPair(`${pair.base}/${pair.quote}`)}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{`${pair.base}/${pair.quote}`}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-semibold">{pair.rate}</span>
                                            <div className={`flex items-center ${pair.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                                {pair.isUp ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                                                <span className="ml-1">{Math.abs(pair.change24h)}%</span>
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
                                    {/* PriceChart component will be rendered here */}
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
        </div>
    );
};

export default Dashboard;