# AI. Transform Enhancer

> 代码仅包含前端部分。

## 项目介绍

本项目旨在通过大模型和AI技术，将自然语言转换为编程语言指令，使得非专业用户可以轻松进行文本转换和处理。

体验地址：[AI. Transform Enhancer](https://ai-reading.me)，PC、手机端均适配

> 项目开发中，上线部分功能

## 录屏展示

### 功能一、文本转化

#### 文本处理

![ai-exchange-录屏](image/ai-exchange.gif)

#### sql生成

![ai-exchange-录屏](image/ai-exchange-2.gif)

### 功能二、文件重命名

![file-rename.gif](https://ai-reading.me/image/ai-exchange-file-rename.gif)

## 功能一、文本转换

> 规则只是示例，有什么要处理的像向朋友请教那样提问

### 1. 正则匹配

规则：`匹配所有电子邮件地址`

输入：

```
请联系test@example.com或support@domain.com获取更多信息。
```

输出：

```
test@example.com, support@domain.com
```

---

输入：上面输出作为新一轮的输入，后续相同

规则：`以, 为分隔符分行展示`

输出：

```
test@example.com
support@domain.com
```

---

规则：`复制第一行5遍`

输出：

```
test@example.com
support@domain.com
test@example.com
support@domain.com
test@example.com
support@domain.com
test@example.com
support@domain.com
test@example.com
support@domain.com
```

---

规则：`行首加序号`

输出：

```
1. test@example.com
2. support@domain.com
3. test@example.com
4. support@domain.com
5. test@example.com
6. support@domain.com
7. test@example.com
8. support@domain.com
9. test@example.com
10. support@domain.com
```

---

规则：`以用户名@domain.com的形式，匹配所有的用户名加上“_xxxx”`

输出：

```
1. test_xxxx@example.com
2. support_xxxx@domain.com
3. test_xxxx@example.com
4. support_xxxx@domain.com
5. test_xxxx@example.com
6. support_xxxx@domain.com
7. test_xxxx@example.com
8. support_xxxx@domain.com
9. test_xxxx@example.com
10. support_xxxx@domain.com
```

---

规则：`删除所有的序号.`

输出：

```
test@example.com
support@domain.com
test@example.com
support@domain.com
test@example.com
support@domain.com
test@example.com
support@domain.com
test@example.com
support@domain.com
```

---

规则：`删除重复行`

输出：

```
test@example.com
support@domain.com
```

---

规则：`按ASCII将行排序`

输出：

```
support@domain.com
test@example.com
```

### 2. sql生成

输入：

```
test test@example.com 中国 130xxxxxxx
support support@domain.com 中国 130xxxxxxx
```
规则：`表为user，字段为name email address phoneNum，以每行数据空格为分隔符，生成insert语句`

输出：

```
INSERT INTO user (name, email, address, phoneNum) VALUES ('test', 'test@example.com', '中国', '130xxxxxxx');
INSERT INTO user (name, email, address, phoneNum) VALUES ('support', 'support@domain.com', '中国', '130xxxxxxx');
```

### 3. markdown格式化

输入：

```
name email address phoneNum
test test@example.com 中国 130xxxxxxx
support support@domain.com 中国 130xxxxxxx
```

规则：`第一行作为表头，以空格为分隔符，转换为markdown格式表格`

输出：

```
|name|email|address|phoneNum|
|---|---|---|---|
|test|test@example.com|中国|130xxxxxxx|
|support|support@domain.com|中国|130xxxxxxx|
```

> 新增格式化功能，和AI无关，前端自动识别代码类型并格式化

## 功能二、文件重命名

> 1. 文件重命名功能可以让AI处理文件名，并且可以引用文件大小、类型、格式、最后修改日期字段，修改后的文件能够zip压缩下载。
> 2. AI负责理解用户输入并对文件名做出匹配修改；
> 3. 文件不传入后端，打包下载在前端完成

### 1. 增加文件属性

输入：

上传文件列表：

```
document1.txt (大小: 2KB, 类型: 文本文件, 最后修改日期: 2024-01-01)
image1.png (大小: 1MB, 类型: 图片文件, 最后修改日期: 2024-01-02)
```


规则：`重命名为文件类型_大小_日期.扩展名`

输出：


```
文本文件_2KB_2024-01-01.txt
图片文件_1MB_2024-01-02.png
```

---

### 2. 为文件增加序号

规则：`为文件增加序号`

输入：

```
document1.txt (大小: 2KB, 类型: 文本文件, 最后修改日期: 2024-01-01)
image1.png (大小: 1MB, 类型: 图片文件, 最后修改日期: 2024-01-02)
```

输出：

```
1_document1.txt
2_image1.png
```

---

### 3. 对文件进行脱敏处理

规则：`对文件名进行脱敏处理`

输入：

```
document1.txt (大小: 2KB, 类型: 文本文件, 最后修改日期: 2024-01-01)
image1.png (大小: 1MB, 类型: 图片文件, 最后修改日期: 2024-01-02)
```


输出：

```
d******1.txt
i******1.png
```

**更多有群的玩法，访问[AI. Transform Enhancer](https://www.ai-reading.me)体验**
