import { useState, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    FaHome,
    FaUsers,
    FaBoxOpen,
    FaClipboardList,
    FaChartLine,
    FaSignOutAlt,
    FaBars,
    FaTimes
} from 'react-icons/fa';

const AdminLayout = () => {
    const { logout, user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <FaChartLine /> },
        { path: '/users', name: 'Users', icon: <FaUsers /> },
        { path: '/products', name: 'Products', icon: <FaBoxOpen /> },
        { path: '/inventory', name: 'Inventory', icon: <FaClipboardList /> },
        { path: '/orders', name: 'Orders', icon: <FaClipboardList /> }, // Using similar icon for now, can be changed
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside
                className={`
                    ${isSidebarOpen ? 'w-64' : 'w-20'} 
                    bg-gradient-to-b from-red-900 to-slate-900 
                    text-white transition-all duration-300 ease-in-out 
                    flex flex-col shadow-2xl z-20
                `}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-white/10">
                    <h1 className={`font-bold text-xl tracking-wider transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>
                        ADMIN<span className="text-red-500">PANEL</span>
                    </h1>
                    {/* Mobile/Collapsed Logo Icon */}
                    {!isSidebarOpen && <span className="font-bold text-xl text-red-500">AP</span>}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 space-y-2 px-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                                    ${isActive
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                                title={!isSidebarOpen ? item.name : ''}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && 'opacity-0 w-0 overflow-hidden'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Logout - Bottom */}
                <div className="border-t border-white/10 p-4">
                    <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : 'justify-between'}`}>
                        <div className={`flex items-center ${!isSidebarOpen && 'hidden'}`}>
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-gray-400">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                            title="Logout"
                        >
                            <FaSignOutAlt className="text-xl" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors focus:outline-none"
                    >
                        {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>

                    <div className="flex items-center space-x-4">
                        {/* Add Search or Notifications here potentially */}
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                {/* Page Content Scrollable Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 relative">
                    <div className="relative z-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
