---
description: 记录了VitePress默认主题的导航栏有时会错误地高亮的问题，分析了问题产生的原因以及解决方法
head:
  - - meta
    - name: keywords
      content: VitePress,导航栏,高亮,错误,列表,子项,同时,多个,正则表达式,匹配
tags: [VitePress,网站建设]
---

# 导航栏高亮问题

刚才遇到了VitePress默认主题的导航栏有时会错误地高亮的问题，在此记录一下。

## 发现问题

原先我的导航栏配置大概长这样：

```ts
nav: [
  {
    text: "MC",
    activeMatch: "/minecraft/",
    items: [
      { text: "板块简介", link: "/minecraft/" },
      { text: "工具软件", link: "/minecraft/software/mspm-old" },
    ],
  },

  {
    text: "软件",
    activeMatch: "/software/",
    items: [
      { text: "板块简介", link: "/software/" },
      { text: "实用工具", link: "/software/utility/alpha-pixel-image" },
      { text: "FUN", link: "/software/fun/boids-test" },
    ],
  },
];
```

很快我发现一个问题，就是在`/minecraft/software/mspm-old`页面下，导航栏内的`MC`和`软件`两项都会被高亮显示。

再次阅读[官方文档](https://vitepress.dev/zh/reference/default-theme-nav#customize-link-s-active-state)后，我才意识到，原来这个`activeMatch`字段是一个正则表达式，而`/minecraft/software/mspm-old`这个路径同时匹配了`/minecraft/`和`/software/`两个正则表达式，于是导航栏内的两项同时都被高亮了。

解决办法显而易见，就是修改`activeMatch`字段，让它只匹配字符串的开头就好了。

```ts{4,13}
nav: [
  {
    text: "MC",
    activeMatch: "^/minecraft/",
    items: [
      { text: "板块简介", link: "/minecraft/" },
      { text: "工具软件", link: "/minecraft/software/mspm-old" },
    ],
  },

  {
    text: "软件",
    activeMatch: "^/software/",
    items: [
      { text: "板块简介", link: "/software/" },
      { text: "实用工具", link: "/software/utility/alpha-pixel-image" },
      { text: "FUN", link: "/software/fun/boids-test" },
    ],
  },
];
```

## 发现BUG

使用正则表达式后，上述问题依然存在，排查过后发现是VitePress的[相关代码](https://github.com/vuejs/vitepress/blob/2e36f5c3125252cc50b03c2db534edc91bed9b2f/src/client/theme-default/components/VPNavBarMenuGroup.vue#L20)出了问题。

需要说明的是，VitePress有一个特性，就是当导航栏列表组内的任何一项被匹配并高亮时，该列表组的标题总是会高亮。

列表项自身的高亮代码并没有毛病，然而在列表组标题判断它的子项是否被高亮时，这里出了点岔子。

原先的相关代码如下：

```ts{7,8}
const isChildActive = (navItem: DefaultTheme.NavItem) => {
  if ('component' in navItem) return false

  if ('link' in navItem) {
    return isActive(
      page.value.relativePath,
      typeof navItem.link === "function" ? navItem.link(page.value) : navItem.link,
      !!props.item.activeMatch
    )
  }

  return navItem.items.some(isChildActive)
}
```

其中，`props.item`是包含列表标题的导航栏列表组，`navItem`是列表组内的一个列表项。

`isActive`函数定义如下：

```ts
export function isActive(
  currentPath: string,
  matchPath?: string,
  asRegex: boolean = false
): boolean { ... }
```

可以发现，当列表组使用正则表达式时即`!!props.item.activeMatch`为`true`时，它在遍历自己的子项时，会错误地把子项的`link`字段当作正则表达式去匹配当前页面的相对路径，不论那个子项是否启用了正则表达式。

## 修复BUG

要修复的话，在调用`isActive`函数时判断一下每一个子项是否启用了正则表达式就好。

```ts{7,8}
const isChildActive = (navItem: DefaultTheme.NavItem) => {
  if ('component' in navItem) return false

  if ('link' in navItem) {
    return isActive(
      page.value.relativePath,
      navItem.activeMatch ? navItem.activeMatch : (typeof navItem.link === "function" ? navItem.link(page.value) : navItem.link),
      !!navItem.activeMatch
    )
  }

  return navItem.items.some(isChildActive)
}
```

## 应对方法

### 等待更新

目前，修复该BUG的相关PR已被合并，等到VitePress下个版本发布就好。

### 缓兵之计

使用[patch-package](https://www.npmjs.com/package/patch-package)为你的`node_modules`打补丁，无需等待VitePress更新。
