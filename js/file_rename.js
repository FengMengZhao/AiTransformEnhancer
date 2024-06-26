import { documentLoadedInitLanguageListener, initLanguageListener, formatFileSize, handleProcessButtonClick } from "./common.js";

documentLoadedInitLanguageListener();

initLanguageListener();

const ruleInput =  document.getElementById("transformationRule")
const fileList = document.getElementById("fileList");
const outputList = document.getElementById("outputList");
const processButton = document.getElementById("processButton");
const searchButton = document.getElementById("searchButton");
const downloadButton = document.getElementById("downloadButton");
const clearButton = document.getElementById("clearButton");

document.addEventListener("DOMContentLoaded", function() {
    // 初始化layui上传组件
    layui.use(['upload'], function() {
        var upload = layui.upload;
        fileList.files = [];
        // 多文件列表示例
        upload.render({
            elem: '#fileInputButton',
            url: '', // 实际上不需要上传到服务器，因此可以留空
            auto: false,
            multiple: true,
            choose: function(obj) {
                // 将每个选择的文件存储到files数组中
                obj.preview(function(index, file, result) {
                fileList.files.push(file);
			    fileMap.set(file.name, file);
                    // displayFiles(files, fileList);
                    displayFileAttributes(file);
                });
            }
        });
    });

    let files = fileList.files || [];
    let renamedFiles = [];
    let fileMap = new Map();


    //processButton.addEventListener("click", processFiles);
    downloadButton.addEventListener("click", downloadFiles);
    clearButton.addEventListener("click", clearFiles);

    if (processButton) {
        processButton.addEventListener('click', function() { 
            handleProcessButtonClick({
                ruleInput: ruleInput,
                fileInput: fileList,
                processButton: processButton,
                searchButton: searchButton,
                processFunction: processFiles,
                inputType: 'file'
            });
        });
    }



    function displayFiles(files, listElement) {
        listElement.innerHTML = "";
        files.forEach((file, index) => {
            const li = document.createElement("li");
            li.textContent = file.name;
            li.dataset.index = index;
            listElement.appendChild(li);
        });
    }

    function displayFileAttributes(file) {
        const li = document.createElement("li");

        const fileName = document.createElement("div");
        fileName.textContent = `File Name: ${file.name}`;
        fileName.className = "file-attribute file-name";

        const fileSize = document.createElement("div");
        fileSize.textContent = `File Size: ${formatFileSize(file.size)}`;
        fileSize.className = "file-attribute file-size";

        const fileType = document.createElement("div");
        fileType.textContent = `File Type: ${file.type}`;
        fileType.className = "file-attribute file-type";

        const fileLastModified = document.createElement("div");
        fileLastModified.textContent = `Last Modify Date: ${new Date(file.lastModified).toLocaleString()}`;
        fileLastModified.className = "file-attribute file-last-modified";

        li.appendChild(fileName);
        li.appendChild(fileSize);
        li.appendChild(fileType);
        li.appendChild(fileLastModified);

        fileList.appendChild(li);
    }

    async function processFiles() {
        // for test sleep 5 seconds
        //await new Promise(resolve => setTimeout(resolve, 3000));
        const rule = ruleInput.value;
        
        // 封装文件属性成 JSON array
        const fileAttributes = files.map(file => ({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileLastModifyDate: new Date(file.lastModified).toLocaleString()
        }));

        try {
            // 发起 fetch 请求
            const response = await fetch('/test-api/txt_transform/file_rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rule, files: fileAttributes })
            });

            // 检查响应状态
            if (!response.ok) {
                throw new Error('Network response was not ok, ' + response.statusText);
            }

            // 解析响应体为 JSON
            const renamedRes = await response.json();
            console.log('Renamed Result:', renamedRes);
            const renamedData = renamedRes.data;

            // 通过映射关系重命名文件
            renamedFiles = Object.keys(renamedData).map(oldFileName => {
                const newFileName = renamedData[oldFileName];
                const file = fileMap.get(oldFileName);
                return new File([file], newFileName, { type: file.type });
            });

            displayFiles(renamedFiles, outputList);
            layui.layer.msg(renamedRes.msg, {icon: renamedRes.success ? 1 : 2, offset: 'rt'});
        } catch (error) {
            console.error('Error during fetch:', error);
            layui.layer.msg(error.message, {icon: 2, offset: 'rt'});
        }
    }

    function downloadFiles() {
        if (renamedFiles.length === 0) return;

        const zip = new JSZip();
        renamedFiles.forEach(file => {
            zip.file(file.name, file);
        });

        zip.generateAsync({ type: "blob" })
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "renamed_files.zip";
                link.click();
            });
	    clearFiles();
    }

    function clearFiles() {
        files = [];
        renamedFiles = [];
        fileList.innerHTML = "";
        outputList.innerHTML = "";
        document.getElementById("transformationRule").value = "";
    }
});
