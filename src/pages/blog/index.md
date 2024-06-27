---
layout: doc
---
# 文章列表 :eyes:
---
<script setup>
import { computed } from 'vue';
import { data } from '../../.vitepress/theme/posts.data.mts';

const { yearMap, postMap } = data;
const yearList = Object.keys(yearMap).sort((a, b) => b - a);
const computedYearMap = computed(()=> {
  let result = {};
  
  for(let key in yearMap) {
    result[key] = yearMap[key].map(url => postMap[url])
  }

  return result
});
</script>
<style module>
.title {
  font-size: 24px;
  line-height: 48px;
  font-weight: bold;
  font-style: italic;
}
.item {
  margin: 0;
  padding: 0;
}
.item_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  /* height: 30px; */
}
.content {
  list-style-type: square;
  display: flex;
}
.link {
  flex: 1;
  padding-left: 8px;
}
.tag {
  line-height: 20px;
  padding: 2px 5px;
  font-size: 12px;
  /* font-weight: bold; */
  /* color: var(--vp-c-sponsor); */
  background-color: var(--vp-c-bg-soft);
  border-radius: 6px;
  border: solid 1px var(--docsearch-text-color);
}
.date {
  text-align: right;
}
</style>
<div v-for="year in yearList" :key="year">
  <div :class="$style.title">{{ year }} 年</div>
<ul>
  <li v-for="(article, index2) in computedYearMap[year]" :key="index2" :class="$style.item">
    <div :class="$style.item_row">
      <span :class="$style.tag">{{article.tag}}</span>
      <a :href="article.url" :class="$style.link">{{article.title}}</a>
      <div :class="$style.date">{{article.date.string}}</div>
    </div>
  </li>
</ul>
</div>
