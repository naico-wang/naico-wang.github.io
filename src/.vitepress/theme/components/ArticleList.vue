<script setup>
import { computed, reactive } from 'vue';
import { data } from '../page_fullstack.data.ts';

const props = defineProps({
  displayCount: Number
})

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
const onTagSelect = (e) => currentTag.setTag(e);
</script>

<style lang="scss" module>
  .main {
    padding-right: 100px;
    margin: 0 auto;
  }

  .title {
    font-size: 2rem;
    font-weight: bold;
    line-height: 3rem;
    padding: 20px 0;
    text-align: center;
    color: var(--vp-c-indigo-1);
  }

  .date {
    text-align: right;
    color: var(--vp-c-indigo-1);
  }

  .pagetags {
    position: fixed;
    right: 0;
    top: var(--vp-nav-height);

    & .tag_list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 20px;

      & .tag_item {
        background-color: var(--vp-c-gray-3);
        font-weight: bold;
        color: var(--vp-c-text-1);
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 6px 0 0 6px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

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
  }

  @media (max-width: 600px) {
    .main {
      padding: 0;
    }

    .pagetags {
      background: #ffffff;
      position: sticky;
      top: 47px;

      & .tag_list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
        padding: 20px 0;

        & .tag_item {
          border-radius: 6px;
        }
      }
    }

  }

  @media (min-width: 1500px) {
    .main {
      padding: 0;
    }
  }

  .item_wrapper {
    padding: 0;
    border-radius: 16px;
    background-color: #fff;
    border: 1px solid #dedfe0;
    box-shadow: 5px 5px 10px #e1e2e2;
    margin-top: 20px;
    box-sizing: border-box;

    &:first-child {
      margin-top: 0;
    }

    .item_title {
      display: flex;
      font-size: 16px;
      align-items: center;
      padding: 15px 20px;
      background-color: var(--vp-c-gray-3);
      border-radius: 16px 16px 0 0;
    }

    .item_desc {
      padding: 10px 25px;
      color: var(--vp-c-text-2);
      font-size: 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .item_abstract {
      padding: 10px 20px;
      font-size: 12px;
      line-height: 18px;
      color: grey;
      border-bottom: solid 1px #e2e2e3;
    }

    .tag {
      font-size: 10px;
      line-height: 18px;
      font-weight: bold;
      background-color: var(--vp-c-indigo-1);
      color: var(--vp-c-bg-soft);
      padding: 0 8px;
      border-radius: 4px;
    }
  }

  .currenttag {
    background: var(--vp-c-indigo-1);
    color: var(--vp-c-bg-soft);
  }

  .item_link {
    font-weight: bold;
  }

  .item_link,
  .item_link:link,
  .item_link:visited {
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
    <div :class="$style.title">全栈开发文章列表</div>
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
          {{tag}}
        </span>
      </div>
    </section>
    <section>
      <div v-for="(article, index) in pageData" :key="index" :class="$style.item_wrapper">
        <div :class="$style.item_title">
          <a :href="article.url" :class="$style.item_link">{{article.title}}</a>
        </div>
        <div v-show="article.abstract" :class="$style.item_abstract">{{article.abstract}}</div>
        <div :class="$style.item_desc">
          <span :class="$style.tag">{{article.tag}}</span>
          <div :class="$style.date">{{article.date.string}}</div>
        </div>
      </div>
    </section>
  </main>
</template>
