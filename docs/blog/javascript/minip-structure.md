---
title: 微信小程序底层框架实现原理
date: 2024-11-12
category: 小程序开发
---

# 微信小程序底层框架实现原理

这篇文章详细介绍了微信小程序的底层框架实现原理，包括发展历程、掌握小程序的原因、双线程架构、渲染页面、数据驱动、快速渲染设计原理、wxml 和 wxss 设计思路、虚拟 dom 渲染流程、事件系统、通讯系统、生命周期、路由设计、性能优化、与普通 h5 相比的优势、总结与展望等内容，并列举了大量示例和技术细节。

## 前言

最近在掘金上学习了一本小册——[《微信小程序底层框架实现原理》](https://juejin.cn/book/6982013809212784676)，加上以前做微信小程序的经验，结合自己的工作经历，深有感触，借此机会和大家分享一下学习工作心得。

**2017 年 1 月微信小程序正式发布 。**

我的上一份工作和现在的工作，都有接触到小程序。前前后后做了很多小程序，插件，也用很多第三方框架做过小程序，比如`wepy`，`mpvue`，`Taro`，`uniapp`等等。第三方框架使用的多了，就会牵扯到性能问题。那么小程序底层架构到底是怎么实现的？为什么原生的小程序性能会比很多第三方框架的性能好呢？

## 双线程架构

![image1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f59dd6330bbc47e9af27a2a7e64b9cbf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

小程序与传统web单线程架构相比，是**双线程架构**。

渲染层和逻辑层由两个线程管理，逻辑层采用`JSCore`运行js代码，渲染层使用 `webview` 进行渲染。小程序有多个页面，所以渲染层存在多个`webview`。

两个线程之间由**Native层**之间统一处理，无论是线程之间的通信，还是数据的传递，网络请求都是由Native层做转发。

> 此处提到的小程序都特指微信小程序

## 渲染一个hello world页面

```javascript
// index.wxml
<view>{{ msg }}</view>
// index.js
Page({
  onLoad: function () {
    this.setData({ msg: 'Hello World' })
  }
})
```

- 渲染层和数据相关。

- 逻辑层负责产生、处理数据。

- 逻辑层通过 `Page` 实例的 `setData` 方法传递数据到渲染层。

## 数据驱动

WXML可以先转成JS对象，然后再渲染出真正的Dom树，回到“Hello World”那个例子，我们可以看到转换的过程：

![image2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20076817a0e64883b2582192ff4e41d3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

通过setData把msg数据从“Hello World”变成“Goodbye”，产生的JS对象对应的节点就会发生变化，此时可以对比前后两个JS对象得到变化的部分，然后把这个差异应用到原来的Dom树上，从而达到更新UI的目的，这就是“**数据驱动**”。

> 这一点和vue其实是一致的

![image3](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0524866115ee4f9b88d3668cf958adcc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

既然小程序是基于双线程模型，那就意味着**任何数据传递都是线程间的通信**，也就是**都会有一定的延时**。

**一切都是异步。**

## 快速渲染设计原理

小程序采用多个webview渲染，更加接近原生App的用户体验。

如果为单页面应用，单独打开一个页面，需要先卸载当前页面结构，并重新渲染。

多页面应用，新页面直接滑动出来并且覆盖在旧页面上即可。这样用户体验非常好。

### 数量限制

页面得载入是通过创建并插入webview 来实现的。

微信小程序做了限制，在微信小程序中打开的页面不能超过10个，达到10个页面后，就不能再打开新的页面。

所以我们在开发中，要避免路由嵌套太深。

### PageFrame

我们在写小程序页面时，并不关心webview，只需要写页面ui和逻辑即可。

我们通过调试微信开发工具，可以看到，有两个webview。

- 一个加载的的是当前页面，加载地址和当前页面路径一致。 
- 一个是instanceframe.html。

![image3](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7260d572fe7044a89e52f8a0667cb47c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

微信小程序在初始化的时候，除了渲染首页之后，会帮我们提前额外的预加载一个webview,微信起名为instanceframe.html，用来新渲染webview的模板。

我们通过微信开发者工具打开调试，打开这个 **instanceframe.html**

```javascript
document.getElementsByTagName('webview')[1].showDevTools(true, null)
```

下图是pageframe/instanceframe.html的模板

![image4](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/813ddf5c370347d3b401e4dc7b31de1b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### pageFrame的html结构中注入的js资源

- **./dev/wxconfig.js**

  小程序默认总配置项，包括用户自定义与系统默认的整合结果。在控制台输入__wxConfig可以看出打印结果

  ![image5](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15f303b37e4b4ea79c50e14335efe18b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- **./dev/devtoolsconfig.js**

  小程序开发者配置，包括navigationBarHeight,标题栏的高度，状态栏高度，等等，控制台输入__devtoolsconfig可以看到其对应的信息

  ![image6](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ffc4cee9d9f4526bb4c79010837ae6e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- **./dev/deviceinfo.js**

  设备信息，包含尺寸/像素点pixelRatio

- **./dev/jsdebug.js**

  debug工具

- **./dev/WAWebview.js**

  渲染层底层基础库

- **./dev/hls.js**

  优秀的视频流处理工具

- **./dev/WARemoteDebug.js**

  底层基础库调试工具

- 注释占位符， 整个页面的json wxss wxml编译之后都存储在这里，当前是一个预设的html模版，所以是空的

### wxappcode.js

我们按同样的调试方法，去找到首页的wxappcode.js结构，简单说明下

```javascript
var decodeJsonPathName = decodeURI("pages/index/index")
__wxAppCode__[decodeJsonPathName + ".json"]={"usingComponents":{}}
var decodeWxmlPathName = decodeURI("pages/index/index")
__wxAppCode__[decodeWxmlPathName + ".wxml"]=$gwx("./" + decodeWxmlPathName + ".wxml")
var decodeWxssPathName = decodeURI("pages/index/index")
__wxAppCode__[decodeWxssPathName + ".wxss"]=((window.eval || __global.__hackEval)('setCssToHead([\x22.\x22,[1],\x22test{ height: calc(\x22,[0,100],\x22-2px); ;wxcs_style_height : calc(100rpx-2px); width: \x22,[0,200],\x22; ;wxcs_style_width : 200rpx; ;wxcs_originclass: .test;;wxcs_fileinfo: ./pages/index/index.wxss 2 1; }\n\x22,],undefined,{path:\x22./pages/index/index.wxss\x22})'));
window.__mainPageFrameReady__ && window.__mainPageFrameReady__()
```

文件包含了所有文件的编译路径
主要几个重要的函数和属性有

- decodeJsonPathName 
- .json配置 
- .wxml编译后的$gwx函数。 
- .wxss编译后的eval函数。

后两个函数我们会在后文展开分析。

**当小程序需要打开某个页面的时候，只需要提取页面的者几个属性，注入到预加载的html模版中就可以快速生成一个新的webview**

### 快速启动

在视图层内，每个页面都是一个webiew，当小程序启动时只有首页一个webview

执行wx.navigateTo新开一个页面的时候，就会创建一个新的webview并插入到视图层

wx.navigateBack则为销毁webview

小程序每个视图层页面内容都是通过pageframe.html模板来生成的。

- 首页启动时，即第一次通过pageframe.html生成内容后，后台服务会缓存pageframe.html模板首次生成的html内容
- 非首次新打开页面时，页面请求的pageframe.html内容直接走后台缓存
- 非首次新打开页面时，pageframe.html页面引入的外链js资源走本地缓存

这样在后续新打开页面时，都会走缓存的pageframe的内容，避免重复生成，快速打开一个新页面。

### 首次打开新页面

- 启动一个webview，src为空地址http://127.0.0.1:${global.proxyPort}/aboutblank?${c}

- `webview` 初始化完毕后，设置地址src 为pageframe.html，开始加载注入的预设样式和预设js 代码

- pageframe.html在dom ready之后，触发注入并执行具体页面的相关代码

下图代码中可以看到dom加载完毕之后，触发alert 通知

![image7](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d9c09c6ea2645f2b1f8aed9cc179701~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

此时通过history.pushState方法修改webview的src但是webview并不会发送页面请求。

因此webview 路径变化为

- http://127.0.0.1:${global.proxyPort}/aboutblank?${c}
- http://127.0.0.1::63444/__pageframe__/instanceframe.html
- http://127.0.0.1:63444/__pageframe__/pages/index/index

正好对应webview 加载过程

![image8](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/672d25a841a140f39200dab9b2c7006f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## wxml 设计思路

网页编程一般采用的是`HTML + CSS + JS`的组合，其中 `HTML` 是用来描述当前这个页面的结构，`CSS` 用来描述页面的样子，`JS` 通常是用来处理这个页面和用户的交互。

同样道理，在小程序中也有同样的角色，其中 `WXML` 充当的就是类似 `HTML` 的角色。

小程序自行搭建了组件组织框架`Exparser`框架

**`Exparser`的组件模型与WebComponents标准中的ShadowDOM高度相似**

如下代码，我们定义在wxml中:

```xml
<view class="container">
  Weixin
  <text style="position:relative;">文本</text>
</view>
<button bindtap="test">按钮</button>
```

`Exparser`框架会将上述结构转换为下面这个样子

```xml
<root>
  <wx-view exparser:info-class-prefix="" exparser:info-component-id="2" class="container">
    Weixin
    <wx-text exparser:info-class-prefix="" exparser:info-component-id="3" style="position:relative;">
      <span style="display:none;">文本</span>
      <span>文本</span>
    </wx-text>
  </wx-view>
  <wx-button exparser:info-class-prefix="" exparser:info-component-id="4" exparser:info-attr-bindtap="test" role="button" aria-disabled="false">
    按钮
  </wx-button>
</root>
```

这样看的话是不是和WebComponents一样了，但是小程序并没有直接使用WebComponents，而是自行搭建了组件框架Exparser。

### WebComponents

Web Components 是一个浏览器原生支持的组件化方案，允许你创建新的自定义、可封装、可重用的HTML 标记。不用加载任何外部模块，直接就可以在浏览器中跑。

如下代码，标签就是自定义组件的标签了，它不属于html语义化标签中的任何一个，是自定义的。

```html
<html>
<head>
</head>
<body>
<user-card></user-card>
<template id='userCardId'>
  <!--组件的样式与代码封装在一起，只对自定义元素生效，不会影响外部的全局样式。-->
  <style>
    .name{
        color:red;
        font-size: 50px;
    }
    button{
        width:200px;
    }  
  </style>
  <p class='name'>21312</p>
  <button>test</button>
</template>
<script>
  class UserCard extends HTMLElement {
    constructor() {
      super()
      var shadow = this.attachShadow({ mode:'closed'});
      var templateElem = document.getElementById('userCardId')
      var content = templateElem.content.cloneNode(true)
      // this.appendChild(content)
      shadow.appendChild(content)
    }
  }

  window.customElements.define('user-card', UserCard)
</script>
</body>
</html>
```

WebComponent主要就是三个规范：

- **Custom Elements规范**

  可以创建一个自定义标签。根据规范，自定义元素的名称必须包含连词线”-“，用与区别原生的 HTML 元素。

  可以指定多个不同的回调函数，它们将会在元素的不同生命时期被调用。

- **templates 规范**

  提供了`<template>`标签，可以在它里面使用HTML定义DOM结构。

- **Shadow DOM规范**

  下图中，看一下右侧的HTML结构，我们可以展开标记看到里面的结构。是不是有种白封装了的感觉。如果只有这样的效果的话，跟模板引擎渲染组件的效果是一样的。所以我们不希望用户能够看到的内部代码，WebComponent 允许内部代码隐藏起来，这叫做 Shadow DOM，即这部分 DOM 默认与外部 DOM 隔离，内部任何代码都无法影响外部。

  ![image9](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3ff85854c054b779b61101e68ec358f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### ShadowDOM

首先实例化一个根节点，挂载到宿主上，这里的宿主是this。上面说过，this指向user-card。

然后我们把创建的DOM结构，或者`<template>`结构挂载到影子根上即可。看一下HTML结构展示。

```javascript
var shadow = this.attachShadow({ mode:'closed'});
shadow.appendChild(content)
```

![image10](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f164cb0120454daea6a4317d3604c0bc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

内置的控件元素不能成为宿主，比如：img、button、input、textarea、select、radio、checkbox，video等等，因为他们已经是 #shadow-root

如果愿意的话，我们可以调试他们的shadow，看看这些标签的真实结构。

![image11](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64e59d5cd1fd4f228af10338e12578c4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### Exparser框架原理

Exparser是微信小程序的组件组织框架，内置在小程序基础库中，为小程序提供各种各样的组件支撑。

内置组件和自定义组件都有Exparser组织管理。

Exparser的组件模型与WebComponents标准中的Shadow DOM高度相似。

Exparser会维护整个页面的节点树相关信息，包括节点的属性、事件绑定等，相当于一个简化版的Shadow DOM实现。Exparser的主要特点包括以下几点：

- **基于Shadow DOM模型**：模型上与WebComponents的ShadowDOM高度相似，但不依赖浏览器的原生支持，也没有其他依赖库；实现时，还针对性地增加了其他API以支持小程序组件编程。
- **可在纯JS环境中运行**：这意味着逻辑层也具有一定的组件树组织能力。
- **高效轻量**：性能表现好，在组件实例极多的环境下表现尤其优异，同时代码尺寸也较小。

小程序中，所有节点树相关的操作都依赖于Exparser，包括WXML到页面最终节点树的构建和自定义组件特性等。

### 原生组件

小程序中的部分组件是由客户端创建的原生组件，并不完全在Exparser的渲染体系下，这些组件有：

- **camera** 
- **canvas** 
- **input**（仅在 focus 时表现为原生组件） 
- **live-player** 
- **live-pusher** 
- **map** 
- **textarea** 
- **video**

引入原生组件主要有3个好处：

- **扩展Web的能力**。比如像输入框组件（input, textarea）有更好地控制键盘的能力。

- **体验更好，同时也减轻WebView的渲染工作**。比如像地图组件（map）这类较复杂的组件，其渲染工作不占用WebView线程，而交给更高效的客户端原生处理。

- **绕过setData、数据通信和重渲染流程，使渲染性能更好**。比如像画布组件（canvas）可直接用一套丰富的绘图接口进行绘制。

### 特殊场景

如果业务场景为手势识别之类的，监听事件不断的触发，数据不断的改变。

这样的业务场景中，我们可以想像，如果坐标值不断改变的话，在逻辑与视图分开的双线程架构中，线程与线程之间的通讯是非常频繁的，会有很大的性能问题。

所以我们可以看到微信开放了一个标记，可以在渲染层写部分js逻辑。这样话就可以在渲染层单独处理频繁改变的数据，就避免了线程与线程之间频繁通讯导致的性能和延时问题。

### 优势

WXML模版语法经过转换之后，会已自定义元素的形式来渲染。这里会有个疑问，为什么不用HTML语法和WebComponents来实现渲染，而是选择自定义？

- 管控与安全：web技术可以通过脚本获取修改页面敏感内容或者随意跳转其它页面

- 能力有限：会限制小程序的表现形式

- 标签众多：增加理解成本

## wxss 设计思路

WXSS 具有 CSS的大部分特性。同时为了更适合开发微信小程序，WXSS 对 CSS 进行了扩充以及修改。通俗的可以理解成基于CSS改了点东西，又加了点东西。

与 CSS 相比，WXSS 扩展的特性有：

- 尺寸单位 rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。

- 样式导入：使用 `@import`语句可以导入外联样式表， `@import`后跟需要导入的外联样式表的相对路径，用;表示语句结束。

### 编译

```css
/**index.wxss**/
.test{
  height: calc(100rpx);
  width: 200rpx;
}
```

如上我们定义的index.wxss，会被编译成js，注入`webview`

我们把编译后的js分成三部分，展开分析。

#### 第一部分: 用于获取一套基本设备信息，包含设备高度、设备宽度、物理像素与CSS像素比例、设备方向。

```javascript
/*********/
/*第一部分*/
/*设备信息*/
/*********/
var BASE_DEVICE_WIDTH = 750;// 基础设备宽度750
var isIOS=navigator.userAgent.match("iPhone"); // 是否ipheone 机型
var deviceWidth = window.screen.width || 375; // 设备宽度 默认375
var deviceDPR = window.devicePixelRatio || 2; // 获取物理像素与css像素比例 默认2
var checkDeviceWidth = window.__checkDeviceWidth__ || function() {
  var newDeviceWidth = window.screen.width || 375  // 初始化设备宽度
  var newDeviceDPR = window.devicePixelRatio || 2 // 初始化设备 像素比例
  var newDeviceHeight = window.screen.height || 375 // 初始化设备高度
  // 判断屏幕方向 landscape 为横向，如果是横向 高度值给宽度
  if (window.screen.orientation && /^landscape/.test(window.screen.orientation.type || '')) newDeviceWidth = newDeviceHeight
  // 更新设备信息
  if (newDeviceWidth !== deviceWidth || newDeviceDPR !== deviceDPR) {
    deviceWidth = newDeviceWidth
    deviceDPR = newDeviceDPR
  }
}
// 检查设备信息
checkDeviceWidth()
```

#### 第二部分：转化rpx

```javascript
/*********/
/*第二部分*/
/*转化rpx*/
/*********/
var eps = 1e-4;//0.0001
var transformRPX = window.__transformRpx__ || function(number, newDeviceWidth) {
  // 如果0 返回 0  0rpx = 0px
  if ( number === 0 ) return 0;
  // px = rpx值 / 基础设备宽度750 * 设备宽度
  number = number / BASE_DEVICE_WIDTH * ( newDeviceWidth || deviceWidth );
  // 返回小于等于 number + 0.0001的大整数，用户收拢精度
  number = Math.floor(number + eps);
  if (number === 0) {// 如果number == 0,说明输入为1rpx
    if (deviceDPR === 1 || !isIOS) {// 非IOS 或者 像素比为1，返回1
      return 1;
    } else {
      return 0.5; 
    }
  }
  return number;
}
```

#### 第三部分主要是 setCssToHead 顾名思义

```javascript
/*********/
/*第三部分*/
/*setCssToHead*/
/*********/
window.__rpxRecalculatingFuncs__ = window.__rpxRecalculatingFuncs__ || [];
var __COMMON_STYLESHEETS__ = __COMMON_STYLESHEETS__ || {} % s
var setCssToHead = function(file, _xcInvalid, info) {
  var Ca = {};
  var css_id;
  var info = info || {};
  var _C = __COMMON_STYLESHEETS__
  function makeup(file, opt) {
    var _n = typeof(file) === "string";
    if (_n && Ca.hasOwnProperty(file)) return "";
    if (_n) Ca[file] = 1;
    var ex = _n ? _C[file] : file;
    var res = "";
    for (var i = ex.length - 1; i >= 0; i--) {
      var content = ex[i];
      if (typeof(content) === "object") {
        var op = content[0];
        if (op == 0) res = transformRPX(content[1], opt.deviceWidth) + "px" + res;
        else if (op == 1) res = opt.suffix + res;
        else if (op == 2) res = makeup(content[1], opt) + res;
      } else res = content + res
    }
    return res;
  }
  var styleSheetManager = window.__styleSheetManager2__
  var rewritor = function(suffix, opt, style) {
    opt = opt || {};
    suffix = suffix || "";
    opt.suffix = suffix;
    if (opt.allowIllegalSelector != undefined && _xcInvalid != undefined) {
      if (opt.allowIllegalSelector) console.warn("For developer:" + _xcInvalid);
      else {
        console.error(_xcInvalid);
      }
    }
    Ca = {};
    css = makeup(file, opt);
    if (styleSheetManager) {
      var key = (info.path || Math.random()) + ':' + suffix
      if (!style) {
        styleSheetManager.addItem(key, info.path);
        window.__rpxRecalculatingFuncs__.push(function(size) {
          opt.deviceWidth = size.width;
          rewritor(suffix, opt, true);
        });
      }
      styleSheetManager.setCss(key, css);
      return;
    }
    if (!style) {
      var head = document.head || document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      style.type = 'text/css';
      style.setAttribute("wxss:path", info.path);
      head.appendChild(style);
      window.__rpxRecalculatingFuncs__.push(function(size) {
        opt.deviceWidth = size.width;
        rewritor(suffix, opt, style);
      });
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      if (style.childNodes.length == 0) style.appendChild(document.createTextNode(css));
      else style.childNodes[0].nodeValue = css;
    }
  }
  return rewritor;
}

setCssToHead([".", [1], "test{ height: calc(", [0, 100], "-2px); width: ", [0, 200], "; }\n", ])(typeof __wxAppSuffixCode__ == "undefined" ? undefined: __wxAppSuffixCode__);
```

setCssToHead 传的参数 是我们定义的wxcss,变成了结构化数据，方便遍历处理

index.wxss中写rpx单位的属性都变成了区间的样子[0, 100]、[0, 200]。其他单位并没有转换。这样的话就可以方便的识别哪里写了rpx单位

### 注入

在渲染层的一个的`<script>`标签中,有很长的一串字符串，并且用eval方法执行。如果你仔细看的话，还是可以勉强分辨出，这个字符串正是我们前面编译出来的js转换成的。

这样就可以得知，编译后的代码是通过eval方法注入执行的。这样的话完成了WXSS的一整套流程。

同时我们也可以看到，是在修改pageFrame 的路径之后，初始化小程序样式配置文件之后，才开始注入样式文件。

![image12](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57789d4b37ca48aa91e3990fdc86bc78~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## Virtual Dom 渲染流程

微信开发者工具和微信客户端都无法直接运行小程序的源码，因此我们需要对小程序的源码进行编译。

代码编译过程包括本地预处理、本地编译和服务器编译。

为了快速预览，微信开发者工具模拟器运行的代码只经过本地预处理、本地编译，没有服务器编译过程，而微信客户端运行的代码是额外经过服务器编译的。

### 编译

```xml
<!--index.wxml-->
<view class="container">
  Weixin
  <text style="position:relative;" >文本</text>
</view>

<button bindtap="test">按钮</button>
```

如上面这段简单的wxml文件，经过编译之后，被编译成了 1500 多行

全部代码都被包裹在$gwx函数中，编译后的WXML文件，以js的形式插入到了渲染层的。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7680ab3a2fc54c1292dd77dc29dec2c3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

但是在这个`script`标签中插入了`$gwx`函数之后并没有立即执行这个函数。

在渲染层的一个的`<script>`标签中,我们可以看到这段代码

```javascript
var decodeName = decodeURI("./pages/index/index.wxml")
var generateFunc = $gwx(decodeName)
```

我们在控制抬手动执行$gwx()的返回值 generateFunc()函数

返回的树形结构，就是该页面wxml对应的js对象形式表示的dom树

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97f6df7d8fea4d57a9e07270daa69353~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这是一个类似Virtual Dom的对象，交给了 WAWebview.js 来渲染成真实DOM。

## 事件系统设计

核心在于，wxml和js文件在两个线程渲染，解析。事件如何绑定?

我们最开始在wxml文件中定义的事件绑定，其实转化成虚拟dom树结构之后，其实只是一个键值对，表明了某个dom上有绑定某个事件，并没有完成事件绑定。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecf97563d1b24dfab643afeed4913c87~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

WAWebview.js 处理虚拟dom树时，会去循环遍历attr属性，判断attr中的属性名是否为事件属性

```javascript
if (n = e.match(/^(capture-)?(mut-)?(bind|catch):?(.+)$/))
```

如果是，通过addListener方法进行了事件绑定。

可以理解成，通过addListner方法监听tap事件，就相当于 window.addEventListener对mouseup方法的监听。

回调函数中对函数的event信息进行组装，并触发sendData方法。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fd3d02cec5c4f3f968d019fb11ab1ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

sendData方法就是向逻辑线程发送event数据的方法。

下图是我们在逻辑层接收到的数据和准备发送的数据结构。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe4f1fa92c4b4076a32505f57f34d73f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到数据结构是一样的，

**目前在触发sendData方法之前这些逻辑的解析包括event参数的组装都是在渲染层的底层基础库WAWebview.js中完成的，也就是说还在渲染线程中。**

### 事件

微信小程序中主要事件绑定

- **:bind**
- **catch**

`bind/catch`后可以紧跟一个冒号，其含义不变，如 `bind:tap` `catch:tap`。

catch 会阻止事件向上冒泡。

`mut-bind` 来绑定事件。一个 mut-bind 触发后，如果事件冒泡到其他节点上，其他节点上的 mut-bind 绑定函数不会被触发，但 bind 绑定函数和 catch 绑定函数依旧会被触发。

需要在捕获阶段监听事件时，可以采用capture-bind、capture-catch关键字，后者将中断捕获阶段和取消冒泡阶段。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c78d885de4bb41249fdafa7806b4f8ee~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 通讯系统设计

最上面提到，视图层和逻辑层通讯是通过Native层。

具体的手段就是

- ios利用 WKWebView 的提供 messageHandlers 特性 
- android 是往webview的window对象注入一个原生方法

这两种会统一封装成weixinJSBridge，这和正常h5与客户端通讯手段一致

初始化过程中Native层理论上是微信客户端，分别在视图层和业务逻辑层注入了WeixinJSBridge

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17b966e9e23f4ac19942fb735e8042f5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 生命周期设计

### data

逻辑层的data与view是相互绑定的，data是页面第一次渲染使用的初始数据。页面加载的时候，data将会以JSON字符串形式由逻辑层传至渲染层。因此data中的数据必须是可以转成JSON的类型：字符串，数字，布尔值，对象，数组。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78a14a5f4e4e4fbcb819af1dd5911d11~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

图中，渲染层和逻辑层都从start开始出发，自身分别进行初始化操作，都初始化完毕后要怎么做呢？两条线程互相并不知道对方初始化怎么样了。

所以这个时候由渲染层发出信号，发出一个我已经初始化完毕的信号发给逻辑层，并且自身状态进入等待。

逻辑层收到这个信号的时候有两种情况。

- 第一种就是自身还没初始化完，那么收到此信号后只需要初始化完毕后发送初始数据Data到渲染层即可。
- 第二种情况就是逻辑层早已经进入等待状态，那么收到信号后立即发送初始数据Data到渲染层即可。

### 生命周期

- **onLoad(Object query)** 页面加载时触发，一个页面只会调用一次，可以在onLoad的参数中获取打开当前页面路径中的参数。

- **onShow()** 页面显示/切入前台时触发

- **onHide()** 页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。

- **onReady()** 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。

- **onUnload()** 页面卸载时触发。如wx.redirectTo或wx.navigateBack到其他页面时。

我们结合路由跳转和webview设计去理解:

- wx.navigateTo是创建了新的webview,当前webview 进入Hide()
- wx.redirectTo以及wx.navigateBack是通过更新自身webview进行页面转换的，所以当前页面会进行卸载操作，并且重新生成新页面。所以两个页面都会进入完整生命周期序列。

配合整体架构图来看一下生命周期。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3732521a26e34229bd65497dba51f1fd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 路由设计

### 路由栈

小程序中不像单页面应用，采用多个webview类似多页。

触发路由的行为可以是逻辑层触发，也可以从视图层触发。在视图层中用户可以通过点击回退按钮，或者回退上一页的手势等机制触发。在逻辑层中发出的信号有打开新页面navigateTo、重定向redirectTo、页面返回navigateBack等，开发者通过官网提供的API触发。

无论逻辑层还是视图层，这个行为都会被发送到Native层，有Native层统一控制路由。对于webview的添加或删除都会有一个载体来维护，这就是路由栈。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4371188e73f42478a85694d685d47de~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

上图中，逻辑层中发出打开页面行为到Native层，Native层收到行为后通过pageFrame快速创建webview，并且推入路由栈。页面创建完后，底层基础库会立刻执行初始化操作，初始化完毕后会发送一个信号通知Native页面已经创建并初始化完毕，随后Native层发送信号到逻辑层中。

**通知的目的有两个：**

- 需要通知开发者页面已经创建成功。
- 在沙箱中创建新页面的“根组件”，并正式开启新页面的生命周期与渲染的流程。

## 性能优化

程序的性能又可以分为「启动性能」和「运行时性能」两个主题。「启动性能」让用户能够更快的打开并看到小程序的内容，「运行时性能」保障用户能够流畅的使用小程序的功能。

### 小程序启动流程

#### 1.资源准备

##### 1.1小程序相关信息准备

微信客户端需要从微信后台获取小程序的头像、昵称、版本、配置、权限等基本信息，这些信息会在本地缓存，并通过一定的机制进行更新。

##### 1.1环境预加载

为了尽可能的降低运行环境准备对启动耗时的影响，微信客户端会根据用户的使用场景和设备资源的使用情况，依照一定策略在小程序启动前对运行环境进行部分地预加载，以降低启动耗时。 但不一定命中。

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a2b19776cbe4eae94730bd292a13841~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

##### 1.2代码包准备

从微信后台获取代码包地址，从 CDN 下载小程序代码包

小程序代码包会在本地缓存，并通过更新机制进行更新。

同步下载/异步下载 强制更新/静默更新

为例降低代码包下载的耗时，微信做的一些优化

- 代码包压缩 
- 增量更新 
- 优先使用QUIC 和HTTP/2 
- 预先建立连接：在下载发生前，提前和 CDN 建立连接，降低下载过程中 DNS 请求和连接建立的耗时 
- 代码包复用：对每个代码包都会计算 MD5 签名。即使发生了版本更新，如果代码包的 MD5 没有发生变化，则不需要重新进行下载。

#### 2.代码注入

小程序启动时需要从代码包内读取小程序的配置和代码，并注入到 JavaScript 引擎中。

微信客户端会使用 V8 引擎的 Code Caching 技术对代码编译结果进行缓存，降低非首次注入时的编译耗时

> Code Cache
>
> V8 会把编译和解析的结果缓存下来，等到下次遇到相同的文件，直接跳过这个过程，把直接缓存好的数据拿来使用

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c75f8d958f62464d990f28738b20f8d4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 启动时性能优化

#### 控制代码包体积

- 推荐所有小程序使用分包加载 
- 避免非必要使用全局自定义组件和插件
  - 会影响按需注入的效果和小程序代码注入的耗时
- 控制资源文件
  - 建议开发者在代码包内的图片一般应只包含一些体积较小的图标，避免在代码包中包含或在 WXSS 中使用 base64 内联过多、过大的图片等资源文件。
  这类文件应尽可能部署到 CDN，并使用 URL 引入。

#### 代码注入优化

- 推荐所有小程序使用按需注入
- 用时注入
  - 为自定义组件配置 占位组件，组件就会自动被视为用时注入组件
- 启动过程中减少同步 API 的调用
  - 建议优先使用拆分后的 getSystemSetting/getAppAuthorizeSetting/getDeviceInfo/getWindowInfo/getAppBaseInfo 按需获取信息，或使用使用异步版本 getSystemInfoAsync
  getStorageSync/setStorageSync 应只用来进行数据的持久化存储，不应用于运行时的数据传递或全局状态管理。

#### 首屏渲染优化

- 启用「初始渲染缓存」
- 启用初始渲染缓存，可以使视图层不需要等待逻辑层初始化完毕，而直接提前将页面初始 data 的渲染结果展示给用户，这可以使得页面对用户可见的时间大大提前
- 提前首屏数据请求
  - 预拉取能够在小程序冷启动的时候通过微信后台提前向第三方服务器拉取业务数据，当代码包加载完时可以更快地渲染页面，减少用户等待时间，从而提升小程序的打开速度
  周期性更新能够在用户未打开小程序的情况下，也能从服务器提前拉取数据，当用户打开小程序时可以更快地渲染页面，减少用户等待时间，增强在弱网条件下的可用性。
- 缓存请求数据 
- 骨架屏

#### 运行时性能优化

- 合理使用setData
- 控制频率，范围，内容
- 页面渲染优化 
- 页面切换优化
  - 避免在 onHide/onUnload 执行耗时操作
  - 页面切换时，会先调用前一个页面的 onHide 或 onUnload 生命周期，然后再进行新页面的创建和渲染
- 提前发起数据请求
  - 进行页面跳转时（例如 wx.navigateTo），可以提前为下一个页面做一些准备工作。页面之间可以通过 EventChannel 进行通信。类似postMessage
  例如，在页面跳转时，可以同时发起下一个页面的数据请求，而不需要等到页面 onLoad 时再进行，从而可以让用户更早的看到页面内容。
- 控制预加载下个页面的时机
  - 程序页面加载完成后，会预加载下一个页面。默认情况下，小程序框架会在当前页面 onReady 触发 200ms 后触发预加载。
  - 预加载会阻塞当前页面setData，我们可以对单个页面的配置增加， handleWebviewPreload 选项，来控制预加载下个页面的时机。

  ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c01044264a0c4c7e8a763bf75b5544f7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 资源加载优化

控制图片大小

#### 内存优化

- 合理分包，既能减少耗时，也能降低内存占用 
- 事件监听，定时器记得清除

## 小程序为什么快（与普通h5相比）

我们在对小程序的架构设计时的要求只有一个，就是要快，包括要渲染快、加载快等。当用户点开某个小程序时，我们期望体验到的是只有很短暂的加载界面，在一个过渡动画之后可以马上看到小程序的主界面。

- 双线程，渲染层和逻辑层并行不阻塞

- 多个webview，页面切换更流畅

- webview 预加载

- 安装包缓存

- 以及微信做了大量的优化和看不见的操作

## 参考链接

微信官方文档：https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0000286f908988db00866b85f5640a
