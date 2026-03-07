---
title: VitePress选项卡markdown-it插件安装及配置教程
description: 在VitePress中使用mdit-tabs插件，以实现选项卡功能。mdit-tabs插件本身只能将Markdown转换为html，所以后续需要手动添加css样式以及js代码。
head:
  - - meta
    - name: keywords
      content: VitePress,markdown-it,插件,plugin-tab,tabs,选项卡,css,样式,事件绑定,切换
tags: [VitePress,网站建设,markdown-it,插件]
---

# VitePress选项卡markdown-it插件安装及配置教程

我之前在写[红魔乡图片解包](https://www.wizardsbowl.com/touhou/patch/eosd-png-unpack.html){rel=nofollow}这篇文章的过程中，因为需要展示图片对比效果，就想到用一个选项卡来实现。然而VitePress自带的类似功能只有代码组，虽然是选项卡，但只能用来展示代码。所以，就需要安装其他插件来实现这个功能。

## plugin-tab插件

我选择了一个markdown-it插件，[@mdit/plugin-tab](https://www.npmjs.com/package/@mdit/plugin-tab)（[文档](https://mdit-plugins.github.io/zh/tab.html)）。

这个插件还有一个实用的小功能：

> 为了支持全局标签切换状态，该插件允许你在 `tabs` 容器中添加一个 id 后缀，它将用作标签 id，并且还允许你在 `@tab` 标记中添加一个 id 后缀，将被使用作为选项卡值。 因此，你可以让所有具有相同 ID 的选项卡共享相同的切换事件。

## 安装插件

使用npm安装：

```bash
npm i -D @mdit/plugin-tab
```

加载插件：

::: code-group
```ts{5-7} [.vitepress/config.mts]
import { tab } from "@mdit/plugin-tab";
export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(tab, {
        name: 'tabs'
      });
    }
  }
})
```
:::

开发过程中可能因为缺少[markdown-it](https://www.npmjs.com/package/markdown-it)报错，安装后解决：

```bash
npm i -D markdown-it
```

## 插件的局限性

然而，作为一个Markdown插件，plugin-tab只能将你的Markdown代码转换为html代码，却不能提供任何css样式或js代码。

!!也就是说上面那个小功能需要你自己进一步实现。!!!!或者照抄我的!!

下面介绍手动添加css样式以及js代码的方法。

## 添加CSS样式

编辑css文件：

::: code-group
```css [.vitepress/theme/css/tabs.css]
.tabs-tabs-wrapper {
    margin-top: 16px;
    border: 1px solid var(--vp-code-tab-divider);
    border-radius: 8px;
}

.tabs-tabs-wrapper .tabs-tabs-header {
    position: relative;
    display: flex;
    padding: 0 12px;
    background-color: var(--vp-code-tab-bg);
    overflow-x: auto;
    overflow-y: hidden;
}

.tabs-tabs-wrapper .tabs-tabs-header button.tabs-tab-button {
    position: relative;
    display: inline-block;
    padding: 0 12px;
    line-height: 48px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-code-tab-text-color);
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.25s;

    &::after {
        position: absolute;
        right: 8px;
        bottom: 0px;
        left: 8px;
        z-index: 1;
        height: 2px;
        border-radius: 2px;
        content: '';
        background-color: transparent;
        transition: background-color 0.25s;
    }

    &.active {
        color: var(--vp-code-tab-active-text-color);

        &::after {
            background-color: var(--vp-code-tab-active-bar-color);
        }
    }
}

.tabs-tabs-wrapper .tabs-tabs-container .tabs-tab-content {
    position: relative;
    padding: 16px 12px;
    display: none;

    &.active {
        display: block;
    }
}

@media (max-width: 640px) {
    .tabs-tabs-wrapper {
        .VPDoc & {
            margin-left: -22px;
            margin-right: -22px;
        }

        .VPDoc .tabs-tab-content & {
            margin-left: -10px;
            margin-right: -10px;
        }
    }
}
```
:::

引入css文件：

::: code-group
```ts [.vitepress/theme/index.ts]
import './css/tabs.css'
```
:::

## 添加JS代码

编辑ts文件：

::: code-group
```ts [.vitepress/theme/composables/mditTab.ts]
import { inBrowser, onContentUpdated } from 'vitepress'

export function useMditTab(): void {
    if (inBrowser) {
        window.addEventListener('click', (event) => {
            const el = event.target as Element;
            if (el.matches('button.tabs-tab-button')) {
                if (el.classList.contains('active')) return;

                const index = el.getAttribute('data-tab');
                if (!index) return;

                const wrapper = el.parentElement?.parentElement;
                if (!wrapper) return;

                const wrapperId = wrapper.getAttribute('data-id');
                const tabId = el.getAttribute('data-id');
                if (wrapperId && tabId) {
                    document.querySelectorAll(`.tabs-tabs-wrapper[data-id="${wrapperId}"]`).forEach(w => {
                        activateTab(w, tabId, true);
                    });
                }
                else {
                    activateTab(wrapper, index);
                }
            }
        });
    }
}

function activateTab(wrapper: Element, key: string, useId: boolean = false): void {
    const header = wrapper.querySelector(':scope > .tabs-tabs-header');
    if (!header) return;

    const container = wrapper.querySelector(':scope > .tabs-tabs-container');
    if (!container) return;

    Array.from(header.children).forEach(child => {
        child.classList.remove('active');
    });

    Array.from(container.children).forEach(child => {
        child.classList.remove('active');
    });

    const targetButton = header.querySelector(`:scope > .tabs-tab-button[${useId ? "data-id" : "data-tab"}="${key}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }

    const targetTab = container.querySelector(`:scope > .tabs-tab-content[${useId ? "data-id" : "data-index"}="${key}"]`);
    if (targetTab) {
        activateElement(targetTab);
    }
}

function activateElement(el: Element): void {
    el.classList.add('active')
    window.dispatchEvent(
        new CustomEvent('mdit:TabsTabActivate', { detail: el })
    )
}
```
:::

引入ts文件：

::: code-group
```ts{4} [.vitepress/theme/index.ts]
import { useMditTab } from './composables/mditTab'
export default {
  setup() {
    useMditTab();
  }
} satisfies Theme
```
:::

这份代码实现了绑定点击事件，并可以按照id同步切换多个选项卡。

我没有去特意支持开发时动态热更新，不过似乎也没有什么问题。

值得注意的是，如果使用我的这份代码的话，每一组选项卡都必须指定一个初始就为`active`的选项卡，因为这份代码并不会自动激活任何一个未被点击的选项卡。

!!然而即使所有选项卡都被折叠也不算太丑。!!

## 效果展示

同步激活以及嵌套效果：

::: tabs#fruit

@tab:active 苹果#apple

一个苹果

@tab 香蕉#banana

两根香蕉

@tab 葡萄#grape

三串葡萄

:::

::: tabs

@tab:active 语文

甲乙丙丁

  ::: tabs#fruit
  
  @tab:active 苹果#apple
  
  一个苹果
  
  @tab 香蕉#banana
  
  两根香蕉
  
  @tab 葡萄#grape
  
  三串葡萄
  
  :::

@tab 数学

1234

  ::: tabs#se
  
  @tab:active 谷歌#google
  
  Google
  
  @tab 必应#bing
  
  Bing
  
  @tab 百度#baidu
  
  Baidu
  
  :::

@tab 英语

ABCD

  ::: tabs
  @tab:active 那
  是
    ::: tabs
    @tab:active 一
    条
      ::: tabs
      @tab:active 神
      奇
        ::: tabs
        @tab:active 天
        路
        :::
      :::
    :::
  :::

:::

::: tabs#se

@tab:active 谷歌#google

Google

@tab 必应#bing

Bing

@tab 百度#baidu

Baidu

:::

初始不指定`active`的效果：

::: tabs

@tab 狗

（可以当默认折叠的容器使用）

@tab 猫

~~（虽然展开后收不回去）~~

@tab 鼠

@@@@（看不见我）@@@@

:::
