# TypeScript 类型系统（一）

在讨论[为什么使用 TypeScript](https://jkchao.github.io/typescript-book-chinese/#whys) 时，我们表述了 TypeScript 类型系统的主要功能。以下是一些关键点：

- TypeScript 的类型系统被设计为可选的，因此，你的 JavaScript 就是 TypeScript;
- TypeScript 不会阻止 JavaScript 的运行，即使存在类型错误也不例外，这能让你的 JavaScript 逐步迁移至 TypeScript。

现在让我们开始学习 TypeScript 类型系统的语法吧，在这一章节中，你将能给你的代码加上类型注解，并且能看到它的益处。这将为我们进一步了解类型系统做铺垫。

## 基本注解

如前文所提及，类型注解使用 `:TypeAnnotation` 语法。在类型声明空间中可用的任何内容都可以用作类型注解。

在下面这个例子中，使用了变量、函数参数以及函数返回值的类型注解：

```ts
const num: number = 123;
function identity(num: number): number {
  return num;
}
```

## 原始类型

JavaScript 原始类型也同样适应于 TypeScript 的类型系统，因此 `string`、`number`、`boolean` 也可以被用作类型注解：

```ts
let num: number;
let str: string;
let bool: boolean;

num = 123;
num = 123.456;
num = '123'; // Error

str = '123';
str = 123; // Error

bool = true;
bool = false;
bool = 'false'; // Error
```

## 数组

TypeScript 为数组提供了专用的类型语法，因此你可以很轻易的注解数组。它使用后缀 `[]`， 接着你可以根据需要补充任何有效的类型注解（如：`:boolean[]`）。它能让你安全的使用任何有关数组的操作，而且它也能防止一些类似于赋值错误类型给成员的行为。如下所示：

```ts
let boolArray: boolean[];

boolArray = [true, false];
console.log(boolArray[0]); // true
console.log(boolArray.length); // 2

boolArray[1] = true;
boolArray = [false, false];

boolArray[0] = 'false'; // Error
boolArray = 'false'; // Error
boolArray = [true, 'false']; // Error
```

## 接口

接口是 TypeScript 的一个核心知识，它能合并众多类型声明至一个类型声明：

```ts
interface Name {
  first: string;
  second: string;
}

let name: Name;
name = {
  first: 'John',
  second: 'Doe'
};

name = {
  // Error: 'Second is missing'
  first: 'John'
};

name = {
  // Error: 'Second is the wrong type'
  first: 'John',
  second: 1337
};
```

在这里，我们把类型注解：`first: string` + `second: string` 合并到了一个新的类型注解 `Name` 里，这样能强制对每个成员进行类型检查。接口在 TypeScript 拥有强大的力量，稍后，我们将会用一个内容专门阐述如何更好的使用它。

接口运行时的影响为 0。在 TypeScript 接口中有很多方式来声明变量的结构。

下面两个是等效的声明, 示例 A 使用内联注解，示例 B 使用接口形式：

```ts
// 示例 A
declare const myPoint: { x: number; y: number };

// 示例 B
interface Point {
  x: number;
  y: number;
}
declare const myPoint: Point;
```

示例 B 的好处在于，如果有人创建了一个基于 `myPoint` 的库来添加新成员, 那么他可以轻松将此成员添加到 `myPoint` 的现有声明中:

```ts
// Lib a.d.ts
interface Point {
  x: number,
  y: number
}
declare const myPoint: Point

// Lib b.d.ts
interface Point {
  z: number
}

// Your code
myPoint.z // Allowed!
```

TypeScript 接口是开放式的，这是 TypeScript 的一个重要原则，它允许你使用接口来模仿 JavaScript 的可扩展性。

### 类可以实现接口

如果你希望在类中使用必须要被遵循的接口（类）或别人定义的对象结构，可以使用 `implements` 关键字来确保其兼容性：

```ts
interface Point {
  x: number;
  y: number;
}

class MyPoint implements Point {
  x: number;
  y: number; // Same as Point
}
```

基本上，在 `implements（实现）` 存在的情况下，该外部 `Point` 接口的任何更改都将导致代码库中的编译错误，因此可以轻松地使其保持同步：

```ts
interface Point {
  x: number;
  y: number;
  z: number; // New member
}

class MyPoint implements Point {
  // ERROR : missing member `z`
  x: number;
  y: number;
}
```

注意，`implements` 限制了类实例的结构，如下所示:

```ts
let foo: Point = new MyPoint();
```

但像 `foo: Point = MyPoint` 这样的代码，与其并不是一回事。

### 并非每个接口都是很容易实现的

接口旨在声明 JavaScript 中可能存在的任意结构。

思考以下例子，可以使用 `new` 调用某些内容：

```ts
interface Crazy {
  new (): {
    hello: number;
  };
}
```

你可能会有下面这样的代码：

```ts
class CrazyClass implements Crazy {
  constructor() {
    return { hello: 123 };
  }
}

// Because
const crazy = new CrazyClass(); // crazy would be { hello:123 }
```

你可以使用接口声明所有“疯狂的”的 JavaScript 代码，甚至可以安全地在 TypeScript 中使用它们。但这并不意味着你可以使用 TypeScript 类来实现它们。

## 内联类型注解

与创建一个接口不同，你可以使用内联注解语法注解任何内容：`:{ /*Structure*/ }`：

```ts
let name: {
  first: string;
  second: string;
};

name = {
  first: 'John',
  second: 'Doe'
};

name = {
  // Error: 'Second is missing'
  first: 'John'
};

name = {
  // Error: 'Second is the wrong type'
  first: 'John',
  second: 1337
};
```

内联类型能为你快速的提供一个类型注解。它可以帮助你省去为类型起名的麻烦（你可能会使用一个很糟糕的名称）。然而，如果你发现需要多次使用相同的内联注解时，那么考虑把它重构为一个接口（或者是 `type alias`，它会在接下来的部分提到）是一个不错的主意。

## 特殊类型

除了被提到的一些原始类型，在 TypeScript 中，还存在一些特殊的类型，它们是 `any`、 `null`、 `undefined` 以及 `void`。

### any

`any` 类型在 TypeScript 类型系统中占有特殊的地位。它提供给你一个类型系统的「后门」,TypeScript 将会把类型检查关闭。在类型系统里 `any` 能够兼容所有的类型（包括它自己）。因此，所有类型都能被赋值给它，它也能被赋值给其他任何类型。以下有一个证明例子：

```ts
let power: any;

// 赋值任意类型
power = '123';
power = 123;

// 它也兼容任何类型
let num: number;
power = num;
num = power;
```

当你把 JavaScript 迁移至 TypeScript 时，你将会经常性使用 `any`。但你必须减少对它的依赖，因为你需要确保类型安全。当使用 `any` 时，你基本上是在告诉 TypeScript 编译器不要进行任何的类型检查。

### null 和 undefined

在类型系统中，JavaScript 中的 null 和 undefined 字面量和其他被标注了 `any` 类型的变量一样，都能被赋值给任意类型的变量，如下例子所示：

```ts
// strictNullChecks: false

let num: number;
let str: string;

// 这些类型能被赋予
num = null;
str = undefined;
```

### void

使用 `:void` 来表示一个函数没有一个返回值

```ts
function log(message: string): void {
  console.log(message);
}
```

## 泛型

在计算机科学中，许多算法和数据结构并不会依赖于对象的实际类型。但是，你仍然会想在每个变量里强制提供约束。例如：在一个函数中，它接受一个列表，并且返回这个列表的反向排序，这里的约束是指传入至函数的参数与函数的返回值：

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

console.log(reversed); // 3, 2, 1

// Safety
reversed[0] = '1'; // Error
reversed = ['1', '2']; // Error

reversed[0] = 1; // ok
reversed = [1, 2]; // ok
```

在上个例子中，函数 `reverse` 接受一个类型为 `T`（注意在 `reverse<T>` 中的类型参数） 的数组（`items: T[]`），返回值为类型 T 的一个数组（注意：T[]），函数 `reverse` 的返回值类型与它接受的参数的类型一样。当你传入 `const sample = [1, 2, 3]` 时，TypeScript 能推断出 `reverse` 为 `number[]` 类型，从而能给你类型安全。与此相似，当你传入一个类型为 `string[]` 类型的数组时，TypeScript 能推断 `reverse` 为 `string`[] 类型，如下例子所示：

```ts
const strArr = ['1', '2'];
let reversedStrs = reverse(strArr);

reversedStrs = [1, 2]; // Error
```

事实上，JavaScript 数组已经拥有了 `reverse` 的方法，TypeScript 也确实使用了泛型来定义其结构：

```ts
interface Array<T> {
  reverse(): T[];
}
```

这意味着，当你在数组上调用 `.reverse` 方法时，将会获得类型安全：

```ts
let numArr = [1, 2];
let reversedNums = numArr.reverse();

reversedNums = ['1', '2']; // Error
```

当稍后在 [环境声明](https://jkchao.github.io/typescript-book-chinese/typings/ambient.html) 章节中提及 `lib.d.ts` 时，我们会讨论更多关于 `Array<T>` 的信息。

## 联合类型

在 JavaScript 中，你可能希望属性为多种类型之一，如字符串或者数组。这正是 TypeScript 中联合类型能派上用场的地方（它使用 `|` 作为标记，如 `string | number`）。关于联合类型，一个常见的用例是一个可以接受字符串数组或单个字符串的函数：

```ts
function formatCommandline(command: string[] | string) {
  let line = '';
  if (typeof command === 'string') {
    line = command.trim();
  } else {
    line = command.join(' ').trim();
  }

  // Do stuff with line: string
}
```

## 交叉类型

在 JavaScript 中， `extend` 是一种非常常见的模式，在这种模式中，你可以从两个对象中创建一个新对象，新对象拥有着两个对象所有的功能。交叉类型可以让你安全的使用此种模式：

```ts
function extend<T extends object, U extends object>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }

  return result;
}

