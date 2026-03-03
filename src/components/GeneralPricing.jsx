// src/components/GeneralPricing.jsx
import React from 'react';
import { globalPricing } from '../data/pricingConfig';
import { isModalOpen, formComment } from '../store/modalStore';

export default function GeneralPricing() {
  const { packages, currency } = globalPricing;
  const packagesList = Object.values(packages);

  const handleOrder = (pkgTitle) => {
    formComment.set(`Здравствуйте! Меня интересует расчет стоимости в комплектации "${pkgTitle}".`);
    isModalOpen.set(true);
  };

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Шапка секции */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* SEO Улучшение: Более точный ключ в H2 */}
          <h2 className="text-4xl font-sans font-bold text-marmol-navy mb-4">
            Цены на строительство домов под ключ
          </h2>
          <p className="text-gray-500 font-light">
            Мы разработали оптимальные пакеты комплектаций под разные задачи. 
            Цена фиксируется в договоре и не меняется в процессе стройки.
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packagesList.map((pkg, index) => {
            // Техническое улучшение: берем флаг из базы, либо страхуемся индексом
            const isPopular = pkg.isPopular; 

            return (
              <div 
                key={index} 
                className={`relative flex flex-col bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border ${isPopular ? 'border-marmol-gold ring-1 ring-marmol-gold shadow-lg' : 'border-gray-100'}`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-marmol-gold text-marmol-navy text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md z-10 whitespace-nowrap">
                    Выбор клиентов
                  </div>
                )}

                {/* Шапка карточки */}
                <div className="mb-6 text-center border-b border-gray-50 pb-6">
                  <h3 className="text-xl font-bold text-marmol-navy mb-2">{pkg.title}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 h-6 flex items-center justify-center">
                    {pkg.subTitle || "Базовая комплектация"}
                  </p>
                  
                  <div className="flex items-center justify-center text-marmol-navy">
                    <span className="text-sm font-medium mr-1 text-gray-400">от</span>
                    <span className="text-4xl font-bold font-sans">{pkg.basePricePerMeter}</span>
                    <div className="flex flex-col items-start ml-2 leading-none">
                        <span className="text-xs font-bold">{currency}</span>
                        <span className="text-[10px] text-gray-400">за м²</span>
                    </div>
                  </div>
                </div>

                {/* Список опций */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center mr-3 border border-gray-100">
                         {/* A11y: скрыли иконку от читалок */}
                         <svg aria-hidden="true" className="w-3 h-3 text-marmol-gold" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                         </svg>
                      </div>
                      <span className="text-sm text-gray-600 leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Кнопка */}
                <button 
                  onClick={() => handleOrder(pkg.title)}
                  aria-label={`Заказать расчет для комплектации ${pkg.title}`}
                  className={`w-full py-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer ${
                    isPopular 
                      ? 'bg-marmol-navy text-white hover:bg-marmol-gold hover:text-marmol-navy shadow-md' 
                      : 'border border-gray-200 text-marmol-navy hover:bg-marmol-navy hover:text-white hover:border-marmol-navy'
                  }`}
                >
                  Заказать расчет
                </button>

              </div>
            );
          })}
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-12 max-w-2xl mx-auto">
           * Стоимость указана ориентировочно для ровных участков с нормальной геологией.
           В цену включены работа и материалы.
        </p>

      </div>
    </section>
  );
}