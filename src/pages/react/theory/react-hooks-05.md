---
title: React Hooks 详解(五)
date: 2024-10-29
category: React技术揭秘
---

# React Hooks 详解(五) - useEffect

在架构篇commit阶段流程概览我们讲解了useEffect的工作流程。

其中我们谈到

> 在flushPassiveEffects方法内部会从全局变量rootWithPendingPassiveEffects获取effectList。

本节我们深入flushPassiveEffects方法内部探索useEffect的工作原理。

## flushPassiveEffectsImpl

flushPassiveEffects内部会设置优先级，并执行flushPassiveEffectsImpl。

flushPassiveEffectsImpl主要做三件事：

- 调用该useEffect在上一次render时的销毁函数 
- 调用该useEffect在本次render时的回调函数 
- 如果存在同步任务，不需要等待下次事件循环的宏任务，提前执行他

本节我们关注前两步。

在v16中第一步是同步执行的，在官方博客中提到：

> 副作用清理函数（如果存在）在 React 16 中同步运行。我们发现，对于大型应用程序来说，这不是理想选择，因为同步会减缓屏幕的过渡（例如，切换标签）。

基于这个原因，在v17.0.0中，useEffect的两个阶段会在页面渲染后（layout阶段后）异步执行。

> 事实上，从代码中看，v16.13.1中已经是异步执行了

接下来我们详细讲解这两个步骤。

## 阶段一：销毁函数的执行

useEffect的执行需要保证所有组件useEffect的销毁函数必须都执行完后才能执行任意一个组件的useEffect的回调函数。

这是因为多个组件间可能共用同一个ref。

如果不是按照“全部销毁”再“全部执行”的顺序，那么在某个组件useEffect的销毁函数中修改的ref.current可能影响另一个组件useEffect的回调函数中的同一个ref的current属性。

在useLayoutEffect中也有同样的问题，所以他们都遵循“全部销毁”再“全部执行”的顺序。

在阶段一，会遍历并执行所有useEffect的销毁函数。

```javascript
// pendingPassiveHookEffectsUnmount中保存了所有需要执行销毁的useEffect
const unmountEffects = pendingPassiveHookEffectsUnmount;
  pendingPassiveHookEffectsUnmount = [];
  for (let i = 0; i < unmountEffects.length; i += 2) {
    const effect = ((unmountEffects[i]: any): HookEffect);
    const fiber = ((unmountEffects[i + 1]: any): Fiber);
    const destroy = effect.destroy;
    effect.destroy = undefined;

    if (typeof destroy === 'function') {
      // 销毁函数存在则执行
      try {
        destroy();
      } catch (error) {
        captureCommitPhaseError(fiber, error);
      }
    }
  }
```

其中pendingPassiveHookEffectsUnmount数组的索引i保存需要销毁的effect，i+1保存该effect对应的fiber。

向pendingPassiveHookEffectsUnmount数组内push数据的操作发生在layout阶段 commitLayoutEffectOnFiber方法内部的schedulePassiveEffects方法中。

> commitLayoutEffectOnFiber方法我们在Layout阶段已经介绍

```javascript
function schedulePassiveEffects(finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      const {next, tag} = effect;
      if (
        (tag & HookPassive) !== NoHookEffect &&
        (tag & HookHasEffect) !== NoHookEffect
      ) {
        // 向`pendingPassiveHookEffectsUnmount`数组内`push`要销毁的effect
        enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
        // 向`pendingPassiveHookEffectsMount`数组内`push`要执行回调的effect
        enqueuePendingPassiveHookEffectMount(finishedWork, effect);
      }
      effect = next;
    } while (effect !== firstEffect);
  }
}
```

## 阶段二：回调函数的执行

与阶段一类似，同样遍历数组，执行对应effect的回调函数。

其中向pendingPassiveHookEffectsMount中push数据的操作同样发生在schedulePassiveEffects中。

```javascript
// pendingPassiveHookEffectsMount中保存了所有需要执行回调的useEffect
const mountEffects = pendingPassiveHookEffectsMount;
pendingPassiveHookEffectsMount = [];
for (let i = 0; i < mountEffects.length; i += 2) {
  const effect = ((mountEffects[i]: any): HookEffect);
  const fiber = ((mountEffects[i + 1]: any): Fiber);
  
  try {
    const create = effect.create;
   effect.destroy = create();
  } catch (error) {
    captureCommitPhaseError(fiber, error);
  }
}
```
