---
title: 测测你对JavaScript原型继承和 instanceof 的理解
date: 2024-09-02
tag: JavaScript
abstract: 今天的挑战题目涉及到JavaScript中的原型继承和 instanceof 操作符的使用。我们将通过分析一个关于构造函数和原型链的例子，来探索对象继承的机制，以及如何判断对象的类型。让我们一起深入解析这段代码，看看它会输出什么以及为什么。
---

# 测测你对JavaScript原型继承和 instanceof 的理解

![quiz-prototype](https://mmbiz.qpic.cn/sz_mmbiz_png/KEXUm19zKo51ibdX6Z5joqVl7IUQnMcsEuq5czmNiaex6xdm6ELUKzt3g1eLOTd6dXu0mFYjeTRYpsnfnSfSZfEg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

今天的挑战题目涉及到JavaScript中的原型继承和 instanceof 操作符的使用。我们将通过分析一个关于构造函数和原型链的例子，来探索对象继承的机制，以及如何判断对象的类型。让我们一起深入解析这段代码，看看它会输出什么以及为什么。

## 代码解析

首先，代码定义了两个构造函数 `Shape` 和 `Circle`：

```javascript
function Shape() {}
function Circle(radius) {}
```

- `Shape` 是一个简单的构造函数，目前它不执行任何操作。
- `Circle` 是一个构造函数，它接受一个参数 `radius`，但目前也没有执行任何操作。

接下来，代码通过 `Object.create` 设置了 `Circle.prototype` 的原型：

```javascript
Circle.prototype = Object.create(Shape.prototype);
```

- 这行代码的作用是让 `Circle` 的原型 (`Circle.prototype`) 继承自 `Shape` 的原型 (`Shape.prototype`)。
- 这意味着通过 `new Circle()` 创建的对象，它的原型链上会包含 `Shape.prototype`，即 `Circle` 是 `Shape` 的子类。

然后，代码创建了一个 `Shape` 类型的对象：

```javascript
const shape = new Shape();
```

- 这里我们使用 `new Shape()` 创建了一个对象 `shape`。它的原型是 `Shape.prototype`。

最后，代码使用 `instanceof` 操作符来检查 `shape` 是否是 `Circle` 的实例：

```javascript
console.log(shape instanceof Circle);
```

## 理解 instanceof

instanceof 操作符用于检测某个对象是否是某个构造函数的实例。其工作原理是检查对象的原型链上是否存在该构造函数的 prototype 属性。

在这个例子中：

- `shape` 对象的原型链是 `Shape.prototype`。
- `Circle.prototype` 的原型是 `Shape.prototype`。

但是，`shape` 对象的原型链并不直接包含 `Circle.prototype`，而是直接指向 `Shape.prototype`，因此：

- `shape instanceof Circle` 会返回 `false`，因为 `shape` 的原型链中不包括 `Circle.prototype`。

## 输出结果

根据上述分析，最终的输出结果是：

```javascript
console.log(shape instanceof Circle); // 输出 false
```

## 总结

这道题目展示了JavaScript中的原型继承和 `instanceof` 操作符的工作原理。尽管 `Circle` 的原型链中包含 `Shape.prototype`，但反过来检查 `Shape` 的实例是否属于 `Circle` 并不会成立。理解原型链的层次关系对于正确解答这道题目至关重要。
