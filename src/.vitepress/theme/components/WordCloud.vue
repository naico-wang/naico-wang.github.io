<script setup>
import { data } from '../page_wordcloud.data';

const wordCloudData = data.map(({ category, postCount }) => ([category, postCount]))
const style = "height: 320px; width: 90%;"
const font = 'Inter'
const color = ([, weight]) => weight > 20 ? '#6f42c1' : weight > 10 ? '#18794e': weight > 5 ? '#ff6600' : '#b8272c';
</script>

<style scoped>
.title {
  font-size: 56px;
  line-height: 64px;
  padding-bottom: 20px;
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
  <vue-word-cloud
    :words="wordCloudData"
    :style="style"
    :color="color"
    :font-family="font"
  />
</template>

