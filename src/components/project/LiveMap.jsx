// src/components/project/LiveMap.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function LiveMap({ projects }) {
    const mapContainer = useRef(null);
    // НОВОЕ СОСТОЯНИЕ: Следим, загрузился ли скрипт Яндекса
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // ЭФФЕКТ 1: Умная отложенная загрузка скрипта
    useEffect(() => {
        // Если скрипт уже есть в кэше браузера
        if (window.ymaps) {
            setIsMapLoaded(true);
            return;
        }

        // Защита от двойной загрузки
        const existingScript = document.getElementById('yandex-maps-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'yandex-maps-script';
            script.src = "https://api-maps.yandex.ru/2.1/?apikey=7e5c4c71-e943-4977-bd6b-e1145c2e8688&lang=ru_RU";
            script.async = true;
            script.defer = true;
            
            // Как только скрипт загрузился - даем сигнал второму эффекту
            script.onload = () => setIsMapLoaded(true);

            // Откладываем вставку скрипта на полсекунды, чтобы дать странице "подышать"
            setTimeout(() => {
                document.body.appendChild(script);
            }, 500); 
        } else {
            existingScript.addEventListener('load', () => setIsMapLoaded(true));
        }
    }, []);

    // ЭФФЕКТ 2: Отрисовка самой карты и маркеров
    useEffect(() => {
        // Ждем, пока первый эффект не скажет "Готово"
        if (!isMapLoaded || !window.ymaps || !mapContainer.current) return;

        window.ymaps.ready(() => {
            // Очищаем контейнер от старой карты (важно при навигации)
            mapContainer.current.innerHTML = '';

            const map = new window.ymaps.Map(mapContainer.current, {
                center: [53.6778, 23.8295], 
                zoom: 11,
                controls: ['zoomControl', 'fullscreenControl']
            });

            projects.forEach(project => {
                const id = project.id; 
                const { status, title, location, globalProgress, stages, coordinates } = project.data;
                
                const isCompleted = status === 'completed';
                const isPaused = status === 'paused';

                const activeStage = stages.find(s => s.status === 'active');
                
                let stageName = 'В работе';
                if (isCompleted) stageName = 'Объект сдан в эксплуатацию';
                else if (isPaused) stageName = 'Строительство временно приостановлено';
                else if (activeStage) stageName = activeStage.name;

                let progressColor = '#1e293b'; 
                if (isCompleted) progressColor = '#10b981'; 
                if (isPaused) progressColor = '#ef4444'; 

                const placemark = new window.ymaps.Placemark(
                    coordinates,
                    {
                        hintContent: title,
                        balloonContent: `
                            <div style="font-family: sans-serif; padding: 4px; min-width: 200px;">
                                <strong style="color: #1e293b; font-size: 15px; display: block; margin-bottom: 2px;">${title}</strong>
                                <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">📍 ${location}</p>
                                
                                <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 4px; padding: 8px; margin-bottom: 12px;">
                                    <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; color: ${progressColor};">
                                        ${isCompleted ? 'Успешно завершен' : `Готовность: ${globalProgress}%`}
                                    </p>
                                    <p style="margin: 0; font-size: 11px; color: #d4af37; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                        ${stageName}
                                    </p>
                                </div>
                                
                                <a href="/live/${id}" style="display: block; text-align: center; background-color: #1e293b; color: #ffffff; text-decoration: none; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 10px; border-radius: 4px;">
                                    Смотреть дневник стройки →
                                </a>
                            </div>
                        `
                    },
                    {
                        iconLayout: 'default#image',
                        iconImageHref: isCompleted ? '/marmol-pin-completed.svg' : '/marmol-pin.svg',
                        iconImageSize: [40, 48],
                        iconImageOffset: [-20, -48]
                    }
                );
                map.geoObjects.add(placemark);
            });
        });
    }, [isMapLoaded, projects]); // Перезапускаем, когда скрипт загрузится

    return (
        <div 
            ref={mapContainer} 
            className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative z-0"
        />
    );
}