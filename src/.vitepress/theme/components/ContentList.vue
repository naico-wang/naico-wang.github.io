<style lang="scss" scoped>
.content-list {
  padding: 10px;
  width: 100%;
  background: url("/icons/icon-bg.jpg") right center no-repeat;
  background-size: 300px;

  & .item-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    max-width: 60%;

    & .item {
      font-size: 16px;
      background-position: left center;
      background-repeat: no-repeat;
      background-size: 30px;
      padding-left: 30px;
      cursor: pointer;

      &.number-1 {
        background-image: url("/icons/number-1.png");
      }
      &.number-2 {
        background-image: url("/icons/number-2.png");
      }
      &.number-3 {
        background-image: url("/icons/number-3.png");
      }
      &.number-4 {
        background-image: url("/icons/number-4.png");
      }
      &.number-5 {
        background-image: url("/icons/number-5.png");
      }
      &.number-6 {
        background-image: url("/icons/number-6.png");
      }

      &:hover {
        font-weight: bold;
        text-decoration: double underline;
      }
    }
  }
}
</style>

<template>
<div class="content-list">
  <div class="item-list">
    <div class="item number-1" v-on:click="go('/fullstack')">全栈架构解析</div>
    <div class="item number-2" v-on:click="go('/interview')">面试八股文</div>
    <div class="item number-3" v-on:click="go('/pattern')">深入设计模式</div>
    <div class="item number-4" v-on:click="go('/architect')">软件架构基础</div>
    <div class="item number-5" v-on:click="go('/algorithm')">算法与数据结构</div>
    <div class="item number-6" v-on:click="go('/blog')">博客文章</div>
  </div>
</div>
</template>
<script setup lang="ts">
import { useRouter } from 'vitepress'

const { go } = useRouter();
</script>
