---
title: 微信小程序内嵌web-view缓存问题
date: 2024-09-19
tag: 小程序开发
abstract: 本文讨论了如何彻底解决微信小程序内嵌web-view的缓存问题，让我们一探究竟，到底是什么原因让缓存如何顽固。
---

# 解决微信小程序内嵌web-view缓存问题

## 前言

项目是通过web-view内嵌在小程序里的vue单页应用.然而前几天发现明明发布了代码，在小程序入口进去看到的还是旧页面，尝试了各种操作：

- 手动退出小程序，再次进入；
- 删除 发现-小程序，重新进入；
- 关闭微信，杀掉进程，重新进入；
- 修改 Nginx 关于 Cache-Control 的配置；
- 用 debugx5.qq.com 手动清除安卓微信浏览器缓存；
- iOS 利用微信自带清除缓存功能。

不管怎么操作，依然显示的是旧页面！！！

## 分析原因

这个缓存是存在哪里的呢？
一般情况下，浏览器缓存是个非常有用的特性，它能够提升性能、减少延迟，还可以减少带宽、降低网络负荷。
浏览器的缓存机制可以总结成下面两句：

> 1. 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识
> 2. 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中。

而web-view组件就是嵌在小程序里的网页，它本质上是运行在微信内置浏览器里的，它在缓存上并没有完全遵照上述的规则，也即它的缓存并不能及时得到清理；

在小程序里面， web-view组件是通过一个url地址来访问h5页面的，如果内嵌 H5 的地址不发生变化，那么 web-view 访问资源会从缓存里取，而缓存里并没有最新的数据，这就导致了服务端的最新资源根本无法到达浏览器，这也就解释了为什么修改 Nginx 的 Cache-Control 配置也无法生效的原因。所以，要想彻底解决及时刷新，必须让 web-view 去访问新的地址。

> 造成web-view无法刷新的原因：
> 1. 浏览器缓存；
> 2. url地址被缓存

## 解决方案

原因找到了，那么如何解决呢？

### 针对url地址没刷新的问题，可以在webview组件的src里面添加一个时间戳.

```javascript
const src = `https://XXX.com?timestamp=${new Date().getTime()}`

<web-view src='{{src}}'></web-view>
```

url后面加时间戳这个，苹果机是可以实时解决缓存的，然而安卓机不行

### 在index.html的head头部添加不缓存的配置

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

### 在webpack打包的时候加上 hash配置

```javascript
filenameHashing: true,
pages: {
  index: {
    // page 的入口
    entry: 'src/main.js',
    // 模板来源
    template: 'public/index.html',
    // 在 dist/index.html 的输出
    filename: 'index.html',
    // 当使用 title 选项时，
    // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'Index Page',
    hash: true,
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'index']
  }
}
```

### 使用工具 debugtbs

如果是安卓机， 可以在微信上打开http://debugtbs.qq.com， 然后将所有清除的按钮点击一遍，下次再进去就可以了。

## 总结

至此， 如果还是不能清除，其实也不用太担心，web-view再过一段时间（时间不定，一天或者几小时，无明显规律）是可以进行缓存刷新的，只是不能做到实时刷新， 有一说法是官方后台需要审核页面，具体不得而知了，感兴趣的小伙伴可以查查看，然后回来告诉我，静待佳音。
