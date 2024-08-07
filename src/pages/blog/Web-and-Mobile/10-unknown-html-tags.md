---
title: 十个几乎无人使用的罕见HTML标签
date: 2024-08-12
abstract: 在本文中，我们探讨了一些最鲜为人知且很少使用的HTML标签。尽管使用频率低，但这些罕见的标签在特定情况下可能非常有用。
---

# 十个几乎无人使用的罕见HTML标签

HTML远不止`div`、`a`和`p`这些标签。

还有许多更复杂、功能更强大的标签，很多开发者几乎从不使用。这些标签具有从现代列表可视化到彩色高亮等有趣功能。

在本文中，我们探讨了一些最鲜为人知且很少使用的HTML标签。尽管使用频率低，但这些罕见的标签在特定情况下可能非常有用。

## `<abbr>`标签

`<abbr>`标签用于定义缩写或首字母缩略词，如HTML、CSS和JS。也包括`LOL`——尽管现在它更像是一个独立的词。

```html
I'm reading about
<abbr title="Hypertext Markup Language">HTML</abbr>
tags at
<abbr title="Coding Beauty">CB</abbr>
```

我们使用`<abbr>`标签的title属性来显示缩写/首字母缩略词的描述，当你悬停在元素上时会显示"`Coding Beauty`"

## `<q>`标签

`<q>`标签表示其中的文本是一个简短的内联引用。

```html
<q>Coding creates informative tutorials on Web Development technologies</q>
```

现代浏览器通常通过在封闭的文本周围添加引号来实现这个标签。

## `<s>`标签

`<s>`用于删除线。用于更正而不破坏更改历史。

```html
Buy for <s>$200</s> $100
```

同时，`<del>`和`<ins>`类似，但在语义上用于文档更新而不是更正。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    del {
      background-color: lightsalmon;
    }
    ins {
      text-decoration: none;
      background-color: lightgreen;
    }
  </style>
</head>
<body>
  My favorite programming language is <del>JavaScript</del> <ins>TypeScript</ins>
</body>
</html>
```

## `<mark>`标签

标记或高亮文本。默认为黄色背景，就像浏览器显示搜索结果那样。

```html
Coding <mark>Beauty</mark> Website
```

## `<wbr>`标签

`<wbr>`告诉浏览器，"你只能在这里和那里断开文本"，这样浏览器就不会随意地在关键词中断开。

这就是为什么它叫`wbr` -- `Word BReak Opportunity`（单词断开机会）

```html
<p>this-is-a-very-long-text-created-to-test-the-wbr-tag</p>
<p>this-is-a-very-long-te<wbr />xt-created-to-test-the-wbr-tag</p>
```

## `<details>`标签

`<details>` 是关于展开和收缩的。可以默认收起一段文本，点击展开。

```html
<details>
  <summary>Lorem Ipsum</summary>
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti eos quod fugiat quasi repudiandae, minus quae facere. Sed, quia? Quod cupiditate asperiores neque iste consectetur tempore eum repellat incidunt qui.
</details>
```

## `<optgroup>`标签

顾名思义 — 用于分组选项。通常可以将巨大的选项列表分组为清晰的层次结构，`<optgroup>`就是为此而生。

```html
<select name="country" id="countries">
  <optgroup label="North America">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </optgroup>
  <optgroup label="Europe">
    <option value="uk">United Kingdom</option>
    <option value="fr">France</option>
  </optgroup>
</select>
```

## `<datalist>`标签

`<datalist>`致力于让文本输入变得轻而易举。通过下拉列表实现自动完成:

```html
<form>
  <label for="lang">Choose a language:</label>
  <input list="langs" name="lang" id="lang" />
  <!--  <input> 连接到 <datalist> -->
  <datalist id="langs">
    <option value="English" />
    <option value="French" />
    <option value="Spanish" />
    <option value="Chinese" />
    <option value="German" />
  </datalist>
</form>
```

## `<fieldset>`标签

我们使用`<legend>`标签为`<fieldset>`元素定义标题：

```html
<form>
  <fieldset>
    <legend>名字</legend>
    <label for="fname">名字:</label>
    <input type="text" id="fname" name="fname" /><br />
    <label for="mname">中间名:</label>
    <input type="text" id="mname" name="mname" /><br />
    <label for="lname">姓:</label>
    <input type="text" id="lname" name="lname" />
  </fieldset>
  <br />
  <label for="email">电子邮箱:</label>
  <input type="email" id="email" name="email" /><br /><br />
  <label for="password">密码:</label>
  <input type="password" id="password" name="password" />
</form>
```

##  `<sup>`和`<sub>`标签

分别代表上标和下标标签。

```html
<p>该文本包含 <sub>下标</sub> 文本</p>
<p>该文本包含 <sup>上标</sup> 文本</p>
```

可以用来书写化学方程式：H2SO4 + NaOH → Na2SO4 + H2O

```html
<p>H<sub>2</sub>SO<sub>4</sub> + NaOH → Na<sub>2</sub>SO<sub>4</sub> + H<sub>2</sub>O</p>
```

## 总结

在本文中，我们探讨了一些最鲜为人知且很少使用的HTML标签。尽管使用频率低，但这些罕见的标签在特定情况下可能非常有用。