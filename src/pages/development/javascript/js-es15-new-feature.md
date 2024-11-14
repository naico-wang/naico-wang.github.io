---
title: ES15(2024) 中5个新JavaScript特性
date: 2024-08-06
category: JavaScript/TypeScript
---

# ES15(2024) 中5个令人惊叹的新JavaScript特性

2024年：又是一个带来全新JS特性升级的不可思议的年份，ES15推出。

从复杂的**异步特性**到**语法糖数组**和**现代正则表达式**，JavaScript 编码现在比以往任何时候都更简单、更快捷。

## 原生数组分组终于到来

`Object.groupBy()`

```javascript
const fruits = [
  { name: 'pineapple🍍', color: '🟡' },
  { name: 'apple🍎', color: '🔴' },
  { name: 'banana🍌', color: '🟡' },
  { name: 'strawberry🍓', color: '🔴' },
];

const groupedByColor = Object.groupBy(
  fruits,
  (fruit, index) => fruit.color
);

// 原生 group by 示例
console.log(groupedByColor);
```

字面意思就是让恐龙级的 `Lodash` 库失去了最后的存在理由 - 再也不需要了！

我原本期待一个新的实例方法，比如`Array.prototype.groupBy`，但不知什么原因他们把它做成了静态方法。

然后我们还有`Map.groupBy`来用对象键进行分组：

```javascript
const array = [1, 2, 3, 4, 5];
const odd = { odd: true };
const even = { even: true };

Map.groupBy(array, (num, index) => {
  return num % 2 === 0 ? even : odd;
});

// => Map { {odd: true}: [1, 3, 5], {even: true}: [2, 4] }
```
不过几乎没人会这样对数组分组,所以可能不会那么受欢迎。

## 从外部解决promise - 现代方式

`Promise.withResolvers()`

从外部解决promises是很普遍的需求，在此之前我们不得不使用 `Deferred` 类来实现:

```javascript
class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const deferred = new Deferred();

deferred.resolve();
```

或者从NPM安装 - 又多了一个依赖!

```shell
npm install deferred
```

但现在有了ES15的 `Promise.withResolvers()`:

```javascript
const { promise, resolve, reject } = Promise.withResolvers();
```

看看我如何用它来快速地将事件流promise化 - `await` 一个observable:

```javascript
// data-fetcher.js
const { promise, resolve, reject } = Promise.withResolvers();

function startListening() {
    eventStream.on('data', (data) => {
        resolve(data);
    });
}

async function getData() {
    return await promise;
}

// client.js
const { startListening, getData } = require('./data-fetcher.js');
startListening();

// ✅ 监听单个流事件
const data = await getData();
```

## Buffer性能升级

Buffer是用来存储应用程序生成的临时数据的小型数据存储。

它们使得在管道的各个阶段之间传输和处理数据变得非常容易。

像这样的管道:

- 文件处理: 输入文件 → buffer → 处理 → 新buffer → 输出文件
- 视频流: 网络响应 → buffer → 显示视频帧
- 餐厅队列: 接待顾客 → 队列/buffer → 服务顾客

```javascript
const fs = require('fs');
const { Transform } = require('stream');

const inputFile = 'input.txt';
const outputFile = 'output.txt';

const inputStream = fs.createReadStream(inputFile, 'utf-8');

const transformStream = new Transform({
    transform(chunk) {
        // ✅ 从缓冲区转换块
    },
});

const outputStream = fs.createWriteStream(outputFile);

// ✅ 开始管道
inputStream.pipe(transformStream).pipe(outputStream);
```

使用 buffers,每个阶段可以以不同的速度独立处理数据。

但是当通过管道移动的数据超过buffer容量时会发生什么?

以前我们必须将当前所有数据的buffer复制到一个更大的buffer中。

这对性能来说很糟糕,尤其是当管道中将有大量数据时。

ES15为我们提供了解决这个问题的方案:可调整大小的数组buffers。

