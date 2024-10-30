---
title: React Hooks 详解(三)
date: 2024-10-29
category: React技术揭秘
---

# React Hooks 详解(三) - Hooks数据结构

在上一节我们实现了一个极简的useState，了解了Hooks的运行原理。

本节我们讲解Hooks的数据结构，为后面介绍具体的hook打下基础。

## dispatcher

在上一节的极简useState实现中，使用isMount变量区分mount与update。

在真实的Hooks中，组件mount时的hook与update时的hook来源于不同的对象，这类对象在源码中被称为dispatcher。

```javascript
// mount时的Dispatcher
const HooksDispatcherOnMount: Dispatcher = {
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  // ...省略
};

// update时的Dispatcher
const HooksDispatcherOnUpdate: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  // ...省略
};
```

可见，mount时调用的hook和update时调用的hook其实是两个不同的函数。

在FunctionComponent render前，会根据FunctionComponent对应fiber的以下条件区分mount与update。

```javascript
current === null || current.memoizedState === null
```

并将不同情况对应的dispatcher赋值给全局变量ReactCurrentDispatcher的current属性。

```javascript
ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;  
```

在FunctionComponent render时，会从ReactCurrentDispatcher.current（即当前dispatcher）中寻找需要的hook。

换言之，不同的调用栈上下文为ReactCurrentDispatcher.current赋值不同的dispatcher，则FunctionComponent render时调用的hook也是不同的函数。

## 一个dispatcher使用场景

当错误的书写了嵌套形式的hook，如：

```javascript
useEffect(() => {
  useState(0);
})
```

此时ReactCurrentDispatcher.current已经指向ContextOnlyDispatcher，所以调用useState实际会调用throwInvalidHookError，直接抛出异常。

```javascript
export const ContextOnlyDispatcher: Dispatcher = {
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  // ...省略
```

## Hook的数据结构

接下来我们学习hook的数据结构。

```javascript
const hook: Hook = {
  memoizedState: null,

  baseState: null,
  baseQueue: null,
  queue: null,

  next: null,
};
```

其中除memoizedState以外字段的意义与上一章介绍的updateQueue类似。

## memoizedState

:::danger 注意
hook与FunctionComponent fiber都存在memoizedState属性，不要混淆他们的概念。

- fiber.memoizedState：FunctionComponent对应fiber保存的Hooks链表。 
- hook.memoizedState：Hooks链表中保存的单一hook对应的数据。
:::

不同类型hook的memoizedState保存不同类型数据，具体如下：

- useState：对于const [state, updateState] = useState(initialState)，memoizedState保存state的值

- useReducer：对于const [state, dispatch] = useReducer(reducer, {});，memoizedState保存state的值

- useEffect：memoizedState保存包含useEffect回调函数、依赖项等的链表数据结构effect，你可以在这里看到effect的创建过程。effect链表同时会保存在fiber.updateQueue中

- useRef：对于useRef(1)，memoizedState保存{current: 1}

- useMemo：对于useMemo(callback, [depA])，memoizedState保存[callback(), depA]

- useCallback：对于useCallback(callback, [depA])，memoizedState保存[callback, depA]。与useMemo的区别是，useCallback保存的是callback函数本身，而useMemo保存的是callback函数的执行结果

有些hook是没有memoizedState的，比如：

- useContext
