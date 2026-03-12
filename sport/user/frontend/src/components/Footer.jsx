import { Link } from 'react-router-dom';
import {
    FaInstagram,
    FaTwitter,
    FaFacebookF,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaArrowRight,
} from 'react-icons/fa';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer style={{ background: 'linear-gradient(180deg, #0a1628 0%, #060d1a 100%)' }} className="text-white overflow-hidden relative">

            {/* Top decorative border */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #2563eb, #f97316, #2563eb)' }}></div>

            {/* Orange glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[180px] opacity-5 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[180px] opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand + About */}
                    <div className="space-y-5 lg:col-span-1">
                        <div className="flex items-center">
                            <img src={logo} alt="Maruthi Sports Logo" className="h-20 w-auto object-contain brightness-0 invert" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-blue-600 pl-4">
                            India's trusted destination for premium sports equipment. Gear up for greatness with authentic products from top brands.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3 pt-1">
                            {[
                                { icon: <FaInstagram />, href: '#', label: 'Instagram', color: 'hover:bg-pink-500 hover:border-pink-500' },
                                { icon: <FaFacebookF />, href: '#', label: 'Facebook', color: 'hover:bg-blue-500 hover:border-blue-500' },
                                { icon: <FaTwitter />, href: '#', label: 'Twitter', color: 'hover:bg-sky-400 hover:border-sky-400' },
                                { icon: <FaYoutube />, href: '#', label: 'YouTube', color: 'hover:bg-red-500 hover:border-red-500' },
                            ].map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    aria-label={s.label}
                                    className={`w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all text-sm ${s.color}`}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-5">
                        <h5 className="font-black text-xs uppercase tracking-[0.25em] text-orange-400">Quick Links</h5>
                        <ul className="space-y-3 text-slate-400 text-sm font-medium">
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'Shop All Products', to: '/shop' },
                                { label: 'Offers & Deals', to: '/shop' },
                                { label: 'About Us', to: '/about' },
                                { label: 'Contact', to: '/contact' },
                            ].map((l, i) => (
                                <li key={i}>
                                    <Link
                                        to={l.to}
                                        className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all group"
                                    >
                                        <FaArrowRight className="text-[8px] text-orange-400/50 group-hover:text-orange-400 transition-colors" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-5">
                        <h5 className="font-black text-xs uppercase tracking-[0.25em] text-orange-400">Categories</h5>
                        <ul className="space-y-3 text-slate-400 text-sm font-medium">
                            {[
                                { label: '🏏 Cricket', to: '/shop?category=Cricket' },
                                { label: '⚽ Football', to: '/shop?category=Football' },
                                { label: '🏋️ Fitness & Gym', to: '/shop?category=Fitness' },
                                { label: '🏸 Badminton', to: '/shop?category=Badminton' },
                                { label: '🎽 Accessories', to: '/shop?category=Accessories' },
                            ].map((c, i) => (
                                <li key={i}>
                                    <Link
                                        to={c.to}
                                        className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all"
                                    >
                                        {c.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-5">
                        <h5 className="font-black text-xs uppercase tracking-[0.25em] text-orange-400">Contact Us</h5>
                        <ul className="space-y-4 text-slate-400 text-sm font-medium">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-orange-400 mt-1 flex-shrink-0" />
                                <span>123 Sports Avenue, Bangalore, Karnataka - 560001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-orange-400 flex-shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-orange-400 flex-shrink-0" />
                                <a href="mailto:info@maruthisports.com" className="hover:text-white transition-colors">info@maruthisports.com</a>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="pt-2">
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Newsletter</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-l-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-500 transition-all placeholder:text-slate-700 text-white"
                                />
                                <button
                                    className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-3 rounded-r-xl font-black text-xs uppercase transition-colors"
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Divider */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-600 font-semibold uppercase tracking-widest">
                    <p>© 2026 Maruthi Sports Hub. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
                        <Link to="/contact" className="hover:text-slate-400 transition-colors">Privacy</Link>
                        <Link to="/contact" className="hover:text-slate-400 transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
