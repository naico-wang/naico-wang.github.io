---
title: React 新老版本的架构
date: 2024-10-29
category: React技术揭秘
---

# React 新老版本的架构对比

在上一节中我们了解了`React`的理念，简单概括就是**快速响应**。

React从 `v15` 升级到 `v16` 后重构了整个架构。本节我们聊聊 `v15`，看看他为什么不能满足快速响应的理念，以至于被重构。

## React 15 架构

React15 架构可以分为两层：

- **Reconciler（协调器）**—— 负责找出变化的组件
- **Renderer（渲染器）**—— 负责将变化的组件渲染到页面上

### Reconciler（协调器）

我们知道，在`React`中可以通过`this.setState`、`this.forceUpdate`、`ReactDOM.render`等 **API** 触发更新。

每当有更新发生时，**Reconciler**会做如下工作：

- 调用函数组件、或 class 组件的render方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知**Renderer**将变化的虚拟 DOM 渲染到页面上

> React官方对于Reconciler的解释：https://zh-hans.reactjs.org/docs/codebase-overview.html#reconcilers

### Renderer（渲染器）

由于React支持跨平台，所以不同平台有不同的Renderer。我们前端最熟悉的是负责在浏览器环境渲染的Renderer —— **ReactDOM**。

除此之外，还有：

- ReactNative渲染器，渲染 App 原生组件
- ReactTest渲染器，渲染出纯 Js 对象用于测试
- ReactArt渲染器，渲染到 Canvas, SVG 或 VML (IE8)
- 
在每次更新发生时，Renderer接到Reconciler通知，将变化的组件渲染在当前宿主环境。

> React官方对Renderer的解释：https://zh-hans.reactjs.org/docs/codebase-overview.html#renderers

## React15 架构的缺点

在Reconciler中，`mount`的组件会调用[mountComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L498)，`update`的组件会调用[updateComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L877)。这两个方法都会递归更新子组件。

## 递归更新的缺点

由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。

在上一节中，我们已经提出了解决办法——用可中断的异步更新代替同步的更新。那么 React15 的架构支持异步更新么？让我们看一个例子：

::: info 小例子
初始化时state.count = 1，每次点击按钮state.count++
列表中 3 个元素的值分别为 1，2，3 乘以state.count的结果
:::

![image1](https://react.iamkasong.com/img/v15.png)


我们可以看到，Reconciler和Renderer是交替工作的，当第一个li在页面上已经变化后，第二个li再进入Reconciler。

由于整个过程都是同步的，所以在用户看来所有 DOM 是同时更新的。

接下来，让我们模拟一下，如果中途中断更新会怎么样？

:::danger 注意
以下是我们模拟中断的情况，实际上React15并不会中断进行中的更新
:::

![image2](https://react.iamkasong.com/img/dist.png)

当第一个li完成更新时中断更新，即步骤 3 完成后中断更新，此时后面的步骤都还未执行。

用户本来期望123变为246。实际却看见更新不完全的 DOM！（即223）

基于这个原因，React决定重写整个架构。


## React16 架构

React16 架构可以分为三层：

- **Scheduler（调度器）**—— 调度任务的优先级，高优任务优先进入Reconciler
- **Reconciler（协调器）**—— 负责找出变化的组件
- **Renderer（渲染器）**—— 负责将变化的组件渲染到页面上

- 可以看到，相较于 React15，React16 中新增了**Scheduler（调度器）**，让我们来了解下他。

### Scheduler（调度器）

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

其实部分浏览器已经实现了这个 API，这就是[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。但是由于以下因素，React放弃使用：

- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换 tab 后，之前 `tab` 注册的`requestIdleCallback`触发的频率会变得很低

基于以上原因，React实现了功能更完备的requestIdleCallbackpolyfill，这就是**Scheduler**。除了在空闲时触发回调的功能外，**Scheduler**还提供了多种调度优先级供任务设置。

:::info 注意
[Scheduler](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/README.md) 是独立于React的库
:::

### Reconciler（协调器）
我们知道，在 React15 中Reconciler是递归处理虚拟 DOM 的。让我们看看[React16 的 Reconciler](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1673)。

我们可以看见，更新工作从递归变成了可以中断的循环过程。每次循环都会调用shouldYield判断当前是否有剩余时间。

```javascript
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

那么 React16 是如何解决中断更新时 DOM 渲染不完全的问题呢？

在 React16 中，**Reconciler**与**Renderer**不再是交替工作。当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟 DOM 打上代表增/删/更新的标记，类似这样：

```javascript
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

> 全部的标记请看这里：https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js

整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。

> React官方对 React16 新Reconciler的解释: https://zh-hans.reactjs.org/docs/codebase-overview.html#fiber-reconciler

### Renderer（渲染器）

Renderer根据Reconciler为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

所以，对于我们在上一节使用过的 Demo, 在 React16 架构中整个更新流程为：

![image3](https://react.iamkasong.com/img/process.png)

其中红框中的步骤随时可能由于以下原因被中断：

- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

- 由于红框中的工作都在内存中进行，不会更新页面上的 DOM，所以即使反复中断，用户也不会看见更新不完全的 DOM（即上一节演示的情况）。

> 实际上，由于Scheduler和Reconciler都是平台无关的，所以React为他们单独发了一个包[react-Reconciler](https://www.npmjs.com/package/react-reconciler)。你可以用这个包自己实现一个ReactDOM，具体见**参考资料**

## 总结

通过本节我们知道了

- React15与React16架构的区别。
- React16采用新的Reconciler。
- Reconciler内部采用了Fiber的架构。

那么，Fiber是什么？他和Reconciler或者说和React之间是什么关系？

请看下一篇。

## 参考资料
- [「英文 外网」Building a Custom React Renderer | React 前经理 Sophie Alpert](https://www.youtube.com/watch?v=CGpMlWVcHok&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=7)
- [hello-world-custom-react-renderer](https://agent-hunt.medium.com/hello-world-custom-react-renderer-9a95b7cd04bc)
