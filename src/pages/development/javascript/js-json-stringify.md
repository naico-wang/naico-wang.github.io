---
title: JavaScript的JSON.stringify鲜为人知的技巧
date: 2024-08-15
tag: JavaScript
category: JavaScript
abstract: 在日常开发中，我们经常会使用到 JSON.stringify 这个方法，特别是在需要进行序列化（深拷贝）的时候。它可以把我们的对象转换成一个 JSON 字符串，这个方法确实非常方便，但它也有一些不常被注意到的缺点。
---

# 掌握JavaScript的JSON.stringify鲜为人知的技巧，让前端开发更加高效和灵活

```javascript
JSON.stringify(...)
```

在日常开发中，我们经常会使用到 `JSON.stringify` 这个方法，特别是在需要进行**序列化（深拷贝）**的时候。它可以把我们的对象转换成一个 `JSON` 字符串，这个方法确实非常方便，但它也有一些不常被注意到的缺点。

首先，`JSON.stringify` 的使用场景非常广泛，比如说当我们需要把对象保存到本地存储时，或者需要在前后端之间传输数据时，都会用到它。它就像是一个神奇的转换器，让我们可以轻松地处理复杂的数据结构。

然而，这个看似完美的方法也有它的局限性。比如说，它**无法处理函数**、**undefined**、**Symbol** 等特殊类型的数据，这些数据在转换成 `JSON` 字符串时会被忽略掉。此外，如果对象中存在**循环引用**，`JSON.stringify` 也会报错。

对于初学者来说，这些问题可能不太容易发现，因为大多数时候我们处理的数据都是简单的对象和数组。但在实际开发中，了解这些细节能够帮助我们更好地利用 `JSON.stringify`，同时避免一些潜在的坑。

## 小心这些坑！

在开发过程中，`JSON.stringify` 是我们常用的工具，但是它也有一些小坑，特别是处理某些特殊情况时。下面，我们通过几个例子来了解一下这些局限性。

### 1. 函数问题

如果对象的属性是函数，这个属性在序列化时会丢失。

```javascript
let person = {
  name: '小明',
  greet: function () {
    console.log(`你好，我是${ this.name }`)
  }
}

console.log(JSON.stringify(person)); // {"name":"小明"}
```

解释：在上面的例子中，`greet` 函数在转换成 `JSON` 字符串后被丢弃了。

### 2. undefined 问题

如果对象的属性值是 `undefined`，这个属性在转换后也会消失。

```javascript
let data = {
  age: undefined
}

console.log(JSON.stringify(data)); // {}
```

解释：在这个例子中，`age` 属性在转换后完全消失了。

### 3. 正则表达式问题

如果对象的属性是**正则表达式**，转换后会变成一个空对象。

```javascript
let settings = {
  name: '配置',
  pattern: /^a/,
  display: function () {
    console.log(`${ this.name }`)
  }
}

console.log(JSON.stringify(settings)); // {"name":"配置","pattern":{}}
```

解释：这里的 `pattern` 正则表达式在转换后变成了一个空对象 `{}`。

### 4. 数组对象的问题

上述问题在数组对象中同样会出现。

```javascript
let items = [
  {
    price: undefined
  }
]

console.log(JSON.stringify(items)); // [{}]
```

解释：在数组对象中，`price` 属性的 `undefined` 值在转换后也被丢弃了。

## JSON.stringify 的独特特性

### 1、特殊值的处理

- **对象属性中的特殊值**

  当 `undefined`、`函数`和 `Symbol` 作为对象属性值时，`JSON.stringify` 会忽略它们。

  ```javascript
  const data = {
    a: "文字",
    b: undefined,
    c: Symbol("符号"),
    fn: function() {
      return true;
    }
  };

  console.log(JSON.stringify(data)); // "{"a":"文字"}"
  ```
  
  解释：在上面的例子中，`data` 对象的 `b`、`c` 和 `fn` 属性在序列化后都被忽略了，只剩下属性 `a` 被保留。

- **数组元素中的特殊值**
  
  当 `undefined`、`函数`和 `Symbol` 作为数组元素时，`JSON.stringify` 会将它们序列化为 `null`。

  ```javascript
  const array = ["文字", undefined, function aa() { return true; }, Symbol('符号')];

  console.log(JSON.stringify(array)); // "["文字",null,null,null]"
  ```

  解释：在这个例子中，数组中的 `undefined`、`函数`和 `Symbol` 都被转换成了 `null`，而不是被忽略。

