// src/components/project/LiveDiaryGallery.jsx
import React, { useState, useMemo } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from "yet-another-react-lightbox/plugins/zoom"; // Твой плагин для зума

export default function LiveDiaryGallery({ photos }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Формируем слайды, вытаскивая .image из объектов
    const slides = useMemo(() => {
        return photos.map(photo => ({
            src: photo.image,
            alt: photo.text || 'Фото со стройки'
        }));
    }, [photos]);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (!photos || photos.length === 0) return null;

    return (
        <div>
            {/* СЕТКА ФОТОГРАФИЙ С ДАТАМИ И ОПИСАНИЕМ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                    <div 
                        key={index} 
                        className="group relative rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
                        onClick={() => openLightbox(index)}
                    >
                        <div className="aspect-w-16 aspect-h-12 bg-gray-100 h-64">
                            <img 
                                src={photo.image} 
                                alt={photo.text} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-gray-200"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        
                        {/* Иконка лупы по центру (взял из твоего компонента) */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-10 h-10 bg-white/20 p-2 rounded-full backdrop-blur-sm shadow-lg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                            </svg>
                        </div>

                        {/* Градиент, дата и текст внизу */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                            <span className="text-[10px] text-marmol-gold font-bold uppercase tracking-widest block mb-1.5">{photo.date}</span>
                            <p className="text-xs text-white line-clamp-2 leading-relaxed">{photo.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ЛАЙТБОКС С ЗУМОМ */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
                plugins={[Zoom]} // Плагин зума подключен
                carousel={{ finite: false }}
            />
        </div>
    );
}