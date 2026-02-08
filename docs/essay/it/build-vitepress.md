---
description: 构建VitePress仓库时遇到安装依赖失败、构建也失败的问题。可能的原因包括下载Playwright的脚本失败，缺失相关的包从而产生未知指令错误，项目的补丁没有正确安装等等。
head:
  - - meta
    - name: keywords
      content: VitePress,依赖,安装,构建,错误,失败,npm,pnpm,Playwright,脚本,未知指令,缺少补丁
tags: [随笔,VitePress]
---

# 构建VitePress

此页面记录了我在构建[VitePress](https://github.com/vuejs/vitepress)项目时遇到的问题。

## 安装依赖

参照VitePress的[贡献指南](https://github.com/vuejs/vitepress/blob/main/.github/contributing.md)，其使用了[pnpm](https://pnpm.io/zh/installation)作为包管理器，故需要pnpm环境。

下载依赖包的过程中，我这里没有出现问题。然而，依赖安装完毕之后，它又开始自动运行[Playwright](https://playwright.dev/docs/intro)安装脚本。我这里始终无法完成Playwright的下载，到最后发现是因为它请求了一个不存在的资源[playwright chromium-headless-shell v1208](https://cdn.playwright.dev/builds/cft/145.0.7632.6/win64/chrome-headless-s)。

对此，只需使用`--ignore-scripts`选项，忽略安装过程中的脚本，即可完成依赖安装。

```bash
pnpm install --ignore-scripts
```

## 构建项目

这里的说的“构建”，其实就是指运行`pnpm run docs`命令来启动本地服务器。

最开始我构建时，总是构建失败，并且能在命令行输出中看到类似“未知的命令xxx”这样的提示!!这个提示有时候还会乱码!!。后来发现，其实就是缺少了相关的包，直接运行指令`npm install -g xxx`全局安装相关的包就好。（可能需要全局安装好几个）

然而，构建输出里还是有错误，说什么“模块`markdown-it-attrs`不包含导出项`MarkdownItAttrsOptions`”类似这样的话。然而，我在[markdown-it-attrs](https://github.com/arve0/markdown-it-attrs)的代码里并没有找到`MarkdownItAttrsOptions`这个关键字。一开始我想着可能是因为这个插件更新了，后来才发现，原来这个关键字是VitePress自己定义的。VitePress项目里有一个`patches`文件夹，可见它是用了pnpm的[补丁](https://pnpm.io/zh/cli/patch)功能的。在一个补丁中，它自定义了`MarkdownItAttrsOptions`这样一个接口。

pnpm的补丁是在安装依赖时自动应用的。如果之前安装依赖的操作因为下载Playwright失败而中断，就不会应用这些补丁，自然也就找不到这个在补丁中自定义的关键字。只要依照前面说的，忽略脚本并完成安装即可。
