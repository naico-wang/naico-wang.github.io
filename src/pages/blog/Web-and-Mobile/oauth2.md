---
title: OAuth 2.0 架构初探
date: 2024-07-05
abstract: OAuth 通过引入授权层来解决这些问题，并将客户端的角色与资源的角色分开...
---

# OAuth 2.0 架构初探

:::info 前言
前面写过一篇文章，是关于JWT的，说到JWT，就会联系到SSO（Single Sign On）和 OAuth。与JWT不同的是，OAuth是一种软件的架构，用来解决第三方客户端的权限问题。
本文会对架构做一些个人粗浅的分析。

关于OAuth2.0的标准文档，请查阅：https://datatracker.ietf.org/doc/html/rfc6749
:::