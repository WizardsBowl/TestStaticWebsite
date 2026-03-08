<script setup lang="ts">

import { computed } from "vue";
import type { PostData } from "../../type";
import { formatDateTime } from "../../shared/utils";

const props = defineProps<{
  postData: PostData;
}>();

const datetime = computed(() => {
  return formatDateTime(props.postData.date);
});

</script>

<template>
  <div class="post-card">
    <a :href="postData.url" class="post-card-link">
      <div class="post-card-cover" v-if="postData.coverImage">
        <img :src="postData.coverImage" alt="Cover Image" />
      </div>
      <div class="post-card-content">
        <h3 class="post-card-title" :title="postData.title">{{ postData.title }}</h3>
        <p class="post-card-date">{{ datetime }}</p>
        <p class="post-card-description">{{ postData.description }}</p>
        <div class="post-card-tags">
          <span v-for="tag in postData.tags" :key="tag" class="post-card-tag">{{ tag }}</span>
        </div>
      </div>
    </a>
  </div>
</template>

<style>

:root {
  --post-card-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark {
  --post-card-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.post-card {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
}

.post-card:hover {
    box-shadow: var(--post-card-shadow);
}

.post-card-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: inherit;
    text-decoration: none;
}

.post-card-cover img {
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 4 / 3;
}

.post-card-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.post-card-title {
    font-size: 1.25em;
    margin: 0 0 8px;
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.post-card-date {
    font-size: 0.9em;
    color: var(--vp-c-text-2);
    margin: 0 0 8px;
}

.post-card-description {
    flex-grow: 1;
    margin: 0 0 12px;
    color: var(--vp-c-text-2);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
    word-break: break-all;
}

.post-card-tags {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    gap: 8px;
}

.post-card-tag {
    background-color: var(--vp-c-brand-0);
    color: var(--vp-c-brand-1);
    font-size: 12px;
    text-wrap: nowrap;
}

@media (max-width: 640px) {
    .post-card-content {
        padding: 12px;
    }
}

</style>