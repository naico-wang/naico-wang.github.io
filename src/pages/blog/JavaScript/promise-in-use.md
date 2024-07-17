---
title: 可视化看 Promise 的执行逻辑
date: 2024-07-17
abstract: 在这篇文章中，我们将深入探讨 Promise 的一些内部机制，并探索它们是如何使得 JavaScript 能够执行非阻塞的异步任务。
---

# 通过可视化彻底搞懂 Promise执行逻辑

> 原文地址：https://www.lydiahallie.com/blog/promise-execution

JavaScript 中的 Promise 一开始可能会让人感到有些难以理解，但是如果我们能够理解其内部的工作原理，那么可以让它们变得更加容易理解。

在这篇博客文章中，我们将深入探讨 Promise 的一些内部机制，并探索它们是如何使得 JavaScript 能够执行非阻塞的异步任务。

## 创建 Promise

一种创建 Promise 的方式是使用 `new Promise` 构造函数，它接收一个执行函数，该函数带有 `resolve` 和 `reject` 参数。

```javascript
new Promise((resolve, reject) => {
   // TODO(Lydia): Some async stuff here
});
```

当 Promise 构造函数被调用时，会发生以下几件事情：

创建一个 Promise 对象。这个 Promise 对象包含几个内部槽，包括 `PromiseState`、`PromiseResult`、`PromiseIsHandled`、`PromiseFulfillReactions` 和 `PromiseRejectReactions`。

创建一个 Promise 能力记录。这个记录 “封装” 了 Promise，并增加了额外的功能来 resolve 或 reject promise。这些功能可控制 promise 的最终 `PromiseState` 和 `PromiseResult` ，并启动异步任务。

![image1](https://mmbiz.qpic.cn/sz_mmbiz_gif/meG6Vo0MevjRHibgYVAF4uAugU23Xib7vudFRM3LtsujMoIm9S1pg7LJajQkXRbySOH1gg0d7Rt84DRJJib3ScGrA/640?wx_fmt=gif&from=appmsg&wxfrom=13)