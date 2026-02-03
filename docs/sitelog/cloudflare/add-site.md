---
description: 本页面记录了本人向Cloudflare加入域并设置跳转规则的历程，提及了根域名的多种称呼，记录了HTTP+根域名的访问有时会跳转失败的现象
head:
  - - meta
    - name: keywords
      content: Cloudflare 加入域 根域名的叫法 域名跳转 根域跳转WWW域 HTTP跳转HTTPS 跳转规则 问题 失败
tags: [Cloudflare,网站建设,CF规则]
---

# 向CF加入域

购买域名之后，自然就是要让它指向一个服务器。然而我哪里会有服务器呢？我又哪来的公网IP呢？

于是非常自然地，选择了，CF（@@Cloudflare@@@@CrossFire@@@@Codeforces@@）。

感谢赛博菩萨[Cloudflare](https://dash.cloudflare.com)。

## 设置名称服务器

按照网上的教程，在阿里云上把DNS服务器改为了Cloudflare提供的地址，把域名的DNS解析交给了Cloudflare。

## 根域跳转WWW域

为了实现根域名跳转www域，给根域添加了CNAME记录（实际上借用了CF的[CNAME展平](https://developers.cloudflare.com/dns/zone-setups/partial-setup/#cname-flattening)），又添加了跳转规则（CF上有现成的模板）。

话说，根域名到底该叫啥？Root domain?Apex domain?Base domain?Bare domain?Naked domain?Root apex domain?Zone apex domain?

[dns - What is the correct term for apex/naked/bare/root domain names? - Stack Overflow](https://stackoverflow.com/questions/55461299/what-is-the-correct-term-for-apex-naked-bare-root-domain-names)

## HTTP跳转HTTPS

废话不多说，也是直接用的CF上现成的规则模板。

然而，不知为何，有时HTTP+根域名的访问并不能正确地重定向到HTTPS+www域名，而HTTPS+根域名或HTTP+www域名却都可以正常跳转。

尝试了很久都没有解决，网上也找不到相同的案例，最终放弃了。

~~然而，现在我又复现不了这个问题了。(蒙圈中)~~

## 创建Workers

为了验证DNS设置@@和急于见到成效@@，很快就搞了一个`Hello World`Worker，连接到了[test子域名](https://test.wzb233.com)。
