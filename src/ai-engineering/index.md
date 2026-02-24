---
title: AI 工程化
outline: false
layout: page
---

<script setup lang="ts">
import PostOverview from '../../.vitepress/theme/PostOverview.vue';
import { data } from '../../.vitepress/theme/aiEngineering.data';

const standardTitleMap: Record<string, string> = {
  'ai-engineering': 'AI 工程化文章总览',
  'mcp': '模型上下文协议',
  'agent': '人工智能体',
  'vibe-coding': '氛围编程',
  'basic': '人工智能基础知识',
  'prompt': '提示词工程',
  'context': '上下文工程',
  'rag': 'RAG 工程',
  'sdd': '规范驱动开发',
};
</script>

<PostOverview 
  :items="data" 
  path-prefix="/ai-engineering"
  :title-map="standardTitleMap"
  page-title="AI 工程化"
/>