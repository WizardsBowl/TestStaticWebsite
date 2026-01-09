import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "巫碗子",
  description: "测试性静态网站 of WizardsBowl",
  lang: 'zh-CN',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/icon.svg' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '介绍', link: '/introduction/introduction' },
      { text: '示例', link: '/vitepress-examples/markdown-examples' }
    ],

    sidebar: [
      {
        text: '介绍',
        items: [
          { text: '巫碗子简介', link: '/introduction/introduction' }
        ]
      },
      {
        text: '示例',
        items: [
          { text: 'Markdown Examples', link: '/vitepress-examples/markdown-examples' },
          { text: 'Runtime API Examples', link: '/vitepress-examples/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WizardsBowl/TestStaticWebsite' }
    ],

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
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    notFound: {
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
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
  lastUpdated: true
})
