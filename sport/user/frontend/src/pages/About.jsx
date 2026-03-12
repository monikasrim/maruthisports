import { Link } from 'react-router-dom';
import { FaUsers, FaTrophy, FaHistory, FaHeart, FaStar, FaShieldAlt } from 'react-icons/fa';

const About = () => {
    return (
        <div className="pt-20 bg-white min-h-screen font-sans text-slate-900">
            {/* Hero Section */}
            <section className="relative h-[65vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-50 bg-black z-10"></div>
                <img
                    src="https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Maruthi Elite Cricket Gear"
                />
                <div className="relative z-20 text-center space-y-6 max-w-4xl px-4">
                    <div className="inline-flex items-center space-x-2 bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                        <span>Established 2026</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">THE MARUTHI <br /> <span className="text-blue-500">LEGACY.</span></h1>
                    <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto font-serif italic">Forging the next generation of champions through elite gear and relentless passion.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.4em]">Our Core Mission</h2>
                            <h3 className="text-5xl font-black text-slate-950 tracking-tighter leading-tight italic uppercase">ENGINEERING <br /> PERFORMANCE.</h3>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed font-serif italic">
                            Founded in 2026, Maruthi Sports began with a single vision: to bridge the gap between amateur passion and professional excellence. We believe that equipment should never be a barrier to success.
                        </p>
                        <p className="text-slate-500 text-lg leading-relaxed font-medium">
                            Today, we are India's leading destination for high-performance sports gear, serving thousands of athletes across Cricket, Football, Running, and more. Our products are torture-tested by pros to ensure they never fail when it matters most.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-slate-950 text-blue-500 rounded-3xl shadow-xl"><FaUsers className="text-2xl" /></div>
                                <div>
                                    <p className="font-black text-3xl italic leading-none">10K+</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Athletes Served</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-slate-950 text-blue-500 rounded-3xl shadow-xl"><FaTrophy className="text-2xl" /></div>
                                <div>
                                    <p className="font-black text-3xl italic leading-none">500+</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pro Partners</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-blue-600 rotate-2 opacity-5 rounded-[4rem] group-hover:rotate-3 transition-transform"></div>
                        <img
                            src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            className="relative rounded-[4rem] shadow-2xl z-10 w-full h-[600px] object-cover focus:scale-105 transition-transform"
                            alt="Professional Football Engineering"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-slate-100 animate-float">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Pro Test Center</p>
                            <h4 className="font-bold text-slate-900 italic mt-1">Bangalore, IN</h4>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24 space-y-4">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter">THE MARUTHI <span className="text-blue-500">STANDARD</span></h3>
                        <p className="text-slate-500 font-medium uppercase text-xs tracking-[0.5em]">No Compromises. Ever.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-16">
                        {[
                            { title: 'PRO QUALITY', desc: 'We only stock gear that meets the rigorous demands of professional competition.', icon: <FaShieldAlt /> },
                            { title: 'ATHLETE DRIVEN', desc: 'Every product and feature is refined through direct feedback from elite players.', icon: <FaStar /> },
                            { title: 'ELITE SUPPORT', desc: 'Expert technical assistance for selecting the gear that fits your style.', icon: <FaHeart /> },
                        ].map((v, i) => (
                            <div key={i} className="text-center space-y-6 group">
                                <div className="text-5xl text-blue-500 flex justify-center group-hover:scale-110 transition-transform">{v.icon}</div>
                                <h4 className="text-xl font-black italic uppercase tracking-widest leading-none">{v.title}</h4>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
