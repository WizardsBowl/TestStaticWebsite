<script setup lang="ts">

import { computed } from "vue";
import { useData } from "vitepress";

const VPData = useData();

const showDescription = computed(() => {
    return (VPData.page.value.frontmatter.showDescription !== false) && VPData.page.value.description;
});

</script>

<template>
    <div v-if="showDescription" class="description-box custom-block">
        <p class="custom-block-title custom-block-title-default">内容概要</p>
        <p>{{ VPData.page.value.description }}</p>
    </div>
</template>

<style>

:root {
    --wzb-description-box-border: transparent;
    --wzb-description-box-text: var(--vp-c-text-3);
    --wzb-description-box-bg: var(--vp-c-gray-soft);
}

.description-box.custom-block {
    border-color: var(--wzb-description-box-border);
    color: var(--wzb-description-box-text);
    background-color: var(--wzb-description-box-bg);
}

</style>