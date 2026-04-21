import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiaryList({ items }) {
  const [visibleCount, setVisibleCount] = useState(7); // Главный пост + 6 в плитке
  const itemsPerPage = 6;

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-400 font-light text-lg">Хроника формируется. Скоро здесь появятся фотографии.</p>
      </div>
    );
  }

  const paginatedItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const featuredPost = paginatedItems[0];
  const gridPosts = paginatedItems.slice(1);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* === 1. ГЛАВНЫЙ ПОСТ (HERO ENTRY) === */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="group relative mb-16 md:mb-24 cursor-pointer"
      >
        {/* КОНТЕЙНЕР БЛОКА: На мобилках - колонка (Текст вниз), на ПК - относительный (Текст поверх) */}
        <div className="relative md:rounded-2xl md:overflow-hidden bg-white md:bg-gray-100 shadow-sm flex flex-col md:block">
          
          {/* Фотография: Сверху на мобилках */}
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-none">
            {featuredPost.image && (
              <img
                loading="lazy" 
                src={featuredPost.image} 
                alt="Свежее со стройки" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
            )}
            {/* Градиентное затемнение: Только для ПК, на мобилках оно не нужно */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-marmol-navy/80 via-marmol-navy/20 to-transparent transition-opacity duration-500"></div>
            
            {/* Пульсирующий бейдж: Оставляем поверх картинки всегда */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-marmol-gold text-marmol-navy text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm shadow-md">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Последнее обновление
            </div>
          </div>

          {/* ТЕКСТОВЫЙ БЛОК ГЛАВНОГО ПОСТА: */}
          {/* На мобилках: md:absolute -> text-block, text-white -> text-marmol-navy */}
          <div className="w-full p-6 pb-2 md:p-12 text-marmol-navy md:text-white md:absolute md:bottom-0 md:left-0 md:bg-transparent">
            
            {/* Мета-данные: На мобилках цвет text-gray-400, на ПК text-gray-300 */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-gray-400 md:text-gray-300 border-b border-gray-100 md:border-none pb-4 md:pb-0">
              <span>{featuredPost.date}</span>
              <span className="w-6 h-[1px] bg-gray-300 md:bg-marmol-gold"></span>
              <span className="flex items-center gap-1.5 text-marmol-gold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {featuredPost.location}
              </span>
            </div>

            {/* Описание: На мобилках шрифт text-base, на ПК - крупнее */}
            <p className="text-base md:text-xl lg:text-3x1 font-light leading-relaxed max-w-3x1">
              {featuredPost.text}
            </p>
          </div>

        </div>
      </motion.div>

      {/* === 2. ПЛИТКА (MASONRY GRID) === */}
      <div className="columns-1 md:columns-2 gap-8 md:gap-12">
        <AnimatePresence>
          {gridPosts.map((entry, index) => (
            <motion.div 
              layout
              key={entry.id || index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
              className="break-inside-avoid mb-8 md:mb-12 group cursor-pointer"
            >
              <div className="flex flex-col gap-4">
                {entry.image && (
                  <div className="relative overflow-hidden rounded-xl bg-gray-100">
                    <img 
                      src={entry.image} 
                      alt={`Хроника ${entry.date}`} 
                      className="w-full h-auto object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-marmol-navy/0 group-hover:bg-marmol-navy/10 transition-colors duration-500"></div>
                  </div>
                )}
                <div className="pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-marmol-gold">
                      {entry.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-marmol-navy transition-colors">
                      {entry.location}
                    </span>
                  </div>
                  <p className="text-gray-600 font-light leading-relaxed text-sm md:text-base group-hover:text-marmol-navy transition-colors duration-300">
                    {entry.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* === 3. КНОПКА ЗАГРУЗКИ === */}
      {hasMore && (
        <div className="flex justify-center mt-16 border-t border-gray-200 pt-16">
          <button 
            onClick={handleLoadMore}
            className="group flex flex-col items-center gap-4 cursor-pointer"
          >
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 group-hover:text-marmol-navy transition-colors">
              Показать более ранние записи
            </span>
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-marmol-gold group-hover:bg-marmol-gold transition-all duration-300 shadow-sm">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </button>
        </div>
      )}

    </div>
  );
}