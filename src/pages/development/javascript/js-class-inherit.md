---
title: 一道题测试你对JavaScript类继承和静态方法的理解
date: 2024-08-24
category: JavaScript
---

# 测一测你对JavaScript类继承和静态方法的理解

今天的挑战题目涉及到JavaScript中的类继承 (class inheritance)、静态方法 (static method)、以及 super 关键字的使用。让我们一起来分析这段代码，看看它会输出什么以及为什么

```javascript
class Parent {
  static greet() {
    return 'Hello from Parent';
  }
}

class Child extends Parent {
  static greet() {
    return super.greet() + ' and Child';
  }
}

const childInstance = new Child();
console.log(ChildInstance.greet());
```

## 代码解析

首先，代码定义了一个父类 `Parent`，其中包含一个静态方法 `greet`：

```javascript
class Parent {
  static greet() {
    return 'Hello from Parent';
  }
}
```

- `Parent` 类有一个静态方法 `greet()`，它返回字符串 `Hello from Parent`。
- 静态方法是通过类本身调用的，而不是通过类的实例调用。

接下来，代码定义了一个继承自 `Parent` 的子类 `Child`，并且它也定义了一个静态方法 `greet`：

```javascript
class Child extends Parent {
  static greet() {
    return super.greet() + ' and Child';
  }
}
```
- `Child` 类继承了 `Parent` 类，并定义了自己的静态方法 `greet()`。
- 在 `Child.greet()` 中，使用了 `super.greet()` 来调用父类 `Parent` 的静态方法 `greet()`，并将它返回的字符串拼接上 `' and Child'`。

然后，代码创建了 `Child` 类的实例：

```javascript
const childInstance = new Child();
```
- 这里我们创建了 `Child` 类的一个实例 `childInstance`。然而，重要的一点是，静态方法是与类相关联的，而不是与类的实例相关联的。

最后，代码尝试打印 `childInstance.greet`：

```javascript
console.log(childInstance.greet);
```

## 理解静态方法和实例方法的区别

静态方法是通过类本身调用的，而不是通过类的实例调用的。这意味着 `greet` 作为一个静态方法，不能通过类的实例 `childInstance` 调用。

当你尝试访问 `childInstance.greet` 时，实际上你是在试图通过实例调用静态方法，这种操作是无效的。因此，`childInstance.greet` 的值是 `undefined`，因为 `greet` 不是 `childInstance` 上的实例方法。

## 输出结果

因此，`console.log(childInstance.greet)` 的输出是：

```javascript
console.log(childInstance.greet); // 输出 undefined
```

## 总结

这道题目展示了静态方法和实例方法的区别。静态方法只能通过类本身调用，而不能通过类的实例调用。因此，尝试访问实例的静态方法时，结果会是 `undefined`。理解静态方法的工作方式以及 `super` 关键字的使用对于正确解答这道题目至关重要。你答对了吗？
