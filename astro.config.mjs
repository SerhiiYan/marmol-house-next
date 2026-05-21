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
    // --- Бани ---
    '/projects/banya-zp1': '/projects/bath-zp1/',
    '/projects/banya-zp2': '/projects/bath-zp2/',
    '/projects/banya-zp3': '/projects/bath-zp3/',
    '/projects/banya-zp4': '/projects/bath-zp4/',
    '/projects/banya-pamir': '/projects/bath-pamir/',
    // --- Дачи / Коттеджи ---
    '/projects/dacha-z60': '/projects/cottage-z60/',
    '/projects/dacha-z73': '/projects/cottage-z73/',
    '/projects/dacha-z78': '/projects/cottage-z78/',
    '/projects/dacha-z389': '/projects/cottage-z389/',
    '/projects/dacha-z418': '/projects/cottage-z418/',
    // --- Барнхаусы ---
    '/projects/modis': '/projects/barnhouse-modis/',
    '/projects/venta': '/projects/barnhouse-venta/',
    '/projects/omega': '/projects/barnhouse-omega/',
    '/projects/merlen': '/projects/barnhouse-marlen/', 
    '/projects/breyn': '/projects/barnhouse-brain/',   
    '/projects/barni': '/projects/barnhouse-barni/',
    '/projects/bair': '/projects/barnhouse-bair/',
    // --- A-Frame ---
    '/projects/dom-a25': '/projects/aframe-a25/',
    '/projects/dom-a26': '/projects/aframe-a26/',
    '/projects/dom-a27': '/projects/aframe-z27/', 
    '/projects/dom-a28': '/projects/aframe-z28/', 
    '/projects/dom-a29': '/projects/aframe-a29/',
    '/projects/dom-a30': '/projects/aframe-a30/',
    // --- Классические дома ---
    '/projects/dom-z7': '/projects/house-z7/',
    '/projects/dom-z15': '/projects/house-z15/',
    '/projects/dom-z16': '/projects/house-z16/',
    '/projects/dom-z64': '/projects/house-z64/',
    '/projects/dom-z72': '/projects/house-z72/',
    '/projects/dom-z87': '/projects/house-z87/',
    '/projects/dom-z136': '/projects/house-z136/',
    '/projects/dom-z139': '/projects/house-z139/',
    '/projects/dom-z141': '/projects/house-z141/',
    '/projects/dom-z176': '/projects/house-z176/',
    '/projects/dom-z191': '/projects/house-z191/',
    '/projects/dom-z259': '/projects/house-z259/',
    '/projects/dom-z262': '/projects/house-z262/',
    '/projects/dom-z273': '/projects/house-z273/',
    '/projects/dom-z313': '/projects/house-z313/',
    '/projects/dom-z356': '/projects/house-z356/',
    '/projects/dom-z366': '/projects/house-z366/',
    '/projects/dom-z368d': '/projects/house-z368/', 
    '/projects/dom-z415': '/projects/house-z415/',
    '/projects/dom-z440': '/projects/house-z440/',
    '/projects/dom-z443': '/projects/house-z443/',
    '/projects/dom-z508': '/projects/house-z508/',
    '/projects/dom-z509': '/projects/house-z509/',
    '/projects/dom-z524': '/projects/house-z524/',
    '/projects/dom-z537': '/projects/house-z537/',
    '/projects/dom-z563': '/projects/house-z563/',
    '/projects/dom-z566': '/projects/house-z566/',
    '/projects/dom-amir': '/projects/house-amir/',
    '/projects/dom-amir2': '/projects/house-amir2/',
    '/projects/dom-gron': '/projects/house-gron/',
    '/projects/dom-nordbor': '/projects/house-nordbor/',
    '/projects/dom-po': '/projects/house-po/',
    '/projects/dom-vinger': '/projects/house-vinger/',
    '/projects/dom-fonster': '/projects/house-foster/',
    '/blog/ukaz-240-instrukciya/': '/blog/gos-podderzhka-240/',
    //старый
    '/projects/dom-z253': '/projects/', 
  },

  build: {
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});