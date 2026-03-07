---
title: Cloudflare的R2、D1、Workers联动，实现后台下载计数并开放查询API
description: 本文介绍了一种简单的利用Cloudflare的R2、D1、Workers联动来提供下载量计数&查询的api接口的方法
head:
  - - meta
    - name: keywords
      content: Cloudflare,文件,下载量,计数,统计,查询,API,数据库,SQL,R2,D1,Workers,后端
tags: [Cloudflare,网站建设,数据库]
---

# Cloudflare的R2、D1、Workers联动，实现后台下载计数并开放查询API

本文介绍了一种简单的利用[R2](https://developers.cloudflare.com/r2/)&[D1](https://developers.cloudflare.com/d1/)&[Workers](https://developers.cloudflare.com/workers/)联动来提供下载量计数&查询的api接口的方法。

过程中主要参考了[这篇文章](https://www.laughingzhu.cn/posts/cloudflare-d1)。

## 创建R2存储桶

在Cloudflare上创建一个R2存储桶，添加一个自定义域，例如`r2.example.com`。

先随便往里上传几个文件，待会测试可能会用到。

## 创建D1数据库

首先在Cloudflare上创建一个数据库，然后在数据库控制台内输入以下SQL语句创建`downloads`表。

```sql
CREATE TABLE downloads (
  record_id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_path TEXT UNIQUE NOT NULL,
  count INTEGER,
  last_downloaded INTEGER
)
```

各列数据说明：

- `record_id`：记录的id，自增主键
- `file_path`：文件路径，包含域名
- `count`：下载计数
- `last_downloaded`：最后一次下载的时间戳，单位为秒

## 利用Worker统计下载量

使用`Hello World`模板创建一个新Worker，然后添加D1数据库绑定，连接到刚刚创建的数据库，将变量命名为`DB_CNT`。

之后给Worker添加路由`r2.example.com/*`，也就是你刚刚创建的R2桶的自定义域后加上`/*`，表示访问你的存储桶的所有流量都会首先经过此Worker处理。

修改Worker代码如下。

```js
export default {
  async fetch(request, env, ctx) {
    const response = await fetch(request);
    // 仅当原请求成功时才进行记录
    if (response.ok) {
      const url = new URL(request.url);
      const filePath = url.hostname + url.pathname;
      const utcTimestamp = Math.floor(Date.now() / 1000);
  
      const result = await env.DB_CNT.prepare("SELECT count FROM downloads WHERE file_path = ?").bind(filePath).first();
      if (result) { // 该文件记录已存在，增加计数
        await env.DB_CNT.prepare("UPDATE downloads SET count = count + 1, last_downloaded = ? WHERE file_path = ?").bind(utcTimestamp, filePath).run();
      }
      else { // 该文件记录不存在，创建记录
        await env.DB_CNT.prepare("INSERT INTO downloads (file_path, count, last_downloaded) VALUES (?, 1, ?)").bind(filePath, utcTimestamp).run();
      }
    }
    // 返回原请求的响应
    return response;
  }
};
```

现在访问你的R2桶提供的文件下载链接，之后再查看D1数据库的数据，应该可以看到新增的下载计数。

如果没有看到，也有可能是因为缓存问题，可以清除浏览器缓存后再试试。

PS：其实利用Cloudflare提供的Queue功能，可以自动将R2事件发送给Workers，不过Queue是要付费的...

## 开放查询API

由于我采用了SSG方案!!其实是不会用SSR!!，现在需要开放查询下载次数的API，供客户端代码使用。

新建一个Worker，添加自定义域`api.example.com`。

添加如下代码。

```js
// ################ 默认导出

export default {
  async fetch(request, env, ctx) {
    try {
      const response = await getResponse(request, env, ctx);
      return response;
    }
    catch (err) {
      console.error(err);
      return response500InternalServerError();
    }
  }
};

// ################ 处理所有请求

async function getResponse(request, env, ctx) {
  const url = new URL(request.url);

  if (url.pathname === "/downloads") {
    return await getDownloadsResponse(url, env.DB_CNT);
  }

  return response400BadRequest();
}

// ################ 处理特定请求

async function getDownloadsResponse(url, db) {
  const fileURI = url.searchParams.get("file");
    if (fileURI === null) {
      return response418Imateapot();
    }
    const count = await getDownloadsCount(decodeURIComponent(fileURI), db);
    if (count === null) {
      return response404NotFound();
    }
    return Response.json({
      count: count
    }, { status: 200 });
}

async function getDownloadsCount(file, db) {
  try {
    const url = new URL(file);
    const filePath = url.hostname + url.pathname;
    const result = await db.prepare("SELECT count FROM downloads WHERE file_path = ?").bind(filePath).first();
    return result.count;
  }
  catch (err) {
    return 0;
  }
}

// ################ 通用返回响应

function response400BadRequest() {
  return new Response("Bad Request", { status: 400 });
}

function response404NotFound() {
  return new Response("Not Found", { status: 404 });
}

function response418Imateapot() {
  return new Response("I'm a teapot", { status: 418 });
}

function response500InternalServerError() {
  return new Response("Internal Server Error", { status: 500 });
}
```

现在访问`https://api.example.com/downloads?file=xxx`（xxx部分是将R2提供的下载链接进行URI编码后的结果），可能会看到如下结果：

```json
{
  "count": 5
}
```
