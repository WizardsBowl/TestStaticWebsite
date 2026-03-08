<script setup lang="ts">

import { computed } from "vue";
import { useData } from "vitepress";
import { formatDateTime, getPathFromLink } from "../../shared";
import { data as postsData } from "../../shared/posts.data";

import PageTagsViewer from "./PageTagsViewer.vue";
import DescriptionBox from "./DescriptionBox.vue";

const VPData = useData();

const date = computed(() => {
  return postsData.find((post) => getPathFromLink(post.url) === "/" + VPData.page.value.relativePath)?.date || 0;
});
const datetime = computed(() => {
  return formatDateTime(date.value);
});

</script>

<template>
    <div class="below-title-content">
        <p id="post-publish-date">发布于: {{ datetime }}</p>
        <PageTagsViewer />
        <DescriptionBox />
    </div>
</template>

<style>

.below-title-content {
    margin: 16px 0;
}

.below-title-content #post-publish-date {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    margin: 0 0 8px;
}

</style>