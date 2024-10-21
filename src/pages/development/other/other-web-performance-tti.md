---
title: 聚焦于 Web 性能指标 TTI
date: 2024-09-20
tag: 杂七杂八
category: 杂七杂八
abstract: 在优化网站性能的过程中，我们经常遇到一个“为指标而优化”的困境。指标并不能真正反映用户体验，而应该最真实地反映用户行为。在本节中，我们将研究 TTI（Time to Interactive）。
---

# 聚焦于 Web 性能指标 TTI

在优化网站性能的过程中，我们经常遇到一个“为指标而优化”的困境。指标并不能真正反映用户体验，而应该最真实地反映用户行为。

在本节中，我们将研究 TTI（Time to Interactive）。在深入探讨这个话题之前，我们先了解一些背景知识。

## RAIL 模型

RAIL 是一个以用户为中心的性能模型。每个 web 应用程序在其生命周期中都有四个不同的方面，这些方面以不同的方式影响性能：

![RAIL模型](https://mmbiz.qpic.cn/mmbiz_png/LDPLltmNy571LicbMsgAAnTTDyD9wv2lOQMZHODGar0Xv3OJFUib7gSGPfNsAxiaxjeIl649cx7GxJuagY04rMGibg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

1. 响应：输入延迟时间（从按下到绘制）小于 100 毫秒。
    - 用户按下一个按钮（例如打开导航）。

2. 动画：每帧工作的完成时间（从 JS 到绘制）小于 16 毫秒。
    - 用户滚动页面，拖动手指（例如打开菜单）或看到动画。当拖动时，应用程序的响应应该与手指位置相关（例如下拉刷新，滑动轮播）。此指标仅适用于拖动的连续阶段，而不适用于初始阶段。

3. 空闲：主线程 JS 工作被分成不超过 50 毫秒的块。
    - 用户不与页面交互，但主线程应有足够的时间处理下一个用户输入。

4. 加载：页面可以在 1000 毫秒内准备就绪。
    - 用户加载页面并看到关键路径内容。

如果你想提高网站的用户体验，RAIL 是一个很好的评估模型。

## 解释 TTI（Time to Interactive）

TTI 是指应用程序已经可视化渲染并且可以响应用户输入的时间。为了理解 “TTI”，我们需要了解它的计算规则。我们看看下图：

![TTI](https://mmbiz.qpic.cn/mmbiz_png/LDPLltmNy571LicbMsgAAnTTDyD9wv2lOhKKwicq0uzqVVVsMz7BhtwosUhEQstWzJbbrfALLZyAiakibcicloF7ITg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

在官方文档中找到了以下描述：

> First Idle 是主线程第一次静止并且浏览器完成第一次有意义绘制的早期标志。
>
> Time to Interactive 是在第一次有意义绘制之后。浏览器的主线程已经静止至少 5 秒，并且没有长任务会阻止立即响应用户输入。

我们可以简单地理解为：

First Idle 是主线程处于静止状态并且浏览器完成了第一次有意义绘制的早期标志；TTI 发生在 FMP 之后，浏览器的主线程保持空闲至少 5 秒，没有任何可能阻止用户交互响应的“长任务”。

## 长任务

对于“长任务”，我们如图所示：

![长任务](https://mmbiz.qpic.cn/mmbiz_png/LDPLltmNy571LicbMsgAAnTTDyD9wv2lOn8zatjoO5EkbhzYL81c9Y9EbDWRqbJIwosNI8iaE72Bc9oiaqyLJUN4g/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

对于用户来说，长任务时间表现为卡顿或滞后，这也是当前糟糕的网络体验的主要根源。

## 如何测量长任务？

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // TODO...
    console.log(entry);
  }
});

observer.observe({entryTypes: ['longtask']});
```

控制台输出如下：

```json
{
  "name": "self",
  "entryType": "longtask",
  "startTime": 315009.59500001045,
  "duration": 99.9899999878835,
  "attribution": [
    {
      "name": "unknown",
      "entryType": "taskattribution",
      "startTime": 0,
      "duration": 0,
      "containerType": "window",
      "containerSrc": "",
      "containerId": "",
      "containerName": ""
    }
  ]
}
```

长任务 API 可以将任何超过 50 毫秒的任务标记为潜在问题，并向应用程序开发人员展示这些任务。选择 50 毫秒是为了确保应用程序满足 RAIL 性能准则，即在 100 毫秒内响应用户输入。

在实际开发中，我们可以使用一种 hack 方法来检查页面代码中的“长任务”：

```javascript
// 检测长任务 hack
(function detectLongFrame() {
    let lastFrameTime = Date.now();
    requestAnimationFrame(function() {
        let currentFrameTime = Date.now();
        if (currentFrameTime - lastFrameTime > 50) {
        // 在这里报告长帧...
        }
        detectLongFrame(currentFrameTime);
    });
}());
```

## 如何计算 TTI？

在计算之前，我们先看看 Timing API：

![Timing API](https://mmbiz.qpic.cn/mmbiz_png/LDPLltmNy571LicbMsgAAnTTDyD9wv2lOcQfVPvPZfQrpYj8LqZOkt6E8eLsXXe6uvyn6MwD8EOl18NTCZiaMuuw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

在官方的 Google 文档中，有如下描述：

> 注意：DOM 交互完成后的最小 FMP 值 DOM 交互完成是所有 DOMContentLoaded 监听器执行完毕的时间点。通常，页面的关键事件监听器很少在此时间点之前安装。我们实验的一些 firstInteractive 定义只查看长任务和网络活动（而不是查看安装了多少事件监听器），有时在加载的前 5-10 秒内没有长任务，我们会在 FMP 时触发 FirstInteractive，而此时网站通常还没有准备好处理用户输入。我们发现，如果我们将 max(DOMContentLoadedEnd, firstInteractive) 作为最终的 firstInteractive 值，返回的值在合理范围内。等待 DOMContentLoadedEnd 来声明 FirstInteractive 是合理的，因此所有下面介绍的定义都在 DOMContentLoadedEnd 时降低了 firstInteractive 的下限。

因此，我们可以大致估算使用 `domContentLoadedEventEnd`：

```javascript
TTI: domContentLoadedEventEnd - navigationStart,
```

**domContentLoadedEventEnd**: 文档 DOMContentLoaded 事件结束的时间。

`domContentLoadedEventEnd` 属性必须返回一个具有时间值的 `DOMHighResTimeStamp`，该值等于当前文档的 `DOMContentLoaded` 事件完成后的时间。

如果你觉得上述计算过于复杂，可以使用 `Google` 提供的 `Polyfill` 来获取。

## TTI 指标监控

我们可以使用 Google TTI Polyfill 监控 TTI。

```shell
npm install tti-polyfill
```

使用：

```javascript
import ttiPolyfill from './path/to/tti-polyfill.js';

ttiPolyfill.getFirstConsistentlyInteractive(opts).then((tti) => {
  // 使用 `tti` 值进行一些操作。
});
```

## 总结

通过研究 TTI，我们可以更好地理解如何提高网页的交互性能。RAIL 模型为评估用户体验提供了一个框架，而 TTI 则是衡量网页何时可以交互的重要指标。通过检测和优化长任务，我们可以显著改善用户体验，并确保网页在加载后尽快变得可交互。
