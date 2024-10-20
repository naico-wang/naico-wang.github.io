<script setup>
import { useRouter } from 'vitepress';

const router = useRouter();
const props = defineProps(['data', 'single']);
const navigateTo = (url) => {
  router.go(url);
}
</script>

<style lang="scss" module>
  .item {
    font-size: 15px;
    padding: 10px;
    background-color: var(--vp-c-gray-3);
    border: 1px solid #ccc;
    border-radius: 4px;
    color: var(--vp-c-text-1);

    & a,
    & a:link,
    & a:visited,
    & a:active {
      color: var(--vp-c-text-1);
      text-decoration: none;
    }

    &:hover {
      background: var(--vp-c-indigo-1);
      font-weight: bold;
      color: var(--vp-c-bg-soft);
      transition: all, .3s;
      cursor: pointer;

      & a,
      & a:link,
      & a:visited,
      & a:active {
        color: var(--vp-c-bg-soft);
        text-decoration: none;
      }
    }
  }

  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 0;
    margin: 0;
  }

  .title {
    font-size: 1.5rem;
    line-height: 2.5rem;
    font-weight: bold;
    padding: 20px 0;
    text-align: center;
  }

  .singlegrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    & .container {
      grid-template-columns: repeat(1, 1fr);
    }
  }

</style>
<template>
  <section :class="single ? $style.singlegrid : ''">
    <div v-for="(categoryGroup, index) in data" :key="index">
      <div :class="$style.title">{{ categoryGroup.category }}</div>
      <section :class="$style.container">
        <span :class="$style.item" v-on:click="navigateTo(post.url)" v-for="(post, idx) in categoryGroup.data" :key="idx">
          {{ post.title }}
        </span>
      </section>
    </div>
  </section>
</template>
