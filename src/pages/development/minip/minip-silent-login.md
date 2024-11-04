---
title: 微信小程序静默登录设计
date: 2024-11-04
category: 小程序开发
---

# 微信小程序静默登录设计

## 前言

微信小程序可以通过微信官方提供的登录能力方便地获取微信提供的用户身份标识，快速建立小程序内的用户体系。目前主流的三种方式：

- 自定义登录 
- 静默登录 
- 授权手机号登录

推荐采用静默登录的方式，用户不需要进行任何相关授权或其他操作就可以很流畅的体验整个应用。

静默登录有如下几个好处：

- 不需要额外开发一个自定义的登录界面去实现登录功能 
- 不需要设置额外的按钮要求用户进行授权 
- 用户体验好，不需要额外的登录操作，系统自动绑定微信账号体系，直接体验小程序应用 
- 研发效率高，架构设计简单高效

## 静默登录设计

- 小程序端在启动加载时，调用`wx.login` 获取临时登录凭证（`code`）

- 小程序端调用服务器登录接口传递 `code` 给服务器

- 服务器通过临时登录凭证、小程序 `appId` 和 `Secret`向微信服务器获取 `openId` 和 `session_key`

- 服务器将 `openId` 和 `session_key` 进行关联，存储到本地缓存或者分布式缓存（如：`redis`）中

- 服务器通过 `openId` 从数据库中获取用信息，若获取不到，生成一个默认名称和默认头像的新用户并保存到数据库中

- 服务器生成自定义的登录信息（如：`access token` 和 `refresh token`）返回给小程序端

- 小程序端使用 `local storage` 存储这些 `token` 信息，后续请求服务器请求时带入`access token`

- 当小程序端存储的 `access token` 过期时，小程序端调用服务器 `refresh` 接口，传入 `refresh token` 来重新获取`access token`

- 当小程序端存储的 `refresh token` 过期时，自动重新发起一次静默登录。这样用户就无感登录直接体验小程序应用

:::danger 注意事项
会话密钥 `session_key` 是对用户数据进行 **加密签名** 的密钥。为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。

临时登录凭证 `code` 只能使用一次
:::

## 静默登录设计实现

### 01 小程序启动阶段（`onLaunch`）

小程序启动时，通常是在 `app.js` / `app.ts` 的 `onLaunch` 生命周期钩子中发起静默登录。这样可以确保用户在进入小程序的最初阶段就完成登录操作，避免后续业务逻辑中需要频繁进行登录校验。

```javascript
App({
  onLaunch: function () {
    console.log("App onLaunch 发起静默登陆");
    silentLogin();
  }
});
```

### 02 静默登录方法封装

便于后续的调用，例如：在小程序 `onLaunch` 方法中，或者在封装的接口请求中。

```javascript
/**
 * 静默登录
 */
export function silentLogin(): Promise<void> {
  if (isLogin()) { // 判断 access token 是否存在
    return Promise.resolve();
  }

  return new Promise(async (resolve, reject) => {
    let jsCode = null;
    try {
      const codeRes = await login();
      // @ts-ignore
      jsCode = codeRes.code;
      console.log("jsCode: " + jsCode)

      // 将 code 发送到后端，换取 Token 信息
      post(Api.SILENT_LOGIN_URL, { jsCode: jsCode})
        .then((loginRes) => {
          console.log("loginRes: " + JSON.stringify(loginRes))
          if (loginRes.success) {
            // 存储Token信息
            setToken(loginRes.data, LoginType.SILENT);
            resolve(loginRes);
          } else {
            reject(loginRes);
          }
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 调用微信登录，获取登录凭证（code）
 */
export function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
```

### 03 服务器多端权限体系搭建

构建多个`AuthenticationProvider` ，分别支持 Admin 端的用户名密码登录、微信小程序静默登录、微信小程序电话号码授权登录等。

```java
@Bean
public AuthenticationManager authenticationManager() throws Exception {
  List<AuthenticationProvider> providers = new ArrayList<>();
  providers.add(daoAuthenticationProvider()); // 用户名密码认证
  providers.add(openIdAuthenticationProvider()); // OpenID 认证
  providers.add(phoneNumberAuthenticationProvider()); // 手机号码认证

  ProviderManager providerManager = new ProviderManager(providers);
  providerManager.setEraseCredentialsAfterAuthentication(true);
  return providerManager;
}
```

### 04 集成微信SDK

如果你是采用`Java` 语言，可以在 Github 中搜索`Wechat-Group/WxJava`。以下是通过微信小程序临时登录 code 获取 openId 和 sessionKey，并通过缓存进行关联存储。

```java
public WxMaJscode2SessionResult cacheSessionKey(String jsCode) {
  WxMaJscode2SessionResult sessionInfo;
  try {
    sessionInfo = wxMaService.getUserService().getSessionInfo(jsCode);
  } catch (WxErrorException e) {
    log.error("When get session info with {} error occurred {}", jsCode, e.getMessage(), e);
    throw new BizException(
            String.valueOf(WxSdkErrorCode.mapWxOriginErrorCode(e.getError().getErrorCode())),
            e.getMessage());
  }
  sessionKeyStore.storeSessionKey(sessionInfo.getOpenid(), sessionInfo.getSessionKey());
  log.info("Get session info with {} result {}", jsCode, sessionInfo);
  return sessionInfo;
}
```

Github SDK 地址：https://github.com/Wechat-Group/WxJava 。

### 附录

微信小程序官方登录流程时序：

![mini-login](https://mmbiz.qpic.cn/mmbiz_jpg/tZhja1CIKfibeBktrlkRueDfBHuAbj30YA3l1dTDEbxHeaxlzD6IRWyfYscRwkm2ibwowm9C5I3usLN4PpqaJFjw/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

说明：

1. 调用 wx.login() 获取 **临时登录凭证code** ，并回传到开发者服务器。 
2. 调用 auth.code2Session 接口，换取 **用户唯一标识 OpenID** 、 用户在微信开放平台账号下的唯一标识**UnionID**（若当前小程序已绑定到微信开放平台账号） 和 **会话密钥 session_key**。

之后开发者服务器可以根据用户标识来生成自定义登录态，用于后续业务逻辑中前后端交互时识别用户身份。

## 引用链接

- **加密签名**: https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html
- **wx.login()**: https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
- **auth.code2Session**: https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
