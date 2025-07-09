---
tags: [TypeScript]
---

# TypeScript 类型系统（二）

## 函数

函数类型在 TypeScript 类型系统中扮演着非常重要的角色，它们是可组合系统的核心构建块。

### 参数注解

你可以注解函数参数，就像你可以注解其他变量一样:

```ts
// variable annotation
let sampleVariable: { bar: number };

// function parameter annotation
function foo(sampleParameter: { bar: number }) {}
```

这里我们使用了内联类型注解，除此之外，你还可以使用接口等其他方式。

### 返回类型注解

你可以在函数参数列表之后使用与变量相同的样式来注解返回类型，如例子中 `：Foo`：

```ts
interface Foo {
  foo: string;
}

// Return type annotated as `: Foo`
function foo(sample: Foo): Foo {
  return sample;
}
```

我们在这里使用了一个 `interface`，但你可以自由地使用其他注解方式，例如内联注解。

通常，你不*需要*注解函数的返回类型，因为它可以由编译器推断：

```ts
interface Foo {
  foo: string;
}

function foo(sample: Foo) {
  return sample; // inferred return type 'Foo'
}
```

但是，添加这些注解以帮助解决错误提示通常是一个好主意，例如：

```ts
function foo() {
  return { fou: 'John Doe' }; // You might not find this misspelling of `foo` till it's too late
}

sendAsJSON(foo());
```

如果你不打算从函数返回任何内容，则可以将其标注为：`void` 。你通常可以删除 `void`， TypeScript 能推导出来：

### 可选参数

你可以将参数标记为可选:

```ts
function foo(bar: number, bas?: string): void {
  // ..
}

foo(123);
foo(123, 'hello');
```

或者，当调用者没有提供该参数时，你可以提供一个默认值（在参数声明后使用 `= someValue` ）：

```ts
function foo(bar: number, bas: string = 'hello') {
  console.log(bar, bas);
}

foo(123); // 123, hello
foo(123, 'world'); // 123, world
```

### 重载

TypeScript 允许你声明函数重载。这对于文档 + 类型安全来说很实用。请思考以下代码：

```ts
function padding(a: number, b?: number, c?: number, d?: any) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };
}
```

如果仔细查看代码，就会发现 a，b，c，d 的值会根据传入的参数数量而变化。此函数也只需要 1 个，2 个或 4 个参数。可以使用函数重载来*强制*和*记录*这些约束。你只需多次声明函数头。最后一个函数头是在函数体内实际处于活动状态但不可用于外部。

如下所示:

```ts
// 重载
function padding(all: number);
function padding(topAndBottom: number, leftAndRight: number);
function padding(top: number, right: number, bottom: number, left: number);
// Actual implementation that is a true representation of all the cases the function body needs to handle
function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };
}
```

这里前三个函数头可有效调用 `padding`:

```ts
padding(1); // Okay: all
padding(1, 1); // Okay: topAndBottom, leftAndRight
padding(1, 1, 1, 1); // Okay: top, right, bottom, left

padding(1, 1, 1); // Error: Not a part of the available overloads
```

当然，最终声明（从函数内部看到的真正声明）与所有重载兼容是很重要的。这是因为这是函数体需要考虑的函数调用的真实性质。

TIP

TypeScript 中的函数重载没有任何运行时开销。它只允许你记录希望调用函数的方式，并且编译器会检查其余代码。

### 函数声明

> 快速开始：类型注解是你描述现有实现类型的一种方式

在没有提供函数实现的情况下，有两种声明函数类型的方式:

```ts
type LongHand = {
  (a: number): number;
};

type ShortHand = (a: number) => number;
```

上面代码中的两个例子完全相同。但是，当你想使用函数重载时，只能用第一种方式:

```ts
type LongHandAllowsOverloadDeclarations = {
  (a: number): number;
  (a: string): string;
};
```

## 可调用的

你可以使用类型别名或者接口来表示一个可被调用的类型注解：

```ts
interface ReturnString {
  (): string;
}
```

它可以表示一个返回值为 `string` 的函数：

```ts
declare const foo: ReturnString;

const bar = foo(); // bar 被推断为一个字符串。
```

