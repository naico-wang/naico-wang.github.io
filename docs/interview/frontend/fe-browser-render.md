---
title: 浏览器的渲染过程
date: 2024-10-28
tags: [FrontEnd]
---

# 浏览器的渲染过程

## 什么是浏览器的渲染？

简单的说就是浏览器将 HTML 代码解析出来，把解析出来后的结果画到页面上，相当于就是，告诉浏览器，第一个像素点上应该呈现什么颜色，依次类推，占满整个页面静态，为什么说是静态的呢，因为当用户发生交互，页面变化（滚动、刷新、跳转等），使页面改变后，浏览器得重新计算整个页面的像素，可想而知，是一个庞大的工作量。

## 浏览器渲染过程：

浏览的渲染过程简单来说就是：解析、构建渲染树、布局、绘制、复合，的过程。

1. **解析数据包得到HTML文件， CSS文件，构建DOM树**： 字节数据 ==> 转换成字符串 ==> 得到（标记）Token ==> 转换成Node节点（通过对象描述代码） ==> 构建Dom树。

2. **解析CSS**： 将CSS文件转化为 CSSOM 树，描述页面中样式规则与它们是如何应用于各个元素。 
3. **构建渲染树**： DOM + CSSOM == render 树。（渲染树只会包含显示的节点） （例如 display：none 的不需要渲染） 
4. **布局**： 确定页面上每个元素位置和尺寸的过程，浏览器计算每个元素的位置，大小以及它的几何属性，修改页面样式可能触发重新布局（回流）。 
5. **绘制**： GPU绘制，将渲染树中元素绘制到屏幕，每个元素被绘制到一个层中，组合在一起形成最终画面，当页面中元素样式的改变并不影响它在文档流中的位置时，浏览器会将新样式赋予给元素并重新绘制它。（重绘）。

>（**以上五步为重点**）

6. **层叠与合成**： 将不同图层组合在一起，形成最终可见的页面，图层是元素一部分或整个元素，取决于浏览器如何优化渲染过程。
7. **交互**： 用户与页面交互时（点击或滚动页面），浏览器需要重新执行一些步骤，例如重新布局和绘制。

## 面试问点：

### 为什么操作DOM慢？

在浏览器渲染过程中，DOM操作是相对慢的，为什么？

因为 js 引擎线程和渲染线程互斥，所以，当我们通过js来操作DOM的时候，就势必会涉及到两个线程的通信和切换，所以会带来性能上的损耗。

### 回流与重绘
浏览器的渲染过程中给出了这样两个概念：回流和重绘。

- 回流：浏览器计算每个元素的位置，大小以及它的几何属性，修改页面样式可能触发重新布局。

- 重绘：当页面中元素样式发生改变，且不影响它在文档流中的位置时，浏览器会将新样式赋予给元素并重新绘制它。

**那么，什么情况下会触发回流？**

- 页面初次渲染
- 增加、删除可见的DOM元素
- 改变元素的几何信息
- 窗口大小改变

**而当非几何信息被修改时，会触发重绘。**

**并且回流必定触发重绘，重绘不一定回流。**

### 浏览器的优化

浏览器会维护一个渲染队列，当改变元素的几何属性导致回流发生时，回流行为会被加入到渲染队列中，在达到阈值或者达到一定时间之后会一次性将渲染队列中所有的回流生效。

因此，有这样一段JS代码：

```javascript
div.style.left = '10px';
div.style.top = '10px'; 
div.style.width = '10px';
div.style.height = '10px';
```

表面上看它们需要执行**四**次回流，但实际上**只有一次**。

但是如果在**原来的基础上添加这些代码**，回流又会重新变成**4**次，这又是为什么呢：

```javascript
div.style.left = '10px';
console.log(div.offsetLeft)

div.style.top = '10px'; 
console.log(div.offsetTop)

div.style.width = '10px';
console.log(div.offsetWidth)

div.style.height = '10px';
console.log(div.offsetHeight)
```

这就不得不提到我们接下来要讲的，`[offsetWidth]` 属性会**强制渲染队列刷新**。

### 强制渲染队列刷新

