<script setup>
import { ref, computed } from 'vue'
import { data } from '../page_all.data'
import { useRouter } from 'vitepress';

const { go } = useRouter();
const { posts } = data

const currentPage = ref(1)
const pageSize = 10

const goToPost = (e) => go(e)

const totalPages = computed(() => Math.ceil(posts.length / pageSize))

const currentPageArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return posts.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  const leftBound = Math.max(1, currentPage.value - 2)
  const rightBound = Math.min(totalPages.value, currentPage.value + 2)

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
  padding: 20px 0;
  margin: 0 auto;
  max-width: 1000px;
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
  color: var(--vp-c-brand-1);
}

.pagination {
  text-align: center;
  margin-top: 30px;

  & button {
    margin: 0 4px;
    padding: 0 5px;
    cursor: pointer;
    border: solid 1px var(--vp-c-green-3);
    border-radius: 2px;
    color: var(--vp-c-brand-1);
    font-size: 12px;

    & :hover {
      background-color: var(--vp-c-green-3);
      color: #ffffff;
    }

    &.active {
      font-weight: bold;
      background-color: var(--vp-c-green-3);
      color: #ffffff;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

.total-pages {
  font-size: 12px;
  margin-left: 10px;
  color: var(--vp-c-brand-1);
}

.list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  & .item {
    cursor: pointer;

    & .item-wrap {
      padding: 15px 20px;
      border: solid 2px var(--vp-c-brand-1);
      border-radius: 6px;
      color: var(--vp-c-brand-1);

      &:hover {
        color: #ffffff;
        background-color: var(--vp-c-brand-3);
        transition: background-color 0.3s;

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
        font-size: 18px;
        line-height: 1.5;
        font-weight: 700;
      }

      & .desc {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        & .category {
          padding-left: 22px;
          font-size: 14px;
          background: url("/icons/icon-tag.svg") left 2px no-repeat transparent;
          background-size: 18px;
          font-weight: 700;
        }
        & .date {
          padding-left: 22px;
          font-size: 14px;
          background: url("/icons/icon-date.svg") left 2px no-repeat;
          background-size: 18px;
          font-weight: 700;
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
    grid-template-columns: 1fr;
  }
  .total-pages {
    display: none;
  }
  .pagination button {
    font-size: 10px;
  }
  .pagination .prev,
  .pagination .next {
    display: none;
  }

}
</style>

<template>
  <div class="post-list">
    <div class="list">
      <article class="item" v-for="(post, index) in currentPageArticles" :key="index" v-on:click="goToPost(post.url)">
        <div class="item-wrap">
          <div class="title">{{ post.title }}</div>
          <div class="desc">
            <span class="category">{{ post.category }}</span>
            <span class="date">{{ post.date }}</span>
          </div>
        </div>
      </article>
    </div>
    <div class="pagination">
      <button @click="goToPage(1)" :disabled="currentPage === 1">首页</button>
      <button class="prev" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"><<</button>
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

      <button class="next" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">>></button>
      <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">尾页</button>
      <span class="total-pages">共 {{ totalPages }} 页</span>
    </div>
  </div>
</template>
