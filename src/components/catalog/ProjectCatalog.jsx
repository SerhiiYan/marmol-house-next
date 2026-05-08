// src/components/catalog/ProjectCatalog.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { globalPricing } from '../../data/pricingConfig';

const formatPrice = (p) => p.toLocaleString('ru-RU');

export default function ProjectCatalog({ allProjects }) {
  
  // СОСТОЯНИЕ
  const [activeCategory, setActiveCategory] = useState('Все');
  const [activeTech, setActiveTech] = useState('all');
  const [activeArea, setActiveArea] = useState('all');
  const [activeRooms, setActiveRooms] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  // ИНИЦИАЛИЗАЦИЯ ИЗ URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) setActiveCategory(params.get('category'));
    if (params.get('tech')) setActiveTech(params.get('tech'));
    if (params.get('area')) setActiveArea(params.get('area'));
    if (params.get('rooms')) setActiveRooms(params.get('rooms'));
  }, []);

  // ЗАПИСЬ В URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== 'Все') params.set('category', activeCategory);
    if (activeTech !== 'all') params.set('tech', activeTech);
    if (activeArea !== 'all') params.set('area', activeArea);
    if (activeRooms !== 'all') params.set('rooms', activeRooms);
    
    const queryString = params.toString();
    const newUrl = queryString 
        ? `${window.location.pathname}?${queryString}` 
        : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [activeCategory, activeTech, activeArea, activeRooms]);

  // === ИСПРАВЛЕНИЕ СКРОЛЛА НА МОБИЛЬНЫХ ===
  useEffect(() => {
    if (isFilterModalOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    // Очистка при размонтировании компонента (важно для SPA!)
    return () => { document.body.style.overflow = ''; };
  }, [isFilterModalOpen]);


  // ДИНАМИЧЕСКИЕ КАТЕГОРИИ
  const categories = useMemo(() => {
    const cats = new Set(['Все']);
    allProjects.forEach(p => {
        const map = { 
            'house': 'Дома', 
            'bath': 'Бани', 
            'a-frame': 'A-Frame', 
            'commercial': 'Коммерция',
            'barnhouse': 'Barnhouse',
            'cottage': 'Дачи'
        };
        cats.add(map[p.data.category] || p.data.category);
    });
    return Array.from(cats).sort((a, b) => {
        if(a === 'Все') return -1;
        if(b === 'Все') return 1;
        return 0;
    });
  }, [allProjects]);

  // ФИЛЬТРАЦИЯ
  const filteredProjects = allProjects.filter(project => {
    const data = project.data;
    const map = { 'bath': 'Бани', 'a-frame': 'A-Frame', 'commercial': 'Коммерция', 'barnhouse': 'Barnhouse', 'cottage': 'Дачи', 'house': 'Дома' };
    const currentCatName = map[data.category] || data.category;

    if (activeCategory !== 'Все' && currentCatName !== activeCategory) return false;
    if (searchQuery.trim() !== '') {
        const titleMatch = data.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (!titleMatch) return false;
    }
    if (activeTech !== 'all' && !data.availableTech.includes(activeTech)) return false;

    if (activeArea !== 'all') {
        const area = data.area;
        if (activeArea === 'small' && area >= 100) return false;
        if (activeArea === 'medium' && (area < 100 || area > 150)) return false;
        if (activeArea === 'large' && area <= 150) return false;
    }

    if (activeRooms !== 'all') {
        const bedrooms = data.specs?.bedrooms || 1; 
        const filterRooms = parseInt(activeRooms);
        if (activeRooms === '4+' && bedrooms < 4) return false;
        if (activeRooms !== '4+' && bedrooms !== filterRooms) return false;
    }
    return true;
  });

  const sortedProjects = filteredProjects.sort((a, b) => a.data.order - b.data.order);
  const visibleProjects = sortedProjects.slice(0, visibleCount);

  // --- ХЕЛПЕР: СОВРЕМЕННЫЕ ЭЛЕМЕНТЫ УПРАВЛЕНИЯ ФИЛЬТРАМИ ---
  const renderFilterControls = (mobileMode = false) => (
    <div className={`flex flex-col w-full ${mobileMode ? 'gap-8' : ''}`}>
        
        {/* === ОСНОВНАЯ ПАНЕЛЬ ФИЛЬТРОВ (РЕДИЗАЙН) === */}
        <div className={`flex ${mobileMode ? 'flex-col gap-6' : 'flex-row items-center bg-white py-1.5 px-2 rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100'}`}>
            
            {/* 1. ПОЛЕ ПОИСКА */}
            <div className={`relative flex items-center ${mobileMode ? 'w-full' : 'flex-1 min-w-[200px] border-r border-gray-100 pr-2 h-[42px]'}`}>
                <svg className="w-4 h-4 text-gray-400 absolute left-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="text" 
                    placeholder="Название проекта..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`text-sm w-full outline-none bg-transparent pl-10 pr-8 py-2 font-medium placeholder-gray-400 ${mobileMode ? 'bg-gray-50 border border-gray-100 rounded-xl focus:border-marmol-gold focus:ring-1 focus:ring-marmol-gold h-12' : ''}`}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 text-gray-400 hover:text-marmol-navy transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>

            {/* КОНТЕЙНЕР ДЛЯ ГРУПП (iOS style segmented controls) */}
            <div className={`flex ${mobileMode ? 'flex-col gap-6' : 'flex-row items-center gap-2 pl-2'}`}>
                
                {/* Группа 1: Технология */}
                <div className={`flex flex-col items-start gap-2 ${mobileMode ? 'w-full' : ''}`}>
                    {mobileMode && <span className="text-xs uppercase font-bold text-marmol-navy tracking-wider">Технология</span>}
                    <div className="flex bg-gray-50/80 p-1 rounded-full w-full md:w-auto border border-gray-100/50">
                        {['all', 'frame', 'block'].map(tech => (
                            <button
                                key={tech}
                                onClick={() => setActiveTech(tech)}
                                className={`text-[11px] font-bold uppercase tracking-wider px-3 md:px-4 py-1.5 rounded-full transition-all duration-300 ${
                                    activeTech === tech 
                                    ? 'bg-white text-marmol-navy shadow-sm' 
                                    : 'text-gray-400 hover:text-marmol-navy'
                                } ${mobileMode ? 'flex-1 text-center' : ''}`}
                            >
                                {{ all: 'Любая', frame: 'Каркас', block: 'Блок' }[tech]}
                            </button>
                        ))}
                    </div>
                </div>

                {!mobileMode && <div className="h-6 w-px bg-gray-200 mx-1"></div>}

                {/* Группа 2: Площадь */}
                <div className={`flex flex-col items-start gap-2 ${mobileMode ? 'w-full' : ''}`}>
                    {mobileMode && <span className="text-xs uppercase font-bold text-marmol-navy tracking-wider">Площадь (м²)</span>}
                    <div className="flex bg-gray-50/80 p-1 rounded-full w-full md:w-auto border border-gray-100/50">
                        {[
                            { val: 'all', label: 'Все' },
                            { val: 'small', label: '<100' },
                            { val: 'medium', label: '100-150' },
                            { val: 'large', label: '>150' }
                        ].map(opt => (
                            <button
                                key={opt.val}
                                onClick={() => setActiveArea(opt.val)}
                                className={`text-[11px] font-bold uppercase tracking-wider px-3 md:px-4 py-1.5 rounded-full transition-all duration-300 ${
                                    activeArea === opt.val ? 'bg-white text-marmol-navy shadow-sm' : 'text-gray-400 hover:text-marmol-navy'
                                } ${mobileMode ? 'flex-1 text-center' : ''}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {!mobileMode && <div className="h-6 w-px bg-gray-200 mx-1"></div>}

                {/* Группа 3: Спальни */}
                 <div className={`flex flex-col items-start gap-2 ${mobileMode ? 'w-full' : ''}`}>
                    {mobileMode && <span className="text-xs uppercase font-bold text-marmol-navy tracking-wider">Спальни</span>}
                    <div className="flex bg-gray-50/80 p-1 rounded-full w-full md:w-auto border border-gray-100/50">
                        {['all', '2', '3', '4+'].map(room => (
                            <button
                                key={room}
                                onClick={() => setActiveRooms(room)}
                                className={`text-[11px] font-bold uppercase tracking-wider px-3 md:px-4 py-1.5 rounded-full transition-all duration-300 ${
                                    activeRooms === room ? 'bg-white text-marmol-navy shadow-sm' : 'text-gray-400 hover:text-marmol-navy'
                                } ${mobileMode ? 'flex-1 text-center' : ''}`}
                            >
                                {room === 'all' ? 'Любое' : room}
                            </button>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  );

  const activeFilterTags = [];
  if (searchQuery.trim() !== '') activeFilterTags.push({ label: `Поиск: ${searchQuery}`, clear: () => setSearchQuery('') });
  if (activeTech !== 'all') activeFilterTags.push({ label: { frame: 'Каркас', block: 'Блок' }[activeTech], clear: () => setActiveTech('all') });
  if (activeArea !== 'all') activeFilterTags.push({ label: { small: '< 100 м²', medium: '100-150 м²', large: '> 150 м²' }[activeArea], clear: () => setActiveArea('all') });
  if (activeRooms !== 'all') activeFilterTags.push({ label: `${activeRooms} сп.`, clear: () => setActiveRooms('all') });

  const handleClearAllFilters = () => {
      setSearchQuery(''); setActiveTech('all'); setActiveArea('all'); setActiveRooms('all');
  };

  return (
    <div>
      
      {/* --- ПАНЕЛЬ (Sticky) --- */}
      <div className="sticky top-24 z-30 bg-gray-50/95 backdrop-blur-md pt-4 pb-2 border-b border-gray-200 transition-all">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4">
                
                <div className="relative flex items-center w-full justify-between">
                    
                    {/* ТАБЫ (Все, Дома, A-frame...) */}
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 scrollbar-hide no-scrollbar w-full md:w-auto pr-14 md:pr-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setVisibleCount(12); }}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${
                                    activeCategory === cat 
                                    ? 'bg-marmol-navy text-white shadow-md' 
                                    : 'bg-white text-gray-500 border border-gray-200 hover:border-marmol-gold hover:text-marmol-navy'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* МОБИЛЬНАЯ КНОПКА "ФИЛЬТРЫ" (Modern Design) */}
                    <div className="absolute right-0 top-0 h-full flex items-start md:items-center md:hidden bg-gradient-to-l from-gray-50 via-gray-50 to-transparent pl-4">
                        <button 
                            onClick={() => setFilterModalOpen(true)}
                            className="relative flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-marmol-navy active:scale-95 transition-transform z-10"
                        >
                            {/* Показываем красную точку, если активны фильтры */}
                            {activeFilterTags.length > 0 && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-marmol-gold rounded-full border-2 border-white"></span>
                            )}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                        </button>
                    </div>

                </div>

                {/* ДЕСКТОПНЫЕ ФИЛЬТРЫ */}
                <div className="hidden md:block">
                    {renderFilterControls(false)}
                </div>

            </div>
        </div>
      </div>

      {/* --- МОБИЛЬНАЯ ШТОРКА (MODAL) --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
            {/* Backdrop с обработчиком клика */}
            <div className="absolute inset-0 bg-marmol-navy/40 backdrop-blur-sm transition-opacity" onClick={() => setFilterModalOpen(false)}></div>
            
            {/* Шторка */}
            <div className="relative bg-white w-full rounded-t-3xl p-6 pb-8 shadow-2xl max-h-[90vh] overflow-y-auto transform transition-transform animate-slide-up">
                
                {/* Декоративная ручка для свайпа */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-marmol-navy">Параметры</h3>
                    <button onClick={() => setFilterModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {renderFilterControls(true)}

                <div className="mt-8 flex gap-3">
                    <button 
                        onClick={handleClearAllFilters}
                        className="w-1/3 py-4 border border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-xs rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Сброс
                    </button>
                    <button 
                        onClick={() => setFilterModalOpen(false)}
                        className="w-2/3 bg-marmol-navy text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl shadow-lg shadow-marmol-navy/20 active:scale-[0.98] transition-transform"
                    >
                        Показать ({filteredProjects.length})
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- ЧИПСЫ АКТИВНЫХ ФИЛЬТРОВ --- */}
      {activeFilterTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 px-1 max-w-7xl mx-auto">
              {activeFilterTags.map((tag, idx) => (
                  <button 
                      key={idx} 
                      onClick={tag.clear}
                      className="flex items-center gap-1.5 bg-marmol-gold/10 text-marmol-navy border border-marmol-gold/30 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full hover:bg-marmol-gold hover:text-white transition-colors group cursor-pointer"
                  >
                      {tag.label}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-marmol-navy opacity-50 group-hover:text-white group-hover:opacity-100 transition-colors">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
              ))}
              <button 
                  onClick={handleClearAllFilters}
                  className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-marmol-navy ml-2 transition-colors cursor-pointer border-b border-gray-300"
              >
                  Очистить
              </button>
          </div>
      )}    

      {/* --- СЕТКА РЕЗУЛЬТАТОВ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mt-8">
        {visibleProjects.map((project) => {
            const data = project.data;
            const categoryKey = data.priceCategory || 'economy';
            const price = globalPricing.packages[categoryKey]?.basePricePerMeter || 0;
            const total = data.fixPrice || (data.area * price);

            return (
                <a key={project.id} href={`/projects/${project.id}`} className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                        <img src={data.mainImage} alt={data.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {data.badges && data.badges.map(badge => (
                                <span key={badge} className="bg-marmol-gold text-marmol-navy text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm shadow-sm">{badge}</span>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-marmol-navy/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-marmol-navy group-hover:text-marmol-gold transition-colors">{data.title}</h3>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase">от</p>
                                <p className="text-lg font-bold text-marmol-navy">{formatPrice(total)} BYN</p>
                            </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 font-medium space-x-3 mb-4">
                            <span>{data.area} м²</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{data.specs?.bedrooms || '-'} сп.</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{data.style || data.category}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-marmol-navy opacity-60 group-hover:opacity-100 transition-opacity">Подробнее</span>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-marmol-gold transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-marmol-navy"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </div>
                        </div>
                    </div>
                </a>
            )
        })}
      </div>

      {visibleProjects.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">Нет проектов с такими параметрами.</p>
              <button onClick={handleClearAllFilters} className="text-marmol-gold border-b border-marmol-gold font-bold uppercase text-xs tracking-wider cursor-pointer pb-0.5">Сбросить фильтры</button>
          </div>
      )}

      {visibleProjects.length < filteredProjects.length && (
        <div className="text-center mt-10">
            <button 
                onClick={() => setVisibleCount(prev => prev + 12)} 
                className="inline-flex items-center justify-center px-10 py-4 bg-white border border-gray-200 text-marmol-navy font-bold uppercase tracking-widest text-xs hover:border-marmol-navy hover:bg-marmol-navy hover:text-white transition-all shadow-sm rounded-full cursor-pointer group"
            >
                Показать еще (+{filteredProjects.length - visibleProjects.length})
                <svg className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}