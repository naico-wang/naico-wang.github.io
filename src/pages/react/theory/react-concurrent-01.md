---
title: React Concurrent 模式(一)
date: 2024-10-29
category: React技术揭秘
---

# React Concurrent 模式(一)

在ReactDOM.render一节我们介绍了React当前的三种入口函数。日常开发主要使用的是Legacy Mode（通过ReactDOM.render创建）。

从[React v17.0 正式发布](https://mp.weixin.qq.com/s/zrrqldzRbcPApga_Cp2b8A)！一文可以看到，v17.0没有包含新特性。究其原因，v17.0主要的工作在于源码内部对Concurrent Mode的支持。所以v17版本也被称为“垫脚石”版本。

你可以从官网[Concurrent 模式介绍](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html)了解其基本概念。

一句话概括：

> Concurrent 模式是一组 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。

Concurrent Mode是React过去2年重构Fiber架构的源动力，也是React未来的发展方向。

可以预见，当v17完美支持Concurrent Mode后，v18会迎来一大波基于Concurrent Mode的库。

底层基础决定了上层API的实现，接下来让我们了解下，Concurrent Mode自底向上都包含哪些组成部分，能够发挥哪些能力？

## 底层架构 —— Fiber架构

从设计理念我们了解到要实现Concurrent Mode，最关键的一点是：实现异步可中断的更新。

基于这个前提，React花费2年时间重构完成了Fiber架构。

Fiber架构的意义在于，他将单个组件作为工作单元，使以组件为粒度的“异步可中断的更新”成为可能。

## 架构的驱动力 —— Scheduler

如果我们同步运行Fiber架构（通过ReactDOM.render），则Fiber架构与重构前并无区别。

但是当我们配合时间切片，就能根据宿主环境性能，为每个工作单元分配一个可运行时间，实现“异步可中断的更新”。

于是，scheduler（调度器）产生了。

## 架构运行策略 —— lane模型

到目前为止，React可以控制更新在Fiber架构中运行/中断/继续运行。

基于当前的架构，当一次更新在运行过程中被中断，过段时间再继续运行，这就是“异步可中断的更新”。

当一次更新在运行过程中被中断，转而重新开始一次新的更新，我们可以说：后一次更新打断了前一次更新。

这就是优先级的概念：后一次更新的优先级更高，他打断了正在进行的前一次更新。

多个优先级之间如何互相打断？优先级能否升降？本次更新应该赋予什么优先级？

这就需要一个模型控制不同优先级之间的关系与行为，于是lane模型诞生了。

## 上层实现

现在，我们可以说：

> 从源码层面讲，Concurrent Mode是一套可控的“多优先级更新架构”。

那么基于该架构之上可以实现哪些有意思的功能？我们举几个例子：

### batchedUpdates

如果我们在一次事件回调中触发多次更新，他们会被合并为一次更新进行处理。

如下代码执行只会触发一次更新：

```javascript
onClick() {
  this.setState({stateA: 1});
  this.setState({stateB: false});
  this.setState({stateA: 2});
}
```

这种合并多个更新的优化方式被称为batchedUpdates。

batchedUpdates在很早的版本就存在了，不过之前的实现局限很多（脱离当前上下文环境的更新不会被合并）。

在Concurrent Mode中，是以优先级为依据对更新进行合并的，使用范围更广。

### Suspense

[Suspense](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html)可以在组件请求数据时展示一个pending状态。请求成功后渲染数据。

本质上讲Suspense内的组件子树比组件树的其他部分拥有更低的优先级。

## useDeferredValue

[useDeferredValue](https://zh-hans.reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue)返回一个延迟响应的值，该值可能“延后”的最长时间为timeoutMs。

例子：

```javascript
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

在useDeferredValue内部会调用useState并触发一次更新。

这次更新的优先级很低，所以当前如果有正在进行中的更新，不会受useDeferredValue产生的更新影响。所以useDeferredValue能够返回延迟的值。

当超过timeoutMs后useDeferredValue产生的更新还没进行（由于优先级太低一直被打断），则会再触发一次高优先级更新。

## 总结

除了以上介绍的实现，相信未来React还会开发更多基于Concurrent Mode的玩法。

Fiber架构在之前的章节已经学习了。所以，在本章接下来的部分，我们会按照上文的脉络，自底向上，从架构到实现讲解Concurrent Mode。
