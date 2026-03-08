import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'

import BelowTitleContent from './components/BelowTitleContent.vue'
import DownloadCounter from './components/DownloadCounter.vue'
import BiliVideo from './components/BiliVideo.vue'
import TagsPage from './components/TagsPage.vue'

import './style/heimu.css'
import './style/gray-italic.css'
import './style/transparent-text.css'
import './style/vp-brand.css'
import './style/vp-navbar.css'
import './style/ruby.css'
import './style/tabs.css'

import { useMditTab } from './composables/mditTab'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('BelowTitleContent', BelowTitleContent)
    app.component('DownloadCounter', DownloadCounter)
    app.component('BiliVideo', BiliVideo)
    app.component('TagsPage', TagsPage)
  },
  setup() {
    useMditTab();
  }
} satisfies Theme