- **独立的特殊值**
  
  当 `undefined`、`函数`和 `Symbol` 被独立序列化时，`JSON.stringify` 会直接返回 `undefined`。

  ```javascript
  console.log(JSON.stringify(function a (){console.log('a')})); // undefined
  console.log(JSON.stringify(undefined)); // undefined
  console.log(JSON.stringify(Symbol('符号'))); // undefined
  ```

  解释：在这些情况下，`JSON.stringify` 并不会返回 `JSON` 字符串，而是直接返回 `undefined`，表示这些值无法被序列化。

### 2、顺序

在使用 `JSON.stringify` 进行序列化时，除了我们之前提到的特殊值处理外，还有一个需要注意的点就是对象属性的顺序问题。让我们通过具体的例子来了解这些特性。

- **非数组对象的属性顺序**

  对于非数组对象来说，属性的顺序在序列化后的 JSON 字符串中并不一定是按照我们定义的顺序出现的，尤其是当一些属性值被忽略时。

  ```javascript
  const data = {
    a: "文字",
    b: undefined,
    c: Symbol("符号"),
    fn: function() {
      return true;
    },
    d: "更多文字"
  };

  console.log(JSON.stringify(data)); // "{"a":"文字","d":"更多文字"}"
  ```

  解释：在这个例子中，`data` 对象中的 `b`、`c` 和 `fn` 属性由于特殊值的原因被忽略了，最终的 `JSON` 字符串中只剩下 `a` 和 `d` 属性，而且顺序并没有保证。

- **数组元素的顺序**

  对于数组来说，元素的顺序在序列化后是可以保证的，即使数组中包含 `undefined`、`函数`和 `Symbol` 这些特殊值，它们会被转换成 `null`，但顺序不会改变。

  ```javascript
  const array = ["文字", undefined, function aa() { return true; }, Symbol('符号'), "更多文字"];

  console.log(JSON.stringify(array)); // "["文字",null,null,null,"更多文字"]"
  ```

  解释：在这个例子中，数组中的 `undefined`、`函数`和 `Symbol` 被转换成 `null`，但数组中元素的顺序保持不变。

### 3、利用 toJSON 方法自定义序列化结果

在使用 `JSON.stringify` 进行对象序列化时，有一个非常有趣且强大的特性——如果被转换的值中包含 `toJSON()` 方法，那么序列化的结果将由 `toJSON()` 方法返回的值决定，而忽略对象的其他属性。这为我们提供了很大的灵活性，可以自定义序列化结果。让我们通过具体的例子来了解这个特性。

- **自定义序列化结果**

  当一个对象包含 `toJSON()` 方法时，`JSON.stringify` 会调用这个方法，并使用其返回值作为最终的序列化结果。

  ```javascript
  const data = {
    say: "你好，JSON.stringify",
    toJSON: function() {
      return "今天我学到了";
    }
  };

  console.log(JSON.stringify(data)); // "今天我学到了"
  ```

  解释：在这个例子中，虽然 `data` 对象包含了 `say` 属性，但因为它定义了 `toJSON()` 方法，序列化时会调用这个方法，并使用它的返回值 "`今天我学到了`" 作为最终结果。

- **实际应用场景**

  这个特性可以在多种场景中应用，比如在对象序列化时需要隐藏某些敏感信息，或者只返回对象中的关键信息。

  ```javascript
  const user = {
    name: "小明",
    password: "123456",
    toJSON: function() {
      return {
        name: this.name
      };
    }
  };

  console.log(JSON.stringify(user)); // "{"name":"小明"}"
  ```

  解释：在这个例子中，`user` 对象通过 `toJSON()` 方法自定义了序列化结果，只返回 `name` 属性，隐藏了敏感的 `password` 信息。

### 4、Date 对象的序列化技巧

在使用 `JSON.stringify` 时，处理日期对象是一个常见的需求。幸运的是，`JSON.stringify` 可以很好地处理 `Date` 对象，因为 `Date` 对象本身实现了 `toJSON()` 方法。让我们通过具体例子来了解这一特性，并探讨如何在实际开发中灵活运用。

