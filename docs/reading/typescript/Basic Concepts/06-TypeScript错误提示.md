# 解读 Error

TypeScript 是一种专注于帮助开发人员的编程语言，当错误出现时，它会提供尽可能提供非常有用的错误信息。这对于那些信任使用者的编译器来说，可能会导致轻微的信息量过载，而不会那么实用。

让我们来看一个在 IDE 中的例子：

```ts
type SomethingComplex = {
  foo: number;
  bar: string;
};

function takeSomethingComplex(arg: SomethingComplex) {}

function getBar(): string {
  return 'some bar';
}

// 一个可能会出现的错误使用
const fail = {
  foo: 123,
  bar: getBar
};

takeSomethingComplex(fail); // 在这里 TypeScript 会报错
```

这个简单的例子，演示了一个常见的程序设计错误，它调用函数失败（`bar: getBar` 应该是 `bar: getBar()`）。幸运的是，一旦不符合类型要求，TypeScript 将会捕捉到这个错误。

## 错误分类

TypeScript 错误信息分为两类：简洁和详细。

### 简洁

简洁的错误信息是为了提供一个编译器描述的错误号以及一些相关的信息，一个简洁的错误信息类似于如下所示：

```ts
TS2345: Argument of type '{ foo: number; bar: () => string; }' is not assignable to parameter of type 'SomethingComplex'.
```

然而，它没有提供更深层次的信息，如为什么这个错误会发生。这就是详细错误所需要的原因。

## 详细

详细的错误信息类似于如下所示：

```ts
[ts]
Argument of type '{ foo: number; bar: () => string; }' is not assignable to parameter of type 'SomethingComplex'.
  Types of property 'bar' are incompatible.
    Type '() => string' is not assignable to type 'string'.
```

详细的错误信息是为了指导使用者知道为什么一些错误（在这个例子里是类型不兼容）会发生。第一行与简洁的错误信息相同，后跟一些详细的信息。你应该阅读这些详细信息，因为对于开发者的一些疑问，它都给出了问答：

```ts
ERROR: Argument of type '{ foo: number; bar: () => string; }' is not assignable to parameter of type 'SomethingComplex'.

WHY?
CAUSE ERROR: Types of property 'bar' are incompatible.

WHY?
CAUSE ERROR: Type '() => string' is not assignable to type 'string'.
```

所以，最根本的原因是：

- 在属性 `bar`
- 函数 `() => string` 它应该是一个字符串。

这能够帮助开发者修复 bar 属性的 bug（它们忘记了调用这个函数）。

## 常见的Error

### TS2304

例子：

> Cannot find name ga, Cannot find name $, Cannot find module jquery

你可能在使用第三方的库（如：google analytics），但是你并没有 `declare` 的声明。在没有声明它们之前，TypeScript 试图避免错误和使用变量。因此在使用一些额外的库时，你需要明确的声明使用的任何变量（[如何修复它](https://jkchao.github.io/typescript-book-chinese/typings/ambient.html)）。

### TS2307

例子：

> Cannot find module 'underscore'

你可能把第三方的库作为模块（[移步模块](https://jkchao.github.io/typescript-book-chinese/project/modules.html)）来使用，并且没有一个与之对应的环境声明文件（[更多声明文件信息](https://jkchao.github.io/typescript-book-chinese/typings/ambient.html)）。

### TS1148

例子：

> Cannot compile modules unless the '--module' flag provided

请查看[模块](https://jkchao.github.io/typescript-book-chinese/project/modules.html)章节

### 捕获不能有类型注解的简短变量

例子：

```ts
try {
  something();
} catch (e) {
  // 捕获不能有类型注解的简短变量
  // ...
}
```

TypeScript 正在保护你免受 JavaScript 代码的侵害，取而代之，使用类型保护：

```ts
try {
  something();
} catch (e) {
  // 捕获不能有类型注解的简短变量
  if (e instanceof Error) {
    // do...
  }
}
```

### 接口 `ElementClass` 不能同时扩展类型别名 `Component` 和 `Component`

当在编译上下文中同时含有两个 `react.d.ts`（`@types/react/index.d.ts`）会发生这种情况。

修复：

- 删除 `node_modules` 和任何 `package-lock`（或者 `yarn lock`），然后再一次 `npm install`；
- 如果这不能工作，查找无效的模块（你所使用的所用用到了 `react.d.ts` 模块应该作为 `peerDependency` 而不是作为 `dependency` 使用）并且把这个报告给相关模块。
