import { documentLoadedInitLanguageListener, initLanguageListener, formatFileSize, handleProcessButtonClick, addEnterKeyListener, addClickListener, addCommentEventListener } from "./common.js";

documentLoadedInitLanguageListener();

initLanguageListener();

const textInput = document.getElementById('inputArea');
const ruleInput =  document.getElementById("transformationRule")
const processButton = document.getElementById("processButton");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const commentButton = document.getElementById("commentButton");
const outputArea = document.getElementById('outputArea');
const staticImage = document.getElementById('staticImage');
const dynamicImage = document.getElementById('dynamicImage');
const chartContainer = document.getElementById('chartContainer');
const downloadButton = document.getElementById('downloadButton');


// 调用公共函数
addEnterKeyListener(ruleInput, processButton);
addClickListener(searchButton, processButton);
addCommentEventListener(commentButton);


document.addEventListener("DOMContentLoaded", function() {

    clearButton.addEventListener("click", clearFiles);

    if (processButton) {
        processButton.addEventListener('click', function() { 
            handleProcessButtonClick({
                ruleInput: ruleInput,
                textInput: textInput,
                processButton: processButton,
                searchButton: searchButton,
                processFunction: processFiles,
                inputType: 'text',
                allowEmptyRule: true
            });
        });
    }

    
    const chartInstances = [];

    async function processFiles() {

        // 清除之前生成的图表和内容
        chartContainer.innerHTML = '';
        chartContainer.style.display = 'none';
        // 显示动态图像，隐藏静态图像
        dynamicImage.style.display = 'block';
        staticImage.style.display = 'none';
	    clearChartInstances();
	

        // for test sleep 5 seconds
        //await new Promise(resolve => setTimeout(resolve, 3000));


        // 封装文件属性成 JSON array

        const text = textInput.value;
        const rule = ruleInput.value;
        try {
            // 发起 fetch 请求
            const response = await fetch('/api/img_transform/chart_gen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rule, text })
            });

            // 检查响应状态
            if (!response.ok) {
                throw new Error('Network response was not ok, ' + response.statusText);
            }

            // 解析响应体为 JSON
            const chartConfigData = await response.json();
            console.log('Renamed Result:', chartConfigData);
            const chartConfigs = JSON.parse(chartConfigData.data);
  /*          const chartConfigs = [
                {
                    "type": "bar",
                    "data": {
                        "labels": [
                            "全国规模以上工业企业",
                            "国有控股企业",
                            "股份制企业",
                            "外商及港澳台投资企业",
                            "私营企业",
                            "采矿业",
                            "制造业",
                            "电力、热力、燃气及水生产和供应业"
                        ],
                        "datasets": [
                            {
                                "label": "利润总额 (亿元)",
                                "data": [
                                    27543.8,
                                    9438.4,
                                    20510.5,
                                    6827.8,
                                    7329.3,
                                    5024.5,
                                    19285.7,
                                    3233.6
                                ],
                                "backgroundColor": "rgba(75, 192, 192, 0.2)",
                                "borderColor": "rgba(75, 192, 192, 1)",
                                "borderWidth": 1
                            }
                        ]
                    },
                    "options": {
                        "scales": {
                            "y": {
                                "beginAtZero": true
                            }
                        },
                        "responsive": true
                    }
                },
                {
                    "type": "bar",
                    "data": {
                        "labels": [
                            "有色金属冶炼和压延加工业",
                            "计算机、通信和其他电子设备制造业",
                            "电力、热力生产和供应业",
                            "纺织业",
                            "汽车制造业",
                            "农副食品加工业",
                            "石油和天然气开采业",
                            "通用设备制造业",
                            "化学原料和化学制品制造业",
                            "电气机械和器材制造业",
                            "专用设备制造业",
                            "煤炭开采和洗选业",
                            "非金属矿物制品业",
                            "石油煤炭及其他燃料加工业",
                            "黑色金属冶炼和压延加工业"
                        ],
                        "datasets": [
                            {
                                "label": "利润同比增长率 (%)",
                                "data": [
                                    80.6,
                                    56.8,
                                    35.0,
                                    23.2,
                                    17.9,
                                    17.1,
                                    5.3,
                                    1.8,
                                    -2.7,
                                    -6.0,
                                    -8.8,
                                    -31.8,
                                    -52.9,
                                    -100.0,
                                    -100.0
                                ],
                                "backgroundColor": "rgba(153, 102, 255, 0.2)",
                                "borderColor": "rgba(153, 102, 255, 1)",
                                "borderWidth": 1
                            }
                        ]
                    },
                    "options": {
                        "scales": {
                            "y": {
                                "beginAtZero": true
                            }
                        },
                        "responsive": true
                    }
                }
            ]
                */

            // 隐藏动态图像
            dynamicImage.style.display = 'none';
            chartContainer.style.display = 'block';
            // 动态生成图表
            /*
            chartConfigs.forEach((config, index) => {
                const canvas = document.createElement('canvas');
                canvas.id = `chart${index}`;
                chartContainer.appendChild(canvas);

                const ctx = canvas.getContext('2d');
                new Chart(ctx, config);
            });
            */

            chartConfigs.forEach((config, index) => {
                // 创建容器
                const chartWrapper = document.createElement('div');
                chartWrapper.style.marginBottom = '40px'; // 设置不同 chart 之间的初始上下间距
                chartWrapper.style.position = 'relative'; // 相对定位，用于放大缩小
                chartWrapper.style.zIndex = '1'; // 设置初始层级
            
                // 创建 canvas
                let canvas = document.createElement('canvas');
                canvas.id = `chart${index}`;
                canvas.style.width = '100%'; // 设置 canvas 宽度为 100%
                chartWrapper.appendChild(canvas);
            
                // 创建按钮容器
                const buttonWrapper = document.createElement('div');
                buttonWrapper.style.textAlign = 'center'; // 按钮居中对齐
                buttonWrapper.style.marginTop = '10px'; // 按钮与图表的间距
            
                // 创建按钮
                const createButton = (className, title, onClick) => {
                    const button = document.createElement('button');
                    button.className = className;
                    button.title = title;
                    button.onclick = onClick;
                    return button;
                };
            
                // 复制按钮
                const copyButton = createButton('layui-btn layui-btn-primary layui-icon layui-icon-file', 'Copy', () => {
                    const imgURL = canvas.toDataURL();
                    const tempInput = document.createElement('input');
                    document.body.appendChild(tempInput);
                    tempInput.value = imgURL;
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    // layui message base image copyed
                    layui.layer.msg('base64 copied', {icon: 1, offset: 'rt'});
                });
                buttonWrapper.appendChild(copyButton);
            
                // 下载按钮
                const downloadButton = createButton('layui-btn layui-btn-primary layui-icon layui-icon-download-circle', 'Download', () => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL();
                    link.download = `chart${index}.png`;
                    link.click();
                });
                buttonWrapper.appendChild(downloadButton);
            
                // 放大按钮
                const zoomInButton = createButton('layui-btn layui-btn-primary layui-icon layui-icon-add-circle', 'Enlarge', () => {
                    recreateChart(index, 1.2);
                    zoomInButton.disabled = true;
                    zoomInButton.classList.add('layui-btn-disabled');
                    zoomOutButton.disabled = false;
                    zoomOutButton.classList.remove('layui-btn-disabled');
                });
                buttonWrapper.appendChild(zoomInButton);
            
                // 缩小按钮
                const zoomOutButton = createButton('layui-btn layui-btn-primary layui-icon layui-icon-reduce-circle', 'Reduce', () => {
                    recreateChart(index, 0.8);
                    zoomOutButton.disabled = true;
                    zoomOutButton.classList.add('layui-btn-disabled');
                    zoomInButton.disabled = false;
                    zoomInButton.classList.remove('layui-btn-disabled');
                });
                buttonWrapper.appendChild(zoomOutButton);
            
                // 恢复初始比例按钮
                const resetButton = createButton('layui-btn layui-btn-primary layui-icon layui-icon-refresh', 'Reset', () => {
                    recreateChart(index, 1.0, true);
                    zoomInButton.disabled = false;
                    zoomInButton.classList.remove('layui-btn-disabled');
                    zoomOutButton.disabled = false;
                    zoomOutButton.classList.remove('layui-btn-disabled');
                });
                buttonWrapper.appendChild(resetButton);
            
                // 将按钮容器添加到 chart 容器
                chartWrapper.appendChild(buttonWrapper);
                chartContainer.appendChild(chartWrapper);
            
                const ctx = canvas.getContext('2d');
            
                // 创建 Chart 实例并保存引用
                let chart = new Chart(ctx, config);
                chartInstances.push(chart);
            
                // 保存初始宽高
                chartWrapper.setAttribute('data-initial-width', canvas.style.width);
                chartWrapper.setAttribute('data-initial-height', canvas.style.height);
            
                function recreateChart(index, scale, reset = false) {
                    // 获取当前宽高
                    const initialWidth = parseFloat(chartWrapper.getAttribute('data-initial-width'));
                    const initialHeight = parseFloat(chartWrapper.getAttribute('data-initial-height'));
            
                    // 计算新的宽高
                    const newWidth = reset ? initialWidth : initialWidth * scale;
                    const newHeight = reset ? initialHeight : initialHeight * scale;
            
                    // 移除旧的 canvas
                    canvas.remove();
            
                    // 创建新的 canvas
                    canvas = document.createElement('canvas');
                    canvas.id = `chart${index}`;
                    canvas.style.width = '100%';
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    chartWrapper.insertBefore(canvas, buttonWrapper);
            
                    // 重新创建 Chart 实例
                    chart.destroy();
                    const newCtx = canvas.getContext('2d');
                    chart = new Chart(newCtx, config);

                    // 更新 chartInstances 数组
                    chartInstances[index] = chart;
            
                    // 更新容器的宽高，包含按钮的高度
                    const buttonWrapperHeight = buttonWrapper.offsetHeight;
                    chartWrapper.style.width = `${newWidth}px`;
                    chartWrapper.style.height = `${newHeight + buttonWrapperHeight + 10}px`;
            
                    // 重新绑定按钮事件
                    copyButton.onclick = () => {
                        const imgURL = canvas.toDataURL();
                        const tempInput = document.createElement('input');
                        document.body.appendChild(tempInput);
                        tempInput.value = imgURL;
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        // layui message base image copyed
                        layui.layer.msg('base64 copied', {icon: 1, offset: 'rt'});
                    };
            
                    downloadButton.onclick = () => {
                        const link = document.createElement('a');
                        link.href = canvas.toDataURL();
                        link.download = `chart${index}.png`;
                        link.click();
                    };
            
                    zoomInButton.onclick = () => {
                        recreateChart(index, 1.2);
                        zoomInButton.disabled = true;
                        zoomInButton.classList.add('layui-btn-disabled');
                        zoomOutButton.disabled = false;
                        zoomOutButton.classList.remove('layui-btn-disabled');
                    };
            
                    zoomOutButton.onclick = () => {
                        recreateChart(index, 0.8);
                        zoomOutButton.disabled = true;
                        zoomOutButton.classList.add('layui-btn-disabled');
                        zoomInButton.disabled = false;
                        zoomInButton.classList.remove('layui-btn-disabled');
                    };
            
                    resetButton.onclick = () => {
                        recreateChart(index, 1.0, true);
                        zoomInButton.disabled = false;
                        zoomInButton.classList.remove('layui-btn-disabled');
                        zoomOutButton.disabled = false;
                        zoomOutButton.classList.remove('layui-btn-disabled');
                    };
                }
            });
                     

            layui.layer.msg('Chart generation successfully', {icon: 1, offset: 'rt'});
        } catch (error) {
            console.error('Error during fetch:', error);
            chartContainer.style.display = 'none';
            // 隐藏动态图像
            dynamicImage.style.display = 'none';
            // 显示静态图像
            staticImage.style.display = 'block';
            layui.layer.msg(error.message, {icon: 2, offset: 'rt'});
        }
       
    }

    function clearFiles() {
        textInput.value = '';
        ruleInput.value = '';
        chartContainer.innerHTML = '';
        staticImage.style.display = 'block';
	clearChartInstances();
    }

   function clearChartInstances() {
	if(chartInstances.length > 0) {
		// clear chartInstances
		chartInstances.forEach(chart => chart.destroy());
		// empty chartInstances
		chartInstances.length = 0;
	}
   }


    downloadButton.addEventListener('click', () => {
        const zip = new JSZip();
        const imgFolder = zip.folder("images");
        // check chartInstances
        if (chartInstances.length === 0) {
            layui.layer.msg('Empty image download', {icon: 2, offset: 'rt'});
            return;
        }
        chartInstances.forEach((chart, index) => {
            // 将图表转换为 base64 图片数据
            const dataURL = chart.toBase64Image();
            const imgData = dataURL.split(',')[1];
            imgFolder.file(`chart${index + 1}.png`, imgData, { base64: true });
        });

        zip.generateAsync({ type: "blob" })
            .then((content) => {
                // 通过 FileSaver.js 触发下载
                window.saveAs(content, "charts.zip");
            });
    });
});
