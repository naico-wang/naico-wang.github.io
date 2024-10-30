---
title: React Mutation 详解
date: 2024-10-29
category: React技术揭秘
---

# React Mutation 详解

终于到了执行DOM操作的mutation阶段。

## 概览

类似before mutation阶段，mutation阶段也是遍历effectList，执行函数。这里执行的是commitMutationEffects。

```javascript
nextEffect = firstEffect;
do {
  try {
      commitMutationEffects(root, renderPriorityLevel);
    } catch (error) {
      invariant(nextEffect !== null, 'Should be working on an effect.');
      captureCommitPhaseError(nextEffect, error);
      nextEffect = nextEffect.nextEffect;
    }
} while (nextEffect !== null);
```

## commitMutationEffects

代码如下：

```javascript
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 遍历effectList
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;

    // 根据 ContentReset effectTag重置文字节点
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    // 更新ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // 根据 effectTag 分别处理
    const primaryEffectTag =
      effectTag & (Placement | Update | Deletion | Hydrating);
    switch (primaryEffectTag) {
      // 插入DOM
      case Placement: {
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入DOM 并 更新DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);

        nextEffect.effectTag &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // SSR
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // SSR
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;

        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

commitMutationEffects会遍历effectList，对每个Fiber节点执行如下三个操作：

1. 根据ContentReset effectTag重置文字节点
2. 更新ref
3. 根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)

我们关注步骤三中的Placement | Update | Deletion。Hydrating作为服务端渲染相关，我们先不关注。

## Placement effect

当Fiber节点含有Placement effectTag，意味着该Fiber节点对应的DOM节点需要插入到页面中。

调用的方法为commitPlacement。

该方法所做的工作分为三步：

1. 获取父级DOM节点。其中finishedWork为传入的Fiber节点。

    ```javascript
    const parentFiber = getHostParentFiber(finishedWork);
    // 父级DOM节点
    const parentStateNode = parentFiber.stateNode;
    ```

2. 获取Fiber节点的DOM兄弟节点

    ```javascript
    const before = getHostSibling(finishedWork);
    ```

3. 根据DOM兄弟节点是否存在决定调用parentNode.insertBefore或parentNode.appendChild执行DOM插入操作。
    
    ```javascript
    // parentStateNode是否是rootFiber
    if (isContainer) {
      insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
    } else {
      insertOrAppendPlacementNode(finishedWork, before, parent);
    }
    ```

值得注意的是，getHostSibling（获取兄弟DOM节点）的执行很耗时，当在同一个父Fiber节点下依次执行多个插入操作，getHostSibling算法的复杂度为指数级。

这是由于Fiber节点不只包括HostComponent，所以Fiber树和渲染的DOM树节点并不是一一对应的。要从Fiber节点找到DOM节点很可能跨层级遍历。

考虑如下例子：

```javascript
function Item() {
  return <li><li>;
}

function App() {
  return (
    <div>
      <Item/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

对应的Fiber树和DOM树结构为：

```javascript
// Fiber树
          child      child      child       child
rootFiber -----> App -----> div -----> Item -----> li

// DOM树
#root ---> div ---> li
```

当在div的子节点Item前插入一个新节点p，即App变为：

```javascript
function App() {
  return (
    <div>
      <p></p>
      <Item/>
    </div>
  )
}
```

对应的Fiber树和DOM树结构为：

```javascript
// Fiber树
          child      child      child
rootFiber -----> App -----> div -----> p 
                                       | sibling       child
                                       | -------> Item -----> li 
// DOM树
#root ---> div ---> p
             |
               ---> li
```

此时DOM节点 p的兄弟节点为li，而Fiber节点 p对应的兄弟DOM节点为：

```javascript
fiberP.sibling.child
```

即fiber p的兄弟fiber Item的子fiber li

## Update effect

当Fiber节点含有Update effectTag，意味着该Fiber节点需要更新。调用的方法为commitWork，他会根据Fiber.tag分别处理。

这里我们主要关注FunctionComponent和HostComponent。

### FunctionComponent mutation

当fiber.tag为FunctionComponent，会调用commitHookEffectListUnmount。该方法会遍历effectList，执行所有useLayoutEffect hook的销毁函数。

所谓“销毁函数”，见如下例子：

```javascript
useLayoutEffect(() => {
  // ...一些副作用逻辑

  return () => {
    // ...这就是销毁函数
  }
})
```

你不需要很了解useLayoutEffect，我们会在下一节详细介绍。你只需要知道在mutation阶段会执行useLayoutEffect的销毁函数。

### HostComponent mutation

当fiber.tag为HostComponent，会调用commitUpdate。

最终会在updateDOMProperties中将render阶段 completeWork中为Fiber节点赋值的updateQueue对应的内容渲染在页面上。

```javascript
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // 处理 style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
  // 处理 DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
  // 处理 children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
  // 处理剩余 props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```

## Deletion effect

当Fiber节点含有Deletion effectTag，意味着该Fiber节点对应的DOM节点需要从页面中删除。调用的方法为commitDeletion。

该方法会执行如下操作：

1. 递归调用Fiber节点及其子孙Fiber节点中fiber.tag为ClassComponent的componentWillUnmount生命周期钩子，从页面移除Fiber节点对应DOM节点
2. 解绑ref
3. 调度useEffect的销毁函数

## 总结

从这节我们学到，mutation阶段会遍历effectList，依次执行commitMutationEffects。该方法的主要工作为“根据effectTag调用不同的处理函数处理Fiber。
