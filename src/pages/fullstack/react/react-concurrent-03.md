---
title: React Concurrent 模式(三)
date: 2024-10-29
category: React技术揭秘
---

# React Concurrent 模式(三) - lane模型

上一节我们提到Scheduler与React是两套优先级机制。在React中，存在多种使用不同优先级的情况，比如：

注：以下例子皆为Concurrent Mode开启情况

- 过期任务或者同步任务使用同步优先级 
- 用户交互产生的更新（比如点击事件）使用高优先级 
- 网络请求产生的更新使用一般优先级 
- Suspense使用低优先级 

React需要设计一套满足如下需要的优先级机制： 

- 可以表示优先级的不同
- 可能同时存在几个同优先级的更新，所以还得能表示批的概念
- 方便进行优先级相关计算

为了满足如上需求，React设计了lane模型。接下来我们来看lane模型如何满足以上3个条件。

## 表示优先级的不同

想象你身处赛车场。

![image](https://react.iamkasong.com/img/lane.jpeg)

不同的赛车疾驰在不同的赛道。内圈的赛道总长度更短，外圈更长。某几个临近的赛道的长度可以看作差不多长。

lane模型借鉴了同样的概念，使用31位的二进制表示31条赛道，位数越小的赛道优先级越高，某些相邻的赛道拥有相同优先级。

如下：

```javascript
export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001;
export const SyncBatchedLane: Lane = /*                 */ 0b0000000000000000000000000000010;

export const InputDiscreteHydrationLane: Lane = /*      */ 0b0000000000000000000000000000100;
const InputDiscreteLanes: Lanes = /*                    */ 0b0000000000000000000000000011000;

const InputContinuousHydrationLane: Lane = /*           */ 0b0000000000000000000000000100000;
const InputContinuousLanes: Lanes = /*                  */ 0b0000000000000000000000011000000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000100000000;
export const DefaultLanes: Lanes = /*                   */ 0b0000000000000000000111000000000;

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000001000000000000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111110000000000000;

const RetryLanes: Lanes = /*                            */ 0b0000011110000000000000000000000;

export const SomeRetryLane: Lanes = /*                  */ 0b0000010000000000000000000000000;

export const SelectiveHydrationLane: Lane = /*          */ 0b0000100000000000000000000000000;

const NonIdleLanes = /*                                 */ 0b0000111111111111111111111111111;

export const IdleHydrationLane: Lane = /*               */ 0b0001000000000000000000000000000;
const IdleLanes: Lanes = /*                             */ 0b0110000000000000000000000000000;

export const OffscreenLane: Lane = /*                   */ 0b1000000000000000000000000000000;
```

其中，同步优先级占用的赛道为第一位：

```javascript
export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001;
```

从SyncLane往下一直到SelectiveHydrationLane，赛道的优先级逐步降低。

## 表示“批”的概念

可以看到其中有几个变量占用了几条赛道，比如：

```javascript
const InputDiscreteLanes: Lanes = /*                    */ 0b0000000000000000000000000011000;
export const DefaultLanes: Lanes = /*                   */ 0b0000000000000000000111000000000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111110000000000000;
```

这就是批的概念，被称作lanes（区别于优先级的lane）。

其中InputDiscreteLanes是“用户交互”触发更新会拥有的优先级范围。

DefaultLanes是“请求数据返回后触发更新”拥有的优先级范围。

TransitionLanes是Suspense、useTransition、useDeferredValue拥有的优先级范围。

这其中有个细节，越低优先级的lanes占用的位越多。比如InputDiscreteLanes占了2个位，TransitionLanes占了9个位。

原因在于：越低优先级的更新越容易被打断，导致积压下来，所以需要更多的位。相反，最高优的同步更新的SyncLane不需要多余的lanes。

## 方便进行优先级相关计算

既然lane对应了二进制的位，那么优先级相关计算其实就是位运算。

比如：

计算a、b两个lane是否存在交集，只需要判断a与b按位与的结果是否为0：

```javascript
export function includesSomeLane(a: Lanes | Lane, b: Lanes | Lane) {
  return (a & b) !== NoLanes;
}
```

计算b这个lanes是否是a对应的lanes的子集，只需要判断a与b按位与的结果是否为b：

```javascript
export function isSubsetOfLanes(set: Lanes, subset: Lanes | Lane) {
  return (set & subset) === subset;
}
```

将两个lane或lanes的位合并只需要执行按位或操作：

```javascript
export function mergeLanes(a: Lanes | Lane, b: Lanes | Lane): Lanes {
  return a | b;
}
```

从set对应lanes中移除subset对应lane（或lanes），只需要对subset的lane（或lanes）执行按位非，结果再对set执行按位与。

```javascript
export function removeLanes(set: Lanes, subset: Lanes | Lane): Lanes {
  return set & ~subset;
}
```

## 总结

这就是React的优先级模型lane模型。

至此，我们已经了解Fiber架构、更新的优先级、Scheduler的实现、lane模型。从下一节开始，我们会逐步讲解Concurrent Mode的各种应用。
