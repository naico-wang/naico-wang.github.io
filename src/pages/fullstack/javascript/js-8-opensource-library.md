---
title: 这 6 个常见的前端开源库，你一定要知道！
date: 2024-09-04
tag: JavaScript
abstract: 库的使用是我们在日常开发中的必备操作。那么今天，为大家推荐 6 个常见的前端库，以帮助大家更好的完成日常工作！
---

# 这 6 个常见的前端开源库，你一定要知道！

库的使用是我们在日常开发中的必备操作。那么今天，为大家推荐 6 个常见的前端库，以帮助大家更好的完成日常工作！

## 01：radash

GitHub 地址：https://github.com/rayepps/radash

Radash 是一个用于 TypeScript 和 JavaScript 的实用工具库，专注于性能优化和开发效率。它提供了一系列函数，简化常见的代码操作，类似于 Lodash，但更轻量级且专为现代 TypeScript 环境设计。Radash 的目标是提供一套高度可定制、简洁且性能良好的函数，以满足现代 JavaScript 应用程序的需求。

### 使用示例

假设我们要处理一个包含用户信息的数组并从中提取出年龄大于 18 岁的用户，可以使用 Radash 中的 `filter` 函数：

```javascript
import { filter } from 'radash'

const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 17 },
  { id: 3, name: 'Charlie', age: 19 }
]

const adults = filter(users, user => user.age > 18)

console.log(adults)
// 输出: [{ id: 1, name: 'Alice', age: 25 }, { id: 3, name: 'Charlie', age: 19 }]
```

## 02：dayjs

GitHub 地址：https://github.com/iamkun/dayjs

Day.js 是一个轻量级的 JavaScript 日期处理库，专注于简化日期和时间的操作。它提供了类似于 Moment.js 的 API，但体积更小，仅约 2kB。Day.js 支持链式操作，具有良好的性能，并支持解析、验证、操作和显示日期时间。

### 主要特点

- **轻量级**：仅 2kB，减少了对项目的体积影响。
- **API 简洁**：与 Moment.js 类似，学习成本低。
- **Immutable**：所有操作返回新实例，确保数据不可变。
- **国际化支持**：内置对多语言的支持。
- **插件扩展**：提供丰富的插件系统，按需加载功能。

### 使用示例

```javascript
import dayjs from 'dayjs';

// 获取当前日期
const now = dayjs();
console.log(now.format()); // 输出: 当前日期和时间

// 日期加减
const future = dayjs().add(7, 'day'); // 当前日期加 7 天
console.log(future.format('YYYY-MM-DD')); // 输出: 加 7 天后的日期

// 日期比较
const date1 = dayjs('2023-01-01');
const date2 = dayjs('2024-01-01');
console.log(date1.isBefore(date2)); // 输出: true

// 日期格式化
const formatted = dayjs().format('YYYY-MM-DD HH:mm:ss');
console.log(formatted); // 输出: 当前日期和时间按指定格式显示
```

## 03：driver

GitHub 地址：https://github.com/kamranahmedse/driver.js

`Driver.js` 是一个轻量级的 JavaScript 库，用于在网页中创建引导步骤或教程，帮助用户逐步了解界面上的功能。它通过高亮网页的特定部分并提供相应的说明或提示，让用户更容易理解如何使用某个应用程序或界面。

### 主要特点

- **引导功能**：逐步引导用户操作页面，提供互动式的帮助系统。
- **轻量易用**：库的体积较小，且 API 简洁，方便集成。
- **支持多种元素定位**：可以高亮页面的任意 HTML 元素，帮助用户了解具体功能。
- **可自定义样式**：允许自定义提示框的样式，使其与应用的设计风格保持一致。
- **跨浏览器兼容**：支持主流的现代浏览器。

### 使用示例

