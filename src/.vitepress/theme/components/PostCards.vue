<script setup>
const props = defineProps(['data'])
</script>

<style lang="scss" module>
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
      padding: 15px 20px;
      font-size: 16px;
    }

    .item_desc {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      color: var(--vp-c-text-2);
      font-size: 12px;
      box-sizing: border-box;
      background-color: var(--vp-c-indigo-soft);
      border-radius: 0 0 16px 16px;
    }

    .item_abstract {
      padding: 10px 20px;
      color: grey;
      font-size: 14px;
    }

    .tag {
      margin-left: 12px;
      font-size: 12px;
      background-color: var(--vp-c-indigo-1);
      font-weight: bold;
      color: var(--vp-c-bg-soft);
      padding: 0 8px;
      border-radius: 6px;
    }
  }

  .currenttag {
    background: var(--vp-c-indigo-1);
    color: var(--vp-c-bg-soft);
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
  <div v-for="(post, index) in props.data" :key="index" :class="$style.item_wrapper">
    <div :class="$style.item_title">
      <a :href="post.url" :class="$style.item_link">{{post.title}}</a>
    </div>
    <div v-show="post.abstract" :class="$style.item_abstract">{{post.abstract}}</div>
    <div :class="$style.item_desc">
      <div :class="$style.date">{{post.date.string}}</div>
      <span :class="$style.tag">{{post.category}}</span>
    </div>
  </div>
</template>
