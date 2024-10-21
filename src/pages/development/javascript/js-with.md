---
title: 测测你对 with 语句和嵌套对象的理解
date: 2024-08-28
tag: JavaScript
category: JavaScript
abstract: 今天的挑战题目涉及到JavaScript中的 with 语句和嵌套对象的作用域处理。with 语句允许你在指定对象的上下文中执行代码，但它的行为可能会让你感到意外，特别是在处理嵌套对象时。让我们一起分析这段代码，看看它会输出什么以及为什么。
---

# 测测你对 with 语句和嵌套对象的理解

![javascript-with](https://mmbiz.qpic.cn/sz_mmbiz_png/KEXUm19zKo4lWUdrNty8ibfWvEkCEbDrLpkOia8tYjdZNLhTpRAibKPGOPKCclma7Cicl4b2JXLkVr6yMngV6UGzag/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

今天的挑战题目涉及到JavaScript中的 with 语句和嵌套对象的作用域处理。with 语句允许你在指定对象的上下文中执行代码，但它的行为可能会让你感到意外，特别是在处理嵌套对象时。让我们一起分析这段代码，看看它会输出什么以及为什么。

## 代码解析

首先，我们来看一下定义的对象 `obj` 及其结构：

```javascript
const obj = {
  outer: 1,
  inner: {
    outer: 10,
    inner: 20
  }
};
```

- `obj` 是一个包含两个属性的对象：`outer` 和 `inner`。
- `inner` 本身是一个对象，包含两个属性：`outer` 和 `inner`，其值分别为 10 和 20。

接下来，我们定义了一个初始值为 `0` 的变量 result：

```javascript
let result = 0;
```

然后，我们使用嵌套的 `with` 语句来处理这个对象：

```javascript
with (obj) {
  result += outer;
  with (inner) {
    result += outer + inner;
  }
}
```

## 理解嵌套的 with 语句

### 外层 with (obj) 语句：

- 在外层 `with` 语句中，代码块中的所有属性引用首先查找 `obj` 对象。
- `result += outer`; 中的 `outer` 首先在 `obj` 中查找，找到 `obj.outer`，其值为 `1`，所以 `result` 变为 `0 + 1 = 1`。

### 内层 with (inner) 语句：

- 内层 `with` 语句将作用域切换到 `obj.inner` 对象，因此所有属性引用首先在 `obj.inner` 中查找。
- `result += outer + inner;` 中的 `outer` 和 `inner` 都是在 `obj.inner` 中查找的。
- `obj.inner.outer` 的值是 `10`，`obj.inner.inner` 的值是 `20`，因此这一行的计算结果是 `10 + 20 = 30`，`result` 变为 `1 + 30 = 31`。

## 输出结果

综上所述，最终的 `result` 值是 `31`。因此，`console.log(result)` 的输出是：

```javascript
console.log(result); // 输出 31
```

## 总结

这道题目展示了 `with` 语句的作用域处理方式，特别是在处理嵌套对象时。通过嵌套的 `with` 语句，你可以逐层访问对象的属性，但这种做法容易引发混淆和错误。因此，`with` 语句不推荐在现代JavaScript代码中使用。理解 `with` 语句的作用域规则对正确解答这道题目至关重要。