- **日期对象的序列化**

  当我们将 `Date` 对象传给 `JSON.stringify` 时，它会调用 `Date` 对象的 `toJSON()` 方法，该方法等同于 `Date.toISOString()`，返回一个标准的 `ISO` 字符串格式。

  ```javascript
  const data = {
    now: new Date()
  };

  console.log(JSON.stringify(data)); // "{"now":"2024-06-16T12:43:13.577Z"}"
  ```

  解释：在这个例子中，`data` 对象中的 `now` 属性是一个 `Date` 对象，序列化后变成了 `ISO 8601` 格式的字符串，表示日期和时间。

- **Date 对象的 toJSON() 方法**
  
  `Date` 对象的 `toJSON()` 方法实际上返回的是 `Date.toISOString()` 的结果，这使得日期在序列化后以字符串形式表示，并且格式统一，方便数据传输和存储。

  ```javascript
  const now = new Date();

  console.log(now.toJSON()); // "2024-06-16T12:43:13.577Z"
  console.log(now.toISOString()); // "2024-06-16T12:43:13.577Z"
  ```

  解释：无论是直接调用 `toJSON()` 还是 `toISOString()`，得到的结果都是同样的 `ISO` 字符串格式。

- **实际应用场景**
  
  在实际开发中，我们经常需要将日期对象转换为 `JSON` 字符串，以便在前后端之间传输数据或存储到数据库中。统一的 `ISO` 格式不仅简洁，还可以方便地在不同系统和语言之间解析和使用。

  ```javascript
  const event = {
    name: "会议",
    date: new Date("2024-08-11T10:00:00Z")
  };

  console.log(JSON.stringify(event)); // "{"name":"会议","date":"2024-08-11T10:00:00.000Z"}"
  ```

  解释：在这个例子中，我们创建了一个包含日期的事件对象，序列化后，日期属性被转换成 ISO 字符串，方便在网络上传输。

### 5、的特殊数值处理：NaN、Infinity 和 null 的处理方式

在使用 `JSON.stringify` 时，处理特殊数值也是一个需要注意的问题。`NaN`、`Infinity` 和 `null` 在序列化时都会被处理为 `null`。让我们通过一些具体的例子来详细了解这一特性。

- **数值 NaN 和 Infinity 的序列化**
  
  当我们将 `NaN` 或 `Infinity` 传给 `JSON.stringify` 时，它们会被转换成 `null`。

  ```javascript
  console.log(JSON.stringify(NaN)); // "null"
  console.log(JSON.stringify(Infinity)); // "null"
  ```

  解释：在这个例子中，无论是 `NaN` 还是 `Infinity`，都被序列化为 `"null"`，这是因为 `JSON` 不支持这两种特殊数值，所以将其转换为 `null` 来表示。

- **null 的序列化**

  当我们将 `null` 传给 `JSON.stringify` 时，它会被直接转换为字符串 `"null"`。

  ```javascript
  console.log(JSON.stringify(null)); // "null"
  ```

  解释：`null` 是 `JSON` 支持的一个特殊值，所以它在序列化时会被保留为 `"null"` 字符串。

- **对象和数组中的特殊数值**

  当 `NaN`、`Infinity` 和 `null` 作为对象属性值或数组元素时，它们会被转换为 `null`。

  ```javascript
  const data = {
    num1: NaN,
    num2: Infinity,
    num3: null
  };

  console.log(JSON.stringify(data)); // "{"num1":null,"num2":null,"num3":null}"

  const array = [NaN, Infinity, null];
  console.log(JSON.stringify(array)); // "[null,null,null]"
  ```

  解释：在这个例子中，`data` 对象中的 `num1` 和 `num2` 属性值，及数组中的 `NaN` 和 `Infinity` 元素，都被转换为 `null`。

- **实际应用场景**
  
  理解这些特性有助于我们在实际开发中正确处理数据，特别是在数据传输和存储时，避免因为特殊数值导致的数据不一致问题。

  ```javascript
  const stats = {
    average: NaN,
    max: Infinity,
    min: null,
    values: [1, 2, NaN, 4, Infinity]
  };

  console.log(JSON.stringify(stats)); 
  // "{"average":null,"max":null,"min":null,"values":[1,2,null,4,null]}"
  ```

  解释：在这个统计数据对象中，所有的 `NaN` 和 `Infinity` 值在序列化后都被转换为 `null`，保证了 `JSON` 数据的一致性。