const x = extend({ a: 'hello' }, { b: 42 });

// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
```

## 元组类型

JavaScript 并不支持元组，开发者们通常只能使用数组来表示元组。而 TypeScript 支持它，开发者可以使用 `:[typeofmember1, typeofmember2]` 的形式，为元组添加类型注解，元组可以包含任意数量的成员，示例：

```ts
let nameNumber: [string, number];

// Ok
nameNumber = ['Jenny', 221345];

// Error
nameNumber = ['Jenny', '221345'];
```

将其与 TypeScript 中的解构一起使用：

```ts
let nameNumber: [string, number];
nameNumber = ['Jenny', 322134];

const [name, num] = nameNumber;
```

## 类型别名

TypeScript 提供了为类型注解设置别名的便捷语法，你可以使用 `type SomeName = someValidTypeAnnotation` 来创建别名：

```ts
type StrOrNum = string | number;

// 使用
let sample: StrOrNum;
sample = 123;
sample = '123';

// 会检查类型
sample = true; // Error
```

与接口不同，你可以为任意的类型注解提供类型别名（在联合类型和交叉类型中比较实用），下面是一些能让你熟悉类型别名语法的示例。

```ts
type Text = string | { text: string };
type Coordinates = [number, number];
type Callback = (data: string) => void;
```

> [!TIP]
>
> - 如果你需要使用类型注解的层次结构，请使用接口。它能使用 `implements` 和 `extends`
> - 为一个简单的对象类型（如上面例子中的 Coordinates）使用类型别名，只需要给它一个语义化的名字即可。另外，当你想给联合类型和交叉类型提供一个语义化的名称时，一个类型别名将会是一个好的选择。

## 枚举

枚举是组织收集有关联变量的一种方式，许多程序语言（如：c/c#/Java）都有枚举数据类型。下面是定义一个 TypeScript 枚举类型的方式：

```ts
enum CardSuit {
  Clubs,
  Diamonds,
  Hearts,
  Spades
}

