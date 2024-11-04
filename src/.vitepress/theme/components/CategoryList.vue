<script setup>
import { data } from '../page_wordcloud.data';
</script>

<style lang="scss" scoped>
.category-wrapper {
  overflow: hidden;

  & .module-title {
    font-size: 18px;
    line-height: 1.2;
    padding-bottom: 20px;
    font-weight: 700;
    color: var(--vp-c-brand-1);
    border-bottom: solid 1px var(--vp-c-brand-1);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  & .module-container {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;

    & .item {
      font-size: 15px;
      font-weight: 700;
      padding: 5px 10px;
      background-color: #efefef;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        color: #ffffff;
        background-color: var(--vp-c-brand-3);
        transition: background-color 0.5s;
      }
    }
  }
}
</style>

<template>
  <div class="category-wrapper">
    <div class="module-title">● 标签分类</div>
    <div class="module-container">
      <div class="item" v-for="(post, index) in data" :key="index">{{ post.category }}</div>
    </div>
  </div>
</template>
