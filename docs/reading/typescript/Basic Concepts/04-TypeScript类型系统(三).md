---
tags: [TypeScript]
---

# TypeScript 类型系统（三）

## 类型兼容性

类型兼容性用于确定一个类型是否能赋值给其他类型。

如 `string` 类型与 `number` 类型不兼容：

```ts
let str: string = 'Hello';
let num: number = 123;

str = num; // Error: 'number' 不能赋值给 'string'
num = str; // Error: 'string' 不能赋值给 'number'
```

###  安全性

TypeScript 类型系统设计比较方便，它允许你有一些不正确的行为。例如：任何类型都能被赋值给 `any`，这意味着告诉编译器你可以做任何你想做的事情：

```ts
let foo: any = 123;
foo = 'hello';

foo.toPrecision(3);
```

### 结构化

TypeScript 对象是一种结构类型，这意味着只要结构匹配，名称也就无关紧要了：

```ts
interface Point {
  x: number;
  y: number;
}

class Point2D {
  constructor(public x: number, public y: number) {}
}

let p: Point;

// ok, 因为是结构化的类型
p = new Point2D(1, 2);
```

这允许你动态创建对象（就好像你在 `vanilla JS` 中使用一样），并且它如果能被推断，该对象仍然具有安全性。

```ts
interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const point2D: Point2D = { x: 0, y: 10 };
const point3D: Point3D = { x: 0, y: 10, z: 20 };
function iTakePoint2D(point: Point2D) {
  /* do something */
}

iTakePoint2D(point2D); // ok, 完全匹配
iTakePoint2D(point3D); // 额外的信息，没关系
iTakePoint2D({ x: 0 }); // Error: 没有 'y'
```

### 变体

对类型兼容性来说，变体是一个利于理解和重要的概念。

对一个简单类型 `Base` 和 `Child` 来说，如果 `Child` 是 `Base` 的子类，`Child` 的实例能被赋值给 `Base` 类型的变量。

> [!TIP]
>
> 这是多态性。

在由 `Base` 和 `Child` 组合的复杂类型的类型兼容性中，它取决于相同场景下的 `Base` 与 `Child` 的变体：

- 协变（Covariant）：只在同一个方向；
- 逆变（Contravariant）：只在相反的方向；
- 双向协变（Bivariant）：包括同一个方向和不同方向；
- 不变（Invariant）：如果类型不完全相同，则它们是不兼容的。

> [!TIP]
>
> 对于存在完全可变数据的健全的类型系统（如 JavaScript），`Invariant` 是一个唯一的有效可选属性，但是如我们所讨论的，*便利性*迫使我们作出一些不是很安全的选择。

关于协变和逆变的更多内容，请参考：[协变与逆变](https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html)。

### 函数

当你在比较两个函数时，这有一些你需要考虑到的事情。

#### 返回类型

协变（Covariant）：返回类型必须包含足够的数据。

```ts
interface Point2D {
  x: number;
  y: number;
}
interface Point3D {
  x: number;
  y: number;
  z: number;
}

let iMakePoint2D = (): Point2D => ({ x: 0, y: 0 });
let iMakePoint3D = (): Point3D => ({ x: 0, y: 0, z: 0 });

iMakePoint2D = iMakePoint3D;
iMakePoint3D = iMakePoint2D; // ERROR: Point2D 不能赋值给 Point3D
```

#### 参数数量

更少的参数数量是好的（如：函数能够选择性的忽略一些多余的参数），但是你得保证有足够的参数被使用了：

```ts
const iTakeSomethingAndPassItAnErr = (x: (err: Error, data: any) => void) => {
  /* 做一些其他的 */
};

iTakeSomethingAndPassItAnErr(() => null); // ok
iTakeSomethingAndPassItAnErr(err => null); // ok
iTakeSomethingAndPassItAnErr((err, data) => null); // ok

// Error: 参数类型 `(err: any, data: any, more: any) => null` 不能赋值给参数类型 `(err: Error, data: any) => void`
iTakeSomethingAndPassItAnErr((err, data, more) => null);
```

#### 可选的和 rest 参数

可选的（预先确定的）和 Rest 参数（任何数量的参数）都是兼容的：

```ts
let foo = (x: number, y: number) => {};
let bar = (x?: number, y?: number) => {};
let bas = (...args: number[]) => {};

foo = bar = bas;
bas = bar = foo;
```

> [!Note]
>
> 可选的（上例子中的 `bar`）与不可选的（上例子中的 `foo`）仅在选项为 `strictNullChecks` 为 `false` 时兼容。

#### 函数参数类型

双向协变（Bivariant）：旨在支持常见的事件处理方案。

