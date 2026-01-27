import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import DownloadCounter from './components/DownloadCounter.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('DownloadCounter', DownloadCounter)
  }
} satisfies Theme