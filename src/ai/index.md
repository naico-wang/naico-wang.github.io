---
title: 框架和标准规范总览
outline: false
layout: page
---

<script setup lang="ts">
import PostOverview from '../../.vitepress/theme/PostOverview.vue';
import { data } from '../../.vitepress/theme/posts.data';

const standardTitleMap: Record<string, string> = {
  'ai-engineering': 'AI 工程化规范',
  'mcp': '模型上下文协议',
  'agent': '人工智能体',
  'vibe-coding': '氛围编程',
};
</script>

<PostOverview 
  :items="data" 
  path-prefix="/ai"
  :title-map="standardTitleMap"
  page-title="AI Engineering"
/>