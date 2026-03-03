import { isModalOpen, formComment } from '../store/modalStore';

export function setupProjectButtons(projectTitle) {
    const ids = ['sidebar-cta-btn', 'mobile-cta-btn'];
    
    ids.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = () => { // Используем onclick для простоты перезаписи
                formComment.set(`Здравствуйте! Меня интересует проект "${projectTitle}". Хочу узнать стоимость.`);
                isModalOpen.set(true);
            };
        }
    });
}