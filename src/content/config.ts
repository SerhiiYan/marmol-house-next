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
    category: z.enum(['house', 'bath', 'commercial', 'a-frame']).default('house'),
    purpose: z.enum(['living', 'business']).default('living'),
    
    // ТЕХНИКА
    style: z.string().optional(), // Напр: "Барнхаус", "Классика"
    availableTech: z.array(z.string()).default(['frame', 'block']), 
    priceCategory: z.enum(['box', 'economy', 'premium', 'premiumPlus']).default('economy'),

    // ПАРАМЕТРЫ
    area: z.number(),
    livingArea: z.number().optional(),
    dims: z.string().optional(),
    
    // МЕДИА (Важное изменение тут!)
    mainImage: z.string(), // <--- Теперь это обязательное поле для обложки
    gallery: z.array(z.string()).optional(),
    plans: z.array(z.string()).optional(),

    // ТЕКСТЫ
    description: z.string(),
    fullDescription: z.string().optional(),
    features: z.array(z.string()).optional(),
    
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

export const collections = {
  'projects': projectsCollection,
};