### 一个实际的例子

当然，像这样一个可被调用的类型注解，你也可以根据实际来传递任何参数、可选参数以及 rest 参数，这有一个稍微复杂的例子：

```ts
interface Complex {
  (foo: string, bar?: number, ...others: boolean[]): number;
}
```

一个接口可提供多种调用签名，用以特殊的函数重载：

```ts
interface Overloaded {
  (foo: string): string;
  (foo: number): number;
}

// 实现接口的一个例子：
function stringOrNumber(foo: number): number;
function stringOrNumber(foo: string): string;
function stringOrNumber(foo: any): any {
  if (typeof foo === 'number') {
    return foo * foo;
  } else if (typeof foo === 'string') {
    return `hello ${foo}`;
  }
}

const overloaded: Overloaded = stringOrNumber;

// 使用
const str = overloaded(''); // str 被推断为 'string'
const num = overloaded(123); // num 被推断为 'number'
```

这也可以用于内联注解中：

```ts
let overloaded: {
  (foo: string): string;
  (foo: number): number;
};
```

### 箭头函数

为了使指定可调用的类型签名更容易，TypeScript 也允许你使用简单的箭头函数类型注解。例如，在一个以 number 类型为参数，以 string 类型为返回值的函数中，你可以这么写：

```ts
const simple: (foo: number) => string = foo => foo.toString();
```

> [!TIP]
>
> 它仅仅只能作为简单的箭头函数，你无法使用重载。如果想使用重载，你必须使用完整的 `{ (someArgs): someReturn }` 的语法

### 可实例化

可实例化仅仅是可调用的一种特殊情况，它使用 `new` 作为前缀。它意味着你需要使用 `new` 关键字去调用它：

```ts
interface CallMeWithNewToGetString {
  new (): string;
}

// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar 被推断为 string 类型
```

## 类型断言

TypeScript 允许你覆盖它的推断，并且能以你任何你想要的方式分析它，这种机制被称为「类型断言」。TypeScript 类型断言用来告诉编译器你比它更了解这个类型，并且它不应该再发出错误。

类型断言的一个常见用例是当你从 JavaScript 迁移到 TypeScript 时：

```ts
const foo = {};
foo.bar = 123; // Error: 'bar' 属性不存在于 ‘{}’
foo.bas = 'hello'; // Error: 'bas' 属性不存在于 '{}'
```

这里的代码发出了错误警告，因为 `foo` 的类型推断为 `{}`，即没有属性的对象。因此，你不能在它的属性上添加 `bar` 或 `bas`，你可以通过类型断言来避免此问题：

```ts
interface Foo {
  bar: number;
  bas: string;
}

const foo = {} as Foo;
foo.bar = 123;
foo.bas = 'hello';
```

### `as foo` 与 `<foo>`

最初的断言语法如下所示：

```ts
let foo: any;
let bar = <string>foo; // 现在 bar 的类型是 'string'
```

然而，当你在 JSX 中使用 `<foo>` 的断言语法时，这会与 JSX 的语法存在歧义：

```ts
let foo = <string>bar;</string>;
```

因此，为了一致性，我们建议你使用 `as foo` 的语法来为类型断言。

### 类型断言与类型转换

它之所以不被称为「类型转换」，是因为转换通常意味着某种运行时的支持。但是，类型断言纯粹是一个编译时语法，同时，它也是一种为编译器提供关于如何分析代码的方法。

### 类型断言被认为是有害的

在很多情景下，断言能让你更容易的从遗留项目中迁移（甚至将其他代码粘贴复制到你的项目中），然而，你应该小心谨慎的使用断言。让我们用最初的代码作为示例，如果你没有按约定添加属性，TypeScript 编译器并不会对此发出错误警告：

```ts
interface Foo {
  bar: number;
  bas: string;
}

const foo = {} as Foo;

// ahhh, 忘记了什么？
```

另外一个常见的想法是使用类型断言来提供代码的提示：

