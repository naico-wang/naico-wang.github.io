---
title: React Hooks 详解(二)
date: 2024-10-29
category: React技术揭秘
---

# React Hooks 详解(二) - 实现一个Hooks

为了更好理解Hooks原理，这一节我们遵循React的运行流程，实现一个不到 100 行代码的极简useState Hook。建议对照着代码来看本节内容。

## 工作原理

对于useState Hook，考虑如下例子：

```javascript
function App() {
  const [num, updateNum] = useState(0);

  return <p onClick={() => updateNum((num) => num + 1)}>{num}</p>;
}
```

可以将工作分为两部分：

1. 通过一些途径产生更新，更新会造成组件render。 
2. 组件render时useState返回的num为更新后的结果。

其中步骤1的更新可以分为mount和update：

1. 调用ReactDOM.render会产生mount的更新，更新内容为useState的initialValue（即0）。 
2. 点击p标签触发updateNum会产生一次update的更新，更新内容为num => num + 1。

接下来讲解这两个步骤如何实现。

## 更新是什么

> 通过一些途径产生更新，更新会造成组件render。

首先我们要明确更新是什么。

在我们的极简例子中，更新就是如下数据结构：

```javascript
const update = {
  // 更新执行的函数
  action,
  // 与同一个Hook的其他更新形成链表
  next: null,
};
```

对于App来说，点击p标签产生的update的action为num => num + 1。

如果我们改写下App的onClick：

```javascript
// 之前
return <p onClick={() => updateNum((num) => num + 1)}>{num}</p>;

// 之后
return (
  <p
    onClick={() => {
      updateNum((num) => num + 1);
      updateNum((num) => num + 1);
      updateNum((num) => num + 1);
    }}
  >
    {num}
  </p>
);
```

那么点击p标签会产生三个update。

## update 数据结构

这些update是如何组合在一起呢？

答案是：他们会形成环状单向链表。

调用updateNum实际调用的是dispatchAction.bind(null, hook.queue)，我们先来了解下这个函数：

```javascript
function dispatchAction(queue, action) {
  // 创建update
  const update = {
    action,
    next: null,
  };

  // 环状单向链表操作
  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  // 模拟React开始调度更新
  schedule();
}
```

环状链表操作不太容易理解，这里我们详细讲解下。

当产生第一个update（我们叫他u0），此时queue.pending === null。

update.next = update;即u0.next = u0，他会和自己首尾相连形成单向环状链表。

然后queue.pending = update;即queue.pending = u0

```javascript
queue.pending = u0 ---> u0
                ^       |
                |       |
                ---------
```

当产生第二个update（我们叫他u1），update.next = queue.pending.next;，此时queue.pending.next === u0， 即u1.next = u0。

queue.pending.next = update;，即u0.next = u1。

然后queue.pending = update;即queue.pending = u1

```javascript
queue.pending = u1 ---> u0
                ^       |
                |       |
                ---------
```

你可以照着这个例子模拟插入多个update的情况，会发现queue.pending始终指向最后一个插入的update。

这样做的好处是，当我们要遍历update时，queue.pending.next指向第一个插入的update。

## 状态如何保存

现在我们知道，更新产生的update对象会保存在queue中。

不同于ClassComponent的实例可以存储数据，对于FunctionComponent，queue存储在哪里呢？

答案是：FunctionComponent对应的fiber中。

我们使用如下精简的fiber结构：

```javascript
// App组件对应的fiber对象
const fiber = {
  // 保存该FunctionComponent对应的Hooks链表
  memoizedState: null,
  // 指向App函数
  stateNode: App,
};
```

## Hook 数据结构

接下来我们关注fiber.memoizedState中保存的Hook的数据结构。

可以看到，Hook与update类似，都通过链表连接。不过Hook是无环的单向链表。

```javascript
hook = {
  // 保存update的queue，即上文介绍的queue
  queue: {
    pending: null,
  },
  // 保存hook对应的state
  memoizedState: initialState,
  // 与下一个Hook连接形成单向无环链表
  next: null,
};
```

:::info 注意
注意区分update与hook的所属关系：

每个useState对应一个hook对象。

调用const [num, updateNum] = useState(0);时updateNum（即上文介绍的dispatchAction）产生的update保存在useState对应的hook.queue中。
:::

