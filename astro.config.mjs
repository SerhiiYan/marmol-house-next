// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://marmolhouse.by',
  
  // === БЛОК С РЕДИРЕКТАМИ ===
  redirects: {
    // Базовый синтаксис (по умолчанию Astro делает 301 "Постоянный" редирект)
    // 'Старая ссылка': 'Новая ссылка'
    '/gallery': '/projects',
    '/completed': '/portfolio',
    
    // Расширенный синтаксис (если захочешь явно указать код или сделать временный 302 редирект)
    '/old-services': {
      status: 301,
      destination: '/portfolio'
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});