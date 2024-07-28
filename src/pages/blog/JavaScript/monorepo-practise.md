---
title: Monorepo+pnpm 实战
date: 2024-07-28
abstract: 关于PNPM + Monorepo 在实际项目中的应用
---

# Monorepo+pnpm 实战

最近在做项目的时候正好遇到了一个项目需要多端实现的情况，转念一想，这不就是Monorepo大展身手的情况吗？
于是乎，使用`yarn workspace`初始化了一个 `monorepo` 的项目。

然后在昨天，看到了 `稀土掘金` 公众号推送的使用 `pnpm` 搭建 `monorepo` 的文章，心血来潮，决定在项目初期换用 `pnpm` 来管理项目。

马上动手！

> 稀土掘金文章链接： https://juejin.cn/post/7357546247848198182
> 
> 里面关于 `npm`, `yarn`, `pnpm` 相关的知识已经描述的很明确，这里就不再赘述了，感兴趣的同学直接去阅读原文。

## 删除 yarn 相关的文件

由于之前是用的 yarn 来管理，所以这里要删除 yarn 生成的相关文件：

- 删除`yarn.lock` 文件
- 删除`.yarnrc.yml` 文件 
  
  > 由于我使用的是 yarn 4 版本，所以会有这个文件，如果是用npm安装的1.22.22版本，不会生成这个文件。具体原因请看官网介绍)
- 删除`.yarn` 目录
- 删除根目录下和各个package目录下的 `node_modules` 目录
- 删除 `package.json` 下关于 `workspace` 的定义，因为 pnpm 会报错。

  ```json
  "workspaces": [
    "packages/*"
  ],
  ```

## 安装 pnpm

这里可以使用命令行安装，也可以使用 `npm` 安装，看个人喜好。我使用的是 `npm` 全局安装

> 官方安装指南：https://pnpm.io/installation

安装完成之后执行 `pnpm -v` 查看版本

```shell
pnpm -v

9.6.0
```

## 初始化 WorkSpace 和安装项目依赖

在**根目录**新建 `pnpm-workspace.yaml` 文件，我们项目所有的包是在 `packages` 目录下面，所以定义如下。其他的请根据自己的项目自行调整。

```yaml
packages:
  #packages:
  - 'packages/*'
```

返回**根目录**，执行 pnpm install命令安装依赖，可以看到子包里面的项目依赖也一并被安装好了。

## 定义项目的执行脚本

之前项目执行的时候一直都是进到各个子包的目录下执行相应的脚本，现在趁着升级package manager，一起写了个聚合脚本。

在pnpm中和yarn一样，可以使用filter来指定命令执行的包。所以我们新建如下的命令来执行各个子包中的scripts：

```shell
{
  ...,
  "web:dev": "pnpm --filter ./packages/website dev",
  "web:build": "pnpm --filter ./packages/website build",
  "app:dev": "pnpm --filter ./packages/app dev",
  "app:build": "pnpm --filter ./packages/app build"
}
```

经过这样设置，以后在项目根目录直接执行相应的脚本就能执行，不用再cd到具体的package目录中执行了。

## 总结

搭配pnpm使用monorepo还有很多其他用法，由于我们项目刚起步，还没用上。具体的可以看前面我提到的文章。

## 参考链接

- [Monorepo与pnpm：前端项目管理的完美搭档](https://juejin.cn/post/7357546247848198182)
