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
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Состояние для мобильной шторки фильтров
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  // ИНИЦИАЛИЗАЦИЯ
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

  // ДИНАМИЧЕСКИЕ КАТЕГОРИИ (С учетом BARNHOUSE)
  const categories = useMemo(() => {
    const cats = new Set(['Все']);
    allProjects.forEach(p => {
        // === ВОТ ЗДЕСЬ ДОБАВЛЯЕМ НОВЫЕ НАЗВАНИЯ ===
        const map = { 
            'house': 'Дома', 
            'bath': 'Бани', 
            'a-frame': 'A-Frame', 
            'commercial': 'Коммерция',
            'barnhouse': 'Barnhouse' // <-- ДОБАВИЛИ
        };
        cats.add(map[p.data.category] || p.data.category);
    });
    // Можно принудительно отсортировать, чтобы "Дома" были первыми
    return Array.from(cats).sort((a, b) => {
        if(a === 'Все') return -1;
        if(b === 'Все') return 1;
        return 0;
    });
  }, [allProjects]);

  // ФИЛЬТРАЦИЯ
  const filteredProjects = allProjects.filter(project => {
    const data = project.data;
    const map = { 'house': 'Дома', 'bath': 'Бани', 'a-frame': 'A-Frame', 'commercial': 'Коммерция', 'barnhouse': 'Barnhouse' };
    const currentCatName = map[data.category] || data.category;

    if (activeCategory !== 'Все' && currentCatName !== activeCategory) return false;
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

  // --- ХЕЛПЕР: СОДЕРЖИМОЕ ФИЛЬТРОВ (Чтобы не дублировать код в модалке и на десктопе) ---
  const FilterControls = ({ mobileMode = false }) => (
    <div className={`flex flex-wrap items-center gap-3 md:gap-6 ${mobileMode ? 'flex-col items-start w-full gap-6' : ''}`}>
        
        {/* Группа 1: Технология */}
        <div className={`flex items-center ${mobileMode ? 'w-full flex-col items-start gap-2' : 'space-x-2 bg-white px-3 py-1 rounded-lg border border-gray-200'}`}>
            <span className={`text-[10px] uppercase font-bold text-gray-400 ${mobileMode ? 'text-xs' : 'mr-1'}`}>Технология:</span>
            <div className={mobileMode ? 'flex gap-2 w-full' : 'flex'}>
                {['all', 'frame', 'block'].map(tech => (
                    <button
                        key={tech}
                        onClick={() => setActiveTech(tech)}
                        className={`text-xs font-bold uppercase px-3 py-2 rounded transition-all ${
                            activeTech === tech 
                            ? 'bg-marmol-gold text-marmol-navy shadow-sm' 
                            : 'text-gray-500 hover:text-marmol-navy bg-gray-50'
                        } ${mobileMode ? 'flex-1 text-center' : ''}`}
                    >
                        {{ all: 'Любая', frame: 'Каркас', block: 'Блок' }[tech]}
                    </button>
                ))}
            </div>
        </div>

        {/* Группа 2: Площадь */}
        <div className={`flex items-center ${mobileMode ? 'w-full flex-col items-start gap-2' : 'space-x-2 bg-white px-3 py-1 rounded-lg border border-gray-200'}`}>
            <span className={`text-[10px] uppercase font-bold text-gray-400 ${mobileMode ? 'text-xs' : 'mr-1'}`}>Площадь:</span>
            <div className={mobileMode ? 'grid grid-cols-4 gap-2 w-full' : 'flex'}>
                {[
                    { val: 'all', label: 'Любая' },
                    { val: 'small', label: '< 100' },
                    { val: 'medium', label: '100-150' },
                    { val: 'large', label: '150+' }
                ].map(opt => (
                    <button
                        key={opt.val}
                        onClick={() => setActiveArea(opt.val)}
                        className={`text-xs font-bold uppercase px-2 py-2 rounded transition-colors ${
                            activeArea === opt.val ? 'bg-marmol-navy text-white' : 'text-gray-500 hover:text-marmol-navy bg-gray-50'
                        } ${mobileMode ? 'w-full text-center' : ''}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Группа 3: Спальни */}
        <div className={`flex items-center ${mobileMode ? 'w-full flex-col items-start gap-2' : 'space-x-2 bg-white px-3 py-1 rounded-lg border border-gray-200'}`}>
            <span className={`text-[10px] uppercase font-bold text-gray-400 ${mobileMode ? 'text-xs' : 'mr-1'}`}>Спальни:</span>
            <div className={mobileMode ? 'flex gap-2 w-full' : 'flex'}>
                {['all', '2', '3', '4+'].map(room => (
                    <button
                        key={room}
                        onClick={() => setActiveRooms(room)}
                        className={`text-xs font-bold uppercase px-3 py-2 rounded transition-colors ${
                            activeRooms === room ? 'bg-marmol-navy text-white' : 'text-gray-500 hover:text-marmol-navy bg-gray-50'
                        } ${mobileMode ? 'flex-1 text-center' : ''}`}
                    >
                        {room === 'all' ? 'Любое' : room}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  return (
    <div>
      
      {/* --- ПАНЕЛЬ (Sticky) --- */}
      <div className="sticky top-24 z-30 bg-gray-50/95 backdrop-blur-md py-3 md:py-4 border-b border-gray-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4">
                
                <div className="relative flex items-center w-full">
                    
                    {/* ТАБЫ (Все, Дома, A-frame...) */}
                    {/* pr-14 добавляет отступ справа, чтобы последний пункт не перекрывался кнопкой */}
                    <div className="flex overflow-x-auto pb-1 md:pb-0 gap-2 scrollbar-hide no-scrollbar w-full md:w-auto pr-14 md:pr-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                                className={`whitespace-nowrap px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all border shrink-0 ${
                                    activeCategory === cat 
                                    ? 'bg-marmol-navy text-white border-marmol-navy shadow-md' 
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-marmol-navy hover:text-marmol-navy'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* МОБИЛЬНАЯ КНОПКА "ФИЛЬТРЫ" + ГРАДИЕНТ (Видна только на mobile) */}
                    <div className="absolute right-0 top-0 h-full flex items-center md:hidden">
                        
                        {/* Градиент ("Туман"), чтобы текст плавно исчезал */}
                        {/* from-gray-50 - потому что фон хедера у нас gray-50 */}
                        <div className="w-12 h-full bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none"></div>
                        
                        {/* Сама кнопка */}
                        <button 
                            onClick={() => setFilterModalOpen(true)}
                            className="relative flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md text-marmol-navy active:scale-95 transition-transform z-10 ml-[-10px]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                        </button>
                    </div>

                </div>

                {/* ДЕСКТОПНЫЕ ФИЛЬТРЫ (Скрыты на mobile) */}
                <div className="hidden md:block pt-2">
                    <FilterControls />
                </div>

            </div>
        </div>
      </div>

      {/* --- МОБИЛЬНАЯ ШТОРКА (MODAL) --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFilterModalOpen(false)}></div>
            
            {/* Шторка */}
            <div className="relative bg-white w-full rounded-t-3xl p-6 pb-10 animate-slide-up shadow-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-marmol-navy">Фильтры</h3>
                    <button onClick={() => setFilterModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Фильтры внутри шторки */}
                <FilterControls mobileMode={true} />

                <button 
                    onClick={() => setFilterModalOpen(false)}
                    className="w-full mt-8 bg-marmol-navy text-white font-bold uppercase tracking-widest py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
                >
                    Показать {filteredProjects.length} проектов
                </button>
            </div>
        </div>
      )}

      {/* --- СЕТКА РЕЗУЛЬТАТОВ (ОСТАЛАСЬ ТАКОЙ ЖЕ) --- */}
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
              <button onClick={() => {setActiveCategory('Все'); setActiveTech('all'); setActiveArea('all'); setActiveRooms('all')}} className="text-marmol-gold underline font-bold cursor-pointer">Сбросить фильтры</button>
          </div>
      )}

      {visibleProjects.length < filteredProjects.length && (
        <div className="text-center">
            <button onClick={() => setVisibleCount(prev => prev + 6)} className="inline-block px-10 py-4 bg-white border border-gray-200 text-marmol-navy font-bold uppercase tracking-widest text-xs hover:border-marmol-navy hover:bg-marmol-navy hover:text-white transition-all shadow-sm rounded-full cursor-pointer">Показать еще (+{filteredProjects.length - visibleProjects.length})</button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>

    </div>
  );
}