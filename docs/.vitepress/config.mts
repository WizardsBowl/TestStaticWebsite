import { defineConfig } from 'vitepress'

import heimu from './custom-md/heimu.mjs'
import grayItalic from './custom-md/gray-italic.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "巫碗子",
  description: "碗里巫云(WizardsBowl)的另一个博客",
  lang: 'zh-CN',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/logo.svg' }]],
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.svg',

    nav: [
      { text: '首页', link: '/' },

      {
        text: '关于',
        activeMatch: '/about/',
        items: [
          { text: '网站简介', link: '/about/index' }
        ]
      },

      {
        text: '编程',
        activeMatch: '/programming/',
        items: [
          { text: '板块简介', link: '/programming/index' }
        ]
      },

      {
        text: '随笔',
        activeMatch: '/essay/',
        items: [
          { text: '板块简介', link: '/essay/index' }
        ]
      },

      {
        text: '网站日志',
        activeMatch: '/sitelog/',
        items: [
          { text: '板块简介', link: '/sitelog/index' },
          { text: '域名问题', link: '/sitelog/domain/buy-a-domain' },
          { text: 'Cloudflare', link: '/sitelog/cloudflare/add-site' },
          { text: 'VitePress', link: '/sitelog/vitepress/using-vitepress' }
        ]
      }
    ],

    sidebar: {
      '/about/': [
        {
          text: '关于本站',
          items: [
            { text: '巫碗子简介', link: '/about/' }
          ]
        }
      ],

      '/programming/': [
        {
          text: '关于编程板块',
          items: [
            { text: '编程板块简介', link: '/programming/' }
          ]
        }
      ],

      '/essay/': [
        {
          text: '关于随笔板块',
          items: [
            { text: '随笔板块简介', link: '/essay/' }
          ]
        }
      ],

      '/sitelog/': [
        {
          text: '关于网站日志板块',
          items: [
            { text: '网站日志板块简介', link: '/sitelog/' },
            { text: '网站日志', link: '/sitelog/logs' }
          ]
        },
        {
          text: '域名问题',
          items: [
            { text: '购买域名', link: '/sitelog/domain/buy-a-domain' }
          ]
        },
        {
          text: 'Cloudflare',
          items: [
            { text: '向CF加入域', link: '/sitelog/cloudflare/add-site' }
          ]
        },
        {
          text: 'VitePress',
          items: [
            { text: '使用VitePress', link: '/sitelog/vitepress/using-vitepress' },
            { text: 'index页面问题', link: '/sitelog/vitepress/index-page-problem' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WizardsBowl/TestStaticWebsite' }
    ],

    footer: {
      message: 'Released under the <a href="https://github.com/WizardsBowl/TestStaticWebsite/blob/main/LICENSE" target="_blank">MIT License</a>.',
      copyright: 'Copyright © 2026-present <a href="https://github.com/WizardsBowl" target="_blank">WizardsBowl</a>. All rights reserved.'
    },

    search:{
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
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    config: (md) => {
      md.use(heimu);
      md.use(grayItalic);
    }
  }
})
