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

  const formatPrice = (price) => {
    return price.toLocaleString('ru-RU');
  };

  const getTechInfo = (subTitle) => {
    const text = subTitle.toLowerCase();
    if (text.includes('каркас')) {
      return { 
        label: 'Каркасная технология', 
        url: '/services/frame-houses' 
      };
    }
    return { 
      label: 'Каменное строительство', 
      url: '/services/gas-silicate-houses' 
    };
  };

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-sans font-bold text-marmol-navy mb-4">
            Цены на строительство домов под ключ
          </h2>
          <p className="text-gray-500 font-light text-lg">
            Мы разработали оптимальные комплектации под разные задачи. 
            Стоимость фиксируется в договоре и защищает вас от скрытых платежей.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packagesList.map((pkg, index) => {
            const isPopular = pkg.isPopular; 
            const techInfo = getTechInfo(pkg.subTitle);

            return (
              <div 
                key={index} 
                className={`relative flex flex-col bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border ${isPopular ? 'border-marmol-gold ring-1 ring-marmol-gold shadow-xl' : 'border-gray-100 shadow-sm'}`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-marmol-gold text-marmol-navy text-[10px] font-bold uppercase tracking-widest px-5 py-1.5 rounded-full shadow-md z-10 whitespace-nowrap">
                    Выбор клиентов
                  </div>
                )}

                <div className="mb-6 text-center border-b border-gray-100 pb-6">
                  <h3 className="text-2xl font-bold text-marmol-navy mb-2 mt-2">{pkg.title}</h3>
                  <p className="text-xs font-bold text-marmol-gold uppercase tracking-[0.15em] mb-4 min-h-[1.5rem] flex items-center justify-center">
                    {pkg.subTitle || "Базовая комплектация"}
                  </p>
                  
                  {/* Возвращаем "от" */}
                  <div className="flex items-center justify-center text-marmol-navy">
                    <span className="text-sm font-medium mr-2 text-gray-400 self-end mb-2">от</span>
                    <span className="text-5xl font-bold font-sans tracking-tight">{formatPrice(pkg.basePricePerMeter)}</span>
                    <div className="flex flex-col items-start ml-2 leading-none text-left">
                        <span className="text-sm font-bold">{currency}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">за м²</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-4 mb-4">
                  {pkg.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center mr-3 border border-gray-100">
                         <svg aria-hidden="true" className={`w-3 h-3 ${isPopular ? 'text-marmol-gold' : 'text-marmol-navy'}`} fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                         </svg>
                      </div>
                      <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex-grow flex flex-col justify-end mb-6">
                    <a 
                      href={techInfo.url}
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
                  onClick={() => handleOrder(pkg.title)}
                  className={`w-full py-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer ${
                    isPopular 
                      ? 'bg-marmol-gold text-marmol-navy hover:bg-marmol-navy hover:text-white shadow-lg border border-transparent' 
                      : 'border border-gray-200 text-marmol-navy bg-gray-50 hover:bg-marmol-navy hover:text-white hover:border-marmol-navy'
                  }`}
                >
                  Заказать расчет
                </button>
              </div>
            );
          })}
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-12 max-w-2xl mx-auto leading-relaxed">
           * Итоговая стоимость зависит от сложности проекта, типа фундамента и особенностей участка.
           Для точного расчета оставьте заявку на бесплатную консультацию.
        </p>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": packagesList.map((pkg, i) => ({
            "@type": "Offer",
            "position": i + 1,
            "name": `Комплектация: ${pkg.title}`,
            "price": pkg.basePricePerMeter,
            "priceCurrency": "BYN",
            "description": pkg.features.join(", ")
          }))
        })}} />
      </div>
    </section>
  );
}