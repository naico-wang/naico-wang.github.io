---
title: React 状态更新详解(一)
date: 2024-10-29
category: React技术揭秘
---

# React 状态更新详解(一)

经过前几章的学习，我们终于有足够的前置知识理解状态更新的整个流程。

这一章我们看看几种常见的触发状态更新的方法是如何完成工作的。

## 几个关键节点

在开始学习前，我们先了解源码中几个关键节点（即几个关键函数的调用）。通过这章的学习，我们会将这些关键节点的调用路径串起来。

先从我们所熟知的概念开始。

### render阶段的开始

我们在render阶段流程概览一节讲到，

render阶段开始于performSyncWorkOnRoot或performConcurrentWorkOnRoot方法的调用。这取决于本次更新是同步更新还是异步更新。

### commit阶段的开始

我们在commit阶段流程概览一节讲到，

commit阶段开始于commitRoot方法的调用。其中rootFiber会作为传参。

我们已经知道，render阶段完成后会进入commit阶段。让我们继续补全从触发状态更新到render阶段的路径。

```javascript
触发状态更新（根据场景调用不同方法）

    |
    |
    v

    ？

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

### 创建Update对象

在React中，有如下方法可以触发状态更新（排除SSR相关）：

- ReactDOM.render 
- this.setState 
- this.forceUpdate 
- useState 
- useReducer

这些方法调用的场景各不相同，他们是如何接入同一套状态更新机制呢？

答案是：每次状态更新都会创建一个保存更新状态相关内容的对象，我们叫他Update。在render阶段的beginWork中会根据Update计算新的state。

我们会在下一节详细讲解Update。

### 从fiber到root

现在触发状态更新的fiber上已经包含Update对象。

我们知道，render阶段是从rootFiber开始向下遍历。那么如何从触发状态更新的fiber得到rootFiber呢？

答案是：调用markUpdateLaneFromFiberToRoot方法。

该方法做的工作可以概括为：从触发状态更新的fiber一直向上遍历到rootFiber，并返回rootFiber。

由于不同更新优先级不尽相同，所以过程中还会更新遍历到的fiber的优先级。这对于我们当前属于超纲内容。

### 调度更新

现在我们拥有一个rootFiber，该rootFiber对应的Fiber树中某个Fiber节点包含一个Update。

接下来通知Scheduler根据更新的优先级，决定以同步还是异步的方式调度本次更新。

这里调用的方法是ensureRootIsScheduled。

以下是ensureRootIsScheduled最核心的一段代码：

```javascript
if (newCallbackPriority === SyncLanePriority) {
  // 任务已经过期，需要同步执行render阶段
  newCallbackNode = scheduleSyncCallback(
    performSyncWorkOnRoot.bind(null, root)
  );
} else {
  // 根据任务优先级异步执行render阶段
  var schedulerPriorityLevel = lanePriorityToSchedulerPriority(
    newCallbackPriority
  );
  newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}
```

其中，scheduleCallback和scheduleSyncCallback会调用Scheduler提供的调度方法根据优先级调度回调函数执行。

可以看到，这里调度的回调函数为：

```javascript
performSyncWorkOnRoot.bind(null, root);
performConcurrentWorkOnRoot.bind(null, root);
```

即render阶段的入口函数。

至此，状态更新就和我们所熟知的render阶段连接上了。

## 总结

让我们梳理下状态更新的整个调用路径的关键节点：

```javascript
触发状态更新（根据场景调用不同方法）

    |
    |
    v

创建Update对象（接下来三节详解）

    |
    |
    v

从fiber到root（`markUpdateLaneFromFiberToRoot`）

    |
    |
    v

调度更新（`ensureRootIsScheduled`）

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

本节我们了解了状态更新的整个流程。

在接下来三节中，我们会花大量篇幅讲解Update的工作机制，因为他是构成React concurrent mode的核心机制之一。
