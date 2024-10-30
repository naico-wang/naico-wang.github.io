---
title: 深入理解JSX
date: 2024-10-29
category: React技术揭秘
---

# 深入理解JSX

JSX作为描述组件内容的数据结构，为 JS 赋予了更多视觉表现力。在React中我们大量使用他。在深入源码之前，有些疑问我们需要先解决：

- JSX和Fiber节点是同一个东西么？

- React Component、React Element是同一个东西么，他们和JSX有什么关系？

## JSX 简介

相信作为React的使用者，你已经接触过JSX。如果你还不了解他，可以看下[官网对其的描述](https://react.docschina.org/docs/introducing-jsx.html)。

JSX在编译时会被Babel编译为React.createElement方法。

这也是为什么在每个使用JSX的 JS 文件中，你必须显式的声明

```javascript
import React from "react";
```

否则在运行时该模块内就会报`未定义变量 React`的错误。

:::info 注意
在 React17 中，已经不需要显式导入 React 了。详见介绍[全新的 JSX 转换](https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
:::

JSX并不是只能被编译为React.createElement方法，你可以通过@babel/plugin-transform-react-jsx插件显式告诉Babel编译时需要将JSX编译为什么函数的调用（默认为React.createElement）。

比如在preact这个类React库中，JSX会被编译为一个名为h的函数调用。

```javascript
// 编译前
<p>KaSong</p>;
// 编译后
h("p", null, "KaSong");
```

## React.createElement

既然JSX会被编译为React.createElement，让我们看看他做了什么：

```javascript
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    // 将 config 处理后赋值给 props
    // ...省略
  }

  const childrenLength = arguments.length - 2;
  // 处理 children，会被赋值给props.children
  // ...省略

  // 处理 defaultProps
  // ...省略

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
}

const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // 标记这是个 React Element
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };

  return element;
};
```

我们可以看到，React.createElement最终会调用ReactElement方法返回一个包含组件数据的对象，该对象有个参数$$typeof: REACT_ELEMENT_TYPE标记了该对象是个React Element。

所以调用React.createElement返回的对象就是React Element么？

React提供了验证合法React Element的全局 API [React.isValidElement](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react/src/ReactElement.js#L547)，我们看下他的实现：

```javascript
export function isValidElement(object) {
  return (
    typeof object === "object" &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

可以看到，$$typeof === REACT_ELEMENT_TYPE的非null对象就是一个合法的React Element。换言之，在React中，所有JSX在运行时的返回结果（即React.createElement()的返回值）都是React Element。

那么JSX和React Component的关系呢?

## React Component

在React中，我们常使用ClassComponent与FunctionComponent构建组件。

```javascript
class AppClass extends React.Component {
  render() {
    return <p>KaSong</p>;
  }
}
console.log("这是ClassComponent：", AppClass);
console.log("这是Element：", <AppClass />);

function AppFunc() {
  return <p>KaSong</p>;
}
console.log("这是FunctionComponent：", AppFunc);
console.log("这是Element：", <AppFunc />);
```

我们可以从 Demo 控制台打印的对象看出，ClassComponent对应的Element的type字段为AppClass自身。

FunctionComponent对应的Element的type字段为AppFunc自身，如下所示：

```javascript
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {},
  ref: null,
  type: ƒ AppFunc(),
  _owner: null,
  _store: {validated: false},
  _self: null,
  _source: null
}
```

值得注意的一点，由于

```javascript
AppClass instanceof Function === true;
AppFunc instanceof Function === true;
```

所以无法通过引用类型区分ClassComponent和FunctionComponent。React通过ClassComponent实例原型上的isReactComponent变量判断是否是ClassComponent。

```javascript
ClassComponent.prototype.isReactComponent = {};
```

## JSX 与 Fiber 节点
从上面的内容我们可以发现，JSX是一种描述当前组件内容的数据结构，他不包含组件schedule、reconcile、render所需的相关信息。

比如如下信息就不包括在JSX中：

- 组件在更新中的优先级
- 组件的state
- 组件被打上的用于Renderer的标记

这些内容都包含在Fiber节点中。

所以，在组件mount时，Reconciler根据JSX描述的组件内容生成组件对应的Fiber节点。

在update时，Reconciler将JSX与Fiber节点保存的数据对比，生成组件对应的Fiber节点，并根据对比结果为Fiber节点打上标记。

## 参考资料

- [如何干掉知乎的全部 DIV -- 通过这篇文章在运行时修改React.createElement达到消除页面所有div元素的效果](https://mp.weixin.qq.com/s/ICjOlJL-fUGRb2S_xqBT7Q)
- [React 官网 Blog，关于 React Component, Element, Instance, Reconciliation 的简介](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
