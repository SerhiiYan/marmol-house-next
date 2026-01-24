// src/store/modalStore.js
import { atom } from 'nanostores';

// Открыта ли форма? (true/false)
export const isModalOpen = atom(false);

// Какой текст должен быть в комментарии?
export const formComment = atom('Здравствуйте, меня интересует консультация по строительству дома.');