---
title: React Before Mutation详解
date: 2024-10-29
category: React技术揭秘
---

# React Before Mutation 详解

在本节正式开始前，让我们复习下这一章到目前为止所学的。

Renderer工作的阶段被称为commit阶段。commit阶段可以分为三个子阶段：

- before mutation阶段（执行DOM操作前）

- mutation阶段（执行DOM操作）

- layout阶段（执行DOM操作后）

本节我们看看before mutation阶段（执行DOM操作前）都做了什么。

## 概览

before mutation阶段的代码很短，整个过程就是遍历effectList并调用commitBeforeMutationEffects函数处理。

> 这部分源码[在这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2104-L2127)。为了增加可读性，示例代码中删除了不相关的逻辑

```javascript
// 保存之前的优先级，以同步优先级执行，执行完毕后恢复之前优先级
const previousLanePriority = getCurrentUpdateLanePriority();
setCurrentUpdateLanePriority(SyncLanePriority);

// 将当前上下文标记为CommitContext，作为commit阶段的标志
const prevExecutionContext = executionContext;
executionContext |= CommitContext;

// 处理focus状态
focusedInstanceHandle = prepareForCommit(root.containerInfo);
shouldFireAfterActiveInstanceBlur = false;

// beforeMutation阶段的主函数
commitBeforeMutationEffects(finishedWork);

focusedInstanceHandle = null;
```

我们重点关注beforeMutation阶段的主函数commitBeforeMutationEffects做了什么。

## commitBeforeMutationEffects

大体代码逻辑：

```javascript
function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      // ...focus blur相关
    }

    const effectTag = nextEffect.effectTag;

    // 调用getSnapshotBeforeUpdate
    if ((effectTag & Snapshot) !== NoEffect) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }

    // 调度useEffect
    if ((effectTag & Passive) !== NoEffect) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalSchedulerPriority, () => {
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

整体可以分为三部分：

1. 处理DOM节点渲染/删除后的 autoFocus、blur 逻辑。 
2. 调用getSnapshotBeforeUpdate生命周期钩子。 
3. 调度useEffect。

我们讲解下2、3两点。

## 调用getSnapshotBeforeUpdate

commitBeforeMutationEffectOnFiber是commitBeforeMutationLifeCycles的别名。

在该方法内会调用getSnapshotBeforeUpdate。

从Reactv16开始，componentWillXXX钩子前增加了UNSAFE_前缀。

究其原因，是因为Stack Reconciler重构为Fiber Reconciler后，render阶段的任务可能中断/重新开始，对应的组件在render阶段的生命周期钩子（即componentWillXXX）可能触发多次。

这种行为和Reactv15不一致，所以标记为UNSAFE_。

为此，React提供了替代的生命周期钩子getSnapshotBeforeUpdate。

我们可以看见，getSnapshotBeforeUpdate是在commit阶段内的before mutation阶段调用的，由于commit阶段是同步的，所以不会遇到多次调用的问题。

## 调度useEffect

在这几行代码内，scheduleCallback方法由Scheduler模块提供，用于以某个优先级异步调度一个回调函数。

```javascript
// 调度useEffect
if ((effectTag & Passive) !== NoEffect) {
  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    scheduleCallback(NormalSchedulerPriority, () => {
      // 触发useEffect
      flushPassiveEffects();
      return null;
    });
  }
}
```

在此处，被异步调度的回调函数就是触发useEffect的方法flushPassiveEffects。

我们接下来讨论useEffect如何被异步调度，以及为什么要异步（而不是同步）调度。

## 如何异步调度

在flushPassiveEffects方法内部会从全局变量rootWithPendingPassiveEffects获取effectList。

关于flushPassiveEffects的具体讲解参照useEffect与useLayoutEffect一节

在completeWork一节我们讲到，effectList中保存了需要执行副作用的Fiber节点。其中副作用包括

- 插入DOM节点（Placement）
- 更新DOM节点（Update）
- 删除DOM节点（Deletion）

除此外，当一个FunctionComponent含有useEffect或useLayoutEffect，他对应的Fiber节点也会被赋值effectTag。

在flushPassiveEffects方法内部会遍历rootWithPendingPassiveEffects（即effectList）执行effect回调函数。

如果在此时直接执行，rootWithPendingPassiveEffects === null。

那么rootWithPendingPassiveEffects会在何时赋值呢？

在上一节layout之后的代码片段中会根据rootDoesHavePassiveEffects === true?决定是否赋值rootWithPendingPassiveEffects。

```javascript
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
}
```

所以整个useEffect异步调用分为三步：

1. before mutation阶段在scheduleCallback中调度flushPassiveEffects
2. layout阶段之后将effectList赋值给rootWithPendingPassiveEffects
3. scheduleCallback触发flushPassiveEffects，flushPassiveEffects内部遍历rootWithPendingPassiveEffects

## 为什么需要异步调用

摘录自React文档effect 的执行时机：

> 与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

可见，useEffect异步执行的原因主要是防止同步执行时阻塞浏览器渲染。

## 总结

经过本节学习，我们知道了在before mutation阶段，会遍历effectList，依次执行：

1. 处理DOM节点渲染/删除后的 autoFocus、blur逻辑
2. 调用getSnapshotBeforeUpdate生命周期钩子
3. 调度useEffect