这12个属性都会强制渲染队列刷新

`offsetTop`， `offsetLeft`，`offsetWidth`， `offsetHeight`，

`clientTop`， `clientLeft`， `clientWidth`， `clientHeight`,

`socrollTop`， `scrollLeft`，`scrollWidth`， `scrollHeight`

### 字节面试题

那么接下来，我们来看一道字节面试题：

问现在有这样一段 JS 代码，问你会发生几次回流？

```javascript
let el = doucment.getElementById('app'); 
el.style.width = (el.offsetWidth + 1) + 'px';
el.style.width = 1 + 'px';
```

答案是一次，为什么呢？让我们来捋一捋。

首先按顺序执行，第一行代码不触发回流，第二行会被加入到渲染队列中，我知道这时候有人就要说了，第二行代码中的`el.offsetWidth`不是会强制渲染队列刷新吗，诚然，它确实会强制刷新渲染的回流队列，但在这行代码之前，渲染队列中并没有回流行为，所以即使渲染队列刷新了，也并没有导致回流。再于是第三行再被加入到渲染队列，总体回流一次。

但是如果像这样在强制渲染队列刷新前加上一行代码，渲染队列中存在回流行为，就会发生两次回流：

```javascript
let el = doucment.getElementById('app');
el.style.top = '10px'
el.style.width = (el.offsetWidth + 1) + 'px';
el.style.width = 1 + 'px';
```

### 回流重绘的优化

就像这样一段代码：

```html
<body>
<ul id="demo"></ul>
</body>

<script>
let ul = document.getElementById('demo');

for(let i = 0; i < 10000; i++){
  let li = document.createElement('li');
  let text = document.createTextNode(i);
  li.appendChild(text);
  ul.appendChild(li);
}
</script>
```

凭肉眼就可以看出，页面会发生很多次回流，那么，**用什么方法可以让回流次数降到只回流一次呢**？

很简单，以下提供四种方法。

#### 1. 让需要修改集合属性的容器先脱离文档流不显示，修改完再回到文档流中

首先在开头给ul添加上`none`属性后，ul的HTML结构就不在渲染树中，即使是循环一万次，也不会触发回流。

最后通过添加`ul.style.display = 'block'`，将ul显示出来：

```javascript
ul.style.display = 'none';    // 先隐藏

for(let i = 0; i < 10000; i++){
  let li = document.createElement('li');
  let text = document.createTextNode(i);
  li.appendChild(text);
  ul.appendChild(li);
}

ul.style.display = 'block';  // 再显示
```

这样就能达到只渲染一次的目的。

#### 2. 借助文档碎片
通过 let frg = document.createDocumentFragment() 创建一个文档碎片。它的作用是会创建一个虚拟的标签，在浏览器中不被当成真实的标签来使用。

因此，原代码被修改成这样：

```javascript
let frg = document.createDocumentFragment();

for(let i = 0; i < 10000; i++){
  let li = document.createElement('li');
  let text = document.createTextNode(i);
  li.appendChild(text);
  frg.appendChild(li);    // 往虚拟标签中添加li
}

ul.appendChild(frg);        // 最后`appendChild`到 ul 中
```

因此，每次循环都是在虚拟的标签 `frg` 中添加 `li`，最后再appendChild到 `ul` 中，这样也只会触发一次回流。

#### 3. 克隆体替换子节点

首先通过`let clone = ul.cloneNode(true)`克隆一份ul，于是循环中就可以往克隆体中添加ul，最后用克隆体替换原来的节点，这样也只会回流一次。

```javascript
let clone = ul.cloneNode(true);

for(let i = 0; i < 10000; i++){
  let li = document.createElement('li');
  let text = document.createTextNode(i);
  li.appendChild(text);
  clone.appendChild(li); // 往克隆体中添加ul
}

ul.parentNode.replaceChild(clone, ul); // 用克隆体替换原本节点
```

克隆体替换子节点算是比较常见的优化回流手段。

## 总结：

根据我的面试经验，看完这篇文章，往后面试官要是再问浏览器渲染过程的问题，我们就能给出面试官心里想要的满分答案。
