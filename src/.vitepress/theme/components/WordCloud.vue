<script setup>
import VueWordCloud from '../../utils/wordcloud.mjs'
import { data } from '../page_wordcloud.data';

const wordCloudData = data.map(({ category, postCount }) => ([category, postCount % 5]))
const style = "height: 350px; width: 100%;"
const font = 'Inter'
const fontStyle = 'italic'
const ratio = 0
const spacing = 0.5
const duration = 500
const color = ([, weight]) => weight > 2 ? '#255489' : weight > 1 ? '#602960': weight > 0 ? '#155f3e' : '#3b8eed';
</script>

<style scoped>
.title {
  font-size: 18px;
  line-height: 1.2;
  padding-bottom: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  border-bottom: dashed 1px var(--vp-c-brand-1);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.count {
  font-size: 12px;
}

@media (max-width: 740px) {
  .title {
    font-size: 24px;
    line-height: 1.2;
  }
}
</style>

<template>
  <div class="title">
    <div>● 智库词云</div>
    <div class="count">总计{{ data.length }}个关键词</div>
  </div>
  <VueWordCloud
    :animation-duration="duration"
    :words="wordCloudData"
    :style="style"
    :color="color"
    :font-size-ratio="ratio"
    :font-style="fontStyle"
    :font-family="font"
    :spacing = spacing
    font-weight="bold"
  />
</template>

