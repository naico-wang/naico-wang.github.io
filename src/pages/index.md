---
layout: home
title: '奶一口智库'

hero:
 name: 奶一口智库
 text: 做最好的自己
 tagline: Naico (Hongyu) Wang
 image:
   src: /icons/icon-avatar.png
   alt: 膜蛤
 actions:
  - theme: brand
    text: 文章导览
    link: /posts
  - theme: alt
    text: 开发笔记
    link: /development
  - theme: alt
    text: 面试八股文
    link: /interview
  - theme: alt
    text: 深入 ● 技术与设计模式
    link: /deepin
  - theme: alt
    text: 关于作者
    link: /about
#features:
#  - icon:
#      src: /icons/icon-logo.svg
#    title: 关于作者：<hr />
#    details: "· Pricinple Solution Architect<br />· Programming Enthusiast<br />· Bon Vivant<br />· Residing in Shanghai, China<br />"
#  - icon:
#      src: /icons/icon-logo.svg
#    title: 擅长技术栈：<hr />
#    details: "· HTML5/CSS/JavaScript<br />· .NET Core/ASP.NET/Java<br />· React/Vue/Nodejs<br />· All MiniPrograms<br />"
#  - icon:
#      src: /icons/icon-logo.svg
#    title: 曾经的角色：<hr />
#    details: "· Engineering Lead<br />· Scrum Master/Agile Coach<br />· Project Management<br />· System Design and Architect<br />"
---

<script setup>
import Layout from '../.vitepress/theme/components/Layout.vue';
import WordCloud from '../.vitepress/theme/components/WordCloud.vue';
import RecentUpdate from '../.vitepress/theme/components/RecentUpdate.vue';
</script>

<Layout>
  <template v-slot:aside>
    <RecentUpdate></RecentUpdate>
  </template>
  <template v-slot:main>
    <WordCloud></WordCloud>
  </template>
</Layout>
