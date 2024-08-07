---
title: 10 种方案提升 React 应用的性能
date: 2023-08-09
abstract: 性能优化是每个前端开发者在构建任何软件，特别是Web应用时所关注的头等大事。诸如Vue、React、Angular 等 JS框架已经包含了一些很棒的配置和功能。在这里，我将回顾一些能帮助你优化 React 应用性能的特性和技巧。
---

# 10 种方案提升 React 应用的性能

## 前言

性能优化是每个前端开发者在构建任何软件，特别是Web应用时所关注的头等大事。诸如`Vue`、`React`、`Angular` 等 JS框架已经包含了一些很棒的配置和功能。在这里，我将回顾一些能帮助你优化 `React` 应用性能的特性和技巧。

无论你使用哪种具体的模式和方法来优化你的代码，始终努力重用组件 — 这对于编写优化的代码有保证。如果你花更多时间编写优秀的代码，而不是重写平庸的代码（后者容易出错） — 将会产生奇妙的效果。话不多说，让我们进入正题：如何提升 `React` 应用的性能。

## 1. useMemo()

这是一个 `React Hook`，用于在React中缓存CPU消耗大的函数。 让我们看一个例子：

```javascript
function App() {
  const [count, setCount] = useState(0);
  
  const expFunc = (count) => {
    waitSync(3000);
    return count * 90;
  }
  const resCount = expFunc(count);
  return (
    <>
      Count: {resCount}
      <input type="text" onChange={(e) => setCount(e.target.value)} placeholder="Set Count" />
    </>
  )
}
```

我们有一个耗时的函数`expFunc`，它需要3分钟来执行，接收一个输入count，等待3分钟后返回count的90倍。我们有一个变量`resCount`，它调用`expFunc`并传入来自`useState`钩子的count变量。我们有一个输入框，每当我们输入内容时就会设置count状态。

每当我们输入任何内容时，我们的App组件都会重新渲染，导致`expFunc`函数被调用。我们会看到如果我们持续输入，函数会被调用，导致巨大的性能瓶颈。对于每个输入，渲染会花费3分钟。如果我们输入3，`expFunc`将运行3分钟，如果我们再次输入3，它将再次花费3分钟。它不应该在第二次输入时再次运行，因为它与之前的输入相同，它应该存储结果并返回，而不运行函数（`expFunc`）。

在这里，我们将使用useMemo钩子来优化`expFunc`。useMemo的结构是：

```javascript
useMemo(() => func, [input_dependency])
```

`func`是我们想要缓存的函数，`input_dependency`是函数的输入数组，如果这些输入发生变化，`useMemo`将调用该函数。 现在，在我们的函数组件App中使用`useMemo`：

```javascript
function App() {
  const [count, setCount] = useState(0);
  
  const expFunc = (count) => {
    waitSync(3000);
    return count * 90;
  }
  const resCount = useMemo(() => {
    return expFunc(count);
  }, [count]);
  return (
    <>
      Count: {resCount}
      <input type="text" onChange={(e) => setCount(e.target.value)} placeholder="Set Count" />
    </>
  )
}
```

现在，这里`expFunc`的结果将被缓存起来，当相同的输入再次出现时，`useMemo`将跳过调用`expFunc`并返回缓存的输出。这将使App组件高度优化，`useMemo`缓存技术可以加速性能。此外，它还可以用于缓存函数组件的 props。

## 2.虚拟化长列表

如果你渲染大量的数据列表，建议你一次只渲染浏览器可见视口中的一小部分数据集，然后在列表滚动时渲染下一部分数据，这被称为“窗口化”。为此已经构建了一些非常棒的 React 库，比如 `react-window` 和`react-virtualized`。

## 3.React.PureComponent

就像 `shouldComponentUpdate` 对类组件所做的那样，`React.PureComponent `也是如此。 

