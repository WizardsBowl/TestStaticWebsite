# 下载计数组件

此文介绍了通过编写一个[Vue组件](https://cn.vuejs.org/guide/essentials/component-basics.html)，实现显示文件下载次数的功能。

## 统计文件下载数

统计文件下载次数需要在后端进行，并且由于此方案未使用SSR，需要公开查询API。

详见[R2&D1&Workers联动](../cloudflare/r2-d1-workers)。

## 编写组件

为了使组件实例在Markdown中能够接受参数，需要使用Vue的[Props](https://cn.vuejs.org/guide/components/props.html)特性。

然后在组件的[onMounted钩子](https://cn.vuejs.org/api/composition-api-lifecycle.html#onmounted)中fetch我们的api，获取下载次数，更新页面数据。

::: code-group

```vue [.vitepress/theme/components/DownloadCounter.vue]
<script setup lang="ts">

import { ref, onMounted } from "vue";

const props = defineProps<{ // 使用Props接受文件名和下载链接属性
    fileName: string,
    filePath: string
}>()

const count = ref<number>(0); // 文件下载次数

onMounted(async () => {
    try {
        const response = await fetch(`https://api.example.com/downloads?file=${encodeURIComponent(props.filePath)}`);
        const data = await response.json();
        if (data && typeof data.count === 'number') {
            count.value = data.count;
        }
    } catch (error) {
        console.error('Failed to fetch download count:', error);
    }
});

</script>

<template>
    <span class="download-counter">下载链接：<a :href="filePath" target="_self">{{ fileName }}</a> 下载次数：{{ count }}</span>
</template>
```

:::

## 注册组件

这里选用全局注册的方式，修改`index.ts`如下。

::: code-group

```ts [.vitepress/theme/index.ts]
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import DownloadCounter from './components/DownloadCounter.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('DownloadCounter', DownloadCounter)
  }
} satisfies Theme
```

:::

这里可能会报错：**找不到模块“.vue”或其相应的类型声明。ts(2307)**

这是因为TypeScript默认无法识别.vue文件类型，需要添加`env.d.ts`声明其类型。

::: code-group

```ts [.vitepress/env.d.ts]
/// <reference types="vite/client" />
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
```

:::

## 使用组件

该组件的使用非常简单，由于已经进行了全局注册，直接在Markdown中引用即可。

```md
<DownloadCounter fileName="archive.zip" filePath="https://r2.example.com/archive.zip" />
```

## CORS问题

如果查询API没有与博客部署在同一域名下，可能会因为[跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/CORS)问题导致API访问请求失败，此时请参考[这篇文章](../cloudflare/cors-rules.md)。