### 6、包装对象处理：自动转换为原始值

在使用 `JSON.stringify` 时，有一个很重要的特性是，布尔值、数字和字符串的包装对象在序列化时会自动转换为它们对应的原始值。这一特性有助于确保序列化后的 `JSON` 数据更简洁和易于使用。让我们通过具体的例子来深入了解这一特性。

- **包装对象的序列化**
  
  当我们将 `Number`、`String` 和 `Boolean` 包装对象传给 `JSON.stringify` 时，它们会被自动转换为对应的原始值。

  ```javascript
  console.log(JSON.stringify([new Number(1), new String("false"), new Boolean(false)]));
  // "[1,"false",false]"
  ```

  解释：在这个例子中，`new Number(1)` 被转换为 `1`，`new String("false")` 被转换为 `"false"`，`new Boolean(false)` 被转换为 `false`。这些包装对象在序列化时都被简化为原始值，确保 `JSON` 数据的简洁性。

### 7、枚举属性与非枚举属性

在使用 JSON.stringify 进行对象序列化时，有一个关键的特性是：**它只会序列化对象的可枚举属性（enumerable properties）**。这意味着非枚举属性会被忽略，从而确保序列化结果的简洁和预期。让我们通过具体的例子来详细了解这一特性。

- **枚举属性与非枚举属性的区别**
  
  在 `JavaScript` 中，对象的属性可以被标记为枚举属性或非枚举属性。`JSON.stringify` 只会序列化枚举属性，而忽略非枚举属性。

  ```javascript
  const data = Object.create(
    null,
    { 
      x: { value: 'json', enumerable: false }, 
      y: { value: 'stringify', enumerable: true } 
    }
  );

  console.log(JSON.stringify(data)); // "{"y":"stringify"}"
  ```

  解释：在这个例子中，`data` 对象的 `x` 属性被标记为非枚举属性，`y` 属性被标记为枚举属性。`JSON.stringify` 在序列化时忽略了 `x` 属性，只保留了 `y` 属性。

- **处理 Map、Set 等对象**
  
  类似地，对于 `Map`、`Set` 等对象，JSON.stringify 也只会序列化它们的可枚举属性，而这些对象的特殊数据结构本身不会被直接序列化。

  ```javascript
  const map = new Map();
  map.set('a', 1);
  map.set('b', 2);

  const set = new Set();
  set.add(1);
  set.add(2);

  console.log(JSON.stringify(map)); // "{}"
  console.log(JSON.stringify(set)); // "{}"
  ```
  
  解释：在这个例子中，`map` 和 `set` 对象的内部数据结构没有被序列化，而是返回了空对象。这是因为 `Map` 和 `Set` 的数据存储并不是作为对象的属性存在的。

- **实际应用场景**
  了解这个特性对于处理复杂对象结构非常重要，特别是在需要控制序列化结果的情况下。例如，可以通过定义非枚举属性来隐藏一些不需要序列化的内部数据。

  ```javascript
  const user = {
    name: '小明',
    age: 25
  };

  Object.defineProperty(user, 'password', {
    value: '123456',
    enumerable: false
  });

  console.log(JSON.stringify(user)); // "{"name":"小明","age":25}"
  ```

  解释：在这个例子中，我们通过 `Object.defineProperty` 将 `password` 属性标记为非枚举属性，从而在序列化时将其隐藏。

### 8、JSON.parse(JSON.stringify()) 的局限性

我们都知道，使用 `JSON.parse(JSON.stringify())` 是实现深克隆的最简单和直接的方法。然而，由于序列化的各种特性，这种方法在实际应用中会带来许多问题，尤其是当对象存在循环引用时，会导致错误。让我们通过一个具体的例子来详细了解这些局限性。

- **循环引用的问题**
  
  当对象存在循环引用时，JSON.stringify() 会抛出错误，因为 JSON 不支持循环结构。

  ```javascript
  const obj = {
    name: "loopObj"
  };
  const loopObj = {
    obj
  };
  // 对象形成循环引用，创建了一个闭环
  obj.loopObj = loopObj;

  // 封装一个深克隆函数
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  // 执行深克隆，会抛出错误
  deepClone(obj);
  /**
  VM44:9 Uncaught TypeError: Converting circular structure to JSON
      --> starting at object with constructor 'Object'
      |     property 'loopObj' -> object with constructor 'Object'
      --- property 'obj' closes the circle
      at JSON.stringify (<anonymous>)
      at deepClone (<anonymous>:9:26)
      at <anonymous>:11:13
  */
  ```

  解释：在这个例子中，obj 和 loopObj 形成了一个循环引用，这导致 JSON.stringify() 在处理时抛出了 TypeError 错误。

