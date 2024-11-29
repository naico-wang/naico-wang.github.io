<style lang="scss" scoped>
.home-container {
  max-width: 760px;
  padding: 20px;
  margin: 0 auto;
}
</style>

<template>
  <div class="home-container">
    <UserInfo></UserInfo>
    <WordCloud></WordCloud>
    <DataList></DataList>
  </div>
</template>

<script setup lang="ts">
import UserInfo from './UserInfo.vue'
import DataList from './DataList.vue'
import WordCloud from './WordCloud.vue'
</script>
