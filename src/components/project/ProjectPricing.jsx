import React, { useState, useEffect } from 'react';
import { globalPricing } from '../../data/pricingConfig';
import { isModalOpen, formComment } from '../../store/modalStore';

/**
 * @param {{
 *   area: number,
 *   terraceArea?: number,
 *   balconyArea?: number,
 *   terracePrice?: number | null,
 *   projectTitle?: string,
 *   fixPrice?: number | null,
 *   priceCategory?: string,
 *   tech?: string[]
 * }} props
 */
export default function ProjectPricing({
  area,
  terraceArea = 0,
  balconyArea = 0, 
  terracePrice = null, // <-- ВОТ ЭТОТ ПРОПС БЫЛ ПРОПУЩЕН!
  projectTitle = "этот проект",
  fixPrice = null,
  priceCategory = 'economy',
  tech = []
}) {
  const { packages, currency, balconyPricePerMeter } = globalPricing;
  
  const [includeTerrace, setIncludeTerrace] = useState(false);
  // Терраса по умолчанию открытая:
  const [terraceType, setTerraceType] = useState('open'); 

  // Берем правильные цены из конфига (с защитой через ?.)
  const coveredTerraceRate = globalPricing.terracePrices?.coveredTerracePricePerMeter || 1100;
  const openTerraceRate = globalPricing.terracePrices?.openTerracePricePerMeter || 550;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price));
  };

  const safeBalconyPrice = balconyPricePerMeter || 900; 
  const currentBalconyPrice = balconyArea > 0 ? (balconyArea * safeBalconyPrice) : 0;

  const actualTerraceRate = terraceType === 'covered' ? coveredTerraceRate : openTerraceRate;
  const currentTerracePrice = (terraceArea > 0 && includeTerrace) ? (terraceArea * actualTerraceRate) : 0;

  let multiplier = 1;
  if (fixPrice && area > 0) {
    const baseRate = packages[priceCategory]?.basePricePerMeter || packages['economy'].basePricePerMeter;
    const standardPrice = area * baseRate;
    if (standardPrice > 0) {
        multiplier = fixPrice / standardPrice;
    }
  }

  const framePackages = ['economy', 'premium'];
  const blockPackages = ['box', 'premiumPlus'];

  const packagesList = Object.entries(packages).filter(([key]) => {
      if (!tech || tech.length === 0) return true; 
      const isFrame = framePackages.includes(key);
      const isBlock = blockPackages.includes(key);
      if (tech.includes('frame') && isFrame) return true;
      if (tech.includes('block') && isBlock) return true;
      return false;
  });

  const handleCalculate = (packageName, price) => {
    let terraceText = '';
    if (terraceArea > 0 && includeTerrace) {
        terraceText = terraceType === 'covered' ? ' (с крытой террасой)' : ' (с открытой террасой)';
    }
    const balconyText = balconyArea > 0 ? ' (балкон включен)' : '';
    
    formComment.set(`Здравствуйте! Хочу узнать подробнее про стоимость строительства "${projectTitle}" в комплектации "${packageName}"${terraceText}${balconyText} (~${price} ${currency}).`);
    isModalOpen.set(true);
  };

  const baseRate = packages[priceCategory]?.basePricePerMeter || packages['economy'].basePricePerMeter;
  const sidebarBaseHousePrice = fixPrice || (area * baseRate);
  
  const activeSidebarPrice = sidebarBaseHousePrice + currentBalconyPrice + currentTerracePrice;

  useEffect(() => {
      const formatted = formatPrice(activeSidebarPrice);
      const sidebarEl = document.getElementById('sidebar-price');
      const mobileEl = document.getElementById('mobile-price');

      if (sidebarEl) sidebarEl.innerText = formatted;
      if (mobileEl) mobileEl.innerText = formatted;
  }, [activeSidebarPrice]);

  return (
    <div className="w-full mt-12">
      <h3 className="text-2xl md:text-3xl font-sans font-bold text-marmol-navy mb-6 text-center md:text-left">
        Стоимость строительства
      </h3>

      {terraceArea > 0 && (
          <div 
              className={`sticky top-25 z-30 mb-8 w-full border rounded-xl transition-all duration-300 backdrop-blur-xl shadow-sm ${
                  includeTerrace 
                      ? 'border-marmol-navy bg-white/95' 
                      : 'border-gray-200 bg-white/80 hover:bg-white/95 hover:border-gray-300'
              }`}
          >
              {/* Главный переключатель */}
              <label className="flex items-center justify-between p-6 cursor-pointer">
                  <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                          <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={includeTerrace}
                              onChange={() => setIncludeTerrace(!includeTerrace)}
                          />
                          <div className={`block w-11 h-6 rounded-full transition-colors ${includeTerrace ? 'bg-marmol-navy' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${includeTerrace ? 'transform translate-x-5' : ''}`}></div>
                      </div>
                      <div>
                          <p className={`font-bold text-sm md:text-base ${includeTerrace ? 'text-marmol-navy' : 'text-gray-700'}`}>
                              Добавить террасу <br/> ({terraceArea} м²)
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                              Опциональное расширение
                          </p>
                      </div>
                  </div>
                  <div className={`font-bold text-sm md:text-base whitespace-nowrap ${includeTerrace ? 'text-marmol-navy' : 'text-gray-400'}`}>
                      + {formatPrice(terraceArea * actualTerraceRate)} {currency}
                  </div>
              </label>

              {/* НОВЫЙ КОМПАКТНЫЙ БЛОК: Скрытый выбор типа крыши */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${includeTerrace ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 pb-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Исполнение:</span>
                      
                      <div className="flex items-center gap-1 bg-gray-50/70 p-1 rounded-md border border-gray-100">
                          <button 
                              type="button"
                              onClick={() => setTerraceType('open')}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded transition-all ${terraceType === 'open' ? 'bg-white shadow-sm text-marmol-navy' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                              Открытая
                          </button>
                          
                          <button 
                              type="button"
                              onClick={() => setTerraceType('covered')}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded transition-all ${terraceType === 'covered' ? 'bg-marmol-navy shadow-sm text-marmol-gold' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                              Крытая
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {packagesList.map(([key, pkg]) => {
          let detailLink = (key === 'box' || key === 'premiumPlus') 
              ? '/services/gas-silicate-houses#packages' 
              : '/services/frame-houses#packages';

          let housePrice = (fixPrice && key === priceCategory) 
              ? fixPrice 
              : (area * pkg.basePricePerMeter) * multiplier;
          
          const houseWithBalconyPrice = housePrice + currentBalconyPrice;
          const finalPrice = houseWithBalconyPrice + currentTerracePrice;
          const realMeterPrice = Math.round(housePrice / area);

          return (
            <div key={key} className="flex flex-col bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4 border-b border-gray-100 pb-4">
                <h4 className="text-xl font-bold text-marmol-navy mb-1">{pkg.title}</h4>
                {pkg.subTitle && (
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{pkg.subTitle}</span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-400">Стоимость под ключ:</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm text-marmol-gold font-bold">от</span>
                    <span className="text-3xl font-bold text-marmol-navy">
                        {formatPrice(finalPrice)}
                    </span>
                    <span className="text-sm font-bold text-marmol-navy">{currency}</span>
                </div>
                
                <p className="text-xs text-gray-300 mt-1">
                    (Дом: {formatPrice(realMeterPrice)} {currency}/м²)
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

              <div className="flex-grow flex flex-col justify-end mb-6">
                <a href={detailLink} className="text-left text-xs font-medium text-gray-400 hover:text-marmol-navy transition-colors inline-flex items-center group mt-2 w-fit">
                  <span className="border-b border-dashed border-gray-300 group-hover:border-marmol-navy pb-0.5 transition-colors">
                    Подробный состав
                  </span>
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
        * Цены зависят от геологии участка, удаленности объекта и точного выбора материалов.
      </p>
    </div>
  );
}