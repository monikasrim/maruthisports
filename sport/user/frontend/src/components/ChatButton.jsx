import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const ChatButton = () => {
    const phoneNumber = "919000000000"; // Replace with actual business number
    const message = "Hi Maruthi Sports! I have a question about your gear.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 left-8 z-[60] group flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-full shadow-2xl hover:bg-slate-900 transition-all duration-500 hover:-translate-y-2"
        >
            <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white text-3xl shadow-lg ring-4 ring-white group-hover:ring-slate-900 transition-all">
                <FaWhatsapp />
            </div>
            <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white whitespace-nowrap pr-4">
                    Support Chat
                </span>
            </div>
        </a>
    );
};

export default ChatButton;
