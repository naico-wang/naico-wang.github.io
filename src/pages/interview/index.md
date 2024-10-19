---
title: '面试知识储备'
exclude: true
aside: false
---




<script setup>
import { data } from '../../.vitepress/theme/interview.data';
</script>
<style module>
.desc {
  font-size: 14px;
  padding: 10px 0;
}
</style>

<div v-for="(categoryGroup, index) in data" :key="index">
  <h2>{{ categoryGroup.category }}</h2>
  <ul v-for="(post, idx) in categoryGroup.data" :key="idx">
    <li>
      <h4><a :href="post.url">{{ post.title }}</a></h4>
    </li>
    <div :class="$style.desc">
      {{ post.abstract }}
    </div>
  </ul>
</div>
