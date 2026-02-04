---
description: 此文介绍了解决VitePress有时对于index页面不能正确地读取其侧边栏配置并为其自动添加上下页链接的问题的方法
head:
  - - meta
    - name: keywords
      content: VitePress,index页面,问题,错误,高亮,上下页链接,侧边栏配置,路径
tags: [VitePress,网站建设]
---

# index页面问题

在使用VitePress的过程中发现，对于子文件夹中的`index.md`文件，有时VitePress不能正确地读取侧边栏配置并为其自动添加上下页链接。

## 现象

在子文件夹内创建`index.md`文件，并在侧边栏配置中写入`/folder/index`路径后，对应`index`页面内没有上页链接，而下页链接指向该页面本身。除此之外，当用户浏览该页面时，侧边栏内对应的标题并不会被高亮。

侧边栏配置示例：

```js{8}
export default {
  themeConfig: {
    sidebar: {
      '/sitelog/': [
        {
          text: '关于网站日志板块',
          items: [
            { text: '网站日志板块简介', link: '/sitelog/index' },
            { text: '网站日志', link: '/sitelog/logs' }
          ]
        }
      ]
    }
  }
}
```

渲染效果示例：

![vitepress-index页面-错误配置](https://img.wizardsbowl.com/2026/01/vitepress-index%E9%A1%B5%E9%9D%A2-%E9%94%99%E8%AF%AF%E9%85%8D%E7%BD%AE-422f1dc0b737f1917cb81fa5de66ccbf.png)

## 解决方法

将侧边栏配置路径中的`index`去除即可。例如，原先为`/folder/index`的路径，需要更改为`/folder/`，注意必须要以`/`结尾。

实测除了侧边栏配置以外，对于网站内其他位置出现的`index`页面链接，加不加`index`对此问题不会产生任何影响。

侧边栏配置示例：

```js{8}
export default {
  themeConfig: {
    sidebar: {
      '/sitelog/': [
        {
          text: '关于网站日志板块',
          items: [
            { text: '网站日志板块简介', link: '/sitelog/' },
            { text: '网站日志', link: '/sitelog/logs' }
          ]
        }
      ]
    }
  }
}
```

渲染效果示例：

![vitepress-index页面-正确配置](https://img.wizardsbowl.com/2026/01/vitepress-index%E9%A1%B5%E9%9D%A2-%E6%AD%A3%E7%A1%AE%E9%85%8D%E7%BD%AE-8b7d6355027a1bb3b6aca44aec6c460f.png)