// 简单的使用枚举类型
let Card = CardSuit.Clubs;

// 类型安全
Card = 'not a member of card suit'; // Error: string 不能赋值给 `CardSuit` 类型
```

这些枚举类型的值都是数字类型，因此它们被称为数字类型枚举。

### 数字类型枚举与数字类型

数字类型枚举，允许我们将数字类型或者其他任何与数字类型兼容的类型赋值给枚举类型的实例。

```ts
enum Color {
  Red,
  Green,
  Blue
}

let col = Color.Red;
col = 0; // 有效的，这也是 Color.Red
```

### 数字类型枚举与字符串类型

在我们继续深入学习枚举类型之前，先来看看它编译的 JavaScript 吧，以下是一个简单的 TypeScript 枚举类型：

```ts
enum Tristate {
  False,
  True,
  Unknown
}
```

其被编译成 JavaScript 后如下所示：

```ts
var Tristate;
(function(Tristate) {
  Tristate[(Tristate['False'] = 0)] = 'False';
  Tristate[(Tristate['True'] = 1)] = 'True';
  Tristate[(Tristate['Unknown'] = 2)] = 'Unknown';
})(Tristate || (Tristate = {}));
```

先让我们聚焦 `Tristate[Tristate['False'] = 0] = 'False'` 这行代码，其中 `Tristate['False'] = 0` 的意思是将 `Tristate` 对象里的 `False` 成员值设置为 `0`。注意，JavaScript 赋值运算符返回的值是被赋予的值（在此例子中是 `0`），因此下一次 JavaScript 运行时执行的代码是 `Tristate[0] = 'False'`。意味着你可以使用 `Tristate` 变量来把字符串枚举类型改造成一个数字或者是数字类型的枚举类型，如下所示：

```ts
enum Tristate {
  False,
  True,
  Unknown
}