```ts
interface Foo {
  bar: number;
  bas: string;
}

const foo = <Foo>{
  // 编译器将会提供关于 Foo 属性的代码提示
  // 但是开发人员也很容易忘记添加所有的属性
  // 同样，如果 Foo 被重构，这段代码也可能被破坏（例如，一个新的属性被添加）。
};
```

这也会存在一个同样的问题，如果你忘记了某个属性，编译器同样也不会发出错误警告。使用一种更好的方式：

```ts
interface Foo {
  bar: number;
  bas: string;
}

const foo: Foo = {
  // 编译器将会提供 Foo 属性的代码提示
};
```

在某些情景下，你可能需要创建一个临时的变量，但至少，你不会使用一个承诺（可能是假的），而是依靠类型推断来检查你的代码。

### 双重断言

类型断言，尽管我们已经证明了它并不是那么安全，但它也还是有用武之地。如下一个非常实用的例子所示，当使用者了解传入参数更具体的类型时，类型断言能按预期工作：

```ts
function handler(event: Event) {
  const mouseEvent = event as MouseEvent;
}
```

然而，如下例子中的代码将会报错，尽管使用者已经使用了类型断言：

```ts
function handler(event: Event) {
  const element = event as HTMLElement; // Error: 'Event' 和 'HTMLElement' 中的任何一个都不能赋值给另外一个
}
```

如果你仍然想使用那个类型，你可以使用双重断言。首先断言成兼容所有类型的 `any`，编译器将不会报错：

```ts
function handler(event: Event) {
  const element = (event as any) as HTMLElement; // ok
}
```

### TypeScript 是怎么确定单个断言是否足够

当 `S` 类型是 `T` 类型的子集，或者 `T` 类型是 `S` 类型的子集时，`S` 能被成功断言成 `T`。这是为了在进行类型断言时提供额外的安全性，完全毫无根据的断言是危险的，如果你想这么做，你可以使用 `any`。

## 类型保护

类型保护允许你使用更小范围下的对象类型。

### typeof

TypeScript 熟知 JavaScript 中 `instanceof` 和 `typeof` 运算符的用法。如果你在一个条件块中使用这些，TypeScript 将会推导出在条件块中的的变量类型。如下例所示，TypeScript 将会辨别 `string` 上是否存在特定的函数，以及是否发生了拼写错误：

```ts
function doSome(x: number | string) {
  if (typeof x === 'string') {
    // 在这个块中，TypeScript 知道 `x` 的类型必须是 `string`
    console.log(x.subtr(1)); // Error: 'subtr' 方法并没有存在于 `string` 上
    console.log(x.substr(1)); // ok
  }

  x.substr(1); // Error: 无法保证 `x` 是 `string` 类型
}
```

### instanceof

这有一个关于 `class` 和 `instanceof` 的例子：

```ts
class Foo {
  foo = 123;
  common = '123';
}

class Bar {
  bar = 123;
  common = '123';
}

function doStuff(arg: Foo | Bar) {
  if (arg instanceof Foo) {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  }
  if (arg instanceof Bar) {
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}

doStuff(new Foo());
doStuff(new Bar());
```

TypeScript 甚至能够理解 `else`。当你使用 `if` 来缩小类型时，TypeScript 知道在其他块中的类型并不是 `if` 中的类型：

```ts
class Foo {
  foo = 123;
}

class Bar {
  bar = 123;
}

function doStuff(arg: Foo | Bar) {
  if (arg instanceof Foo) {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    // 这个块中，一定是 'Bar'
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}

doStuff(new Foo());
doStuff(new Bar());
```

### in

`in` 操作符可以安全的检查一个对象上是否存在一个属性，它通常也被作为类型保护使用：

```ts
interface A {
  x: number;
}

interface B {
  y: string;
}

function doStuff(q: A | B) {
  if ('x' in q) {
    // q: A
  } else {
    // q: B
  }
}
```

### 字面量类型保护

当你在联合类型里使用字面量类型时，你可以检查它们是否有区别：

```ts
type Foo = {
  kind: 'foo'; // 字面量类型
  foo: number;
};

type Bar = {
  kind: 'bar'; // 字面量类型
  bar: number;
};

function doStuff(arg: Foo | Bar) {
  if (arg.kind === 'foo') {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    // 一定是 Bar
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}
```

