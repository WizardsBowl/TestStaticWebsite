<script setup lang="ts">

import { computed } from "vue";
import { useData } from "vitepress";

const VPData = useData();

const showCover = computed(() => {
    return (VPData.page.value.frontmatter.showCover !== false) && VPData.page.value.frontmatter.cover;
});

</script>

<template>
    <div v-if="showCover" class="post-cover">
        <img :src="VPData.page.value.frontmatter.cover" alt="Post Cover Image" class="cover-image" />
    </div>
</template>

<style>

.post-cover {
    margin-bottom: 8px;
}

.cover-image {
    width: 100%;
    height: auto;
}

</style>