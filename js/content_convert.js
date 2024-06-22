layui.use('element', function(){
    var element = layui.element;
});


var ruleInput = document.getElementById('transformationRule');
var textInput = document.getElementById('inputArea');
var processButton = document.getElementById('processButton');
var searchButton = document.getElementById('searchButton');
var swapButton = document.getElementById('swapButton');
var outputArea = document.getElementById('outputArea');
var copyButton = document.getElementById('copyButton');
var clearButton = document.getElementById('clearButton');


// 按下Enter键时触发processButton点击事件
if(ruleInput){
    ruleInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // 防止默认的Enter键行为
            if (!processButton.disabled) {
                processButton.click();
            }
        }
    });
}

if (searchButton) {
    searchButton.addEventListener('click', function() {
        processButton.click();
    });
}


if(ruleInput){
    ruleInput.addEventListener('input', function() {
        if (ruleInput.value.trim() !== '') {
            ruleInput.style.borderColor = ''; // 恢复默认边框颜色
        }
    });
}

if(textInput){
    textInput.addEventListener('input', function() {
        if (textInput.value.trim() !== '') {
            textInput.style.borderColor = ''; // 恢复默认边框颜色
        }
    });
}

if (swapButton) {
    swapButton.addEventListener('click', function() {
        //const input = document.getElementById('inputArea').value;
        const output = outputArea.value;
        if(output === ''){ 
            return;
        }
        document.getElementById('inputArea').value = output;
        document.getElementById('outputArea').value = '';
    });
}

if (copyButton) {
    copyButton.addEventListener('click', function() {
        const outputArea = document.getElementById('outputArea');
        outputArea.select();
        document.execCommand('copy');
        layui.use(['layer'], function(){
            var layer = layui.layer;
            layer.msg('已复制到剪贴板', {icon: 1, time: 2000, offset: 'rt'});
        });
    });
}


if (clearButton) {
    clearButton.addEventListener('click', function() {
        document.getElementById('inputArea').value = '';
        document.getElementById('inputArea').style.borderColor = ''; // 恢复默认边框颜色
    });
}

var githubButton =  document.getElementById('githubButton');
if(githubButton){
    githubButton.addEventListener('click', function() {
        //新的标签页打开地址
        window.open('https://github.com/FengMengZhao/Ai-Exchange', '_blank');
    });
}




if (processButton) {
    processButton.addEventListener('click', function() { 
        var ruleValue = ruleInput.value.trim();
        var inputText = textInput.value.trim();
        // 是否违背规则校验
        var ifRule = false;
        // 是否违背输入校验
        var ifInput = false;

        // 重置错误消息
        ruleErrorTextContent = '';
        ruleInput.style.borderColor = ''; // 重置边框颜色

        // 校验规则输入框
        if(ruleValue === '') {
            ruleErrorTextContent = '规则不能为空';
            ifRule = true;
        }else if(ruleValue.length > 50){
            ruleErrorTextContent = '规则不能超过50个字';
            ifRule = true;
        } 
        if (inputText === '') {
            // ruleErrorTextContent not empty
            if(ruleErrorTextContent.trim() !== ''){
                ruleErrorTextContent += ', ';
            }
            ruleErrorTextContent += '输入不能为空';
            ifInput = true;
        }

        if (ruleErrorTextContent) {
            layui.use(['layer'], function(){
                var layer = layui.layer;
                layer.msg(ruleErrorTextContent, {icon: 2, time: 2000, offset: 'rt'});
            });

            // 边框颜色变红
            if(ifRule){
                ruleInput.style.borderColor = 'red';
            }
            if(ifInput){
                textInput.style.borderColor = 'red';
            }

            return; // 阻止继续执行
        }
        

        // 校验通过，禁用输入框和按钮
        ruleInput.disabled = true;
        textInput.disabled = true;
        processButton.disabled = true;
        searchButton.disabled = true;
        //继续处理
        document.getElementById('outputArea').value = '转换中，请稍等...';

        // 保存原始图标
        const originalIcon = processButton.innerHTML;

        // 插入动态转动图标
        processButton.innerHTML = '<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>';
        processButton.classList.add('button-disabled');
        processButton.classList.remove('layui-icon-transfer');

        // 发起请求
        processText(inputText, ruleValue)
            .finally(() => {
                // 恢复原始图标和按钮状态
                processButton.innerHTML = originalIcon;
                processButton.classList.remove('button-disabled');
                processButton.classList.add('layui-icon-transfer');

                // 重新启用输入框和按钮
                ruleInput.disabled = false;
                textInput.disabled = false;
                processButton.disabled = false;
                searchButton.disabled = false;
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let currentLang = localStorage.getItem('lang') || navigator.language.slice(0, 2) || 'zh'; 
    applyTranslations(currentLang);
});

window.addEventListener('message', (event) => {
    if (event.data.lang) {
        applyTranslations(event.data.lang);
    }
});

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

function processText(text, rule) {
    // send a fetch request to the server
    return fetch('/api/txt_transform/content_convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            rule: rule
        })
    })
    // 解析响应，获取 JSON 数据
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // 将解析后的数据赋值给输出框
        document.getElementById('outputArea').value = data.data; // 假设服务器返回 JSON 格式包含一个名为 result 的字段
        // 清空规则输入框
        document.getElementById('transformationRule').value = '';
        // 前端成功提示, icon: 1表示成功
        layui.use(['layer'], function(){
            var layer = layui.layer;
            // if data.success icon: 1 else icon 2
            layer.msg(data.msg, {icon: data.success ? 1 : 2, offset: 'rt'});
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        // 前端失败提示, icon: 2表示失败
        layui.use(['layer'], function(){
            var layer = layui.layer;
            layer.msg(error.message, {icon: 2, offset: 'rt'});
        });
        document.getElementById('outputArea').value = '';
    });
}