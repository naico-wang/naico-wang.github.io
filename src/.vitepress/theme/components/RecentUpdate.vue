<script setup>
import { data } from '../page_all.data';
import { useRouter } from 'vitepress';

const { go } = useRouter();
const { posts, count } = data
const articleData = posts.slice(0,10)
const goToPost = (e) => go(e)
</script>

<style scoped>
.container {
  width: 100%;
}

.title {
  font-size: 18px;
  line-height: 1.2;
  font-weight: 700;
  padding-bottom: 20px;
  color: var(--vp-c-brand-1);
  border-bottom: dashed 1px var(--vp-c-brand-1);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  & .count {
    font-size: 12px;
  }
}

.item-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.item {
  position: relative;
  margin-top: 15px;
  font-size: 16px;
  line-height: 1.2;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  transition: font-weight .1s;
  //background-color: var(--vp-c-brand-1);

  &:hover {
    font-weight: 700;
  }
}

@media (max-width: 740px) {
  .title {
    font-size: 24px;
    line-height: 1.2;
  }
}
</style>

<template>
  <div class="container">
    <div class="title">
      <div>● 最近更新</div>
      <div class="count">总计{{ count }}篇</div>
    </div>
    <ul class="item-list" v-for="(post, index) in articleData">
      <li class="item" :key="index" v-on:click="goToPost(post.url)">
        【{{ post.category }}】— {{ post.title }}
      </li>
    </ul>
  </div>
</template>

