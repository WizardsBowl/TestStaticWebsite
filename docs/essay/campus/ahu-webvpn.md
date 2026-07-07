---
title: 安徽大学WebVPN网页链接构成分析
description: 资源访问控制网关（WebVPN）是一种用于远程访问内部网络资源的常见技术。本文的写作源于使用校园网平台时对浏览器上方地址栏里一长串“乱码”的疑惑。
head:
  - - meta
    - name: keywords
      content: AHU,安徽大学,WebVPN,AES加密,网址,链接
tags: [随笔,AHU]
---

# 安徽大学WebVPN网页链接构成分析

::: warning
请不要违规使用WebVPN。
:::

内容参考自[ESWZY/webvpn-dlut: WRD 的 WebVPN 的 URL 互转原理🌚](https://github.com/ESWZY/webvpn-dlut)。

该系统为[网瑞达科技](https://www.wrdtech.com/content/content.php?p=2_30_203)的资源访问控制系统（WebVPN）（高校常用技术），并使用了默认的 `wrdvpnisthebest!` 作为 key 和 iv 。

## 地址规则

`https://wvpn.ahu.edu.cn/https/{key}{site}/{path}`

## 解释

### key字段

密钥文本编码（UTF-8即可）后的十六进制值，明文。

密钥与偏移文本默认均为 `wrdvpnisthebest!` ，十六进制值为 `77726476706e69737468656265737421` 。

### site字段

目标主机名，使用AES加密（[在线工具](https://www.toolhelper.cn/SymmetricEncryption/AES)）。

- 模式：AES-128-CFB
- 填充：None
- 密钥：`wrdvpnisthebest!`
- 偏移：`wrdvpnisthebest!`
- 编码：UTF-8
- 格式：Hex

### path字段

资源路径及搜索字段。

## 示例

### 百度

#### key字段

使用默认的 `77726476706e69737468656265737421` 。

#### site字段

将百度的网址 `www.baidu.com` 按照上述AES配置加密后，取十六进制编码值 `E7E056D2253161546B468AA395` 。

#### path字段

可以留空，也可以使用路径或搜索字段，文本不用转换直接使用即可，如 `s?wd=AES` 。

#### 合并

将上述字段按照[地址规则](#)合并后得到 `https://wvpn.ahu.edu.cn/https/77726476706e69737468656265737421E7E056D2253161546B468AA395/` ，访问后显示出百度首页。

上方示例中 `path` 字段留空。如果加上则得到 `https://wvpn.ahu.edu.cn/https/77726476706e69737468656265737421E7E056D2253161546B468AA395/s?wd=AES` ，访问后是百度对 `AES` 关键词的搜索结果。

---

### .NET文档

#### key字段

依然使用默认的 `77726476706e69737468656265737421` 。

#### site字段

将主机名 `learn.microsoft.com` 按照上述AES配置加密后，取十六进制编码值 `FCF2408E297E65597D1A86BF9753377BFC018F` 。

#### path字段

对于.NET文档，是 `zh-cn/dotnet/fundamentals/` ，同样直接使用，不转换。

#### 合并

将上述字段按照[地址规则](#)合并后得到 `https://wvpn.ahu.edu.cn/https/77726476706e69737468656265737421FCF2408E297E65597D1A86BF9753377BFC018F/zh-cn/dotnet/fundamentals/` ，访问后显示出文档界面。

值得一提的是，在这个例子中，如果 `path` 字段留空，会出现“访问出错”页面，错误代码： `PARSE_FAILED` ，并且在原先留空的 `path` 字段处会被自动添加文本 `zh-cn/` ，推测为自动跳转时出了问题。除此之外，即使如示例中添加了 `path` 字段，首次访问到的页面也会出现缺失CSS样式的问题，应该是网页使用了外部CSS导致的，点击任意一个页内链接后即可恢复 *(?存疑)* 。

## 相关项目

[lcandy2/webvpn-converter: 轻松访问校内网络资源，无需繁琐设置，只需粘贴链接，常规网址即刻转化为您学校的Web VPN网址。](https://github.com/lcandy2/webvpn-converter)

[在线工具（webvpn-converter）](https://wpn.citrons.cc/)
