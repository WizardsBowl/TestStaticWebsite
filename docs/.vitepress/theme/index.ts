import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import DownloadCounter from './components/DownloadCounter.vue'
import BiliVideo from './components/BiliVideo.vue'

import './css/heimu.css'
import './css/gray-italic.css'
import './css/vp-brand.css'
import './css/vp-navbar.css'
import './css/ruby.css'
import './css/tabs.css'

import { useMditTab } from './composables/mditTab'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('DownloadCounter', DownloadCounter)
    app.component('BiliVideo', BiliVideo)
  },
  setup() {
    useMditTab();
  }
} satisfies Theme