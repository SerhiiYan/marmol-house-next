import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function PlanViewer({ image, images }) {
  // 1. УМНАЯ ПРОВЕРКА ДАННЫХ
  // Поддерживаем старый пропс "image" (строка) и новый "images" (массив)
  const planList = images && images.length > 0 
    ? images 
    : (image ? [image] : []);

  // 2. СОСТОЯНИЯ
  const [currentIndex, setCurrentIndex] = useState(0); // Какой этаж сейчас выбран
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Если планов вообще нет
  if (planList.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-gray-200">
            Нет изображения планировки
        </div>
      );
  }

  // Подготавливаем слайды для Lightbox
  const slides = planList.map(src => ({ src }));

  return (
    <div className="w-full md:w-2/3">
      
      {/* 3. ТАБЫ (ВКЛАДКИ) - показываем только если планов больше 1 */}
      {planList.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {planList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${
                currentIndex === idx 
                  ? 'bg-marmol-navy text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-marmol-navy'
              }`}
            >
              {idx === 0 ? '1 этаж' : idx === 1 ? '2 этаж' : `${idx + 1} этаж`}
            </button>
          ))}
        </div>
      )}

      {/* 4. ГЛАВНОЕ ОКНО С ПЛАНИРОВКОЙ */}
      <div 
        className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-all group relative h-auto min-h-[300px]"
        onClick={() => setLightboxOpen(true)}
      >
        <img 
          src={planList[currentIndex]} 
          alt={`План ${currentIndex + 1} этажа`} 
          className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-500" 
        />
        
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-xs font-bold text-marmol-navy px-3 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Увеличить +
        </div>
      </div>

      {/* 5. ПОЛНОЭКРАННАЯ ГАЛЕРЕЯ */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentIndex} // Открываем именно тот этаж, который сейчас выбран
        slides={slides}
        plugins={[Zoom]}
        // Убираем стрелочки навигации, если картинка всего одна
        carousel={{ finite: planList.length <= 1 }}
        render={{
          buttonPrev: planList.length <= 1 ? () => null : undefined,
          buttonNext: planList.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
}