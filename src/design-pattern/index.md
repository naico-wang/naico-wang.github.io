---
title: 经典设计模式 - 文章总览
outline: false
layout: page
---

<script setup lang="ts">
import PostOverview from '../../.vitepress/theme/PostOverview.vue';
import { data } from '../../.vitepress/theme/designPattern.data';

const standardTitleMap: Record<string, string> = {
  'behavior': '行为模式',
  'construct': '结构型模式',
  'create': '创建型模式'
};
</script>

<PostOverview
:items="data"
path-prefix="/design-pattern"
:title-map="standardTitleMap"
page-title="经典设计模式"
/>