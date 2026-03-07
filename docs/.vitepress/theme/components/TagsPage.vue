<script setup lang="ts">

import { ref, computed, onMounted, onUnmounted } from "vue";
import { useData, inBrowser } from "vitepress";
import type { PostData } from "../../type";
import { data as postsData } from "../../shared/posts.data";
import PostCard from "./PostCard.vue";

const VPData = useData();
const tags = ref<Record<string, number>>({});
var currentURL: URL;
var currentTag = ref<string>("");
const filteredPosts = computed(() => {
  if (!currentTag.value) {
    return [];
  }
  return postsData.filter(post => post.tags.includes(currentTag.value));
});

onMounted(async () => {
  resolveTags();
  resolveURL();
  if (inBrowser) {
    window.addEventListener("popstate", resolveURL);
  }
});

onUnmounted(() => {
  if (inBrowser) {
    window.removeEventListener("popstate", resolveURL);
  }
});

function resolveURL() {
  if (inBrowser) {
    currentURL = new URL(window.location.href);
    currentTag.value = decodeURIComponent(currentURL.searchParams.get("tag") || "");
  }
}

function resolveTags() {
  for (const post of postsData) {
    for (const tag of post.tags) {
      tags.value[tag] = (tags.value[tag] || 0) + 1;
    }
  }
}

</script>

<template>
  <div class="tags-page">
    <h1 id="tags-container-title">标签浏览</h1>
    <div class="tags-container">
      <a v-for="(count, tag) in tags" :key="tag" :href="`/tags?tag=${encodeURIComponent(tag)}`" @click="resolveURL" class="tag" :class="{ active: tag === currentTag }">
        {{ tag }} ({{ count }})
      </a>
    </div>
    <div v-if="currentTag" class="tag-posts">
      <h2 id="tag-posts-title">{{ currentTag }} - {{ tags[currentTag] ?? 0 }}篇</h2>
      <div class="posts-list">
        <PostCard v-for="post in filteredPosts" :key="post.url" :postData="post" />
      </div>
    </div>
    <div v-else id="no-tag-selected">
      <p>请选择一个标签以查看相关的文章。</p>
    </div>
  </div>
</template>

<style>
.tags-page {
  padding: 32px;
  max-width: 1500px;
  margin: 0 auto;
}

#tags-container-title {
  font-size: 1.8em;
  margin-bottom: 20px;
  text-align: center;
}

.tags-page .tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
}

.tags-page .tags-container > .tag {
  display: inline-block;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;

  &.active {
    color: var(--vp-c-text-1);
    background-color: var(--vp-c-brand-1);
  }
}

.tags-page .tag-posts {
  margin-top: 20px;
}

#tag-posts-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
}

.tags-page .posts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

#no-tag-selected {
  margin-top: 40px;
  text-align: center;
  font-size: 1.2em;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  #tags-container-title {
    font-size: 1.5em;
  }
  #tag-posts-title {
    font-size: 1.2em;
  }
  #no-tag-selected {
    font-size: 1em;
    margin-top: 20px;
  }
  .tags-page .tags-container {
    gap: 8px;
    padding: 12px;
  }
}

@media (max-width: 640px) {
  .tags-page {
    padding: 20px;
  }
}
</style>