// src/components/project/ProjectPricing.jsx
import React from 'react';
import { globalPricing } from '../../data/pricingConfig';
import { isModalOpen, formComment } from '../../store/modalStore';

export default function ProjectPricing({ 
  area, 
  projectTitle = "этот проект", 
  fixPrice = null,       // Фиксированная цена (если есть)
  priceCategory = 'economy' // Какому тарифу соответствует фикс. цена
}) {
  const { packages, currency } = globalPricing;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price));
  };

  // --- 1. ЛОГИКА КОЭФФИЦИЕНТА ---
  let multiplier = 1;

  if (fixPrice && area > 0) {
    // Считаем, сколько этот пакет стоил бы "по стандарту"
    // (Если priceCategory не найдена, берем economy как базу)
    const baseRate = packages[priceCategory]?.basePricePerMeter || packages['economy'].basePricePerMeter;
    const standardPrice = area * baseRate;

    // Вычисляем, во сколько раз реальная цена выше стандартной
    if (standardPrice > 0) {
        multiplier = fixPrice / standardPrice;
    }
  }

  // Превращаем объект пакетов в массив [ключ, данные], чтобы проверять категорию
  const packagesList = Object.entries(packages);

  const handleCalculate = (packageName, price) => {
    formComment.set(`Здравствуйте! Хочу узнать подробнее про стоимость строительства "${projectTitle}" в комплектации "${packageName}" (~${price} ${currency}).`);
    isModalOpen.set(true);
  };

  return (
    <div className="w-full mt-12"> 
      <h3 className="text-2xl md:text-3xl font-sans font-bold text-marmol-navy mb-8 text-center md:text-left">
        Стоимость строительства
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packagesList.map(([key, pkg], index) => {
          
          // --- 2. РАСЧЕТ ЦЕНЫ ---
          let finalPrice;

          if (fixPrice && key === priceCategory) {
              // Если это та самая категория, ставим жесткую цену (чтобы цифра была красивой, как в админке)
              finalPrice = fixPrice;
          } else {
              // Остальные пакеты умножаем на коэффициент (чтобы они тоже выросли пропорционально)
              finalPrice = (area * pkg.basePricePerMeter) * multiplier;
          }

          // Пересчитываем цену за метр (для отображения в скобках)
          const realMeterPrice = Math.round(finalPrice / area);

          return (
            <div key={key} className="flex flex-col bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
              
              <div className="mb-4 border-b border-gray-100 pb-4">
                <h4 className="text-xl font-bold text-marmol-navy mb-1">{pkg.title}</h4>
                {pkg.subTitle && (
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{pkg.subTitle}</span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-400">Стоимость домокомплекта:</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm text-marmol-gold font-bold">от</span>
                    <span className="text-3xl font-bold text-marmol-navy">
                        {formatPrice(finalPrice)}
                    </span>
                    <span className="text-sm font-bold text-marmol-navy">{currency}</span>
                </div>
                
                {/* Показываем РЕАЛЬНУЮ цену метра для этого дома */}
                <p className="text-xs text-gray-300 mt-1">
                    ({formatPrice(realMeterPrice)} {currency}/м²)
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <svg className="w-5 h-5 text-marmol-gold mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className="w-full py-3 border border-marmol-navy text-marmol-navy font-bold text-xs uppercase tracking-widest rounded hover:bg-marmol-navy hover:text-white transition-all cursor-pointer"
                onClick={() => handleCalculate(pkg.title, formatPrice(finalPrice))}
              >
                Рассчитать
              </button>
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-400 mt-6 max-w-2xl">
        * Указанные цены являются ориентировочными и зависят от геологии участка, удаленности объекта и точного выбора отделочных материалов. Не является публичной офертой.
      </p>
    </div>
  );
}