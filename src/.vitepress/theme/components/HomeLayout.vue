<style lang="scss" scoped>
.home-container {
  max-width: 960px;
  padding: 20px;
  margin: 0 auto;

  & .site-title {
    text-align: center;
    padding: 10px 20px;
    font-size: 48px;
    line-height: 1.75;
    font-weight: 900;
    color: transparent;
    background-color: var(--vp-c-green-1);
    background-image: -webkit-linear-gradient(30deg, var(--vp-c-brand-1), var(--vp-c-text-1));
    background-clip: text;

    @media (max-width: 800px) {
      font-size: 36px;
    }
    @media (max-width: 700px) {
      font-size: 28px;
    }
    @media (max-width: 600px) {
      font-size: 24px;
    }
    @media (max-width: 400px) {
      font-size: 20px;
    }
  }
}
</style>

<template>
  <div class="home-container">
    <div class="site-title">苟利国家生死以，岂因祸福避趋之</div>
    <UserInfo></UserInfo>
    <DataList></DataList>
  </div>
</template>

<script setup lang="ts">
import UserInfo from './UserInfo.vue'
import DataList from './DataList.vue'
</script>
