---
title: JS 中的 7 个新 Set 方法
date: 2024-08-23
category: JavaScript
---

# JavaScript 中的 7 个新 Set 方法

我们坦诚一点：你可能对 `Set` 并不怎么关心！至少直到现在……

`Set` 从 `ES6` 就已经存在了，但通常它们只是用来确保列表中没有重复项。

然而，随着这7个即将推出的内置 `Set` 方法，我们可能会发现自己更加频繁地使用它们。

## 1. union()

`Set` 的新方法 `union() `为我们提供了两个集合中所有唯一的元素。

并且由于它是不可变的并返回副本，你可以无限链式调用它：

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

const unionSet = setA.union(setB); // Set {1, 2, 3, 4, 5}
```

## 2. intersection()

哪些元素同时存在于两个集合中？

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

const intersectionSet = setA.intersection(setB); // Set {2, 3}
```

## 3. difference()

`difference()` 方法执行 `A - B`，返回集合 `A` 中不在集合 `B` 中的所有元素：

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

const differenceSet = setA.difference(setB); // Set {1}
```

## 4. symmetricDifference()

正如 `symmetric` 所暗示的那样，此方法双向获取集合差集。即 `(A — B) U (B — A)`。

所有只存在于其中一个集合中的元素：

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

const symmetricDifferenceSet = setA.symmetricDifference(setB); // Set {1, 2, 4, 5}
```

## 5. isSubsetOf()

其目的很明确：检查一个集合的所有元素是否都在另一个集合中。

```javascript
const setA = new Set([1, 2]);
const setB = new Set([1, 2, 3]);

const isSubset = setA.isSubsetOf(setB); // true
```

## 6. isSupersetOf()

检查一个集合是否包含另一个集合中的所有元素：这与 `isSubsetOf()` 中交换两个集合的作用相同：

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([1, 2]);

const isSuperset = setA.isSupersetOf(setB); // true
```

## 7. isDisjointFrom()

这些集合是否没有任何共同元素？

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([4, 5, 6]);

const isDisjoint = setA.isDisjointFrom(setB); // true
```

## 总结

通过 `core-js` polyfills:

```shell
npm install core-js
```

以上就是我们介绍的 7 个新 Set 方法——再也不需要第三方库（如 Lodash 的 _.intersection()）了！
