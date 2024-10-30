---
title: React 状态更新详解(四)
date: 2024-10-29
category: React技术揭秘
---

# React 状态更新详解(四) - 优先级

通过更新的心智模型，我们了解到更新具有优先级。

那么什么是优先级？优先级以什么为依据？如何通过优先级决定哪个状态应该先被更新？

本节我们会详细讲解。

## 什么是优先级

在React 理念一节我们聊到React将人机交互研究的结果整合到真实的UI中。具体到React运行上这是什么意思呢？

状态更新由用户交互产生，用户心里对交互执行顺序有个预期。React根据人机交互研究的结果中用户对交互的预期顺序为交互产生的状态更新赋予不同优先级。

具体如下：

- 生命周期方法：同步执行。

- 受控的用户输入：比如输入框内输入文字，同步执行。

- 交互事件：比如动画，高优先级执行。

- 其他：比如数据请求，低优先级执行。

## 如何调度优先级

我们在新的 React 结构一节讲到，React通过Scheduler调度任务。

具体到代码，每当需要调度任务时，React会调用Scheduler提供的方法runWithPriority。

该方法接收一个优先级常量与一个回调函数作为参数。回调函数会以优先级高低为顺序排列在一个定时器中并在合适的时间触发。

对于更新来讲，传递的回调函数一般为状态更新流程概览一节讲到的render阶段的入口函数。

## 例子

优先级最终会反映到update.lane变量上。当前我们只需要知道这个变量能够区分Update的优先级。

接下来我们通过一个例子结合上一节介绍的Update相关字段讲解优先级如何决定更新的顺序。

> 该例子来自[React Core Team Andrew 向网友讲解 Update 工作流程的推文](https://twitter.com/acdlite/status/978412930973687808)

![image](https://react.iamkasong.com/img/update-process.png)

在这个例子中，有两个Update。我们将“关闭黑夜模式”产生的Update称为u1，输入字母“I”产生的Update称为u2。

其中u1先触发并进入render阶段。其优先级较低，执行时间较长。此时：

```javascript
fiber.updateQueue = {
  baseState: {
    blackTheme: true,
    text: 'H'
  },
  firstBaseUpdate: null,
  lastBaseUpdate: null
  shared: {
    pending: u1
  },
  effects: null
};
```

在u1完成render阶段前用户通过键盘输入字母“I”，产生了u2。u2属于受控的用户输入，优先级高于u1，于是中断u1产生的render阶段。

此时：

```javascript
fiber.updateQueue.shared.pending === u2 ----> u1
                                     ^        |
                                     |________|
// 即
u2.next === u1;
u1.next === u2;
```

其中u2优先级高于u1。

接下来进入u2产生的render阶段。

在processUpdateQueue方法中，shared.pending环状链表会被剪开并拼接在baseUpdate后面。

需要明确一点，shared.pending指向最后一个pending的update，所以实际执行时update的顺序为：

```javascript
u1 -- u2
```

接下来遍历baseUpdate，处理优先级合适的Update（这一次处理的是更高优的u2）。

由于u2不是baseUpdate中的第一个update，在其之前的u1由于优先级不够被跳过。

update之间可能有依赖关系，所以被跳过的update及其后面所有update会成为下次更新的baseUpdate。（即u1 -- u2）。

最终u2完成render - commit阶段。

此时：

```javascript
fiber.updateQueue = {
  baseState: {
    blackTheme: true,
    text: 'HI'
  },
  firstBaseUpdate: u1,
  lastBaseUpdate: u2
  shared: {
    pending: null
  },
  effects: null
};
```

在commit阶段结尾会再调度一次更新。在该次更新中会基于baseState中firstBaseUpdate保存的u1，开启一次新的render阶段。

最终两次Update都完成后的结果如下：

```javascript
fiber.updateQueue = {
  baseState: {
    blackTheme: false,
    text: 'HI'
  },
  firstBaseUpdate: null,
  lastBaseUpdate: null
  shared: {
    pending: null
  },
  effects: null
};
```

我们可以看见，u2对应的更新执行了两次，相应的render阶段的生命周期勾子componentWillXXX也会触发两次。这也是为什么这些勾子会被标记为unsafe_。

## 如何保证状态正确

现在我们基本掌握了updateQueue的工作流程。还有两个疑问：

- render阶段可能被中断。如何保证updateQueue中保存的Update不丢失？

- 有时候当前状态需要依赖前一个状态。如何在支持跳过低优先级状态的同时保证状态依赖的连续性？

我们分别讲解下。

### 如何保证Update不丢失

在上一节例子中我们讲到，在render阶段，shared.pending的环被剪开并连接在updateQueue.lastBaseUpdate后面。

实际上shared.pending会被同时连接在workInProgress updateQueue.lastBaseUpdate与current updateQueue.lastBaseUpdate后面。

> 具体代码见[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactUpdateQueue.new.js#L424)

当render阶段被中断后重新开始时，会基于current updateQueue克隆出workInProgress updateQueue。由于current updateQueue.lastBaseUpdate已经保存了上一次的Update，所以不会丢失。

当commit阶段完成渲染，由于workInProgress updateQueue.lastBaseUpdate中保存了上一次的Update，所以 workInProgress Fiber树变成current Fiber树后也不会造成Update丢失。

### 如何保证状态依赖的连续性

当某个Update由于优先级低而被跳过时，保存在baseUpdate中的不仅是该Update，还包括链表中该Update之后的所有Update。

考虑如下例子：

```javascript
baseState: ''
shared.pending: A1 --> B2 --> C1 --> D2
```

其中字母代表该Update要在页面插入的字母，数字代表优先级，值越低优先级越高。

第一次render，优先级为 1。

```javascript
baseState: "";
baseUpdate: null;
render阶段使用的Update: [A1, C1];
memoizedState: "AC";
```

其中B2由于优先级为 2，低于当前优先级，所以他及其后面的所有Update会被保存在baseUpdate中作为下次更新的Update（即B2 C1 D2）。

这么做是为了保持状态的前后依赖顺序。

第二次render，优先级为 2。

```javascript
baseState: "A";
baseUpdate: B2-- > C1-- > D2;
render阶段使用的Update: [B2, C1, D2];
memoizedState: "ABCD";
```

注意这里baseState并不是上一次更新的memoizedState。这是由于B2被跳过了。

即当有Update被跳过时，下次更新的baseState !== 上次更新的memoizedState。

> 跳过B2的逻辑见[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactUpdateQueue.new.js#L479)

通过以上例子我们可以发现，React保证最终的状态一定和用户触发的交互一致，但是中间过程状态可能由于设备不同而不同。

## 参考资料

- [深入源码剖析 componentWillXXX 为什么 UNSAFE](https://juejin.im/post/5f05a3e25188252e5c576cdb) 
- [React 源码中讲解 Update 工作流程及优先级的注释](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactUpdateQueue.new.js#L10) 
- [React Core Team Andrew 向网友讲解 Update 工作流程的推文](https://twitter.com/acdlite/status/978412930973687808)
