<style lang="scss" scoped>
.user-wrapper {
  padding: 20px 30px;
  border-radius: 10px;
  background-color: #f6f6f6;

  @media (max-width: 500px) {
    padding: 20px;
  }

  & .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 40px;


    @media (max-width: 900px) {
      flex-direction: column;
      gap: 0;
    }

    & .user-avatar {
      width: 120px;
      height: auto;
      border-radius: 50%;
      border: solid 2px var(--vp-c-brand-1);
    }

    & .site-title {
      font-size: 32px;
      line-height: 2;
      font-weight: bold;
      color: var(--vp-c-brand-1);

      @media (max-width: 500px) {
        font-size: 24px;
        line-height: 1.5;
        margin-top: 10px;
      }
    }

    & .menu {
      padding-left: 30px;
      flex: 1;
      width: fit-content;
      margin: 0 auto;

      & ul {
        margin: 0;
        padding: 0;
        display: grid;
        gap: 10px 20px;
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
          padding: 10px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 4px;
          color: var(--vp-c-white);
          background-color: var(--vp-c-brand-2);

          &:hover {
            cursor: pointer;
            color: #ffffff;
            background-color: var(--vp-c-brand-1);
          }
        }
      }
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
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vitepress'

const { go } = useRouter();
const goToPost = (e) => go(e)
</script>
