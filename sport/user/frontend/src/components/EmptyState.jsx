import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaShoppingCart, FaHeart, FaHistory } from 'react-icons/fa';

const EmptyState = ({ type, title, message, actionText, actionLink }) => {
    const icons = {
        products: <FaBoxOpen className="text-6xl text-slate-200 mb-6" />,
        cart: <FaShoppingCart className="text-6xl text-slate-200 mb-6" />,
        wishlist: <FaHeart className="text-6xl text-slate-200 mb-6" />,
        orders: <FaHistory className="text-6xl text-slate-200 mb-6" />,
    };

    return (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center animate-in fade-in zoom-in duration-700">
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full"></div>
                {icons[type] || icons.products}
            </div>

            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-slate-900">
                {title}
            </h3>
            <p className="text-slate-400 font-medium text-lg max-w-md mx-auto mb-10">
                {message}
            </p>

            {actionText && actionLink && (
                <Link
                    to={actionLink}
                    className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0"
                >
                    {actionText}
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
