import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  lang: 'zh-CN',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/assets/icon.svg' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WizardsBowl/TestStaticWebsite' }
    ],

    search:{
      provider: 'local'
    }
  },
  lastUpdated: true
})
