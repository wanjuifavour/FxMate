import { Alert } from '../../../shared/types/types';
import { useState as useReactState } from 'react';

interface AlertCardProps {
    alert: Alert;
    onCreateAlert?: (newAlert: Alert) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onCreateAlert, onDelete, onToggle }) => {
    const [newAlert, setNewAlert] = useState<Alert>(alert);

    const handleChange = (field: keyof Alert, value: any) => {
        setNewAlert({ ...newAlert, [field]: value });
    };

    const handleSubmit = () => {
        if (onCreateAlert) {
            onCreateAlert(newAlert);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Alert for {newAlert.pair}</h3>
                <button
                    onClick={() => onDelete(newAlert.id)}
                    className="text-red-600 hover:text-red-800"
                >
                    Delete
                </button>
            </div>
            <div className="mt-2">
                <div className="flex items-center">
                    <span className="mr-2">Condition:</span>
                    <select
                        aria-label="Condition"
                        value={newAlert.condition}
                        onChange={(e) => handleChange('condition', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="above">Above</option>
                        <option value="below">Below</option>
                    </select>
                </div>
                <div className="flex items-center mt-2">
                    <span className="mr-2">Target Rate:</span>
                    <input
                        type="number"
                        value={newAlert.targetRate}
                        onChange={(e) => handleChange('targetRate', parseFloat(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter target rate"
                    />
                </div>
                <label className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        checked={newAlert.isActive}
                        onChange={() => handleChange('isActive', !newAlert.isActive)}
                        className="mr-2"
                    />
                    Active
                </label>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

function useState<T>(alert: Alert): [any, any] {
    throw new Error('Function not implemented.');
}