```javascript
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';  // 导入样式

// 创建一个 Driver 实例
const driver = new Driver();

// 定义步骤
driver.defineSteps([
  {
    element: '#step1', // 要高亮的元素
    popover: {
      title: '欢迎使用功能 1',
      description: '这是我们应用中的第一个功能，它非常有用。',
      position: 'bottom', // 提示框的显示位置
    }
  },
  {
    element: '#step2',
    popover: {
      title: '功能 2',
      description: '这是另一个强大的功能，您可以在这里找到它。',
      position: 'top',
    }
  }
]);

// 开始引导
driver.start();
```

### 应用场景

- **新用户引导**：为新用户提供首次使用的引导，逐步展示主要功能。
- **复杂应用的教程**：帮助用户快速掌握复杂界面中的关键功能。
- **功能更新提示**：当应用有新功能或重大更新时，通过引导提示用户新的使用方式。

## 04：Draggable JS

GitHub 地址：https://github.com/Shopify/draggable

`Draggable JS` 是 Shopify 开发的一个现代拖放库，支持拖拽、排序和与不同容器之间的交互。它设计轻量级、模块化，能够在任何现代浏览器中高效运行。`Draggable` 提供了良好的可扩展性和易用性，使开发者可以轻松实现丰富的拖放交互。

### 主要特点

- 模块化设计：支持按需加载，功能包括拖拽 (`Draggable`)、排序 (`Sortable`)、交换 (`Swappable`) 等。
- 触摸支持：默认支持移动设备上的触摸事件。
- 多容器支持：可以在多个容器之间拖拽和排序元素。
- 可扩展性强：支持自定义拖放行为、拖动约束、回调函数和事件监听器。
- 事件驱动：通过丰富的事件接口，可以在拖放的不同阶段执行操作。

### 使用示例

```html
<div class="container" id="container-1">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
<div class="container" id="container-2">
  <div class="item">Item A</div>
  <div class="item">Item B</div>
  <div class="item">Item C</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@shopify/draggable/lib/draggable.bundle.js"></script>
<script>
  const containers = document.querySelectorAll('.container');
  
  const draggable = new Draggable(containers, {
    draggable: '.item',
  });

  // 监听拖拽事件
  draggable.on('drag:start', (event) => {
    console.log('开始拖拽:', event);
  });

  draggable.on('drag:stop', (event) => {
    console.log('拖拽结束:', event);
  });
</script>

<style>
  .container {
    display: flex;
    gap: 10px;
  }

  .item {
    width: 100px;
    height: 100px;
    background-color: #007BFF;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
  }
</style>
```

### 主要功能模块

- **Draggable**: 核心模块，提供基本的拖动功能。
- **Sortable**: 提供排序功能，允许用户在列表中对元素重新排序。
- **Swappable**: 提供交换功能，支持两个容器之间的元素交换。
- **Droppable**: 支持元素放置在特定区域或容器中。
- **Collidable**: 提供元素之间的碰撞检测，避免元素重叠。

### 应用场景

- **卡片拖拽**：比如在看板（Trello 风格）应用中，用户可以通过拖拽任务卡片进行任务管理。
- **拖拽排序**：如文件、图片或列表项的拖拽排序功能。
- **自定义交互**：适用于需要高定制化拖拽体验的交互，比如商品排列、页面布局等。

## 05：logicflow

GitHub 地址：https://github.com/didi/LogicFlow

`LogicFlow` 是一个用于构建流程图的前端框架，专注于流程设计和可视化编辑。它提供了基础的图形编辑能力，支持自定义节点、边和流程控制，适用于工作流、决策树、流程管理等场景。

### 主要特点

- **简洁易用**：提供了基础流程图的常用功能，开发者可以快速上手，创建可视化流程。
- **高度可扩展**：通过插件机制，开发者可以自由扩展节点和边的功能，支持自定义图形。
- **支持多种操作**：如拖拽、缩放、对齐、自动布局等常用操作，提升用户体验。
- **事件驱动**：支持多种流程图事件，可以在图形的不同交互阶段执行操作。
- **跨平台支持**：能够在浏览器和各种 Web 应用中运行，轻松集成到现有项目中。

