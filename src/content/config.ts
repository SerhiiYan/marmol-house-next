// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // ОСНОВНОЕ
    title: z.string(),
    order: z.number().default(99),
    hit: z.boolean().default(false),
    
    // КАТЕГОРИИ
    category: z.enum(['house', 'bath', 'commercial', 'a-frame', 'barnhouse', 'cottage']).default('house'),
    purpose: z.enum(['living', 'business']).default('living'),

    badges: z.array(z.string()).optional(),
    
    // ТЕХНИКА
    style: z.string().optional(), // Напр: "Барнхаус", "Классика"
    availableTech: z.array(z.string()).default(['frame', 'block']), 
    priceCategory: z.enum(['box', 'economy', 'premium', 'premiumPlus']).default('economy'),
    fixPrice: z.number().optional(), // Ручная цена (перебивает расчет по метрам)

    // ПАРАМЕТРЫ
    area: z.number(),
    livingArea: z.number().optional(),
    dims: z.string().optional(),
    terracePrice: z.number().optional(),
    // МЕДИА (Важное изменение тут!)
    mainImage: z.string(), // <--- Теперь это обязательное поле для обложки
    gallery: z.array(z.string()).optional(),
    plans: z.array(z.string()).optional(),
    plan: z.array(z.string()).optional(),

    // ТЕКСТЫ
    description: z.string(),
    fullDescription: z.string().optional(),
    features: z.array(z.string()).optional(),
    terraceArea: z.number().optional(),
    balconyArea: z.number().optional(),
    tech: z.string().optional(),
    specs: z.object({
      floors: z.number().default(1),
      rooms: z.number().default(1),
      bathrooms: z.number().default(1),
      bedrooms: z.number().optional(),
    }).optional(),

    layout: z.array(
      z.object({
        name: z.string(),
        area: z.number()
      })
    ).optional(),
  }),
});

const realEstateCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // ОСНОВНОЕ
    title: z.string(), // "Дом в Зарице с террасой"
    price: z.number(), // 285000 (Фикс. цена в BYN)
    oldPrice: z.number().optional(), // Если скидка
    
    currency: z.string().default('BYN'),

    // СТАТУСЫ
    status: z.enum(['available', 'reserved', 'sold']).default('available'),
    readiness: z.enum(['box', 'white-box', 'turnkey']).default('white-box'),
    completionDate: z.string().optional(), // "Готов" или "IV кв. 2025"

    // ЛОКАЦИЯ (ЗЕМЛЯ)
    location: z.object({
      city: z.string().default('Гродно'),
      district: z.string().optional(), // "м-н Зарица"
      address: z.string().optional(),  // "ул. Гожская"
      plotSize: z.number(),            // Сотки (например, 10.5)
      coords: z.array(z.number()).optional(), // [53.68, 23.83] для карты
    }),

    // ПАРАМЕТРЫ ДОМА
    specs: z.object({
      area: z.number(),      // Общая
      livingArea: z.number().optional(),
      rooms: z.number(),
      bedrooms: z.number(),
      floors: z.number().default(1),
    }),

    // ТЕХНИЧКА
    technology: z.enum(['block', 'frame', 'brick']), // Из чего построен
    wallMaterial: z.string().optional(), // "Газосиликат 400мм + Вата"

    // МЕДИА
    mainImage: z.string(),
    gallery: z.array(z.string()).optional(),
    plans: z.array(z.string()).optional(), 
    // ИНФО
    description: z.string(),
    features: z.array(z.string()).optional(), // "Газ", "Асфальт", "Лес"
        layout: z.array(
      z.object({
        name: z.string(),
        area: z.number()
      })
    ).optional(),
  }),
});

// 3. НОВАЯ коллекция: Портфолио (Реализованные объекты)
const portfolioCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(), // "Дом в Тарасово"
    mainImage: z.string(), // Обложка для списка
    
    // Флаги и связи
    isHero: z.boolean().optional(),
    relatedProjectSlug: z.string().optional(), // <-- Связь с каталогом (например, "z42")
    status: z.enum(['completed', 'in_progress']).default('completed'),
    technology: z.enum(['frame', 'block', 'reconstruction']),
    
    // Паспорт объекта
    specs: z.object({
      location: z.string(), // "Гродно, Барановичи"
      area: z.number(),     // 120
      year: z.number(),     // 2023
      durationMonths: z.number(), // <-- Теперь это строго число (например, 4)
    }),

    // SEO
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),

    // Контент
    description: z.string().optional(), // Небольшая история
    keyFeatures: z.array(z.string()).optional(), // <-- Список выполненных работ
    progress: z.number().optional(),
    currentStage: z.string().optional(),
    gallery: z.array(z.string()).optional(),     // Фотографии результата
  }),
});

const activeProjectsCollection = defineCollection({
  type: 'data', // Это JSON
  schema: z.object({
    title: z.string(),
    location: z.string(),
    coordinates: z.array(z.number()).length(2),
    globalProgress: z.number().min(0).max(100),
    status: z.enum(['active', 'completed', 'paused']).default('active'),
    tech: z.enum(['frame', 'block']),
    heroImage: z.string(),
    startDate: z.string(),
    estimatedCompletion: z.string(),
    stages: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        status: z.enum(['completed', 'active', 'pending']),
        progress: z.number().min(0).max(100),
        logs: z.array(
          z.object({
            date: z.string(),
            message: z.string(),
          })
        ),
      })
    ),
    currentSpecs: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
  })
});

// 4. НОВАЯ коллекция: БЛОГ / СТАТЬИ / ВИДЕО
const blogCollection = defineCollection({
  type: 'content', // ВАЖНО! Для блога используем 'content' (MD/MDX файлы), а не 'data'
  schema: z.object({
    title: z.string(), // "Как выбрать фундамент для дома из газоблока"
    date: z.date(),    // Дата публикации (нужна для сортировки свежих постов)
    author: z.string().default('Marmol House'),
    mainImage: z.string(), // Обложка карточки
    
    // Категории для будущих фильтров
    category: z.enum(['technology', 'review', 'tips', 'news', 'finance']).default('news'),
    youtubeVideoId: z.string().optional(), 
    
    // Дополнительные фишки для красивой карточки
    readTime: z.number().optional(), // Время чтения в минутах (например, 5)
    
    // SEO
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'real-estate': realEstateCollection,
  'portfolio': portfolioCollection,
  'active_projects': activeProjectsCollection,
  'blog': blogCollection,
};