console.log(Tristate[0]); // 'False'
console.log(Tristate['False']); // 0
console.log(Tristate[Tristate.False]); // 'False' because `Tristate.False == 0`
```

### 改变与数字枚举关联的数字

默认情况下，第一个枚举值是 `0`，然后每个后续值依次递增 1：

```ts
enum Color {
  Red, // 0
  Green, // 1
  Blue // 2
}
```

但是，你可以通过特定的赋值来改变给任何枚举成员关联的数字，如下例子，我们从 3 开始依次递增：

```ts
enum Color {
  DarkRed = 3, // 3
  DarkGreen, // 4
  DarkBlue // 5
}
```

> [!TIP]
>
> 我通常用 `= 1` 初始化，因为在枚举类型值里，它能让你做一个安全可靠的检查。

### 使用数字类型作为标志

枚举的一个很好用途是使用枚举作为标志。这些标志允许你检查一组条件中的某个条件是否为真。考虑如下代码例子，我们有一组关于 animals 的属性：

```ts
enum AnimalFlags {
  None        = 0,
  HasClaws    = 1 << 0,
  CanFly      = 1 << 1,
  EatsFish    = 1 << 2,
  Endangered  = 1 << 3
}
```

在这里，我们使用了左移的位运算符，将数字 `1` 的二进制向左移动位置得到数字 `0001`、`0010`、`0100` 和 `1000`（换成十进制结果是：1, 2, 4, 8）。当你在使用这种标记的时候，这些位运算符 `|` (或)、`&` （和）、`~` （非）将会是你最好的朋友：

```ts
enum AnimalFlags {
  None        = 0,
  HasClaws    = 1 << 0,
  CanFly      = 1 << 1
}

interface Animal {
  flags: AnimalFlags;
  [key: string]: any;
}

function printAnimalAbilities(animal: Animal) {
  var animalFlags = animal.flags;
  if (animalFlags & AnimalFlags.HasClaws) {
    console.log('animal has claws');
  }
  if (animalFlags & AnimalFlags.CanFly) {
    console.log('animal can fly');
  }
  if (animalFlags == AnimalFlags.None) {
    console.log('nothing');
  }
}

var animal = { flags: AnimalFlags.None };
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws;
printAnimalAbilities(animal); // animal has claws
animal.flags &= ~AnimalFlags.HasClaws;
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws | AnimalFlags.CanFly;
printAnimalAbilities(animal); // animal has claws, animal can fly
```

在这里：

- 我们使用 `|=` 来添加一个标志；
- 组合使用 `&=` 和 `~` 来清理一个标志；
- `|` 来合并标志。

> [!TIP]
>
> 你可以组合标志，用来在枚举类型中定义方便快捷的方式，如下 `EndangeredFlyingClawedFishEating`：

```ts
enum AnimalFlags {
  None        = 0,
  HasClaws    = 1 << 0,
  CanFly      = 1 << 1,
  EatsFish    = 1 << 2,
  Endangered  = 1 << 3,

