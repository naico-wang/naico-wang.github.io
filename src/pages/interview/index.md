---
title: '面试知识储备'
exclude: true
aside: false
---

# 面试知识储备

网上乱逛的时候，看到了GitHub Starts的排序，突然发现了一个面试知识有关的牛逼网站。

摘抄了一些放在自己这里。

原文请移步：https://www.cyc2018.xyz/

感恩原作者！

<script setup>
import { data } from '../../.vitepress/theme/interview.data';
</script>

<div v-for="(categoryGroup, index) in data" :key="index">
  <h2>{{ categoryGroup.category }}</h2>
  <ul v-for="(post, idx) in categoryGroup.data" :key="idx">
    <li>
      <h6><a :href="post.url">{{ post.title }}</a></h6>
    </li>
  </ul>
</div>