```ts
// 事件等级
interface Event {
  timestamp: number;
}
interface MouseEvent extends Event {
  x: number;
  y: number;
}
interface KeyEvent extends Event {
  keyCode: number;
}

// 简单的事件监听
enum EventType {
  Mouse,
  Keyboard
}
function addEventListener(eventType: EventType, handler: (n: Event) => void) {
  // ...
}

// 不安全，但是有用，常见。函数参数的比较是双向协变。
addEventListener(EventType.Mouse, (e: MouseEvent) => console.log(e.x + ',' + e.y));

// 在安全情景下的一种不好方案
addEventListener(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + ',' + (<MouseEvent>e).y));
addEventListener(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + ',' + e.y)));

// 仍然不允许明确的错误，对完全不兼容的类型会强制检查
addEventListener(EventType.Mouse, (e: number) => console.log(e));
```

同样的，你也可以把 `Array<Child>` 赋值给 `Array<Base>` （协变），因为函数是兼容的。数组的协变需要所有的函数 `Array<Child>` 都能赋值给 `Array<Base>`，例如 `push(t: Child)` 能被赋值给 `push(t: Base)`，这都可以通过函数参数双向协变实现。

下面的代码对于其他语言的开发者来说，可能会感到很困惑，因为他们认为是有错误的，可是 Typescript 并不会报错：

```ts
interface Point2D {
  x: number;
  y: number;
}
interface Point3D {
  x: number;
  y: number;
  z: number;
}

let iTakePoint2D = (point: Point2D) => {};
let iTakePoint3D = (point: Point3D) => {};

iTakePoint3D = iTakePoint2D; // ok, 这是合理的
iTakePoint2D = iTakePoint3D; // ok，为什么？
```

### 枚举

- 枚举与数字类型相互兼容

```ts
enum Status {
  Ready,
  Waiting
}

let status = Status.Ready;
let num = 0;

status = num;
num = status;
```

- 来自于不同枚举的枚举变量，被认为是不兼容的：

```ts
enum Status {
  Ready,
  Waiting
}
enum Color {
  Red,
  Blue,
  Green
}

let status = Status.Ready;
let color = Color.Red;

status = color; // Error
```

### 类

- 仅仅只有实例成员和方法会相比较，构造函数和静态成员不会被检查。

```ts
class Animal {
  feet: number;
  constructor(name: string, numFeet: number) {}
}

class Size {
  feet: number;
  constructor(meters: number) {}
}

let a: Animal;
let s: Size;

a = s; // OK
s = a; // OK
```

- 私有的和受保护的成员必须来自于相同的类。

```ts
class Animal {
  protected feet: number;
}
class Cat extends Animal {}

let animal: Animal;
let cat: Cat;

animal = cat; // ok
cat = animal; // ok

class Size {
  protected feet: number;
}

let size: Size;

animal = size; // ERROR
size = animal; // ERROR
```

### 泛型

TypeScript 类型系统基于变量的结构，仅当类型参数在被一个成员使用时，才会影响兼容性。如下例子中，`T` 对兼容性没有影响：

```ts
interface Empty<T> {}

let x: Empty<number>;
let y: Empty<string>;

x = y; // ok
```

当 `T` 被成员使用时，它将在实例化泛型后影响兼容性：

```ts
interface Empty<T> {
  data: T;
}

let x: Empty<number>;
let y: Empty<string>;

x = y; // Error
```

如果尚未实例化泛型参数，则在检查兼容性之前将其替换为 `any`：

```ts
let identity = function<T>(x: T): T {
  // ...
};

let reverse = function<U>(y: U): U {
  // ...
};

identity = reverse; // ok, 因为 `(x: any) => any` 匹配 `(y: any) => any`
```

类中的泛型兼容性与前文所提及一致：

```ts
class List<T> {
  add(val: T) {}
}

class Animal {
  name: string;
}
class Cat extends Animal {
  meow() {
    // ..
  }
}

const animals = new List<Animal>();
animals.add(new Animal()); // ok
animals.add(new Cat()); // ok

const cats = new List<Cat>();
cats.add(new Animal()); // Error
cats.add(new Cat()); // ok
```

### 脚注：不变性（Invariance）

我们说过，不变性可能是唯一一个听起来合理的选项，这里有一个关于 `contra` 和 `co` 的变体，被认为对数组是不安全的。

