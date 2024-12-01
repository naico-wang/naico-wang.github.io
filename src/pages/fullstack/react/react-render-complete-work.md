---
title: React completeWork 详解
date: 2024-10-29
category: React技术揭秘
---

# React completeWork 详解

在流程概览一节我们了解组件在render阶段会经历beginWork与completeWork。

上一节我们讲解了组件执行beginWork后会创建子Fiber节点，节点上可能存在effectTag。

这一节让我们看看completeWork会做什么工作。

你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L673)看到completeWork方法定义。

## 流程概览

类似beginWork，completeWork也是针对不同fiber.tag调用不同的处理逻辑。

```javascript
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: {
      // ...省略
      return null;
    }
    case HostRoot: {
      // ...省略
      updateHostContainer(workInProgress);
      return null;
    }
    case HostComponent: {
      // ...省略
      return null;
    }
  // ...省略
```

我们重点关注页面渲染所必须的HostComponent（即原生DOM组件对应的Fiber节点），其他类型Fiber的处理留在具体功能实现时讲解。

## 处理 HostComponent

和beginWork一样，我们根据current === null ?判断是mount还是update。

同时针对HostComponent，判断update时我们还需要考虑workInProgress.stateNode != null ?（即该Fiber节点是否存在对应的DOM节点）

```javascript
case HostComponent: {
  popHostContext(workInProgress);
  const rootContainerInstance = getRootHostContainer();
  const type = workInProgress.type;

  if (current !== null && workInProgress.stateNode != null) {
    // update的情况
    // ...省略
  } else {
    // mount的情况
    // ...省略
  }
  return null;
}
```

## update 时

当update时，Fiber节点已经存在对应DOM节点，所以不需要生成DOM节点。需要做的主要是处理props，比如：

- onClick、onChange等回调函数的注册
- 处理style prop
- 处理DANGEROUSLY_SET_INNER_HTML prop
- 处理children prop

我们去掉一些当前不需要关注的功能（比如ref）。可以看到最主要的逻辑是调用updateHostComponent方法。

```javascript
if (current !== null && workInProgress.stateNode != null) {
  // update的情况
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance
  );
}
```

你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L225)看到updateHostComponent方法定义。

在updateHostComponent内部，被处理完的props会被赋值给workInProgress.updateQueue，并最终会在commit阶段被渲染在页面上。

```javascript
workInProgress.updateQueue = (updatePayload: any);
```

其中updatePayload为数组形式，他的偶数索引的值为变化的prop key，奇数索引的值为变化的prop value。

> 具体渲染过程见**mutation 阶段一节**

## mount 时

同样，我们省略了不相关的逻辑。可以看到，mount时的主要逻辑包括三个：

- 为Fiber节点生成对应的DOM节点
- 将子孙DOM节点插入刚生成的DOM节点中
- 与update逻辑中的updateHostComponent类似的处理props的过程 

```javascript
// mount的情况

// ...省略服务端渲染相关逻辑

const currentHostContext = getHostContext();
// 为fiber创建对应DOM节点
const instance = createInstance(
  type,
  newProps,
  rootContainerInstance,
  currentHostContext,
  workInProgress
);
// 将子孙DOM节点插入刚生成的DOM节点中
appendAllChildren(instance, workInProgress, false, false);
// DOM节点赋值给fiber.stateNode
workInProgress.stateNode = instance;

// 与update逻辑中的updateHostComponent类似的处理props的过程
if (
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext
  )
) {
  markUpdate(workInProgress);
}
```

还记得上一节我们讲到：mount时只会在rootFiber存在Placement effectTag。那么commit阶段是如何通过一次插入DOM操作（对应一个Placement effectTag）将整棵DOM树插入页面的呢？

原因就在于completeWork中的appendAllChildren方法。

由于completeWork属于“归”阶段调用的函数，每次调用appendAllChildren时都会将已生成的子孙DOM节点插入当前生成的DOM节点下。那么当“归”到rootFiber时，我们已经有一个构建好的离屏DOM树。

## effectList

至此render阶段的绝大部分工作就完成了。

还有一个问题：作为DOM操作的依据，commit阶段需要找到所有有effectTag的Fiber节点并依次执行effectTag对应操作。难道需要在commit阶段再遍历一次Fiber树寻找effectTag !== null的Fiber节点么？

这显然是很低效的。

为了解决这个问题，在completeWork的上层函数completeUnitOfWork中，每个执行完completeWork且存在effectTag的Fiber节点会被保存在一条被称为effectList的单向链表中。

effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。

类似appendAllChildren，在“归”阶段，所有有effectTag的Fiber节点都会被追加在effectList中，最终形成一条以rootFiber.firstEffect为起点的单向链表。

```javascript
                       nextEffect         nextEffect
rootFiber.firstEffect -----------> fiber -----------> fiber
```

这样，在commit阶段只需要遍历effectList就能执行所有effect了。

你可以在[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1744)看到这段代码逻辑。

借用React团队成员Dan Abramov的话：effectList相较于Fiber树，就像圣诞树上挂的那一串彩灯。

## 流程结尾

至此，render阶段全部工作完成。在performSyncWorkOnRoot函数中fiberRootNode被传递给commitRoot方法，开启commit阶段工作流程。

```javascript
commitRoot(root);
```

代码见[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1107)。

## 参考资料

completeWork流程图

![image1](https://react.iamkasong.com/img/completeWork.png)
