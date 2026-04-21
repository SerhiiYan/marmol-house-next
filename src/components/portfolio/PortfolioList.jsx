// src/components/portfolio/PortfolioList.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioList({ items }) {
  // Состояние активного фильтра
  const [filter, setFilter] = useState('all');
  
  // Состояние: сколько проектов показываем на экране
  const [visibleCount, setVisibleCount] = useState(4); // Изначально показываем 4 проекта
  const itemsPerPage = 4; // Сколько добавлять при клике на "Показать еще"

  // Категории
  const filters = [
    { key: 'all', label: 'Все проекты' },
    { key: 'block', label: 'Каменные дома' },
    { key: 'frame', label: 'Каркасные дома' },
    { key: 'reconstruction', label: 'Реконструкция' }
  ];

  const techLabels = {
    'block': 'Каменный дом',
    'frame': 'Каркасный дом',
    'reconstruction': 'Реконструкция',
    'brick': 'Кирпичный дом'
  };

  // 1. Сначала фильтруем массив по категории
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.data.technology === filter;
  });

  // 2. Затем "обрезаем" отфильтрованный массив до нужного количества
  const paginatedItems = filteredItems.slice(0, visibleCount);

  // Проверяем, есть ли еще проекты для показа
  const hasMore = visibleCount < filteredItems.length;

  // Функция переключения фильтров
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setVisibleCount(itemsPerPage); // Сбрасываем счетчик при смене вкладки
  };

  // Функция для кнопки "Показать еще"
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + itemsPerPage);
  };

  return (
    <div>
      
      {/* 1. ПАНЕЛЬ ФИЛЬТРОВ */}
      <div className="flex flex-wrap gap-x-10 gap-y-6 mb-20 justify-center md:justify-start border-b border-gray-200">
        {filters.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleFilterChange(btn.key)}
            className="relative pb-4 text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] transition-colors group"
          >
            <span className={`${filter === btn.key ? 'text-marmol-navy' : 'text-gray-400 group-hover:text-marmol-navy'}`}>
                {btn.label}
            </span>
            {filter === btn.key && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute left-0 bottom-[-1px] w-full h-[2px] bg-marmol-gold"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 2. СПИСОК ПРОЕКТОВ (Журнальная верстка) */}
      <motion.div layout className="flex flex-col gap-24 md:gap-32 mb-20">
        <AnimatePresence mode='popLayout'>
          {paginatedItems.map((item, i) => {
            const data = item.data;
            const isReverse = i % 2 !== 0;
            
            return (
              <motion.a
                layout
                key={item.id} 
                href={`/portfolio/${item.id}`}
                
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                
                className={`group flex flex-col ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 lg:gap-24 items-center w-full cursor-pointer`}
              >
                
                {/* === ЛЕВАЯ ЧАСТЬ: ИЗОБРАЖЕНИЕ === */}
                <div className="w-full md:w-[60%] lg:w-[65%] relative overflow-hidden bg-gray-100 aspect-[4/3] md:aspect-[16/10]">
                    <img 
                        src={data.mainImage} 
                        alt={data.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-marmol-navy/0 group-hover:bg-marmol-navy/10 transition-colors duration-700"></div>

                    {data.status === 'in_progress' && (
                        <div className="absolute top-6 left-6 bg-marmol-gold text-marmol-navy text-[10px] font-bold uppercase tracking-widest px-4 py-2 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            В процессе
                        </div>
                    )}
                </div>

                {/* === ПРАВАЯ ЧАСТЬ: ТЕКСТОВЫЙ БЛОК === */}
                <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-marmol-gold mb-6">
                        <span>{data.specs.year}</span>
                        <span className="w-10 h-[1px] bg-gray-300"></span>
                        <span className="text-gray-400">{techLabels[data.technology] || 'Проект'}</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-marmol-navy mb-8 leading-tight group-hover:text-marmol-gold transition-colors duration-500">
                        {data.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-gray-200 pt-8 mb-10">
                        <div>
                            <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Локация</span>
                            <span className="text-sm md:text-base font-medium text-marmol-navy">{data.specs.location}</span>
                        </div>
                        <div>
                            <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Площадь</span>
                            <span className="text-sm md:text-base font-medium text-marmol-navy">{data.specs.area} м²</span>
                        </div>
                    </div>

                    <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-marmol-navy group-hover:text-marmol-gold transition-colors mt-auto md:mt-0">
                        Смотреть проект
                        <svg className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
              </motion.a>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* 3. КНОПКА "ПОКАЗАТЬ ЕЩЕ" */}
      {hasMore && (
        <div className="flex justify-center mt-12 mb-10">
          <button 
            onClick={handleLoadMore}
            className="group flex flex-col items-center gap-3 cursor-pointer"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-marmol-navy transition-colors">
              Показать еще работы
            </span>
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-marmol-gold group-hover:bg-marmol-gold transition-all duration-300">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* ПУСТОЕ СОСТОЯНИЕ */}
      {filteredItems.length === 0 && (
          <div className="py-32 text-center border border-dashed border-gray-200 bg-white">
              <p className="text-gray-400 mb-6 font-light">В данной категории пока нет опубликованных проектов.</p>
              <button onClick={() => handleFilterChange('all')} className="text-marmol-navy font-bold uppercase tracking-widest text-xs border-b border-marmol-navy pb-1 hover:text-marmol-gold hover:border-marmol-gold transition-colors">
                  Показать все работы
              </button>
          </div>
      )}

    </div>
  );
}