  EndangeredFlyingClawedFishEating = HasClaws | CanFly | EatsFish | Endangered
}
```

### 字符串枚举

在上文中，我们只看到了数字类型的枚举，实际上，枚举类型的值，也可以是字符串类型。

```ts
export enum EvidenceTypeEnum {
  UNKNOWN = '',
  PASSPORT_VISA = 'passport_visa',
  PASSPORT = 'passport',
  SIGHTED_STUDENT_CARD = 'sighted_tertiary_edu_id',
  SIGHTED_KEYPASS_CARD = 'sighted_keypass_card',
  SIGHTED_PROOF_OF_AGE_CARD = 'sighted_proof_of_age_card'
}
```

这些可以更容易被处理和调试，因为它们提供有意义/可调试的字符串。

你可以使用它们用于简单的字符串比较：

```ts
// Where `someStringFromBackend` will be '' | 'passport_visa' | 'passport' ... etc.
const value = someStringFromBackend as EvidenceTypeEnum;

// Sample use in code
if (value === EvidenceTypeEnum.PASSPORT) {
  console.log('You provided a passport');
  console.log(value); // `passport`
}
```

### 常量枚举

```ts
enum Tristate {
  False,
  True,
  Unknown
}

const lie = Tristate.False;
```

`const lie = Tristate.False` 会被编译成 JavaScript `let lie = Tristate.False` (是的，编译后与编译前，几乎相同)。这意味着在运行执行时，它将会查找变量 `Tristate` 和 `Tristate.False`。在此处获得性能提升的一个小技巧是使用常量枚举：

```ts
const enum Tristate {
  False,
  True,
  Unknown
}

const lie = Tristate.False;
```

将会被编译成：

```js
let lie = 0;
```

编译器将会：

- 内联枚举的任何用法（`0` 而不是 `Tristate.False`）；
- 不会为枚举类型编译成任何 JavaScript（在这个例子中，运行时没有 `Tristate` 变量），因为它使用内联语法。

#### 常量枚举 `preserveConstEnums` 选项

使用内联语法对性能有明显的提升作用。运行时没有 `Tristate` 变量的事实，是因为编译器帮助你把一些在运行时没有用到的不编译成 JavaScript。然而，你可能想让编译器仍然把枚举类型编译成 JavaScript，用于如上例子中从字符串到数字，或者是从数字到字符串的查找。在这种情景下，你可以使用编译选项 `--preserveConstEnums`，它会编译出 `var Tristate` 的定义，因此你在运行时，手动使用 `Tristate['False']` 和 `Tristate[0]`。并且这不会以任何方式影响内联。

### 有静态方法的枚举

你可以使用 `enum` + `namespace` 的声明的方式向枚举类型添加静态方法。如下例所示，我们将静态成员 `isBusinessDay` 添加到枚举上：

```ts
enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

namespace Weekday {
  export function isBusinessDay(day: Weekday) {
    switch (day) {
      case Weekday.Saturday:
      case Weekday.Sunday:
        return false;
      default:
        return true;
    }
  }
}

const mon = Weekday.Monday;
const sun = Weekday.Sunday;

console.log(Weekday.isBusinessDay(mon)); // true
console.log(Weekday.isBusinessDay(sun));
```

### 开放式枚举

> [!TIP]
>
> 你只有在不使用模块时，开放式的枚举才有意义，你应该使用模块，因此这部分在文章最后。

让我们再一次看看编译成 JavaScript 的枚举是什么样子：

```ts
var Tristate;
(function(Tristate) {
  Tristate[(Tristate['False'] = 0)] = 'False';
  Tristate[(Tristate['True'] = 1)] = 'True';
  Tristate[(Tristate['Unknown'] = 2)] = 'Unknown';
})(Tristate || (Tristate = {}));
```

我们已经解释了 `Tristate[Tristate['False'] = 0] = 'False'` 部分，现在我们来看看包裹函数 `(function (Tristate) { /* code here */})(Tristate || (Tristate = {}))`，特别是 `(Tristate || (Tristate = {}))` 部分。这捕获了一个局部变量 `TriState`，它要么指向已经定义的`TriState` 值，要么使用一个新的空对象来初始化它。

这意味着你可以跨多个文件拆分（和扩展）枚举定义，如下所示，你可以把 `Color` 的定义拆分至两个块中：

```ts
enum Color {
  Red,
  Green,
  Blue
}

