---
title: 深入了解Vite
date: 2024-08-13
abstract: 随着 Vite 的盛行，使用 Vite 的开发者越来越多，那么 Vite 和 Webpack 到底有什么不同？它为什么会快这么多呢？这篇文章我们就来深层解读一下。
---

# 深入了解Vite

## 前言

随着`Vue3`的逐渐普及以及`Vite`的逐渐成熟，我们有必要来了解一下关于`vite`的本地构建原理。

对于`webpack`打包的核心流程是通过分析JS文件中引用关系，通过递归得到整个项目的依赖关系，并且对于非JS类型的资源，通过调用对应的`loader`将其打包编译生成JS 代码，最后再启动开发服务器。

了解到`webpack`的耗时主要花费在打包上，`Vite`选择跳过打包，直接以以 `原生 ESM` 方式提供源码，这样岂不是可以非常快！

## 与 Webpack 对比

在Vite官网有两张对比图能够非常直观的对比两者的区别。

![vite01](/images/vite-01.png)

这张图代表的是基于打包器的构建方式（webpack就是其中之一），它在启动服务之前，需要从入口开始扫描整个项目的依赖关系，然后基于依赖关系构建整个应用生成bundle，最后才会启动开发服务器。这就是这类构建方式为什么慢的原因，并且整个构建时间会随着项目的变大变的越来越长！

![vite02](/images/vite-02.png)

这张图代表的是基于ES Module的构建方式（比如：Vite），这张图是不是能够很直观说明为什么Vite会非常快，因为它上来就直接启动开发服务器，然后在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前页面上实际使用时才会被处理。

也就是它不需要扫描整个项目并且打包，不打包的话那它是如何让浏览器拿到分散在项目中的各个模块呢？

这一切都要得益于浏览器支持ESM的模块化方案，当浏览器识别到模块内的 ESM 方式导入的模块时，会自动去帮我们查找对应的内容

这就是为什么vite项目的模版文件中的script标签需要加上`type=module`，而webpack项目不需要。

```javascript
<script type="module" src="/src/main.ts"></script>
```

## Vite 快的原因

其实上面已经能够说明vite为什么会比webpack快了，但还有另外一个点在上图中并没有表现出来。

总结来说就是：**基于ESM模块化方案** + **预构建**

vite整体思路：启动一个 `connect` 服务器拦截由浏览器请求 ESM的请求。通过请求的路径找到目录下对应的文件做一下编译最终以 ESM的格式返回给浏览器。

对于`node_modules`下面的依赖，vite会使用`esbuild`进行预构建，主要是为了兼容`CommonJS`与`UMD`，以及提高性能。

这样完整走一遍，是不是对Vite的理解又更深一步了，它实际上就是“走一步看一步”，不像webpack上来就扫描整个项目进行打包编译，所以vite的构建速度会比较快！

## 预构建

大家可能知道，Vite在开发阶段，提倡的是一个`no-bundle`的理念，不必与webpack那样需要先将整个项目进行打包构建。但是`no-bundle`的理念只适合源代码部分（我们自己写的代码），vite会将项目中的所有模块分为依赖与源码两部分。

**依赖：**指的是一些不会变动的一些模块，如：node_modules中的第三方依赖，这部分代码vite会在启动本地服务之前使用`esbuild`进行预构建。`esbuild` 使用 `Go` 编写，比使用 `JavaScript` 编写的打包器预构建依赖快 `10-100` 倍。

**源码：**指的是我们自己开发时写的那部分代码，这部分代码可能会经常变动，并且一般不会同时加载所有源代码。

所以总结来说：**no-bundle是针对源码的，而预构建是针对第三方依赖的**

## 使用预构建的原因

主要有以下两点：

- **commonJS 与 UMD兼容**：
  
  因为`Vite`在开发阶段主要是依赖浏览器原生ES模块化规范，所以无论是我们的源代码还是第三方依赖都得符合ESM的规范，但是目前并不是所有第三方依赖都有ESM的版本，所以需要对第三方依赖进行预编译，将它们转换成EMS规范的产物。

  比如`React`，它就没有`ESM`的版本，所以在使用`Vite`时需要预构建

