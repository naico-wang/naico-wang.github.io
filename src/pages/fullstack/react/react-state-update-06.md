---
title: React 状态更新详解(六)
date: 2024-10-29
category: React技术揭秘
---

# React 状态更新详解(六) - SetState

当我们有了前面知识的铺垫，就很容易理解this.setState的工作流程。

## 流程概览

可以看到，this.setState内会调用this.updater.enqueueSetState方法。

```javascript
Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
    }
  }
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

在enqueueSetState方法中就是我们熟悉的从创建update到调度update的流程了。

```javascript
enqueueSetState(inst, payload, callback) {
  // 通过组件实例获取对应fiber
  const fiber = getInstance(inst);

  const eventTime = requestEventTime();
  const suspenseConfig = requestCurrentSuspenseConfig();

  // 获取优先级
  const lane = requestUpdateLane(fiber, suspenseConfig);

  // 创建update
  const update = createUpdate(eventTime, lane, suspenseConfig);

  update.payload = payload;

  // 赋值回调函数
  if (callback !== undefined && callback !== null) {
    update.callback = callback;
  }

  // 将update插入updateQueue
  enqueueUpdate(fiber, update);
  // 调度update
  scheduleUpdateOnFiber(fiber, lane, eventTime);
}
```

这里值得注意的是对于ClassComponent，update.payload为this.setState的第一个传参（即要改变的state）。

## this.forceUpdate

在this.updater上，除了enqueueSetState外，还存在enqueueForceUpdate，当我们调用this.forceUpdate时会调用他。

可以看到，除了赋值update.tag = ForceUpdate;以及没有payload外，其他逻辑与this.setState一致。

```javascript
enqueueForceUpdate(inst, callback) {
    const fiber = getInstance(inst);
    const eventTime = requestEventTime();
    const suspenseConfig = requestCurrentSuspenseConfig();
    const lane = requestUpdateLane(fiber, suspenseConfig);

    const update = createUpdate(eventTime, lane, suspenseConfig);

    // 赋值tag为ForceUpdate
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  },
};
```

那么赋值update.tag = ForceUpdate;有何作用呢？

在判断ClassComponent是否需要更新时有两个条件需要满足：

```javascript
const shouldUpdate =
  checkHasForceUpdateAfterProcessing() ||
  checkShouldComponentUpdate(
    workInProgress,
    ctor,
    oldProps,
    newProps,
    oldState,
    newState,
    nextContext,
  );
```

- checkHasForceUpdateAfterProcessing：内部会判断本次更新的Update是否为ForceUpdate。即如果本次更新的Update中存在tag为ForceUpdate，则返回true。

- checkShouldComponentUpdate：内部会调用shouldComponentUpdate方法。以及当该ClassComponent为PureComponent时会浅比较state与props。

所以，当某次更新含有tag为ForceUpdate的Update，那么当前ClassComponent不会受其他性能优化手段（shouldComponentUpdate|PureComponent）影响，一定会更新。

## 总结

至此，我们学习完了HostRoot | ClassComponent所使用的Update的更新流程。

在下一章我们会学习另一种数据结构的Update —— 用于Hooks的Update。
