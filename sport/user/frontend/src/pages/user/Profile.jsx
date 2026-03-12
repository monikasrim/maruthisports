// FIXED BY ANTIGRAVITY - User Dashboard Integration
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaSave, FaCamera } from 'react-icons/fa';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState(user?.city || '');
    const [state, setState] = useState(user?.state || '');
    const [postalCode, setPostalCode] = useState(user?.postalCode || '');
    const [country, setCountry] = useState(user?.country || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [image, setImage] = useState(user?.image || '');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAddress(user.address || '');
            setCity(user.city || '');
            setState(user.state || '');
            setPostalCode(user.postalCode || '');
            setCountry(user.country || '');
            setPhoneNumber(user.phoneNumber || '');
            setImage(user.image || '');
        }
    }, [user]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
            setImage(data);
            setUploading(false);
            toast.success('Image Uploaded');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Upload failed');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.put(
                'http://localhost:5000/api/users/profile',
                { name, email, password, image, address, city, state, postalCode, country, phoneNumber },
                config
            );

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            toast.success('Profile Updated Successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">
                    ATHLETE <span className="text-blue-600">PROFILE</span>
                </h2>
                <p className="text-slate-500 font-medium font-serif italic text-lg">Manage your performance identity and settings.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Left Column: Avatar & Summary */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm text-center space-y-6 relative overflow-hidden">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black uppercase shadow-2xl shadow-blue-600/30 overflow-hidden">
                                {image ? (
                                    <img src={`http://localhost:5000${image.replace(/\\/g, '/')}`} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0)
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 cursor-pointer">
                                <FaCamera />
                                <input type="file" className="hidden" onChange={uploadFileHandler} />
                            </label>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">{user?.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role} Member</p>
                        </div>
                        <div className="pt-6 border-t border-slate-50 flex justify-center gap-8">
                            <div className="text-center">
                                <p className="text-xl font-black text-blue-600 italic">2026</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Joined</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-black text-blue-600 italic">Pro</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full"></div>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Security Note</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Use a strong password to protect your order information and saved addresses.</p>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>
                    </div>
                </div>

                {/* Right Column: Profile Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm space-y-10">
                        <form onSubmit={submitHandler} className="space-y-8">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Full Name</label>
                                    <div className="relative group">
                                        <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Email Identity</label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="email"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="athlete@email.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-8 border-t border-slate-50">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Dispatch Coordinates</h4>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Shipping Address</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="123 Street, Lane"
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">City</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="City"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">State</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Postal Code</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                placeholder="Code"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Country</label>
                                            <input
                                                type="text"
                                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                placeholder="Country"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="Phone"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-8 border-t border-slate-50">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Security Credentials</h4>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">New Password</label>
                                        <div className="relative group">
                                            <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="password"
                                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Confirm Deployment</label>
                                        <div className="relative group">
                                            <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="password"
                                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-950 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 group"
                            >
                                {loading || uploading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <FaSave className="group-hover:scale-110 transition-transform" />
                                        <span>Update Profile</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
