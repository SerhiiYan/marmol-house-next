// src/components/ui/CompareSlider.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function CompareSlider({ before, after }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (event) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    
    setSliderPosition(percent);
  };

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  // Для тач-устройств (мобилки)
  const onTouchMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
      const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
      setSliderPosition(percent);
  };

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-2xl cursor-col-resize select-none touch-none shadow-2xl"
        onMouseMove={isDragging ? undefined : handleMove} // На десктопе просто движение, без клика удобнее
        onTouchMove={onTouchMove}
    >
      
      {/* 1. Картинка "ПОСЛЕ" (Фото) - База */}
      <img 
        src={after} 
        alt="Реализация" 
        className="absolute inset-0 w-full h-full object-cover"
        draggable="false"
      />
      <div className="absolute top-4 right-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1 rounded backdrop-blur-md uppercase tracking-wider">
          Реализация
      </div>

      {/* 2. Картинка "ДО" (Рендер) - Сверху, обрезается */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
            src={before} 
            alt="Проект" 
            className="absolute inset-0 w-full h-full object-cover max-w-none" 
            // max-w-none важен, чтобы картинка не сжималась, а обрезалась
            style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
            draggable="false"
        />
        <div className="absolute top-4 left-4 bg-marmol-gold text-marmol-navy text-[10px] font-bold px-3 py-1 rounded shadow-md uppercase tracking-wider">
            3D Проект
        </div>
      </div>

      {/* 3. Ползунок (Линия) */}
      <div 
        className="absolute inset-y-0 w-1 bg-white cursor-col-resize shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-marmol-navy">
            <svg className="w-6 h-6 text-marmol-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" /></svg>
        </div>
      </div>

    </div>
  );
}