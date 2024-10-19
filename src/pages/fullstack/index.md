---
aside: false
title: 前端开发
exclude: true
---
<script setup>
import ArticleList from '../../.vitepress/theme/components/ArticleList.vue';
</script>

<style lang="scss" module>
.pagetitle {
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
  line-height: 2em;
  color: var(--vp-c-indigo-1);
}
</style>
<section :class="$style.pagetitle">前端开发文章大乱斗</section>
<ArticleList></ArticleList>
