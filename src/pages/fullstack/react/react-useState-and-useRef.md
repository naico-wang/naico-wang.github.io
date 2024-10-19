---
title: useState 和 useRef 的区别
date: 2024-08-10
tag: React架构与实践
abstract: 你知道这两个hook之间的区别吗？如果知道，你是否了解它们的微妙之处以及何时使用其中的哪一个？这篇文章会给你答案。
---

# React useState 和 useRef 的区别

## 概述

**useState() Hook**

这个钩子用来管理我们应用程序的状态，并在状态变化时重新渲染组件。

**useRef() Hook**

这个钩子允许你走出 `React` 的概念（即 UI 与状态绑定，即状态变化导致重新渲染），并持久化数值。

你知道这两个hook之间的区别吗？如果知道，你是否了解它们的微妙之处以及何时使用其中的哪一个？这篇文章会给你答案。

## useState() 的一些使用场景

### 捕获表单输入

通常通过受控输入来完成,其中输入值与组件的状态相关联,对输入字段的更改会相应地更新状态。

```javascript
import React, { useState } from 'src/pages/fullstack/react/index';

const ControlledInput = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <input type="text" value={ inputValue } onChange={ handleChange }/>
      <p>当前输入: { inputValue }</p>

    </div>

  );
};

export default ControlledInput;
```

`ControlledInput` 组件使用状态来管理文本输入的值。对输入字段的任何更改都会更新状态,状态更新会反映到显示的值。

### 显示或隐藏组件

例如模态框、工具提示、下拉菜单等。

```javascript
import React, { useState } from 'react';

const Modal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <div>
      <button onClick={toggleModal}>
        {isModalVisible ? '隐藏' : '显示'} 模态框
      </button>
      {isModalVisible && (
        <div className="modal">
          <p>这是一个模态框!</p>
          <button onClick={toggleModal}>关闭</button>
        </div>
      )}
    </div>
  );
};

export default Modal;
```

`Modal` 组件使用状态来切换模态框的可见性。点击按钮会更新状态,从而显示或隐藏模态框。

### 动态样式或渲染组件

```javascript
import React, { useState } from 'react';

const ShowRed = () => {
  const [isRed, setIsRed] = useState(false);
  const toggleColor = () => {
    setIsRed(!isRed);
  };

  return (
    <div>
      <button onClick={toggleColor}>切换颜色</button>
      <p style={{ color: isRed ? 'red' : 'blue' }}>
        这段文字会改变颜色!
      </p>
    </div>
  );
};

export default ShowRed;
```

`ShowRed` 组件根据状态变量 `isRed` 在红色和蓝色之间切换文本颜色。点击按钮会改变状态,从而动态更新文本颜色。

### 计数器

这是 `useState hook` 的一个经典且流行的用例。你会在几乎每个 `React` 教程中看到这个例子,用来演示基本的状态管理。

```javascript
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>计数: {count}</h1>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
};

export default Counter;
```

`Counter` 组件显示一个计数值,并提供按钮来增加或减少它。点击按钮会更新状态,这会使组件以新的计数重新渲染。下面来看看用: useRef() hook 声明及示例

```javascript
import React, { useRef } from 'react';

const App = () => {
  const greetingRef = useRef("World");

  console.log(`Hello ${greetingRef.current}!`);

  return (<p>Hello {greetingRef.current}!</p>)
}
//=> Hello World!
```

当上面的 `greetingRef` 变量发生变化时,它不会触发整个 App 组件的重新渲染。

## useRef() 的一些使用场景

### 访问 DOM 元素

```javascript
import React, { useRef } from 'react';

const Input = () => {
  const inputRef = useRef(null);
  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>聚焦输入框</button>
    </div>
  );
};

export default Input;
```

`Input` 组件使用 `useRef hook` 直接访问 `DOM` 元素。点击"聚焦输入框"按钮会触发 `handleFocus`，使用 `inputRef` 将焦点设置到输入字段。

### 存储可变值以避免触发重新渲染

