---
title: JavaScript 原型与原型链
date: 2024-08-15
category: JavaScript/TypeScript
---

# JavaScript 原型与原型链

JavaScript是一门强大且灵活的编程语言，它的许多独特特性是其他编程语言所不具备的。在JavaScript的面向对象编程中，原型系统是一个基础概念。理解原型和原型链对于掌握JavaScript至关重要，因为它让开发者能够理解语言中的继承和属性解析机制。这篇文章将简单的聊一聊JavaScript中的原型和原型链，并通过实例来帮助大家更好地理解这些概念。

## 什么是原型（Prototype）？

在JavaScript中，每个对象都有一个原型。原型是另一个对象，当前对象从中继承属性。当你试图访问一个对象的属性时，JavaScript会首先在对象自身上查找这个属性。如果没有找到，它会继续在对象的原型上查找。这个查找属性的过程会一直沿着原型链进行，直到找到属性或到达原型链的末端（null）。

## 使用原型创建对象

当你使用对象字面量或使用构造函数的new关键字创建对象时，JavaScript会自动为新对象分配一个原型。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, my name is ${this.name}`;
};

const alice = new Person('Alice');
console.log(alice.greet()); // 输出：Hello, my name is Alice
```

在这个例子中，Person.prototype是alice对象的原型。greet方法定义在Person.prototype上，所以当调用alice的greet方法时，JavaScript会沿着原型链查找这个方法。

## 原型链（Prototype Chain）

原型链是一系列对象之间的链接，JavaScript通过这些链接来解析属性和方法引用。每个对象都有一个指向其原型的引用，这个引用形成了链条。

### 原型链示例

通过以下示例来更好地理解原型链：

```javascript
function Animal(voice) {
  this.voice = voice;
}

Animal.prototype.speak = function() {
  return this.voice;
};

function Dog(name, voice) {
  Animal.call(this, voice);
  this.name = name;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} says ${this.voice}`;
};

const rover = new Dog('Rover', 'Woof');
console.log(rover.bark());  // 输出：Rover says Woof
console.log(rover.speak()); // 输出：Woof
```

在这个例子中，Dog继承自Animal。Dog.prototype被设置为一个新对象，这个新对象的原型是Animal.prototype。这意味着Dog的实例rover可以访问Dog.prototype和Animal.prototype上定义的方法。

## 理解 __proto__ 和 prototype

JavaScript原型系统中有两个常见的属性：__proto__ 和 prototype。

- __proto__ 是一个内部属性，指向对象的原型。它是实例的一部分。
- prototype 是构造函数的属性，而不是实例的属性，它用于构建由该构造函数创建的实例的 __proto__。

示例:

```javascript
function Car(model) {
  this.model = model;
}

Car.prototype.getModel = function() {
  return this.model;
};

const tesla = new Car('Tesla Model 3');
console.log(tesla.__proto__ === Car.prototype); // 输出：true
console.log(Car.prototype.constructor === Car); // 输出：true
console.log(tesla.getModel()); // 输出：Tesla Model 3
```

在这个例子中，tesla.__proto__ 是 Car.prototype，Car.prototype 有一个指向 Car 的 constructor 属性。这个关系使得Car的实例能够继承Car.prototype上的方法。

## 使用原型的优势

在JavaScript中使用原型有几个优势：

- 内存效率：方法在实例之间共享，减少了内存使用。
- 性能：方法查找更快，因为它们沿着原型链查找。
- 动态方法添加：你可以随时向原型添加方法，所有实例都可以访问这些方法。

### 动态方法添加示例

```javascript
function Cat(name) {
  this.name = name;
}

const kitty = new Cat('Kitty');

Cat.prototype.meow = function() {
  return `${this.name} says Meow`;
};

console.log(kitty.meow()); // 输出：Kitty says Meow

Cat.prototype.purr = function() {
  return `${this.name} is purring`;
};

console.log(kitty.purr()); // 输出：Kitty is purring
```

在这里，purr方法在kitty实例创建之后被添加到Cat.prototype上，但kitty仍然可以访问purr方法，因为它遵循原型链。

## 总结

理解JavaScript的原型和原型链对于编写高效且有效的代码至关重要。原型提供了一种强大的继承和属性共享机制，使开发者能够创建内存高效且性能良好的应用程序。通过掌握这些概念，你可以充分利用JavaScript的面向对象特性，编写更复杂且可维护的代码。无论是动态添加方法还是创建复杂的继承结构，原型都是每个JavaScript开发者都应该精通的基础部分。