### 使用定义的类型保护

JavaScript 并没有内置非常丰富的、运行时的自我检查机制。当你在使用普通的 JavaScript 对象时（使用结构类型，更有益处），你甚至无法访问 `instanceof` 和 `typeof`。在这种情景下，你可以创建*用户自定义的类型保护函数*，这仅仅是一个返回值为类似于`someArgumentName is SomeType` 的函数，如下：

```ts
// 仅仅是一个 interface
interface Foo {
  foo: number;
  common: string;
}

interface Bar {
  bar: number;
  common: string;
}

// 用户自己定义的类型保护！
function isFoo(arg: Foo | Bar): arg is Foo {
  return (arg as Foo).foo !== undefined;
}

// 用户自己定义的类型保护使用用例：
function doStuff(arg: Foo | Bar) {
  if (isFoo(arg)) {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}

doStuff({ foo: 123, common: '123' });
doStuff({ bar: 123, common: '123' });
```

## 泛型

设计泛型的关键目的是在成员之间提供有意义的约束，这些成员可以是：

- 类的实例成员
- 类的方法
- 函数参数
- 函数返回值

### 动机和示例

下面是对一个先进先出的数据结构——队列，在 `TypeScript` 和 `JavaScript` 中的简单实现。

```ts
class Queue {
  private data = [];
  push = item => this.data.push(item);
  pop = () => this.data.shift();
}
```

在上述代码中存在一个问题，它允许你向队列中添加任何类型的数据，当然，当数据被弹出队列时，也可以是任意类型。在下面的示例中，看起来人们可以向队列中添加`string` 类型的数据，但是实际上，该用法假定的是只有 `number` 类型会被添加到队列里。

```ts
class Queue {
  private data = [];
  push = item => this.data.push(item);
  pop = () => this.data.shift();
}

const queue = new Queue();

queue.push(0);
queue.push('1'); // Oops，一个错误

// 一个使用者，走入了误区
console.log(queue.pop().toPrecision(1));
console.log(queue.pop().toPrecision(1)); // RUNTIME ERROR
```

一个解决的办法（事实上，这也是不支持泛型类型的唯一解决办法）是为这些约束创建特殊类，如快速创建数字类型的队列：

```ts
class QueueNumber {
  private data = [];
  push = (item: number) => this.data.push(item);
  pop = (): number => this.data.shift();
}

const queue = new QueueNumber();

queue.push(0);
queue.push('1'); // Error: 不能推入一个 `string` 类型，只能是 `number` 类型

// 如果该错误得到修复，其他将不会出现问题
```

当然，快速也意味着痛苦。例如当你想创建一个字符串的队列时，你将不得不再次修改相当大的代码。我们真正想要的一种方式是无论什么类型被推入队列，被推出的类型都与推入类型一样。当你使用泛型时，这会很容易：

```ts
// 创建一个泛型类
class Queue<T> {
  private data: T[] = [];
  push = (item: T) => this.data.push(item);
  pop = (): T | undefined => this.data.shift();
}

// 简单的使用
const queue = new Queue<number>();
queue.push(0);
queue.push('1'); // Error：不能推入一个 `string`，只有 number 类型被允许
```

另外一个我们见过的例子：一个 `reverse` 函数，现在在这个函数里提供了函数参数与函数返回值的约束：

```ts
function reverse<T>(items: T[]): T[] {
  const toreturn = [];
  for (let i = items.length - 1; i >= 0; i--) {
    toreturn.push(items[i]);
  }
  return toreturn;
}

const sample = [1, 2, 3];
let reversed = reverse(sample);

reversed[0] = '1'; // Error
reversed = ['1', '2']; // Error

reversed[0] = 1; // ok
reversed = [1, 2]; // ok
```

在此章节中，你已经了解在*类*和*函数*上使用泛型的例子。一个值得补充一点的是，你可以为创建的成员函数添加泛型：

```ts
class Utility {
  reverse<T>(items: T[]): T[] {
    const toreturn = [];
    for (let i = items.length; i >= 0; i--) {
      toreturn.push(items[i]);
    }
    return toreturn;
  }
}
```

