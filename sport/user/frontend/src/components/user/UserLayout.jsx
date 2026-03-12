import UserSidebar from './UserSidebar';

const UserLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    <UserSidebar />
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLayout;
