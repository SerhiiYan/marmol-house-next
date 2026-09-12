import React from 'react';

export default function ActiveProjectCard({ project }) {
    const { id, data } = project;
    
    const activeStage = data.stages.find(stage => stage.status === 'active');
    const stageName = activeStage ? activeStage.name : 'Строительство завершено';
    
    const getStatusBadge = () => {
        if (data.status === 'completed') {
            return <span className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm border border-gray-200">Сдан</span>;
        }
        if (data.status === 'paused') {
            return <span className="bg-gray-800 text-gray-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm border border-gray-700">На паузе</span>;
        }
        return <span className="bg-marmol-gold text-marmol-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-sm">В работе</span>;
    };
    
    return (
        <a 
            href={`/live/${id}`} 
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div className="flex flex-col md:flex-row h-full">
                
                <div className="w-full md:w-2/5 lg:w-1/3 relative overflow-hidden h-64 md:h-auto shrink-0">
                    <img 
                        src={data.heroImage} 
                        alt={`Строительство ${data.title}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"        
                        decoding="async"      
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-1/2"></div>
                    <div className="absolute top-4 left-4 bg-marmol-navy text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-md backdrop-blur-sm">
                        {data.tech === 'frame' ? 'Каркасный дом' : 'Блочный дом'}
                    </div>

                    <div className="absolute top-4 right-4 backdrop-blur-sm">
                        {getStatusBadge()}
                    </div>
                </div>

                <div className="w-full md:w-3/5 lg:w-2/3 p-6 md:p-8 flex flex-col justify-between">
                    
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-marmol-navy mb-2 group-hover:text-marmol-gold transition-colors">
                                    {data.title}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {data.location}
                                </p>
                            </div>
                            
                            {/* Круглая кнопка-стрелка, появляющаяся при наведении */}
                            <div className="hidden md:flex w-10 h-10 rounded-full bg-gray-50 border border-gray-100 items-center justify-center text-gray-400 group-hover:bg-marmol-navy group-hover:text-marmol-gold transition-all">
                                <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>

                        {/* Мини-спецификация (берем первые 4 пункта) */}
                        <div className="flex gap-4 mb-8 flex-wrap">
                            {data.currentSpecs.slice(0, 5).map((spec, i) => (
                                <div key={i} className="bg-gray-50 px-3 py-1.5 rounded border border-gray-100">
                                    <span className="block text-[9px] text-gray-400 uppercase tracking-widest">{spec.label}</span>
                                    <span className="block text-xs font-bold text-marmol-navy">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* БЛОК ПРОГРЕССА */}
                    <div className="mt-auto">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Текущий этап</span>
                                <span className="text-sm font-bold text-marmol-navy">{stageName}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Готовность</span>
                                <span className="text-3xl font-sans font-bold text-marmol-navy leading-none">
                                    {data.globalProgress}%
                                </span>
                            </div>
                        </div>
                        
                        {/* Градиентный бар прогресса */}
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                            <div 
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${data.globalProgress}%`,
                                    background: 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #d4af37 100%)'
                                }}
                            >
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </a>
    );
}