`React.PureComponent` 是一个基础组件类，它通过检查 `state` 和 `props` 的字段来判断组件是否应该更新。 让我们将 `shouldComponentUpdate` 部分的示例转换一下：

```javascript
class ReactComponent extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: null
    }
    this.inputValue = null
  }
  handleClick = () => {
    this.setState({data: this.inputValue})
  }
  onChange = (evt) => {
    this.inputValue = evt.target.value
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.data === this.state.data)
      return false
    return true
  }
  render() {
    console.log("rendering App")
    return (
      <div>
        {this.state.data}
        <input onChange={this.onChange} />
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    )
  }
}
```

使用`React.PureComponent`：

```javascript
class ReactComponent extends React.PureComponent {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: null
    }
    this.inputValue = null
  }
  handleClick = () => {
    this.setState({data: this.inputValue})
  }
  onChange = (evt) => {
    this.inputValue = evt.target.value
  }
  render() {
    console.log("rendering App")
    return (
      <div>
        {this.state.data}
        <input onChange={this.onChange} />
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    )
  }
}
```

如你所见，我们删除了 `shouldComponentUpdate`，并让 `ReactComponent` 继承 `React.PureComponent`。

在文本框中输入 2，然后连续点击 Click Me 按钮，我们会看到 `ReactComponent` 将只重新渲染一次，以后就不会再渲染了。它浅层比较前一个 `props` 和 `state` 对象的字段与下一个 `props` 和 `state` 对象的字段。它不仅仅进行对象引用比较。`React.PureComponent` 通过减少不必要的渲染来优化我们的组件。

## 4.缓存函数

函数可以在 `React` 组件的 `JSX` 中调用，并在 `render` 方法中执行。

```javascript
function expensiveFunc(input) {
  ...
  return output;
}

class ReactCompo extends Component {
  render() {
    return (
      <div>
        {expensiveFunc}
      </div>
    );
  }
}
```

如果函数执行起来很耗时，那么它会挂起其余的重新渲染代码，从而影响用户的体验。

`expensiveFunc`在 `JSX` 中被渲染，每次重新渲染时都会调用这个函数，并将返回的值渲染到 `DOM` 上。由于这个函数是 `CPU` 密集型的，我们会看到每次重新渲染时都会调用它，而 `React` 必须等待它完成才能运行其余的重新渲染算法。

最好的做法是将函数的输入与输出进行缓存，这样当相同的输入再次出现时，函数的连续执行速度就会更快。

```javascript
function expensiveFunc(input) {
  ...
  return output;
}

const memoizedExpensiveFunc = memoize(expensiveFunc);

class ReactCompo extends Component {
  render() {
    return (
      <div>
        {memoizedExpensiveFunc}
      </div>
    );
  }
}
```

## 5.使用reselect

