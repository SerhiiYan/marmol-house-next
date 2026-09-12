// src/components/project/ExpandableProjectList.jsx
import React, { useState } from 'react';
import ActiveProjectCard from './ActiveProjectCard.jsx';
import CompletedProjectCard from './CompletedProjectCard.jsx';

export default function ExpandableProjectList({ projects, type = 'active', initialCount = 5 }) {
    // Состояние: сколько карточек показываем сейчас
    const [visibleCount, setVisibleCount] = useState(initialCount);

    // Проверяем, есть ли еще скрытые проекты
    const hasMore = visibleCount < projects.length;

    const handleLoadMore = () => {
        // При клике добавляем еще 5 карточек
        setVisibleCount(prev => prev + 5);
    };

    return (
        <div>
            {/* СЕТКА КАРТОЧКЕК */}
            <div className={`grid gap-6 ${type === 'completed' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {projects.slice(0, visibleCount).map(project => (
                    type === 'active' 
                        ? <ActiveProjectCard key={project.id} project={project} />
                        : <CompletedProjectCard key={project.id} project={project} />
                ))}
            </div>

            {/* КНОПКА ПОДГРУЗКИ (рендерится только если hasMore = true) */}
            {hasMore && (
                <div className="mt-12 flex flex-col items-center justify-center animate-fade-in">
                    <button 
                        onClick={handleLoadMore}
                        className="group flex flex-col items-center gap-4 text-gray-400 hover:text-marmol-navy transition-colors duration-300 cursor-pointer"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">
                            Показать более ранние записи
                        </span>
                        
                        <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-marmol-navy group-hover:bg-marmol-navy group-hover:text-white transition-all shadow-sm bg-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}