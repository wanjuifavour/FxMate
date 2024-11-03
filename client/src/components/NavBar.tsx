import Link from 'next/link';

export const NavBar: React.FC = () => {
    return (
        <nav className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl font-bold">
                        FxMate
                    </Link>
                    <div className="flex space-x-4">
                        <Link href="/" className="hover:text-blue-200">
                            Home
                        </Link>
                        <Link href="/dashboard" className="hover:text-blue-200">
                            Dashboard
                        </Link>
                        <Link href="/alerts" className="hover:text-blue-200">
                            Alerts
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};