```ts
class Animal {
  constructor(public name: string) {}
}
class Cat extends Animal {
  meow() {
    console.log('cat');
  }
}

let animal = new Animal('animal');
let cat = new Cat('cat');

// 多态
// Animal <= Cat

animal = cat; // ok
cat = animal; // ERROR: cat 继承于 animal

// 演示每个数组形式
let animalArr: Animal[] = [animal];
let catArr: Cat[] = [cat];

// 明显的坏处，逆变
// Animal <= Cat
// Animal[] >= Cat[]
catArr = animalArr; // ok, 如有有逆变
catArr[0].meow(); // 允许，但是会在运行时报错

// 另外一个坏处，协变
// Animal <= Cat
// Animal[] <= Cat[]
animalArr = catArr; // ok，协变

animalArr.push(new Animal('another animal')); // 仅仅是 push 一个 animal 至 carArr 里
catArr.forEach(c => c.meow()); // 允许，但是会在运行时报错。
```

## Never

> [!TIP]
>
> [一个关于 never 的介绍视频](https://egghead.io/lessons/typescript-use-the-never-type-to-avoid-code-with-dead-ends-using-typescript)

程序语言的设计确实应该存在一个底部类型的概念，当你在分析代码流的时候，这会是一个理所当然存在的类型。TypeScript 就是这样一种分析代码流的语言（😎），因此它需要一个可靠的，代表永远不会发生的类型。

`never` 类型是 TypeScript 中的底层类型。它自然被分配的一些例子：

- 一个从来不会有返回值的函数（如：如果函数内含有 `while(true) {}`）；
- 一个总是会抛出错误的函数（如：`function foo() { throw new Error('Not Implemented') }`，`foo` 的返回类型是 `never`）；

你也可以将它用做类型注解：

```ts
let foo: never; // ok
```

但是，`never` 类型仅能被赋值给另外一个 `never`：

```ts
let foo: never = 123; // Error: number 类型不能赋值给 never 类型

// ok, 作为函数返回类型的 never
let bar: never = (() => {
  throw new Error('Throw my hands in the air like I just dont care');
})();
```

很棒，现在让我们看看它的关键用例。

### 用例：详细的检查

```ts
function foo(x: string | number): boolean {
  if (typeof x === 'string') {
    return true;
  } else if (typeof x === 'number') {
    return false;
  }

  // 如果不是一个 never 类型，这会报错：
  // - 不是所有条件都有返回值 （严格模式下）
  // - 或者检查到无法访问的代码
  // 但是由于 TypeScript 理解 `fail` 函数返回为 `never` 类型
  // 它可以让你调用它，因为你可能会在运行时用它来做安全或者详细的检查。
  return fail('Unexhaustive');
}

function fail(message: string): never {
  throw new Error(message);
}
```

`never` 仅能被赋值给另外一个 `never` 类型，因此你可以用它来进行编译时的全面的检查，我们将会在[辨析联合类型](https://jkchao.github.io/typescript-book-chinese/typings/discrominatedUnion.html)中讲解它。

### 与 `void` 的差异

一旦有人告诉你，`never` 表示一个从来不会优雅的返回的函数时，你可能马上就会想到与此类似的 `void`，然而实际上，`void` 表示没有任何类型，`never` 表示永远不存在的值的类型。

当一个函数返回空值时，它的返回值为 void 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 never 类型。void 类型可以被赋值（在 strictNullChecking 为 false 时），但是除了 never 本身以外，其他任何类型不能赋值给 never。

## 辨析联合类型

当类中含有[字面量成员](https://jkchao.github.io/typescript-book-chinese/typings/literals.html)时，我们可以用该类的属性来辨析联合类型。

作为一个例子，考虑 `Square` 和 `Rectangle` 的联合类型 `Shape`。`Square` 和 `Rectangle`有共同成员 `kind`，因此 `kind` 存在于 `Shape` 中。

```ts
interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Square | Rectangle;
```

如果你使用类型保护风格的检查（`==`、`===`、`!=`、`!==`）或者使用具有判断性的属性（在这里是 `kind`），TypeScript 将会认为你会使用的对象类型一定是拥有特殊字面量的，并且它会为你自动把类型范围变小：

```ts
function area(s: Shape) {
  if (s.kind === 'square') {
    // 现在 TypeScript 知道 s 的类型是 Square
    // 所以你现在能安全使用它
    return s.size * s.size;
  } else {
    // 不是一个 square ？因此 TypeScript 将会推算出 s 一定是 Rectangle
    return s.width * s.height;
  }
}
```

### 详细的检查

通常，联合类型的成员有一些自己的行为（代码）：

```ts
interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

// 有人仅仅是添加了 `Circle` 类型
// 我们可能希望 TypeScript 能在任何被需要的地方抛出错误
interface Circle {
  kind: 'circle';
  radius: number;
}

type Shape = Square | Rectangle | Circle;
```

一个可能会让你的代码变差的例子：

```ts
function area(s: Shape) {
  if (s.kind === 'square') {
    return s.size * s.size;
  } else if (s.kind === 'rectangle') {
    return s.width * s.height;
  }

  // 如果你能让 TypeScript 给你一个错误，这是不是很棒？
}
```

你可以通过一个简单的向下思想，来确保块中的类型被推断为与 `never` 类型兼容的类型。例如，你可以添加一个更详细的检查来捕获错误：

```ts
function area(s: Shape) {
  if (s.kind === 'square') {
    return s.size * s.size;
  } else if (s.kind === 'rectangle') {
    return s.width * s.height;
  } else {
    // Error: 'Circle' 不能被赋值给 'never'
    const _exhaustiveCheck: never = s;
  }
}
```

它将强制你添加一种新的条件：

```ts
function area(s: Shape) {
  if (s.kind === 'square') {
    return s.size * s.size;
  } else if (s.kind === 'rectangle') {
    return s.width * s.height;
  } else if (s.kind === 'circle') {
    return Math.PI * s.radius ** 2;
  } else {
    // ok
    const _exhaustiveCheck: never = s;
  }
}
```

### Switch

> [!TIP]
>
> 你可以通过 `switch` 来实现以上例子。

```ts
function area(s: Shape) {
  switch (s.kind) {
    case 'square':
      return s.size * s.size;
    case 'rectangle':
      return s.width * s.height;
    case 'circle':
      return Math.PI * s.radius ** 2;
    default:
      const _exhaustiveCheck: never = s;
  }
}
```

### strictNullChecks

如果你使用 `strictNullChecks` 选项来做详细的检查，你应该返回 `_exhaustiveCheck` 变量（类型是 `never`），否则 TypeScript 可能会推断返回值为 `undefined`：

```ts
function area(s: Shape) {
  switch (s.kind) {
    case 'square':
      return s.size * s.size;
    case 'rectangle':
      return s.width * s.height;
    case 'circle':
      return Math.PI * s.radius ** 2;
    default:
      const _exhaustiveCheck: never = s;
      return _exhaustiveCheck;
  }
}
```

### Redux

Redux 库正是使用的上述例子。

以下是添加了 TypeScript 类型注解的[redux 要点](https://github.com/reduxjs/redux#the-gist)。

```ts
import { createStore } from 'redux';

type Action =
  | {
      type: 'INCREMENT';
    }
  | {
      type: 'DECREMENT';
    };

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function counter(state = 0, action: Action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter);

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

store.subscribe(() => console.log(store.getState()));

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' });
// 1
store.dispatch({ type: 'INCREMENT' });
// 2
store.dispatch({ type: 'DECREMENT' });
// 1
```

与 TypeScript 一起使用可以有效的防止拼写错误，并且能提高重构和书写文档化代码的能力。

## 索引签名

可以用字符串访问 JavaScript 中的对象（TypeScript 中也一样），用来保存对其他对象的引用。

例如：

```ts
let foo: any = {};
foo['Hello'] = 'World';
console.log(foo['Hello']); // World
```

我们在键 `Hello` 下保存了一个字符串 `World`，除字符串外，它也可以保存任意的 JavaScript 对象，例如一个类的实例。

```ts
class Foo {
  constructor(public message: string) {}
  log() {
    console.log(this.message);
  }
}

let foo: any = {};
foo['Hello'] = new Foo('World');
foo['Hello'].log(); // World
```

当你传入一个其他对象至索引签名时，JavaScript 会在得到结果之前会先调用 `.toString` 方法：

```ts
let obj = {
  toString() {
    console.log('toString called');
    return 'Hello';
  }
};

let foo: any = {};
foo[obj] = 'World'; // toString called
console.log(foo[obj]); // toString called, World
console.log(foo['Hello']); // World
```

> [!TIP]
>
> 只要索引位置使用了 `obj`，`toString` 方法都将会被调用。

数组有点稍微不同，对于一个 `number` 类型的索引签名，JavaScript 引擎将会尝试去优化（这取决于它是否是一个真的数组、存储的项目结构是否匹配等）。因此，`number` 应该被考虑作为一个有效的对象访问器（这与 `string` 不同），如下例子：

```ts
let foo = ['World'];
console.log(foo[0]); // World
```

因此，这就是 JavaScript。现在让我们看看 TypeScript 对这些概念更优雅的处理。

### TypeScript 索引签名

JavaScript 在一个对象类型的索引签名上会隐式调用 `toString` 方法，而在 TypeScript 中，为防止初学者砸伤自己的脚（我总是看到 stackoverflow 上有很多 JavaScript 使用者都会这样。），它将会抛出一个错误。

```ts
const obj = {
  toString() {
    return 'Hello';
  }
};

const foo: any = {};

// ERROR: 索引签名必须为 string, number....
foo[obj] = 'World';

// FIX: TypeScript 强制你必须明确这么做：
foo[obj.toString()] = 'World';
```

强制用户必须明确的写出 `toString()` 的原因是：在对象上默认执行的 `toString` 方法是有害的。例如 v8 引擎上总是会返回 `[object Object]`

```ts
const obj = { message: 'Hello' };
let foo: any = {};

// ERROR: 索引签名必须为 string, number....
foo[obj] = 'World';

// 这里实际上就是你存储的地方
console.log(foo['[object Object]']); // World
```

当然，数字类型是被允许的，这是因为：

- 需要对数组 / 元组完美的支持；
- 即使你在上例中使用 `number` 类型的值来替代 `obj`，`number` 类型默认的 `toString` 方法实现的很友好（不是 `[object Object]`）。

如下所示：

```ts
console.log((1).toString()); // 1
console.log((2).toString()); // 2
```

因此，我们有以下结论：

> [!TIP]
>
> TypeScript 的索引签名必须是 `string` 或者 `number`。
>
> `symbols` 也是有效的，TypeScript 支持它。在接下来我们将会讲解它。

### 声明一个索引签名

在上文中，我们通过使用 `any` 来让 TypeScript 允许我们可以做任意我们想做的事情。实际上，我们可以明确的指定索引签名。例如：假设你想确认存储在对象中任何内容都符合 `{ message: string }` 的结构，你可以通过 `[index: string]: { message: string }` 来实现。

```ts
const foo: {
  [index: string]: { message: string };
} = {};

// 储存的东西必须符合结构
// ok
foo['a'] = { message: 'some message' };

// Error, 必须包含 `message`
foo['a'] = { messages: 'some message' };

// 读取时，也会有类型检查
// ok
foo['a'].message;

// Error: messages 不存在
foo['a'].messages;
```

> [!TIP]
>
> 索引签名的名称（如：`{ [index: string]: { message: string } }` 里的 `index` ）除了可读性外，并没有任何意义。例如：如果有一个用户名，你可以使用 `{ username: string}: { message: string }`，这有利于下一个开发者理解你的代码。

`number` 类型的索引也支持：`{ [count: number]: 'SomeOtherTypeYouWantToStoreEgRebate' }`。

### 所有成员都必须符合字符串的索引签名

当你声明一个索引签名时，所有明确的成员都必须符合索引签名：

```ts
// ok
interface Foo {
  [key: string]: number;
  x: number;
  y: number;
}

// Error
interface Bar {
  [key: string]: number;
  x: number;
  y: string; // Error: y 属性必须为 number 类型
}
```

这可以给你提供安全性，任何以字符串的访问都能得到相同结果。

```ts
interface Foo {
  [key: string]: number;
  x: number;
}

let foo: Foo = {
  x: 1,
  y: 2
};

// 直接
foo['x']; // number

// 间接
const x = 'x';
foo[x]; // number
```

### 使用一组有限的字符串字面量

一个索引签名可以通过映射类型来使索引字符串为联合类型中的一员，如下所示：

```ts
type Index = 'a' | 'b' | 'c';
type FromIndex = { [k in Index]?: number };

const good: FromIndex = { b: 1, c: 2 };

// Error:
// `{ b: 1, c: 2, d: 3 }` 不能分配给 'FromIndex'
// 对象字面量只能指定已知类型，'d' 不存在 'FromIndex' 类型上
const bad: FromIndex = { b: 1, c: 2, d: 3 };
```

这通常与 `keyof/typeof` 一起使用，来获取变量的类型，在下一章节中，我们将解释它。

变量的规则一般可以延迟被推断：

```ts
type FromSomeIndex<K extends string> = { [key in K]: number };
```

### 同时拥有 `string` 和 `number` 类型的索引签名

这并不是一个常见的用例，但是 TypeScript 支持它。

`string` 类型的索引签名比 `number` 类型的索引签名更严格。这是故意设计，它允许你有如下类型：

```ts
interface ArrStr {
  [key: string]: string | number; // 必须包括所用成员类型
  [index: number]: string; // 字符串索引类型的子级

  // example
  length: number;
}
```

### 设计模式：索引签名的嵌套

> [!TIP]
>
> 添加索引签名时，需要考虑的 API。

在 JavaScript 社区你将会见到很多滥用索引签名的 API。如 JavaScript 库中使用 CSS 的常见模式：

```ts
interface NestedCSS {
  color?: string; // strictNullChecks=false 时索引签名可为 undefined
  [selector: string]: string | NestedCSS;
}

const example: NestedCSS = {
  color: 'red',
  '.subclass': {
    color: 'blue'
  }
};
```

尽量不要使用这种把字符串索引签名与有效变量混合使用。如果属性名称中有拼写错误，这个错误不会被捕获到：

```ts
const failsSilently: NestedCSS = {
  colour: 'red' // 'colour' 不会被捕捉到错误
};
```

取而代之，我们把索引签名分离到自己的属性里，如命名为 `nest`（或者 `children`、`subnodes` 等）：

```ts
interface NestedCSS {
  color?: string;
  nest?: {
    [selector: string]: NestedCSS;
  };
}

const example: NestedCSS = {
  color: 'red',
  nest: {
    '.subclass': {
      color: 'blue'
    }
  }
}

const failsSliently: NestedCSS = {
  colour: 'red'  // TS Error: 未知属性 'colour'
}
```

### 索引签名中排除某些属性

有时，你需要把属性合并至索引签名（虽然我们并不建议这么做，你应该使用上文中提到的嵌套索引签名的形式），如下例子：

```ts
type FieldState = {
  value: string;
};

type FromState = {
  isValid: boolean; // Error: 不符合索引签名
  [filedName: string]: FieldState;
};
```

TypeScript 会报错，因为添加的索引签名，并不兼容它原有的类型，使用交叉类型可以解决上述问题：

```ts
type FieldState = {
  value: string;
};

type FormState = { isValid: boolean } & { [fieldName: string]: FieldState };
```

请注意尽管你可以声明它至一个已存在的 TypeScript 类型上，但是你不能创建如下的对象：

```ts
type FieldState = {
  value: string;
};

type FormState = { isValid: boolean } & { [fieldName: string]: FieldState };

// 将它用于从某些地方获取的 JavaScript 对象
declare const foo: FormState;

const isValidBool = foo.isValid;
const somethingFieldState = foo['something'];

// 使用它来创建一个对象时，将不会工作
const bar: FormState = {
  // 'isValid' 不能赋值给 'FieldState'
  isValid: false
};
```

## 流动的类型

TypeScript 类型系统非常强大，它支持其他任何单一语言无法实现的类型流动和类型片段。

这是因为 TypeScript 的设计目的之一是让你无缝与像 JavaScript 这类高动态的语言一起工作。在这里，我们介绍一些在 TypeScript 中使用移动类型的技巧。

关键的动机：当你改变了其中一个时，其他相关的会自动更新，并且当有事情变糟糕时，你会得到一个友好的提示，就好像一个被精心设计过的约束系统。

### 复制类型和值

如果你想移动一个类，你可能会想要做以下事情：

```ts
class Foo {}

const Bar = Foo;

let bar: Bar; // Error: 不能找到名称 'Bar'
```

这会得到一个错误，因为 `const` 仅仅是复制了 `Foo` 到一个变量声明空间，因此你无法把 `Bar` 当作一个类型声明使用。正确的方式是使用 `import` 关键字，请注意，如果你在使用 `namespace` 或者 `modules`，使用 `import` 是你唯一能用的方式：

```ts
namespace importing {
  export class Foo {}
}

import Bar = importing.Foo;
let bar: Bar; // ok
```

这个 `import` 技巧，仅适合于类型和变量。

### 捕获变量的类型

你可以通过 `typeof` 操作符在类型注解中使用变量。这允许你告诉编译器，一个变量的类型与其他类型相同，如下所示：

```ts
let foo = 123;
let bar: typeof foo; // 'bar' 类型与 'foo' 类型相同（在这里是： 'number'）

bar = 456; // ok
bar = '789'; // Error: 'string' 不能分配给 'number' 类型
```

### 捕获类成员的类型

与捕获变量的类型相似，你仅仅是需要声明一个变量用来捕获到的类型：

```ts
class Foo {
  foo: number; // 我们想要捕获的类型
}

declare let _foo: Foo;

// 与之前做法相同
let bar: typeof _foo.foo;
```

### 捕获字符串类型

许多 JavaScript 库和框架都使用原始的 JavaScript 字符串，你可以使用 `const` 定义一个变量捕获它的类型：

```ts
// 捕获字符串的类型与值
const foo = 'Hello World';

// 使用一个捕获的类型
let bar: typeof foo;

// bar 仅能被赋值 'Hello World'
bar = 'Hello World'; // ok
bar = 'anything else'; // Error
```

在这个例子里，`bar` 有字面量类型 `Hello World`，我们在[字面量类型](https://jkchao.github.io/typescript-book-chinese/typings/literals.html)章节已经深入讨论。

### 捕获键的名称

`keyof` 操作符能让你捕获一个类型的键。例如，你可以使用它来捕获变量的键名称，在通过使用 `typeof` 来获取类型之后：

```ts
const colors = {
  red: 'red',
  blue: 'blue'
};

type Colors = keyof typeof colors;

let color: Colors; // color 的类型是 'red' | 'blue'
color = 'red'; // ok
color = 'blue'; // ok
color = 'anythingElse'; // Error
```

这允许你很容易地拥有像字符串枚举+常量这样的类型，如上例所示。

## 异常处理

JavaScript 有一个 `Error` 类，用于处理异常。你可以通过 `throw` 关键字来抛出一个错误。然后通过 `try/catch` 块来捕获此错误：

```ts
try {
  throw new Error('Something bad happened');
} catch (e) {
  console.log(e);
}
```

### 错误子类型

除内置的 `Error` 类外，还有一些额外的内置错误，它们继承自 `Error` 类：

#### RangeError

当数字类型变量或者参数超出其有效范围时，出现 `RangeError` 的错误提示：

```ts
// 使用过多参数调用 console
console.log.apply(console, new Array(1000000000)); // RangeError: 数组长度无效
```

#### ReferenceError

当引用无效时，会出现 `ReferenceError` 的错误提示：

```ts
'use strict';
console.log(notValidVar); // ReferenceError: notValidVar 未定义
```

#### SyntaxError

当解析无效 JavaScript 代码时，会出现 `SyntaxError` 的错误提示：

```ts
1 *** 3   // SyntaxError: 无效的标记 *
```

#### TypeError

变量或者参数不是有效类型时，会出现 `TypeError` 的错误提示：

```ts
'1.2'.toPrecision(1); // TypeError: '1.2'.toPrecision 不是函数。
```

#### URIError

当传入无效参数至 `encodeURI()` 和 `decodeURI()` 时，会出现 `URIError` 的错误提示：

```ts
decodeURI('%'); // URIError: URL 异常
```

### 使用 `Error`

JavaScript 初学者可能有时候仅仅是抛出一个原始字符串：

```ts
try {
  throw 'Something bad happened';
} catch (e) {
  console.log(e);
}
```

**不要这么做**，使用 `Error` 对象的基本好处是，它能自动跟踪堆栈的属性构建以及生成位置。

原始字符串会导致极差的调试体验，并且在分析日志时，将会变得错综复杂。

### 你并不需要 `throw` 抛出一个错误

传递一个 `Error` 对象是没问题的，这种方式在 `Node.js` 回调函数中非常常见，它用第一个参数作为错误对象进行回调处理。

```ts
function myFunction (callback: (e: Error)) {
  doSomethingAsync(function () {
    if (somethingWrong) {
      callback(new Error('This is my error'));
    } else {
      callback();
    }
  })
}
```

### 优秀的用例

「Exceptions should be exceptional」是计算机科学中常用用语。这里有一些原因说明在 JavaScript(TypeScript) 中也是如此。

#### 不清楚从哪里抛出错误

考虑如下代码块：

```ts
try {
  const foo = runTask1();
  const bar = runTask2();
} catch (e) {
  console.log('Error:', e);
}
```

下一个开发者可能并不清楚哪个函数可能会抛出错误。在没有阅读 `task1/task2` 代码以及他们可能会调用的函数时，对代码 `review` 的人员可能也不会知道错误会从哪里抛出。

#### 优雅的捕获错误

你可以通过为每个可能抛出错误的代码显式捕获，来使其优雅：

```ts
try {
  const foo = runTask1();
} catch (e) {
  console.log('Error:', e);
}

try {
  const bar = runTask2();
} catch (e) {
  console.log('Error:', e);
}
```

但是现在，如果你想从第一个任务中传递变量到第二个任务中，代码会变的混乱（注意：foo 变量需要用 let 显式注解它，因为它不能从 `runTask1` 中返回出来）：

```ts
let foo: number; // Notice 使用 let 并且显式注明类型注解

try {
  foo = runTask1();
} catch (e) {
  console.log('Error:', e);
}

try {
  const bar = runTask2(foo);
} catch (e) {
  console.log('Error:', e);
}
```

#### 没有在类型系统中很好的表示

考虑如下函数：

```ts
function validate(value: number) {
  if (value < 0 || value > 100) {
    throw new Error('Invalid value');
  }
}
```

在这种情境下使用 `Error` 不是一个好的主意。因为没有用来验证函数的类型定义（如：`(value: number) => void`），取而代之一个更好的方式是创建一个验证方法：

```ts
function validate(
  value: number
): {
  error?: string;
} {
  if (value < 0 || value > 100) {
    return { error: 'Invalid value' };
  }
}
```

现在它具有类型定义了。

> [!TIP]
>
> 除非你想用以非常通用（try/catch）的方式处理错误，否则不要抛出错误。

## 混合

TypeScript (和 JavaScript) 类只能严格的单继承，因此你不能做：

```ts
class User extends Tagged, Timestamped { // ERROR : 不能多重继承
  // ..
}
```

从可重用组件构建类的另一种方式是通过基类来构建它们，这种方式称为混合。

这个主意是简单的，采用函数 B 接受一个类 A，并且返回一个带有新功能的类的方式来替代 A 类扩展 B 来获取 B 上的功能，前者中的 B 即是混合。

> [!TIP]
>
> 「混合」是一个函数：
>
> - 传入一个构造函数；
> - 创建一个带有新功能，并且扩展构造函数的新类；
> - 返回这个新类。

一个完整的例子：

```ts
// 所有 mixins 都需要
type Constructor<T = {}> = new (...args: any[]) => T;

/////////////
// mixins 例子
////////////

// 添加属性的混合例子
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

// 添加属性和方法的混合例子
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false;

    activate() {
      this.isActivated = true;
    }

    deactivate() {
      this.isActivated = false;
    }
  };
}

///////////
// 组合类
///////////

// 简单的类
class User {
  name = '';
}

// 添加 Timestamped 的 User
const TimestampedUser = Timestamped(User);

// Tina Timestamped 和 Activatable 的类
const TimestampedActivatableUser = Timestamped(Activatable(User));

//////////
// 使用组合类
//////////

const timestampedUserExample = new TimestampedUser();
console.log(timestampedUserExample.timestamp);

const timestampedActivatableUserExample = new TimestampedActivatableUser();
console.log(timestampedActivatableUserExample.timestamp);
console.log(timestampedActivatableUserExample.isActivated);
```

让我们分解这个例子。

### 创建一个构造函数

混合接受一个类，并且使用新功能扩展它。因此，我们需要定义构造函数的类型：

```ts
type Constructor<T = {}> = new (...args: any[]) => T;
```

### 扩展一个类并且返回它

```ts
// 添加属性的混合例子
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}
```

## ThisType

通过 `ThisType` 我们可以在对象字面量中键入 `this`，并提供通过上下文类型控制 `this` 类型的便捷方式。它只有在 `--noImplicitThis` 的选项下才有效。

现在，在对象字面量方法中的 `this` 类型，将由以下决定：

- 如果这个方法显式指定了 `this` 参数，那么 `this` 具有该参数的类型。（下例子中 `bar`）
- 否则，如果方法由带 `this` 参数的签名进行上下文键入，那么 `this` 具有该参数的类型。（下例子中 `foo`）
- 否则，如果 `--noImplicitThis` 选项已经启用，并且对象字面量中包含由 `ThisType<T>` 键入的上下文类型，那么 `this` 的类型为 `T`。
- 否则，如果 `--noImplicitThis` 选项已经启用，并且对象字面量中不包含由 `ThisType<T>` 键入的上下文类型，那么 `this` 的类型为该上下文类型。
- 否则，如果 `--noImplicitThis` 选项已经启用，`this` 具有该对象字面量的类型。
- 否则，`this` 的类型为 `any`。

一些例子：

```ts
// Compile with --noImplicitThis

type Point = {
  x: number;
  y: number;
  moveBy(dx: number, dy: number): void;
};

let p: Point = {
  x: 10,
  y: 20,
  moveBy(dx, dy) {
    this.x += dx; // this has type Point
    this.y += dy; // this has type Point
  }
};

let foo = {
  x: 'hello',
  f(n: number) {
    this; // { x: string, f(n: number): void }
  }
};

let bar = {
  x: 'hello',
  f(this: { message: string }) {
    this; // { message: string }
  }
};
```

类似的方式，当使用 `--noImplicitThis` 时，函数表达式赋值给 `obj.xxx` 或者 `obj[xxx]` 的目标时，在函数中 `this` 的类型将会是 `obj`：

```ts
// Compile with --noImplicitThis

obj.f = function(n) {
  return this.x - n; // 'this' has same type as 'obj'
};

obj['f'] = function(n) {
  return this.x - n; // 'this' has same type as 'obj'
};
```

通过 API 转换参数的形式来生成 `this` 的值的情景下，可以通过创建一个新的 `ThisType<T>` 标记接口，可用于在上下文中表明转换后的类型。尤其是当字面量中的上下文类型为 `ThisType<T>` 或者是包含 `ThisType<T>` 的交集时，显得尤为有效，对象字面量方法中 `this` 的类型即为 `T`。

```ts
// Compile with --noImplicitThis

type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    }
  }
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

在上面的例子中，`makeObject` 参数中的对象属性 `methods` 具有包含 `ThisType<D & M>` 的上下文类型，因此对象中 `methods` 属性下的方法的 `this` 类型为 `{ x: number, y: number } & { moveBy(dx: number, dy: number): number }`。

`ThisType<T>` 的接口，在 `lib.d.ts` 只是被声明为空的接口，除了可以在对象字面量上下文中可以被识别以外，该接口的作用等同于任意空接口。
