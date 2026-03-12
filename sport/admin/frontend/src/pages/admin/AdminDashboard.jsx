import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-blue-600">SportShop ADMIN</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4">Admin: {user && user.name}</span>
                            <button onClick={logout} className="text-red-600 hover:text-red-900">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                        </div>
                    </div>
                    {/* More admin stats/controls */}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
