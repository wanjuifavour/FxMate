import { CurrencyPair } from '../types/types';

interface CurrencyPairCardProps {
    pair: CurrencyPair;
}

export const CurrencyPairCard: React.FC<CurrencyPairCardProps> = ({ pair }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{pair.base}/{pair.quote}</h3>
                <span className={`text-lg ${pair.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pair.rate.toFixed(4)}
                </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
                24h Change:
                <span className={pair.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {pair.change24h > 0 ? '+' : ''}{pair.change24h}%
                </span>
            </div>
        </div>
    );
};