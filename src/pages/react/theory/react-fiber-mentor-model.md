---
title: Fiber架构的心智模型
date: 2024-10-29
category: React技术揭秘
---

# Fiber架构的心智模型

React核心团队成员[Sebastian Markbåge](https://github.com/sebmarkbage/)（`React Hooks`的发明者）曾说：我们在`React`中做的就是践行**代数效应**（Algebraic Effects）。

那么，**代数效应**是什么呢？他和`React`有什么关系呢。

## 什么是代数效应

`代数效应`是`函数式编程`中的一个概念，用于将`副作用`从`函数调用`中分离。

接下来我们用**虚构的语法**来解释。

假设我们有一个函数`getTotalPicNum`，传入2个`用户名称`后，分别查找该用户在平台保存的图片数量，最后将图片数量相加后返回。

```javascript
function getTotalPicNum(user1, user2) {
  const picNum1 = getPicNum(user1);
  const picNum2 = getPicNum(user2);

  return picNum1 + picNum2;
}
```

在`getTotalPicNum`中，我们不关注`getPicNum`的实现，只在乎“**获取到两个数字后将他们相加的结果返回**”这一过程。

接下来我们来实现`getPicNum`。

"**用户在平台保存的图片数量**"是保存在服务器中的。所以，为了获取该值，我们需要发起异步请求。

为了尽量保持`getTotalPicNum`的调用方式不变，我们首先想到了使用`async await`：

```javascript
async function getTotalPicNum(user1, user2) {
  const picNum1 = await getPicNum(user1);
  const picNum2 = await getPicNum(user2);

  return picNum1 + picNum2;
}
```

但是，`async await`是有`传染性`的 —— 当一个函数变为async后，这意味着调用他的函数也需要是async，这破坏了`getTotalPicNum`的同步特性。

有没有什么办法能保持`getTotalPicNum`保持现有调用方式不变的情况下实现异步请求呢？

没有。不过我们可以虚构一个。

我们虚构一个类似`try...catch`的语法 —— `try...handle`与两个操作符`perform`、`resume`。

```javascript
function getPicNum(name) {
  const picNum = perform name;
  return picNum;
}

try {
  getTotalPicNum('kaSong', 'xiaoMing');
} handle (who) {
  switch (who) {
    case 'kaSong':
      resume with 230;
    case 'xiaoMing':
      resume with 122;
    default:
      resume with 0;
  }
}
```

当执行到`getTotalPicNum`内部的`getPicNum`方法时，会执行`perform name`。

此时函数调用栈会从`getPicNum`方法内跳出，被最近一个`try...handle`捕获。类似`throw Error`后被最近一个`try...catch`捕获。

类似`throw Error`后`Error`会作为`catch`的参数，`perform name`后name会作为handle的参数。

与try...catch最大的不同在于：当Error被catch捕获后，之前的调用栈就销毁了。而handle执行resume后会回到之前perform的调用栈。

对于`case 'kaSong'`，执行完`resume with 230`;后调用栈会回到`getPicNum`，此时`picNum === 230`

:::danger 注意
再次申明，**try...handle**的语法是**虚构**的，只是为了演示代数效应的思想。
:::

总结一下：**代数效应能够将副作用（例子中为请求图片数量）从函数逻辑中分离，使函数关注点保持纯粹**。

并且，从例子中可以看出，perform resume不需要区分同步异步。

## 代数效应在React中的应用

那么代数效应与React有什么关系呢？最明显的例子就是Hooks。

对于类似`useState`、`useReducer`、`useRef`这样的Hook，我们不需要关注`FunctionComponent`的state在Hook中是如何保存的，React会为我们处理。

我们只需要假设useState返回的是我们想要的state，并编写业务逻辑就行。

```javascript
function App() {
  const [num, updateNum] = useState(0);
  
  return (
    <button onClick={() => updateNum(num => num + 1)}>{num}</button>  
  )
}
```

如果这个例子还不够明显，可以看看官方的[Suspense Demo](https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/index.js:152-160)

在Demo中ProfileDetails用于展示用户名称。而用户名称是异步请求的。

但是Demo中完全是同步的写法。

```javascript
function ProfileDetails() {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

## 代数效应与Generator

从React15到React16，协调器（Reconciler）重构的一大目的是：将老的同步更新的架构变为异步可中断更新。

**异步可中断更新**可以理解为：更新在执行过程中可能会被打断（浏览器时间分片用尽或有更高优任务插队），当可以继续执行时恢复之前执行的中间状态。

这就是代数效应中try...handle的作用。

其实，浏览器原生就支持类似的实现，这就是Generator。

但是Generator的一些缺陷使React团队放弃了他：

- 类似async，Generator也是传染性的，使用了Generator则上下文的其他函数也需要作出改变。这样心智负担比较重。

- Generator执行的中间状态是上下文关联的。

考虑如下例子：

```javascript
function* doWork(A, B, C) {
  var x = doExpensiveWorkA(A);
  yield;
  var y = x + doExpensiveWorkB(B);
  yield;
  var z = y + doExpensiveWorkC(C);
  return z;
}
```

每当浏览器有空闲时间都会依次执行其中一个doExpensiveWork，当时间用尽则会中断，当再次恢复时会从中断位置继续执行。

只考虑“单一优先级任务的中断与继续”情况下Generator可以很好的实现异步可中断更新。

但是当我们考虑“高优先级任务插队”的情况，如果此时已经完成doExpensiveWorkA与doExpensiveWorkB计算出x与y。

此时B组件接收到一个高优更新，由于Generator执行的中间状态是上下文关联的，所以计算y时无法复用之前已经计算出的x，需要重新计算。

如果通过全局变量保存之前执行的中间状态，又会引入新的复杂度。

> 更详细的解释可以参考这个issue: https://github.com/facebook/react/issues/7942#issuecomment-254987818

基于这些原因，React没有采用Generator实现协调器。

## 代数效应与Fiber

Fiber并不是计算机术语中的新名词，他的中文翻译叫做纤程，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。

在很多文章中将纤程理解为协程的一种实现。在JS中，协程的实现便是Generator。

所以，我们可以将纤程(Fiber)、协程(Generator)理解为代数效应思想在JS中的体现。

React Fiber可以理解为：

React内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。

其中每个任务更新单元为React Element对应的Fiber节点。

下一节，我们具体讲解Fiber架构的实现。
