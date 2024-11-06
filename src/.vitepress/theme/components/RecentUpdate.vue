<script setup>
import { data } from '../page_all.data';
import { useRouter } from 'vitepress';

const { go } = useRouter();
const { posts, count } = data
const articleData = posts.slice(0,20)
const goToPost = (e) => go(e)
</script>

<style lang="scss" scoped>
.container {
  width: 100%;

  & .module-title {
    font-size: 18px;
    line-height: 1.2;
    font-weight: 700;
    padding-bottom: 20px;
    color: var(--vp-c-brand-1);
    border-bottom: solid 1px var(--vp-c-brand-1);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    & .count {
      font-size: 12px;
    }
  }

  & .scroll-container {
    max-height: 400px;
    overflow-y: scroll;
    scroll-behavior: smooth;

    & .item-list {
      padding: 0;
      margin: 0;
      list-style: none;

      & .item {
        margin-top: 15px;
        cursor: pointer;

        & .item-wrap {
          padding: 15px 20px;
          border: solid 1px #efefef;
          border-radius: 6px;
          background-color: #efefef;
          color: #222222;

          &:hover {
            color: #ffffff;
            background-color: var(--vp-c-brand-3);
            transition: background-color 0.5s;
          }

          & .title {
            font-size: 15px;
            line-height: 18px;
            font-weight: 700;
          }

          & .desc {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            & .category {
              padding-left: 20px;
              font-size: 12px;
              background: url("/icons/icon-project.svg") left center no-repeat transparent;
              background-size: 16px;
              font-weight: 700;
            }
            & .date {
              padding-left: 20px;
              font-size: 12px;
              background: url("/icons/icon-program.svg") left center no-repeat;
              background-size: 16px;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}

::-webkit-scrollbar {
  display: none;
}

@media (max-width: 740px) {
  .container {
    & .module-title {
      font-size: 24px;
      line-height: 1.2;
    }
  }
}
@media (max-width: 1220px) and (min-width: 1000px) {
  .container {
    & .scroll-container {
      min-height: 500px;
    }
  }
}
@media (max-width: 1000px) and (min-width: 880px) {
  .container {
    & .scroll-container {
      min-height: 600px;
    }
  }
}
@media (max-width: 880px) and (min-width: 740px) {
  .container {
    & .scroll-container {
      min-height: 700px;
    }
  }
}
</style>

<template>
  <div class="container">
    <div class="module-title">
      <div>● 最近更新</div>
      <div class="count">总计{{ count }}篇</div>
    </div>
    <div class="scroll-container">
      <ul class="item-list">
        <li class="item" v-for="(post, index) in articleData" :key="index" v-on:click="goToPost(post.url)">
          <div class="item-wrap">
            <div class="title">{{ post.title }}</div>
            <div class="desc">
              <span class="category">{{ post.category }}</span>
              <span class="date">{{ post.date }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

