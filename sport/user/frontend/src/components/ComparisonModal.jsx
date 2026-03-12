import React from 'react';
import { FaTimes, FaBalanceScale, FaTrash } from 'react-icons/fa';
import API_URL from '../api';

const ComparisonModal = ({ products, onRemove, onClose }) => {
    if (products.length === 0) return null;

    const getImageUrl = (image) => {
        if (!image) return 'https://placehold.co/600x600?text=No+Image';
        if (image.startsWith('http')) return image;
        return `${API_URL}${image.replace(/\\/g, '/')}`;
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            {/* Floating Toggle (Optional if you want to collapse) */}
            <div className="bg-slate-900 border border-white/20 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl w-[28rem] animate-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between mb-6">
                    <h5 className="text-white font-black uppercase italic tracking-wider flex items-center gap-3">
                        <FaBalanceScale className="text-blue-500" /> Comparison Deck ({products.length}/3)
                    </h5>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {products.map(p => (
                        <div key={p._id} className="relative group aspect-square rounded-2xl bg-white/5 p-2 overflow-hidden border border-white/10">
                            <img
                                src={getImageUrl(p.image)}
                                className="w-full h-full object-contain"
                                alt={p.name}
                            />
                            <button
                                onClick={() => onRemove(p._id)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                                <FaTrash className="text-[10px]" />
                            </button>
                        </div>
                    ))}
                    {[...Array(3 - products.length)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Empty Slot</span>
                        </div>
                    ))}
                </div>

                {products.length >= 2 ? (
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-blue-600/20 transform active:scale-95">
                        Compare Now
                    </button>
                ) : (
                    <p className="text-center text-slate-500 font-bold text-[10px] uppercase tracking-widest">Add 1 more to compare</p>
                )}
            </div>
        </div>
    );
};

export default ComparisonModal;
