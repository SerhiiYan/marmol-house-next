// src/components/project/ProjectPricing.jsx
import React from 'react';
import { globalPricing } from '../../data/pricingConfig';
import { isModalOpen, formComment } from '../../store/modalStore';

export default function ProjectPricing({ 
  area, 
  projectTitle = "этот проект", 
  fixPrice = null,
  priceCategory = 'economy'
}) {
  const { packages, currency } = globalPricing;

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price));
  };

  // --- ЛОГИКА КОЭФФИЦИЕНТА ---
  let multiplier = 1;
  if (fixPrice && area > 0) {
    const baseRate = packages[priceCategory]?.basePricePerMeter || packages['economy'].basePricePerMeter;
    const standardPrice = area * baseRate;
    if (standardPrice > 0) {
        multiplier = fixPrice / standardPrice;
    }
  }

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
          
          // --- УМНАЯ ССЫЛКА ДЛЯ КАЖДОГО ПАКЕТА ---
          // Проверяем системный ключ пакета и назначаем правильный URL
          let detailLink = '';
          if (key === 'box' || key === 'premiumPlus') {
              // Пакеты блочной технологии
              detailLink = '/services/gas-silicate-houses#packages';
          } else if (key === 'economy' || key === 'premium') {
              // Пакеты каркасной технологии
              detailLink = '/services/frame-houses#packages';
          } else {
              // Заглушка на случай добавления новых пакетов
              detailLink = '/services/frame-houses#packages';
          }

          // Расчет итоговой цены
          let finalPrice;
          if (fixPrice && key === priceCategory) {
              finalPrice = fixPrice;
          } else {
              finalPrice = (area * pkg.basePricePerMeter) * multiplier;
          }
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
                
                <p className="text-xs text-gray-300 mt-1">
                    ({formatPrice(realMeterPrice)} {currency}/м²)
                </p>
              </div>

              <ul className="space-y-3 mb-4">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <svg className="w-5 h-5 text-marmol-gold mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* --- ССЫЛКА НА ПОДРОБНОЕ ОПИСАНИЕ --- */}
              <div className="flex-grow flex flex-col justify-end mb-6">
                <a 
                  href={detailLink} 
                  rel="noopener noreferrer"
                  className="text-left text-xs font-medium text-gray-400 hover:text-marmol-navy transition-colors inline-flex items-center group mt-2 w-fit"
                >
                  <span className="border-b border-dashed border-gray-300 group-hover:border-marmol-navy pb-0.5 transition-colors">
                    Подробный состав комплектации
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>

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