---
title: React Hooks 详解(四)
date: 2024-10-29
category: React技术揭秘
---

# React Hooks 详解(四) - useState与useReducer

Redux的作者Dan加入React核心团队后的一大贡献就是“将Redux的理念带入React”。

这里面最显而易见的影响莫过于useState与useReducer这两个Hook。本质来说，useState只是预置了reducer的useReducer。

本节我们来学习useState与useReducer的实现。

## 流程概览

我们将这两个Hook的工作流程分为声明阶段和调用阶段，对于：

```javascript
function App() {
  const [state, dispatch] = useReducer(reducer, { a: 1 });

  const [num, updateNum] = useState(0);

  return (
    <div>
      <button onClick={() => dispatch({ type: "a" })}>{state.a}</button>
      <button onClick={() => updateNum((num) => num + 1)}>{num}</button>
    </div>
  );
}
```

声明阶段即App调用时，会依次执行useReducer与useState方法。

调用阶段即点击按钮后，dispatch或updateNum被调用时。

## 声明阶段

当FunctionComponent进入render阶段的beginWork时，会调用renderWithHooks方法。

该方法内部会执行FunctionComponent对应函数（即fiber.type）。

对于这两个Hook，他们的源码如下：

```javascript
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
```

正如上一节dispatcher所说，在不同场景下，同一个Hook会调用不同处理函数。

我们分别讲解mount与update两个场景。

### mount 时

mount时，useReducer会调用mountReducer，useState会调用mountState。

我们来简单对比这这两个方法：

```javascript
function mountState<S>(
  initialState: (() => S) | S
): [S, Dispatch<BasicStateAction<S>>] {
  // 创建并返回当前的hook
  const hook = mountWorkInProgressHook();

  // ...赋值初始state

  // 创建queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

  // ...创建dispatch
  return [hook.memoizedState, dispatch];
}

function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: (I) => S
): [S, Dispatch<A>] {
  // 创建并返回当前的hook
  const hook = mountWorkInProgressHook();

  // ...赋值初始state

  // 创建queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  });

  // ...创建dispatch
  return [hook.memoizedState, dispatch];
}
```

其中mountWorkInProgressHook方法会创建并返回对应hook，对应极简Hooks实现中useState方法的isMount逻辑部分。

可以看到，mount时这两个Hook的唯一区别为queue参数的lastRenderedReducer字段。

queue的数据结构如下：

```javascript
const queue = (hook.queue = {
  // 与极简实现中的同名字段意义相同，保存update对象
  pending: null,
  // 保存dispatchAction.bind()的值
  dispatch: null,
  // 上一次render时使用的reducer
  lastRenderedReducer: reducer,
  // 上一次render时的state
  lastRenderedState: (initialState: any),
});
```

其中，useReducer的lastRenderedReducer为传入的reducer参数。useState的lastRenderedReducer为basicStateReducer。

basicStateReducer方法如下：

```javascript
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === "function" ? action(state) : action;
}
```

可见，useState即reducer参数为basicStateReducer的useReducer。

mount时的整体运行逻辑与极简实现的isMount逻辑类似，你可以对照着看。

### update 时

如果说mount时这两者还有区别，那update时，useReducer与useState调用的则是同一个函数updateReducer。

```javascript
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: (I) => S
): [S, Dispatch<A>] {
  // 获取当前hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  queue.lastRenderedReducer = reducer;

  // ...同update与updateQueue类似的更新逻辑

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```

整个流程可以概括为一句话：

> 找到对应的hook，根据update计算该hook的新state并返回。

mount时获取当前hook使用的是mountWorkInProgressHook，而update时使用的是updateWorkInProgressHook，这里的原因是：

- mount时可以确定是调用ReactDOM.render或相关初始化API产生的更新，只会执行一次。 
- update可能是在事件回调或副作用中触发的更新或者是render阶段触发的更新，为了避免组件无限循环更新，后者需要区别对待。

举个render阶段触发的更新的例子：

```javascript
function App() {
  const [num, updateNum] = useState(0);

  updateNum(num + 1);

  return <button onClick={() => updateNum((num) => num + 1)}>{num}</button>;
}
```

在这个例子中，App调用时，代表已经进入render阶段执行renderWithHooks。

在App内部，调用updateNum会触发一次更新。如果不对这种情况下触发的更新作出限制，那么这次更新会开启一次新的render阶段，最终会无限循环更新。

基于这个原因，React用一个标记变量didScheduleRenderPhaseUpdate判断是否是render阶段触发的更新。

updateWorkInProgressHook方法也会区分这两种情况来获取对应hook。

获取对应hook，接下来会根据hook中保存的state计算新的state，这个步骤同Update 一节一致。

## 调用阶段

调用阶段会执行dispatchAction，此时该FunctionComponent对应的fiber以及hook.queue已经通过调用bind方法预先作为参数传入。

```javascript
function dispatchAction(fiber, queue, action) {
  // ...创建update
  var update = {
    eventTime: eventTime,
    lane: lane,
    suspenseConfig: suspenseConfig,
    action: action,
    eagerReducer: null,
    eagerState: null,
    next: null,
  };

  // ...将update加入queue.pending

  var alternate = fiber.alternate;

  if (
    fiber === currentlyRenderingFiber$1 ||
    (alternate !== null && alternate === currentlyRenderingFiber$1)
  ) {
    // render阶段触发的更新
    didScheduleRenderPhaseUpdateDuringThisPass =
      didScheduleRenderPhaseUpdate = true;
  } else {
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // ...fiber的updateQueue为空，优化路径
    }

    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
}
```

整个过程可以概括为：

> 创建update，将update加入queue.pending中，并开启调度。

这里值得注意的是if...else...逻辑，其中：

```javascript
if (fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1)
```

fiber.lanes保存fiber上存在的update的优先级。

fiber.lanes === NoLanes意味着fiber上不存在update。

我们已经知道，通过update计算state发生在声明阶段，这是因为该hook上可能存在多个不同优先级的update，最终state的值由多个update共同决定。

但是当fiber上不存在update，则调用阶段创建的update为该hook上第一个update，在声明阶段计算state时也只依赖于该update，完全不需要进入声明阶段再计算state。

这样做的好处是：如果计算出的state与该hook之前保存的state一致，那么完全不需要开启一次调度。即使计算出的state与该hook之前保存的state不一致，在声明阶段也可以直接使用调用阶段已经计算出的state。

## 小 Tip

我们通常认为，useReducer(reducer, initialState)的传参为初始化参数，在以后的调用中都不可变。

但是在updateReducer方法中，可以看到lastRenderedReducer在每次调用时都会重新赋值。

```javascript
function updateReducer(reducer, initialArg, init) {
  // ...

  queue.lastRenderedReducer = reducer;

  // ...
```

也就是说，reducer参数是随时可变的。
