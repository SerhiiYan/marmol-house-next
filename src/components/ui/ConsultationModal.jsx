// src/components/ui/ConsultationModal.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { isModalOpen, formComment } from '../../store/modalStore';
import { IMaskInput } from 'react-imask';

export default function ConsultationModal() {
  const $isOpen = useStore(isModalOpen);
  const $initialComment = useStore(formComment);
  
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '' });
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if ($isOpen) {
      setFormData({ name: '', phone: '', comment: $initialComment });
      setHoneypot('');
      setSuccess(false);
      setError(null);
      setAgreed(true);
    }
  }, [$isOpen, $initialComment]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
        isModalOpen.set(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return isModalOpen.set(false); 

    if (!formData.name.trim() || !formData.phone || formData.phone.length < 9) {
        setError('Пожалуйста, заполните имя и телефон корректно.');
        return;
    }

    setLoading(true);
    setError(null);

    const requestBody = {
        name: formData.name,
        phone: `+375${formData.phone}`,
        message: formData.comment,
        honeypot: honeypot 
    };

    try {
        const response = await fetch('/api/form_handler.php', { // Заменил URL на актуальный
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json' 
            },
            body: JSON.stringify(requestBody),
        });
        
        let result = {};
        try { 
            result = await response.json(); 
        } catch(e) {
        } 

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Ошибка сервера');
        }

        setSuccess(true);
        if (window.ym) window.ym(104396711, 'reachGoal', 'form_submit');

        setTimeout(() => {
             isModalOpen.set(false);
        }, 5000);

    } catch (err) {
        console.error(err);

        setError(err.message === 'Failed to fetch' ? 'Ошибка сети. Проверьте интернет.' : err.message);
    } finally {
        setLoading(false);
    }
  };

  if (!$isOpen) return null;

  return (

    <div 
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-marmol-navy/80 backdrop-blur-md transition-all duration-300 cursor-pointer"
    >

      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[480px] bg-white rounded-xl shadow-2xl p-8 md:p-10 cursor-default border border-marmol-gold/30 animate-scale-in"
      >

        <button 
            onClick={() => isModalOpen.set(false)}
            aria-label="Закрыть"
            className="absolute top-4 right-4 text-gray-300 hover:text-marmol-navy transition-colors p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {success ? (
            <div className="text-center py-6">
                <div className="w-20 h-20 bg-marmol-bg border border-marmol-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FBBF24" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h2 className="text-2xl font-sans font-bold text-marmol-navy mb-2">Заявка принята</h2>
                <p className="text-gray-500 mb-8 font-light">
                    Спасибо за доверие. Наш архитектор уже получил уведомление и свяжется с вами.
                </p>
                <button 
                    onClick={() => isModalOpen.set(false)} 
                    className="w-full bg-marmol-navy text-white font-bold uppercase tracking-widest py-4 rounded hover:bg-marmol-gold hover:text-marmol-navy transition-all duration-300"
                >
                    Закрыть окно
                </button>
            </div>
        ) : (
            
            <>
                <div className="mb-8">
                    <h2 className="text-3xl font-sans font-bold text-marmol-navy mb-2">
                        Оставьте заявку
                    </h2>
                    <p className="text-gray-400 font-light text-sm">
                        И мы поможем воплотить вашу мечту о доме в реальность.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative">
                    
                    <input type="text" name="honeypot" className="hidden" tabIndex="-1" autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

                    <div className="group">
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full border-b border-gray-300 py-3 text-marmol-navy placeholder-gray-400 focus:border-marmol-gold focus:outline-none transition-colors bg-transparent text-lg"
                            placeholder="Как к вам обращаться?"
                            required
                        />
                    </div>

                    <div className="group">
                        <IMaskInput
                            mask="+{375} (00) 000-00-00"
                            radix="."
                            lazy={false}  
                            unmask={true} 
                            value={formData.phone}
                            onAccept={(value) => setFormData({...formData, phone: value})}
                            className="w-full border-b border-gray-300 py-3 text-marmol-navy focus:border-marmol-gold focus:outline-none transition-colors bg-transparent text-lg font-medium"
                            required
                        />
                         <div className="flex items-center mt-2 space-x-2 text-xs text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-marmol-gold">
                                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                            </svg>
                            <span>Строго конфиденциально</span>
                        </div>
                    </div>

                    <div>
                        <textarea 
                            rows="3"
                            className="w-full border border-gray-200 rounded p-4 text-marmol-navy bg-gray-50 focus:bg-white focus:border-marmol-gold focus:outline-none transition-all resize-none text-sm mt-2"
                            value={formData.comment}
                            onChange={(e) => setFormData({...formData, comment: e.target.value})}
                        ></textarea>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-100">
                            {error}
                        </div>
                    )}

                    <label className="flex items-start space-x-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={agreed}
                            onChange={() => setAgreed(!agreed)}
                            className="mt-1 w-4 h-4 text-marmol-gold border-gray-300 rounded focus:ring-marmol-gold cursor-pointer"
                        />
                        <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                            Я согласен на обработку персональных данных и принимаю условия{' '}
                            <a 
                                href="/privacy" 
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()} 
                                className="text-marmol-gold hover:underline font-bold relative z-10"
                            >
                                политики конфиденциальности
                            </a>.
                        </span>
                    </label>

                    <button 
                        type="submit"
                        aria-label="Отправить"
                        disabled={!agreed || loading}
                        className="w-full bg-marmol-navy text-white font-bold uppercase tracking-[0.15em] py-4 hover:bg-marmol-gold hover:text-marmol-navy transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? 'Отправка...' : 'Отправить'}
                    </button>

                     <p className="text-center text-[10px] text-gray-400 pt-2">
                        Нажимая кнопку, вы ничего не платите и ничем не обязаны.
                    </p>
                </form>
            </>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
            animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}