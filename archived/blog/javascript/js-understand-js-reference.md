---
title: JavaScript原始类型和引用类型
date: 2024-09-11
category: JavaScript/TypeScript
---

# JavaScript原始类型和引用类型

![js-reference-primitive](https://mmbiz.qpic.cn/sz_mmbiz_png/KEXUm19zKo6cUGW3scgeQutvQfibsHETeRHfzicTsor3pb8CpcAcWibUAmcaPNSMYknK0ibIR0WKO87hNvRnzWcpOQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

JavaScript作为我们开发前端时不可或缺的工具，你真的理解它的核心概念吗？今天我想用通俗易懂的语言，结合一些实际的业务场景，来带你了解JavaScript中的原始类型和引用类型，顺便讲一下它们的可变性和不可变性。相信我，看完这些你一定会对代码有更深的理解！

## 原始类型：就像快递里的物品

在现实生活中，如果你下单了一件商品，商家直接给你寄过来商品本身，这就像JavaScript中的原始类型一样——变量存储的就是**具体的值**。不论是数字、字符串还是布尔值，它们都是独立存在的，互不干扰。

举个业务场景的例子：你在一个购物网站上查看商品库存。

```javascript
let itemStockA = 10;  // 商品A库存
let itemStockB = itemStockA;  // 商品B库存初始和A一样
itemStockB = 20;  // 更新商品B的库存

console.log(itemStockA);  // 10
console.log(itemStockB);  // 20
```

在这个例子中，商品A和商品B各自有自己的库存数据，互不影响。因为它们是**原始类型**的数字，赋值时只是复制了值，彼此之间完全独立。

## 引用类型：就像外卖地址

现在我们来看引用类型。引用类型就好像是你的外卖地址，外卖小哥并不会直接带着你家的门钥匙，而是拿着一份写有地址的纸条，按照这个地址去送货。也就是说，**引用类型存储的不是值，而是指向值所在位置的引用**。

我们来换个实际场景——比如一个公司有多个部门，各个部门共享同一个客户信息表。

```javascript
let customerInfo = { name: "小明", age: 30 };  // 客户信息
let salesDepartment = customerInfo;  // 销售部门查看客户信息
let serviceDepartment = customerInfo;  // 客服部门查看客户信息

salesDepartment.name = "小红";  // 销售部门更新客户姓名
console.log(serviceDepartment.name);  // "小红"
```

在这个例子里，无论是销售部门还是客服部门，都在用同一个客户信息。当销售部门修改了客户的姓名，客服部门看到的客户姓名也会变成“**小红**”。这就是引用类型，多个部门其实都是指向同一个客户信息表。

## 可变性和不可变性：随时变动 vs 永远不变

既然提到了数据，我们还需要聊聊它们的**可变性**。在JavaScript里，引用类型是**可变**的，就像刚才的客户信息那样，可以随时修改。而原始类型则是**不可变**的，一旦你设置了它的值，它本身是不会改变的。如果你想改变它，只能创建一个新的值。

再来看个实际场景：比如在一个在线购物平台上，用户的订单号一旦生成，就不能更改，而订单详情可以随时调整。

```javascript
// 订单号——不可变
let orderNumber = "123456";
let newOrderNumber = orderNumber.replace("123", "789");
console.log(orderNumber);  // "123456"
console.log(newOrderNumber);  // "789456"

// 订单详情——可变
let orderDetails = { item: "手机", price: 3000 };
orderDetails.price = 2500;  // 打折啦
console.log(orderDetails);  // { item: "手机", price: 2500 }
```

在这里，订单号是不可变的，改变订单号只会生成一个新的值；而订单详情则是可变的，你可以随时更新订单中的信息。

## 避免引用带来的麻烦：深拷贝的解决方案

作为开发者，你一定会遇到这种情况：因为多个变量指向同一个对象，修改一个变量会影响到其他变量。这种时候，我们需要用到**深拷贝**，也就是把对象完整复制一份，这样修改时不会影响到原对象。

举个业务例子：某个电商平台上，有一个商品模板，创建新商品时不能直接修改模板，而是要先复制一份再修改。

```javascript
let productTemplate = { name: "通用手机壳", price: 20 };

// 深拷贝模板创建新商品
let newProduct = JSON.parse(JSON.stringify(productTemplate));
newProduct.name = "iPhone手机壳";  // 修改新商品名称
newProduct.price = 30;  // 修改新商品价格

console.log(productTemplate);  // { name: "通用手机壳", price: 20 }
console.log(newProduct);  // { name: "iPhone手机壳", price: 30 }
```

这样，你修改新商品信息时，模板商品的内容不会被影响。

## 总结

掌握JavaScript中的原始类型和引用类型、可变性与不可变性，是写出高效、可靠代码的基础。这些概念在日常业务开发中非常常见。


