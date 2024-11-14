---
title: 14个JS Reduce案例
date: 2024-10-04
category: JavaScript/TypeScript
---

# 14个JavaScript代码片段，轻松掌握reduce进阶用法

你是不是还在为处理数组头疼？那你一定要试试JavaScript的reduce方法！这个方法真的超强大，能把数组里的每个元素都“串”起来，最后得到一个你想要的结果。不管你是要计算总和，还是想把数据转换成另一种形式，reduce都能轻松帮你搞定。

## 基本语法

先来看看`reduce`的基本用法，语法其实很简单：

```javascript
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
```

- **array**：你要操作的数组。
- **function**：用来处理数组每个元素的回调函数。
- **initialValue**：可选的初始值，可以不写。

具体点说，回调函数里有这些参数：

- **total**：累计值。第一次是初始值，之后是上一次循环的结果。
- **currentValue**：当前处理的数组元素。
- **currentIndex**：当前元素的索引，通常用不到，可以忽略。
- **arr**：当前正在处理的整个数组，也可以忽略。

## 工作流程

理解这些参数后，我们来看`reduce`是怎么工作的：

1. **设置初始值**：如果你给了`initialValue`，它会作为`total`的初始值；如果没给，数组的第一个元素会作为初始值。

2. **迭代处理**：`reduce`从初始值开始（或者数组的第一个/第二个元素），逐个处理每个`currentValue`，并把结果累加到`total`。

3. **完成迭代**：数组处理完了，reduce就会返回累加后的最终结果。

## 举个简单的例子

假设你有一个数组`[1, 2, 3, 4]`，你想算出这个数组中所有数字的和：

```javascript
const sum = [1, 2, 3, 4].reduce(function(total, currentValue) {
  return total + currentValue;
}, 0);

console.log(sum); // 输出：10
```

看，这段代码就是在做加法，`reduce`从`0`开始，每次把当前数字加到`total`上，最后得到`10`。

## 基础示例

`reduce`方法在JavaScript中就像一个万能的工具箱，可以帮你轻松完成各种任务。

### 场景1：计算数组的总和

想象一下，你是一名超市收银员，顾客买了一堆东西，现在需要计算总价。你拿着收银机（`reduce`方法），每扫描一个商品的价格（数组中的每个数字），就把它累加到总金额中。最后，你告诉顾客一共需要多少钱。

代码如下：

```javascript
const prices = [5, 12, 3, 7, 10];
const totalAmount = prices.reduce((total, price) => total + price, 0);
console.log(totalAmount); // 输出：37
```

这里`reduce`就是在帮你“算账”，它从`0`开始，每次加上一个商品的价格，最后得到总金额`37`。

### 场景2：数组元素的拼接

假设你在写一首歌的歌词，每个词就像一颗珍珠，你需要把它们串成一句完整的话。`reduce`在这里就像一根线，把这些珍珠一个一个串起来，最终形成了一串美丽的项链。

代码如下：

```javascript
const lyrics = ["I", "love", "coding", "with", "JavaScript"];
const sentence = lyrics.reduce((total, word) => total + " " + word);

console.log(sentence); // 输出："I love coding with JavaScript"
```
在这个例子中，`reduce`把每个词拼接在一起，最终形成了这句优美的话："`I love coding with JavaScript`"。

### 场景3：找到数组中的最大值

想象你在组织一次班级选拔赛，想找出谁是班里的“最强王者”。每当有一个新同学（`currentValue`）登场时，你都要和现任“王者”（`total`）比一比，看谁更强，最终挑出那个真正的“王者”。

代码如下：

```javascript
const scores = [45, 85, 72, 93, 66];
const highestScore = scores.reduce((max, score) => Math.max(max, score), -Infinity);

console.log(highestScore); // 输出：93
```

在这个比喻中，reduce方法帮你把所有同学的分数都比了一遍，最后选出分数最高的那个，成为“最强王者”。

## 进阶用法

JavaScript的`reduce`方法不仅能处理基础的数组操作，在实际业务场景中，它还能帮你解决很多复杂的问题。接下来，我们将通过具体的业务场景，结合一些代码示例，来帮助你更好地理解这些高级用法。

### 1. 扁平化数组

想象你有一个装满了小盒子的大盒子，而这些小盒子里又装着更小的盒子。你的任务是把所有的小盒子里的物品全部倒出来，放到一个平面上，这样你可以一眼看到所有物品。这就是我们要做的“扁平化”操作。

```javascript
function Flat(arr = []) {
    return arr.reduce((total, currentValue) => total.concat(Array.isArray(currentValue) ? Flat(currentValue) : currentValue), []);
}

const nestedFiles = [0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]];
console.log(Flat(nestedFiles)); // 输出：[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```

