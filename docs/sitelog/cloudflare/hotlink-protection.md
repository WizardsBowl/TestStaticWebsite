---
title: 利用Cloudflare规则设置防盗链保护功能，仅允许白名单网站访问特定资源
description: 本文介绍了一种利用Cloudflare规则设置防盗链（热链保护，Hotlink Protection）功能的方法
head:
  - - meta
    - name: keywords
      content: Cloudflare,防盗链,热链保护,Hotlink,Protection,Cloudflare规则,域名,白名单,安全规则
tags: [Cloudflare,网站建设,CF规则]
---

# 利用Cloudflare规则设置防盗链保护功能，仅允许白名单网站访问特定资源

为了防止其他网站直接引用你的站点资源，消耗你的服务器带宽，一般需要设置防盗链（热链保护，Hotlink Protection）规则。

## 在CF上添加规则

在Cloudflare域名控制台的安全规则页面中，添加如下规则：

- 规则名称：防盗链
- 当传入请求匹配时：
  点击“编辑表达式”，输入以下表达式：
  ```text
  ((http.host contains "img.example.com" or http.host contains "api.example.com") and not 
  (http.referer contains "example.com" or http.referer contains "example.cn") and 
  http.referer ne "")
  ```
- 然后采取措施：阻止
- 放置位置：第一个

然后点击保存，应用规则。

## 表达式使用说明

在第一行编辑需要保护的域名，在第二行编辑允许访问的白名单。

顺便一提，Cloudflare的规则语法页面在[这里](https://developers.cloudflare.com/ruleset-engine/rules-language/)。
