---
title: useCallback 和 useMemo 详解及区别
date: 2024-10-29
category: React进阶
---

# useCallback 和 useMemo 详解及区别

在本篇博客中，我们将深入了解 React Hooks 中的 `useCallback` 和 `useMemo`，以及它们的使用场景和区别。这两个 `Hooks` 都是用于优化性能，但它们的用途和返回值有所不同。让我们一起来详细了解一下。

## 引用相等

在学习之前，我们先来看一下什么是引用相等。 当 `React` 对比 `useEffect`、 `useCallback`的依赖数组的值，或者传入子组件的 `props` 值时，使用的是 `Object.is()`。

详细介绍可以查看 [Object.is](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)，简言之：

- 原始值是相等的（上文链接有少数例外）。
- 非原始值指向内存中相同的对象。

> 注：原始值指的是数据类型为基本数据类型（如：number、string、boolean 等）时，两个值相等的数据在严格模式下（===）也是相等的。非原始值值的数据类型是引用类型（如：object），由于引用类型存储的是对象的引用，所以只有当两个对象引用相同的底层对象，它们在严格模式下才是相等的。这种比较方式被称为“引用相等”。

简化示例如下：

```javascript
"string" === "string" // true
0 === 0 // true
true === true // true
{} === {} // false
[] === [] // false

const f = () => 'Hi'
const f1 = f
const f2 = f

f1 === f1 // true
f1 === f2 // true
```

## useCallback

`useCallback` 是一个用于优化性能的 `React Hook`，它的主要作用是避免在每次渲染时都重新创建函数。通过记住上一次创建的函数，只有在依赖项发生变化时才重新创建新的函数，从而提高性能。

简单来说，`useCallback` 允许你在组件渲染之间保存**函数定义**。

`useCallback` 接受两个参数：

- 一个函数，这个函数是我们需要记住的函数。
- 一个依赖项数组，当数组中的依赖项发生变化时，才会重新创建新的函数。

```javascript
import React, { useState, useCallback } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('点击了按钮');
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <p>点击次数：{count}</p>
      <button onClick={handleClick}>增加</button>
    </div>
  );
}

export default App;
```

在这个例子中，我们使用 `useCallback` 对 `handleClick` 函数进行了优化。只有当 `count` 发生变化时，`handleClick` 函数才会被重新创建。

## useMemo

`useMemo` 是一个用于优化性能的 `React Hook`，它的主要作用是避免在每次渲染时都进行复杂的计算和重新创建对象。通过记住上一次的计算结果，只有在依赖项发生变化时才重新计算，从而提高性能。

运行机制：

当想要避免子组件不必要的重新渲染（即便父组件发生了更改），你可以使用 React.memo 打包子组件 – 只要 props 不发生改变，就不会重复渲染。请注意此处是引用相等（注：沿用了旧版本 React 的“浅比较”）——子组件不会被重新渲染。

`useMemo` 接受两个参数：

- 一个函数，这个函数返回需要记住的值。
- 一个依赖项数组，当数组中的依赖项发生变化时，才会重新计算函数的返回值。

```javascript
import React, { useMemo } from 'react';

function App() {
  const [count, setCount] = React.useState(0);

  const expensiveCalculation = useMemo(() => {
    console.log('计算中...');
    return count * 2;
  }, [count]);

  return (
    <div>
      <p>结果：{expensiveCalculation}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}

export default App;
```

在这个例子中，我们使用 `useMemo` 对 `count * 2` 这个计算进行了优化。只有当 `count` 发生变化时，`expensiveCalculation` 的值才会重新计算。

## 区别

`useCallback` 和 `useMemo` 都是 React 的 Hooks，用于优化性能，它们的主要区别在于用途和返回值：

### 用途：

- useCallback 主要用于避免在每次渲染时都重新创建函数。它会在依赖项发生变化时才重新创建新的函数，从而提高性能。
- useMemo 主要用于避免在每次渲染时都进行复杂的计算和重新创建对象。它会在依赖项发生变化时才重新计算函数的返回值，从而提高性能。

### 返回值：

- `useCallback` 返回的是一个记住的函数。当依赖项发生变化时，它会返回一个新的函数。
- `useMemo` 返回的是一个记住的计算结果。当依赖项发生变化时，它会返回重新计算的结果。

`useCallback` 用于优化函数，而 `useMemo` 用于优化计算结果。在实际使用中，可以根据需要选择合适的 `Hook` 进行性能优化。

需要注意的是，虽然 `useCallback` 和 `useMemo` 都可以帮助我们优化性能，但并不是所有情况下都需要使用它们。在一些简单的计算、函数或不会频繁触发重新渲染的情况下，使用这两个 Hooks 反而可能带来额外的开销。因此，在使用 `useCallback` 和 `useMemo` 时，需要根据具体情况进行权衡。

## 总结

在本篇博客中，我们介绍了 `React Hooks` 中的 `useCallback` 和 `useMemo`，以及它们的使用场景和区别。这两个 Hooks 都可以帮助我们优化性能，但它们的用途和返回值有所不同。`useCallback` 主要用于避免在每次渲染时都重新创建函数，而 `useMemo` 主要用于避免在每次渲染时都进行复杂的计算和重新创建对象。

在实际开发中，我们可以根据具体需求和场景选择使用 `useCallback` 或者 `useMemo`，但同时也需要注意不要滥用它们，以免带来额外的性能开销。希望本篇博客能帮助您更好地理解和使用这两个有用的 React Hooks。
