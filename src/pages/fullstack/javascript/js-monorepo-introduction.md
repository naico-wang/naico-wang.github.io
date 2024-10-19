---
title: Monorepo体验
date: 2024-07-02
tag: JavaScript
abstract: Everything you need to know about monorepos, and the tools to build them.
---

# 手把手建立一个Monorepo项目

`Monorepo`的概念其实已经提出了很久很久了，我最早看到相关的文章好像还是在5年以前了吧。之前项目也用过Monorepo，但是我感觉很多情况是为了用而用，其实并没有准确的分析一下。

这篇文章将以如何使用Monorepo的视角来分析下，而不是high level的 Architecture Design。

下面我说一下个人的看法，关于`Monprepo`和`Multirepo`

## 一些概念

:::info 概念
`Monorepo`可以理解为：利用单一仓库来管理多个packages的一种策略或手段，与其相对的是我们接触最多的`Multirepo`。
:::

可以用项目的目录结构来区分这两种结构：

```shell
# monorepo目录结构
|-- monorepo-demo              
|   |-- packages                  # packages目录
|   |   |-- ios                   # ios子包
|   |   |   |-- package.json      # ios子包特有的依赖
|   |   |-- harmony               # harmony子包
|   |   |   |-- package.json      # harmony子包特有的依赖
|   |   |-- shared                # shared子包
|   |   |   |-- package.json      # shared子包特有的依赖
|   |-- package.json              # 所有子包都公共的依赖
```

```shell
# ios目录结构
|-- ios
|   |-- src 
|   |   |-- feature1              # feature1目录
|   |   |-- feature2              # featrue2目录
|   |-- package.json              # 整个项目依赖

# harmony目录结构
|-- harmony
|   |-- src 
|   |   |-- feature3              # feature3目录
|   |   |-- feature4              # featrue4目录
|   |-- package.json              # 整个项目依赖
```

可以很清楚的看到他们之间的差异：

- `Monorepo`目录中除了会有公共的`package.json`依赖以外，在每个`sub-package`子包下面，也会有其特有的`package.json`依赖。
- `Multirepo`更倾向与在项目制中，将一个个项目使用不同的仓库进行隔离，每一个项目下使用独有的`package.json`来管理依赖。

## Monorepo 和 Multirepo

一般而言，大型开源库，例如Babal以及Vue3等等都会选择使用Monorepo，而日常业务中，通常都是项目制的，通常会选择Multirepo，那么这两者之前有什么区别呢？

### **规范、工作流的统一性**

在使用Multirepo时，我们通常在遇到一个新项目的时候，会利用现有的脚手架或者手动重新搭建一套项目结构，这就使得不同的项目往往存在于不同的仓库中，而又因为种种原因无法做到代码规范、构建流程、发布流程等的统一性。使用Monorepo则不会存在这个问题，因为所有的packages包全部都在一个仓库中，自然而然就可以做到代码规范、构建流程和发布流程的统一性。

### **代码复用和版本依赖**

想象一下这样一个场景：当你的A项目依赖了B项目中的某个模块，你必须等到B项目重新发布以后，你的A项目才能正常开发或发布。如果B项目是一个基础库的话，那么B的每次更新都会影响到所有依赖B的项目。对那些没有提取复用逻辑，但又会CV在各个项目中函数、组件等，如果存在改动情况，则需要在每一个项目中都改动。这是使用Multirepo必须要去解决的两个问题造：代码复用问题和版本依题。如果使用的是Monorepo则可以很容易的解决这个问题，对于那些需要复用的逻辑，可以选择把它们都提取到一个公共的packages下，例如packages/shared。而对于版本依赖问题，则更好解决。因为所有packages都在一个仓库，无论是本地开发或者发布都没有问题。

### **团队协作以及权限控制**

根据Monorepo的特点，各个packages之间相对独立，所以可以很方便的进行职责划分。然而正是因为所有packages都在一个仓库下，所以在代码权限控制上很难像Multirepo那样进行划分，这无疑提高了Monorepo的门槛，它必须严格要求所有开发者严格遵守代码规范、提交规范等。

### **项目体积**

