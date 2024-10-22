<script setup>
import VueWordCloud from '../../utils/wordcloud.mjs'
import { data } from '../page_wordcloud.data';

const wordCloudData = data.map(({ category, postCount }) => ([category, postCount % 4]))
const style = "height: 300px; width: 80%; margin: 0 auto;"
const font = 'Inter'
const ratio = 0
const color = ([, weight]) => weight > 2 ? '#255489' : weight > 1 ? '#602960': weight > 0 ? '#155f3e' : '#3b8eed';
</script>

<style scoped>
.title {
  font-size: 56px;
  line-height: 64px;
  padding-bottom: 10px;
  text-decoration: underline;
  font-weight: 700;
  text-align: center;
  background: var(--vp-home-hero-name-background);
  background-clip: text;
  -webkit-text-fill-color: var(--vp-home-hero-name-color);
}
</style>

<template>
  <div class="title">智库 ● 词云</div>
  <VueWordCloud
    :words="wordCloudData"
    :style="style"
    :color="color"
    :font-size-ratio="ratio"
    :font-family="font"
    font-weight="bold"
  />
</template>