[https://github.com/reduxjs/reselect](https://github.com/reduxjs/reselect)

使用 `Reselect` 优化了我们的 `Redux` 状态管理。由于 `Redux` 遵循不可变性，这意味着每次 `action` 分发时都会创建新的对象引用。这会影响性能，因为即使对象引用改变但字段没有变化时，仍会触发组件的重新渲染。

`Reselect` 库封装了 `Redux` 状态，检查状态的字段，并在字段没有变化时通知 `React` 是否需要渲染。

`因此，Reselect` 通过浅层遍历前后 `Redux` 状态字段来检查它们是否发生变化，从而节省了宝贵的时间。尽管拥有不同的内存引用，如果字段没有变化，它会取消重新渲染。如果字段发生了变化，它会通知 `React` 重新渲染。

## 6.Web Worker

JavaScript在同一线程上运行长时间的进程将严重影响UI渲染代码，因此最好的做法是将进程移到另一个线程。这可以通过 `Web Worker` 来实现。`Web Worker `是我们创建一个线程并与主线程并行运行而不影响UI流的途径。

我们可以在 React中使用 `Web Worker`，尽管没有官方支持，但有一些方法可以将 `Web Worker` 添加到React应用中。来看一个例子：

```javascript
// webWorker.js
const worker = (self) => {
  function generateBigArray() {
    let arr = []
    arr.length = 1000000
    for (let i = 0; i < arr.length; i++)
      arr[i] = i
    return arr
  }
  function sum(arr) {
    return arr.reduce((e, prev) => e + prev, 0)
  }
  function factorial(num) {
    if (num == 1)
      return 1
    return num * factorial(num - 1)
  }
  self.addEventListener("message", (evt) => {
    const num = evt.data
    const arr = generateBigArray()
    postMessage(sum(arr))
  })
}
export default worker

// App.js
import worker from "./webWorker"
import React, { Component } from 'react';
import './index.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      result: null
    }
  }
  calc = () => {
    this.webWorker.postMessage(null)
  }
  componentDidMount() {
    let code = worker.toString()
    code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))
    const bb = new Blob([code], { type: "application/javascript" });
    this.webWorker = new Worker(URL.createObjectURL(bb))
    this.webWorker.addEventListener("message", (evt) => {
      const data = evt.data
      this.setState({ result: data })
    })
  }
  render() {
    return ( 
      <div>
        <button onClick={this.calc}>Sum</button>
        <h3>Result: {this.state.result}</h3>
      </div>
    )
  }
}
```

这个应用计算一个包含 100 万个元素的数组的总和。如果我们在主线程中完成这个操作，主线程会被挂起，直到100 万个元素被遍历并计算出总和。

现在，我们将其移到了 `Web Worker`，主线程将与 `Web Worker` 线程并行运行，而 100 万个元素数组的总和将被计算。当计算完成后结果会被传递回来，主线程只需渲染结果。简单、快速且性能高。

## 7.懒加载

懒加载已经成为一种广泛使用的优化技术，可以加速加载时间。懒加载可以将一些 Web 应用的性能问题风险降到最低。 在 React 中，使用 `React.lazy()` API 来懒加载路由组件。

`React.lazy` 使创建组件并使用动态导入进行渲染变得容易。`React.lazy` 接收一个函数作为参数：

```javascript
React.lazy(() => {})
// 或者
function cb() {}
React.lazy(cb)
```

这个回调函数必须使用动态导入 `import()` 语法加载组件文件：

```javascript
// MyComponent.js
class MyComponent extends Component {
  render() {
    return <div>MyComponent</div>
  }
}
const MyComponent = React.lazy(() => import('./MyComponent.js'))
function AppComponent() {
  return <div><MyComponent /></div>
}
// 或者
function cb() {
  return import('./MyComponent.js')
}
const MyComponent = React.lazy(cb)
function AppComponent() {
  return <div><MyComponent /></div>
}
```

`React.lazy` 的回调函数通过 `import()` 调用返回一个 `Promise`。

当Webpack遍历我们的代码进行编译和打包时，它在遇到 `React.lazy()` 和 `import()` 时会创建一个单独的包。我们的应用将变成这样：

```html
/** react-app
 **  dist/
 **   - index.html
 **   - main.b1234.js (包含AppComponent和引导代码)
 **   - mycomponent.bc4567.js (包含MyComponent)
**/
/** index.html **/
<head>
  <div id="root"></div>
  <script src="main.b1234.js"></script>
</head>
```

现在，我们的应用被分成了多个包。当 `AppComponent` 被渲染时，`mycomponent.bc4567.js` 文件被加载，包含的 `MyComponent` 被显示在 `DOM` 上。

## 8.React.memo()

与 `useMemo` 和 `React.PureComponent` 类似，`React.memo()` 用于缓存函数组件。

```javascript
function My(props) {
  return (
    <div>
      {props.data}
    </div>
  )
}
function App() {
  const [state, setState] = useState(0)
  return (
    <>
      <button onClick={()=> setState(0)}>Click</button>
      <My data={state} />
    </>
  )
}
```

App 组件通过 `data` 属性将 `state` 传递给 `My` 组件。现在，看看这个按钮，当按下时将 `state` 设置为 `0。如果连续按下按钮，state` 始终保持不变，但 `My` 组件仍会重新渲染，尽管传递给其属性的 `state` 没有变化。如果 `App` 和`My` 组件下有成千上万个组件，这将是一个巨大的性能瓶颈。

为了解决这个问题，我们将使用 `React.memo` 包裹 `My` 组件，它将返回 `My` 的一个缓存版本，并在 App 中使用。

```javascript
function My(props) {
  return (
    <div>
      {props.data}
    </div>
  )
}
const MemoedMy = React.memo(My)
function App() {
  const [state, setState] = useState(0)
  return (
    <>
      <button onClick={()=> setState(0)}>Click</button>
      <MemoedMy data={state} />
    </>
  )
}
```

通过这种方式，连续按下 `Click` 按钮只会触发 `My` 的重新渲染一次。因为 `React.memo` 会缓存其属性，并在相同的输入情况下返回缓存的输出，而不会执行 `My` 组件。

`React.PureComponent` 对于类组件的作用，就像 `React.memo` 对于函数组件的作用。

## 9.useCallback()

`useCallback` 与 `useMemo` 作用类似，但不同的是它用于缓存函数声明。 假设我们有以下代码：

```javascript
function TestComp(props) {
  console.log('rendering TestComp')
  return (
    <>
      TestComp
      <button onClick={props.func}>Set Count in 'TestComp'</button>
    </>
  )
}
TestComp = React.memo(TestComp)
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={()=> setCount(count + 1)}>Set Count</button>
      <TestComp func={()=> setCount(count + 1)} />
    </>
  )
}
```

我们有一个使用 `useState` 维护 `count` 状态的 App 组件，每次调用 `setCount` 函数时，App 组件都会重新渲染。它渲染了一个按钮和 TestComp 组件，如果我们点击 `Set Count` 按钮，App 组件及其子树将重新渲染。现在，TestComp 使用 memo 缓存以避免不必要的重新渲染。

`React.memo` 通过比较当前/下一个属性与前一个属性来缓存组件，如果它们相同，则不重新渲染组件。`TestComp` 接收一个函数作为 func 属性，当 App 重新渲染时，TestComp 的 func 属性会被检查是否相同，如果相同则不会重新渲染。

问题在于 `TestComp` 接收到一个新的函数实例。为什么？看看 `JSX`：

```javascript
...
  return (
    <>
      ...
      <TestComp func={()=> setCount(count + 1)} />
    </>
  )
...
```

传递了一个箭头函数声明，因此每次 `App` 渲染时都会创建一个新的函数声明，**具有新的引用（内存地址指针）**。因此，`React.memo` 的浅比较会记录一个差异，并允许重新渲染。

那么，如何解决这个问题？我们是否应该将函数移动到函数作用域之外，这样做是好的，但它不会引用 `setCount`函数。这时 `useCallback` 出现了，我们将函数属性传递给 `useCallback` 并指定依赖项，`useCallback` 钩子返回函数属性的缓存版本，这就是我们传递给 `TestComp` 的内容。

```javascript
function App() {
  const check = 90
  const [count, setCount] = useState(0)
  const clickHndlr = useCallback(()=> { setCount(check) }, [check]);
  return (
    <>
      <button onClick={()=> setCount(count + 1)}>Set Count</button>
      <TestComp func={clickHndlr} />
    </>
  )
}
```

在这里，`clickHndlr` 不会在每次 App 组件重新渲染时重新创建，除非其依赖项 check 发生变化。因此，当我们重复点击 Set Count 按钮时，TestComp 不会重新渲染。useCallback 将检查 check 变量，如果与之前的值不相同，它将返回传递的函数，因此 TestComp 和 React.memo 会看到一个新的引用并重新渲染 TestComp，如果相同，useCallback 不会返回任何内容，因此 React.memo 会看到一个与之前值相同的函数引用，并取消TestComp 的重新渲染。

## 10.shouldComponentUpdate()

一个 React 应用程序由组件组成，从通常在 App.js 中的根组件（通常是 App）到不断扩展的分支。

```javascript
class ReactComponent extends Component {
  render() {
    return (
      <div></div>
    )
  }
}
```

这是一个基本的 React 组件。 这些组件树使其具有父子关系，即当组件中的绑定数据更新时，该组件及其子组件会重新渲染，以使更改在整个子组件树中传播。当组件需要重新渲染时，React 会将其之前的数据（props 和 context）与当前的数据（props 和 context）进行比较，如果它们相同，则不会重新渲染，但如果存在差异，则该组件及其子组件会重新渲染。

React 通过使用严格相等运算符 === 按对象引用来比较差异，因为 props 和 context 是对象。所以 React 使用引用来判断之前的 props 和 state 是否已从当前的 props 和 state 发生变化。

```javascript
class ReactComponent extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: null
    }
    this.inputValue = null
  }

  handleClick = () => {
    this.setState({ data: this.inputValue })
  }

  onChange = (evt) => {
    this.inputValue = evt.target.value
  }

  render() {
    console.log("rendering App")
    return (
      <div>
        {this.state.data}
        <input onChange={this.onChange} />
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    )
  }
}
```

看看上面的组件。它在 state 对象中有 data。如果我们在输入框中输入一个值并按下 Click Me 按钮，输入框中的值将被渲染。我特意在 render 方法中添加了 `console.log("rendering App")`，以便我们知道何时 ReactComponent 渲染。

现在，如果我们输入 2 并点击按钮，组件将被渲染，这是应该的，因为之前的 state 是这样的：

```javascript
state = { data: null }
```

而下一个 state 对象是这样的：

```javascript
state = { data: 2 }
```

因为 setState 每次调用时都会创建新的 state 对象，所以严格相等运算符会看到不同的内存引用并触发组件的重新渲染。

如果我们再次点击按钮，我们将有另一次重新渲染，这不应该发生，因为之前的 state 对象和下一个 state 对象将具有相同的 data 值，但由于 setState 创建了新的 state 对象，React 将看到不同的 state 对象引用并触发重新渲染，尽管它们的内部值相同。

现在，如果组件树增长到成千上万个组件，这种重新渲染可能会非常昂贵。

为此，React 为我们提供了一种控制组件重新渲染的方法，而不是通过 React 的内部逻辑，这就是 shouldComponentUpdate 方法。该 shouldComponentUpdate 方法在组件重新渲染时调用，如果它返回 true，则组件重新渲染，如果返回 false，则取消重新渲染。

我们将 shouldComponentUpdate 添加到 ReactComponent。该方法接受下一个 state 对象和下一个 props 对象作为参数，因此我们可以使用它来实现我们的检查，以告诉 React 何时需要重新渲染。

```javascript
class ReactComponent extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: null
    }
    this.inputValue = null
  }

  handleClick = () => {
    this.setState({ data: this.inputValue })
  }

  onChange = (evt) => {
    this.inputValue = evt.target.value
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.data === this.state.data)
      return false
    return true
  }

  render() {
    console.log("rendering App")
    return (
      <div>
        {this.state.data}
        <input onChange={this.onChange} />
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    )
  }
}
```

看到，在 shouldComponentUpdate 中，我检查了 next state 对象 nextState 和当前 state 对象中的 data 值。如果它们不相等，它返回 true，这将触发重新渲染，如果它们相等，它返回 false，这将取消重新渲染。 再次运行应用程序，输入 2 并连续点击 Click Me 按钮，您会看到渲染只发生一次，不再发生 :) 看到，我们使用 shouldComponentUpdate 方法设置何时重新渲染我们的组件，有效地提高了组件的性能。