- **性能**：为了提高后续页面的加载性能，Vite将那些具有许多内部模块的 ESM 依赖项转换为单个模块。

  比如常用的`loads-es`，我们引入`lodash-es`工具包中的`debounce`方法，此时它理想状态应该是只发出一个请求，事实上也是这样，但这是预构建的功劳，如果我们对lodash-es关闭预构建呢？

  ```javascript
  import  { debounce }  from 'lodash-es'
  ```

  在vite的配置文件中，去掉`lodash-es`的预构建，可以看到，此时发起了600多个请求，这是因为`lodash-es` 有超过 `600` 个内置模块！

  ```json
  // vite.config.js
  optimizeDeps: {
    exclude: ['lodash-es']
  }
  ```

  所以我们得出结论：`vite`通过将 `lodash-es` 预构建成单个模块，只需要发起**一个**HTTP请求，可以很大程度地提高加载性能。

  > 由于Vite的预构建是基于性能优异的**Esbuild**来完成的，所以并不会造成明显的打包性能问题

## 开启预构建

### 默认配置

一般来说，`Vite`帮我们默认开启了预构建，预构建产物会存放在：`node_modules/.vite/deps`

里面会有一个`_metadata.json`的文件，这里保存着已经预构建过的依赖信息。

对于预构建产物的请求，Vite会设置为**强缓存**，有效时间为1年，对于有效期内的请求，会直接使用缓存内容。

如果只有HTTP强缓存肯定也不行，如果用户更新了依赖版本，在缓存过期之前，浏览器拿到的一直是旧版本的内容。

所以Vite对本地文件也设置了缓存判断，如果下面几个地方任意一个地方有变动，Vite将会对依赖进行重新预构建：

- 项目依赖`dependencies`变更

- 各种包管理器的`lock`文件变更

- `optimizeDeps`配置内容变更

### 自定义配置

- entries
  
  默认情况下，Vite会抓取项目中的`index.html`来检测需要预构建的依赖

  ```json
  optimizeDeps: {
    entries: ['index.html']
  }
  ```

  如果指定了 `build.rollupOptions.input`，Vite 将转而去抓取这些入口点。

- exclude

  排除需要预构建的依赖项

  ```json
  optimizeDeps: {
    exclude: ['lodash-es']
  }
  ```

- include

  默认情况下，不在 `node_modules` 中的依赖不会被预构建。使用此选项可强制选择预构建的依赖项。

  ```json
  optimizeDeps: {
    include: ['lodash-es']
  }
  ```

## 预构建流程

1. 在启动服务的过程中会执行一个`initDepsOptimizer`表示初始化依赖优化
   
   ```javascript
    export async function initDepsOptimizer(
      config: ResolvedConfig,
      server: ViteDevServer,
    ): Promise<void> {
      if (!getDepsOptimizer(config, false)) {
        await createDepsOptimizer(config, server)
      }
    }
   ```
2. 在这里会执行`createDepsOptimizer`方法，再接着找到定义`createDepsOptimizer`的地方
   
   ```javascript
    async function createDepsOptimizer(
      config: ResolvedConfig,
      server: ViteDevServer,
    ) {
      const { logger } = config
      const ssr = false
      const sessionTimestamp = Date.now().toString()

      const cachedMetadata = await loadCachedDepOptimizationMetadata(config, ssr)
      ...
    }
   ```

3. 这里首先会去执行`loadCachedDepOptimizationMetadata`用于获取本地缓存中的`metadata`数据
    该函数会在获取到_metadata.json文件内容之后去对比lock文件hash以及配置文件optimizeDeps内容，如果一样说明预构建缓存没有任何改变，无需重新预构建，直接使用上次预构建缓存即可
    
    ```javascript
    export async function loadCachedDepOptimizationMetadata() { ... }
    ```

4. 如果没有缓存时则需要进行依赖扫描。这里主要是会调用`scanImports`方法，从名字也能看出该方法应该是通过扫描项目中的import语句来得到需要预编译的依赖，最终会返回一个`prepareEsbuildScanner`方法
   
   ```javascript
    export function scanImports(config: ResolvedConfig) { ... }
   ```

5. 最后该方法中会使用`esbuild`对扫描出来的依赖项进行预编译。




