import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const UserHome = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">SportShop</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4">Welcome, {user && user.name}</span>
                            <button onClick={logout} className="text-red-600 hover:text-red-900">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <h2 className="text-2xl text-gray-500">Welcome to the Sport Shop!</h2>
                        {/* Product list would go here */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserHome;
