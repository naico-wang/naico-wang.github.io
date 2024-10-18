---
layout: doc
title: '设计模式系列文章'
---

<script setup>
import { data } from '../../.vitepress/theme/posts.data';
const { posts } = data
console.log(posts)
</script>

<section>
<h1>All Blog Posts</h1>
  <ul>
    <li v-for="post of posts">
      <a :href="post.url">{{ post.title }}</a>
      <span>by {{ post.date }}</span>
    </li>
  </ul>
</section>




