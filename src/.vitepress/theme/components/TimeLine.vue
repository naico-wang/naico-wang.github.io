<script setup>
import { data } from '../page_all.data'
import { useRouter } from 'vitepress';

const { go } = useRouter();
const { posts } = data

const groupedByYear = posts.reduce((acc, article) => {
  const match = article.date.match(/^(\d{4})-(\d{1,2})/);

  if (match) {
    if (match) {
      const yearMonth = `${match[1]} / ${match[2]}`;

      if (!acc[yearMonth]) {
        acc[yearMonth] = [];
      }
      acc[yearMonth].push(article);
    }
  }

  return acc;
}, {});

const groupedArray = Object.keys(groupedByYear).map(yearmonth => ({
  date: yearmonth,
  articles: groupedByYear[yearmonth],
}));
const goToPost = (e) => go(e)
</script>

<style lang="scss" scoped>
.container {
  max-width: 760px;
  margin: 0 auto;
  padding: 20px;

  & .title {
    font-size: 32px;
    font-weight: bold;
    line-height: 2.5;
    text-align: center;
  }

  & .details {
    padding: 0;

    & .date {
      position: relative;
      font-size: 22px;
      line-height: 2;
      cursor: pointer;
      list-style-type: none;
      padding-left: 30px;
      text-decoration: underline double darkblue;

      &::-webkit-details-marker { display:none; }

      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        content: '';
        display: block;
        width: 15px;
        height: 15px;
        background-color: var(--vp-c-black);
        border-radius: 50%;
      }
    }

    & .list {
      margin-left: 5px;
      padding-left: 25px;
      border-left: dotted 3px var(--vp-c-black);

      & li {
        padding: 5px 10px 5px 20px;
        position: relative;
        font-size: 14px;
        line-height: 2;
        cursor: pointer;

        & span {
          display: inline-block;
          line-height: 2;

          &:hover {
            text-decoration: underline double;
          }
        }

        &:before {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          background-color: var(--vp-c-black);
          border-radius: 50%;
        }

        & sup {
          margin-left: 5px;
          font-size: 8px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
<template>
  <div class="container">
    <div class="title">-=时间线=-</div>
    <div class="item-wrapper">
      <details class="details" v-for="item in groupedArray" open>
        <summary class="date">{{ item.date }}</summary>
        <ul class="list">
          <li v-for="article in item.articles" v-on:click="goToPost(article.url)">
            <span>{{ article.title }}</span>
            <sup>{{ article.date }}</sup>
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>
