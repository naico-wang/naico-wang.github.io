---
layout: page
title: '文章列表'
---
<script setup>
import ArticleList from '../../.vitepress/theme/components/ArticleList.vue';
</script>

<style lang="scss" module>
  .main {
    padding: 48px 32px 96px;
    max-width: 788px;
    margin: 0 auto;

    .pagetitle {
      font-size: 2em;
      font-weight: bold;
      line-height: 2.5em;
    }
  }
</style>
<main :class="$style.main">
  <section :class="$style.pagetitle">本站文章列表</section>
  <ArticleList />
</main>
