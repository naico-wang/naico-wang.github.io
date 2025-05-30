---
title: React 状态更新详解(五)
date: 2024-10-29
category: React技术揭秘
---

# React 状态更新详解(五) - ReactDOM.render

经过五章的学习，我们终于回到了React应用的起点。

这一节我们完整的走通ReactDOM.render完成页面渲染的整个流程。

## 创建fiber

从双缓存机制一节我们知道，首次执行ReactDOM.render会创建fiberRootNode和rootFiber。其中fiberRootNode是整个应用的根节点，rootFiber是要渲染组件所在组件树的根节点。

这一步发生在调用ReactDOM.render后进入的legacyRenderSubtreeIntoContainer方法中。

```javascript
// container指ReactDOM.render的第二个参数（即应用挂载的DOM节点）
root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
  container,
  forceHydrate,
);
fiberRoot = root._internalRoot;
```

legacyCreateRootFromDOMContainer方法内部会调用createFiberRoot方法完成fiberRootNode和rootFiber的创建以及关联。并初始化updateQueue。

```javascript
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  // 创建fiberRootNode
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  
  // 创建rootFiber
  const uninitializedFiber = createHostRootFiber(tag);

  // 连接rootFiber与fiberRootNode
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  // 初始化updateQueue
  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```

根据以上代码，现在我们可以在双缓存机制一节基础上补充上rootFiber到fiberRootNode的引用。

![image](https://react.iamkasong.com/img/fiberroot.png)

## 创建update

我们已经做好了组件的初始化工作，接下来就等待创建Update来开启一次更新。

这一步发生在updateContainer方法中。

```javascript
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): Lane {
  // ...省略与逻辑不相关代码

  // 创建update
  const update = createUpdate(eventTime, lane, suspenseConfig);
  
  // update.payload为需要挂载在根节点的组件
  update.payload = {element};

  // callback为ReactDOM.render的第三个参数 —— 回调函数
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  // 将生成的update加入updateQueue
  enqueueUpdate(current, update);
  // 调度更新
  scheduleUpdateOnFiber(current, lane, eventTime);

  // ...省略与逻辑不相关代码
}
```

值得注意的是其中update.payload = {element};

这就是我们在Update一节介绍的，对于HostRoot，payload为ReactDOM.render的第一个传参。

## 流程概览

至此，ReactDOM.render的流程就和我们已知的流程连接上了。

整个流程如下：

```javascript
创建fiberRootNode、rootFiber、updateQueue（`legacyCreateRootFromDOMContainer`）

    |
    |
    v

创建Update对象（`updateContainer`）

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

## React的其他入口函数

当前React共有三种模式：

- **legacy**，这是当前React使用的方式。当前没有计划删除本模式，但是这个模式可能不支持一些新功能。 
- **blocking**，开启部分concurrent模式特性的中间模式。目前正在实验中。作为迁移到concurrent模式的第一个步骤。 
- **concurrent**，面向未来的开发模式。我们之前讲的任务中断/任务优先级都是针对concurrent模式。

模式的变化影响整个应用的工作方式，所以无法只针对某个组件开启不同模式。

基于此原因，可以通过不同的入口函数开启不同模式：

- **legacy** -- ReactDOM.render(<App />, rootNode)
- **blocking** -- ReactDOM.createBlockingRoot(rootNode).render(<App />)
- **concurrent** -- ReactDOM.createRoot(rootNode).render(<App />)

虽然不同模式的入口函数不同，但是他们仅对fiber.mode变量产生影响，对我们在流程概览中描述的流程并无影响。
