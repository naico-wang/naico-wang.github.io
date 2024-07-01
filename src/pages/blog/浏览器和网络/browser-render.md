---
title: 浏览器的渲染原理
date: 2023-12-20
abstract: 浏览器的一些渲染原理，是一部分，不是全部。完整的原理请去google网站查看。
---

# 浏览器的渲染原理

## 浏览器工作大致流程

先上一张图：

![浏览器渲染大致流程](https://i.loli.net/2021/06/03/zEAmsLgQ3tXu89P.jpg)

从图中我们可以知道：

1. 浏览器会解析三个东西：
   1. 一个是 HTML/SVG/XHTML，事实上，webkit 有三个 C++ 的类对应这三类文档。解析这三种文件产生一个 DOM Tree。
   2. CSS，解析 CSS 会产生 CSS 规则树
   3. JavaScript，脚本，主要是通过 DOM API 和 CSSOM API 来操作 DOM Tree 和 CSS Rule Tree
2. 解析完成后，浏览器引擎会通过 DOM Tree 和 CSS Rule Tree 来构造 Rendering Tree，注意：
   1. Rendering Tree 渲染树并不等同于 DOM 树，因为一些像 Header 或 display:none 的东西就没必要放在渲染树上
   2. CSS 的 Rule Tree 主要是为了完成匹配并把 CSS Rule 附加上 Rendering Tree 上的每个 Element。也就是 DOM 节点，也就是所谓的 Frame。
   3. 然后，计算每个 Frame（也就是每个 Element）的位置，这又叫 layout 和 reflow（回流）过程
3. 最后通过调用由 GUI 渲染线程绘制页面

## DOM 解析

HTML 的 DOM Tree 解析如下：

```html
<html>
  <html>
    <head>
      <title>Web page parsing</title>
    </head>
    <body>
      <div>
        <h1>Web page parsing</h1>
        <p>This is an example Web page.</p>
      </div>
    </body>
  </html>
</html>
```

上面这段 HTML 会解析成这样：

![DOM-Tree-01](https://i.loli.net/2021/06/03/km1FEpcSAJOl9xf.jpg)

下面是另一个有 SVG 标签的情况：

![DOM-Tree-02](https://i.loli.net/2021/06/03/wxiaKertykuEYl3.jpg)

## CSS 解析

CSS 的解析大概是下面这个样子（下面是 Firefox 的玩法），假设我们有下面的 HTML 文档：

```html
<doc>
  <title>A few quotes</title>
  <para class="emph">
    Franklin said that
    <quote>"A penny saved is a penny earned."</quote>
  </para>
  <para>
    FDR said
    <quote>
      "We have nothing to fear but
      <span class="emph">fear itself.</span>
      "
    </quote>
  </para>
</doc>
```

于是 DOM Tree 是这个样子：

![DOM-Tree-Example](https://i.loli.net/2021/06/03/amq93DJLexcyjQM.jpg)

然后我们的 CSS 文档是这样的：

```css
/* rule 1 */
doc {
  display: block;
  text-indent: 1em;
}
/* rule 2 */
title {
  display: block;
  font-size: 3em;
}
/* rule 3 */
para {
  display: block;
}
/* rule 4 */
[class='emph'] {
  font-style: italic;
}
```

于是我们的 CSS Rule Tree 会是这个样子：

![CSS-Rule-Tree-Example](https://i.loli.net/2021/06/03/tA2lqIs41EUTaze.jpg)

途中的第四条规则出现了两次，一次是独立的，一次是在规则 3 的子节点。所以，我们可以知道，建立 CSS Rule Tree 是需要比照着 DOM Tree 来着。CSS 匹配 DOM Tree 主要是从右到左解析 CSS 的 Selector，好多人以为这个事会比较快，其实并不一定。关键还看我们的 CSS 的 Selector 怎么写了。

**注意：CSS 匹配 HTML 元素是一个相对复杂和有性能问题的事情。所以，你就会在 N 多地方看到很多人都告诉你，DOM 树要小，CSS 尽量用 id 和 class ，千万不要过度层叠下去......**

所以，Firefox 基本上来说是通过 CSS 解析生成 CSS Rule Tree，然后，通过对比 DOM 生成 Style Context Tree，然后 Firefox 通过把 Style Content Tree 和其 Render Tree（Frame Tree）关联上，就完成了。主要：Render Tree 会把一些不可见的节点去除掉。而 **Firefox 中所谓的 Frame 就是一个 DOM 节点，不要被其名字所迷惑了**

![Firefox-style-context-tree](https://i.loli.net/2021/06/03/tFjHvRyMh9JZ6lY.png)

注：Webkit 不像 Firefox 要用两个树来干这个，Webkit 也有 Style 对象，它直接把这个 Style 对象存在了相应的 DOM 结点上了

## 渲染

渲染的流程基本上如下（黄色的四个步骤）：

1. 计算 CSS 样式
2. 构建 Render Tree
3. Layout - 定位坐标和大小，是否换行，各种 position，overflow，z-index 属性...
4. 正式绘制

![Firefox-style-context-tree](https://i.loli.net/2021/06/03/oMqHztC1QaLw4U3.jpg)

注意：上图流程中有很多连接线，这表示了 JavaScript 动态修改了 DOM 属性或时 CSS 属性会导致重新 Layout，有些改变不会，就是那些指到天上的箭头，比如，修改后的 CSS rule 没有被匹配到等

这里重要说两个概念，一个是 Repaint ，另一个是 Reflow，这两个不是一回事

- Repaint——屏幕的一部分要重画，比如某个 CSS 的背景色变了。但是元素的集合尺寸没有变

- Reflow——意味着元件的几何尺寸变了，我们需要重新验证并计算 Render Tree。是 Render Tree 的一部分或全部发生了变化。这就是 Reflow，或是 Layout（HTML 使用的是 flow based layout，也就是流式布局，所以，如果某元件的几何尺寸发生了变化，需要重更新布局，也就叫 Reflow）。Reflow 会从`<html>` 这个 root frame 开始递归往下，一次计算所有的结点几何尺寸和位置，在 Reflow 过程中，可能会增加一些 frame，比如一个文本字符串必须被包装起来

总之，Reflow 的成本比 Repaint 的成本高得多。DOM Tree 里的每个节点都会有 Reflow 方法，一个节点的 Reflow 很有可能导致子节点，甚至父点以及同级节点的 Reflow

所以，以下动作很大可能会是成本比较高的：

  - 当你增加、删除、修改 DOM 节点时，会导致 Reflow 或 Repaint
  - 当你移动 DOM 的位置，或时搞个动画的时候
  - 当你修改 CSS 样式的时候
  - 当你 Resize 窗口的时候（移动端没有这个问题），或是滚动的时候
  - 当你修改网页的默认字体时

注：display:none 会触发 Reflow，而 visibility: hidden 只会触发 Repaint，因为没有发现位置变化

我们的浏览器时聪明的，它会把修改的操作积攒一批，然后做一次 Reflow，这叫做异步 Reflow 或增量异步 Reflow。但有些情况浏览器不会这样做，比如：resize 窗口、改变了页面某人的字体等。对于这些操作，浏览器会马上进行 Reflow

## 减少 Reflow（回流）/ Repaint（重绘）

下面时一些 Best Practices:

1. **不要一条一条地修改 DOM 的样式。与其这样，不如预先定义好 CSS 的 class，然后修改 DOM 的 className**

```javascript
// bad
var left = 10, top = 10;
el.style.left = left + 'px';
el.style.top = top + 'px';

// Good
el.className += 'theclassname';

// Good
el.style.cssText += ';left:' + left + 'px;top:' + top + 'px;';
```

2. **把 DOM "离线"后修改。如:**
  - 使用 documentFragment 对象在内存里操作 DOM
  - 先把 DOM 给 display：none（有一次 Reflow），然后你想怎么改就怎么改。比如修改 100 次，然后再把它显示出来
  - clone 一个 DOM 节点到内存里，然后想怎么改就怎么改，改完后，和在线的那个交换一下

3. **不要把 DOM 节点的属性值放在一个循环里当作循环的变量。** 不然这会导致大量地读写这个节点的属性

4. **尽可能地修改层级比较低的 DOM。** 当然，改变层级比较底的 DOM 也有可能造成大面积的 Reflow，但是也可能影响范围很小

5. **为动画的 HTML 元件使用 fixed 或 absolute 的 position**，那么修改它们的 CSS 是不会 Reflow 的

6. **千万不要使用 table 布局。** 因为可能很小的一个改动会造成整个 table 的重新布局

## 渲染进程中的线程

渲染进程就是我们常说的浏览器内核，负责页面渲染，脚本执行，事件处理等，每个 tab 页就是一个渲染进程

渲染进程中包括 GUI 渲染线程、 JS 引擎线程、事件触发线程、网络异步线程、定时器线程

渲染进程内部包含主线程、工作线程、合成线程和光栅线程

### GUI 渲染线程

- 负责渲染浏览器界面，解析 HTML、CSS，构建 DOM 树和 RenderObject 树，布局和绘制等
- 当界面需要重绘或由于某种操作引发回流时，该线程就会执行
- 注意，**GUI 渲染线程与 JS 引擎线程时互斥**，当 JS 引擎执行时 GUI 线程会被挂在，GUI 更新会被保存在一个队列中等待 JS 引擎空闲时立即被执行

### JS 引擎线程

- 也称为 JS 内核，负责处理 JavaScript 脚本程序（例如 V8 引擎）
- 负责处理解析和执行 JavaScript 脚本程序
- 只有一个 JS 引擎线程（单线程）
- **与 GUI 渲染线程互斥**，防止渲染结果不可预期

### 事件触发线程

- 用来控制事件循环（鼠标点击、setTimeout、Ajax 等）
- 当事件满足触发条件时，将事件放入到 JS 引擎所在的执行队列中
- 归属于浏览器而不是`JS`引擎，用来控制事件循环

### 定时触发器线程

- `setTimeout`和`setInterval`所在的线程
- 定时任务并不是由 JS 引擎计时的，是由定时触发线程来计时
- 计时完毕后，通知事件触发线程

### 异步 HTTP 请求线程

- 浏览器有一个单独的线程用于处理 AJAX 请求
- 当请求完成时，若有回调函数，通知事件触发线程

### 为什么 GUI 渲染线程与 JS 引擎线程互斥

这是由于 JS 是可以操作 DOM 的，如果同时修改元素属性并同时渲染界面（即 JS 线程 和 UI 线程同时运行），那么渲染线程前后获得的元素就可能不一致了

## JS阻塞页面加载以及 React Fiber 架构的出现

因为 GUI 渲染线程和 JS 引擎线程是互斥的，所以如果 JS 执行时间过长就会出现页面卡顿现象

比如 React15 采用的递归更新，当组件过大时，意味着JS引擎线程需要花很多时间去执行，这样导致 GUI 不能绘制页面，不能绘制页面就呈现卡顿现象

所以才有了后面的 React Fiber 架构，采用时间分片才解决大组件更新问题

## WebWorker

我们讲到 JS 引擎是单线程，当 JS 执行时间很长时，页面无法得到响应体检变差，那么解决方案是什么？

HTML5 提出了 Web Worker，浏览器提供给了一个子线程，让其可以与 JS 引擎相互通信

所以，当有比较耗时的工作，就可以单独开一个 Worker 线程，待计算出结果后，将结果通信给 JS 引擎线程即可（通过 postMessage API）

除了 WebWorker 外，还有 SharedWorker，两者的区别在于：

- WebWorker 只负责某个页面，它相当于是某个渲染进程（一个页面就是一个渲染进程）下的一个线程
- SharedWorker 是浏览器所有页面共享的（由单独的进程管理，与渲染进程一个级别）

## 总结

浏览器渲染三个步骤：解析、渲染、绘制

解析：HTML、CSS、JavaScript 被解析，HTML 被解析为 DOM 树，CSS 被解析成 CSS 规则树，JavaScript 通过 DOM API 和 CSSOM API 来操作 DOM Tree 和 CSS Rule Tree

渲染：浏览器引擎通过 DOM Tree 和 CSS Rule Tree 构建 Rendering Tree（渲染树），这其中进行大量的 Reflow 和 Repaint

绘制：最后调用操作系统的 Native GUI 的 API 绘制画面

## 参考资料

- [浏览器的渲染原理简介](https://coolshell.cn/articles/9666.html)
- [深入理解现代浏览器](https://mp.weixin.qq.com/s?__biz=Mzg5NDEyMzA2NQ==&mid=2247484400&idx=1&sn=9c7d4b7f346034fd06e2a587cb9c58cf&chksm=c0252ea6f752a7b06e0e6ba4346581fbe864ec769963ffa6cf4b0c7204f4afb0ddb44a76e6cd&mpshare=1&scene=1&srcid=1008vvgoRuGQgyy1MwuzlS8T&sharer_sharetime=1570506760100&sharer_shareid=778ad5bf3b27e0078eb105d7277263f6#rd)
- [万字详文：深入理解浏览器原理](https://zhuanlan.zhihu.com/p/96986818?tdsourcetag=s_pctim_aiomsg)
- [现代浏览器内部工作原理（附详细流程图）](https://mp.weixin.qq.com/s?__biz=MzA4ODUzNTE2Nw==&mid=2451046766&idx=1&sn=4d9177602ebd278bfa5c5bc959598b73&chksm=87c4187eb0b3916869bc64d39e7b3c6e59bb2c5fe2789d9a888be2cb6cda4c7cc4ff05d99e8b&mpshare=1&scene=1&srcid=&sharer_sharetime=1583904346478&sharer_shareid=778ad5bf3b27e0078eb105d7277263f6#rd)
- [前端都该懂的浏览器工作原理](https://segmentfault.com/a/1190000022633988)
- [浏览器渲染机制](https://segmentfault.com/a/1190000014018604)
- [「前端进阶」从多线程到 Event Loop 全面梳理](https://juejin.cn/post/6844903919789801486#heading-5)