- **深克隆的替代方法**
  
  为了安全地进行深克隆，特别是处理循环引用，我们需要使用更复杂的方法。以下是两种常见的替代方案：

  - **1. 使用递归和 Map 记录引用**

    ```javascript
    function deepClone(obj, hash = new WeakMap()) {
      if (obj === null) return null;
      if (typeof obj !== "object") return obj;
      if (hash.has(obj)) return hash.get(obj);

      const cloneObj = Array.isArray(obj) ? [] : {};
      hash.set(obj, cloneObj);

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloneObj[key] = deepClone(obj[key], hash);
        }
      }

      return cloneObj;
    }

    const newObj = deepClone(obj);
    console.log(newObj);
    ```

    解释：这个 `deepClone` 函数使用 `WeakMap` 来记录已经克隆过的对象，避免了循环引用的问题。

  - **2. 使用第三方库**
  
    如果不想手动实现深克隆，可以使用现成的第三方库，如 `lodash` 提供的 `_.cloneDeep` 方法。

    ```javascript
    const _ = require('lodash');

    const newObj = _.cloneDeep(obj);
    console.log(newObj);
    ```

    解释：`lodash` 的 `_.cloneDeep` 方法能够处理大多数复杂情况，包括循环引用。

### 9、Symbol 属性的序列化问题

在使用 `JSON.stringify` 进行对象序列化时，有一个需要特别注意的点：如果对象的属性使用 `Symbol` 作为键，这些属性会被完全忽略，即使在 `replacer` 参数中显式包含也无效。让我们通过具体的例子来详细了解这一特性。

- **Symbol 属性的序列化**
  
  当对象的属性使用 `Symbol` 作为键时，`JSON.stringify` 会忽略这些属性，不会将它们包含在序列化结果中。

  ```javascript
  const data = { [Symbol.for("json")]: "stringify" };

  console.log(JSON.stringify(data)); // "{}"
  ```
  
  解释：在这个例子中，`data` 对象的属性键是一个 `Symbol`，所以在序列化时，这个属性被完全忽略了。

- **使用 replacer 参数**
  
  即使我们在 `JSON.stringify` 的 `replacer` 参数中显式包含处理 `Symbol` 属性的逻辑，这些属性仍然会被忽略。

  ```javascript
  const data = { [Symbol.for("json")]: "stringify" };

  console.log(JSON.stringify(data, function(k, v) {
    if (typeof k === "symbol") {
      return v;
    }
  })); // "undefined"
  ```

  解释：在这个例子中，`replacer` 函数试图检查 `Symbol` 类型的键并返回其值，但 `JSON.stringify` 仍然忽略了该属性，结果为`undefined`。

## 第二个参数 replacer 的妙用

在使用 `JSON.stringify` 进行对象序列化时，除了常见的用法，还有一些高级功能可以通过第二个参数 `replacer` 实现。`replacer` 可以是一个函数或数组，用于定制序列化的结果。让我们通过具体的例子来详细了解这些用法。

### 1. 使用 replacer 参数作为函数

当 `replacer` 参数是一个函数时，它会在每个属性值被序列化之前调用，类似于数组方法中的 `map` 和 `filter`。该函数接收两个参数：`键和值`。

```javascript
const data = {
  a: "aaa",
  b: undefined,
  c: Symbol("dd"),
  fn: function() {
    return true;
  }
};

// 不使用 replacer 参数
console.log(JSON.stringify(data)); 
// "{"a":"aaa"}"

// 使用 replacer 参数作为函数
console.log(JSON.stringify(data, (key, value) => {
  switch (true) {
    case typeof value === "undefined":
      return "undefined";
    case typeof value === "symbol":
      return value.toString();
    case typeof value === "function":
      return value.toString();
    default:
      break;
  }
  return value;
}));
// "{"a":"aaa","b":"undefined","c":"Symbol(dd)","fn":"function() {\n    return true;\n  }"}"
```