enum Color {
  DarkRed = 3,
  DarkGreen,
  DarkBlue
}
```

> [!TIP]
>
> 你应该在枚举的延续块中，重新初始化第一个成员（此处为 `DarkRed = 3`），使生成的代码不破坏先前定义的值（即0、1...等值）。如果您仍然不这样做，TypeScript 将会发出警告（错误信息：`In an enum with multiple declarations, only one declaration can omit an initializer for its first enum element.`）。

## lib.d.ts

当你安装 `TypeScript` 时，会顺带安装一个 `lib.d.ts` 声明文件。这个文件包含 JavaScript 运行时以及 DOM 中存在各种常见的环境声明。

- 它自动包含在 TypeScript 项目的编译上下文中；
- 它能让你快速开始书写经过类型检查的 JavaScript 代码。

你可以通过指定 `--noLib` 的编译器命令行标志（或者在 `tsconfig.json` 中指定选项 `noLib: true`）从上下文中排除此文件。

### 使用例子

看如下例子：

```ts
const foo = 123;
const bar = foo.toString();
```

这段代码的类型检查正常，因为 `lib.d.ts` 为所有 JavaScript 对象定义了 `toString` 方法。

如果你在 `noLib` 选项下，使用相同的代码，这将会出现类型检查错误：

```ts
const foo = 123;
const bar = foo.toString(); // Error: 属性 toString 不存在类型 number 上
```

现在你已经理解了 `lib.d.ts` 的重要性，至于它的内容是怎么样的，我们接下来将会解释。

### 观察 lib.d.ts 的内容

`lib.d.ts` 的内容主要是一些变量声明（如：`window`、`document`、`math`）和一些类似的接口声明（如：`Window`、`Document`、`Math`）。

寻找代码类型（如：`Math.floor`）的最简单方式是使用 IDE 的 `F12`（跳转到定义）。

让我们来看一个变量声明的示例，如 `window` 被定义为：

```ts
declare var window: Window;
```

这只是一个简单的 `declare var`，后面跟一个变量名称（`window`）和一个用来类型注解的接口（`Window`），这些变量通常指向一些全局的接口，例如，以下是 `Window` 接口的一小部分：

```ts
interface Window
  extends EventTarget,
    WindowTimers,
    WindowSessionStorage,
    WindowLocalStorage,
    WindowConsole,
    GlobalEventHandlers,
    IDBEnvironment,
    WindowBase64 {
  animationStartTime: number;
  applicationCache: ApplicationCache;
  clientInformation: Navigator;
  closed: boolean;
  crypto: Crypto;
  // so on and so forth...
}
```

你可以在这些接口里看到大量的类型信息，当你不使用 TypeScript 时，你需要将它们保存在你的大脑里。现在你可以使用 `intellisense` 之类东西，从而可以减少对知识的记忆。

使用这些全局变量是有利的。在不更改 `lib.d.ts` 的情况下，它可以让你添加额外的属性。接下来，我们将介绍这些概念。

### 修改原始类型

在 TypeScript 中，接口是开放式的，这意味着当你想使用不存在的成员时，只需要将它们添加至 `lib.d.ts` 中的接口声明中即可，TypeScript 将会自动接收它。注意，你需要在[全局模块](https://jkchao.github.io/typescript-book-chinese/project/modules.html)中做这些修改，以使这些接口与 `lib.d.ts` 相关联。我们推荐你创建一个称为 `global.d.ts` 的特殊文件。

这里有我们需要添加至 `Window`，`Math`，`Date` 的一些例子：

#### Window

仅仅是添加至 `Window` 接口：

```ts
interface Window {
  helloWorld(): void;
}
```

这将允许你以类型安全的形式使用它：

```ts
// Add it at runtime
window.helloWorld = () => console.log('hello world');

// Call it
window.helloWorld();

// 滥用会导致错误
window.helloWorld('gracius'); // Error: 提供的参数与目标不匹配
```

#### Math

全局变量 `Math` 在 `lib.d.ts` 中被定义为：

```ts
/** An intrinsic object that provides basic mathematics functionality and constants. */
declare var Math: Math;
```

即变量 `Math` 是 `Math` 的一个实例，`Math` 接口被定义为：

```ts
interface Math {
  E: number;
  LN10: number;
  // others ...
}
```

当你想在 `Math` 全局变量上添加你需要的属性时，你只需要把它添加到 `Math` 的全局接口上即可，例如：在[`seedrandom Project`](https://www.npmjs.com/package/seedrandom)项目里，它添加了 `seedrandom` 函数至全局的 `Math` 对象上，这很容易被声明：

```ts
interface Math {
  seedrandom(seed?: string): void;
}
```

你可以像下面一样使用它：

```ts
Math.seedrandom();

