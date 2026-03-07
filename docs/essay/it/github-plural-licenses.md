---
title: GitHub一个仓库多个许可，向同一个仓库中添加多个许可/开源协议的方法
description: 介绍如何在GitHub的单个仓库中使用多个许可（LICENSE/开源协议）。
head:
  - - meta
    - name: keywords
      content: GitHub,许可,LICENSE,开源协议,单个仓库,同一仓库,多个许可,多个协议
tags: [随笔,GitHub]
---

# GitHub一个仓库多个许可，向同一个仓库中添加多个许可/开源协议的方法

介绍如何在GitHub的单个仓库中使用多个许可（LICENSE/开源协议）。

## 添加许可文件

在GitHub仓库主页，点击Add file->Create new file。

![github-添加文件](https://img.wizardsbowl.com/2026/02/github-%E6%B7%BB%E5%8A%A0%E6%96%87%E4%BB%B6-0fa86a6796516a297b7fefb53fcf16a6.png)

## 文件命名规范

在文件名栏输入“LICENSE-XXX”。

如果下方出现“Choose a license template”按钮，则说明识别成功，许可文件名格式正确。

![github-license文件名识别](https://img.wizardsbowl.com/2026/02/github-license%E6%96%87%E4%BB%B6%E5%90%8D%E8%AF%86%E5%88%AB-aeabd619323a06abf37c63d457101949.png)

大概的识别规则如下：

- 文件名必须以单词“LICENSE”开头。
- 一般主要许可没有后缀，而第二、第三等等许可需要加上后缀以区分。
- 开头的“LICENSE”与后缀之间要有分隔符，比如连字符`-`等等。
- 连字符后可以加很多乱七八糟的字符，甚至是中文字符，但是不能有数字。
- 文件后缀名可以没有，也可以是`.txt`、`.md`等等。
- 具体的识别规则以输入后有没有显示“Choose a license template”为准，自己多尝试一下。

## 添加许可内容

文件名识别成功之后，可以自己复制相关的许可条款过来，也可以点击“Choose a license template”按钮使用GitHub预置的模板。

目前预置的许可列表如下：

- Apache License 2.0
- GNU General Public License v3.0
- MIT License
- BSD 2-Clause "Simplified" License
- BSD 3-Clause "New" or "Revised" License
- Boost Software License 1.0
- Creative Commons Zero v1.0 Universal
- Eclipse Public License 2.0
- GNU Affero General Public License v3.0
- GNU General Public License v2.0
- GNU Lesser General Public License v2.1
- Mozilla Public License 2.0
- The Unlicense

## 重复操作

按照上述步骤，重复多次，即可添加多个许可。

添加多个许可后，应当说明每个许可分别适用于仓库的哪些部分。
