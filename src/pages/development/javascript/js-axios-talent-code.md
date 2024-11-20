---
title: Axios代码鉴赏
date: 2024-10-07
category: JavaScript/TypeScript
---

# Axios代码鉴赏

## axios的两种调用方式

经常调接口的同学一定非常熟悉aixos下面的两种使用方式：

- **axios(config)**

  ```javascript
  // 配置式请求
  axios({
    method: 'post',
    url: '/user/12345',
  });
  ```

- **axios.post(url, config)**

  ```javascript
  // 简洁的写法
  axios.post('/user/12345')
  ```

不知道各位大佬有没有思考过这样的问题：

> axios到底是个什么东西？我们为什么可以使用这两种方式请求接口呢？axios是怎么设计的？

## axios原理简析 - 手写一个简单的axios

为了搞明白上面的问题，我们先按照传统思路仿照axios源码实现一个简单的axios。

### 创建一个构造函数

```javascript
function Axios(config){
   this.defaults = config;       // 配置对象
   this.interceptors = {         // 拦截器对象
      request:{},
      response:{}
  }
}
```

上面的代码中，我们实现了一个基本的Axios类，但它还不具备任何功能。我们现在给它添加功能。

### 原型上添加方法

```javascript
Axios.prototype.request = function(config){
  console.log('发送Ajax 请求 type:' +config.method)
}
Axios.prototype.get = function(){
  return this.request({method:'GET'})
}
Axios.prototype.post = function(){
  return this.request({method: 'POST'})
}
```

上面的代码中，我们在request属性上创建了一个通用的接口请求方法，get和post实际都调用了request，但内部传递了不同的参数，这和**axios(config)**、**axios.post()**有异曲同工之妙。

参考**aixos**的用法， 现在，我们需要创建实例对象

```javascript
let aixos = new Axios(config)
```

创建后的`axios`包含`defaults`和`interceptors`属性，其对象原型`__proto__`上（指向`Axios`的`prototype`）包含`request`、`get`及`post`方法，因此，我们现在可以使用`aixos.post()`的方法模拟调用接口了。

但注意，此时aixos只是一个实例对象，不是一个函数！我们似乎也没办法做到改造代码使用`aixos(config)`的形式调用接口！

## aixos中的天才想法

为了即能使用`axios(config)`又能使用`axios.get()`，axios的核心伪逻辑如下

```javascript

function Axios(config){
  this.defaults = config;       // 配置对象
  this.interceptors = {         // 拦截器对象
    request:{},
    response:{}
  }
}

Axios.prototype.request = function(config){
  console.log('发送Ajax 请求 type:' +config.method)
}
Axios.prototype.get = function(){
  return this.request({method:'GET'})
}
Axios.prototype.post = function(){
  return this.request({method: 'POST'})
}

function createInstance(config) {
  //注意instance是函数
  const instance = Axios.prototype.request; 
  instance.get = Axios.prototype.get
  instance.post = Axios.prototype.post
  return instance;
 }

let axios = createInstance();
```

通过上述的伪代码，我们可以知道**axios是createInstance()函数的返回值instance**。

- instance 是一个函数，因此，axios也是一个函数，可以使用axios(config)；
- instance也是一个对象（js万物皆对象），其原型上有get方法和post方法，因此，我们可以使用axios.post()。

## aixos的源码实现

```javascript
function createInstance(config) {
   //实例化一个对象
   var context = new Axios(config); //但是不能直接当函数使用
   
   var instance = Axios.prototype.request.bind(context);
   //instance 是一个函数，并且可以 instance({})，

   //将Axios.prototype 对象中的方法添加到instance函数中,让instance拥有get、post、request等方法属性
   Object.keys(Axios.prototype).forEach(key => {
     // console.log(key); //修改this指向context
     instance[key] = Axios.prototype[key].bind(context);
   })
   //总结一下，到此instance自身即相当于Axios原型的request方法，
   //然后又给instance的属性添加了上了Axios原型的request、get、post方法属性
   //然后调用instance自身或instance的方法属性时，修改了this指向context这个Axios实例对象

   //为instance函数对象添加属性 default 与 intercetors
   Object.keys(context).forEach(key => {
     instance[key] = context[key];
   })

   return instance;
 }
```

可以说，上面的代码真的写的**精妙绝伦**啊！

注意这里，为什么要修改`this`的指向

```javascript
var instance = Axios.prototype.request.bind(context);
```

首先，requset 是Axios原型对象上的方法，其方法内部的this指向的是其实例化对象context！

```javascript

Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

因此，如果我们直接使用Axios.prototype.request()就会出现问题，因为这事reques方法内部的this会指向错误，导致函数不能运行，因此，我们必须将this重新指向其实例化对象。
