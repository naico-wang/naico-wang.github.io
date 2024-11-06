<script setup>
import { ref, computed } from 'vue'
import { data } from '../page_all.data'
import { useRouter } from 'vitepress';

const { go } = useRouter();
const { posts, count } = data

const currentPage = ref(1)
const pageSize = 30

const goToPost = (e) => go(e)

const totalPages = computed(() => Math.ceil(posts.length / pageSize))

const currentPageArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return posts.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  const leftBound = Math.max(1, currentPage.value - 1)
  const rightBound = Math.min(totalPages.value, currentPage.value + 1)

  if (leftBound > 1) pages.push(1, '...')
  for (let i = leftBound; i <= rightBound; i++) {
    pages.push(i)
  }
  if (rightBound < totalPages.value) pages.push('...', totalPages.value)

  return pages
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style lang="scss" scoped>
.post-list {
  padding: 0 20px;
}
.site-title {
  font-size: 2rem;
  line-height: 2;
  padding: 10px 0;
  font-weight: 700;
  text-align: center;
}

.total-count {
  padding: 0 0.75rem 1rem;
  font-size: 1rem;
  text-align: right;
  color: #222222;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: solid 1px #efefef;
  color: #222222;
  font-size: 12px;
}

.pagination button:hover {
  background-color: var(--vp-c-green-3);
  color: #ffffff;
}

.pagination button.active {
  font-weight: bold;
  background-color: var(--vp-c-green-3);
  color: #ffffff;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.total-pages {
  font-size: 12px;
  margin-left: 10px;
}

.list {
  padding: 10px;
  border: solid 1px #efefef;
  border-radius: 10px;

  & .item-list {
    padding: 0;
    margin: 0;
    list-style: none;

    & .item {
      margin-top: 15px;
      cursor: pointer;

      &:first-child {
        margin-top: 5px;
      }

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

          & .desc{
            & .category {
              background-image: url("/icons/icon-tag-active.svg");
            }
            & .date {
              background-image: url("/icons/icon-date-active.svg");
            }
          }
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
            padding-left: 22px;
            font-size: 12px;
            background: url("/icons/icon-tag.svg") left 2px no-repeat transparent;
            background-size: 18px;
            font-weight: 700;
          }
          & .date {
            padding-left: 22px;
            font-size: 12px;
            background: url("/icons/icon-date.svg") left 2px no-repeat;
            background-size: 18px;
            font-weight: 700;
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
  .list {
    margin-top: 20px;
    padding-top: 0;
  }
  .total-pages {
    display: none;
  }
  .pagination button {
    font-size: 10px;
    padding: 5px 8px;
  }
  .eclips {
    display: none;
  }
}
</style>

<template>
  <div class="post-list">
    <div class="site-title">本站文章索引</div>
    <div class="total-count">● 总共{{ count }}篇</div>
    <div class="list">
      <ul class="item-list">
        <li class="item" v-for="(post, index) in currentPageArticles" :key="index" v-on:click="goToPost(post.url)">
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
    <div class="pagination">
      <button @click="goToPage(1)" :disabled="currentPage === 1">首页</button>
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"><<</button>
      <template v-for="page in displayedPages" :key="page">
        <button
          v-if="page !== '...'"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
        <span class="eclips" v-else>{{ page }}</span>
      </template>

      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">>></button>
      <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">尾页</button>
      <span class="total-pages">共 {{ totalPages }} 页</span>
    </div>
  </div>
</template>