## 各种方案对比总结

### useMemo()

**优点:**

  - 避免不必要的复杂计算。

  - 可以缓存计算结果。

**缺点:**

  - 需要手动管理依赖数组，可能导致依赖错误。

  - 小心过度使用，可能导致性能问题。

**使用场景:**

  - 复杂计算。

  - 不经常变化的值。

### 虚拟化长列表

**优点:**

  - 提高渲染性能，减少DOM元素数量。

  - 优化大数据集的显示。
**缺点:**

  - 需要额外的库（如react-window或react-virtualized）。

  - 实现复杂度增加。

**使用场景:**

  - 长列表或大数据集。

  - 滚动性能需要优化。

### React.PureComponent

**优点:**

  - 自动进行浅比较，减少不必要的渲染。
  
  - 易于使用。

**缺点:**

  - 只能进行浅比较，对于嵌套对象无效。

  - 可能需要进行更多手动优化。

**使用场景:**

  - 组件的props和state是简单且不变的对象。

  - 性能优化需求。

### 缓存函数

**优点:**

  - 避免重复计算，提高性能。
  - 减少重复渲染。

**缺点:**

  - 需要手动管理缓存逻辑。

  - 可能导致内存占用增加。

**使用场景:**

  - 重复计算的函数。

  - 高性能要求的场景。

