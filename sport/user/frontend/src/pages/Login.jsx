import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaShieldAlt, FaPaperPlane } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpLogin, setIsOtpLogin] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, setAuth } = useContext(AuthContext); // Assuming AuthContext provides setAuth or similar for manual token set
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isOtpLogin) {
                if (!otpSent) {
                    const { data } = await axios.post('http://localhost:5000/api/users/send-otp', { email });
                    setOtpSent(true);

                    if (data.message && data.message.includes("OTP generated for debugging:")) {
                        const match = data.message.match(/debugging: (\d{6})/);
                        if (match) {
                            setOtp(match[1]);
                        }
                    } else {
                        alert(data.message || 'OTP sent to your email!');
                    }
                } else {
                    const { data } = await axios.post('http://localhost:5000/api/users/verify-otp', { email, otp });
                    // Handle manual login since standard login context might only support password
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data));
                    if (setAuth) setAuth(data);
                    navigate('/');
                    window.location.reload(); // Quick fix to refresh context if setAuth isn't perfect
                }
            } else {
                await login(email, password);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md p-8 mx-4 space-y-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl relative z-10 transition-all duration-300 hover:shadow-blue-500/20">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        {otpSent ? 'Verify OTP' : isOtpLogin ? 'OTP Login' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-300">
                        {otpSent ? 'Enter the code sent to your email' : 'Sign in to access your sports gear'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaEnvelope className="text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                disabled={otpSent}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-3 pl-10 pr-4 text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 disabled:opacity-50"
                                placeholder="Email address"
                            />
                        </div>

                        {!isOtpLogin ? (
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full py-3 pl-10 pr-4 text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                                    placeholder="Password"
                                />
                            </div>
                        ) : (
                            otpSent && (
                                <div className="relative group animate-in slide-in-from-top duration-500">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaShieldAlt className="text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full py-3 pl-10 pr-4 text-gray-100 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                                        placeholder="6-Digit OTP"
                                        maxLength="6"
                                    />
                                    <p className="mt-2 text-[10px] text-amber-400 font-bold uppercase tracking-widest text-center animate-pulse">
                                        Tip: If email doesn't arrive, check your server console!
                                    </p>
                                </div>
                            )
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOtpLogin(!isOtpLogin);
                                setOtpSent(false);
                            }}
                            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {isOtpLogin ? 'Login with Password' : 'Login with OTP'}
                        </button>

                        {!isOtpLogin && (
                            <Link to="/forgot-password" name="forgot-password-link" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 font-bold tracking-wide flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : otpSent ? (
                            <>Verify & Login</>
                        ) : isOtpLogin ? (
                            <><FaPaperPlane className="text-xs" /> Send OTP</>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 text-gray-400 bg-gray-900 rounded-full">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center py-2.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg transition-all border border-gray-600/50 hover:border-gray-500"
                        >
                            <FaGoogle className="mr-2 text-red-500" /> Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center py-2.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg transition-all border border-gray-600/50 hover:border-gray-500"
                        >
                            <FaFacebook className="mr-2 text-blue-500" /> Facebook
                        </button>
                    </div>
                </form>

                <div className="text-center text-gray-400 mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