> [!TIP]
>
> 你可以随意调用泛型参数，当你使用简单的泛型时，泛型常用 `T`、`U`、`V` 表示。如果在你的参数里，不止拥有一个泛型，你应该使用一个更语义化名称，如 `TKey` 和 `TValue` （通常情况下，以 `T` 作为泛型的前缀，在其他语言如 C++ 里，也被称为模板）

### 误用的泛型

我见过开发者使用泛型仅仅是为了它的 hack。当你使用它时，你应该问问自己：你想用它来提供什么样的约束。如果你不能很好的回答它，你可能会误用泛型，如：

```ts
declare function foo<T>(arg: T): void;
```

在这里，泛型完全没有必要使用，因为它仅用于单个参数的位置，使用如下方式可能更好：

```ts
declare function foo(arg: any): void;
```

### 设计模式：方便通用

考虑如下函数：

```ts
declare function parse<T>(name: string): T;
```

在这种情况下，泛型 `T` 只在一个地方被使用了，它并没有在成员之间提供约束 `T`。这相当于一个如下的类型断言：

```ts
declare function parse(name: string): any;

const something = parse('something') as TypeOfSomething;
```

仅使用一次的泛型并不比一个类型断言来的安全。它们都给你使用 API 提供了便利。

另一个明显的例子是，一个用于加载 json 返回值函数，它返回你任何传入类型的 `Promise`：

```ts
const getJSON = <T>(config: { url: string; headers?: { [key: string]: string } }): Promise<T> => {
  const fetchConfig = {
    method: 'GET',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(config.headers || {})
  };
  return fetch(config.url, fetchConfig).then<T>(response => response.json());
};
```

请注意，你仍然需要明显的注解任何你需要的类型，但是 `getJSON<T>` 的签名 `config => Promise<T>` 能够减少你一些关键的步骤（你不需要注解 `loadUsers` 的返回类型，因为它能够被推出来）：

```ts
type LoadUserResponse = {
  user: {
    name: string;
    email: string;
  }[];
};

function loaderUser() {
  return getJSON<LoadUserResponse>({ url: 'https://example.com/users' });
}
```

与此类似：使用 `Promise<T>` 作为一个函数的返回值比一些如：`Promise<any>` 的备选方案要好很多。

#### 配合 axios 使用

通常情况下，我们会把后端返回数据格式单独放入一个 interface 里：

```ts
// 请求接口数据
export interface ResponseData<T = any> {
  /**
   * 状态码
   * @type { number }
   */
  code: number;

  /**
   * 数据
   * @type { T }
   */
  result: T;

  /**
   * 消息
   * @type { string }
   */
  message: string;
}
```

当我们把 API 单独抽离成单个模块时：

```ts
// 在 axios.ts 文件中对 axios 进行了处理，例如添加通用配置、拦截器等
import Ax from './axios';

import { ResponseData } from './interface.ts';

export function getUser<T>() {
  return Ax.get<ResponseData<T>>('/somepath')
    .then(res => res.data)
    .catch(err => console.error(err));
}
```

接着我们写入返回的数据类型 `User`，这可以让 TypeScript 顺利推断出我们想要的类型：

```ts
interface User {
  name: string;
  age: number;
}

async function test() {
  // user 被推断出为
  // {
  //  code: number,
  //  result: { name: string, age: number },
  //  message: string
  // }
  const user = await getUser<User>();
}
```

## 类型推断

TypeScript 能根据一些简单的规则推断（检查）变量的类型，你可以通过实践，很快的了解它们。

### 定义变量

变量的类型，由定义推断：

```ts
let foo = 123; // foo 是 'number'
let bar = 'hello'; // bar 是 'string'

foo = bar; // Error: 不能将 'string' 赋值给 `number`
```

这是一个从右向左流动类型的示例。

### 函数返回类型

返回类型能被 `return` 语句推断，如下所示，推断函数返回为一个数字：

```ts
function add(a: number, b: number) {
  return a + b;
}
```

这是一个从底部流出类型的例子。

### 赋值

