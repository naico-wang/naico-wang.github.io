---
title: 创建型 - 原型模式
date: 2024-05-19
tags: [DesignPattern]
---

# 创建型 - 原型模式

:::info Reference:
原文地址：[https://refactoringguru.cn/design-patterns/prototype](https://refactoringguru.cn/design-patterns/prototype)

亦称： 克隆、Clone、Prototype，属于**创建型模式**。
:::

## 意图

**原型模式**是一种创建型设计模式， 使你能够复制已有对象， 而又无需使代码依赖它们所属的类。

![prototype](https://refactoringguru.cn/images/patterns/content/prototype/prototype-2x.png)

## 问题

如果你有一个对象， 并希望生成与其完全相同的一个复制品， 你该如何实现呢？ 首先， 你必须新建一个属于相同类的对象。 然后，你必须遍历原始对象的所有成员变量， 并将成员变量值复制到新对象中。

不错！ 但有个小问题。 并非所有对象都能通过这种方式进行复制， 因为有些对象可能拥有私有成员变量， 它们在对象本身以外是不可见的。

![“从外部” 复制对象并非总是可行。](https://refactoringguru.cn/images/patterns/content/prototype/prototype-comic-1-zh-2x.png)
*“从外部” 复制对象并非总是可行。*

直接复制还有另外一个问题。 因为你必须知道对象所属的类才能创建复制品， 所以代码必须依赖该类。 即使你可以接受额外的依赖性， 那还有另外一个问题： 有时你只知道对象所实现的接口， 而不知道其所属的具体类， 比如可向方法的某个参数传入实现了某个接口的任何对象。

## 解决方案

原型模式将克隆过程委派给被克隆的实际对象。 模式为所有支持克隆的对象声明了一个通用接口， 该接口让你能够克隆对象， 同时又无需将代码和对象所属类耦合。 通常情况下， 这样的接口中仅包含一个 克隆方法。

所有的类对 克隆方法的实现都非常相似。 该方法会创建一个当前类的对象， 然后将原始对象所有的成员变量值复制到新建的类中。 你甚至可以复制私有成员变量， 因为绝大部分编程语言都允许对象访问其同类对象的私有成员变量。

支持克隆的对象即为原型。 当你的对象有几十个成员变量和几百种类型时， 对其进行克隆甚至可以代替子类的构造。

![预生成原型可以代替子类的构造。](https://refactoringguru.cn/images/patterns/content/prototype/prototype-comic-2-zh-2x.png)
*预生成原型可以代替子类的构造。*

其运作方式如下： 创建一系列不同类型的对象并不同的方式对其进行配置。 如果所需对象与预先配置的对象相同， 那么你只需克隆原型即可， 无需新建一个对象。

## 真实世界类比

现实生活中， 产品在得到大规模生产前会使用原型进行各种测试。 但在这种情况下， 原型只是一种被动的工具， 不参与任何真正的生产活动。

![一个细胞的分裂。](https://refactoringguru.cn/images/patterns/content/prototype/prototype-comic-3-zh-2x.png)
*一个细胞的分裂。*

由于工业原型并不是真正意义上的自我复制， 因此细胞有丝分裂 （还记得生物学知识吗？） 或许是更恰当的类比。 有丝分裂会产生一对完全相同的细胞。 原始细胞就是一个原型， 它在复制体的生成过程中起到了推动作用。

## 原型模式结构

### 基本实现

![基本实现](https://refactoringguru.cn/images/patterns/diagrams/prototype/structure-2x.png)

### 原型注册表实现

![原型注册表实现](https://refactoringguru.cn/images/patterns/diagrams/prototype/structure-prototype-cache-2x.png)

## 伪代码

在本例中， 原型模式能让你生成完全相同的几何对象副本， 同时无需代码与对象所属类耦合。

![克隆一系列位于同一类层次结构中的对象。](https://refactoringguru.cn/images/patterns/diagrams/prototype/example-2x.png)
*克隆一系列位于同一类层次结构中的对象。*

所有形状类都遵循同一个提供克隆方法的接口。 在复制自身成员变量值到结果对象前， 子类可调用其父类的克隆方法。

```javascript
// 基础原型。
abstract class Shape is
    field X: int
    field Y: int
    field color: string

    // 常规构造函数。
    constructor Shape() is
        // ……

    // 原型构造函数。使用已有对象的数值来初始化一个新对象。
    constructor Shape(source: Shape) is
        this()
        this.X = source.X
        this.Y = source.Y
        this.color = source.color

    // clone（克隆）操作会返回一个形状子类。
    abstract method clone():Shape


// 具体原型。克隆方法会创建一个新对象并将其传递给构造函数。直到构造函数运
// 行完成前，它都拥有指向新克隆对象的引用。因此，任何人都无法访问未完全生
// 成的克隆对象。这可以保持克隆结果的一致。
class Rectangle extends Shape is
    field width: int
    field height: int

    constructor Rectangle(source: Rectangle) is
        // 需要调用父构造函数来复制父类中定义的私有成员变量。
        super(source)
        this.width = source.width
        this.height = source.height

    method clone():Shape is
        return new Rectangle(this)


class Circle extends Shape is
    field radius: int

    constructor Circle(source: Circle) is
        super(source)
        this.radius = source.radius

    method clone():Shape is
        return new Circle(this)


// 客户端代码中的某个位置。
class Application is
    field shapes: array of Shape

    constructor Application() is
        Circle circle = new Circle()
        circle.X = 10
        circle.Y = 10
        circle.radius = 20
        shapes.add(circle)

        Circle anotherCircle = circle.clone()
        shapes.add(anotherCircle)
        // 变量 `anotherCircle（另一个圆）`与 `circle（圆）`对象的内
        // 容完全一样。

        Rectangle rectangle = new Rectangle()
        rectangle.width = 10
        rectangle.height = 20
        shapes.add(rectangle)

    method businessLogic() is
        // 原型是很强大的东西，因为它能在不知晓对象类型的情况下生成一个与
        // 其完全相同的复制品。
        Array shapesCopy = new Array of Shapes.

        // 例如，我们不知晓形状数组中元素的具体类型，只知道它们都是形状。
        // 但在多态机制的帮助下，当我们在某个形状上调用 `clone（克隆）`
        // 方法时，程序会检查其所属的类并调用其中所定义的克隆方法。这样，
        // 我们将获得一个正确的复制品，而不是一组简单的形状对象。
        foreach (s in shapes) do
            shapesCopy.add(s.clone())

        // `shapesCopy（形状副本）`数组中包含 `shape（形状）`数组所有
        // 子元素的复制品。
```

## 原型模式适合应用场景

- 如果你需要复制一些对象， 同时又希望代码独立于这些对象所属的具体类， 可以使用原型模式。

   这一点考量通常出现在代码需要处理第三方代码通过接口传递过来的对象时。 即使不考虑代码耦合的情况， 你的代码也不能依赖这些对象所属的具体类， 因为你不知道它们的具体信息。

   原型模式为客户端代码提供一个通用接口， 客户端代码可通过这一接口与所有实现了克隆的对象进行交互， 它也使得客户端代码与其所克隆的对象具体类独立开来。

- 如果子类的区别仅在于其对象的初始化方式， 那么你可以使用该模式来减少子类的数量。 别人创建这些子类的目的可能是为了创建特定类型的对象。

   在原型模式中， 你可以使用一系列预生成的、 各种类型的对象作为原型。

   客户端不必根据需求对子类进行实例化， 只需找到合适的原型并对其进行克隆即可。

## 实现方式

1. 创建原型接口， 并在其中声明 克隆方法。 如果你已有类层次结构， 则只需在其所有类中添加该方法即可。

2. 原型类必须另行定义一个以该类对象为参数的构造函数。 构造函数必须复制参数对象中的所有成员变量值到新建实体中。 如果你需要修改子类， 则必须调用父类构造函数， 让父类复制其私有成员变量值。

   如果编程语言不支持方法重载， 那么你可能需要定义一个特殊方法来复制对象数据。 在构造函数中进行此类处理比较方便， 因为它在调用 new运算符后会马上返回结果对象。

3. 克隆方法通常只有一行代码： 使用 new运算符调用原型版本的构造函数。 注意， 每个类都必须显式重写克隆方法并使用自身类名调用 new运算符。 否则， 克隆方法可能会生成父类的对象。

4. 你还可以创建一个中心化原型注册表， 用于存储常用原型。

   你可以新建一个工厂类来实现注册表， 或者在原型基类中添加一个获取原型的静态方法。 该方法必须能够根据客户端代码设定的条件进行搜索。 搜索条件可以是简单的字符串， 或者是一组复杂的搜索参数。 找到合适的原型后， 注册表应对原型进行克隆， 并将复制生成的对象返回给客户端。

   最后还要将对子类构造函数的直接调用替换为对原型注册表工厂方法的调用。

## 原型模式优缺点

- 优点：
  - 你可以克隆对象， 而无需与它们所属的具体类相耦合。
  - 你可以克隆预生成原型， 避免反复运行初始化代码。
  - 你可以更方便地生成复杂对象。
  - 你可以用继承以外的方式来处理复杂对象的不同配置。
- 缺点：
  - 克隆包含循环引用的复杂对象可能会非常麻烦。
