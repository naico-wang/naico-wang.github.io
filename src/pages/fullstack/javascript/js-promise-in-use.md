---
title: 可视化看 Promise 的执行逻辑
date: 2024-07-17
tag: JavaScript
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

- 创建一个 `Promise` 对象。这个 Promise 对象包含几个内部槽，包括 `[[PromiseState]]`、`[[PromiseResult]]`、`[[PromiseIsHandled]]`、`[[PromiseFulfillReactions]]` 和 `[[PromiseRejectReactions]]`。

- 创建一个 `Promise Capability` 记录。这个记录 “封装” 了 Promise，并增加了额外的功能来 resolve 或 reject promise。这些功能可控制 promise 的最终 `[[PromiseState]]` 和 `[[PromiseResult]]` ，并启动异步任务。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--ZoPmH-68--/v1711049637/Screen_Recording_2024-03-21_at_2.33.24_PM_lhhkvx.mp4" />

## 解决 Promise

我们可以通过调用 `resolve` 来解决这个 Promise，这是通过执行函数可以实现的。当我们调用 `resolve` 时：

1. `[[PromiseState]]` 被设置为 `fulfilled`。

2. `[[PromiseResult]]` 被设置为我们传递给 resolve 的值，在这种情况下是 `Done!`。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--qzkIeZ8_--/vc_h264/v1711049637/Screen_Recording_2024-03-21_at_2.33.24_PM_lhhkvx.mp4" />

## 拒绝 Promise

调用 `reject` 时的过程类似，现在 `[[PromiseState]]` 被设置为 `rejected`，并且 `[[PromiseResult]]` 被设置为我们传递给 `reject` 的值，即 `Fail!`。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--WdCyRJ2a--/v1711050101/Screen_Recording_2024-03-21_at_2.39.32_PM_o1mmpa.mp4" />

## 使用函数改变内部属性

使用函数来改变对象内部属性有什么特别的呢？

答案就在与我们目前跳过的两个内部槽相关的行为中：`[[PromiseFulfillReactions]]` 和 `[[PromiseRejectReactions]]`。

`[[PromiseFulfillReactions]]` 字段包含 Promise Reactions。这是一个通过将 then 处理程序链接到 Promise 而创建的对象。

此 Promise Reaction 包含一个 `[[Handler]]` 属性，其中包含我们传递给它的回调。当 promise resolve 时，该处理程序会被添加到 `Microtask Queue` 中，并可访问 promise 解析时的值。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--N5KNNf4P--/v1711050079/Screen_Recording_2024-03-21_at_2.40.43_PM_iwt5vk.mp4" />

当 promise 解析时，这个处理程序接收到 `[[PromiseResult]]` 的值作为其参数，然后将其推送到 `Microtask Queue` 微任务队列。

这就是 promise 的异步部分发挥作用的地方！

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--6RZwmECA--/v1711289481/Screen_Recording_2024-03-24_at_9.09.44_AM_zkfp0x.mp4" />

> `Microtask Queue` 是事件循环（event loop）中的一个专门队列。当调用栈（Call Stack）为空时，事件循环首先处理微任务队列中等待的任务，然后再处理来自常规任务队列（也称为 “回调队列” 或 “宏任务队列”）的任务。
> 
> <video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--5m-F-2oM--/v1711289949/Screen_Recording_2024-03-24_at_9.18.14_AM_ruprvi.mp4" />

类似地，我们可以通过链式 `catch` 来创建一个 Promise Reaction 记录来处理 Promise Reject。当 Promise 被拒绝时，这个回调会被添加到`微任务队列`。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--N5KNNf4P--/v1711050079/Screen_Recording_2024-03-21_at_2.40.43_PM_iwt5vk.mp4" />

到目前为止，我们只是在执行函数内直接调用 `resolve` 或 `reject`。虽然这是可能的，但它并没有充分利用 Promise 的全部功能（和主要目的）！

在大多数情况下，我们希望在稍后的某个时间点（通常是异步任务完成时）进行 `resolve` 或 `reject`。

异步任务在主线程之外执行，例如读取文件（如 fs.readFile）、提出网络请求（如 `https.get` 或 `XMLHttpRequest`），或者像定时器（`setTimeout`）这样简单的任务。

