import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            alert(`Registration failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-rose-950 to-black relative overflow-hidden">
            {/* Background Decorative Elements - Different colors for Admin to distinguish */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md p-8 mx-4 space-y-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl relative z-10 transition-all duration-300 hover:shadow-red-500/20">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
                        Admin Registration
                    </h2>
                    <p className="text-gray-300">Create an administrator account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaUser className="text-gray-400 group-focus-within:text-red-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full py-3 pl-10 pr-4 text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaEnvelope className="text-gray-400 group-focus-within:text-red-400 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                className="w-full py-3 pl-10 pr-4 text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaLock className="text-gray-400 group-focus-within:text-red-400 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full py-3 pl-10 pr-4 text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaLock className="text-gray-400 group-focus-within:text-red-400 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                required
                                className="w-full py-3 pl-10 pr-4 text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white transition-all duration-200 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5 font-bold tracking-wide"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                </form>

                <div className="text-center text-gray-400 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-red-400 hover:text-red-300 transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