```javascript
const resizableBuffer = new ArrayBuffer(1024, {
    maxByteLength: 1024 ** 2,
});

// ✅ 调整大小到 2048 字节
resizableBuffer.resize(1024 * 2);
```

## 异步升级

`Atomics.waitAsync()`

ES2024中另一个强大的异步编码特性:

它是当2个代理共享一个buffer时...

- 代理1"睡眠"并等待代理2完成任务。

- 当代理2完成时,它使用共享buffer作为通道进行通知。

```javascript
const sharedBuffer = new SharedArrayBuffer(4096);

const bufferLocation = new Int32Array(sharedBuffer);

// 初始化缓冲区位置的初始值
bufferLocation[37] = 0x1330;

async function doStuff() {
    // ✅ agent 1：在共享缓冲区位置等待直到通知
    Atomics.waitAsync(bufferLocation, 37, 0x1330).then(
        (r) => { /* 处理到达 */ }
    );
}

function asyncTask() {
    // ✅ agent 2：在共享缓冲区位置通知
    const bufferLocation = new Int32Array(sharedBuffer);
    Atomics.notify(bufferLocation, 37);
}
```

如果你认为这类似于普通的 `async/await` ,你绝对是对的。

但最大的区别是:

- 这2个代理可以存在于完全不同的代码上下文中 - 它们只需要访问相同的buffer。

- 多个代理可以在不同时间访问或等待共享buffer - 其中任何一个都可以通知"唤醒"所有其他代理。

这就像P2P网络, 而 `async/await` 更像是客户端-服务器请求-响应模式。

```javascript
const sharedBuffer = new SharedArrayBuffer(4096);

const bufferLocation = new Int32Array(sharedBuffer);

bufferLocation[37] = 0x1330;

// ✅ 从 postMessage() 接收到的共享缓冲区

const code = `
var ia = null;
onmessage = function (ev) {
    if (!ia) {
        postMessage("Aux worker is running");
        ia = new Int32Array(ev.data);
    }
    postMessage("Aux worker is sleeping for a little bit");
    setTimeout(function () { postMessage("Aux worker is waking"); Atomics.notify(ia, 37); }, 1000);
};`;

async function doStuff() {
    // ✅ agent 1：存在于 Worker 上下文中
    const worker = new Worker(
        'data:application/javascript,' + encodeURIComponent(code)
    );
    worker.onmessage = (event) => {
        // 记录事件
    };
    worker.postMessage(sharedBuffer);
    Atomics.waitAsync(bufferLocation, 37, 0x1330).then(
        (r) => { /* 处理到达 */ }
    );
}

function asyncTask() {
    // ✅ agent 2：在共享缓冲区位置通知
    const bufferLocation = new Int32Array(sharedBuffer);
    Atomics.notify(bufferLocation, 37);
}
```

## 正则表达式v标志和集合操作

这是一个全新的特性,使正则表达式更加清晰和直观。

使用表达式模式查找和操作复杂字符串 - 在集合操作的帮助下:

```javascript
// A 和 B 是字符类，如 [a-z]

// 差异：匹配 A 但不匹配 B
[A--B]

// 交集：同时匹配 A 和 B
[A&&B]

// 嵌套字符类
[A--[0-9]]
```

匹配不断增加的Unicode字符集,如:

- 表情符号: 😀, ❤️, 👍, 🎉, 等

- 重音字母: é, à, ö, ñ, 等

- 符号和非拉丁字符: ©, ®, €, £, µ, ¥, 等

所以这里我们使用`Unicode正则表达式`和`v标志`来匹配所有希腊字母:

```javascript
const regex = /[\p{Script_Extensions=Greek}&&\p{Letter}]/v;
```

## 总结

总的来说,ES15对JavaScript来说是一个重大飞跃,包含了几个对现代开发至关重要的特性。帮助你以更简洁、更富表现力、更清晰的方式编写更干净的代码。

