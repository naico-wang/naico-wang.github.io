<script setup>
import { data } from '../page_all.data';

const { posts, count } = data
const articleData = posts.slice(0,10)
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
  list-style-position: outside;
  list-style-type: circle;
}

.item {
  position: relative;
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  line-height: 1.2;

  & .item-title {
    display: flex;
    align-items: center;

    & a {
      text-decoration: none;
    }

    & a:hover {
      text-decoration: underline;
    }
    & .item-tag {
      color: #ffffff;
      background-color: var(--vp-c-brand-1);
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 10px;
    }

    & .item-link {
      margin-left: 10px;
    }
  }

  & .item-date {
    font-size: 12px;
  }
}

@media (max-width: 740px) {
  .title {
    font-size: 24px;
    line-height: 1.2;
  }
}

@media (740px <= width <= 1170px) {
  .item {
    & .item-date {
      display: none;
    }
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
      <li class="item" :key="index">
        <div class="item-title">
          <span class="item-tag">{{ post.category }}</span>
          <span class="item-link">
            <a :href="post.url">{{ post.title }}</a>
          </span>
        </div>
        <div class="item-date">{{ post.date }}</div>
      </li>
    </ul>
  </div>
</template>

