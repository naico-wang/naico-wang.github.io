<script setup>
import VueWordCloud from '../../utils/wordcloud.mjs'
import { data } from '../page_wordcloud.data';

const wordCloudData = data.map(({ category, postCount }) => ([category, postCount % 3 ]))
const style = "height: 230px; width: auto; margin: 0 auto;"
const font = 'Inter'
const fontStyle = ''
const ratio = 0
const spacing = 0
const color = () => `rgb(${[ Math.round(Math.random() * 160) + 50, Math.round(Math.random() * 160), Math.round(Math.random() * 160) ].join(',')})`;
</script>

<style scoped>
.module-wrapper {
  box-sizing: border-box;
  background-color: #f6f6f6;
  border-radius: 10px;
  margin-top: 10px;
  padding: 20px;
}
</style>

<template>
  <div class="module-wrapper">
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

