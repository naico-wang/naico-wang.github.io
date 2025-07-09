---
tags: [TypeScript]
---

# 一些Tips

## 基于字符串的枚举

有时你需要在公共的键下收集一些字符串的集合。在 TypeScript 2.4 以前，它仅支持基于数字类型的枚举，如果你在使用 TypeScript 2.4 以上的版本，你通过可以使用[字符串字面量类型与联合类型组合使用创建基于字符串枚举类型的方式](https://jkchao.github.io/typescript-book-chinese/typings/literals.html#使用用例)。

## 名义化类型

TypeScript 的类型系统是结构化的，[这也是其主要的优点之一](https://basarat.gitbooks.io/typescript/content/docs/why-typescript.html)。然而，在实际的特定用例中，有时尽管变量具有相同的结构，你也想将他们视为不同类型。一个非常常见的用例是身份类型结构（它们可能只是在 C# 或者 Java 中表示一个它们语义化名字的字符串）。

这有一些社区使用的方式，我按照个人喜好降序排列：

### 使用字面量类型

这种模式使用泛型和字面量类型：

```ts
// 泛型 Id 类型
type Id<T extends string> = {
  type: T;
  value: string;
};

// 特殊的 Id 类型
type FooId = Id<'foo'>;
type BarId = Id<'bar'>;

// 可选：构造函数
const createFoo = (value: string): FooId => ({ type: 'foo', value });
const createBar = (value: string): BarId => ({ type: 'bar', value });

let foo = createFoo('sample');
let bar = createBar('sample');

foo = bar; // Error
foo = foo; // Okey
```

- 优点
  - 不需要类型断言。
- 缺点
  - 如上结构 `{type,value}` 可能不那么尽如人意，而且需要服务器序列化支持。

### 使用枚举

TypeScript 中[枚举](https://jkchao.github.io/typescript-book-chinese/typings/enums.html) 提供一定程度的名义化类型。如果两个枚举的命名不相同，则它们类型不相等。我们可以利用这个事实来为结构上兼容的类型，提供名义化类型。

解决办法包括：

- 创建一个只有名字的枚举；
- 利用这个枚举与实际结构体创建一个交叉类型（`&`）。

如下所示，当实际结构体仅仅是一个字符串时：

```ts
// FOO
enum FooIdBrand {
  _ = ''
}
type FooId = FooIdBrand & string;

// BAR
enum BarIdBrand {
  _ = ''
}
type BarId = BarIdBrand & string;

// user

let fooId: FooId;
let barId: BarId;

// 类型安全
fooId = barId; // error
barId = fooId; // error

// 创建一个新的
fooId = 'foo' as FooId;
barId = 'bar' as BarId;

// 两种类型都与基础兼容
let str: string;
str = fooId;
str = barId;
```

请注意上文中的 `FooIdBrand` 与 `BarIdBrand`，它们都有一个 `_` 映射到空字符串的成员，即 `{ _ = '' }`。这可以强制 TypeScript 推断出这是一个基于字符串的枚举，而不是一个数字类型的枚举。这是很重要的，因为 TypeScript 会把一个空的枚举类型（`{}`）推断为一个数字类型的枚举，在 TypeScript 3.6.2 版本及其以上时，数字类型的枚举与 `string` 的交叉类型是 `never`。

### 使用接口

因为 `number` 类型与 `enum` 类型在类型上是兼容的，因此我们不能使用上述提到的方法来处理它们。取而代之，我们可以使用接口打破这种类型的兼容性。TypeScript 编译团队仍然在使用这种方法，因此它值得一提。使用 `_` 前缀和 `Brand` 后缀是一种我强烈推荐的惯例方法（[TypeScript 也这么推荐](https://github.com/Microsoft/TypeScript/blob/7b48a182c05ea4dea81bab73ecbbe9e013a79e99/src/compiler/types.ts#L693-L698)）。

解决办法包括：

- 在类型上添加一个不用的属性，用来打破类型兼容性；
- 在新建或向下转换类型的时候使用断言。

如下所示：

```ts
// FOO
interface FooId extends String {
  _fooIdBrand: string; // 防止类型错误
}

// BAR
interface BarId extends String {
  _barIdBrand: string; // 防止类型错误
}

// 使用
let fooId: FooId;
let barId: BarId;

// 类型安全
fooId = barId; // error
barId = fooId; // error
fooId = <FooId>barId; // error
barId = <BarId>fooId; // error

// 创建新的
fooId = 'foo' as any;
barId = 'bar' as any;

// 如果你需要以字符串作为基础
var str: string;
str = fooId as any;
str = barId as any;
```

## 状态函数

其他编程语言有一个共同特征，它们使用 `static` 关键字来增加函数变量的生命周期（不是范围），使其超出函数的调用范围，如 C 语言中的实现：

```c
void called () {
    static count = 0;
    count++;
    printf("Called : %d", count);
}

int main () {
    called(); // Called : 1
    called(); // Called : 2
    return 0;
}
```

由于 JavaScript（TypeScript）并没有静态函数的功能，你可以使用一个包裹着本地变量的抽象变量，如使用 `class`：

```ts
const { called } = new class {
  count = 0;
  called = () => {
    this.count++;
    console.log(`Called : ${this.count}`);
  };
}();

called(); // Called : 1
called(); // Called : 2
```

## Bind 是有害的

> [!TIP]
>
> 译者注：在这个 [PR](https://github.com/Microsoft/TypeScript/pull/27028?from=timeline&isappinstalled=0) 下，已经解决 `bind`、`call`、`apply` 类型正确推导的问题，预计在 3.2 版本中发布。

这是在 `lib.d.ts` 中 `bind` 的定义：

```ts
bind(thisArg: any, ...argArray: any[]): any
```

你可以看到他的返回值是 `any`，这意味着在函数上调用 `bind` 会导致你在原始函数调用签名上将会完全失去类型的安全检查。

如下所示：

```ts
function twoParams(a: number, b: number) {
  return a + b;
}

let curryOne = twoParams.bind(null, 123);
curryOne(456); // ok
curryOne('456'); // ok
```

一个更好的方式的是使用类型注解的箭头函数：

```ts
function twoParams(a: number, b: number) {
  return a + b;
}

let curryOne = (x: number) => twoParams(123, x);
curryOne(456); // ok
curryOne('456'); // Error
```

如果你想用一个柯里化的函数，你可以看看[此章节](https://jkchao.github.io/typescript-book-chinese/tips/curry.html)：

### 类成员

另一个常见用途是在传递类函数时使用 `bind` 来确保 `this` 的正确值，不要这么做。

在接下来的示例中，如果你使用了 `bind`，你将会失去函数参数的类型安全：

```ts
class Adder {
  constructor(public a: string) {}

  add(b: string): string {
    return this.a + b;
  }
}

function useAdd(add: (x: number) => number) {
  return add(456);
}

let adder = new Adder('mary had a little 🐑');
useAdd(adder.add.bind(adder)); // 没有编译的错误
useAdd(x => adder.add(x)); // Error: number 不能分配给 string
```

如果你想传递一个类成员的函数，使用箭头函数。例如：

```ts
class Adder {
  constructor(public a: string) {}

  // 此时，这个函数可以安全传递
  add = (b: string): string => {
    return this.a + b;
  };
}
```

另一种方法是手动指定要绑定的变量的类型：

```ts
const add: typeof adder.add = adder.add.bind(adder);
```

## 柯里化

仅仅需要使用一系列箭头函数：

```ts
// 一个柯里化函数
let add = (x: number) => (y: number) => x + y;

// 简单使用
add(123)(456);

// 部分应用
let add123 = add(123);

// fully apply the function
add123(456);
```

## 泛型的实例化类型

假如你有一个具有泛型参数的类型，如一个类 `Foo`：

```ts
class Foo<T> {
  foo: T;
}
```

你想为一个特定的类型创建单独的版本，可以通过将它拷贝到一个新变量里，并且用具体类型代替泛型的类型注解的方式来实现。例如，如果你想有一个类：`Foo<number>`：

```ts
class Foo<T> {
  foo: T;
}

const FooNumber = Foo as { new (): Foo<number> }; // ref 1
```

在 `ref 1` 中，你说 `FooNumber` 与 `Foo` 相同，但是，只是将其看作使用 `new` 运算符调用时的一个 `Foo<Number>` 实例。

### 继承

类型断言模式是不安全的，因为编译器相信你在做正确的事情。在其他语言中用于类的常见模式是使用继承：

```ts
class FooNumber extends Foo<number> {}
```

> [!WARNING]
>
> 这里需要注意的一点，如果你在基类上使用修饰器，继承类可能没有与基类相同的行为（它不再被修饰器包裹）。

当然，如果你不需要一个单独的类，你仍然写出一个有效的强制/断言模式，因此在开始时，我们便展示出了普通的断言模式：

```ts
function id<T>(x: T) {
  return x;
}

const idNum = id as { (x: number): number };
```

> 灵感来源于：[stackoverflow question](https://stackoverflow.com/questions/34859911/instantiated-polymorphic-function-as-argument-in-typescript/34864705#34864705)

## 对象字面量的惰性初始化

在 JavaScript 中，像这样用字面量初始化对象的写法十分常见：

```ts
let foo = {};
foo.bar = 123;
foo.bas = 'Hello World';
```

但在 TypeScript 中，同样的写法就会报错：

```ts
let foo = {};
foo.bar = 123; // Error: Property 'bar' does not exist on type '{}'
foo.bas = 'Hello World'; // Error: Property 'bas' does not exist on type '{}'
```

这是因为 TypeScript 在解析 `let foo = {}` 这段赋值语句时，会进行“类型推断”：它会认为等号左边 `foo` 的类型即为等号右边 `{}` 的类型。由于 `{}` 本没有任何属性，因此，像上面那样给 `foo` 添加属性时就会报错。

### 最好的解决方案

最**好**的解决方案就是在为变量赋值的同时，添加属性及其对应的值：

```ts
let foo = {
  bar: 123,
  bas: 'Hello World'
};
```

这种写法也比较容易通过其他人或工具的代码审核，对后期维护也是有利的。

> 以下的快速解决方案采用*惰性*的思路，本质上是*在初始化变量时忘了添加属性*的做法。

### 快速解决方案

如果你的 JavaScript 项目很大，那么在迁移到 TypeScript 的时候，上面的做法可能会比较麻烦。此时，你可以利用 TypeScript 的“类型断言”机制让代码顺利通过编译：

```ts
let foo = {} as any;
foo.bar = 123;
foo.bas = 'Hello World';
```

### 折中的解决方案

当然，总是用 `any` 肯定是不好的，因为这样做其实是在想办法绕开 TypeScript 的类型检查。那么，折中的方案就是创建 `interface`，这样的好处在于：

- 方便撰写类型文档
- TypeScript 会参与类型检查，确保类型安全

请看以下的示例：

```ts
interface Foo {
  bar: number;
  bas: string;
}

let foo = {} as Foo;
foo.bar = 123;
foo.bas = 'Hello World';
```

使用 `interface` 可以确保类型安全，比如这种情况：

```ts
interface Foo {
  bar: number;
  bas: string;
}

let foo = {} as Foo;
foo.bar = 123;
foo.bas = 'Hello World';

// 然后我们尝试这样做：
foo.bar = 'Hello Stranger'; // 错误：你可能把 `bas` 写成了 `bar`，不能为数字类型的属性赋值字符串
```

## 类是有用的

以下结构在应用中很常见：

```ts
function foo() {
  let someProperty;

  // 一些其他的初始化代码

  function someMethod() {
    // 用 someProperty 做一些事情
    // 可能有其他属性
  }

  // 可能有其他的方法
  return {
    someMethod
    // 可能有其他方法
  };
}
```

它被称为模块模式（利用 JavaScript 的闭包）。

如果你使用[文件模块](https://jkchao.github.io/typescript-book-chinese/project/modules.html#文件模块)（你确实应该将全局变量视为错误），文件中的代码与示例一样，都不是全局变量。

然而，开发者有时会写以下类似代码：

```ts
let someProperty;

function foo() {
  // 一些初始化代码
}

foo();
someProperty = 123; // 其他初始化代码

// 一些其它未导出

// later
export function someMethod() {}
```

尽管我并不是一个特别喜欢使用**继承**的人，但是我确实发现让开发者使用类，可以在一定程度上更好的组织他们的代码，例如：

```ts
class Foo {
  public someProperty;

  constructor() {
    // 一些初始化内容
  }

  public someMethod() {
    // ..code
  }

  public someUtility() {
    // .. code
  }
}

export = new Foo();
```

这并不仅仅有利于开发者，在创建基于类的更出色可视化工具中，它更常见。并且，这有利于项目的理解和维护。

> [!TIP]
>
> 在浅层次的结构中，如果它们能够提供明显的重复使用和减少模版的好处，那么在这个观点里，我并没有错误。

## `export default` 被认为是有害的

假如你有一个包含以下内容的 `foo.ts` 文件：

```ts
class Foo {}

export default Foo;
```

你可能会使用 ES6 语法导入它（在 `bar.ts` 里）：

```ts
import Foo from './foo';
```

这存在一些可维护性的问题：

- 如果你在 `foo.ts` 里重构 `Foo`，在 `bar.ts` 文件中，它将不会被重新命名；
- 如果你最终需要从 `foo.ts` 文件中导出更多有用的信息（在你的很多文件中都存在这种情景），那么你必须兼顾导入语法。

由于这些原因，我推荐在导入时使用简单的 `export` 与解构的形式，如 `foo.ts`：

```ts
export class Foo {}
```

接着：

```ts
import { Foo } from './Foo';
```

下面，我将会介绍更多的原因。

### 可发现性差

默认导出的可发现性非常差，你不能智能的辨别一个模块它是否有默认导出。

在使用默认导出时，你什么也没有得到（可能它有默认导出，可能它没有）。

```ts
import /* here */ from 'something';
```

没有默认导出，你可以用以下方式获取智能提示：

```ts
import /* here */ 'something';
```

### 自动完成

不管你是否了解导出，你都可以在 `import { /* here */ } from './foo'` 的 `here` 位置，来了解导出模块的信息。

### CommonJS 互用

对于必须使用 `const { default } = require('module/foo')` 而不是 `const { Foo } = require('module/foo')` 的 CommonJS 的用户来说，这会是一个糟糕的体验。当你导入一个模块时，你很可能想重命名 `default` 作为导入的名字。

### 防止拼写错误

当你在开发时使用 `import Foo from './foo'` 时，并不会得到有关于拼写的任何错误，其他人可能会这么写 `import foo from './foo'`；

### 再次导出

再次导出是没必要的，但是在 `npm` 包的根文件 `index` 却是很常见。如：`import Foo from './foo'；export { Foo }`（默认导出）VS `export * from './foo'` （命名导出）。

### 动态导入

在动态的 `import` 中，默认导出会以 `default` 的名字暴露自己，如：

```ts
const HighChart = await import('https://code.highcharts.com/js/es-modules/masters/highcharts.src.js');
HighChart.default.chart('container', { ... }); // Notice `.default`
```

## 减少 setter 属性的使用

倾向于使用更精确的 `set/get` 函数（如 `setBar`, `getBar`），减少使用 `setter/getter`；

考虑以下代码：

```ts
foo.bar = {
  a: 123,
  b: 456
};
```

存在 `setter/getter` 时：

```ts
class Foo {
  a: number;
  b: number;
  set bar(value: { a: number; b: number }) {
    this.a = value.a;
    this.b = value.b;
  }
}

let foo = new Foo();
```

这并不是 `setter` 的一个好的使用场景，当开发人员阅读第一段代码时，不知道将要更改的所有内容的上下文。然而，当开发者使用 `foo.setBar(value)`，他可能会意识到在 `foo` 里可能会引起一些改变。

## 创建数组

创建数组十分简单：

```ts
const foo: string[] = [];
```

你也可以在创建数组时使用 ES6 的 `Array.prototype.fill` 方法为数组填充数据：

```ts
const foo: string[] = new Array(3).fill('');
console.log(foo); // 会输出 ['','','']
```

## TypeScript 中的静态构造函数

TypeScript 中的 `class` （JavaScript 中的 `class`）没有静态构造函数的功能，但是你可以通过调用它自己来获取相同的效果：

```ts
class MyClass {
  static initalize() {
    //
  }
}

MyClass.initalize();
```

## 单例模式

传统的单例模式可以用来解决所有代码必须写到 `class` 中的问题：

```ts
class Singleton {
  private static instance: Singleton;
  private constructor() {
    // ..
  }

  public static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  someMethod() {}
}

let someThing = new Singleton(); // Error: constructor of 'singleton' is private

let instacne = Singleton.getInstance(); // do some thing with the instance
```

然而，如果你不想延迟初始化，你可以使用 `namespace` 替代：

```ts
namespace Singleton {
  // .. 其他初始化的代码

  export function someMethod() {}
}

// 使用
Singleton.someMethod();
```

> [!WARNING]
>
> 单例只是[全局](https://stackoverflow.com/questions/137975/what-is-so-bad-about-singletons/142450#142450)的一个别称。

对大部分使用者来说，`namespace` 可以用模块来替代。

```ts
// someFile.ts
// ... any one time initialization goes here ...
export function someMethod() {}

// Usage
import { someMethod } from './someFile';
```

## 函数参数

如果你有一个含有很多参数或者相同类型参数的函数，那么你可能需要考虑将函数改为接收对象的形式：

如下一个函数：

```ts
function foo(flagA: boolean, flagB: boolean) {
  // 函数主体
}
```

像这样的函数，你可能会很容易错误的调用它，如 `foo(flagB, flagA)`，并且你并不会从编译器得到想要的帮助。

你可以将函数变为接收对象的形式：

```ts
function foo(config: { flagA: boolean; flagB: boolean }) {
  const { flagA, flagB } = config;
}
```

现在，函数将会被 `foo({ flagA, flagB })` 的形式调用，这样有利于发现错误及代码审查。

> [!TIP]
>
> 如果你的函数足够简单，并且你不希望增加代码，忽略这个建议。

## Truthy

JavaScript 有一个 `truthy` 概念，即在某些场景下会被推断为 `true`，例如除 `0` 以外的任何数字：

```ts
if (123) {
  // 将会被推断出 `true`
  console.log('Any number other than 0 is truthy');
}
```

你可以用下表来做参考：

| **Variable Type**                                | **When it is falsy** | **When it is truthy** |
| ------------------------------------------------ | -------------------- | --------------------- |
| boolean                                          | false                | true                  |
| string                                           | ' ' (empty string)   | any other string      |
| number                                           | 0 NaN                | any other number      |
| null                                             | always               | never                 |
| Any other Object including empty ones like {},[] | never                | always                |

### 明确的

通过操作符 `!!`，你可以很容易的将某些值转化为布尔类型的值，例如：`!!foo`，它使用了两次 `!`，第一个 `!` 用来将其（在这里是 `foo`）转换为布尔值，但是这一操作取得的是其取反后的值，第二个取反时，能得到真正的布尔值。

这在很多地方都可以看到：

```ts
// Direct variables
const hasName = !!name;

// As members of objects
const someObj = {
  hasName: !!name
};

// ReactJS
{
  !!someName && <div>{someName}</div>;
}
```

## 构建切换

根据 JavaScript 项目的运行环境进行切换环境变量是很常见的，通过 webpack 可以很轻松地做到这一点，因为它支持基于环境变量的死代码排除。

在你的 `package.json script` 里，添加不同的编译目标：

```json
"build:test": "webpack -p --config ./src/webpack.config.js",
"build:prod": "webpack -p --define process.env.NODE_ENV='\"production\"' --config ./src/webpack.config.js"
```

当然，假设你已经安装了 webpack `npm install webpack`，现在，你可以运行 `npm run build:test` 了。

使用环境变量也超级简单：

```ts
/**
 * This interface makes sure we don't miss adding a property to both `prod` and `test`
 */
interface Config {
  someItem: string;
}

/**
 * We only export a single thing. The config.
 */
export let config: Config;

/**
 * `process.env.NODE_ENV` definition is driven from webpack
 *
 * The whole `else` block will be removed in the emitted JavaScript
 *  for a production build
 */
if (process.env.NODE_ENV === 'production') {
  config = {
    someItem: 'prod'
  };
  console.log('Running in prod');
} else {
  config = {
    someItem: 'test'
  };
  console.log('Running in test');
}
```

> [!TIP]
>
> 我们使用 `process.env.NODE_ENV` 仅仅是因为绝大多数 JavaScript 库中都使用此变量，例如：`React`。

## 类型安全的 Event Emitter

通常来说，在 Node.js 与传统的 JavaScript 里，你有一个单一的 Event Emitter，你可以用它来为不同的事件添加监听器。

```ts
const emitter = new EventEmitter();

// Emit
emitter.emit('foo', foo);
emitter.emit('bar', bar);

// Listen
emitter.on('foo', foo => console.log(foo));
emitter.on('bar', bar => console.log(bar));
```

实际上，在 `EventEmitter` 内部以映射数组的形式存储数据：

```ts
{ foo: [fooListeners], bar: [barListeners] }
```

为了事件的类型安全，你可以为每个事件类型创建一个 emitter：

```ts
const onFoo = new TypedEvent<Foo>();
const onBar = new TypedEvent<Bar>();

// Emit:
onFoo.emit(foo);
onBar.emit(bar);

// Listen:
onFoo.on(foo => console.log(foo));
onBar.on(bar => console.log(bar));
```

它一些优点：

- 事件的类型，能以变量的形式被发现。
- Event Emitter 非常容易被重构。
- 事件数据结构是类型安全的。

### 参考 TypedEvent

```ts
export interface Listener<T> {
  (event: T): any;
}

export interface Disposable {
  dispose(): any;
}

export class TypedEvent<T> {
  private listeners: Listener<T>[] = [];
  private listenersOncer: Listener<T>[] = [];

  public on = (listener: Listener<T>): Disposable => {
    this.listeners.push(listener);

    return {
      dispose: () => this.off(listener)
    };
  };

  public once = (listener: Listener<T>): void => {
    this.listenersOncer.push(listener);
  };

  public off = (listener: Listener<T>) => {
    const callbackIndex = this.listeners.indexOf(listener);
    if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
  };

  public emit = (event: T) => {
    this.listeners.forEach(listener => listener(event));

    this.listenersOncer.forEach(listener => listener(event));

    this.listenersOncer = [];
  };

  public pipe = (te: TypedEvent<T>): Disposable => {
    return this.on(e => te.emit(e));
  };
}
```