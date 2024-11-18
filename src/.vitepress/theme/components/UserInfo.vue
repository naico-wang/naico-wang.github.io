<style lang="scss" scoped>
.user-wrapper {
  padding: 20px 0;
  border-radius: 10px;
  display: flex;
  background-color: #f6f6f6;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 700px) {
    flex-direction: column;
  }

  & .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;


    @media (max-width: 900px) {
      gap: 0;
    }

    & .user-avatar {
      width: 160px;
      height: auto;
      border-radius: 50%;
      border: solid 2px var(--vp-c-brand-1);
    }

    & .site-title {
      font-size: 28px;
      line-height: 1.5;
      font-weight: bold;
      color: var(--vp-c-text-1);
      padding: 10px 0;

      @media (max-width: 500px) {
        font-size: 24px;
        line-height: 1.5;
        margin-top: 10px;
      }
    }

    & .menu {

      & ul {
        margin: 0;
        padding: 0;
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr 1fr 1fr;

        @media (max-width: 900px) {
          grid-template-columns: 1fr 1fr;
        }

        @media (max-width: 400px) {
          display: none;
        }

        & li {
          position: relative;
          text-align: center;
          padding: 5px 10px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 4px;
          color: var(--vp-c-white);
          background-color: var(--vp-c-brand-3);

          &:hover {
            cursor: pointer;
            color: #ffffff;
            background-color: var(--vp-c-brand-1);
          }
        }
      }
    }
  }

  & .word-cloud {

    @media (max-width: 700px) {
      margin-top: 20px;
    }
  }
}
</style>

<template>
  <div class="user-wrapper">
    <div class="user-info">
      <img class="user-avatar" alt="智库" src="/icons/icon-avatar.png" />
      <div class="site-title">奶一口智库</div>
      <div class="menu">
        <ul>
          <li v-on:click="goToPost('/timeline')">时间线</li>
          <li v-on:click="goToPost('/development')">开发笔记</li>
          <li v-on:click="goToPost('/interview')">面试八股文</li>
          <li v-on:click="goToPost('/pattern')">设计模式</li>
          <li v-on:click="goToPost('/architect')">架构基础</li>
          <li v-on:click="goToPost('/algorithm')">算法/数据结构</li>
        </ul>
      </div>
    </div>
    <div class="word-cloud">
      <WordCloud></WordCloud>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vitepress'
import WordCloud from './WordCloud.vue'

const { go } = useRouter();
const goToPost = (e) => go(e)
</script>
