---
title: 工厂方法设计模式
date: 2024-06-27
---
# 工厂方法设计模式
:::info Reference:
原文地址：https://refactoringguru.cn/design-patterns/factory-method

亦称：虚拟构造函数、Virtual Constructor、Factory Method
:::

[[toc]]

## 意图

**工厂方法模式**是一种创建型设计模式，其在父类中提供一个创建对象的方法，允许子类决定实例化对象的类型。

![image](https://refactoringguru.cn/images/patterns/content/factory-method/factory-method-zh-2x.png?id=52ff631ed477ac28e324fe90c87e91a4)

## 问题
假设你正在开发一款物流管理应用。最初版本只能处理卡车运输，因此大部分代码都在位于名为`卡车`的类中。

一段时间后，这款应用变得极受欢迎。你每天都能收到十几次来自海运公司的请求，希望应用能够支持海上物流功能。

![如果代码其余部分与现有类已经存在耦合关系，那么向程序中添加新类其实并没有那么容易。](https://refactoringguru.cn/images/patterns/diagrams/factory-method/problem1-zh-2x.png?id=6bf86ada3de7fc693d506e7725cfb0d2)

如果代码其余部分与现有类已经存在耦合关系，那么向程序中添加新类其实并没有那么容易。

这可是个好消息。但是代码问题该如何处理呢？目前，大部分代码都与`卡车`类相关。在程序中添加`轮船`类需要修改全部代码。更糟糕的是，如果你以后需要在程序中支持另外一种运输方式，很可能需要再次对这些代码进行大幅修改。

最后，你将不得不编写繁复的代码，根据不同的运输对象类，在应用中进行不同的处理。
