---
title: '设计模式系列文章'
exclude: true
prev: false
next: false
---

<script setup>
import { data } from '../../.vitepress/theme/page_pattern.data';
</script>
<style module>
.desc {
  font-size: 14px;
  padding: 10px 0;
}
</style>

# 经典设计模式系列文章

本文来自于《深入设计模式》这本经典著作。 对 22 个经典设计模式以及这些模式背后的 8 个基本设计原则进行了说明。

## 为什么你需要了解设计模式？

- 了解设计模式能帮助你轻松应对面试和考核。 几乎所有关于编程的工作面试和考核中都会有关于模式的问题。 了解这些知识能够帮助你发现更广泛的工作机会， 或者实现升职加薪的工作目标。

- 了解设计模式可扩展你的编程工具箱。 模式能让你对已有的解决方案进行自定义， 而不用完全自行开发。 代码中的错误将更少， 因为你使用的是经过证明的标准解决方案， 它考虑了所有隐藏的问题。

- 了解设计模式让你能够更好地与同事沟通。 你只需将模式的名称告诉给程序员， 而不需要长篇累牍地解释自己那绝妙的设计思想以及其中各个类的作用。 不费吹灰之力就能搞定同事之间的沟通。

## 谁适合读这个系列？

- 模式初学者。 如果你从未学习过模式， 本书会讲解面向对象程序设计的基本原则， 并且提供真实示例。 在深入学习模式之前， 我们会先了解模式背后的基础性设计理念和原则。

- 希望复习模式知识的读者。 如果你以前学习过模式， 但是已经忘记了很多内容， 本书不仅能帮你重拾记忆， 还能是一本便捷的参考手册。 你可以快速找到自己感兴趣的章节， 无需从头到尾地进行阅读。

- 开始使用新编程语言的读者。 如果你正在着手使用一种新的面向对象的地的编程语言 （C#、 C++、 Go、 Java、 PHP、 Python、 Ruby、 Rust、 Swift 或 TypeScript）， 那么本书中众多的真实世界示例和类比 （包含精心制作的图表） 将帮助你迅速抓住隐藏在字里行间的关键信息。

## 常用设计模式目录

<div v-for="(categoryGroup, index) in data" :key="index">
  <h4>{{ categoryGroup.category }} {{ categoryGroup.postCount }} 种</h4>
  <ul>
    <li v-for="(post, idx) in categoryGroup.data" :key="idx">
      <h6><a :href="post.url">{{ post.title }}</a></h6>
      <div :class="$style.desc">
        {{ post.abstract }}
      </div>
    </li>
  </ul>
</div>




