import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="pt-20 bg-white min-h-screen">
            <section className="relative h-[40vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-40 bg-black z-10"></div>
                <img
                    src="https://images.pexels.com/photos/1554506/pexels-photo-1554506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Maruthi Pro Team"
                />
                <div className="relative z-20 text-center space-y-4 max-w-4xl px-4">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">JOIN THE <span className="text-blue-500">PRO SQUAD.</span></h2>
                    <p className="text-lg text-slate-300 font-medium max-w-2xl mx-auto font-serif italic">We're here to fuel your performance. Reach out for gear advice or support.</p>
                </div>
            </section>

            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-slate-50 p-8 rounded-[2rem] space-y-6">
                            <h4 className="text-xl font-black text-slate-950 italic">Contact Details</h4>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20"><FaPhone /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                                        <p className="font-bold text-slate-900">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-green-500/20"><FaWhatsapp /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</p>
                                        <p className="font-bold text-slate-900">Chat with Pro</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-red-500/20"><FaEnvelope /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                        <p className="font-bold text-slate-900">support@maruthisports.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-blue-600">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20 shadow-xl"><FaMapMarkerAlt /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visit Store</p>
                                        <p className="font-bold text-slate-900 text-xs">No.1, High School Road, Paramathi Velur, Namakkal-638182, Tamil Nadu</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-2xl shadow-slate-100 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold" placeholder="Arjun Singh" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                    <input type="email" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold" placeholder="arjun@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                                <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold">
                                    <option>Sales Inquiry</option>
                                    <option>Bulk Order</option>
                                    <option>Technical Support</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                                <textarea rows="6" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold" placeholder="How can we help you today?"></textarea>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-blue-600/30">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* Google Maps Integration */}
                <div className="mt-24 space-y-8 animate-fade-in-up">
                    <div className="text-center space-y-2">
                        <h3 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic">FIND OUR <span className="text-blue-600">HEADQUARTERS</span></h3>
                        <p className="text-slate-500 font-medium font-serif italic text-sm">Experience the gear in person at our Namakkal destination.</p>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] blur-3xl group-hover:bg-blue-600/10 transition-all duration-700"></div>
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white h-[500px] w-full">
                            <iframe
                                src="https://maps.google.com/maps?q=No.1,%20High%20School%20Road,%20Paramathi%20Velur,%20Namakkal-638182,%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Maruthi Sports Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
