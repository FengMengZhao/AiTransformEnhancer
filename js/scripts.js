layui.use('element', function(){
    var element = layui.element;

    // 默认选中导航中的“首页”
    var navLinks = document.querySelector('.nav-links a');
    if (navLinks) {
        navLinks.classList.add('layui-this');
    }

    // 默认展开侧边栏中的“文本转换”
    var navItem = document.querySelector('.layui-nav-itemed');
    if (navItem) {
        navItem.classList.add('layui-this');
    }
});

var ruleInput = document.getElementById('transformationRule');
var textInput  = document.getElementById('inputArea')

var processButton = document.getElementById('processButton');
if (processButton) {
    processButton.addEventListener('click', function() { 
        var ruleValue = ruleInput.value.trim();
        var inputText = textInput.value.trim();
        // 是否违背规则校验
        var ifRule = false
        // 是否违背输入校验
        var ifInput = false

        // 重置错误消息
        ruleErrorTextContent = '';
        ruleInput.style.borderColor = ''; // 重置边框颜色

        // 校验规则输入框
        if(ruleValue === '') {
            ruleErrorTextContent = '规则不能为空';
            ifRule = true
        }else if(ruleValue.length > 50){
            ruleErrorTextContent = '规则不能超过50个字';
            ifRule = true
        } 
        if (inputText === '') {
            ruleErrorTextContent += '，输入不能为空';
            ifInput = true
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
        

        // 校验通过，继续处理逻辑
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
            });
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


var swapButton = document.getElementById('swapButton');
if (swapButton) {
    swapButton.addEventListener('click', function() {
        //const input = document.getElementById('inputArea').value;
        const output = document.getElementById('outputArea').value;
        document.getElementById('inputArea').value = output;
        document.getElementById('outputArea').value = '';
    });

}

var copyButton = document.getElementById('copyButton');
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

var clearButton = document.getElementById('clearButton');
if (clearButton) {
    clearButton.addEventListener('click', function() {
        document.getElementById('inputArea').value = '';
        document.getElementById('inputArea').style.borderColor = ''; // 恢复默认边框颜色
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
    });
}

