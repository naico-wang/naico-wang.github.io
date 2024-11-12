<script setup>
import VueWordCloud from '../../utils/wordcloud.mjs'
import { data } from '../page_wordcloud.data';

const wordCloudData = data.map(({ category, postCount }) => ([category, category === '算法题解' ? postCount - 70 : postCount]))
const style = "height: 260px; width: 100%; margin-top: 20px;"
const font = 'Inter'
const fontStyle = 'italic'
const ratio = 0
const spacing = 0
const color = ([, weight]) => {
  switch (true) {
    case weight > 30: return '#255489';
    case weight > 20: return '#602960';
    case weight > 10: return '#155f3e';
    case weight > 5: return '#b8272c';
    default: return '#3451b2';
  }
};
</script>

<style scoped>
.module-title {
  font-size: 18px;
  line-height: 1.5;
  padding-top: 20px;
  padding-bottom: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  border-bottom: solid 1px var(--vp-c-brand-1);
}

@media (max-width: 740px) {
  .module-title {
    font-size: 24px;
    line-height: 1.2;
  }
}
</style>

<template>
  <div class="module-wrapper">
    <div class="module-title">● 智库词云</div>
    <VueWordCloud
      :words="wordCloudData"
      :style="style"
      :color="color"
      :font-size-ratio="ratio"
      :font-style="fontStyle"
      :font-family="font"
      :spacing = "spacing"
      font-weight="bold"
    />
  </div>

</template>

