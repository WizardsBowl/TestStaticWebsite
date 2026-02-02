import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import DownloadCounter from './components/DownloadCounter.vue'
import './css/heimu.css'
import './css/gray-italic.css'
import './css/vp-brand.css'
import './css/vp-navbar.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('DownloadCounter', DownloadCounter)
  }
} satisfies Theme