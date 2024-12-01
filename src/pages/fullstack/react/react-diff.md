---
title: React Diff 算法详解
date: 2024-10-29
category: React技术揭秘
---

# React Diff 算法详解

在beginWork一节我们提到, **对于update的组件，他会将当前组件与该组件在上次更新时对应的Fiber节点比较（也就是俗称的Diff算法），将比较的结果生成新Fiber节点。**

这一章我们讲解Diff算法的实现。

> 你可以从[这里](https://zh-hans.reactjs.org/docs/reconciliation.html#the-diffing-algorithm)看到Diff算法的介绍。

:::danger 注意
为了防止概念混淆，这里再强调下

一个DOM节点在某一时刻最多会有4个节点和他相关。

1. current Fiber。如果该DOM节点已在页面中，current Fiber代表该DOM节点对应的Fiber节点。 
2. workInProgress Fiber。如果该DOM节点将在本次更新中渲染到页面中，workInProgress Fiber代表该DOM节点对应的Fiber节点。 
3. DOM节点本身。 
4. JSX对象。即ClassComponent的render方法的返回结果，或FunctionComponent的调用结果。JSX对象中包含描述DOM节点的信息。

Diff算法的本质是对比1和4，生成2。
:::

## Diff的瓶颈以及React如何应对

由于Diff操作本身也会带来性能损耗，React文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的复杂程度为 O(n 3 )，其中n是树中元素的数量。

如果在React中使用了该算法，那么展示1000个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。

为了降低算法复杂度，React的diff会预设三个限制：

1. 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React不会尝试复用他。 
2. 两个不同类型的元素会产生出不同的树。如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点。 
3. 开发者可以通过 key prop来暗示哪些子元素在不同的渲染下能保持稳定。考虑如下例子：

```javascript
// 更新前
<div>
  <p key="ka">ka</p>
  <h3 key="song">song</h3>
</div>

// 更新后
<div>
  <h3 key="song">song</h3>
  <p key="ka">ka</p>
</div>
```

如果没有key，React会认为div的第一个子节点由p变为h3，第二个子节点由h3变为p。这符合限制2的设定，会销毁并新建。

但是当我们用key指明了节点前后对应关系后，React知道key === "ka"的p在更新后还存在，所以DOM节点可以复用，只是需要交换下顺序。

这就是React为了应对算法性能瓶颈做出的三条限制。

## Diff是如何实现的

我们从Diff的入口函数reconcileChildFibers出发，该函数会根据newChild（即JSX对象）类型调用不同的处理函数。

```javascript
// 根据newChild类型选择不同diff函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
      // // ...省略其他case
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

我们可以从同级的节点数量将Diff分为两类：

1. 当newChild类型为object、number、string，代表同级只有一个节点
2. 当newChild类型为Array，同级有多个节点

在接下来两节我们会分别讨论这两类节点的Diff。

## 单节点 Diff

对于单个节点，我们以类型object为例，会进入reconcileSingleElement

> 你可以从[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1141)看到reconcileSingleElement源码

```javascript
const isObject = typeof newChild === 'object' && newChild !== null;

if (isObject) {
  // 对象类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
  switch (newChild.$$typeof) {
    case REACT_ELEMENT_TYPE:
      // 调用 reconcileSingleElement 处理
    // ...其他case
  }
}
```

这个函数会做如下事情：

![image1](https://react.iamkasong.com/img/diff.png)

让我们看看第二步判断DOM节点是否可以复用是如何实现的。

```javascript
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  // 首先判断是否存在对应DOM节点
  while (child !== null) {
    // 上一次更新存在DOM节点，接下来判断是否可复用

    // 首先比较key是否相同
    if (child.key === key) {

      // key相同，接下来比较type是否相同

      switch (child.tag) {
        // ...省略case
        
        default: {
          if (child.elementType === element.type) {
            // type相同则表示可以复用
            // 返回复用的fiber
            return existing;
          }
          
          // type不同则跳出switch
          break;
        }
      }
      // 代码执行到这里代表：key相同但是type不同
      // 将该fiber及其兄弟fiber标记为删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不同，将该fiber标记为删除
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  // 创建新Fiber，并返回 ...省略
}
```

还记得我们刚才提到的，React预设的限制么，

从代码可以看出，React通过先判断key是否相同，如果key相同则判断type是否相同，只有都相同时一个DOM节点才能复用。

这里有个细节需要关注下：

- 当child !== null且key相同且type不同时执行deleteRemainingChildren将child及其兄弟fiber都标记删除。 
- 当child !== null且key不同时仅将child标记删除。

考虑如下例子：

当前页面有3个li，我们要全部删除，再插入一个p。

```javascript
// 当前页面显示的
ul > li * 3

// 这次需要更新的
ul > p
```

由于本次更新时只有一个p，属于单一节点的Diff，会走上面介绍的代码逻辑。

在reconcileSingleElement中遍历之前的3个fiber（对应的DOM为3个li），寻找本次更新的p是否可以复用之前的3个fiber中某个的DOM。

当key相同且type不同时，代表我们已经找到本次更新的p对应的上次的fiber，但是p与li type不同，不能复用。既然唯一的可能性已经不能复用，则剩下的fiber都没有机会了，所以都需要标记删除。

当key不同时只代表遍历到的该fiber不能被p复用，后面还有兄弟fiber还没有遍历到。所以仅仅标记该fiber删除。

## 多节点 Diff

现在考虑我们有一个FunctionComponent：

```javascript
function List () {
  return (
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
      <li key="2">2</li>
      <li key="3">3</li>
    </ul>
  )
}
```

他的返回值JSX对象的children属性不是单一节点，而是包含四个对象的数组

```javascript
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {
    children: [
      {$$typeof: Symbol(react.element), type: "li", key: "0", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "1", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "2", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "3", ref: null, props: {…}, …}
    ]
  },
  ref: null,
  type: "ul"
}
```

这种情况下，reconcileChildFibers的newChild参数类型为Array，在reconcileChildFibers函数内部对应如下情况：

```javascript
if (isArray(newChild)) {
  // 调用 reconcileChildrenArray 处理
  // ...省略
}
```

下面我们来看看，如何处理同级多个节点的Diff。

### 概览

首先归纳下我们需要处理的情况：

我们以之前代表更新前的JSX对象，之后代表更新后的JSX对象

#### 情况1：节点更新

```html
// 之前
<ul>
  <li key="0" className="before">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况1 —— 节点属性变化
<ul>
  <li key="0" className="after">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况2 —— 节点类型更新
<ul>
  <div key="0">0</div>
  <li key="1">1<li>
</ul>
```

#### 情况2：节点新增或减少

```html
// 之前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况1 —— 新增节点
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
  <li key="2">2<li>
</ul>

// 之后 情况2 —— 删除节点
<ul>
  <li key="1">1<li>
</ul>
```

#### 情况3：节点位置变化

```html
// 之前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 之后
<ul>
  <li key="1">1<li>
  <li key="0">0<li>
</ul>
```

同级多个节点的Diff，一定属于以上三种情况中的一种或多种。

### Diff的思路

该如何设计算法呢？如果让我设计一个Diff算法，我首先想到的方案是：

判断当前节点的更新属于哪种情况
- 如果是新增，执行新增逻辑
- 如果是删除，执行删除逻辑
- 如果是更新，执行更新逻辑

按这个方案，其实有个隐含的前提——不同操作的优先级是相同的

但是React团队发现，在日常开发中，相较于新增和删除，更新组件发生的频率更高。所以Diff会优先判断当前节点是否属于更新。

:::danger 注意
在我们做数组相关的算法题时，经常使用双指针从数组头和尾同时遍历以提高效率，但是这里却不行。

虽然本次更新的JSX对象 newChildren为数组形式，但是和newChildren中每个组件进行比较的是current fiber，同级的Fiber节点是由sibling指针链接形成的单链表，即不支持双指针遍历。

即 newChildren[0]与fiber比较，newChildren[1]与fiber.sibling比较。

所以无法使用双指针优化。
:::

基于以上原因，Diff算法的整体逻辑会经历两轮遍历：

第一轮遍历：处理更新的节点。

第二轮遍历：处理剩下的不属于更新的节点。

### 第一轮遍历

第一轮遍历步骤如下：

1. let i = 0，遍历newChildren，将newChildren[i]与oldFiber比较，判断DOM节点是否可复用。

2. 如果可复用，i++，继续比较newChildren[i]与oldFiber.sibling，可以复用则继续遍历。

3. 如果不可复用，分两种情况：

    - key不同导致不可复用，立即跳出整个遍历，第一轮遍历结束。
    - key相同type不同导致不可复用，会将oldFiber标记为DELETION，并继续遍历

4. 如果newChildren遍历完（即i === newChildren.length - 1）或者oldFiber遍历完（即oldFiber.sibling === null），跳出遍历，第一轮遍历结束。

当遍历结束后，会有两种结果：

#### 步骤3跳出的遍历

此时newChildren没有遍历完，oldFiber也没有遍历完。

举个例子，考虑如下代码：

```html
// 之前
<li key="0">0</li>
<li key="1">1</li>
<li key="2">2</li>
            
// 之后
<li key="0">0</li>
<li key="2">1</li>
<li key="1">2</li>
```

第一个节点可复用，遍历到key === 2的节点发现key改变，不可复用，跳出遍历，等待第二轮遍历处理。

此时oldFiber剩下key === 1、key === 2未遍历，newChildren剩下key === 2、key === 1未遍历。

#### 步骤4跳出的遍历

可能newChildren遍历完，或oldFiber遍历完，或他们同时遍历完。

举个例子，考虑如下代码：

```html
// 之前
<li key="0" className="a">0</li>
<li key="1" className="b">1</li>
            
// 之后 情况1 —— newChildren与oldFiber都遍历完
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
            
// 之后 情况2 —— newChildren没遍历完，oldFiber遍历完
// newChildren剩下 key==="2" 未遍历
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
<li key="2" className="cc">2</li>
            
// 之后 情况3 —— newChildren遍历完，oldFiber没遍历完
// oldFiber剩下 key==="1" 未遍历
<li key="0" className="aa">0</li>
```

带着第一轮遍历的结果，我们开始第二轮遍历。

### 第二轮遍历

对于第一轮遍历的结果，我们分别讨论：

#### newChildren与oldFiber同时遍历完

那就是最理想的情况：只需在第一轮遍历进行组件更新。此时Diff结束。

#### newChildren没遍历完，oldFiber遍历完

已有的DOM节点都复用了，这时还有新加入的节点，意味着本次更新有新节点插入，我们只需要遍历剩下的newChildren为生成的workInProgress fiber依次标记Placement。

#### newChildren遍历完，oldFiber没遍历完

意味着本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的oldFiber，依次标记Deletion。

#### newChildren与oldFiber都没遍历完

这意味着有节点在这次更新中改变了位置。

这是Diff算法最精髓也是最难懂的部分。我们接下来会重点讲解。

### 处理移动的节点

由于有节点改变了位置，所以不能再用位置索引i对比前后的节点，那么如何才能将同一个节点在两次更新中对应上呢？

我们需要使用key。

为了快速的找到key对应的oldFiber，我们将所有还未处理的oldFiber存入以key为key，oldFiber为value的Map中。

```javascript
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```

接下来遍历剩余的newChildren，通过newChildren[i].key就能在existingChildren中找到key相同的oldFiber。

### 标记节点是否移动

既然我们的目标是寻找移动的节点，那么我们需要明确：节点是否移动是以什么为参照物？

我们的参照物是：最后一个可复用的节点在oldFiber中的位置索引（用变量lastPlacedIndex表示）。

由于本次更新中节点是按newChildren的顺序排列。在遍历newChildren过程中，每个遍历到的可复用节点一定是当前遍历到的所有可复用节点中最靠右的那个，即一定在lastPlacedIndex对应的可复用的节点在本次更新中位置的后面。

那么我们只需要比较遍历到的可复用节点在上次更新时是否也在lastPlacedIndex对应的oldFiber后面，就能知道两次更新中这两个节点的相对位置改变没有。

我们用变量oldIndex表示遍历到的可复用节点在oldFiber中的位置索引。如果oldIndex < lastPlacedIndex，代表本次更新该节点需要向右移动。

lastPlacedIndex初始为0，每遍历一个可复用的节点，如果oldIndex >= lastPlacedIndex，则lastPlacedIndex = oldIndex。

单纯文字表达比较晦涩，这里我们提供两个Demo，你可以对照着理解。

### Demo1

在Demo中我们简化下书写，每个字母代表一个节点，字母的值代表节点的key

```javascript
// 之前
abcd

// 之后
acdb

===第一轮遍历开始===
a（之后）vs a（之前）  
key不变，可复用
此时 a 对应的oldFiber（之前的a）在之前的数组（abcd）中索引为0
所以 lastPlacedIndex = 0;

继续第一轮遍历...

c（之后）vs b（之前）  
key改变，不能复用，跳出第一轮遍历
此时 lastPlacedIndex === 0;
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === cdb，没用完，不需要执行删除旧节点
oldFiber === bcd，没用完，不需要执行插入新节点

将剩余oldFiber（bcd）保存为map

// 当前oldFiber：bcd
// 当前newChildren：cdb

继续遍历剩余newChildren

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index;
此时 oldIndex === 2;  // 之前节点为 abcd，所以c.index === 2
比较 oldIndex 与 lastPlacedIndex;

如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
并将 lastPlacedIndex = oldIndex;
如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动

在例子中，oldIndex 2 > lastPlacedIndex 0，
则 lastPlacedIndex = 2;
c节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：bd
// 当前newChildren：db

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
oldIndex 3 > lastPlacedIndex 2 // 之前节点为 abcd，所以d.index === 3
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：b
// 当前newChildren：b

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index;
oldIndex 1 < lastPlacedIndex 3 // 之前节点为 abcd，所以b.index === 1
则 b节点需要向右移动
===第二轮遍历结束===

最终acd 3个节点都没有移动，b节点被标记为移动
```

### Demo2

```javascript
// 之前
abcd

// 之后
dabc

===第一轮遍历开始===
d（之后）vs a（之前）  
key改变，不能复用，跳出遍历
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === dabc，没用完，不需要执行删除旧节点
oldFiber === abcd，没用完，不需要执行插入新节点

将剩余oldFiber（abcd）保存为map

继续遍历剩余newChildren

// 当前oldFiber：abcd
// 当前newChildren dabc

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
此时 oldIndex === 3; // 之前节点为 abcd，所以d.index === 3
比较 oldIndex 与 lastPlacedIndex;
oldIndex 3 > lastPlacedIndex 0
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：abc
// 当前newChildren abc

key === a 在 oldFiber中存在
const oldIndex = a（之前）.index; // 之前节点为 abcd，所以a.index === 0
此时 oldIndex === 0;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 0 < lastPlacedIndex 3
则 a节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：bc
// 当前newChildren bc

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index; // 之前节点为 abcd，所以b.index === 1
此时 oldIndex === 1;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 1 < lastPlacedIndex 3
则 b节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：c
// 当前newChildren c

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index; // 之前节点为 abcd，所以c.index === 2
此时 oldIndex === 2;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 2 < lastPlacedIndex 3
则 c节点需要向右移动

===第二轮遍历结束===
```

可以看到，我们以为从 abcd 变为 dabc，只需要将d移动到前面。

但实际上React保持d不变，将abc分别移动到了d的后面。

从这点可以看出，考虑性能，我们要尽量减少将节点从后面移动到前面的操作。
