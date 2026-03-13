import { defineConfig, resolveSiteDataByRoute, type HeadConfig } from 'vitepress'
import { hostname, defaultCoverImage, getUrlByPageData } from './shared'
import { getIcon } from '@iconify/vue';

import { spoiler } from "@mdit/plugin-spoiler";
import { tab } from "@mdit/plugin-tab";
import heimu from './markdown-it-plugins/heimu.mjs'
import grayItalic from './markdown-it-plugins/gray-italic.mjs'
import transparentText from './markdown-it-plugins/transparent-text.mjs'

import aboutSidebar from './sidebar/about.mts'
import programmingSidebar from './sidebar/programming.mts'
import essaySidebar from './sidebar/essay.mts'
import sitelogSidebar from './sidebar/sitelog.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "巫碗子",
  description: "碗里巫云(WizardsBowl)的另一个博客",
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/assets/logo.png' }]
  ],
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.svg',

    nav: [
      { text: '首页', link: '/' },

      { text: '标签', link: '/tags' },

      {
        text: '关于',
        activeMatch: '^/about/',
        items: [
          { text: '网站简介', link: '/about/' }
        ]
      },

      {
        text: '编程',
        activeMatch: '^/programming/',
        items: [
          { text: '板块简介', link: '/programming/' }
        ]
      },

      {
        text: '随笔',
        activeMatch: '^/essay/',
        items: [
          { text: '板块简介', link: '/essay/' },
          { text: '信息技术', link: '/essay/it/build-vitepress' }
        ]
      },

      {
        text: '网站日志',
        activeMatch: '^/sitelog/',
        items: [
          { text: '板块简介', link: '/sitelog/' },
          { text: '域名问题', link: '/sitelog/domain/buy-a-domain' },
          { text: 'Cloudflare', link: '/sitelog/cloudflare/add-site' },
          { text: 'VitePress', link: '/sitelog/vitepress/using-vitepress' }
        ]
      }
    ],

    sidebar: {
      '/about/': aboutSidebar,
      '/programming/': programmingSidebar,
      '/essay/': essaySidebar,
      '/sitelog/': sitelogSidebar
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WizardsBowl/TestStaticWebsite' },

      { icon:
        {
          svg: '<span class="vpi-social-weibo" style="--icon: url(\'https://api.iconify.design/ri/weibo-fill.svg\');"></span>'
        },
        link: 'https://weibo.com/u/9188103579'
      },

      { icon: 'bilibili', link: 'https://space.bilibili.com/1735847445' },
      
      { icon:
        {
          svg: '<img src="https://blog.wizardsbowl.com/assets/logo.svg" style="width: 20px; height: 20px;" />'
        },
        link: 'https://blog.wizardsbowl.com'
      },
    ],

    footer: {
      message: 'Released under the <a href="https://creativecommons.org/licenses/by/4.0" target="_blank">CC BY 4.0 License</a>.',
      copyright: 'Copyright © 2026-present <a href="https://github.com/WizardsBowl" target="_blank">WizardsBowl</a>. All rights reserved.'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '重置搜索',
            footer: {
              selectText: '选择',
              navigateText: '导航',
              closeText: '关闭'
            }
          }
        }
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    lastUpdated: {
      text: '最后编辑于'
    },

    notFound: {
      title: 'CONTENT MISSING',
      quote:
        '你的URL输对了吗？',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  },
  sitemap: {
    hostname: hostname
  },
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true
    },
    codeCopyButtonTitle: '复制代码',
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    config: (md) => {
      // 组件插入h1标题下
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1') htmlResult += `<BelowTitleContent />`
        return htmlResult
      };
      md.use(heimu);
      md.use(grayItalic);
      md.use(transparentText);
      md.use(spoiler, {
        tag: 'span',
        attrs: [["class", "heimu"], ['title', '你知道的太多了'], ["tabindex", "-1"]]
      });
      md.use(tab, {
        name: 'tabs'
      });
    }
  },
  transformPageData(pageData, ctx) {
    const site = resolveSiteDataByRoute(
      ctx.siteConfig.site,
      pageData.relativePath
    );
    const title = pageData.title || site.title;
    const description = pageData.description || site.description;
    const url = getUrlByPageData(pageData);
    const ogImage = pageData.frontmatter.cover || defaultCoverImage;
    ((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
      ['meta', { property: 'og:locale', content: site.lang }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:type', content: 'article' }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:image', content: ogImage }],
      ['meta', { property: 'og:site_name', content: site.title }],
      ['meta', { property: 'og:url', content: url }]
    );
  }
})
