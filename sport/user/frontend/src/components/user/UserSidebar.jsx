import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaHistory, FaHeart, FaThLarge, FaChevronRight } from 'react-icons/fa';

const UserSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', name: 'Overview', icon: FaThLarge },
        { path: '/profile', name: 'Identity', icon: FaUser },
        { path: '/orders', name: 'Orders', icon: FaHistory },
        { path: '/wishlist', name: 'Priority List', icon: FaHeart },
    ];

    return (
        <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
                <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 italic">Athlete Navigation</h3>
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between group p-4 rounded-2xl transition-all duration-300 ${isActive
                                        ? 'bg-blue-600 text-white translate-x-2'
                                        : 'hover:bg-white/5 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className={`text-sm ${isActive ? 'text-white' : 'text-blue-500 group-hover:text-blue-400'}`} />
                                        <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                                    </div>
                                    <FaChevronRight className={`text-[8px] transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Support Rank</h4>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 font-black text-xs">GOLD</div>
                        <div className="flex-1 space-y-1">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 w-3/4"></div>
                            </div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Elite Member Tier</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default UserSidebar;
