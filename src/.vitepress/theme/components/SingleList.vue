<script setup>
const props = defineProps(['data']);
</script>

<template>
  <div v-for="(categoryGroup, index) in data" :key="index">
    <h3>{{ categoryGroup.category }} ({{ categoryGroup.postCount }})</h3>
    <ul>
      <li v-for="(post, idx) in categoryGroup.data" :key="idx">
        <h5><a :href="post.url">{{ post.title }}</a></h5>
      </li>
    </ul>
  </div>
</template>
