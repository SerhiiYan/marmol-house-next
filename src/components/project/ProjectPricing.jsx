import React from 'react';
import { globalPricing } from '../../data/pricingConfig';

// Компонент принимает площадь дома (area) как пропс
export default function ProjectPricing({ area }) {
  const { packages, currency } = globalPricing;

  // Вспомогательная функция для форматирования цены (например: 75 000)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price));
  };

  // Превращаем объект пакетов в массив, чтобы перебрать их
  const packagesList = Object.values(packages);

  return (
    <div className="py-10 bg-white">
      <h3 className="text-2xl md:text-3xl font-sans font-bold text-marmol-navy mb-8 text-center">
        Стоимость строительства
      </h3>
      
      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {packagesList.map((pkg, index) => {
          // МАГИЯ: Считаем цену прямо здесь
          const calculatedPrice = area * pkg.basePricePerMeter;

          return (
            <div key={index} className="flex flex-col border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 bg-white group">
              
              {/* Заголовок */}
              <div className="mb-4 border-b border-gray-100 pb-4">
                <h4 className="text-xl font-bold text-marmol-navy mb-1">{pkg.title}</h4>
                {pkg.subTitle && (
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{pkg.subTitle}</span>
                )}
              </div>

              {/* Цена */}
              <div className="mb-6">
                <p className="text-sm text-gray-400">Стоимость домокомплекта:</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm text-marmol-gold font-bold">от</span>
                    <span className="text-3xl font-bold text-marmol-navy group-hover:text-marmol-gold transition-colors">
                        {formatPrice(calculatedPrice)}
                    </span>
                    <span className="text-sm font-bold text-marmol-navy">{currency}</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">({pkg.basePricePerMeter} {currency}/м²)</p>
              </div>

              {/* Список опций */}
              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <svg className="w-5 h-5 text-marmol-gold mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Кнопка заказа */}
              <button 
                className="w-full py-3 border border-marmol-navy text-marmol-navy font-bold text-xs uppercase tracking-widest rounded hover:bg-marmol-navy hover:text-white transition-all cursor-pointer"
                onClick={() => {
                   // Тут можно вызывать модалку и передавать в неё выбранный пакет
                   // например openModal(`Интересует ${pkg.title} для этого дома`)
                   alert(`Вы выбрали: ${pkg.title}. Цена: ${formatPrice(calculatedPrice)} ${currency}`);
                }}
              >
                Рассчитать
              </button>
            </div>
          );
        })}

      </div>
      
      <p className="text-center text-xs text-gray-400 mt-8 max-w-2xl mx-auto">
        * Указанные цены являются ориентировочными и зависят от геологии участка, удаленности объекта и точного выбора отделочных материалов. Не является публичной офертой.
      </p>
    </div>
  );
}