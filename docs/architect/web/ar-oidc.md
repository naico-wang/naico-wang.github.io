---
title: OpenID Connect详解
date: 2024-07-06
category: 系统架构
---

# OpenID Connect详解

OpenID Connect 1.0是建立在OAuth 2.0上的一个身份验证机制，它允许客户端通过授权服务对用户进行认证并获取简单的用户信息。

## 相关名词解释

OP：OpenID Provider，即OAuth2.0中的授权服务，用于对用户鉴权

RP：Relying Part，依赖方，即OAuth2.0中的客户端，它从OP除获取对用户的鉴权和用户信息

ID Token：是一个JWT，包含本次授权的基本信息。具体包含字段如下:

| 字段      | 是否必须 | 说明                                                                         |
|-----------|----------|------------------------------------------------------------------------------|
| iss       | 是       | 发布者，一个https开头的地址                                                  |
| sub       | 是       | 主体，OP对用户的唯一标识，不超过255个ASCII字符                               |
| aud       | 是       | 客户，即使用者。值为OAuth2.0协议中客户端注册的client_id                      |
| exp       | 是       | 过期时间，遵从RFC 3339协议，即epoch seconds                                  |
| iat       | 是       | 签发时间，同上                                                               |
| auth_time | 可选     | 鉴权时间                                                                     |
| nonce     | 可选     | 随机值。两个作用  一是RP发送时带上，OP响应时带上，用于RP对比  二是防重放攻击 |
| acr       | 可选     | Authentication Context Class Reference，暂不知义，忽略                       |
| amr       | 可选     | Authentication Methods References，暂不知义，忽略                            |
| azp       | 可选     | Authorized party，暂不知义，忽略                                             |

## 总体流程

类似OAuth2.0，有一个总体流程和若干细分模式的流程，OpenID Connect协议总体流程为：

RP发起请求 -> OP对用户鉴权并获取授权 -> OP响应RP并带上ID Token和Access Token -> RP通过访问凭证向OP请求用户信息 -> OP返回用户信息给RP

```javascript
+--------+                                   +--------+
|        |                                   |        |
|        |---------(1) AuthN Request-------->|        |
|        |                                   |        |
|        |  +--------+                       |        |
|        |  |        |                       |        |
|        |  |  End-  |<--(2) AuthN & AuthZ-->|        |
|        |  |  User  |                       |        |
|   RP   |  |        |                       |   OP   |
|        |  +--------+                       |        |
|        |                                   |        |
|        |<--------(3) AuthN Response--------|        |
|        |                                   |        |
|        |---------(4) UserInfo Request----->|        |
|        |                                   |        |
|        |<--------(5) UserInfo Response-----|        |
|        |                                   |        |
+--------+                                   +--------+
```

## 客户鉴权

客户鉴权即OP对客户端进行鉴权，然后将鉴权结果返回给RP。鉴权流程有三种方式：授权码模式、隐藏模式、混合模式。如果了解OAuth2.0，对前两个模式一定不会模式，OpenID流程类似，而混合模式则是前两种模式的结合。具体OP采用什么模式，取决于RP请求时`response_type`给的值。

- code：授权码模式
- id_token：隐藏模式
- id_token token：隐藏模式
- code id_token：混合模式
- code token：混合模式
- code id_token token：混合模式

:::info 规律
id_token和token等同：只有id_token或/和token的使用隐藏模式，只有code的使用授权码模式i，同时存在他们的则使用混合模式
:::

### 授权码模式

1. RP准备用于鉴权请求的参数
2. RP发送请求，给OP
3. OP对用户鉴权
4. OP手机用户的鉴权信息和授权信息
5. OP发送授权码给RP
6. RP使用授权码向一个端点换取访问凭证。协议称之为Token端点，但没说这个端点是不是由OP提供的。不过一般来说是
7. RP收到访问凭证，包含ID Token、Access Token
8. 客户端验证ID Token，并从中提取用户的唯一标识。前面说过这是一个JWT，唯一标识就是subject identifier

### 隐藏模式

1. RP准备请求参数
2. RP发送请求
3. OP认证用户
4. OP获取用户的认证和授权信息
5. OP发送ID Token，可能还有Access Token给RP
6. RP验证ID Token，提取用户的标识

### 混合模式

1. RP准备请求
2. RP发送请求给OP
3. OP对用户鉴权
4. OP采集用户的鉴权和授权信息
5. OP发送给RP授权码，同时根据请求时指定的response_type，发送额外的参数
6. RP通过授权码向OP请求
7. RP从OP处得到ID Token和Access Token
8. RP验证ID Token，解析用户的唯一标识
