<script setup lang="ts">

import { computed } from "vue";
import { useData } from "vitepress";

const VPData = useData();

</script>

<template>
    <div v-if="VPData.page.value.frontmatter.tags" class="page-tags-viewer">
        <div class="tags-container">
            <a v-for="tag in VPData.page.value.frontmatter.tags" :key="tag" :href="`/tags?tag=${encodeURIComponent(tag)}`" class="tag">{{ tag }}</a>
        </div>
    </div>
</template>

<style>
.page-tags-viewer {
    margin: 4px 0;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.tags-container > .tag {
    display: inline-block;
    padding: 2px 8px;
    font-size: 12px;
    color: var(--vp-c-text-2);
    background-color: var(--vp-c-gray-soft);
    border-radius: 4px;
    transition: color 0.13s, background-color 0.13s;
    text-decoration: none;

    &:hover {
        color: var(--vp-c-text-1);
        background-color: var(--vp-c-brand-soft);
    }
}
</style>