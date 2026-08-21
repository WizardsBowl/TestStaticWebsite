---
title: HTML原生对话框无法关闭，执行close()方法后窗口不消失
description: WEB开发时遇到了HTML原生对话框无法关闭的问题，排查后发现是CSS覆盖造成的，需要更改CSS。
head:
  - - meta
    - name: keywords
      content: web,dialog,对话框,关闭,css
tags: [编程,web]
---

# HTML原生对话框无法关闭，执行close()方法后窗口不消失

我在尝试使用HTML原生的对话框 [\<dialog\>](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/dialog) 时遇到了问题：点击对话框内按钮，执行close()方法后，对话框无法关闭。模态对话框自带的遮罩层消失了，但是窗口本身并没有消失。点击对话框外部，对话框仍然显示。然而，点击对话框内部空白处后，对话框立即消失（此前已经执行过 [close()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) 方法）。

## 问题分析

一开始我以为是输入焦点的问题。然而，询问AI后我确认是CSS样式覆盖的问题。首先，`close()`方法的大致原理就是移除`<dialog>`元素的`open`属性，用户代理样式表会设置`dialog:not([open])`为`display: none;`，然后对话框就消失了（过程描述不保证完全准确）。一开始我直接给`dialog`元素上了`display: flex;`样式，导致`flex`取代了原本的`none`，于是对话框不会消失，而`dialog::backdrop`会正常消失。

## 解决办法

总的来说就是避免CSS覆盖。

1. 更改CSS选择器，从`dialog`到`dialog[open]`，这样就不会影响`dialog:not([open])`时的样式。
2. 不要给`dialog`设置`display`样式，在`<dialog>`元素内添加`<div>`标签，再给这个`<div>`设置`display`样式。
3. ~~`dialog { display: none !important; }`~~。

## 还有疑问？

虽然但是，一开始，为什么点击对话框内空白处会导致对话框立即消失？

呃...我也不知道，你可以尝试阅读[HTML标准](https://html.spec.whatwg.org/multipage/interactive-elements.html#close-the-dialog)，但我是懒得去看了。
