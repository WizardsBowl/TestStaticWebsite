<script setup lang="ts">

import DefaultTheme from 'vitepress/theme'
import PostCover from "./components/PostCover.vue";
import CopyrightBlock from "./components/CopyrightBlock.vue";

const { Layout } = DefaultTheme

</script>

<template>
  <Layout>
    <template #doc-before>
      <PostCover />
    </template>
    <template #doc-after>
      <CopyrightBlock />
    </template>
  </Layout>
</template>

<style>

</style>