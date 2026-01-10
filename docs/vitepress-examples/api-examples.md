---
outline: deep
---

# Runtime API Examples

::: tip
此页面为VitePress项目自带，我并没有删除它，但也不打算翻译它。  
如果需要你可以看一看[VitePress的官网](https://vitepress.dev/zh/guide/what-is-vitepress)。
:::

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
*由于输出内容过长，我禁用了它*

```md
<pre>{{ theme }}</pre>
```

### Page Data
*由于输出内容过长，我禁用了它*

```md
<pre>{{ page }}</pre>
```

### Page Frontmatter
*由于输出内容过长，我禁用了它*

```md
<pre>{{ frontmatter }}</pre>
```

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).
