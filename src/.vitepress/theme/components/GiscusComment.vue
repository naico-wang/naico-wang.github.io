<script setup>
import Giscus from '@giscus/vue';
import { useRoute, useData } from 'vitepress';

const route = useRoute();
const { isDark } = useData();
const { path } = route;
</script>

<template>
  <div style="margin-top: 24px">
    <Giscus
      id="comments"
      repo="naico-wang/naico-wang.github.io"
      repoid="R_kgDOL7bxbQ"
      category="General"
      categoryid="DIC_kwDOL7bxbc4Cgc7l"
      mapping="title"
      term="Welcome to giscus!"
      reactionsenabled="0"
      emitmetadata="0"
      inputposition="top"
      loading="lazy"
      lang="zh-CN"
      :theme="isDark ? 'dark' : 'light'"
      :key="path"
    />
  </div>
</template>