解释：在这个例子中，`replacer` 函数将 `undefined`、`Symbol` 和`函数`转换为字符串，使得它们能够被序列化。

### 2. 第一次调用 replacer 函数的特殊情况

当 `replacer` 函数被第一次调用时，传入的第一个参数并不是对象的第一个键值对，而是一个空字符串作为键，整个对象作为值。

```javascript
const data = {
  a: 2,
  b: 3,
  c: 4,
  d: 5
};

console.log(JSON.stringify(data, (key, value) => {
  console.log(value);
  return value;
}));
// The first argument passed to the replacer function is 
// {"":{a: 2, b: 3, c: 4, d: 5}}
// 2
// 3
// 4
// 5
// {a: 2, b: 3, c: 4, d: 5}  
```

### 3. 使用 replacer 函数实现对象的 map 功能

我们可以利用 `replacer` 函数手动实现类似于数组 `map` 方法的功能，遍历对象的每个属性并对其进行操作。

```javascript
const data = {
  a: 2,
  b: 3,
  c: 4,
  d: 5
};

const objMap = (obj, fn) => {
  if (typeof fn !== "function") {
    throw new TypeError(`${fn} is not a function !`);
  }
  return JSON.parse(JSON.stringify(obj, fn));
};

console.log(objMap(data, (key, value) => {
  if (value % 2 === 0) {
    return value / 2;
  }
  return value;
}));
// {a: 1, b: 3, c: 2, d: 5}
```

### 4. 使用 replacer 参数作为数组

当 `replacer` 参数是一个数组时，数组中的值表示要被序列化到 `JSON` 字符串中的属性名。

```javascript
const jsonObj = {
  name: "JSON.stringify",
  params: "obj,replacer,space"
};

// 仅保留 params 属性的值
console.log(JSON.stringify(jsonObj, ["params"]));
// "{"params":"obj,replacer,space"}"
```

解释：在这个例子中，`replacer` 数组指定只序列化 `params` 属性，其他属性会被忽略。

## 第三个参数：控制输出格式的 space 参数

在使用 `JSON.stringify` 进行对象序列化时，第三个参数 `space` 用于控制生成的 `JSON` 字符串中的空格和缩进。这个参数可以显著提高输出结果的可读性。让我们通过具体的例子来了解 `space` 参数的作用和用法。

### 1. space 参数的基本用法

`space` 参数可以是一个数字或字符串。数字表示每一级嵌套的缩进空格数，字符串则用于每一级嵌套的缩进字符。

```javascript
const tiedan = {
  name: "Jhon",
  describe: "JSON.stringify()",
  emotion: "like"
};

// 使用 "--" 作为缩进字符
console.log(JSON.stringify(tiedan, null, "--"));
/* 输出结果如下:
{
--"name": "Jhon",
--"describe": "JSON.stringify()",
--"emotion": "like"
}
*/

// 使用 2 个空格作为缩进字符
console.log(JSON.stringify(tiedan, null, 2));
/* 输出结果如下:
{
  "name": "Jhon",
  "describe": "JSON.stringify()",
  "emotion": "like"
}
*/
```

解释：在第一个例子中，`space` 参数是字符串 `"--"`，所以每一级嵌套使用两个连字符作为缩进。在第二个例子中，`space` 参数是数字 `2`，所以每一级嵌套使用两个空格作为缩进。

### 2. 数字作为 space 参数

当 `space` 参数是数字时，它表示每一级嵌套的缩进空格数，最大值为 `10`。

```javascript
const data = {
  level1: {
    level2: {
      level3: "deep"
    }
  }
};

// 使用 4 个空格作为缩进字符
console.log(JSON.stringify(data, null, 4));
/* 输出结果如下:
{
    "level1": {
        "level2": {
            "level3": "deep"
        }
    }
}
*/
```

解释：在这个例子中，`space` 参数是数字 `4`，所以每一级嵌套使用四个空格作为缩进。

## 总结

在这篇文章中，我们深入探讨了 `JSON.stringify` 的多种高级用法，从特殊值处理到如何使用 `replacer` 参数定制序列化结果，再到使用 `space` 参数美化输出。希望通过这些实例，你能更好地掌握和运用 `JSON.stringify`，让你的前端开发更加高效和灵活。



