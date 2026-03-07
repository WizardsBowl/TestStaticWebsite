<script setup lang="ts">

import { computed } from "vue";
import DefaultTheme from 'vitepress/theme'
import { useData } from "vitepress";
import { getUrlByPageData } from '../shared';

const { Layout } = DefaultTheme
const VPData = useData();
const pageUrl = computed(() => getUrlByPageData(VPData.page.value));

</script>

<template>
  <Layout>
    <template #doc-after>
      <div class="copyright-block tip custom-block">
        <p class="custom-block-title custom-block-title-default">版权声明</p>
        <p>作者主页：<a href="https://github.com/WizardsBowl" target="_blank">WizardsBowl@GitHub</a></p>
        <p>文章链接：<a :href="pageUrl" target="_blank">{{ pageUrl }}</a></p>
        <p>许可协议：本站文章除特别声明外，均采用<a href="https://creativecommons.org/licenses/by/4.0" target="_blank">CC BY 4.0国际许可协议</a>，转载时请注明作者和出处。</p>
      </div>
    </template>
  </Layout>
</template>

<style>
.copyright-block {
  margin: 16px 0;
}
</style>