## 模拟 React 调度更新流程

在上文dispatchAction末尾我们通过schedule方法模拟React调度更新流程。

```javascript
function dispatchAction(queue, action) {
  // ...创建update

  // ...环状单向链表操作

  // 模拟React开始调度更新
  schedule();
}
```

现在我们来实现他。

我们用isMount变量指代是mount还是update。

```javascript
// 首次render时是mount
isMount = true;

function schedule() {
  // 更新前将workInProgressHook重置为fiber保存的第一个Hook
  workInProgressHook = fiber.memoizedState;
  // 触发组件render
  fiber.stateNode();
  // 组件首次render为mount，以后再触发的更新为update
  isMount = false;
}
```

通过workInProgressHook变量指向当前正在工作的hook。

```javascript
workInProgressHook = fiber.memoizedState;
```

在组件render时，每当遇到下一个useState，我们移动workInProgressHook的指针。

```javascript
workInProgressHook = workInProgressHook.next;
```

这样，只要每次组件render时useState的调用顺序及数量保持一致，那么始终可以通过workInProgressHook找到当前useState对应的hook对象。

到此为止，我们已经完成第一步。

> 1. 通过一些途径产生更新，更新会造成组件render。

接下来实现第二步。

> 2. 组件render时useState返回的num为更新后的结果。

## 计算 state

组件render时会调用useState，他的大体逻辑如下：

```javascript
function useState(initialState) {
  // 当前useState使用的hook会被赋值该该变量
  let hook;

  if (isMount) {
    // ...mount时需要生成hook对象
  } else {
    // ...update时从workInProgressHook中取出该useState对应的hook
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    // ...根据queue.pending中保存的update更新state
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}
```

我们首先关注如何获取hook对象：

```javascript
if (isMount) {
  // mount时为该useState生成hook
  hook = {
    queue: {
      pending: null,
    },
    memoizedState: initialState,
    next: null,
  };

  // 将hook插入fiber.memoizedState链表末尾
  if (!fiber.memoizedState) {
    fiber.memoizedState = hook;
  } else {
    workInProgressHook.next = hook;
  }
  // 移动workInProgressHook指针
  workInProgressHook = hook;
} else {
  // update时找到对应hook
  hook = workInProgressHook;
  // 移动workInProgressHook指针
  workInProgressHook = workInProgressHook.next;
}
```

当找到该useState对应的hook后，如果该hook.queue.pending不为空（即存在update），则更新其state。

```javascript
// update执行前的初始state
let baseState = hook.memoizedState;

if (hook.queue.pending) {
  // 获取update环状单向链表中第一个update
  let firstUpdate = hook.queue.pending.next;

  do {
    // 执行update action
    const action = firstUpdate.action;
    baseState = action(baseState);
    firstUpdate = firstUpdate.next;

    // 最后一个update执行完后跳出循环
  } while (firstUpdate !== hook.queue.pending.next);

  // 清空queue.pending
  hook.queue.pending = null;
}

// 将update action执行完后的state作为memoizedState
hook.memoizedState = baseState;
```

完整代码如下：

```javascript
function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      queue: {
        pending: null,
      },
      memoizedState: initialState,
      next: null,
    };
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next);

    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}
```

## 对触发事件进行抽象

最后，让我们抽象一下React的事件触发方式。

通过调用App返回的click方法模拟组件click的行为。

```javascript
function App() {
  const [num, updateNum] = useState(0);

  console.log(`${isMount ? "mount" : "update"} num: `, num);

  return {
    click() {
      updateNum((num) => num + 1);
    },
  };
}
```

## 与 React 的区别

我们用尽可能少的代码模拟了Hooks的运行，但是相比React Hooks，他还有很多不足。以下是他与React Hooks的区别：

1. React Hooks没有使用isMount变量，而是在不同时机使用不同的dispatcher。换言之，mount时的useState与update时的useState不是同一个函数。 
2. React Hooks有中途跳过更新的优化手段。 
3. React Hooks有batchedUpdates，当在click中触发三次updateNum，精简React会触发三次更新，而React只会触发一次。 
4. React Hooks的update有优先级概念，可以跳过不高优先的update。

更多的细节，我们会在本章后续小节讲解。
