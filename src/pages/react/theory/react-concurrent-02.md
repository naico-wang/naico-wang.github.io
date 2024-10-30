---
title: React Concurrent 模式(二)
date: 2024-10-29
category: React技术揭秘
---

# Scheduler的原理与实现

在新的React架构一节我们介绍了Scheduler，他包含两个功能：

- 时间切片 
- 优先级调度

本节我们学习这个两个功能是如何在Scheduler中实现的。

## 时间切片原理

时间切片的本质是模拟实现[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。

除去“浏览器重排/重绘”，下图是浏览器一帧中可以用于执行JS的时机。

```javascript
一个task(宏任务) -- 队列中全部job(微任务) -- requestAnimationFrame -- 浏览器重排/重绘 -- requestIdleCallback
```

requestIdleCallback是在“浏览器重排/重绘”后如果当前帧还有空余时间时被调用的。

浏览器并没有提供其他API能够在同样的时机（浏览器重排/重绘后）调用以模拟其实现。

唯一能精准控制调用时机的API是requestAnimationFrame，他能让我们在“浏览器重排/重绘”之前执行JS。

这也是为什么我们通常用这个API实现JS动画 —— 这是浏览器渲染前的最后时机，所以动画能快速被渲染。

所以，退而求其次，Scheduler的时间切片功能是通过task（宏任务）实现的。

最常见的task当属setTimeout了。但是有个task比setTimeout执行时机更靠前，那就是MessageChannel。

所以Scheduler将需要被执行的回调函数作为MessageChannel的回调执行。如果当前宿主环境不支持MessageChannel，则使用setTimeout。

在React的render阶段，开启Concurrent Mode时，每次遍历前，都会通过Scheduler提供的shouldYield方法判断是否需要中断遍历，使浏览器有时间渲染：

```javascript
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

是否中断的依据，最重要的一点便是每个任务的剩余时间是否用完。

在Schdeduler中，为任务分配的初始剩余时间为5ms。

随着应用运行，会通过fps动态调整分配给任务的可执行时间。

这也解释了为什么设计理念一节启用Concurrent Mode后每个任务的执行时间大体都是多于5ms的一小段时间 —— 每个时间切片被设定为5ms，任务本身再执行一小段时间，所以整体时间是多于5ms的时间

![image](https://react.iamkasong.com/img/time-slice.png)

那么当shouldYield为true，以至于performUnitOfWork被中断后是如何重新启动的呢？我们会在介绍完"优先级调度"后解答。

## 优先级调度

首先我们来了解优先级的来源。需要明确的一点是，Scheduler是独立于React的包，所以他的优先级也是独立于React的优先级的。

Scheduler对外暴露了一个方法[unstable_runWithPriority](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/Scheduler.js#L217-L237)。

这个方法接受一个优先级与一个回调函数，在回调函数内部调用获取优先级的方法都会取得第一个参数对应的优先级：

```javascript
function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}
```

可以看到，Scheduler内部存在5种优先级。

在React内部凡是涉及到优先级调度的地方，都会使用unstable_runWithPriority。

比如，我们知道commit阶段是同步执行的。可以看到，commit阶段的起点commitRoot方法的优先级为ImmediateSchedulerPriority。

ImmediateSchedulerPriority即ImmediatePriority的别名，为最高优先级，会立即执行。

```javascript
function commitRoot(root) {
  const renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority(
    ImmediateSchedulerPriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

## 优先级的意义

Scheduler对外暴露最重要的方法便是[unstable_scheduleCallback](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/Scheduler.js#L279-L359)。该方法用于以某个优先级注册回调函数。

比如在React中，之前讲过在commit阶段的beforeMutation阶段会调度useEffect的回调：

```javascript
if (!rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = true;
  scheduleCallback(NormalSchedulerPriority, () => {
    flushPassiveEffects();
    return null;
  });
}
```

这里的回调便是通过scheduleCallback调度的，优先级为NormalSchedulerPriority，即NormalPriority。

不同优先级意味着什么？不同优先级意味着不同时长的任务过期时间：

```javascript
var timeout;
switch (priorityLevel) {
  case ImmediatePriority:
    timeout = IMMEDIATE_PRIORITY_TIMEOUT;
    break;
  case UserBlockingPriority:
    timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
    break;
  case IdlePriority:
    timeout = IDLE_PRIORITY_TIMEOUT;
    break;
  case LowPriority:
    timeout = LOW_PRIORITY_TIMEOUT;
    break;
  case NormalPriority:
  default:
    timeout = NORMAL_PRIORITY_TIMEOUT;
    break;
}

var expirationTime = startTime + timeout;
```

其中：

```javascript
// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;
```

可以看到，如果一个任务的优先级是ImmediatePriority，对应IMMEDIATE_PRIORITY_TIMEOUT为-1，那么

```javascript
var expirationTime = startTime - 1;
```

则该任务的过期时间比当前时间还短，表示他已经过期了，需要立即被执行。

## 不同优先级任务的排序

我们已经知道优先级意味着任务的过期时间。设想一个大型React项目，在某一刻，存在很多不同优先级的任务，对应不同的过期时间。

同时，又因为任务可以被延迟，所以我们可以将这些任务按是否被延迟分为：

- 已就绪任务 
- 未就绪任务

```javascript
if (typeof options === 'object' && options !== null) {
  var delay = options.delay;
  if (typeof delay === 'number' && delay > 0) {
    // 任务被延迟
    startTime = currentTime + delay;
  } else {
    startTime = currentTime;
  }
} else {
  startTime = currentTime;
}
```

所以，Scheduler存在两个队列：

- timerQueue：保存未就绪任务 
- taskQueue：保存已就绪任务

每当有新的未就绪的任务被注册，我们将其插入timerQueue并根据开始时间重新排列timerQueue中任务的顺序。

当timerQueue中有任务就绪，即startTime <= currentTime，我们将其取出并加入taskQueue。

取出taskQueue中最早过期的任务并执行他。

为了能在O(1)复杂度找到两个队列中时间最早的那个任务，Scheduler使用小顶堆实现了优先级队列。

至此，我们了解了Scheduler的实现。现在可以回答介绍时间切片时提到的问题：

在“取出taskQueue中最早过期的任务并执行他”这一步中有如下关键步骤：

```javascript
const continuationCallback = callback(didUserCallbackTimeout);
currentTime = getCurrentTime();
if (typeof continuationCallback === 'function') {
  // continuationCallback是函数
  currentTask.callback = continuationCallback;
  markTaskYield(currentTask, currentTime);
} else {
  if (enableProfiling) {
    markTaskCompleted(currentTask, currentTime);
    currentTask.isQueued = false;
  }
  if (currentTask === peek(taskQueue)) {
    // 将当前任务清除
    pop(taskQueue);
  }
}
advanceTimers(currentTime);
```

当注册的回调函数执行后的返回值continuationCallback为function，会将continuationCallback作为当前任务的回调函数。

如果返回值不是function，则将当前被执行的任务清除出taskQueue。

render阶段被调度的函数为performConcurrentWorkOnRoot，在该函数末尾有这样一段代码：

```javascript
if (root.callbackNode === originalCallbackNode) {
  // The task node scheduled for this root is the same one that's
  // currently executed. Need to return a continuation.
  return performConcurrentWorkOnRoot.bind(null, root);
}
```

可以看到，在满足一定条件时，该函数会将自己作为返回值。

## 总结

刚才我们讲到，Scheduler与React是两套优先级机制。那么React中的优先级是如何运转的？我们会在下一节介绍。