Math.seedrandom('Any string you want');
```

#### Date

如果你在 `lib.d.ts` 中寻找 `Date` 定义的声明，你将会找到如下代码：

```ts
declare var Date: DateConstructor;
```

接口 `DateConstructor` 与上文中 `Math` 和 `Window` 接口一样，它涵盖了可以使用的 `Date` 全局变量的成员（如：`Date.now()`）。除此之外，它还包含了可以让你创建 `Date` 实例的构造函数签名（如：`new Date()`）。`DateConstructor` 接口的一部分代码如下所示：

```ts
interface DateConstructor {
  new (): Date;
  // 一些其他的构造函数签名

  now(): number;

  // 其他成员函数
}
```

在 [datejs](https://github.com/abritinthebay/datejs) 里，它在 `Date` 的全局变量以及 `Date` 实例上同时添加了成员，因此这个库的 TypeScript 定义看起来像如下所示（社区已经[定义](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/datejs/index.d.ts)好了）：

```ts
// DateJS 公开的静态方法
interface DateConstructor {
  /** Gets a date that is set to the current date. The time is set to the start of the day (00:00 or 12:00 AM) */
  today(): Date;
  // ... so on and so forth
}

// DateJS 公开的实例方法
interface Date {
  /** Adds the specified number of milliseconds to this instance. */
  addMilliseconds(milliseconds: number): Date;
  // ... so on and so forth
}
```

这允许你在类型安全的情况下做：

```ts
const today = Date.today();
const todayAfter1second = today.addMilliseconds(1000);
```

#### string

如果你在 `lib.d.ts` 里寻找 `string`，你将会找到与 `Date` 相类似的内容（全局变量 `String`，`StringConstructor` 接口，`String` 接口）。但值得注意的是，`String` 接口也会影响字符串字面量，如下所示：

```ts
interface String {
  endsWith(suffix: string): boolean;
}

String.prototype.endsWith = function(suffix: string): boolean {
  const str: string = this;
  return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
};

console.log('foo bar'.endsWith('bas')); // false
console.log('foo bas'.endsWith('bas')); // true
```

#### 终极 string

基于可维护性，我们推荐创建一个 `global.d.ts` 文件。然而，如果你愿意，你可以通过使用 `declare global { /* global namespace */ }`，从文件模块中进入全局命名空间：

```ts
// 确保是模块
export {};

declare global {
  interface String {
    endsWith(suffix: string): boolean;
  }
}

String.prototype.endsWith = function(suffix: string): boolean {
  const str: string = this;
  return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
};

