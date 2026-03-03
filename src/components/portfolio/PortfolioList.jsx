// src/components/portfolio/PortfolioList.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioList({ items }) {
  const [filter, setFilter] = useState('all');

  // Категории (проверь, чтобы совпадали с твоими technology в md-файлах)
  const filters = [
    { key: 'all', label: 'Все проекты' },
    { key: 'block', label: 'Каменные дома' },
    { key: 'frame', label: 'Каркасные дома' },
  ];

  // Логика фильтрации
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.data.technology === filter;
  });

  return (
    <div>
      
      {/* 1. ПАНЕЛЬ ФИЛЬТРОВ */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12 justify-start">
        {filters.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className="relative pb-2 text-sm font-bold uppercase tracking-widest transition-colors group"
          >
            <span className={`${filter === btn.key ? 'text-marmol-navy' : 'text-gray-400 group-hover:text-marmol-navy'}`}>
                {btn.label}
            </span>
            {filter === btn.key && (
              <motion.div 
                layoutId="activeTab"
                className="absolute left-0 bottom-0 w-full h-0.5 bg-marmol-gold"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 2. СЕТКА ПРОЕКТОВ */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-24"
      >
        <AnimatePresence mode='popLayout'>
          {filteredItems.map((item, i) => {
            const data = item.data;
            
            return (
              <motion.a
                layout
                // ВАЖНО: Используем item.id, так как в [slug].astro пути строятся на основе ID
                key={item.id} 
                href={`/portfolio/${item.id}`}
                
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                
                className="group block w-full cursor-pointer"
              >
                {/* КОНТЕЙНЕР КАРТИНКИ */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-8 rounded-sm">
                    <img 
                        src={data.mainImage} 
                        alt={data.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                    
                    {/* Оверлей */}
                    <div className="absolute inset-0 bg-marmol-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Кнопка "Смотреть" */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl z-10">
                         <svg className="w-6 h-6 text-marmol-navy ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>

                    {/* Технические бейджи */}
                    <div className="absolute top-6 left-6 flex gap-2">
                        <span className="bg-white/90 backdrop-blur text-marmol-navy text-[10px] font-bold uppercase px-3 py-1 rounded-sm shadow-sm">
                            {data.specs.area} м²
                        </span>
                        {data.status === 'in_progress' && (
                             <span className="bg-marmol-gold text-marmol-navy text-[10px] font-bold uppercase px-3 py-1 rounded-sm shadow-sm">
                                Строится
                             </span>
                        )}
                    </div>
                </div>

                {/* ОПИСАНИЕ */}
                <div className="flex justify-between items-start border-t border-gray-200 pt-5 group-hover:border-marmol-gold transition-colors duration-500">
                    <div className="max-w-md">
                        <h3 className="text-2xl md:text-3xl font-bold text-marmol-navy mb-2 group-hover:text-marmol-gold transition-colors">
                            {data.title}
                        </h3>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                             <svg className="w-4 h-4 text-marmol-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                             {data.specs.location}
                        </p>
                    </div>
                    
                    <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Год</span>
                        <span className="text-lg font-bold text-marmol-navy">{data.specs.year}</span>
                    </div>
                </div>

              </motion.a>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* ПУСТОЕ СОСТОЯНИЕ */}
      {filteredItems.length === 0 && (
          <div className="py-32 text-center border-t border-b border-dashed border-gray-200">
              <p className="text-gray-400 mb-4">В данной категории пока нет опубликованных проектов.</p>
              <button onClick={() => setFilter('all')} className="text-marmol-navy font-bold uppercase text-xs border-b border-marmol-navy pb-1 hover:text-marmol-gold hover:border-marmol-gold transition-colors">
                  Показать все проекты
              </button>
          </div>
      )}

    </div>
  );
}