### 使用示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LogicFlow 示例</title>
  <link rel="stylesheet" href="https://unpkg.com/@logicflow/core/dist/style/index.css">
</head>
<body>
  <div id="container" style="width: 100%; height: 500px;"></div>
  
  <script src="https://unpkg.com/@logicflow/core"></script>
  <script>
    // 创建 LogicFlow 实例
    const lf = new LogicFlow({
      container: document.querySelector('#container'),
      grid: true, // 显示网格
    });

    // 渲染流程图
    lf.render({
      nodes: [
        {
          id: 'node_1',
          type: 'rect',
          x: 100,
          y: 100,
          text: '开始节点'
        },
        {
          id: 'node_2',
          type: 'rect',
          x: 300,
          y: 100,
          text: '结束节点'
        }
      ],
      edges: [
        {
          sourceNodeId: 'node_1',
          targetNodeId: 'node_2',
          type: 'polyline'
        }
      ]
    });
  </script>
</body>
</html>
```

### 核心模块

- **节点**：提供了多种预置节点类型，如矩形、圆形、菱形等，支持自定义节点样式和交互。
- **连线**：支持直线、折线、曲线等不同类型的连线，并允许配置连线箭头、线条样式等。
- **布局**：可以通过插件支持自动布局功能，例如树形布局、层次布局等。
- **插件系统**：LogicFlow 提供了插件系统，开发者可以通过插件来扩展流程图功能，如节点拖拽、键盘操作、自动对齐等。

### 使用场景

- **流程管理系统**：适用于企业中的工作流管理、任务流管理、审批流程等场景。
- **决策树和算法流程**：可以用于展示和设计复杂的决策树、算法流程图等。
- **可视化编排工具**：用于开发像 BPMN 流程编辑器、数据流编排等可视化工具。

## 06：ProgressBar

GitHub 地址：https://github.com/kimmobrunfeldt/progressbar.js

`ProgressBar.js` 是一个用于创建动画进度条的 JavaScript 库，它提供了圆形、直线、半圆形等多种进度条样式，且易于定制。该库轻量级且灵活，适用于需要展示进度、加载状态等场景的网页应用。

### 主要特点

- **多种形状**：支持线形、圆形、半圆形等多种进度条形状，满足不同设计需求。
- **动画效果**：进度条具有平滑的动画效果，支持缓动函数控制动画。
- **易于使用**：API 简单且灵活，可以快速集成到项目中。
- **高度可定制**：支持自定义进度条的颜色、宽度、背景、文本等参数。
- **无依赖**：轻量级库，无需额外的依赖包。

### 使用示例

```html
<div id="container"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/progressbar.js/1.0.1/progressbar.min.js"></script>
<script>
 var bar = new ProgressBar.Line('#container', {
   strokeWidth: 4,       // 线条宽度
   easing: 'easeInOut',  // 动画缓动效果
   duration: 1400,       // 动画时长
   color: '#FFEA82',     // 进度条颜色
   trailColor: '#eee',   // 进度条背景色
   trailWidth: 1,        // 背景条的宽度
   svgStyle: {width: '100%', height: '100%'},
   text: {
     style: {
       color: '#999',    // 文字颜色
       position: 'absolute',
       right: '0',
       top: '30px',
       padding: 0,
       margin: 0,
       transform: null
     },
     autoStyleContainer: false
   },
   from: { color: '#FFEA82' },  // 动画开始颜色
   to: { color: '#ED6A5A' },    // 动画结束颜色
   step: (state, bar) => {
     bar.setText(Math.round(bar.value() * 100) + ' %'); // 设置文字显示百分比
   }
 });

 // 动画到 100% 完成
 bar.animate(1.0);
</script>
```

