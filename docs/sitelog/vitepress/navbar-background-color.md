# 导航栏背景色

之前想给网站换个主题色，好区分一下主站和副站，结果就把网站的背景色整个给换掉了，效果嘛...一言难尽。!!简直扎眼!!

后来就想着只换导航栏的背景色，发现VitePress内置的css变量只能更改导航栏的右半边的颜色，并且影响不到首页的导航栏，由此又研究了一番。

## 更改整个导航栏

想要更改导航栏左侧与侧边栏重合部分的背景色，翻看[内置css变量](https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css)之后，并没有找到可以单独控制这一部分的配置，于是决定自己定义一套css规则。

利用浏览器开发人员工具，找到了可以控制这一部分的元素，于是有了以下css代码：

```css
div#app>div.Layout>header.VPNav {
    background-color: var(--vp-nav-bg-color);
}
```

注：`--vp-nav-bg-color`就是控制导航栏右半边背景色的变量。

## 更改页内导航栏

当显示空间不足（比如在移动端下）时，VitePress会自动折叠文章大纲并显示页内导航栏，而页内导航栏的背景色使用的是另外一个变量`--vp-local-nav-bg-color`。

这里我偷了个小懒，把控制搜索按钮背景色的变量指定为与页内导航栏的相同，于是：

```css
div#app>div.Layout>header.VPNav {
    background-color: var(--vp-nav-bg-color);
    --docsearch-search-button-background: var(--vp-local-nav-bg-color);
}
```

## 隐藏分割线

现在网站顶部那一栏，从最左到最右全都是清一色的粉色了~~，看上去很舒心~~，但总觉得哪里怪怪的。

用放大镜（指Windows自带的那个“放大镜”）仔细观察一番后，发现导航栏底下居然有一条一个像素宽的淡灰色的细细的不是很明显的不知道从哪冒出来的分割线！!!胡说，明明在默认状态下这条分割线很显眼的!!

::: details 对比图

**默认状态**

![vitepress-导航栏分割线-默认状态](https://img.wizardsbowl.com/2026/02/vitepress-%E5%AF%BC%E8%88%AA%E6%A0%8F%E5%88%86%E5%89%B2%E7%BA%BF-%E9%BB%98%E8%AE%A4%E7%8A%B6%E6%80%81-abf58be861616b620f2f08e459545466.png)

**更改背景色后**

![vitepress-导航栏分割线-更改颜色后](https://img.wizardsbowl.com/2026/02/vitepress-%E5%AF%BC%E8%88%AA%E6%A0%8F%E5%88%86%E5%89%B2%E7%BA%BF-%E6%9B%B4%E6%94%B9%E9%A2%9C%E8%89%B2%E5%90%8E-f0f680b51f86dac6cb9f8aaa308e2456.png)

:::

用浏览器开发人员工具找了半天，期间这个“开发人员工具”还卡死好几次!!这玩意儿居然能把CPU吃满！？？!!，终于找到了这两个罪魁祸首：

- 左边那条线是`title`元素的下边框线。
- 右边那条线居然是一个独立的`divider-line`元素。

找到对应元素之后就好办了，利用css更改其宽度为0即可：

```css
div#app>div.Layout>header.VPNav>div.VPNavBar>div.divider>div.divider-line {
    height: 0px;
}

div#app>div.Layout>header.VPNav>div.VPNavBar>div.wrapper>div.container>div.title>div.VPNavBarTitle>a.title {
    border-bottom-width: 0px;
}
```

## 适配深色主题

通过分别设置默认状态和`dark`类的状态，使得其颜色在不同亮度主题下作出变化：

```css
:root {
    --vp-nav-bg-color: #f7dada;
    --vp-local-nav-bg-color: #f8f0f0;
}

.dark {
    --vp-nav-bg-color: #550808;
    --vp-local-nav-bg-color: #741e1e;
}
```

## 完整代码

```css
:root {
    --vp-nav-bg-color: #f7dada;
    --vp-local-nav-bg-color: #f8f0f0;
}

.dark {
    --vp-nav-bg-color: #550808;
    --vp-local-nav-bg-color: #741e1e;
}

div#app>div.Layout>header.VPNav {
    background-color: var(--vp-nav-bg-color);
    --docsearch-search-button-background: var(--vp-local-nav-bg-color);
}

div#app>div.Layout>header.VPNav>div.VPNavBar>div.divider>div.divider-line {
    height: 0px;
}

div#app>div.Layout>header.VPNav>div.VPNavBar>div.wrapper>div.container>div.title>div.VPNavBarTitle>a.title {
    border-bottom-width: 0px;
}
```
