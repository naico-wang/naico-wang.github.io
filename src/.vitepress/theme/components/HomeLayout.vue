<style lang="scss" scoped>
.home-container {
  max-width: 760px;
  padding: 48px 20px;
  margin: 0 auto;

  & .site-title {
    font-size: 2em;
    line-height: 1.5;
    font-weight: bold;
    text-align: center;
    color: transparent;
    background-color: var(--vp-c-green-1);
    background-image: -webkit-linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-important-1));
    background-clip: text;
  }
}
</style>

<template>
  <div class="home-container">
    <div class="site-title">Too Young, Too Simple, Sometimes Naive.</div>
    <SeparateLine title="关于本站和作者" />
    <UserInfo></UserInfo>
    <SeparateLine title="工作过的公司" />
    <CompanyList></CompanyList>
    <SeparateLine title="推荐内容" />
    <ContentList></ContentList>
    <SeparateLine title="网站词云" />
    <WordCloud></WordCloud>
  </div>
</template>

<script setup lang="ts">
import WordCloud from './WordCloud.vue'
import UserInfo from './UserInfo.vue'
import CompanyList from './CompanyList.vue'
import SeparateLine from './SeparateLine.vue'
import ContentList from './ContentList.vue'
</script>
