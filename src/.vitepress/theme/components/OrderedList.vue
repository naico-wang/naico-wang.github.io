<script setup>
const props = defineProps(['data']);
</script>

<style lang="scss" module>
</style>
<template>
  <section>
    <div v-for="(categoryGroup, index) in data" :key="index">
      <h2>{{ categoryGroup.category }}</h2>
      <ul>
        <li v-for="(post, idx) in categoryGroup.data" :key="idx">
          <a :href="post.url">{{ post.title }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>
