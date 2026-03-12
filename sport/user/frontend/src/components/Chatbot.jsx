import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaCircle, FaBox } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to Maruthi Elite Support. I am your AI gear specialist. How can I help you dominate today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post('http://localhost:5000/api/chat', { message: userMsg.text }, config);

            const botResponse = {
                id: Date.now() + 1,
                text: data.message,
                sender: 'bot',
                extra: data.data
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "My neural link is currently unstable, likely due to peak performance traffic. Please try your query again in a moment.",
                sender: 'bot'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999] font-sans">
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-2xl transition-all duration-500 ${isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-blue-600 text-white shadow-blue-600/30'}`}
            >
                {isOpen ? <FaTimes /> : <FaComments />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
                    </span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_100px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg shadow-lg shadow-blue-600/20">
                                    <FaRobot />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase italic tracking-tighter text-sm">Pro-Elite Support</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <FaCircle className="text-[6px] text-green-400 animate-pulse" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Core Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
                            style={{ scrollbarWidth: 'thin' }}
                        >
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white shadow-lg shadow-blue-500/20'}`}>
                                            {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                                        </div>
                                        <div className="space-y-3 flex-1 min-w-0">
                                            <div className={`px-4 py-3 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 italic'}`}>
                                                {msg.text}
                                            </div>

                                            {/* AI Insight / Rich Data */}
                                            {msg.extra?.products && (
                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    {msg.extra.products.map(p => (
                                                        <Link to={`/product/${p.id}`} key={p.id} className="bg-white p-2 border border-slate-100 rounded-xl hover:shadow-lg transition-all group overflow-hidden">
                                                            <div className="aspect-square bg-slate-50 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                                                                <img src={p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                                            </div>
                                                            <p className="text-[9px] font-black uppercase tracking-tighter truncate text-slate-900">{p.name}</p>
                                                            <p className="text-[8px] font-bold text-blue-600">₹{p.price.toLocaleString()}</p>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            {msg.extra?.orders && (
                                                <div className="space-y-2 mt-2">
                                                    {msg.extra.orders.map(o => (
                                                        <Link to="/orders" key={o.id} className="block bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-all border border-white/10">
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-2">
                                                                    <FaBox className="text-blue-500 text-[10px]" />
                                                                    <span className="text-[9px] font-black uppercase tracking-widest">#{o.id.toString().slice(-6).toUpperCase()}</span>
                                                                </div>
                                                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full">{o.status === 'Pending' ? 'Order Placed' : o.status}</span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-50 px-4 py-3 rounded-2xl text-slate-400 flex gap-1">
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce delay-100">.</span>
                                        <span className="animate-bounce delay-200">.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your strategic query..."
                                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                                />
                                <button
                                    onClick={handleSend}
                                    className="w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                                >
                                    <FaPaperPlane className="text-sm" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
