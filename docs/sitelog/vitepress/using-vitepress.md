---
description: 介绍本人发现和使用VitePress作为静态站点生成器的经历
head:
  - - meta
    - name: keywords
      content: VitePress,静态站点,静态站点生成器,域名,博客
tags: [VitePress,网站建设]
---

# 使用VitePress

域名只连接到`Hello World`Worker又有什么用呢？得有实际页面内容才行。

## 选择VitePress

曾经想过自己从零构建一个网站，自己手写每一行`html`、`js`和`css`，不过也只想了三秒钟。

然后就在网上搜索（静态）站点生成工具，也忘了看的是哪一篇文章了，反正文章里首先介绍的就是[VitePress](https://vitepress.dev/zh/)，于是就选了它。

@@感觉我建站的历程里充满了“看见的第一个是啥就选啥”这种感觉。(lll￢ω￢)@@

## 后悔了...吗？

后来我才意识到，其实VitePress并不适合用来做博客，它更适合用来做文档网站。它不原生支持页面列表、文章标签、归档等等功能。相比之下，还是[Hugo](https://gohugo.io/)一类的更适合用来做博客网站。

然而，又想到这样会促使我去学习如何给VitePress编写插件一类的东西，我又觉得这是一个学习的好机会。@@其实有现成的插件@@@@就是爱折腾@@

其实，我目前已经因此@@被迫@@学了一点（真的只有一点点）关于[markdown-it](https://github.com/markdown-it/markdown-it)、[Vue](https://cn.vuejs.org)等的内容。学完之后能搞出来一点东西，还是很有成就感的。

还有，个人真的很喜欢文档网站那种所有文章都组织好陈列在侧边栏的风格，查找起来特别方便!!，虽然要靠作者手动整理!!。
