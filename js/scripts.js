layui.use('element', function(){
    var element = layui.element;

    // 默认选中导航中的“首页”
    /*
    var navLinks = document.querySelector('.nav-links a');
    if (navLinks) {
        navLinks.classList.add('layui-this');
    }
    */

    // 默认展开侧边栏中的“文本转换”
    var navItem = document.querySelector('.layui-nav-itemed');
    if (navItem) {
        navItem.classList.add('layui-this');
    }
});


// 获取元素
var toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
var sidebar = document.getElementById('sidebar');

if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });
}

var homeLink = document.getElementById('home-link');
var aboutLink = document.getElementById('about-link');
if(homeLink && aboutLink){
    homeLink.addEventListener('click', function() {
        homeLink.classList.add('layui-this');
        aboutLink.classList.remove('layui-this');
    });

    aboutLink.addEventListener('click', function() {
        aboutLink.classList.add('layui-this');
        homeLink.classList.remove('layui-this');
    });
}


// 获取元素
var toggleNavbarBtn = document.getElementById('toggle-navbar-btn');
var navLinks = document.querySelector('.nav-links');

if (toggleNavbarBtn) {
    toggleNavbarBtn.addEventListener('click', function() {
        navLinks.classList.toggle('show');
        setTimeout(() => {
            navLinks.classList.toggle('show-nav');
        }, 10); // 添加一个小延迟，以确保动画效果
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const langSwitchButton = document.getElementById('langSwitch');
    const iframe = document.querySelector('iframe[name="content-frame"]');
    let currentLang = localStorage.getItem('lang') || navigator.language.slice(0, 2) || 'zh'; 
    applyTranslations(currentLang);

    langSwitchButton.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('lang', currentLang);
        applyTranslations(currentLang);
        iframe.contentWindow.postMessage({ lang: currentLang }, '*');
    });

    function applyTranslations(lang) {
        document.querySelectorAll('[data-translate]').forEach((element) => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                if (element.tagName.toLowerCase() === 'title') {
                    document.title = translations[lang][key];
                } else if (element.placeholder) {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
    }
});