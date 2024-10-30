---
title: Fiber架构的工作原理
date: 2024-10-29
category: React技术揭秘
---

# Fiber架构的工作原理

通过上一节的学习，我们了解了Fiber是什么，知道Fiber节点可以保存对应的DOM节点。

相应的，Fiber节点构成的Fiber树就对应DOM树。

那么如何更新DOM呢？这需要用到被称为“双缓存”的技术。

## 什么是“双缓存”

当我们用canvas绘制动画，每一帧绘制前都会调用ctx.clearRect清除上一帧的画面。

如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。

这种**在内存中构建并直接替换**的技术叫做[双缓存](https://baike.baidu.com/item/%E5%8F%8C%E7%BC%93%E5%86%B2)。

React使用“双缓存”来完成Fiber树的构建与替换——对应着DOM树的创建与更新。

## 双缓存 Fiber 树

在React中最多会同时存在两棵Fiber树。当前屏幕上显示内容对应的Fiber树称为current Fiber树，正在内存中构建的Fiber树称为workInProgress Fiber树。

current Fiber树中的Fiber节点被称为current fiber，workInProgress Fiber树中的Fiber节点被称为workInProgress fiber，他们通过alternate属性连接。

```javascript
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

React应用的根节点通过使current指针在不同Fiber树的rootFiber间切换来完成current Fiber树指向的切换。

即当workInProgress Fiber树构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树。

每次状态更新都会产生新的workInProgress Fiber树，通过current与workInProgress的替换，完成DOM更新。

接下来我们以具体例子讲解mount时、update时的构建/替换流程。

## mount 时

考虑如下例子：

```javascript
function App() {
  const [num, add] = useState(0);
  return <p onClick={() => add(num + 1)}>{num}</p>;
}

ReactDOM.render(<App />, document.getElementById("root"));
```

首次执行ReactDOM.render会创建fiberRootNode（源码中叫fiberRoot）和rootFiber。其中fiberRootNode是整个应用的根节点，rootFiber是<App/>所在组件树的根节点。
之所以要区分fiberRootNode与rootFiber，是因为在应用中我们可以多次调用ReactDOM.render渲染不同的组件树，他们会拥有不同的rootFiber。但是整个应用的根节点只有一个，那就是fiberRootNode。

fiberRootNode的current会指向当前页面上已渲染内容对应Fiber树，即current Fiber树。

![image1](https://react.iamkasong.com/img/rootfiber.png)

```javascript
fiberRootNode.current = rootFiber;
```

由于是首屏渲染，页面中还没有挂载任何DOM，所以fiberRootNode.current指向的rootFiber没有任何子Fiber节点（即current Fiber树为空）。

接下来进入render阶段，根据组件返回的JSX在内存中依次创建Fiber节点并连接在一起构建Fiber树，被称为workInProgress Fiber树。（下图中右侧为内存中构建的树，左侧为页面显示的树）

在构建workInProgress Fiber树时会尝试复用current Fiber树中已有的Fiber节点内的属性，在首屏渲染时只有rootFiber存在对应的current fiber（即rootFiber.alternate）。

![image2](https://react.iamkasong.com/img/workInProgressFiber.png)

图中右侧已构建完的workInProgress Fiber树在commit阶段渲染到页面。

此时DOM更新为右侧树对应的样子。fiberRootNode的current指针指向workInProgress Fiber树使其变为current Fiber 树。

![image3](https://react.iamkasong.com/img/wipTreeFinish.png)

## update 时

接下来我们点击p节点触发状态改变，这会开启一次新的render阶段并构建一棵新的workInProgress Fiber 树。

![image4](https://react.iamkasong.com/img/wipTreeUpdate.png)

和mount时一样，workInProgress fiber的创建可以复用current Fiber树对应的节点数据。

workInProgress Fiber 树在render阶段完成构建后进入commit阶段渲染到页面上。渲染完毕后，workInProgress Fiber 树变为current Fiber 树。

![image5](https://react.iamkasong.com/img/currentTreeUpdate.png)

## 总结

本文介绍了Fiber树的构建与替换过程，这个过程伴随着DOM的更新。

那么在构建过程中每个Fiber节点具体是如何创建的呢？我们会在架构篇的render 阶段讲解。

