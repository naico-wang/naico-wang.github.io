# TypeScript项目知识

> 实用的TypeScript Repositories:
>
> - `TypeScript` 类型体操姿势合集: https://github.com/type-challenges/type-challenges
> - 深入理解TypeScript([《TypeScript Deep Dive》](https://github.com/basarat/typescript-book/)的中文翻译版): https://github.com/jkchao/typescript-book-chinese 

## 编译上下文

编译上下文算是一个比较花哨的术语，可以用它来给文件分组，告诉 TypeScript 哪些文件是有效的，哪些是无效的。除了有效文件所携带信息外，编译上下文还包含有正在被使用的编译选项的信息。定义这种逻辑分组，一个比较好的方式是使用 `tsconfig.json` 文件。

### tsconfig.json

tsconfig文件是位于项目中的一个JSON文件。

```json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5",                  // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```

### TypeScript的编译

好的 IDE 支持对 TypeScript 的即时编译。但是，如果你想在使用 `tsconfig.json` 时从命令行手动运行 TypeScript 编译器，你可以通过以下方式：

- 运行 tsc，它会在当前目录或者是父级目录寻找 `tsconfig.json` 文件。
- 运行 `tsc -p ./path-to-project-directory` 。当然，这个路径可以是绝对路径，也可以是相对于当前目录的相对路径。

你甚至可以使用 `tsc -w` 来启用 TypeScript 编译器的观测模式，在检测到文件改动之后，它将重新编译。

你也可以显式指定需要编译的文件：

```json
{
  "files": [
    "./some/file.ts"
  ]
}
```

你还可以使用 `include` 和 `exclude` 选项来指定需要包含的文件和排除的文件：

```json
{
  "include": [
    "./folder"
  ],
  "exclude": [
    "./folder/**/*.spec.ts",
    "./folder/someSubFolder"
  ]
}
```

> [!caution]
>
> 使用 `globs`：`**/*` （一个示例用法：`some/folder/**/*`）意味着匹配所有的文件夹和所有文件（扩展名为 `.ts/.tsx`，当开启了 `allowJs: true` 选项时，扩展名可以是 `.js/.jsx`）。

## 声明空间

在 TypeScript 里存在两种声明空间：类型声明空间与变量声明空间。

### 类型声明空间

类型声明空间包含用来当做类型注解的内容，例如下面的类型声明：

```ts
class Foo {}
interface Bar {}
type Bas = {};
```

你可以将 `Foo`, `Bar`, `Bas` 作为类型注解使用，示例如下：

```ts
let foo: Foo;
let bar: Bar;
let bas: Bas;
```

注意，尽管你定义了 `interface Bar`，却并不能够把它作为一个变量来使用，因为它没有定义在变量声明空间中。

```ts
interface Bar {}
const bar = Bar; // Error: "cannot find name 'Bar'"
```

出现错误提示： `cannot find name 'Bar'` 的原因是名称 `Bar` 并未定义在变量声明空间。这将带领我们进入下一个主题 -- 变量声明空间。

### 变量声明空间

变量声明空间包含可用作变量的内容，在上文中 `Class Foo` 提供了一个类型 `Foo` 到类型声明空间，此外它同样提供了一个变量 `Foo` 到变量声明空间，如下所示：

```ts
class Foo {}
const someVar = Foo;
const someOtherVar = 123;
```

这很棒，尤其是当你想把一个类来当做变量传递时。

> [!warning]
>
> 我们并不能把一些如 `interface` 定义的内容当作变量使用。
>
> 与此相似，一些用 `var` 声明的变量，也只能在变量声明空间使用，不能用作类型注解。

```js
const foo = 123;
let bar: foo; // ERROR: "cannot find name 'foo'"
```

提示 `ERROR: "cannot find name 'foo'"` 原因是，名称 foo 没有定义在类型声明空间里。

## 文件模块

### 澄清：`commonjs`, `amd`, `es modules`, `others`

首先，我们需要澄清这些模块系统的不一致性。我将会提供给你我当前的建议，以及消除一些你的顾虑。

你可以根据不同的 `module` 选项来把 TypeScript 编译成不同的 JavaScript 模块类型，这有一些你可以忽略的东西：

- AMD：不要使用它，它仅能在浏览器工作；
- SystemJS：这是一个好的实验，已经被 ES 模块替代；
- ES 模块：它并没有准备好。

使用 `module: commonjs` 选项来替代这些模式，将会是一个好的主意。

怎么书写 TypeScript 模块呢？，这也是一件让人困惑的事。在今天我们应该这么做：

- 放弃使用 `import/require` 语法即 `import foo = require('foo')` 写法
- 推荐使用 ES 模块语法

这很酷，接下来，让我们看看 ES 模块语法。

> [!TIP]
>
> 使用 `module: commonjs` 选项以及使用 ES 模块语法导入、导出、编写模块。

### ES 模块语法

- 使用 `export` 关键字导出一个变量或类型

```ts
// foo.ts
export const someVar = 123;
export type someType = {
  foo: string;
};
```

- `export` 的写法除了上面这种，还有另外一种：

```ts
// foo.ts
const someVar = 123;
type someType = {
  type: string;
};

export { someVar, someType };
```

- 你也可以用重命名变量的方式导出：

```ts
// foo.ts
const someVar = 123;
export { someVar as aDifferentName };
```

- 使用 `import` 关键字导入一个变量或者是一个类型：

```ts
// bar.ts
import { someVar, someType } from './foo';
```

- 通过重命名的方式导入变量或者类型：

```ts
// bar.ts
import { someVar as aDifferentName } from './foo';
```

- 除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面：

```ts
// bar.ts
import * as foo from './foo';
// 你可以使用 `foo.someVar` 和 `foo.someType` 以及其他任何从 `foo` 导出的变量或者类型
```

- 只导入模块：

```ts
import 'core-js'; // 一个普通的 polyfill 库
```

- 从其他模块导入后整体导出：

```ts
export * from './foo';
```

- 从其他模块导入后，部分导出：

```ts
export { someVar } from './foo';
```

- 通过重命名，部分导出从另一个模块导入的项目：

```ts
export { someVar as aDifferentName } from './foo';
```

### 默认导入／导出

我并不喜欢用默认导出，虽然有默认导出的语法：

- 使用 `export default`
  - 在一个变量之前（不需要使用 `let/const/var`）；
  - 在一个函数之前；
  - 在一个类之前。

```ts
// some var
export default (someVar = 123);

// some function
export default function someFunction() {}

// some class
export default class someClass {}
```

- 导入使用 `import someName from 'someModule'` 语法（你可以根据需要为导入命名）：

```ts
import someLocalNameForThisFile from './foo';
```

### 模块路径

> [!TIP]
>
> 如果你需要使用 `moduleResolution: node` 选项，你应该将此选项放入你的配置文件中。如果你使用了 `module: commonjs` 选项， `moduleResolution: node` 将会默认开启。

这里存在两种截然不同的模块：

- 相对模块路径（路径以 `.` 开头，例如：`./someFile` 或者 `../../someFolder/someFile` 等）；
- 其他动态查找模块（如：`core-js`，`typestyle`，`react` 或者甚至是 `react/core` 等）。

它们的主要区别在于系统如何解析模块。

> [!TIp]
>
> 我将会使用一个概念性术语，`place` -- 将在提及查找模式后解释它。

#### 相对模块路径

这很简单，仅仅是按照相对路径来就可以了：

- 如果文件 `bar.ts` 中含有 `import * as foo from './foo'`，那么 `foo` 文件必须与 `bar.ts` 文件存在于相同的文件夹下
- 如果文件 `bar.ts` 中含有 `import * as foo from '../foo'`，那么 `foo` 文件所存在的地方必须是 `bar.ts` 的上一级目录；
- 如果文件 `bar.ts` 中含有 `import * as foo from '../someFolder/foo'`，那么 `foo` 文件所在的文件夹 `someFolder` 必须与 `bar.ts` 文件所在文件夹在相同的目录下。

你还可以思考一下其他相对路径导入的场景。😃

#### 动态查找

当导入路径不是相对路径时，模块解析将会模仿 [Node 模块解析策略](https://nodejs.org/api/modules.html#modules_all_together)，下面我将给出一个简单例子：

- 当你使用 `import * as foo from 'foo'`，将会按如下顺序查找模块：
  - `./node_modules/foo`
  - `../node_modules/foo`
  - `../../node_modules/foo`
  - 直到系统的根目录
- 当你使用`import * as foo from 'something/foo'`，将会按照如下顺序查找内容
  - `./node_modules/something/foo`
  - `../node_modules/something/foo`
  - `../../node_modules/something/foo`
  - 直到系统的根目录

### 什么是 `place`

当我提及被检查的 `place` 时，我想表达的是在这个 `place` 上，TypeScript 将会检查以下内容（例如一个 `foo` 的 `place`）：

- 如果这个 `place` 表示一个文件，如：`foo.ts`，欢呼！
- 否则，如果这个 `place` 是一个文件夹，并且存在一个文件 `foo/index.ts`，欢呼！
- 否则，如果这个 `place` 是一个文件夹，并且存在一个 `foo/package.json` 文件，在该文件中指定 `types` 的文件存在，那么就欢呼！
- 否则，如果这个 `place` 是一个文件夹，并且存在一个 `package.json` 文件，在该文件中指定 `main` 的文件存在，那么就欢呼！

从文件类型上来说，我实际上是指 `.ts`， `.d.ts` 或者 `.js`

就是这样，现在你已经是一个模块查找专家（这并不是一个小小的成功）。

### 重写类型的动态查找

在你的项目里，你可以通过 `declare module 'somePath'` 声明一个全局模块的方式，来解决查找模块路径的问题。

```ts
// global.d.ts
declare module 'foo' {
  // some variable declarations
  export var bar: number;
}
```

接着 ：

```ts
// anyOtherTsFileInYourProject.ts
import * as foo from 'foo';
// TypeScript 将假设（在没有做其他查找的情况下）
// foo 是 { bar: number }
```

### `import/require` 仅仅是导入类型

以下导入语法：

```ts
import foo = require('foo');
```

它实际上只做了两件事：

- 导入 foo 模块的所有类型信息；
- 确定 foo 模块运行时的依赖关系。

你可以选择仅加载类型信息，而没有运行时的依赖关系。在继续之前，你可能需要重新阅读本书 [声明空间部分](https://jkchao.github.io/typescript-book-chinese/project/declarationspaces.html) 部分。

如果你没有把导入的名称当做变量声明空间来用，在编译成 JavaScript 时，导入的模块将会被完全移除。

#### 使用例子：懒加载

类型推断需要提前完成，这意味着，如果你想在 `bar` 文件里，使用从其他文件 `foo` 导出的类型，你将不得不这么做：

```ts
import foo = require('foo');
let bar: foo.SomeType;
```

然而，在某些情景下，你只想在需要时加载模块 `foo`，此时你需要仅在类型注解中使用导入的模块名称，而**不**是在变量中使用。在编译成 JavaScript 时，这些将会被移除。接着，你可以手动导入你需要的模块。

作为一个例子，考虑以下基于 `commonjs` 的代码，我们仅在一个函数内导入 `foo` 模块：

```ts
import foo = require('foo');

export function loadFoo() {
  // 这是懒加载 foo，原始的加载仅仅用来做类型注解
  const _foo: typeof foo = require('foo');
  // 现在，你可以使用 `_foo` 替代 `foo` 来作为一个变量使用
}
```

一个同样简单的 `amd` 模块（使用 requirejs）：

```ts
import foo = require('foo');

export function loadFoo() {
  // 这是懒加载 foo，原始的加载仅仅用来做类型注解
  require(['foo'], (_foo: typeof foo) => {
    // 现在，你可以使用 `_foo` 替代 `foo` 来作为一个变量使用
  });
}
```

这些通常在以下情景使用：

- 在 web app 里， 当你在特定路由上加载 JavaScript 时；
- 在 node 应用里，当你只想加载特定模块，用来加快启动速度时。

#### 使用例子：打破循环依赖

类似于懒加载的使用用例，某些模块加载器（commonjs/node 和 amd/requirejs）不能很好的处理循环依赖。在这种情况下，一方面我们使用延迟加载代码，并在另一方面预先加载模块是很实用的。

#### 使用例子：确保导入

当你加载一个模块，只是想引入其附加的作用（如：模块可能会注册一些像 [CodeMirror addons](https://codemirror.net/doc/manual.html#addons)）时，然而，如果你仅仅是 `import/require` （导入）一些并没有与你的模块或者模块加载器有任何依赖的 JavaScript 代码，（如：webpack），经过 TypeScript 编译后，这些将会被完全忽视。在这种情况下，你可以使用一个 `ensureImport` 变量，来确保编译的 JavaScript 依赖与模块。如：

```ts
import foo = require('./foo');
import bar = require('./bar');
import bas = require('./bas');

const ensureImport: any = foo || bar || bas;
```

### global.d.ts

在上文中，当我们讨论文件模块时，比较了全局变量与文件模块，并且我们推荐使用基于文件的模块，而不是选择污染全局命名空间。

然而，如果你的团队里有 TypeScript 初学者，你可以提供他们一个 `global.d.ts` 文件，用来将一些接口或者类型放入全局命名空间里，这些定义的接口和类型能在你的所有 TypeScript 代码里使用。

TIP

对于任何需要编译成 `JavaScript` 的代码，我们强烈建议你放入文件模块里。

- `global.d.ts` 是一种扩充 `lib.d.ts` 很好的方式，如果你需要的话。
- 当你从 `JS` 迁移到 `TS` 时，定义 `declare module "some-library-you-dont-care-to-get-defs-for"` 能让你快速开始。

## 命名空间

在 JavaScript 使用命名空间时， 这有一个常用的、方便的语法：

```js
(function(something) {
  something.foo = 123;
})(something || (something = {}));
```

`something || (something = {})` 允许匿名函数 `function (something) {}` 向现有对象添加内容，或者创建一个新对象，然后向该对象添加内容。这意味着你可以拥有两个由某些边界拆成的块。

```js
(function(something) {
  something.foo = 123;
})(something || (something = {}));

console.log(something);
// { foo: 123 }

(function(something) {
  something.bar = 456;
})(something || (something = {}));

console.log(something); // { foo: 123, bar: 456 }
```

在确保创建的变量不会泄漏至全局命名空间时，这种方式在 JavaScript 中很常见。当基于文件模块使用时，你无须担心这点，但是该模式仍然适用于一组函数的逻辑分组。因此 TypeScript 提供了 `namespace` 关键字来描述这种分组，如下所示。

```ts
namespace Utility {
  export function log(msg) {
    console.log(msg);
  }
  export function error(msg) {
    console.log(msg);
  }
}

// usage
Utility.log('Call me');
Utility.error('maybe');
```

`namespace` 关键字编译后的 JavaScript 代码，与我们早些时候看到的 JavaScript 代码一样。

```js
(function (Utility) {
  // 添加属性至 Utility
})(Utility || Utility = {});
```

值得注意的一点是，命名空间是支持嵌套的。因此，你可以做一些类似于在 `Utility` 命名空间下嵌套一个命名空间 `Messaging` 的事情。

对于大多数项目，我们建议使用外部模块和命名空间，来快速演示和移植旧的 JavaScript 代码。

## 动态导入表达式

动态导入表达式是 ECMAScript 的一个新功能，它允许你在程序的任意位置异步加载一个模块，TC39 JavaScript 委员会有一个提案，目前处于第四阶段，它被称为 **[import() proposal for JavaScript](https://github.com/tc39/proposal-dynamic-import)**。

此外，**webpack** bundler 有一个 [`Code Splitting`](https://webpack.js.org/guides/code-splitting/) 功能，它能允许你将代码拆分为许多块，这些块在将来可被异步下载。因此，你可以在程序中首先提供一个最小的程序启动包，并在将来异步加载其他模块。

这很自然就会让人想到（如果我们工作在 webpack dev 的工作流程中）[TypeScript 2.4 dynamic import expressions](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#dynamic-import-expressions) 将会把你最终生成的 JavaScript 代码自动分割成很多块。但是这似乎并不容易实现，因为它依赖于我们正在使用的 `tsconfig.json` 配置文件。

webpack 实现代码分割的方式有两种：使用 `import()` （首选，ECMAScript 的提案）和 `require.ensure()` （最后考虑，webpack 具体实现）。因此，我们期望 TypeScript 的输出是保留 `import()` 语句，而不是将其转化为其他任何代码。

让我们来看一个例子，在这个例子中，我们演示了如何配置 webpack 和 TypeScript 2.4 +。

在下面的代码中，我希望懒加载 `moment` 库，同时我也希望使用代码分割的功能，这意味 `moment` 会被分割到一个单独的 JavaScript 文件，当它被使用时，会被异步加载。

```ts
import(/* webpackChunkName: "momentjs" */ 'moment')
  .then(moment => {
    // 懒加载的模块拥有所有的类型，并且能够按期工作
    // 类型检查会工作，代码引用也会工作  :100:
    const time = moment().format();
    console.log('TypeScript >= 2.4.0 Dynamic Import Expression:');
    console.log(time);
  })
  .catch(err => {
    console.log('Failed to load moment', err);
  });
```

这是 `tsconfig.json` 的配置文件：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "lib": [
      "dom",
      "es5",
      "scripthost",
      "es2015.promise"
    ],
    "jsx": "react",
    "declaration": false,
    "sourceMap": true,
    "outDir": "./dist/js",
    "strict": true,
    "moduleResolution": "node",
    "typeRoots": [
      "./node_modules/@types"
    ],
    "types": [
      "node",
      "react",
      "react-dom"
    ]
  }
}
```

> [!caution]
>
> - 使用 `"module": "esnext"` 选项：TypeScript 保留 `import()` 语句，该语句用于 Webpack Code Splitting。
> - 进一步了解有关信息，推荐阅读这篇文章：[Dynamic Import Expressions and webpack 2 Code Splitting integration with TypeScript 2.4.](https://blog.josequinto.com/2017/06/29/dynamic-import-expressions-and-webpack-code-splitting-integration-with-typescript-2-4/)
