---
title: React 状态更新详解(三)
date: 2024-10-29
category: React技术揭秘
---

# React 状态更新详解(三) - Update

通过本章第一节学习，我们知道状态更新流程开始后首先会创建Update对象。

本节我们学习Update的结构与工作流程。

> 你可以将Update类比心智模型中的一次commit。

## Update的分类

我们先来了解Update的结构。

首先，我们将可以触发更新的方法所隶属的组件分类：

- ReactDOM.render —— HostRoot 
- this.setState —— ClassComponent 
- this.forceUpdate —— ClassComponent 
- useState —— FunctionComponent 
- useReducer —— FunctionComponent

可以看到，一共三种组件（HostRoot | ClassComponent | FunctionComponent）可以触发更新。

由于不同类型组件工作方式不同，所以存在两种不同结构的Update，其中ClassComponent与HostRoot共用一套Update结构，FunctionComponent单独使用一种Update结构。

虽然他们的结构不同，但是他们工作机制与工作流程大体相同。在本节我们介绍前一种Update，FunctionComponent对应的Update在Hooks章节介绍。

## Update的结构

ClassComponent与HostRoot（即rootFiber.tag对应类型）共用同一种Update结构。

对应的结构如下：

```javascript
const update: Update<*> = {
  eventTime,
  lane,
  suspenseConfig,
  tag: UpdateState,
  payload: null,
  callback: null,

  next: null,
};
```

字段意义如下：

- eventTime：任务时间，通过performance.now()获取的毫秒数。由于该字段在未来会重构，当前我们不需要理解他。

- lane：优先级相关字段。当前还不需要掌握他，只需要知道不同Update优先级可能是不同的。

- 你可以将lane类比心智模型中需求的紧急程度。

- suspenseConfig：Suspense相关，暂不关注。

- tag：更新的类型，包括UpdateState | ReplaceState | ForceUpdate | CaptureUpdate。

- payload：更新挂载的数据，不同类型组件挂载的数据不同。对于ClassComponent，payload为this.setState的第一个传参。对于HostRoot，payload为ReactDOM.render的第一个传参。

- callback：更新的回调函数。即在commit 阶段的 layout 子阶段一节中提到的回调函数。

- next：与其他Update连接形成链表。

## Update与Fiber的联系

我们发现，Update存在一个连接其他Update形成链表的字段next。联系React中另一种以链表形式组成的结构Fiber，他们之间有什么关联么？

答案是肯定的。

从双缓存机制一节我们知道，Fiber节点组成Fiber树，页面中最多同时存在两棵Fiber树：

- 代表当前页面状态的current Fiber树 
- 代表正在render阶段的workInProgress Fiber树

类似Fiber节点组成Fiber树，Fiber节点上的多个Update会组成链表并被包含在fiber.updateQueue中。

:::info 什么情况下一个Fiber节点会存在多个Update？
你可能疑惑为什么一个Fiber节点会存在多个Update。这其实是很常见的情况。

在这里介绍一种最简单的情况：

```javascript
onClick() {
  this.setState({
    a: 1
  })

  this.setState({
    b: 2
  })
}
```

在一个ClassComponent中触发this.onClick方法，方法内部调用了两次this.setState。这会在该fiber中产生两个Update。
:::

Fiber节点最多同时存在两个updateQueue：

- current fiber保存的updateQueue即current updateQueue 
- workInProgress fiber保存的updateQueue即workInProgress updateQueue

在commit阶段完成页面渲染后，workInProgress Fiber树变为current Fiber树，workInProgress Fiber树内Fiber节点的updateQueue就变成current updateQueue。

## updateQueue

updateQueue有三种类型，其中针对HostComponent的类型我们在completeWork一节介绍过。

剩下两种类型和Update的两种类型对应。

ClassComponent与HostRoot使用的UpdateQueue结构如下：

```javascript
const queue: UpdateQueue<State> = {
  baseState: fiber.memoizedState,
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  shared: {
    pending: null,
  },
  effects: null,
};
```

字段说明如下：

- baseState：本次更新前该Fiber节点的state，Update基于该state计算更新后的state。

> 你可以将baseState类比心智模型中的master分支。

- firstBaseUpdate与lastBaseUpdate：本次更新前该Fiber节点已保存的Update。以链表形式存在，链表头为firstBaseUpdate，链表尾为lastBaseUpdate。之所以在更新产生前该Fiber节点内就存在Update，是由于某些Update优先级较低所以在上次render阶段由Update计算state时被跳过。

> 你可以将baseUpdate类比心智模型中执行git rebase基于的commit（节点D）。

- shared.pending：触发更新时，产生的Update会保存在shared.pending中形成单向环状链表。当由Update计算state时这个环会被剪开并连接在lastBaseUpdate后面。

> 你可以将shared.pending类比心智模型中本次需要提交的commit（节点ABC）。

- effects：数组。保存update.callback !== null的Update。

## 例子

updateQueue相关代码逻辑涉及到大量链表操作，比较难懂。在此我们举例对updateQueue的工作流程讲解下。

假设有一个fiber刚经历commit阶段完成渲染。

该fiber上有两个由于优先级过低所以在上次的render阶段并没有处理的Update。他们会成为下次更新的baseUpdate。

我们称其为u1和u2，其中u1.next === u2。

```javascript
fiber.updateQueue.firstBaseUpdate === u1;
fiber.updateQueue.lastBaseUpdate === u2;
u1.next === u2;
```

我们用-->表示链表的指向：

```javascript
fiber.updateQueue.baseUpdate: u1 --> u2
```

现在我们在fiber上触发两次状态更新，这会先后产生两个新的Update，我们称为u3和u4。

每个 update 都会通过 enqueueUpdate 方法插入到 updateQueue 队列上

当插入u3后：

```javascript
fiber.updateQueue.shared.pending === u3;
u3.next === u3;
```

shared.pending的环状链表，用图表示为：

```javascript
fiber.updateQueue.shared.pending:   u3 ─────┐ 
                                     ^      |                                    
                                     └──────┘
```

接着插入u4之后：

```javascript
fiber.updateQueue.shared.pending === u4;
u4.next === u3;
u3.next === u4;
```

shared.pending是环状链表，用图表示为：

```javascript
fiber.updateQueue.shared.pending:   u4 ──> u3
                                     ^      |                                    
                                     └──────┘
```

shared.pending 会保证始终指向最后一个插入的update，你可以在这里看到enqueueUpdate的源码

更新调度完成后进入render阶段。

此时shared.pending的环被剪开并连接在updateQueue.lastBaseUpdate后面：

```javascript
fiber.updateQueue.baseUpdate: u1 --> u2 --> u3 --> u4
```

接下来遍历updateQueue.baseUpdate链表，以fiber.updateQueue.baseState为初始state，依次与遍历到的每个Update计算并产生新的state（该操作类比Array.prototype.reduce）。

在遍历时如果有优先级低的Update会被跳过。

当遍历完成后获得的state，就是该Fiber节点在本次更新的state（源码中叫做memoizedState）。

> render阶段的Update操作由processUpdateQueue完成，你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.new.js#L405)看到processUpdateQueue的源码

state的变化在render阶段产生与上次更新不同的JSX对象，通过Diff算法产生effectTag，在commit阶段渲染在页面上。

渲染完成后workInProgress Fiber树变为current Fiber树，整个更新流程结束。
