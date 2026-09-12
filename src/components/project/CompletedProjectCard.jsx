// src/components/project/CompletedProjectCard.jsx
import React from 'react';

export default function CompletedProjectCard({ project }) {
    const { id, data } = project;

    return (
        <a 
            href={`/live/${id}`} 
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 opacity-90 hover:opacity-100 grayscale-[20%] hover:grayscale-0"
        >
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={data.heroImage} 
                    alt={data.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy" 
                    decoding="async"      
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur text-gray-600 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                        Сдан
                    </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-white">
                    <svg className="w-4 h-4 text-marmol-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">{data.location}</span>
                </div>
            </div>

            {/* Нижняя часть: Инфо */}
            <div className="p-5 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 className="text-lg font-bold text-marmol-navy mb-1 group-hover:text-marmol-gold transition-colors">
                        {data.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        {data.tech === 'frame' ? 'Каркасная технология' : 'Блочная технология'}
                    </p>
                </div>
                
                {/* Стрелка перехода */}
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-marmol-navy group-hover:text-marmol-gold transition-all shrink-0">
                    <svg className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>
        </a>
    );
}