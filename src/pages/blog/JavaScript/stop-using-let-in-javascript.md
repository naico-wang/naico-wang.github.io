---
title: 为什么 let 在 JavaScript/TypeScript 中是不必要的
date: 2024-08-26
abstract: 你可能已经遇到 let 关键字上百万次了。它是 JavaScript（以及扩展的 TypeScript）中那些最初看起来像是救星的特性之一。
---

# 为什么 let 在 JavaScript/TypeScript 中是不必要的

你可能已经遇到 `let` 关键字上百万次了。它是 `JavaScript`（以及扩展的 `TypeScript`）中那些最初看起来像是救星的特性之一。

终于有了一种声明变量的方式，可以尊重块级作用域！`var` 造成提升和产生反直觉 `bug` 的日子一去不复返了。

但是重点来了：在 2024 年，使用 `let` 可能是你在代码中做的最不必要的事情之一。

没错，你没听错。是时候停止使用 `let` 了。

让我来解释一下为什么，什么时候应该用 `const` 替换它，以及在那些罕见的情况下，`let` 仍然在你的 `TypeScript` 文件中有一席之地。

## let 的兴衰 🐑

我们回顾一下。在 `ES6` 之前的日子里，我们只能用 `var`。它是可以用的，但有深刻的缺陷。`var` 不尊重块级作用域，这意味着如果你在 `for` 循环内声明了一个 `var`，这个变量在循环外仍然可以访问。

这引发了混乱和充满 `bug` 的代码。`ES6`（也就是 `ECMAScript 2015`）通过引入 `let` 和 `const` 改变了游戏规则。突然间，我们有了块级作用域的变量！

不再有 `var` 的噩梦了！`let` 立即成为热门，因为它解决了我们多年来一直在与之搏斗的问题。

但是这里有一个问题 — `const` 是同时引入的，在大多数情况下，它可以说是更优的选择。

## 为什么 const 应该是你的默认选择 🐠

我们面对现实：不可变性是王道。在我们日常编程中，我们努力编写可预测、易于理解且没有副作用的代码。

这就是 `const` 的用武之地。当你使用 `const` 时，你是在告诉自己和他人这个值不会改变。

这是一个保证 — 一个承诺，表示这个变量不会突然在你的代码中途取得新值。

```javascript
const PI = 3.14159;
const MAX_USERS = 100;
const CONFIG = { api: 'https://api.example.com', timeout: 5000 };
```

这使你的代码更易读和维护。你可以瞥一眼用 `const` 声明的变量，立即知道它的意图：这个值是固定的。

另一方面，`let` 引入了不确定性。当你看到用 `let` 声明的变量时，你不能确定它是否会在后面发生变化。你必须在心理上或通过工具来跟踪它，这增加了认知负担。

根据我的经验，在审查代码时，我经常看到用 `let` 声明的变量很容易就可以是 `const`。似乎开发者出于习惯默认使用 let，即使他们不打算改变变量。

## let 的问题 🐲

`let` 的主要问题是它为不必要的可变性打开了大门。声明某些东西时使用 let 太容易了，以至于后来忘记了为什么它一开始需要是可变的。

这里有一个快速示例：

```javascript
let userCount = users.length;
if (someCondition) {
    userCount += 1;
}
console.log(`Total users: ${userCount}`);
```

在这个例子中，使用 `let` 可能看起来无害，但问问自己 — `userCount` 真的需要是可变的吗？

如果我们使用 `const` 并重构逻辑，代码是否同样清晰和功能性？

```javascript
const userCount = users.length + (someCondition ? 1 : 0);
console.log(`Total users: ${userCount}`);
```

砰！更清晰的代码，更少的可变性，更容易理解。

### 什么时候使用 let 🎒

那么，我们是否应该完全抛弃 `let`？不完全是。`let` 确实有合法的使用场景，尽管它们比你想象的要少得多。

1. 循环计数器：当你需要迭代某些东西时，`let` 通常是必要的。`for` 循环就是一个很好的例子：

    ```javascript
    for (let i = 0; i < 10; i++) {
        console.log(i);
    }
    ```
    
    这里，`i` 需要在每次迭代中改变，所以 `let` 是正确的选择。

2. 可重新赋值的变量：如果你有一个真正需要改变其值的变量（而不仅仅是为了方便），那么 `let` 是合适的。

    ```javascript
    let status = 'pending';
    // 一些异步操作
    status = 'completed';
    ```
    
    在这种情况下，重新赋值对逻辑至关重要。

但是这些场景比你预期的要少。通常，感觉需要 `let` 的地方可以重构成 `const`，而不失去清晰度或功能性。

## 更好代码的工具和技巧 🎥

想要将你的代码提升到下一个水平？这里有一些工具和技巧，可以帮助你最小化 `let` 的使用，拥抱 `const` 的力量：

- 代码检查工具：`ESLint` 是你的朋友。你可以配置 `ESLint` 在不必要使用 `let` 时发出警告或甚至抛出错误。这会推动你在使用 `let` 之前三思。

- 重构工具：像 `Prettier` 或 `VSCode` 的内置重构工具可以帮助你快速将 `let` 转换为 `const`（在适用的情况下）。只需右键点击，看着魔法发生。

- 同行评审：鼓励你的团队在代码审查期间质疑 `let` 的使用。问问："这真的需要是可变的吗？"这将有助于在你的团队中灌输不可变性的思维方式。

## 结论：拥抱不可变性

总结一下，在现代 `JavaScript` 和 `TypeScript` 中，`let` 应该是例外而不是规则。通过默认使用 `const`，你使你的代码更可预测、更易读、更不容易出错。当然，有些情况下 `let` 是必要的，但那应该是经过深思熟虑的。

所以，下次当你的手指悬停在键盘上，准备输入 `let` 时，花点时间问问自己："我真的需要这个是可变的吗？"很可能，答案是否定的。