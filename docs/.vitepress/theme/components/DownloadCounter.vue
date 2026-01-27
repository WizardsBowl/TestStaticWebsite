<script setup lang="ts">

import { ref, onMounted } from "vue";

const props = defineProps<{
    fileName: string,
    filePath: string
}>()

const count = ref<number>(0);

onMounted(async () => {
    try {
        const response = await fetch(`https://api.wizardsbowl.com/downloads?file=${encodeURIComponent(props.filePath)}`);
        const data = await response.json();
        if (data && typeof data.count === 'number') {
            count.value = data.count;
        }
    } catch (error) {
        console.error('Failed to fetch download count:', error);
    }
});

</script>

<template>
    <span class="download-counter">下载链接：<a :href="filePath" target="_self">{{ fileName }}</a> 下载次数：{{ count }}</span>
</template>