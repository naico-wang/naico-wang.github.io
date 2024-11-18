<style scoped>
.home-container {
  max-width: 960px;
  padding: 50px 20px;
  margin: 0 auto;

}
@media (max-width: 740px) {}
</style>

<template>
  <div class="home-container">
    <UserInfo></UserInfo>
    <WordCloud></WordCloud>
    <DataList></DataList>
  </div>
</template>

<script setup lang="ts">
import WordCloud from './WordCloud.vue'
import UserInfo from './UserInfo.vue'
import DataList from './DataList.vue'
</script>