对于使用Monorepo的项目来说，随着项目的迭代，在代码体积和git提交方面都会比Multirepo项目增长快的很多，甚至会出现启动一个项目、修改后热更新非常慢的情况。不过随着打包工具的发展，这些都不再是问题。

## Monorepo 最佳实践

:::info 闲言碎语
我觉得这个是最佳实践，但是千人千面，每个前端人都觉得自己的方案是最佳的，所以，请选择性食用...
:::

### 一个例子

[使用lerna搭建的monorepo](https://github.com/vcpablo/vuejs-lerna-monorepo)

### 从零开始

目前，搭建Monorepo项目主要有两种方式：

1. `Lerna` + `yarn workspace`(参考文章：[这里](https://www.polarsignals.com/blog/posts/2022/02/01/managing-monorepos-with-lerna-and-yarn-workspaces))
2. `pnpm`
3. `npm`（教程参考[这里](https://juejin.cn/post/7000733785436192782))

在Vue最新的源码中，是使用pnpm来搭建Monorepo项目的，所以我们采用第二种方式，效仿一下Vue大佬思路。

:::danger 注意
这里没有采用Lerna，不是因为不好用，而是我对比发现，用yarn或者pnpm搭建的项目，依赖会清晰一些，依赖包的大小也小一些，但是Lerna生成的包就会很大。这个我还在具体的deep dive，我个人认为是pnpm和npm包管理工具的工作方式的差异造成了这样的情况。如果有需要我会再更新一篇关于这个的文章。
:::

#### 全局安装pnpm

1. 根据官方的指南安装：[https://pnpm.io/zh/installation](https://pnpm.io/zh/installation)
2. 使用npm安装

> 因为我使用了nvm，所以我选择了用npm安装

```bash
# 安装pnpm
$ npm install pnpm -g

# 安装完毕后查看pnpm版本
$ pnpm -v
9.4.0

# 查看node版本
$ node -v
v18.20.3
```

#### pnpm安装完成后，创建一下的目录结构

```shell
|-- monorepo-demo              
|   |-- packages                  # packages目录
|   |   |-- ios                   # ios子包
|   |   |-- harmony               # harmony子包
|   |   |-- shared                # shared子包
```

#### 进入每个目录，执行一次`pnpm init -y`命令

执行完之后，会创建相应package目录下的`package.json`文件。

```shell
|-- monorepo-demo              
|   |-- packages                  # packages目录
|   |   |-- ios                   # ios子包
|   |   |   |-- package.json      # ios子包特有的依赖
|   |   |-- harmony               # harmony子包
|   |   |   |-- package.json      # harmony子包特有的依赖
|   |   |-- shared                # shared子包
|   |   |   |-- package.json      # shared子包特有的依赖
|   |-- package.json              # 所有子包都公共的依赖
```

#### 修改根目录下的`package.json`文件

```json
{
  "name": "MonorepoTest", // 避免pnpm安装时重名
  "private": true,  // 标记私有，防止意外发布
  "version": "1.0.0",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

#### 进入到每一个子包中，依次修改`package.json`，我们以`ios`这个包为例

```json
{
  "name": "@MonorepoTest/ios", // 避免安装时跟@vue/* 重名
  "version": "1.0.0",
  "description": "ios子包",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

#### 回到根目录，创建`pnpm-workspace.yaml`文件

> 参考[这里](https://pnpm.io/workspaces)

```json
packages:
  - 'packages/*'
```

#### 安装项目依赖，分为两部分，`公共依赖`和`包依赖`

##### 公共依赖：

公共依赖指的是为所有子包共享的包，例如：`eslint`、`typescript`或者`prettier`等等。

```shell
# 在根目录安装eslint 和 typescript
$ pnpm install eslint typescript --save-dev -w
```

:::danger 注意
-w 这个参数一定要加，否则你会报错。
:::

安装完毕后，可以在根目录的package.json文件中看到devDependencies依赖包信息：

```json
"devDependencies": {
  "eslint": "^8.5.0",
  "typescript": "^4.5.4"
}
```

##### 特有依赖

安装特有的依赖时，我们会用到`-r --filter XXX`这个参数。

下面这个命令表示，**在ios子包安装lodash依赖**

```shell
$ pnpm install lodash -r --filter @MonorepoTest/ios
```

然后你可以去查看一下依赖：

```json
"dependencies": {
  "lodash": "^4.17.21"
}
```

##### 安装子包之间的依赖

下面我们安装子包之间的依赖，假设我ios这个子包需要依赖shared子包，那我们可以这样安装：

```shell
$ pnpm install @MonorepoTest/shared -r --filter @MonorepoTest/ios

```

同样查看依赖，可以看到：

```json
"dependencies": {
  "@MonorepoTest/shared": "workspace:^1.0.0"
}`
```

这样包之间的依赖就安装完成了。**注意这里的版本因为是本地依赖，所以是有`workspace`这个前缀**。

##### 到此为止，项目的基础结构已经搭建完毕

更多的pnpm相关方法，请参考这篇[博客文章](https://adamcoster.com/blog/pnpm-config)。

### 项目发布

:::info 注意
在执行以下步骤之前，请确保已经将代码推送到链接的 git 远程仓库中。这里我使用github作为例子。
:::

#### 使用 `bumpp`进行版本控制，创建标签并且推送代码

1. 安装bumpp

    ```shell
    pnpm add bumpp -D
    ```
2. 在根目录的 package.json 中添加以下脚本：

    ```json
    {
      "scripts": {
        "release": "bumpp package.json packages/**/package.json"
      }
    }
    ```
3. 在根目录执行以下命令：

    ```shell
    pnpm run release
    ```
    这个命令将自动升级你的 npm 包版本，创建 git 标签，并将更改推送到你的远程 git 存储库。

#### 使用`GitActions`自动发布npm包

1. 在**根目录**下创建一个名为 `.github/workflows/release.yml` 的文件。
2. 文件内容如下所示：
    ```yaml
    name: Release
    on:
      push:
        tags:
          - 'v*'
    jobs:
      release:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
            with:
              fetch-depth: 0

          - name: Setup node
            uses: actions/setup-node@v2
            with:
              node-version: '16'
              registry-url: https://registry.npmjs.org/

          - name: Install pnpm
            uses: pnpm/action-setup@v2
            with:
              version: latest

          - name: Install dependencies
            run: pnpm i

          - name: Build
            run: pnpm run build

          - name: Publish
            run: pnpm publish -r --access public --no-git-checks
            env:
              NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}

          - run: npx changelogithub
            env:
              GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
    ```
3. 接下来，在 `npm` 上获取你的认证令牌。请注意，你需要拥有发布包的权限才能获得令牌。将令牌添加到 `GitHub` 仓库的 `secrets` 中。
4. 转到你的 `GitHub` 仓库的 “Settings” 页面，在左侧菜单中，单击 “`Secrets and variables / Actions`”。单击 “`New repository secret`” 按钮创建一个新的密钥，名称为 “`NPM_TOKEN`”，值为你在步骤 4 中获得的认证令牌。

现在，当你推送一个带有标签的 commit 到 GitHub 仓库时，GitHub Actions 将会自动运行你的 release.yml 工作流程，并将你的 npm 包发布到 npm 官方网站。

## 总结

文章写的比较仓促，是一些基本用法。如果你也在想试用一下Monorepo，那可以跟着步骤一步一步的玩一玩，如果你是要迁移已有的项目到Monorepo结构形式，那请注意一定要调查好包之间的依赖，这将是个比较痛苦的过程。之前我司的Walker Li同学就相当有体会，闲言不表。祝大家Monorepo玩的愉快。

## 参考链接

- [关于 monorepo 的一些尝试](https://zhuanlan.zhihu.com/p/70782864)
- [Monorepo——大型前端项目的代码管理方式](https://segmentfault.com/a/1190000019309820)
- [All in one：项目级 monorepo 策略最佳实践](https://segmentfault.com/a/1190000039157365)
- [Why is Babel a monorepo?](https://github.com/babel/babel/blob/master/doc/design/monorepo.md)
- [Directed graph build systems](https://trunkbaseddevelopment.com/monorepos/#directed-graph-build-systems)
- [Monorepo Tools](https://monorepo.tools/)