![image](https://mmbiz.qpic.cn/sz_mmbiz_png/meG6Vo0MevjRHibgYVAF4uAugU23Xib7vuppJZ5BBf0VrFRbqicWBiaJtDicdiaI3g9EFuc9b4trTPXPy0BgVV3OhTYw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

当这些任务在未来某个未知的时间点完成时，我们可以使用此类异步操作通常提供的回调功能，要么使用异步任务返回的数据进行 `resolve`，要么在发生错误时进行 `reject`。

为了直观地说明这一点，让我们一步步来执行。为了让这个演示简单但仍然真实，我们将使用 `setTimeout` 来添加一些异步行为。

```javascript
new Promise((resolve) => {
    setTimeout(() => resolve("Done!"), 100);
}).then(result => console.log(result))
```

首先，将 `new Promise` 构造函数添加到调用栈，并创建 `Promise` 对象。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--VF_Od111--/v1711214758/Screen_Recording_2024-03-23_at_12.21.27_PM_nt6qzk.mp4" />

然后，执行函数被执行。在函数体的第一行，我们调用了 `setTimeout`，并将其添加到调用堆栈中。

`setTimeout` 负责在 Timers Web API 中调度计时器，延迟时间为 100 毫秒，之后我们传递给 `setTimeout` 的回调将被推送到任务队列。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--VF_Od111--/v1711214758/Screen_Recording_2024-03-23_at_12.21.27_PM_nt6qzk.mp4" />

> 这里的异步行为与 setTimeout 有关，与 promise 无关。我在这里展示这个是为了展示承诺的常见用法 —— 在一些延迟后解决一个 promise。
> 
> 然而，延迟本身并不是由 promise 引起的。promise 被设计为与异步操作一起工作，但这些异步操作可以来自不同的来源，如定时器或网络请求。

在定时器和构造函数从调用栈中弹出后，引擎遇到了 `then`。

`then` 被添加到调用栈，并创建了一个 `Promise Reaction` 记录，该处理程序就是我们作为回调传递给 `then` 处理程序的代码。

由于 `[[PromiseState]]` 仍然是 `pending`，这个 Promise Reaction 记录会被添加到 `[[PromiseFulfillReactions]]` 列表中。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--eFQtSN3o--/v1711215213/Screen_Recording_2024-03-23_at_12.32.19_PM_vj7fv5.mp4" />

100 毫秒过后，`setTimeout` 回调被推送到任务队列。

脚本已经运行完毕，因此调用栈为空，这意味着该任务现在是从 `Task Queue` 中取出放到 `Call Stack` 上，它调用了 `resolve`。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--BOz3Wscv--/eo_5/v1711216474/Screen_Recording_2024-03-23_at_12.53.51_PM_igdqbf.mp4" />

调用 resolve 将 `[[PromiseState]]` 设置为 `“fulfilled”`，将 `[[PromiseResult]]` 设置为 `“Done!”`，并与 Promise Reaction 处理程序相关的代码被添加到 `Microtask Queue` 中。

`resolve` 和回调从调用栈中弹出。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--kjL0rehF--/so_5/v1711216474/Screen_Recording_2024-03-23_at_12.53.51_PM_igdqbf.mp4" />

由于调用栈为空，事件循环首先检查微任务队列，那里 `then` 处理程序的回调正在等待。

回调现在被添加到调用栈，并记录 `result` 的值，即 `[[PromiseResult]]` 的值；字符串 'Done!'。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--QBCCABTA--/v1711221523/Screen_Recording_2024-03-23_at_2.17.52_PM_vxfdld.mp4" />

一旦回调执行完毕并从调用栈中弹出，程序就完成了！

除了创建一个 `Promise Reaction` 之外，then 还返回一个 `Promise`。这意味着我们可以将多个 `then` 链接在一起，例如：

```javascript
new Promise((resolve) => {
   resolve(1)
})
  .then(result => result * 2)
  .then(result => result * 2)
  .then(result => console.log(result));
```

执行这段代码时，在调用 Promise 构造函数时会创建一个 Promise 对象。之后，每当引擎遇到 then 时，就会创建一个 Promise Reaction 记录和一个 Promise Object。

在这两种情况下，`then` 的回调都将接收到的 `[[PromiseResult]]` 值乘以 2。then 的 `[[PromiseResult]]` 被设置为计算的结果，这个结果又被下一个 `then` 的处理程序使用。

<video controls src="https://res.cloudinary.com/dq8xfyhu4/video/upload/s--9_00B0tc--/v1711223895/Screen_Recording_2024-03-23_at_2.57.09_PM_ithhuf.mp4" />

最终，结果被记录下来。由于我们没有显式地返回一个值，所以最后一个 then promise 的 `[[PromiseResult]]` 是未定义的，这意味着它隐式地返回了未定义的值。

当然，使用数字并不是最现实的场景。相反，您可能希望逐步改变 promise 的结果，就像逐步改变图片的外观一样。

例如，您可能希望采取一系列增量的步骤，通过操作（如调整大小、应用滤镜、添加水印等）来改变图像的外观。

```javascript
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  })
}

loadImage(src)
 .then(image => resizeImage(image))
 .then(image => applyGrayscaleFilter(image))
 .then(image => addWatermark(image))
```

这类型的任务通常涉及异步操作，这使得 promise 成为以非阻塞方式管理这些操作的良好选择。

## 结论

长话短说，Promise 只是具有一些额外功能来改变其内部状态的对象。

Promises 最酷的地方在于，如果通过 then 或 catch 附加了处理程序，就可以触发异步操作。由于处理程序被推送到微任务队列，因此可以以非阻塞的方式处理最终结果。这样就能更轻松地处理错误、将多个操作连锁在一起，并使代码更具可读性和可维护性！

Promise 虽然是一个基础概念，对每个 JavaScript 开发人员来说都很重要。如果您有兴趣了解更多，`async/await` 语法（承诺的语法糖）等其他特性以及 `Async Generators`（异步生成器）等特性将为异步代码的使用提供更多方法。

## 参考阅读

- https://www.lydiahallie.com/blog/promise-execution
