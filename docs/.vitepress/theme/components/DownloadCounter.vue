<script setup lang="ts">

import { ref, onMounted } from "vue";

const props = defineProps<{
    fileName: string,
    filePath: string
}>()

const count = ref<number>(0);
const size = ref<string>("0B");

function formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + sizes[i];
}

onMounted(async () => {
    try {
        const response = await fetch(`https://api.wizardsbowl.com/downloads?file=${encodeURIComponent(props.filePath)}`);
        const data = await response.json();
        if (data) {
            if (data.count && typeof data.count === 'number') {
                count.value = data.count;
            }
            if (data.size && typeof data.size === 'number') {
                size.value = formatFileSize(data.size);
            }
        }
    } catch (error) {
        console.error('Failed to fetch download count:', error);
    }
});

</script>

<template>
    <div class="download-counter custom-block">
        <p class="custom-block-title custom-block-title-default">下载链接</p>
        <p><a :href="filePath" target="_self">{{ fileName }}</a></p>
        <p>{{ size }} {{ count }}次下载</p>
    </div>
</template>

<style>

:root {
    --wzb-download-counter-border: transparent;
    --wzb-download-counter-text: var(--vp-c-text-1);
    --wzb-download-counter-bg: var(--vp-c-green-soft);
}

.download-counter.custom-block {
    border-color: var(--wzb-download-counter-border);
    color: var(--wzb-download-counter-text);
    background-color: var(--wzb-download-counter-bg);
}

</style>