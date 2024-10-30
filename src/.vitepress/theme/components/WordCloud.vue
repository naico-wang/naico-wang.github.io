<script setup>
import VueWordCloud from '../../utils/wordcloud.mjs'
import { data } from '../page_wordcloud.data';

const wordCloudData = data.map(({ category, postCount }) => ([category, postCount % 5]))
const style = "height: 300px; width: 100%;"
const font = 'Inter'
const fontStyle = 'italic'
const ratio = 0
const spacing = 0.5
const duration = 500
const color = ([, weight]) => weight > 2 ? '#255489' : weight > 1 ? '#602960': weight > 0 ? '#155f3e' : '#3b8eed';
</script>

<style scoped>
.title {
  font-size: 48px;
  line-height: 56px;
  padding-bottom: 10px;
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

