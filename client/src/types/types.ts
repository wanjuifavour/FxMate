export interface CurrencyPair {
    base: string;
    quote: string;
    rate: number;
    change24h: number;
    isUp: boolean;
}

export interface Alert {
    id: string;
    pair: string;
    targetRate: number;
    type: 'above' | 'below';
    isActive: boolean;
}