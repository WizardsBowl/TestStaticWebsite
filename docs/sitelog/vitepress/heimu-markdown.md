---
description: 此文介绍了利用markdown-it插件实现像萌娘百科那样的黑幕文本的效果
head:
  - - meta
    - name: keywords
      content: VitePress markdown-it 插件 黑幕 黑幕文本 剧透 剧透文本 heimu spoiler Markdown
tags: [VitePress,网站建设,markdown-it,插件]
---

# 黑幕文本Markdown插件

想要实现像萌百那样的黑幕文本，或者说剧透文本(Spoiler)的效果，但是显然Markdown的标准语法是不包含这个的。

首先想到的是自制插件实现。

## 动手制作插件

从VitePress的[官方文档](https://vitepress.dev/zh/guide/markdown#advanced-configuration)了解到其使用了[markdown-it](https://github.com/markdown-it/markdown-it)来渲染Markdown文件，所以我们实际上就是要编写一个markdown-it插件。

### 了解mdit的原理

根据markdown-it官方给出的[开发指导](https://github.com/markdown-it/markdown-it/tree/master/docs)，开发插件之前至少需要清楚markdown-it的工作原理，比如`Token`，`Rules`这些概念。然而我把文档读了几遍都还没有什么印象（就算曾经有写此文时也忘得差不多了），就决定“借鉴”一下别人现成的插件。

### 修改现有插件

[搜索NPM包](https://www.npmjs.org/browse/keyword/markdown-it-plugin)之后，找了一个逻辑比较简单的插件[markdown-it-sub](https://www.npmjs.com/package/markdown-it-sub)，简单改动后得到以下代码。

::: code-group

```mjs [.vitepress/markdown-it-plugins/heimu.mjs]
// same as UNESCAPE_MD_RE plus a space
const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g;

function subscript(state, silent) {
  const max = state.posMax;
  const start = state.pos;

  const mark = '@@'; // 自定义标记

  if (!state.src.startsWith(mark, start)) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 * mark.length >= max) { return false; }

  state.pos = start + mark.length;
  let found = false;

  while (state.pos < max) {
    if (state.src.startsWith(mark, state.pos)) {
      found = true;
      break;
    }

    state.md.inline.skipToken(state);
  }

  if (!found || start + mark.length === state.pos) {
    state.pos = start;
    return false;
  }

  const content = state.src.slice(start + mark.length, state.pos);

  // don't allow unescaped spaces/newlines inside
  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + mark.length;

  // Earlier we checked !silent, but this implementation does not need it
  const token_so = state.push('heimu_open', 'span', 1);
  token_so.markup = mark;

  const token_t = state.push('text', '', 0);
  token_t.content = content.replace(UNESCAPE_RE, '$1');

  const token_sc = state.push('heimu_close', 'span', -1);
  token_sc.markup = mark;

  state.pos = state.posMax + mark.length;
  state.posMax = max;
  return true;
}

export default function heimu_plugin(md) {
  md.inline.ruler.after('emphasis', 'heimu', subscript);
  
  var defaultRender = md.renderer.rules.heimu_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.heimu_open = function (tokens, idx, options, env, self) {
    // Add a new `target` attribute, or replace the value of the existing one.
    tokens[idx].attrSet('class', 'heimu');

    // 添加title属性以提供悬停提示
    tokens[idx].attrSet('title', '你知道的太多了');

    // Pass the token to the default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };
};
```

:::

其主要逻辑就是在默认导出函数`heimu_plugin`中挂载`subscript`函数作为一个`Rule`，实现对Markdown源文件的解析，找到标签的起始点，设置一些`Token`，最后设置HTML元素的`class`和`title`属性。

此外还需要利用css给拥有`heimu`类的元素添加样式。

::: code-group

```css [.vitepress/theme/css/heimu.css]
:root {
    --wzb-heimu-bg-color: #252525;
    --wzb-heimu-text-color: #252525;
}

.dark{
    --wzb-heimu-bg-color: #eeeeee;
    --wzb-heimu-text-color: #eeeeee;
}

.heimu {
    color: var(--wzb-heimu-text-color);
    background-color: var(--wzb-heimu-bg-color);
    text-shadow: none;
    transition: color 0.13s linear, background-color 0.13s linear, text-shadow 0.13s linear;
}

.heimu:active, .heimu:hover {
    color: unset;
    background-color: unset;
    text-shadow: unset;
}
```

:::

通过设置变量的方式使得黑幕文本支持暗色主题。

### 加载mdit插件

修改`config.mts`文件和`index.mts`文件如下。

::: code-group

```mts{5} [.vitepress/config.mts]
import heimu from './markdown-it-plugins/heimu.mjs'
export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(heimu); // 加载插件
    }
  }
})
```


```mts{4} [.vitepress/theme/index.mts]
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './css/heimu.css' // 加载css

export default {
  extends: DefaultTheme
} satisfies Theme
```

:::

## 换用现有插件

### 上述方法的问题

使用上述方法制作的插件，虽然实现了黑幕效果，但其内部却不能存在其他效果，比如在黑幕文本内部使用强调语法，会直接显示出星号。

**Markdown示例**

```md
黑幕在强调内：**外部@@内部@@外部**

强调在黑幕内：@@外部**内部**外部@@
```

**渲染效果**

黑幕在强调内：**外部@@内部@@外部**

强调在黑幕内：@@外部**内部**外部@@

### 换用spoiler插件

出现上述问题的原因还是在于sub插件的需求比较简单，没有处理`Token`内部的其他`Token`（甚至还专门写了逻辑避免内部出现Markdown语法）。

那么为了实现更为复杂的功能，就需要参考其他插件。不过这里就要涉及到一些较为复杂的对于`Token`等等的处理，我最终还是选择了使用现有插件。

我最终安装的插件是[@mdit/plugin-spoiler - npm](https://www.npmjs.com/package/@mdit/plugin-spoiler)。

安装插件之后，还需要设置选项，使该插件渲染的元素套用`heimu`类的样式。

::: code-group

```mts{5-8} [.vitepress/config.mts]
import { spoiler } from "@mdit/plugin-spoiler"
export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(spoiler, {
        tag: 'span',
        attrs: [["class", "heimu"], ['title', '你知道的太多了'], ["tabindex", "-1"]]
      });
    }
  }
})
```

:::

!!然后就可以在黑幕内部*使用***强调*****语法***了。!!

!!甚至黑幕内@@还能有黑幕@@（套娃）!!

### 处理链接文本

然而直接在黑幕内部使用一些其他效果，还是有可能产生问题的。比如在黑幕内部的链接文本，虽然背景为黑色，但文本仍为原色。

大致效果!!是<a href="#处理链接文本" style="color: var(--vp-c-brand-1);">这样</a>的!!。

解决方法就是改良css逻辑，利用[CSS优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Guides/Cascade/Specificity)单独定义黑幕内部`<a>`标签的样式。

最终确定的css如下。

::: code-group

```css [.vitepress/theme/css/heimu.css]
:root {
    --wzb-heimu-bg-color: #252525;
    --wzb-heimu-text-color: #252525;
}

.dark{
    --wzb-heimu-bg-color: #eeeeee;
    --wzb-heimu-text-color: #eeeeee;
}

.heimu {
    color: var(--wzb-heimu-text-color);
    background-color: var(--wzb-heimu-bg-color);
    text-shadow: none;
    transition: color 0.13s linear, background-color 0.13s linear, text-shadow 0.13s linear;
}

.heimu:active, .heimu:hover {
    color: unset;
    background-color: unset;
    text-shadow: unset;
}

.vp-doc .heimu a {
    color: var(--wzb-heimu-text-color);
    text-shadow: none;
    transition: color 0.13s linear, background-color 0.13s linear, text-shadow 0.13s linear;
}

.vp-doc .heimu:active a, .vp-doc .heimu:hover a {
    color: var(--vp-c-brand-1);
    text-shadow: unset;
}
```

:::

!!之后黑幕内部的[链接](#处理链接文本)就不会暴露了。!!
