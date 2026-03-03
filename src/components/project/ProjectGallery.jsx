// src/components/project/ProjectGallery.jsx
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Подключаем плагин для зума (приближения)
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function ProjectGallery({ images }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Форматируем картинки для лайтбокса
  const slides = images.map((src) => ({ src }));

  return (
    <>
      <h2 className="text-2xl font-bold text-marmol-navy mb-6">Галерея</h2>
      
      {/* Сетка картинок (как была в Astro) */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div 
            key={i}
            className={`rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer relative group ${i === 0 ? 'col-span-2 h-96' : 'h-64'}`}
            onClick={() => {
                setIndex(i);
                setOpen(true);
            }}
          >
            <img 
                src={img} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt={`Фото ${i}`} 
            />
            {/* Иконка лупы при наведении */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-10 h-10 bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Само окно лайтбокса (открывается поверх всего) */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom]} // Включаем зум
      />
    </>
  );
}