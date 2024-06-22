// 初始化语言监听器
function initLanguageListener() {
    window.addEventListener('message', (event) => {
        if (event.data.lang) {
            applyTranslations(event.data.lang);
        }
    });
}

function applyTranslations(lang) {
    document.querySelectorAll('[data-translate]').forEach((element) => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            // 处理<title>元素
            if (element.tagName.toLowerCase() === 'title') {
                document.title = translations[lang][key];
            }
            // 处理具有placeholder属性的元素
            else if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[lang][key]);
            }
            // 处理具有title属性的元素
            else if (element.hasAttribute('title')) {
                element.setAttribute('title', translations[lang][key]);
            }
            // 处理其他元素的textContent
            else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

// documentLoadedInitLanguageListener
function documentLoadedInitLanguageListener() {
    document.addEventListener('DOMContentLoaded', () => {
        let currentLang = localStorage.getItem('lang') || navigator.language.slice(0, 2) || 'zh'; 
        applyTranslations(currentLang);
    });
}

export { initLanguageListener, documentLoadedInitLanguageListener };