console.log('foo bar'.endsWith('bas')); // false
console.log('foo bas'.endsWith('bas')); // true
```

### 使用你自己定义的 lib.d.ts

正如上文所说，使用 `--noLib` 编译选项会导致 TypeScript 排除自动包含的 `lib.d.ts` 文件。为什么这个功能是有效的，我例举了一些常见原因：

- 运行的 JavaScript 环境与基于标准浏览器运行时环境有很大不同；
- 你希望在代码里严格的控制全局变量，例如：`lib.d.ts` 将 `item` 定义为全局变量，你不希望它泄漏到你的代码里。

一旦你排除了默认的 `lib.d.ts` 文件，你就可以在编译上下文中包含一个命名相似的文件，TypeScript 将提取该文件进行类型检查。

> [!TIP]
>
> 小心使用 `--noLib` 选项，一旦你使用了它，当你把你的项目分享给其他人时，它们也将被迫使用 `--noLib` 选项，更糟糕的是，如果将这些代码放入你的项目中，你可能需要将它们移植到基于你的代码的 `lib` 中。

### 编译目标对 lib.d.ts 的影响

设置编译目标为 `es6` 时，能导致 `lib.d.ts` 包含更多像 Promise 现代（es6）内容的环境声明。编译器目标的这种作用，改变了代码的环境，这对某些人来说是理想的，但是这对另外一些人来说造成了困扰，因为它将编译出的代码与环境混为一谈。

当你想对环境进行更细粒的控制时，你应该使用我们接下来将要讨论的 `--lib` 选项。

### --lib 选项

有时，你想要解耦编译目标（即生成的 JavaScript 版本）和环境库支持之间的关系。例如对于 Promise，你的编译目标是 `--target es5`，但是你仍然想使用它，这时，你可以使用 `lib` 对它进行控制。

> [!TIP]
>
> 使用 `--lib` 选项可以将任何 `lib` 与 `--target` 解耦。

你可以通过命令行或者在 `tsconfig.json` 中提供此选项（推荐）：

#### 命令行

```ts
tsc --target es5 --lib dom,es6
```

#### config.json

```json
"compilerOptions": {
    "lib": ["dom", "es6"]
}
```

`lib` 分类如下：

- JavaScript 功能
  - es5
  - es6
  - es2015
  - es7
  - es2016
  - es2017
  - esnext
- 运行环境
  - dom
  - dom.iterable
  - webworker
  - scripthost
- ESNext 功能选项
  - es2015.core
  - es2015.collection
  - es2015.generator
  - es2015.iterable
  - es2015.promise
  - es2015.proxy
  - es2015.reflect
  - es2015.symbol
  - es2015.symbol.wellknown
  - es2016.array.include
  - es2017.object
  - es2017.sharedmemory
  - esnext.asynciterable

> [!NOTE]
>
> `--lib` 选项提供非常精细的控制，因此你最有可能从运行环境与 JavaScript 功能类别中分别选择一项，如果你没有指定 `--lib`，则会导入默认库：
>
> - `--target` 选项为 es5 时，会导入 es5, dom, scripthost。
> - `--target` 选项为 es6 时，会导入 es6, dom, dom.iterable, scripthost。

我个人的推荐：

```json
"compilerOptions": {
  "target": "es5",
  "lib": ["es6", "dom"]
}
```

包括使用 Symbol 的 ES5 使用例子：

```json
"compilerOptions": {
  "target": "es5",
  "lib": ["es5", "dom", "scripthost", "es2015.symbol"]
}
```

### 在旧的 JavaScript 引擎时使用 Polyfill

> [关于此主题的一个视频](https://egghead.io/lessons/typescript-using-es6-and-esnext-with-typescript)

要使用一些新功能如 `Map`、`Set`、`Promise`（随着时间推移会变化），你可以使用现代的 `lib` 选项，并且需要安装 `core-js`：

```shell
npm install core-js --save-dev
```

接着，在你的项目里导入它：

```ts
import 'core-js';
```

## 从 JavaScript 迁移

一般来说，将 JavaScript 代码迁移至 TypeScript 包括以下步骤：

- 添加一个 `tsconfig.json` 文件；
- 把文件扩展名从 `.js` 改成 `.ts`，开始使用 `any` 来减少错误；
- 开始在 TypeScript 中写代码，尽可能的减少 `any` 的使用；
- 回到旧代码，开始添加类型注解，并修复已识别的错误；
- 为第三方 JavaScript 代码定义环境声明。

### 第三方代码

你可以将你的 JavaScript 代码改成 TypeScript 代码，但是你不能让整个世界都使用 TypeScript。这正是 TypeScript 环境声明支持的地方。我建议你以创建一个 `vendor.d.ts` 文件作为开始（`.d.ts` 文件扩展名指定这个文件是一个声明文件），然后我向文件里添加东西。或者，你也可以创建一个针对于特定库的声明文件，如为 jquery 创建 `jquery.d.ts` 文件。

> [!NOTE]
>
> 几乎排名前 90% 的 JavaScript 库的声明文件存在于 **[DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped)** 仓库里，在创建自己定义的声明文件之前，我们建议你先去仓库中寻找是否有对应的声明文件。尽管如此，创建一个声明文件这种快速但不好的方式是减小使用 TypeScript 初始阻力的重要步骤。

### 额外的非 JavaScript 资源

在 TypeScript 中，甚至可以允许你导入任何文件，例如 `.css` 文件（如果你使用的是 webpack 样式加载器或 css 模块），你只要添加如下代码（放在 `global.d.ts`）：

```typescript
declare module '*.css';
```

现在你可以使用 `import * as foo from './some/file.css'`。

与此相似，如果你想使用 html 模版（例如：angular），你可以：

```typescript
declare module '*.html';
```
