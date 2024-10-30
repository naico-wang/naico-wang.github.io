---
title: React 状态更新详解(二)
date: 2024-10-29
category: React技术揭秘
---

# React 状态更新详解(二) - 心智模型

在深入源码前，让我们先建立更新机制的心智模型。

在后面两节讲解源码时，我们会将代码与心智模型联系上，方便你更好理解。

## 同步更新的React

我们可以将更新机制类比代码版本控制。

在没有代码版本控制前，我们在代码中逐步叠加功能。一切看起来井然有序，直到我们遇到了一个紧急线上bug（红色节点）。

![image](https://react.iamkasong.com/img/git1.png)

为了修复这个bug，我们需要首先将之前的代码提交。

在React中，所有通过ReactDOM.render创建的应用（其他创建应用的方式参考ReactDOM.render一节）都是通过类似的方式更新状态。

即没有优先级概念，高优更新（红色节点）需要排在其他更新后面执行。

## 并发更新的React

当有了代码版本控制，有紧急线上bug需要修复时，我们暂存当前分支的修改，在master分支修复bug并紧急上线。

![image2](https://react.iamkasong.com/img/git2.png)

bug修复上线后通过git rebase命令和开发分支连接上。开发分支基于修复bug的版本继续开发。

![image3](https://react.iamkasong.com/img/git3.png)

在React中，通过ReactDOM.createBlockingRoot和ReactDOM.createRoot创建的应用会采用并发的方式更新状态。

高优更新（红色节点）中断正在进行中的低优更新（蓝色节点），先完成render - commit流程。

待高优更新完成后，低优更新基于高优更新的结果重新更新。

接下来两节我们会从源码角度讲解这套并发更新是如何实现的。

## 参考资料

[React Core Team Dan介绍React未来发展方向](https://www.youtube.com/watch?v=v6iR3Zk4oDY)
