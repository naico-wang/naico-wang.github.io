---
title: React Hooks 详解(六)
date: 2024-10-29
category: React技术揭秘
---

# React Hooks 详解(六) - useRef

ref是reference（引用）的缩写。在React中，我们习惯用ref保存DOM。

事实上，任何需要被"引用"的数据都可以保存在ref中，useRef的出现将这种思想进一步发扬光大。

在Hooks数据结构一节我们讲到：

> 对于useRef(1)，memoizedState保存{current: 1}

本节我们会介绍useRef的实现，以及ref的工作流程。

由于string类型的ref已不推荐使用，所以本节针对function | {current: any}类型的ref。

## useRef

与其他Hook一样，对于mount与update，useRef对应两个不同dispatcher。

```javascript
function mountRef<T>(initialValue: T): {|current: T|} {
  // 获取当前useRef hook
  const hook = mountWorkInProgressHook();
  // 创建ref
  const ref = {current: initialValue};
  hook.memoizedState = ref;
  return ref;
}

function updateRef<T>(initialValue: T): {|current: T|} {
  // 获取当前useRef hook
  const hook = updateWorkInProgressHook();
  // 返回保存的数据
  return hook.memoizedState;
}
```

可见，useRef仅仅是返回一个包含current属性的对象。

为了验证这个观点，我们再看下React.createRef方法的实现：

```javascript
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  return refObject;
}
```

了解了ref的数据结构后，我们再来看看ref的工作流程。

## ref的工作流程

在React中，HostComponent、ClassComponent、ForwardRef可以赋值ref属性。

```jsx
// HostComponent
<div ref={domRef}></div>
// ClassComponent / ForwardRef
<App ref={cpnRef} />
```

其中，ForwardRef只是将ref作为第二个参数传递下去，不会进入ref的工作流程。

所以接下来讨论ref的工作流程时会排除ForwardRef。

```javascript
// 对于ForwardRef，secondArg为传递下去的ref
let children = Component(props, secondArg);
```

我们知道HostComponent在commit阶段的mutation阶段执行DOM操作。

所以，对应ref的更新也是发生在mutation阶段。

再进一步，mutation阶段执行DOM操作的依据为effectTag。

所以，对于HostComponent、ClassComponent如果包含ref操作，那么也会赋值相应的effectTag。

```javascript
// ...
export const Placement = /*                    */ 0b0000000000000010;
export const Update = /*                       */ 0b0000000000000100;
export const Deletion = /*                     */ 0b0000000000001000;
export const Ref = /*                          */ 0b0000000010000000;
// ...
```

> 你可以在[ReactSideEffectTags](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js#L24)文件中看到ref对应的effectTag

所以，ref的工作流程可以分为两部分：

- render阶段为含有ref属性的fiber添加Ref effectTag 
- commit阶段为包含Ref effectTag的fiber执行对应操作

## render阶段

在render阶段的beginWork与completeWork中有个同名方法markRef用于为含有ref属性的fiber增加Ref effectTag。

```javascript
// beginWork的markRef
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref;
  if (
    (current === null && ref !== null) ||
    (current !== null && current.ref !== ref)
  ) {
    // Schedule a Ref effect
    workInProgress.effectTag |= Ref;
  }
}
// completeWork的markRef
function markRef(workInProgress: Fiber) {
  workInProgress.effectTag |= Ref;
}
```

在beginWork中，如下两处调用了markRef：

- updateClassComponent内的finishClassComponent，对应ClassComponent

  注意ClassComponent即使shouldComponentUpdate为false该组件也会调用markRef

- updateHostComponent，对应HostComponent

  在completeWork中，如下两处调用了markRef：

- completeWork中的HostComponent类型 

- completeWork中的ScopeComponent类型

> ScopeComponent是一种用于管理focus的测试特性，[详见PR](https://github.com/facebook/react/pull/16587)

总结下组件对应fiber被赋值Ref effectTag需要满足的条件：

- fiber类型为HostComponent、ClassComponent、ScopeComponent（这种情况我们不讨论）

- 对于mount，workInProgress.ref !== null，即存在ref属性

- 对于update，current.ref !== workInProgress.ref，即ref属性改变

## commit阶段

在commit阶段的mutation阶段中，对于ref属性改变的情况，需要先移除之前的ref。

```javascript
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;
    // ...

    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        // 移除之前的ref
        commitDetachRef(current);
      }
    }
    // ...
  }
  // ...
```

```javascript
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref;
  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      // function类型ref，调用他，传参为null
      currentRef(null);
    } else {
      // 对象类型ref，current赋值为null
      currentRef.current = null;
    }
  }
}
```

接下来，在mutation阶段，对于Deletion effectTag的fiber（对应需要删除的DOM节点），需要递归他的子树，对子孙fiber的ref执行类似commitDetachRef的操作。

在mutation阶段一节我们讲到

> 对于Deletion effectTag的fiber，会执行commitDeletion。

在commitDeletion——unmountHostComponents——commitUnmount——ClassComponent | HostComponent类型case中调用的safelyDetachRef方法负责执行类似commitDetachRef的操作。

```javascript
function safelyDetachRef(current: Fiber) {
  const ref = current.ref;
  if (ref !== null) {
    if (typeof ref === 'function') {
      try {
        ref(null);
      } catch (refError) {
        captureCommitPhaseError(current, refError);
      }
    } else {
      ref.current = null;
    }
  }
}
```

接下来进入ref的赋值阶段。我们在Layout阶段一节讲到

> commitLayoutEffect会执行commitAttachRef（赋值ref）

```javascript
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    // 获取ref属性对应的Component实例
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }

    // 赋值ref
    if (typeof ref === 'function') {
      ref(instanceToUse);
    } else {
      ref.current = instanceToUse;
    }
  }
}
```

至此，ref的工作流程完毕。

## 总结

本节我们学习了ref的工作流程。

对于FunctionComponent，useRef负责创建并返回对应的ref。

对于赋值了ref属性的HostComponent与ClassComponent，会在render阶段经历赋值Ref effectTag，在commit阶段执行对应ref操作。