- reduce：就像把大盒子一层层打开。 
- Array.isArray(currentValue)：检查当前拿到的是否还是一个小盒子（数组）。 
- Flat(currentValue)：如果是小盒子，再递归地把它打开，直到拿出所有物品（非数组元素）。 
- concat：把这些物品一个个放到我们铺开的平面上（结果数组）。

### 2. 分割数组——分页显示商品列表

想象你在打包一批商品，每个包裹只能装固定数量的商品。当一个包裹装满时，你就开始打包下一个包裹。最终，你会得到一系列整齐的包裹，每个包裹里都有固定数量的商品。这就是我们要做的“分页显示”。

```javascript
function Chunk(arr, size) {
    return arr.length ? arr.reduce((total, currentValue) => (total[total.length - 1].length === size ? total.push([currentValue]) : total[total.length - 1].push(currentValue), total), [[]]) : [];
}

const products = [1, 2, 3, 4, 5];
console.log(Chunk(products, 2)); // 输出：[[1, 2], [3, 4], [5]]
```

- reduce：就像在打包商品。 
- total[total.length - 1]：这是当前正在打包的包裹。 
- total[total.length - 1].length === size：检查当前包裹是否装满。 
- push：如果满了，开始一个新的包裹；如果没满，把商品继续装入当前包裹。

### 3. 统计出现次数

想象你在统计每个用户点击了多少次按钮，就像在记录每个用户按下不同按钮的次数。每次用户点击按钮，你就在一个记录本上对应的按钮旁边记下一笔，最后你就可以知道每个按钮被点击了多少次。

```javascript
function Counting(arr) {
  return arr.reduce((total, currentValue) => {
    total[currentValue] = (total[currentValue] || 0) + 1;
    return total;
  }, {});
}

const userActions = ['click', 'scroll', 'click', 'hover', 'click'];
console.log(Counting(userActions)); 
// 输出：{ 'click': 3, 'scroll': 1, 'hover': 1 }
```

- reduce：就像在帮你统计每个事件的发生次数。 
- total[currentValue]：这是记录本上对应事件的计数。 
- total[currentValue] || 0：如果这个事件还没被记录过，就初始化为0。 
- +1：每次事件发生，就在对应的计数上加1。

### 4. 查找元素位置

想象你在一堆订单中寻找那些出了问题的订单（比如状态为“异常”），就像在一份名单中标记出所有异常订单的位置，以便后续处理。

```javascript
function Position(arr, val) {
  return arr.reduce((total, currentValue, currentIndex) => {
    if (currentValue.status === val) {
      total.push(currentIndex);
    }
    return total;
  }, []);
}

const orders = [
  { id: 1, status: 'completed' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'exception' },
  { id: 4, status: 'exception' }
];
console.log(Position(orders, 'exception')); // 输出：[2, 3]
```

- reduce：就像在浏览订单列表，每找到一个符合条件的订单，就记下它的位置。 
- currentValue.status === val：检查当前订单是否是“异常”状态。 
- push(currentIndex)：如果是异常订单，就把它的位置（索引）记录下来。

### 5. 组合函数——订单折扣计算

想象你在为用户计算订单总价，这个过程就像在制作一道美味的菜肴，需要按顺序添加各种配料（折扣、会员优惠、税费）。每一步都对最终的味道（价格）有影响，最后得到的是用户需要支付的总价。

```javascript
const addDiscount = (x) => x - 5;
const applyMemberDiscount = (x) => x * 0.9;
const addTax = (x) => x + (x * 0.08);

const composedFunctions = [addDiscount, applyMemberDiscount, addTax];
const finalPrice = composedFunctions.reduce((total, currentValue) => currentValue(total), 100);

console.log(finalPrice); 
```

- composedFunctions：这里的数组就像一系列步骤，每一步都对订单总价进行处理。 
- reduce：依次执行每个步骤，把当前的价格传给下一个处理函数。 
- 100：初始的订单价格。 
- finalPrice：经过所有处理后的最终订单价格。

### 6. 数组去重——数据清洗中的重复项去除

想象你在整理一堆文件（数据），不小心有些文件重复了。为了确保每个文件只保留一份，你需要把重复的文件清理掉。reduce方法就像一个过滤器，帮你把这些重复项去掉，只留下唯一的文件。

```javascript
function Uniq(arr) {
    return arr.reduce((total, currentValue) => total.includes(currentValue) ? total : [...total, currentValue], []);
}

const rawData = [2, 1, 0, 3, 2, 1, 2];

console.log(Uniq(rawData)); // 输出：[2, 1, 0, 3]
```

