<script setup>
import { data } from '../page_all.data'
import { computed } from 'vue';
import { useRouter } from 'vitepress';

const { go } = useRouter();
const { posts } = data
const sortedArticles = computed(() => {
  const grouped = {};

  posts.forEach((article) => {
    const match = article.date.match(/^(\d{4})-(\d{1,2})/);
    if (match) {
      const yearMonth = `${match[1]}年${match[2]}月`;

      if (!grouped[yearMonth]) grouped[yearMonth] = [];
      grouped[yearMonth].push(article);
    }
  });

  const sortedGrouped = {};
  Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .forEach((yearMonth) => {
      sortedGrouped[yearMonth] = grouped[yearMonth];
    });

  return sortedGrouped;
});
const goToPost = (e) => go(e)
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Raleway:400,600');

h1 {
  font-size: 2rem;
  font-weight: bold;
  line-height: 2;
  text-align: center;
  padding:30px 0 0 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.timeline {
  list-style: none;
  padding: 20px 0 20px;
  position: relative;

  &:before {
    top: 0;
    bottom: 0;
    position: absolute;
    content: "";
    width: 3px;
    background-color: var(--vp-c-brand-3);
    margin-left: -1.5px;
    left: 20px;

    @media (min-width: 576px) {
      left: 50%;
    }
  }

  > li {
    cursor: pointer;
    margin-bottom: 20px;
    position: relative;
    padding-left: 55px;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    .panel {
      width: 100%;
      float: left;
      border-radius: 3px;
      overflow:hidden;
      position: relative;
      background: #eeeeee;
      box-shadow: 1px 2px 80px 0 rgba(#000000, 0.2);

      summary{
        display: block;
        user-select: none;
        outline: none;
        padding: 15px;
        margin-bottom: 0;
        transition: all 600ms cubic-bezier(0.23, 1, 0.32, 1);
        transition-property: margin, background;
        font-weight: 600;
        cursor: pointer;
        border: solid 1px var(--vp-c-brand-1);
        border-radius: 4px;

        &::-webkit-details-marker { display:none; }

        &:hover{
          background: var(--vp-c-brand-3);
          color: #ffffff;
        }
      }

      &[open] summary{
        color: #ffffff;
        background-color: var(--vp-c-brand-3);
        padding-bottom: 20px;
      }

      & .sub-list {
        padding: 10px 20px;

        & .item {
          font-size: 12px;
          font-weight: bold;
          line-height: 2;
          display: flex;
          justify-content: flex-start;

          &:hover {
            color: var(--vp-c-brand-1);
          }
        }
      }
    }

    @media (min-width: 576px) {
      padding-left:0;

      .panel {
        width: 50%;
      }

      &:not(:nth-child(even)) {
        .panel {
          & .sub-list {
            & .item {
              flex-direction: row-reverse;
            }
          }
        }
        text-align: right;
        padding-right: 90px;
      }

      &:nth-child(even) {
        padding-left: 90px;
        > :nth-child(even) {
          float: right;
        }
      }
    }

    > {
      .icon {
        width: 50px;
        height: 50px;
        line-height: 50px;
        font-size: 2.5em;
        text-align: center;
        position: absolute;
        left: 20px;
        margin-left: -25px;
        background-color: #efefef;
        z-index: 999;
        border-radius: 50%;
        font-family: Font Awesome\ 5 Free,serif;
        color: var(--vp-c-brand-1);

        &:before{ content: "\f017"; }

        @media (min-width: 576px) {
          left: 50%;
        }
      }
    }
  }
}
</style>

<template>
  <div class="container">
    <h1>本站时间线</h1>
      <ul class="timeline">
          <li class="timeline" v-for="(posts, month) in sortedArticles" :key="month">
            <div class="icon done"></div>
            <details class="panel">
              <summary>{{ month }}</summary>
              <ul class="sub-list">
                <li class="item" v-for="(post, index) in posts" :key="index" v-on:click="goToPost(post.url)">{{ post.title }}</li>
              </ul>
            </details>
          </li>

      </ul>
  </div>
</template>