### 使用 reselect

**优点:**

  - 可组合的 selector，提高代码复用性。

  - 只有在依赖发生变化时重新计算，提高性能。

**缺点:**

  - 需要学习和理解 reselect 库。

  - 复杂应用中管理 selector 的逻辑可能变复杂。

**使用场景:**

  - 需要从 Redux 状态中计算派生数据。

  - 复杂的 Redux 状态结构。

### Web Worker

**优点:**

  - 在后台线程执行任务，避免阻塞主线程。

  - 提高应用的响应速度。

**缺点:**

  - 需要管理线程间的通信。

  - 增加代码复杂度。

**使用场景:**

  - 需要进行大量计算或长时间运行的任务。

  - 需要保持 UI 响应。

### 懒加载

**优点:**

  - 减少初始加载时间。

  - 只有在需要时才加载组件，提高性能。

**缺点:**

  - 需要管理加载状态。

  - 可能增加初次加载时的延迟。

**使用场景:**

  - 大型应用或需要分片加载的模块。

  - 优化初始加载性能。

### React.memo()

**优点:**

  - 类似React.PureComponent，可以对函数组件进行优化。

  - 自动进行浅比较。

**缺点:**

  - 只能进行浅比较，对于嵌套对象无效。

  - 可能需要进行更多手动优化。

