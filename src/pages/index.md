---
layout: home
title: '苟利国家生死以,岂因祸福避趋之'

hero:
  name: "苟利国家生死以"
  text: "岂因祸福避趋之"
  tagline: "Naico (Hongyu) Wang"
  image:
    src: /icons/icon-logo.svg
    alt: 膜蛤
  actions:
    - theme: brand
      text: Atricle List
      link: /blog
    - theme: alt
      text: View on GitHub
      link: https://github.com/naico-wang/naico-wang.github.io
features:
  - title: Introduction<hr />
    details: "· <em>Former Engineering Lead</em><br>· <em>Programming Enthusiast</em><br>· <em>Residing in Shanghai, China</em><br>"
  - title: Technical Skills<hr />
    details: "· <em>React/Vue/Nodejs</em><br>· <em>.NET Core/ASP.NET/Java</em><br>· <em>WeChat/Ali/TikTok MPs</em><br>"
  - title: Roles<hr />
    details: "· <em>Engineering Lead</em><br>· <em>PMP/PMP-ACP</em><br>· <em>System Design and Architect</em><br>"
---

<script setup>
  import ArticleList from '../.vitepress/theme/components/ArticleList.vue'
</script>
<section style="margin-top: 24px;">
  <ArticleList :display-count='8' />
</section>