另一种替代方法是使用 `useMemo()` 或在组件外部声明变量。

```javascript
import React, { useState, useRef, useEffect } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return <div>秒数: {seconds}</div>;
};

export default Timer;
```

`Timer` 组件使用 `useRef hook` 存储间隔 `ID` 并避免重新渲染。`setInterval` 每秒更新一次 `seconds` 状态，`intervalRef` 确保在组件卸载时清除间隔。

### 保持表单输入状态

通过非受控输入实现，其中值直接从 DOM 通过 ref 访问。这允许输入字段独立于组件的状态运行，并避免触发重新渲染。

```javascript
import React, { useRef } from 'react';

const Form = () => {
  const nameRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('姓名:', nameRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} type="text" placeholder="输入你的名字" />
      <button type="submit">提交</button>
    </form>
  );
};

export default Form;
```

`Form` 组件使用 `useRef hook` 将表单输入管理为非受控输入。提交时，表单值直接通过 `nameRef` 从 `DOM` 访问，而不触发重新渲染。

### 为 Hook、函数或包提供对原生 HTML 元素 DOM 的访问

```javascript
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedBox = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.to(boxRef.current, { x: 100, duration: 2 });
  }, []);

  return <div ref={boxRef} className="box">给我加动画</div>;
};

export default AnimatedBox
```

`AnimatedBox` 组件使用 `useRef hook` 访问 `DOM` 元素并用 `GSAP` 为其添加动画。`useEffect hook` 在组件挂载时触发动画，使元素在 2 秒内向右移动 100 像素。

## 这两个 hooks 的区别

- 目的：

  - `useState` 用于管理状态值，并在这些值改变时触发重新渲染。

  - `useRef` 用于在渲染之间保持可变值，而不触发重新渲染。

- 重新渲染：

  - `useState` 管理的值发生变化会触发组件的重新渲染。

  - `useRef` 管理的值发生变化不会触发重新渲染。

- 用途：

  - 使用 `useState` 管理那些在变化时应该触发重新渲染的值（例如，表单输入、开关状态、动态数据）。

  - 使用 `useRef` 管理那些应在渲染之间保持但不应触发重新渲染的值（例如，DOM 引用、定时器 ID、先前的状态值）。

## 两个Hooks 的使用技巧

- 何时使用 `useState` 而非 `useRef`：

  - 当你需要 UI 随数据变化而更新时，使用 `useState`。

  - 当你需要跟踪一个不影响 UI 或不应导致重新渲染的值时，使用 `useRef`。

- 结合使用 `useState` 和 `useRef`：

  - 在某些情况下，你可能会同时使用这两个 hooks。例如，你可以使用 `useRef` 跟踪先前的值，使用 `useState` 管理当前值，从而在不引起不必要的重新渲染的情况下进行比较。

```javascript
import React, { useState, useRef, useEffect } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    // 在组件重新渲染之前，用当前计数更新 ref
    prevCountRef.current = count;
  }, [count]);

  const prevCount = prevCountRef.current;

  return (
    <div>
      <h1>当前计数：{count}</h1>
      <h2>先前计数：{prevCount}</h2>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
};

export default Counter;
```

`Counter` 组件同时使用 `useState` 和 `useRef` 来跟踪当前和先前的计数值。`useState` 管理当前计数并触发重新渲染，而 `useRef` 存储先前的计数值而不引起重新渲染。

- 避免过度使用 `useRef`：

  - 尽管 `useRef` 很强大，但不应过度使用。对于大多数状态管理需求，`useState` 是合适的选择。`useRef` 最适合用于特定场景，在这些场景中你需要在重新渲染之间保持值而不触发重新渲染。

## 总结

掌握 `useState` 和 `useRef` 的区别和适用场景，对于构建高效的 `React` 应用至关重要。合理使用这两个 `Hook` 可以优化组件的性能和用户体验。在实际开发中，要根据具体需求选择合适的 `Hook`，有时甚至可以结合使用以达到最佳效果。
