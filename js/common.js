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

function formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
        fileSize /= 1024;
        unitIndex++;
    }

    return fileSize.toFixed(2) + ' ' + units[unitIndex];
}


function handleProcessButtonClick({
    ruleInput,
    textInput,
    fileInput,
    processButton,
    searchButton,
    processFunction,
    inputType, // 'text' 或 'file'
    allowEmptyRule = false
}) {
    var ruleValue = ruleInput.value.trim();
    var inputText = textInput ? textInput.value.trim() : null;
    var files = fileInput ? fileInput.files : null;

    // 是否违背规则校验
    var ifRule = false;
    // 是否违背输入校验
    var ifInput = false;

    // 重置错误消息
    var ruleErrorTextContent = '';
    ruleInput.style.borderColor = ''; // 重置边框颜色

    // 校验规则输入框
    if (!allowEmptyRule && ruleValue === '') {
        ruleErrorTextContent = '规则不能为空';
        ifRule = true;
    } else if (ruleValue.length > 50) {
        ruleErrorTextContent = '规则不能超过50个字';
        ifRule = true;
    }

    // 根据输入类型进行校验
    if (inputType === 'text') {
        if (inputText === '') {
            if (ruleErrorTextContent.trim() !== '') {
                ruleErrorTextContent += ', ';
            }
            ruleErrorTextContent += '输入不能为空';
            ifInput = true;
        }
    } else if (inputType === 'file') {
        if (!files || files.length === 0) {
            if (ruleErrorTextContent.trim() !== '') {
                ruleErrorTextContent += ', ';
            }
            ruleErrorTextContent += '请至少选择一个文件';
            ifInput = true;
        }
    }

    if (ruleErrorTextContent) {
        layui.use(['layer'], function(){
            var layer = layui.layer;
            layer.msg(ruleErrorTextContent, {icon: 2, time: 2000, offset: 'rt'});
        });

        // 边框颜色变红
        if (ifRule) {
            ruleInput.style.borderColor = 'red';
        }
        if (ifInput) {
            if (inputType === 'text') {
                textInput.style.borderColor = 'red';
            } else if (inputType === 'file') {
                fileInput.parentElement.style.borderColor = 'red';
            }
        }

        return; // 阻止继续执行
    }

    // 校验通过，禁用输入框和按钮
    ruleInput.disabled = true;
    if (textInput) {
        textInput.disabled = true;
        textInput.style.borderColor = '';
    }
    if (fileInput) {
        fileInput.disabled = true;
        fileInput.parentElement.style.borderColor = '';
    } 
    processButton.disabled = true;
    searchButton.disabled = true;

    const outputArea = document.getElementById('outputArea');
    if(outputArea) outputArea.value = 'Processing, please wait...';

    // 保存原始图标
    const originalIcon = processButton.innerHTML;

    // 插入动态转动图标
    processButton.innerHTML = '<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>';
    processButton.classList.add('button-disabled');
    processButton.classList.remove('layui-icon-transfer');

    // 发起请求
    let processPromise;
    if (inputType === 'text') {
        processPromise = processFunction(inputText, ruleValue);
    } else if (inputType === 'file') {
        const fileAttributes = Array.from(files).map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModifyTime: new Date(file.lastModified).toLocaleString()
        }));
        processPromise = processFunction(fileAttributes, ruleValue);
    }

    processPromise
        .finally(() => {
            // 恢复原始图标和按钮状态
            processButton.innerHTML = originalIcon;
            processButton.classList.remove('button-disabled');
            processButton.classList.add('layui-icon-transfer');

            // 重新启用输入框和按钮
            ruleInput.disabled = false;
            if (textInput) textInput.disabled = false;
            if (fileInput) fileInput.disabled = false;
            processButton.disabled = false;
            searchButton.disabled = false;
        });
}

// 公共函数：为元素添加Enter键监听器
function addEnterKeyListener(inputElement, buttonElement) {
    if (inputElement) {
        inputElement.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // 防止默认的Enter键行为
                if (!buttonElement.disabled) {
                    buttonElement.click();
                }
            }
        });
    }
}

// 公共函数：为元素添加点击监听器
function addClickListener(clickElement, buttonElement) {
    if (clickElement) {
        clickElement.addEventListener('click', function() {
            buttonElement.click();
        });
    }
}



function addCommentEventListener(commentButton) {
    if (commentButton) {
        commentButton.addEventListener('click', function toggleCommentSection() {
            const commentSection = parent.document.getElementById('comment');
        
            if (commentSection) {
                if (commentSection.style.display === 'none' || commentSection.style.display === '') {
                    // 显示评论区域
                    commentSection.style.display = 'block';
                    
                    //get parent issoLoad
                    let issoLoaded = parent.issoLoaded;
                    if (issoLoaded === undefined) {
                        issoLoaded = false;
                    }
                    // 动态加载 Isso 脚本（只加载一次）
                    if (!issoLoaded) {
                        const issoScript = parent.document.createElement('script');
                        issoScript.src = "//comment.ai-reading.me/js/embed.min.js";
                        issoScript.dataset.isso = "//comment.ai-reading.me";
                        parent.document.body.appendChild(issoScript);
                        issoLoaded = true;
                        parent.issoLoaded = issoLoaded;
                    }
                } else {
                    // 隐藏评论区域
                    commentSection.style.display = 'none';
                }
            }
        });
    }
}

export { initLanguageListener, documentLoadedInitLanguageListener, formatFileSize, handleProcessButtonClick, addEnterKeyListener, addClickListener, addCommentEventListener};