**使用场景:**

  - 函数组件的props和state是简单且不变的对象。

  - 性能优化需求。

### useCallback()

**优点:**

  - 缓存函数引用，避免不必要的渲染。

  - 尤其对依赖函数的useEffect和子组件传递函数时有效。

**缺点:**

  - 需要手动管理依赖数组，可能导致依赖错误。

  - 小心过度使用，可能导致性能问题。

**使用场景:**

  - 需要传递给子组件的函数。

  - 依赖函数的useEffect。

### shouldComponentUpdate()

**优点:**

  - 可以进行自定义的更新控制逻辑。

  - 对复杂组件进行优化。

**缺点:**

  - 需要手动编写逻辑，可能复杂。

  - 容易出错导致渲染问题。

**使用场景:**

  - 需要对更新逻辑进行精细控制的类组件。

  - 性能瓶颈需要优化的复杂组件。

## 结语
通过采用这些优化策略，如使用虚拟化长列表以提高渲染效率、利用 `PureComponent` 和 `memo` 缓存组件以及将计算密集任务转移到 `Web Worker` 中执行，不仅可以有效减少不必要的重新渲染和计算，还能极大提升应用的响应速度和用户体验。这些方法不仅仅是提高性能的技术手段，更是优化开发过程中不可或缺的一部分，为用户提供顺畅、高效的使用体验。