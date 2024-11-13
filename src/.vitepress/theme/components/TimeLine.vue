<script setup>
import { data } from '../page_all.data'
import { useRouter } from 'vitepress';
import { computed } from 'vue';

const { go } = useRouter();
const { posts, count } = data

const sortedArticles = computed(() => {
  const grouped = {};

  posts.forEach((article) => {
    const match = article.date.match(/^(\d{4})年(\d{1,2})月/);
    if (match) {
      const year = `${match[1]}年`;
      const month = `${match[2]}月`;

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];
      grouped[year][month].push(article);
    }
  });

  // 按年月排序
  const sortedGrouped = {};
  Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .forEach((year) => {
      sortedGrouped[year] = {};
      Object.keys(grouped[year])
        .sort((a, b) => b.localeCompare(a))
        .forEach((month) => {
          sortedGrouped[year][month] = grouped[year][month];
        });
    });

  return sortedGrouped;
});
</script>

<style lang="scss" scoped>
.post-list {
  padding: 40px;
  margin: 0 auto;
  max-width: 900px;
}
.site-title {
  font-size: 2rem;
  line-height: 2;
  padding: 10px 0;
  font-weight: 700;
  text-align: center;
}

.articles-tree {

  & .year-section {

    & .year-title {
      font-size: 32px;
      line-height: 1.5;
      font-weight: bold;
      color: #444444;

      &:before {
        content: '● ';
      }
    }

    & .months {
      margin-left: 15px;

      & .month-section {

        & .month-title {
          color: #444444;
          display: flex;
          align-items: center;
          font-size: 24px;
          line-height: 2;
          font-weight: bold;
          padding: 15px 0 5px 30px;
          border-left: dashed 1px #444444;

          &:after {
            width: 25px;
            height: 25px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E") center no-repeat;
            display: inline-block;
            content: '';
            transform: rotate(90deg);
          }
        }

        & .articles {
          padding-left: 20px;
          border-left: dashed 1px #444444;

          & .ul {
            padding-left: 20px;

            & .li {
              font-size: 16px;
              line-height: 2.5;
              padding-left: 20px;
              border-left: solid 1px #444444;

              & .date {
                font-size: 14px;
              }
              & .category {
                color: #ffffff;
                padding: 2px 5px;
                background: var(--vp-c-brand-3);
                border-radius: 6px;
                margin-left: 10px;
                font-size: 12px;
              }

              & a,
              & a:link,
              & a:active {
                color: #444444;
              }

              & a:hover {
                font-weight: bold;
                color: var(--vp-c-brand-1);
                text-decoration: underline;
                transition: all .1s;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 600px) {
  .site-title {
    padding: 0;
    font-size: 1.5rem;
  }
  .post-list {
    padding: 20px 15px;
    margin: 0 auto;
    max-width: 700px;
  }
  .articles-tree {

    & .year-section {

      & .year-title {
        font-size: 18px;
      }

      & .months {
        margin-left: 8px;

        & .month-section {

          & .month-title {
            font-size: 16px;
            padding-left: 15px;
          }

          & .articles {
            padding-left: 10px;

            & .ul {

              & .li {
                font-size: 12px;

                & .date,
                & .category {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="post-list">
    <div class="site-title">本站时间线</div>
    <div class="articles-tree">
      <div v-for="(months, year) in sortedArticles" :key="year" class="year-section">
        <div class="year-title">{{ year }}</div>
        <div class="months">
          <div v-for="(articles, month) in months" :key="month" class="month-section">
            <div class="month-title">
              <span>{{ month }}份</span>
            </div>
            <div class="articles">
              <ul class="ul">
                <li class="li" v-for="article in articles" :key="article.url">
                  <span class="date">[{{ article.date }}] - </span>
                  <span><a :href="article.url">{{ article.title }}</a></span>
                  <span class="category">{{ article.category }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
