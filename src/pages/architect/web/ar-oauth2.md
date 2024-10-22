---
title: OAuth 2.0 架构初探
date: 2024-07-05
category: 系统架构
---

# OAuth 2.0 架构初探

:::info 前言
前面写过一篇文章，是关于JWT的，说到JWT，就会联系到SSO（Single Sign On）和 OAuth。与JWT不同的是，OAuth是一种软件的架构，用来解决第三方客户端的权限问题。
本文会对架构做一些个人粗浅的分析。

关于OAuth2.0的标准文档，请查阅：[OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
:::

OAuth（开放授权）是一种开放标准，用于允许用户在不暴露其凭据（如用户名和密码）的情况下，让第三方应用程序访问其资源（如用户的照片、视频、联系人列表等）。OAuth 主要用于授权，而不是身份验证。

简单说，OAuth 就是一种授权机制。数据的所有者告诉系统，同意授权第三方应用进入系统，获取这些数据。系统从而产生一个短期的进入令牌（token），用来代替密码，供第三方应用使用。

## 背景

**OAuth**，全称为`Open Authorization`（开放授权），OAuth 始于 2006 年，其设计初衷正是委托授权，就是让最终用户也就是资源拥有者，将他们在受保护资源服务器上的部分权限（例如查询当天订单）委托给第三方应用，使得第三方应用能够代表最终用户执行操作（查询当天订单）。

OAuth 1.0 协议于 2010 年 4 月作为 [RFC 5849](https://datatracker.ietf.org/doc/html/rfc5849) 发布，这是一份信息性的评论请求。OAuth 2.0 框架的发布考虑了从更广泛的 IETF 社区收集的其他用例和可扩展性要求。尽管基于 OAuth 1.0 部署体验构建，OAuth 2.0 并不向后兼容 OAuth 1.0。OAuth 2.0 于 2012 年 10 月作为 [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) 发布，承载令牌使用作为 [RFC 6750](https://datatracker.ietf.org/doc/html/rfc6750) 发布。

在 OAuth 协议中，通过为每个第三方软件和每个用户的组合分别生成对受保护资源具有受限的访问权限的凭据，也就是访问令牌，来代替之前的用户名和密码。而生成访问令牌之前的登录操作，又是在用户跟平台之间进行的，第三方软件根本无从得知用户的任何信息。

这样第三方软件的逻辑处理就大大简化了，它今后的动作就变成了请求访问令牌、使用访问令牌、访问受保护资源，同时在第三方软件调用大量 API 的时候，不再传输用户名和密码，从而减少了网络安全的攻击面。

说白了就是**集中授权**。

值得注意的是，OAuth 并非身份验证，这里的 Auth 是 Authorization，OAuth 是发生在用户做了身份验证后的事情，系统授权用户能做什么操作。互联网中所有的受保护资源，几乎都是以 Web API 的形式来提供访问的。不同的用户能做的事情不同，例如一个 GitHub 项目，有些用户只有读取和提交 PR（pull request）的权限，而管理员用户则能合并 PR。

> **将用户权限在 API 层面细分，是 OAuth 要做的事情**。

## 角色

OAuth 定义了四个角色：

- 资源所有者（`resource owner`）

  能够授予对受保护资源的访问权限的实体。当资源所有者是个人时，它被称为**最终用户**。

- 资源服务器（`resource server`）

  托管受保护资源的服务器，能够接受并使用访问令牌响应受保护的资源请求。

- 客户（`client`）
  
  代表资源所有者及其授权。术语“客户端”不暗示任何特定的实现特征（例如，应用程序是在服务器、桌面还是其他平台上执行设备）。

- 授权服务器（`authorization server`）
      服务器成功后向客户端发出访问令牌
      验证资源所有者并获得授权。

## 工作流程

这里是一个典型的 OAuth 工作流程：

```javascript
+--------+                               +---------------+
|        |--(A)- Authorization Request ->|   Resource    |
|        |                               |     Owner     |
|        |<-(B)-- Authorization Grant ---|               |
|        |                               +---------------+
|        |
|        |                               +---------------+
|        |--(C)-- Authorization Grant -->| Authorization |
| Client |                               |     Server    |
|        |<-(D)----- Access Token -------|               |
|        |                               +---------------+
|        |
|        |                               +---------------+
|        |--(E)----- Access Token ------>|    Resource   |
|        |                               |     Server    |
|        |<-(F)--- Protected Resource ---|               |
+--------+                               +---------------+
```

上图中所示的抽象 OAuth 2.0 流程描述了四个角色之间的交互，包括以下步骤：

1. 客户端向资源所有者请求授权。授权请求可以直接向资源所有者发出（如图所示），或者最好通过授权服务器作为中介间接发出。
   
2. 客户端收到授权许可，这是代表资源所有者授权的凭证，使用本规范中定义的四种许可类型之一或使用扩展许可类型来表示。客户端请求授权所使用的方法授权服务器支持的类型。
   
3. 客户端通过向授权服务器进行身份验证并出示授权许可来请求访问令牌。
   
4. 授权服务器对客户端进行身份验证并验证授权许可，如果有效，则发出访问令牌。
   
5. 客户端从资源服务器请求受保护的资源，并通过出示访问令牌进行身份验证。
   
6. 资源服务器验证访问令牌，如果有效，则处理请求。

## 授权类型

OAuth 2.0 定义了**四种**授权授予(`Authorization Grant`)的类型

> https://datatracker.ietf.org/doc/html/rfc6749#section-1.3

1. 授权码（Authorization Code）

    - 授权码授权码是通过使用授权服务器作为客户端和资源所有者之间的中介获得的

    - 客户端不会直接向资源所有者请求授权，而是将资源所有者引导至授权服务器使用授权码将资源所有者引导回客户端。

    - 在将资源所有者引导回客户端并使用授权码之前，授权服务器会对资源所有者进行身份验证并获得授权。

2. 隐式授权（Implicit）

    - 隐式授权是一种简化的授权码流程，针对在浏览器中使用 JavaScript 等脚本语言实现的客户端。

    - 在隐式流程中，不会向客户端颁发授权码，而是直接向客户端颁发访问令牌。

    - 授权类型是隐式的，因为没有颁发中间凭证（例如授权码）。

3. 资源所有者密码凭据（Resource Owner Password Credentials）

    - 资源所有者密码凭证（例如用户名和密码）可直接用作获取访问令牌的授权许可。

    - 它只能被用在资源所有者和客户端之间存在高度信任的前提下
   
4. 客户端凭据（Client Credentials）

    - 客户端凭证（或其他形式的客户端身份验证）可用于授权许可，当授权范围仅限于客户端控制下的受保护资源或先前与授权服务器安排的受保护资源

## 授权类型具体分析

### 1、授权码（Authorization Code）

授权码（`authorization code`）方式，指的是**第三方应用先申请一个授权码，然后再用该码获取令牌**。

这种方式是最常用的流程，安全性也最高，它适用于那些有后端的 Web 应用。授权码通过前端传送，令牌则是储存在后端，而且所有与资源服务器的通信都在后端完成。这样的前后端分离，可以避免令牌泄漏。

- **第一步**，A 网站提供一个链接，用户点击后就会跳转到 B 网站，授权用户数据给 A 网站使用。下面就是 A 网站跳转 B 网站的一个示意链接。

  ```javascript
  https://b.com/oauth/authorize?
    response_type=code
    &client_id=CLIENT_ID
    &redirect_uri=CALLBACK_URL
    &scope=read
  ```
  上面 URL 中，**response_type**参数表示要求返回授权码（`code`），**client_id**参数让 B 知道是谁在请求，**redirect_uri**参数是 B 接受或拒绝请求后的跳转网址，**scope**参数表示要求的授权范围（这里是只读）。

  ![step1](https://cdn.beekka.com/blogimg/asset/201904/bg2019040902.jpg)

- **第二步**，用户跳转后，B 网站会要求用户登录，然后询问是否同意给予 A 网站授权。用户表示同意，这时 B 网站就会跳回redirect_uri参数指定的网址。跳转时，会传回一个授权码，就像下面这样。

  ```javascript
  https://a.com/callback?code=AUTHORIZATION_CODE
  ```
  上面 URL 中，`code`参数就是授权码。

  ![step2](https://cdn.beekka.com/blogimg/asset/201904/bg2019040907.jpg)

- **第三步**，A 网站拿到授权码以后，就可以在后端，向 B 网站请求令牌。

  ```javascript
  https://b.com/oauth/token?
    client_id=CLIENT_ID&
    client_secret=CLIENT_SECRET&
    grant_type=authorization_code&
    code=AUTHORIZATION_CODE&
    redirect_uri=CALLBACK_URL
  ```

  上面 URL 中，`client_id`参数和`client_secret`参数用来让 B 确认 A 的身份（`client_secret`参数是保密的，因此只能在后端发请求），`grant_type`参数的值是**AUTHORIZATION_CODE**，表示采用的授权方式是授权码，`code`参数是上一步拿到的授权码，`redirect_uri`参数是令牌颁发后的回调网址。

  ![step3](https://cdn.beekka.com/blogimg/asset/201904/bg2019040904.jpg)

- **第四步**，B 网站收到请求以后，就会颁发令牌。具体做法是向`redirect_uri`指定的网址，发送一段 **JSON** 数据。

  ```json
  {    
    "access_token":"ACCESS_TOKEN",
    "token_type":"bearer",
    "expires_in":2592000,
    "refresh_token":"REFRESH_TOKEN",
    "scope":"read",
    "uid":100101,
    "info":{...}
  }
  ```

  上面 JSON 数据中，`access_token`字段就是令牌，A 网站在后端拿到了。

  ![step4](https://cdn.beekka.com/blogimg/asset/201904/bg2019040905.jpg)

### 2. 隐式授权（Implicit）

有些 Web 应用是纯前端应用，没有后端。这时就不能用上面的方式了，必须将令牌储存在前端。

**RFC 6749** 就规定了第二种方式，允许直接向前端颁发令牌。这种方式没有授权码这个中间步骤，所以称为（授权码）"隐藏式"（implicit）。

- **第一步**，A 网站提供一个链接，要求用户跳转到 B 网站，授权用户数据给 A 网站使用。

  ```javascript
  https://b.com/oauth/authorize?
    response_type=token&
    client_id=CLIENT_ID&
    redirect_uri=CALLBACK_URL&
    scope=read
  ```

  上面 URL 中，`response_type`参数为`token`，表示要求直接返回令牌。

- **第二步**，用户跳转到 B 网站，登录后同意给予 A 网站授权。这时，B 网站就会跳回`redirect_uri`参数指定的跳转网址，并且把令牌作为 URL 参数，传给 A 网站。

  ```javascript
  https://a.com/callback#token=ACCESS_TOKEN
  ```

  上面 URL 中，`token`参数就是令牌，A 网站因此直接在前端拿到令牌。

  :::danger 注意:
  令牌的位置是 **URL 锚点（fragment）**，而不是**查询字符串（querystring）**，这是因为 OAuth 2.0 允许跳转网址是 HTTP 协议，因此存在"中间人攻击"的风险，而浏览器跳转时，锚点不会发到服务器，就减少了泄漏令牌的风险。
  :::

  ![step5](https://cdn.beekka.com/blogimg/asset/201904/bg2019040906.jpg)

  这种方式把令牌直接传给前端，是很不安全的。因此，只能用于一些安全要求不高的场景，并且令牌的有效期必须非常短，通常就是会话期间（session）有效，浏览器关掉，令牌就失效了。

### 3. 资源所有者密码凭据（Resource Owner Password Credentials）

> **如果你高度信任某个应用，RFC 6749 也允许用户把用户名和密码，直接告诉该应用。该应用就使用你的密码，申请令牌，这种方式称为"密码式"（password）。**

- **第一步**，A 网站要求用户提供 B 网站的用户名和密码。拿到以后，A 就直接向 B 请求令牌。

  ```javascript
  https://oauth.b.com/token?
    grant_type=password&
    username=USERNAME&
    password=PASSWORD&
    client_id=CLIENT_ID
  ```
  上面 URL 中，`grant_type`参数是授权方式，这里的`password`表示"密码式"，`username`和`password`是 B 的用户名和密码。

- **第二步**，B 网站验证身份通过后，直接给出令牌。注意，这时不需要跳转，而是把令牌放在 JSON 数据里面，作为 HTTP 回应，A 因此拿到令牌。

  这种方式需要用户给出自己的用户名/密码，显然风险很大，因此只适用于其他授权方式都无法采用的情况，而且必须是用户高度信任的应用。

### 4. 客户端凭据（Client Credentials）

最后一种方式是凭证式（client credentials），适用于没有前端的命令行应用，即在命令行下请求令牌。

- **第一步**，A 应用在命令行向 B 发出请求。

  ```javascript
    https://oauth.b.com/token?
      grant_type=client_credentials&
      client_id=CLIENT_ID&
      client_secret=CLIENT_SECRET
  ```

  上面 URL 中，`grant_type`参数等于client_credentials表示采用凭证式，`client_id`和`client_secret`用来让 B 确认 A 的身份。

- **第二步**，B 网站验证通过以后，直接返回令牌。

  这种方式给出的令牌，是针对第三方应用的，而不是针对用户的，即有可能多个用户共享同一个令牌。

## 令牌的使用

A 网站拿到令牌以后，就可以向 B 网站的 API 请求数据了。

此时，每个发到 API 的请求，都必须带有令牌。具体做法是在请求的头信息，加上一个`Authorization`字段，令牌就放在这个字段里面。

```bash
curl -H "Authorization: Bearer ACCESS_TOKEN" \
"https://api.b.com"
```

上面命令中，`ACCESS_TOKEN`就是拿到的令牌。

## 更新令牌

令牌的有效期到了，如果让用户重新走一遍上面的流程，再申请一个新的令牌，很可能体验不好，而且也没有必要。OAuth 2.0 允许用户自动更新令牌。

具体方法是，B 网站颁发令牌的时候，一次性颁发两个令牌，一个用于获取数据，另一个用于获取新的令牌（refresh token 字段）。令牌到期前，用户使用 refresh token 发一个请求，去更新令牌。

```javascript
https://b.com/oauth/token?
  grant_type=refresh_token&
  client_id=CLIENT_ID&
  client_secret=CLIENT_SECRET&
  refresh_token=REFRESH_TOKEN
```

上面 URL 中，`grant_type`参数为`refresh_token`表示要求更新令牌，`client_id`参数和`client_secret`参数用于确认身份，`refresh_token`参数就是用于更新令牌的令牌。

B 网站验证通过以后，就会颁发新的令牌。