- reduce：就像一个过滤器，遍历数组中的每个元素。 
- total.includes(currentValue)：检查当前元素是否已经存在于结果数组中。 
- total：如果当前元素已经存在，就跳过；否则，把它加到结果数组中。

### 7. 计算平均值——用户评分系统

想象你在收集用户对某个产品的评分，现在你需要计算出这个产品的平均评分，就像把所有评分加起来，然后平分给每个用户，得到一个平均分。reduce方法可以帮你快速完成这个计算。

```javascript
function Average(arr) {
  return arr.reduce((total, currentValue, currentIndex, array) => {
    total += currentValue;
    if (currentIndex === array.length - 1) {
      return total / array.length;
    }
    return total;
  }, 0);
}

const ratings = [4, 5, 3, 4, 5];

console.log(Average(ratings)); // 输出：4.2
```

- reduce：就像一个评分收集器，遍历每个用户的评分。 
- total += currentValue：把每个评分累加到总分里。 
- if (currentIndex === array.length - 1)：在最后一个评分加完后，计算平均值。 
- total / array.length：总分除以评分人数，得到平均分。 • reduce：就像一个评分收集器，遍历每个用户的评分。 
- total += currentValue：把每个评分累加到总分里。 
- if (currentIndex === array.length - 1)：在最后一个评分加完后，计算平均值。 
- total / array.length：总分除以评分人数，得到平均分。

### 8. 找最大值和最小值——商品价格筛选

想象你在逛一个电商平台，正在寻找一件最便宜或者最贵的商品。你可能会逐个查看商品的价格，然后记住当前看到的最低价或最高价。reduce方法就像你的记忆助手，帮你快速找出列表中最高或最低的价格。

```javascript
function Max(arr = []) {
    return arr.reduce((total, currentValue) => total > currentValue ? total : currentValue);
}

function Min(arr = []) {
    return arr.reduce((total, currentValue) => total < currentValue ? total : currentValue);
}

const prices = [120, 450, 210, 650, 380];

console.log(Max(prices)); // 输出：650
console.log(Min(prices)); // 输出：120
```

- Max函数：通过遍历数组，记住当前看到的最大价格。 
- Min函数：同样遍历数组，记住当前看到的最小价格。 
- reduce：在遍历过程中比较每个商品的价格，并更新最大值或最小值。

### 9. URL 参数解析——处理用户请求中的查询参数

想象你在开发一个搜索功能，当用户在搜索框中输入条件并提交时，URL会包含这些查询参数。你需要把这些参数拆解开，放到一个对象里，这样你就可以用它们来执行搜索查询。reduce方法可以帮你轻松完成这一步。

```javascript
function ParseUrlSearch(str) {
    return str.replace(/(^\?)|(&$)/g, "").split("&").reduce((total, currentValue) => {
        const [key, val] = currentValue.split("=");
        total[key] = decodeURIComponent(val);
        return total;
    }, {});
}

const url = 'key1=value1&key2=value2&key3=value3';

console.log(ParseUrlSearch(url)); 
// 输出：{ key1: 'value1', key2: 'value2', key3: 'value3' }
```

- replace(/(^?)|(&$)/g, "")：去掉URL中的问号或其他特殊符号，留下纯参数部分。 
- split("&")：将参数字符串按“&”分隔成一个数组，每个元素是一个“key=value”的形式。 
- reduce：遍历这个数组，把每个“key=value”解析成键值对，存入一个对象中。 
- decodeURIComponent(val)：对参数值进行解码，以防止URL编码问题。

### 10. URL 参数序列化——生成API请求参数

想象你在准备向后端发送一个API请求，你手里有一张列着参数的清单（对象），但后端要求你把这些参数按一定格式（查询字符串）打包发送。reduce方法就像一个打包工具，把这些参数按照规定的格式整理好，方便你发送请求。

```javascript
function StringifyUrlSearch(search) {
    return Object.entries(search).reduce(
        (total, currentValue) => `${total}${currentValue[0]}=${encodeURIComponent(currentValue[1])}&`,
        Object.keys(search).length ? "?" : ""
    ).replace(/&$/, "");
}

const params = { foo: "bar", baz: 42 };

console.log(StringifyUrlSearch(params)); // 输出："?foo=bar&baz=42"
```

- Object.entries(search)：将对象转换为一个二维数组，每个元素是一个[key, value]对，方便遍历。 
- reduce：遍历每个参数对，将它们拼接成“key=value”的形式，并用“&”连接。 
- encodeURIComponent(currentValue[1])：对参数值进行编码，确保特殊字符在URL中合法。 
- replace(/&$/, "")：去掉最后一个多余的“&”符号，使查询字符串格式正确。

