// src/components/project/PlanViewer.jsx
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function PlanViewer({ image }) {
  const [open, setOpen] = useState(false);

  if (!image) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-gray-200">
            Нет изображения планировки
        </div>
      );
  }

  return (
    <>
      <div 
        className="w-full md:w-2/3 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-all group relative h-auto min-h-[300px]"
        onClick={() => setOpen(true)}
      >
        {/* Картинка */}
        <img 
            src={image} 
            alt="План дома" 
            className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Подсказка "Нажмите для зума" */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-xs font-bold text-marmol-navy px-3 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Увеличить +
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: image }]}
        plugins={[Zoom]}
      />
    </>
  );
}