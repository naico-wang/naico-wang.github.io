<script setup>
import VueWordCloud from '../../utils/wordcloud.mjs'
import { data } from '../page_wordcloud.data';

const wordCloudData = data.map(({ category, postCount }) => ([category, postCount % 3 ]))
const style = "height: 260px; width: 100%; margin-top: 20px;"
const font = 'Inter'
const fontStyle = ''
const ratio = 0
const spacing = 0
const color = () => `rgb(${[ Math.round(Math.random() * 160) + 50, Math.round(Math.random() * 160), Math.round(Math.random() * 160) ].join(',')})`;
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

