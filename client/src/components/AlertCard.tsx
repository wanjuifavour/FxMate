import { Alert } from '../types/types';

interface AlertCardProps {
    alert: Alert;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onDelete, onToggle }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">{alert.pair}</h3>
                <button
                    onClick={() => onDelete(alert.id)}
                    className="text-red-600 hover:text-red-800"
                >
                    Delete
                </button>
            </div>
            <div className="mt-2">
                <p>Target: {alert.targetRate}</p>
                <p>Type: {alert.type}</p>
                <label className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        checked={alert.isActive}
                        onChange={() => onToggle(alert.id)}
                        className="mr-2"
                    />
                    Active
                </label>
            </div>
        </div>
    );
};