函数参数类型/返回值也能通过赋值来推断。如下所示，`foo` 的类型是 `Adder`，他能让 `foo` 的参数 `a`、`b` 是 `number` 类型。

```ts
type Adder = (a: number, b: number) => number;
let foo: Adder = (a, b) => a + b;
```

这个事实可以用下面的代码来证明，TypeScript 会发出正如你期望发出的错误警告：

```ts
type Adder = (a: number, b: number) => number;
let foo: Adder = (a, b) => {
  a = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型
  return a + b;
};
```

这是一个从左向右流动类型的示例。

如果你创建一个函数，并且函数参数为一个回调函数，相同的赋值规则也适用于它。从 `argument` 至 `parameter` 只是变量赋值的另一种形式。

```ts
type Adder = (a: number, b: number) => number;
function iTakeAnAdder(adder: Adder) {
  return adder(1, 2);
}

iTakeAnAdder((a, b) => {
  a = 'hello'; // Error: 不能把 'string' 类型赋值给 'number' 类型
  return a + b;
});
```

### 结构化

这些简单的规则也适用于结构化的存在（对象字面量），例如在下面这种情况下 `foo` 的类型被推断为 `{ a: number, b: number }`：

```ts
const foo = {
  a: 123,
  b: 456
};

foo.a = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型
```

数组也一样：

```ts
const bar = [1, 2, 3];
bar[0] = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型
```

### 解构

这些也适用于解构中：

```ts
const foo = {
  a: 123,
  b: 456
};
let { a } = foo;

a = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型
```

数组中：

```ts
const bar = [1, 2];
let [a, b] = bar;

a = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型
```

如果函数参数能够被推断出来，那么解构亦是如此。在如下例子中，函数参数能够被解构为 `a/b` 成员：

```ts
type Adder = (number: { a: number; b: number }) => number;
function iTakeAnAdder(adder: Adder) {
  return adder({ a: 1, b: 2 });
}

iTakeAnAdder(({ a, b }) => {
  // a, b 的类型能被推断出来
  a = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型
  return a + b;
});
```

### 类型保护

在前面章节[类型保护](https://jkchao.github.io/typescript-book-chinese/typings/typeGuard.html)中，我们已经知道它如何帮助我们改变和缩小类型范围（特别是在联合类型下）。类型保护只是一个块中变量另一种推断形式。

### 警告

#### 小心使用参数

如果类型不能被赋值推断出来，类型也将不会流入函数参数中。例如如下的一个例子，编译器并不知道 `foo` 的类型，所它也就不能推断出 `a` 或者 `b` 的类型。

```ts
const foo = (a, b) => {
  /* do something */
};
```

然而，如果 `foo` 添加了类型注解，函数参数也就能被推断（`a`，`b` 都能被推断为 `number` 类型）：

```ts
type TwoNumberFunction = (a: number, b: number) => void;
const foo: TwoNumberFunction = (a, b) => {
  /* do something */
};
```

#### 小心使用返回值

尽管 TypeScript 一般情况下能推断函数的返回值，但是它可能并不是你想要的。例如如下的 `foo` 函数，它的返回值为 `any`：

```ts
function foo(a: number, b: number) {
  return a + addOne(b);
}

// 一些使用 JavaScript 库的特殊函数
function addOne(a) {
  return a + 1;
}
```

这是因为返回值的类型被一个缺少类型定义的 `addOne` 函数所影响（`a` 是 `any`，所以 `addOne` 返回值为 `any`，`foo` 的返回值是也是 `any`）。

> [!TIP]
>
> 我发现最简单的方式是明确的写上函数返回值，毕竟这些注解是一个定理，而函数是注解的一个证据。

这里还有一些其他可以想象的情景，但是有一个好消息是有编译器选项 `noImplicitAny` 可以捕获这些 bug。

#### `noImplicitAny`

选项 `noImplicitAny` 用来告诉编译器，当无法推断一个变量时发出一个错误（或者只能推断为一个隐式的 `any` 类型），你可以：

- 通过显式添加 `:any` 的类型注解，来让它成为一个 `any` 类型；
- 通过一些更正确的类型注解来帮助 TypeScript 推断类型。