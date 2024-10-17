<script setup>
import { computed, reactive, ref } from 'vue';
import { data } from '../posts.data.ts';
import Pagination from './Pagination.vue'

const props = defineProps({
  displayCount: Number
})

const directoryNameMapping = {
  'Architecture': '软件架构',
  'Auth-and-Encrypt': 'Web加解密',
  'Design Pattern': '经典设计模式',
  'Engineering': '软件开发相关',
  'Java': 'Java相关',
  'JavaScript': 'JavaScript知识库',
  'Life Style': '生活日常',
  'React': 'React相关',
  'Vue': 'Vue相关',
  'Web-and-Mobile': '网站和移动开发'
}

const ALL_TAG_VALUE = 'all'
const currentTag = reactive({
  value: ALL_TAG_VALUE,
  setTag(tag) {
    this.value = tag;
  }
});
const { posts, tags, postCount } = data;
const pageData = computed(() => {
  return currentTag.value === ALL_TAG_VALUE ? props.displayCount ? posts.slice(0, props.displayCount) : posts : posts.filter(_ => _.tag === currentTag.value)
})

console.log(data)

const onTagSelect = (e) => currentTag.setTag(e);

// 定义响应式变量
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(posts.length)
const continues = ref(3)
const pageSizes = ref([10, 20, 30, 40])

// 页码变化处理函数
const handlePageNoChange = (newPageNo) => {
  pageNo.value = newPageNo
}
</script>

<style lang="scss" module>
  .main {
    padding: 0 12px;
    margin: 0 auto;

    & .listwrap {
      padding-top: 12px;
    }
  }
  .tag_list {
    list-style-type: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .tag_item {
      background-color: var(--vp-c-indigo-soft);
      font-weight: bold;
      color: var(--vp-c-text-1);
      padding: 2px 8px;
      font-size: 12px;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 12px;
      margin-top: 12px;

      &:hover {
        background: var(--vp-c-indigo-1);
        color: var(--vp-c-bg-soft);
        transition: all, .3s
      }

      &.current {
        background: var(--vp-c-indigo-1);
        color: var(--vp-c-bg-soft);
        transition: all, .3s;
      }
    }
  }

  .date {
    text-align: right;
  }

  .pagetags {
    display: flex;
  }

  .item_wrapper {
    padding: 0;
    border-radius: 16px;
    background-color: #fff;
    border: 1px solid #dedfe0;
    box-shadow: 5px 5px 10px #e2e2e3;
    margin-top: 20px;
    box-sizing: border-box;

    .item_title {
      display: flex;
      align-items: center;
      border-bottom: solid 1px #e2e2e3;
      padding: 20px;
    }

    .item_desc {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      color: var(--vp-c-text-2);
      font-size: 14px;
      box-sizing: border-box;
      background-color: var(--vp-c-indigo-soft);
      border-radius: 0 0 16px 16px;
    }

    .item_abstract {
      padding: 20px;
      color: grey;
    }

    .tag {
      margin-left: 12px;
      font-size: 12px;
      background-color: var(--vp-c-indigo-soft);
      color: var(--vp-c-text-1);
      padding: 0 8px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        font-weight: bold;
        background: var(--vp-c-indigo-1);
        color: var(--vp-c-bg-soft);
        transition: all, .3s;
      }
    }
  }

  .currenttag {
    background: var(--vp-c-indigo-1);
    color: var(--vp-c-bg-soft);
  }

  .item_link,
  .item_link:link,
  .item_link:visited {
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
    color: var(--vp-c-brand-1);
  }
  .item_link:hover {
    color: var(--vp-c-brand-1);
    font-weight: bold;
    text-decoration: underline;
  }

</style>
<template>
  <main :class="$style.main">
    <section :class="$style.pagetags">
      <div :class="$style.tag_list">
        <span
          :class="[$style.tag_item, currentTag.value === 'all' ? $style.current : '']"
          @click="onTagSelect('all')"
        >
          全部 ({{ postCount }})
        </span>
        <span
          :class="[$style.tag_item, currentTag.value === tag ? $style.current : '']"
          v-for="(tag, idx) in tags"
          :key="idx"
          @click="onTagSelect(tag)"
        >
          {{directoryNameMapping[tag]}}
        </span>
      </div>
    </section>
    <section :class="$style.listwrap">
      <div v-for="(article, index) in pageData" :key="index" :class="$style.item_wrapper">
        <div :class="$style.item_title">
          <a :href="article.url" :class="$style.item_link">{{article.title}}</a>
        </div>
        <div v-show="article.abstract" :class="$style.item_abstract">{{article.abstract}}</div>
        <div :class="$style.item_desc">
          <div :class="$style.date">{{article.date.string}}</div>
          <span :class="$style.tag" @click="onTagSelect(article.tag)">{{article.tag}}</span>
        </div>
      </div>
    </section>
    <section v-if="currentTag.value === 'all'">
      <pagination
        :pageNo="pageNo"
        :pageSize="pageSize"
        :total="total"
        :continues="continues"
        :pageSizes="pageSizes"
        @change-page-no="handlePageNoChange"
      />
    </section>
  </main>
</template>
