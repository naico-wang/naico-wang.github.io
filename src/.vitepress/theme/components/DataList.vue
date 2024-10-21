<script setup>
import { ref, computed } from 'vue'
import { data } from '../page_all.data'

const { posts, count } = data

const currentPage = ref(1)
const pageSize = 30

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

<style scoped>
.site-title {
  font-size: 2rem;
  line-height: 2;
  padding: 20px 0;
  font-weight: 700;
  text-align: center;
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
  background-color: #222222;
  color: #ffffff;
}

.pagination button.active {
  font-weight: bold;
  background-color: #222222;
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
  padding: 20px;
  border: solid 1px #efefef;
  border-radius: 10px;
}

.wrapper {
  padding: 10px 10px;
  border-bottom: solid 1px #efefef;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.post-title {
  font-size: 18px;
  line-height: 2;
}
.post-desc {
  color: #222222;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.sup {
  font-size: 10px;
  margin-left: 10px;
}
.post-title a,
.post-title a:link,
.post-title a:active,
.post-title a:visited {
  color: #222222;
  text-decoration: none;
}
.post-title a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .wrapper {
    padding-left: 0;
    padding-right: 0;
  }
  .site-title {
    padding: 0;
    font-size: 1.5rem;
  }
  .list {
    margin-top: 20px;
    padding-top: 0;
  }
  .post-title {
    font-size: 12px;
  }
  .post-desc {
    font-size: 10px;
  }
  .sup {
    display: none;
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
  <div class="site-title">本站文章索引</div>
  <div class="list">
    <article class="wrapper" v-for="(post, index) in currentPageArticles" :key="index">
      <div class="post-title">
        <a :href="post.url">{{ post.title }}</a>
        <sup class="sup">{{ post.category }}</sup>
      </div>
      <div class="post-desc">{{ post.date }}</div>
    </article>
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
</template>
