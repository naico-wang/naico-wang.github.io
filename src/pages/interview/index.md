---
layout: page
title: 'InterView'
---
<script setup>
import ArticleList from '../../.vitepress/theme/components/ArticleList.vue';
</script>

<style lang="scss" module>
  .main {
    padding: 48px 32px 96px;
    max-width: 1280px;
    margin: 0 auto;

    .pagetitle {
      padding-bottom: 1em;
      text-align: center;
      font-size: 2.5em;
      font-weight: bold;
      line-height: 2.5em;
      color: var(--vp-c-indigo-1);
    }
  }
</style>
<main :class="$style.main">
  <section :class="$style.pagetitle">本站文章列表</section>
  <ArticleList />
</main>
