---
title: React Layout 详解
date: 2024-10-29
category: React技术揭秘
---

# React Layout 详解

该阶段之所以称为layout，因为该阶段的代码都是在DOM修改完成（mutation阶段完成）后执行的。

注意：由于 JS 的同步执行阻塞了主线程，所以此时 JS 已经可以获取到新的DOM，但是浏览器对新的DOM并没有完成渲染。

该阶段触发的生命周期钩子和hook可以直接访问到已经改变后的DOM，即该阶段是可以参与DOM layout的阶段。

## 概览

与前两个阶段类似，layout阶段也是遍历effectList，执行函数。

具体执行的函数是commitLayoutEffects。

```javascript
root.current = finishedWork;

nextEffect = firstEffect;
do {
  try {
    commitLayoutEffects(root, lanes);
  } catch (error) {
    invariant(nextEffect !== null, "Should be working on an effect.");
    captureCommitPhaseError(nextEffect, error);
    nextEffect = nextEffect.nextEffect;
  }
} while (nextEffect !== null);

nextEffect = null;
```

## commitLayoutEffects

```javascript
function commitLayoutEffects(root: FiberRoot, committedLanes: Lanes) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 调用生命周期钩子和hook
    if (effectTag & (Update | Callback)) {
      const current = nextEffect.alternate;
      commitLayoutEffectOnFiber(root, current, nextEffect, committedLanes);
    }

    // 赋值ref
    if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

commitLayoutEffects一共做了两件事：

- commitLayoutEffectOnFiber（调用生命周期钩子和hook相关操作）
- commitAttachRef（赋值 ref）

## commitLayoutEffectOnFiber
commitLayoutEffectOnFiber方法会根据fiber.tag对不同类型的节点分别处理。

> 你可以在[这里](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L459)看到commitLayoutEffectOnFiber源码（commitLayoutEffectOnFiber为别名，方法原名为commitLifeCycles）

- 对于ClassComponent，他会通过current === null?区分是mount还是update，调用componentDidMount或componentDidUpdate。

触发状态更新的this.setState如果赋值了第二个参数回调函数，也会在此时调用。

```javascript
this.setState({ xxx: 1 }, () => {
  console.log("i am update~");
});
```

- 对于FunctionComponent及相关类型，他会调用useLayoutEffect hook的回调函数，调度useEffect的销毁与回调函数

> 相关类型指特殊处理后的FunctionComponent，比如ForwardRef、React.memo包裹的FunctionComponent

```javascript
switch (finishedWork.tag) {
  // 以下都是FunctionComponent及相关类型
  case FunctionComponent:
  case ForwardRef:
  case SimpleMemoComponent:
  case Block: {
    // 执行useLayoutEffect的回调函数
    commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
    // 调度useEffect的销毁函数与回调函数
    schedulePassiveEffects(finishedWork);
    return;
  }
```

在上一节介绍Update effect时介绍过，mutation阶段会执行useLayoutEffect hook的销毁函数。

结合这里我们可以发现，useLayoutEffect hook从上一次更新的销毁函数调用到本次更新的回调函数调用是同步执行的。

而useEffect则需要先调度，在Layout阶段完成后再异步执行。

这就是useLayoutEffect与useEffect的区别。

- 对于HostRoot，即rootFiber，如果赋值了第三个参数回调函数，也会在此时调用。

```javascript
ReactDOM.render(<App />, document.querySelector("#root"), function() {
  console.log("i am mount~");
});
```

## commitAttachRef

commitLayoutEffects会做的第二件事是commitAttachRef。

```javascript
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;

    // 获取DOM实例
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;
      default:
        instanceToUse = instance;
    }

    if (typeof ref === "function") {
      // 如果ref是函数形式，调用回调函数
      ref(instanceToUse);
    } else {
      // 如果ref是ref实例形式，赋值ref.current
      ref.current = instanceToUse;
    }
  }
}
```

代码逻辑很简单：获取DOM实例，更新ref。

## current Fiber树切换

至此，整个layout阶段就结束了。

在结束本节的学习前，我们关注下这行代码：

```javascript
root.current = finishedWork;
```

在双缓存机制一节我们介绍过，workInProgress Fiber树在commit阶段完成渲染后会变为current Fiber树。这行代码的作用就是切换fiberRootNode指向的current Fiber树。

那么这行代码为什么在这里呢？（在mutation阶段结束后，layout阶段开始前。）

我们知道componentWillUnmount会在mutation阶段执行。此时current Fiber树还指向前一次更新的Fiber树，在生命周期钩子内获取的DOM还是更新前的。

componentDidMount和componentDidUpdate会在layout阶段执行。此时current Fiber树已经指向更新后的Fiber树，在生命周期钩子内获取的DOM就是更新后的。

## 总结

从这节我们学到，layout阶段会遍历effectList，依次执行commitLayoutEffects。该方法的主要工作为“根据effectTag调用不同的处理函数处理Fiber并更新ref。

## 参考资料

- [useeffect-vs-uselayouteffect-examples](https://blog.logrocket.com/useeffect-vs-uselayouteffect-examples/) 
- [hooks-reference.html#uselayouteffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