### 11. 对象分组——按属性分组用户数据

想象你在管理一个大型的用户数据库，你需要根据用户的某个属性（比如年龄）将他们分组，这样可以更方便地进行统计和分析。reduce方法就像一个分类器，帮你把用户按照指定的属性归类到不同的组里。

```javascript
function Grouping(arr, key) {
  return arr.reduce((total, currentValue) => {
    if (!total[currentValue[key]]) {
      total[currentValue[key]] = [];
    }
    total[currentValue[key]].push(currentValue);
    return total;
  }, {});
}

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 },
  { name: 'Dave', age: 30 }
];
console.log(Grouping(users, 'age'));
/*
输出：
{
  '25': [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
  '30': [{ name: 'Bob', age: 30 }, { name: 'Dave', age: 30 }]
}
*/
```

- reduce：就像在整理用户数据，根据指定的属性（比如年龄）将用户归类。 
- total[currentValue[key]]：检查当前分类组是否已经存在，如果不存在，就创建一个新的数组来存放这一组用户。 
- push(currentValue)：将用户添加到对应的分组中。

### 12. 创建查找表——快速查找产品信息

想象你在管理一个电商平台，需要快速找到某个产品的详细信息。如果有一个查找表（类似目录），你只需根据产品ID就能快速找到对应的产品信息。reduce方法可以帮你把产品数组转换为这样的查找表。

```javascript
function arrayToMap(arr, key) {
  return arr.reduce((total, currentValue) => {
    total[currentValue[key]] = currentValue;
    return total;
  }, {});
}

const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 },
  { id: 3, name: 'Tablet', price: 499 },
];
const productMap = arrayToMap(products, 'id');

console.log(productMap);
/*
输出：
{
  '1': { id: 1, name: 'Laptop', price: 999 },
  '2': { id: 2, name: 'Phone', price: 699 },
  '3': { id: 3, name: 'Tablet', price: 499 }
}
*/
```

- reduce：遍历产品数组，逐一处理每个产品。 
- total[currentValue[key]] = currentValue：将产品的ID作为查找表的键，产品的详细信息作为对应的值，存入查找表。 
- total：最终形成一个以产品ID为键，产品信息为值的对象，方便快速查找。

### 13. 合并数组为对象——将表单字段与值配对

想象你在处理一份表单，表单上有多个字段（比如姓名、年龄、性别），用户填写了相应的值。现在你需要把这些字段名和用户输入的值配对，形成一个对象，以便提交给后端处理。reduce方法可以帮你将这两个数组合并成一个对象。

```javascript
function Merge(arr1, arr2) {
  return arr1.reduce((total, currentValue, index) => {
    total[currentValue] = arr2[index];
    return total;
  }, {});
}

const fields = ['name', 'age', 'gender'];
const values = ['Alice', 25, 'female'];

console.log(Merge(fields, values)); // 输出：{ name: 'Alice', age: 25, gender: 'female' }
``` 

- reduce：遍历字段数组arr1，逐一处理每个字段。 
- total[currentValue] = arr2[index]：将字段名作为对象的键，将对应的用户输入值作为值，添加到对象中。 
- index：通过索引匹配字段名和对应的输入值。

### 14. 检查字符串是否为回文——验证用户输入

想象你在开发一个系统，需要验证用户输入的字符串是否是回文。回文指的是正着读和倒着读都一样的字符串，比如“racecar”。reduce方法可以帮你快速检查这个字符串是否符合回文的要求。

```javascript
function isPalindrome(str) {
  return str.split('').reduce((total, currentValue, index, array) => {
    return total && currentValue === array[array.length - index - 1];
  }, true);
}

const input = 'racecar';

console.log(isPalindrome(input)); // 输出：true
```

- split('')：将字符串分割成单个字符的数组。 
- reduce：遍历字符数组，逐个比较字符是否对称。 
- total && currentValue === array[array.length - index - 1]：检查当前字符是否与对应位置的字符相同，如果全部匹配，则为回文。

## 总结

看完今天的内容，你是否对JavaScript的reduce方法有了新的认识？无论你是刚入门的小白，还是经验丰富的开发者，相信你都能从这些实际场景中找到一些灵感，让自己的代码更简洁、更高效。

在实际项目中，reduce究竟能帮你解决哪些棘手的问题？或者你还有哪些有趣的用法想要分享？欢迎在评论区留言讨论！如果你已经在项目中使用了这些技巧，不妨也来和大家分享你的经验。
