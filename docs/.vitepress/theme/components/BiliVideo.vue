<script setup lang="ts">

const props = defineProps<{
    src: string
}>()

</script>

<template>
    <iframe class="bili-video" :src="src + '&autoplay=false&muted=false'" scrolling="no" border="0" frameborder="0"
        framespacing="0" allowfullscreen="true"
        sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>
</template>

<style>

.bili-video {
    width: 100%;
    aspect-ratio: 16 / 9;
}

</style>