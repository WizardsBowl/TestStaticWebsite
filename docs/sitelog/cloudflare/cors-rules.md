---
title: 利用Cloudflare规则解决CORS（跨源资源共享）问题，无Worker动态返回响应头
description: 本文介绍了一种利用Cloudflare规则处理跨源资源共享（CORS）问题的方法，可以根据请求源动态返回响应头，无需Workers
head:
  - - meta
    - name: keywords
      content: Cloudflare,CORS,跨源资源共享,Cloudflare规则,请求标头,响应标头,转换规则,域名,白名单,动态响应
tags: [Cloudflare,网站建设,CF规则]
---

# 利用Cloudflare规则解决CORS（跨源资源共享）问题，无Worker动态返回响应头

如果你尝试在`blog.example.com`中访问`api.example.com`，可能会遇到[跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/CORS)问题，导致请求失败。此时就需要设置相关规则，给响应添加[CORS标头](https://developer.mozilla.org/zh-CN/docs/Glossary/CORS)，允许跨源请求。

## 利用CF规则

一个简单有效的处理方法就是利用Cloudflare的[响应标头转换规则](https://developers.cloudflare.com/rules/transform/response-header-modification/)。

在Cloudflare域名控制台的规则页面中，创建一个响应标头转换规则：

- 规则名称：添加CORS标头
- 如果传入请求匹配：自定义筛选表达式
- 当传入请求匹配时：
  点击“编辑表达式”，输入以下表达式：
  ```text
  ((http.host contains "api.example.com" or http.host contains "api.example.cn") and 
  (http.referer contains "example.com" or http.referer contains "example.cn" or 
  http.referer eq ""))
  ```
- 则:
  修改响应头如下：
  | 操作 | 标头名称 | 值 |
  | --- | --- | --- |
  | 设置静态 | Access-Control-Allow-Headers | Content-Type,Authorization |
  | 设置静态 | Access-Control-Allow-Methods | GET,HEAD,POST,OPTIONS |
  | 设置**动态** | Access-Control-Allow-Origin | http.request.headers["origin"][0] |
  | 设置静态 | Access-Control-Max-Age | 600 |
  | **添加**静态 | Vary | Origin |
- 放置位置：第一个

## 表达式使用说明

在第一行编辑需要添加CORS标头的域名，在第二行编辑允许访问的白名单。

顺便一提，Cloudflare的规则语法页面在[这里](https://developers.cloudflare.com/ruleset-engine/rules-language/)。

## 动态响应头说明

由于`Access-Control-Allow-Origin`标头只能有一个值，当我们需要授权来自多个域名的访问时，就需要根据请求的来源，动态设置该标头。

参照[相关文档](https://developers.cloudflare.com/ruleset-engine/rules-language/fields/reference/http.request.headers/)所述，上方所提供的值`http.request.headers["origin"][0]`即表示与请求的`origin`标头相同。

此外，还须给`Vary`标头添加值`Origin`，告知浏览器请求的源会影响该响应的内容。
