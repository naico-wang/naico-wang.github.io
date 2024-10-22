---
title: JWT、JWS、JWE、JWA、JWK
date: 2024-07-08
category: Web加解密
---

# JWT、JWS、JWE、JWA、JWK简介及使用方法

## JW* 简介

在过去的几年里，用户数据的安全和隐私问题一直是人们越来越关注的问题。同时，JWT作为对抗它的一种技术，也被越来越多地使用。了解JWT将使你比其他软件工程师更有优势。JWT起初可能看起来很简单，但它相当难理解。
在这篇文章中，我们将主要探讨JWT和JWS。此外，我们还将快速浏览JWE、JWA和JWK。本文旨在让读者了解JWT的概念，而不需要太过深入地探讨这个话题。

### 它们分别是什么？

在深入了解之前，我们最好先了解JWT、JWS、JWE、JWA和JWK之间的联系。

> `JSON Web Token（JWT）`是一个抽象的，以 JSON 网络签名（JWS）和 JSON网络加密（JWE）的形式表示。
> JSON Web签名(JWS) 和 JSON Web加密(JWE) 使用JWA中定义的签名和加密算法。 JSON网络算法  (JWA) 中定义的签名和加密算法作为保证自身安全的方式。
> 中定义的签名算法的公钥可以被托管为 JSON Web密钥（JWK） 。

### JSON Web Token（JWT）

> JSON Web 令牌（JWT）是一个开放标准（RFC 7519），它定义了一种紧凑且自包含的方式，用于在各方之间作为 JSON 对象安全地传输信息

也就是说 JWT 实际上是一种规范，并确定使用 JSON 作为表达，JWS 和 JWE 则是对这种规范的实现以及增强。

### JSON Web Signature (JWS)

JWS 使用 Base64 进行编码，它包含三个部分，分别以 `.` 进行分割，如`xxxx.yyyy.zzz`的形式，分别对应 Header, Payload, Signature。

- Header： 存储一些元数据：类型以及其签名使用的算法
- Payload：按照标准存储相关信息，包括 iss-签发者，exp-过期时间，sub-对象主体（一般是用户信息），iat-签发时间，aud-接收方
- Signature：签名信息，由密钥签署，可以使用公钥来验证。

JWS 一般用于交换非敏感信息，若 token 中包含用户敏感信息，则需要对其加密，这就用到了 JWE

### JSON Web Encryption (JWE)

JWE 本质上是对 Jwt 中的 Payload 进行加密。当然 JWE 是可以包含 JWS 的，也就是说当前 token 既有签名保证完整性，又有加密来保证安全性。

既然要加密，则需要公钥和私钥了，密钥一般使用 OpenSSL 生成 x509 格式。这里又引伸出 JWKs 的概念：

JSON Web 密钥集（JWKS）包含公钥，用于验证授权服务器发布并使用 RS256 签名算法签名的 JWT。

JWKs 包含一系列的公钥，授权服务器可以通过接口对外暴露相关的公钥，用于资源服务器进行认证。更多的 JWK 规范可以参考https://self-issued.info/docs/d

### JWK

JWT的密钥，也就是我们常说的scret

## JWT 详解

> 请参考我写的另一篇关于 JWT 的文章，这里就不展开了。

## JWS 详解

### JWS 的结构

JWS ，也就是`JWT Signature`，其结构就是在之前`nonsecure JWT`的基础上，在头部声明签名算法，并在最后添加上签名。创建签名，是保证jwt不能被他人随意篡改。

为了完成签名，除了用到header信息和payload信息外，还需要算法的密钥，也就是secret。当利用非对称加密方法的时候，这里的secret为私钥。

为了方便后文的展开，我们把JWT的密钥或者密钥对，统一称为`JSON Web Key`，也就是JWK。

```javascript
// JWT Signature 的签名算法
RSASSA || ECDSA || HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)

>> GQPGEpixjPZSZ7CmqXB-KIGNzNl4Y86d3XOaRsfiXmQ
>> # 上面这个是用 HMAC SHA256生成的
```

到目前为止，jwt的签名算法有三种。

- 对称加密HMAC【哈希消息验证码】：`HS256/HS384/HS512`
- 非对称加密RSASSA【RSA签名算法】：`RS256/RS384/RS512`
- ECDSA【椭圆曲线数据签名算法】：`ES256/ES384/ES512`

最后将签名与之前的两段内容用.连接，就可以得到经过签名的JWT，也就是JWS。

```javascript
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwOi8
```
当验证签名的时候，利用公钥或者密钥来解密Sign，和 `base64UrlEncode(header) + “.” + base64UrlEncode(payload)` 的内容完全一样的时候，表示验证通过。

### JWS 的额外头部声明

如果对于CA有些概念的话，这些内容会比较好理解一些。为了确保服务器的密钥对可靠有效，同时也方便第三方CA机构来签署JWT而非本机服务器签署JWT，对于JWS的头部，可以有额外的声明，以下声明是可选的，具体取决于JWS的使用方式。如下所示：

- jku: 发送JWK的地址；最好用HTTPS来传输
- jwk: 就是之前说的JWK
- kid: jwk的ID编号
- x5u: 指向一组X509公共证书的URL
- x5c: X509证书链
- x5t：X509证书的SHA-1指纹
- x5t#S256: X509证书的SHA-256指纹
- typ: 在原本未加密的JWT的基础上增加了 JOSE 和 JOSE+ JSON。JOSE序列化后文会说及。适用于JOSE标头的对象与此JWT混合的情况。
- crit: 字符串数组，包含声明的名称，用作实现定义的扩展，必须由 this->JWT的解析器处理。不常见。

### 多重验证与JWS序列化

当需要多重签名或者JOSE表头的对象与JWS混合的时候，往往需要用到JWS的序列化。JWS的序列化结构如下所示:

```json
{
  "payload": "eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ",
"signatures": [{
  "protected": "eyJhbGciOiJSUzI1NiJ9",
  "header": { "kid": "2010-12-29" },
  "signature":"signature1"
}, {
  "protected": "eyJhbGciOiJSUzI1NiJ9",
  "header": { "kid": "e9bc097a-ce51-4036-9562-d2ade882db0d" },
  "signature":"signature2"
},
...
]}
```

结构很容易理解。首先是payload字段，这个不用多讲，之后是signatures字段，这是一个数组，代表着多个签名。每个签名的结构如下：

- protected：之前的头部声明，利用b64uri加密；
- header：JWS的额外声明，这段内容不会放在签名之中，无需验证；
- signature：也就是对当前header+payload的签名。

### ECDSA|RSASSA or HMAC ？ 应该选用哪个？

之前看JWT的时候看到论坛里的一个话题，觉得很有意思，用自己的理解来说一下

> https://stackoverflow.com/questions/38588319/understanding-rsa-signing-for-jwt。

首先，我们必须明确一点，无论用的是 HMAC，RSASSA，ECDSA；密钥，公钥，私钥都不会发送给客户端，仅仅会保留在服务端上。

对称的算法HMAC适用于单点登录，一对一的场景中。速度很快。

但是面对一对多的情况，比如一个APP中的不同服务模块，需要JWT登录的时候，主服务端【APP】拥有一个私钥来完成签名即可，而用户带着JWT在访问不同服务模块【副服务端】的时候，副服务端只要用公钥来验证签名就可以了。从一定程度上也减少了主服务端的压力。

当然，还有一种情况就是不同成员进行开发的时候，大家可以用统一的私钥来完成签名，然后用各自的公钥去完成对JWT的认证，也是一种非常好的开发手段。

因此，构建一个没有多个小型“微服务应用程序”的应用程序，并且开发人员只有一组的，选择HMAC来签名即可。其他情况下，尽量选择RSA。

## JWE 详解

> JWE是一个很新的概念，总之，除了jwt的官方手册外，很少有网站或者博客会介绍这个东西。也并非所有的库都支持JWE。这里记录一下自己看官方手册后理解下来的东西。

JWS是去验证数据的，而JWE（JSON Web Encryption）是保护数据不被第三方的人看到的。通过JWE，JWT变得更加安全。

JWE和JWS的公钥私钥方案不相同，JWS中，私钥持有者加密令牌，公钥持有者验证令牌。而JWE中，私钥一方应该是唯一可以解密令牌的一方。

在JWE中，公钥持有可以将新的数据放入JWT中，但是JWS中，公钥持有者只能验证数据，不能引入新的数据。因此，对于公钥/私钥的方案而言，JWS和JWE是互补的。

|          	|  JWS     	| JWE     	|
|----------	|---------	|---------	|
| producer 	| pri_key 	| pub_key 	|
| consumer 	| pub_key 	| pri_key 	|

### JWE 的构成

一个JWE，应该是如下形式的：

```javascript
eyJhbGciOiJSU0ExXzUiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0.
UGhIOguC7IuEvf_NPVaXsGMoLOmwvc1GyqlIKOK1nN94nHPoltGRhWhw7Zx0-kFm1NJn8LE9XShH59_
i8J0PH5ZZyNfGy2xGdULU7sHNF6Gp2vPLgNZ__deLKxGHZ7PcHALUzoOegEI-8E66jX2E4zyJKxYxzZIItRzC5hlRirb6Y5Cl_p-ko3YvkkysZIFNPccxRU7qve1WYPxqbb2Yw8kZqa2rMWI5ng8Otv
zlV7elprCbuPhcCdZ6XDP0_F8rkXds2vE4X-ncOIM8hAYHHi29NX0mcKiRaD0-D-ljQTPcFPgwCp6X-nZZd9OHBv-B3oWh2TbqmScqXMR4gp_A.
AxY8DCtDaGlsbGljb3RoZQ.
KDlTtXchhZTGufMYmOYGS4HffxPSUrfmqCHXaI9wOGY.
9hH0vgRfYgPnAHOd8stkvw
```

如你所见JWE一共有五个部分，分别是：

- The protected header，类似于JWS的头部；
- The encrypted key，用于加密密文和其他加密数据的对称密钥；
- The initialization vector，初始IV值，有些加密方式需要额外的或者随机的数据；
- The encrypted data (cipher text)，密文数据；
- The authentication tag，由算法产生的附加数据，来防止密文被篡改。

### JWE 密钥加密算法

一般来说，JWE需要对密钥进行加密，这就意味着同一个JWT中至少有两种加密算法在起作用。但是并非将密钥拿来就能用，我们需要对密钥进行加密后，利用JWK密钥管理模式来导出这些密钥。JWK的管理模式有以下五种，分别是：

- Key Encryption
- Key Wrapping
- Direct Key Agreement
- Key Agreement with Key Wrapping
- Direct Encryption

并不是所有的JWA都能够支持这五种密钥管理管理模式，也并非每种密钥管理模式之间都可以相互转换。可以参考[Spomky-Labs/jose中给出的表格](https://github.com/Spomky-Labs/jose/blob/master/doc/operation/Encrypt.md)至于各个密钥管理模式的细节，还请看JWT的官方手册，解释起来较为复杂。

### JWE Header

就好像是JWS的头部一样。JWE的头部也有着自己规定的额外声明字段，如下所示：

- type：一般是 jwt
- alg：算法名称，和JWS相同，该算法用于加密稍后用于加密内容的实际密钥
- enc：算法名称，用上一步生成的密钥加密内容的算法。
- zip：加密前压缩数据的算法。该参数可选，如果不存在则不执行压缩，通常的值为 DEF，也就是[deflate算法](https://tools.ietf.org/html/rfc1951)
- jku/jkw/kid/x5u/x5c/x5t/x5t#S256/typ/cty/crit：和JWS额额外声明一样。

### JWE 的加密过程

步骤2和步骤3，更具不同的密钥管理模式，应该有不同的处理方式。在此只罗列一些通常情况。

之前谈及，JWE一共有五个部分。现在来详细说一下加密的过程：

1. 根据头部alg的声明，生成一定大小的随机数；
2. 根据密钥管理模式确定加密密钥；
3. 根据密钥管理模式确定JWE加密密钥，得到CEK；
4. 计算初始IV，如果不需要，跳过此步骤；
5. 如果ZIP头申明了，则压缩明文；
6. 使用CEK，IV和附加认证数据，通过enc头声明的算法来加密内容，结果为加密数据和认证标记；
7. 压缩内容，返回token。


```javascript
base64(header) + '.' +base64(encryptedKey) + '.' + // Steps 2 and 3base64(initializationVector) + '.' + // Step 4base64(ciphertext) + '.' + // Step 6base64(authenticationTag) // Step 6
```

### 多重验证与JWE序列化

和JWS类似，JWE也定义了紧凑的序列化格式，用来完成多种形式的加密。大致格式如下所示：

```json
{
  "protected": "eyJlbmMiOiJBMTI4Q0JDLUhTMjU2In0",
  "unprotected": { "jku":"https://server.example.com/keys.jwks" },
  "recipients":[
    {
    "header": { "alg":"RSA1_5","kid":"2011-04-29" },
    "encrypted_key":
    "UGhIOguC7Iu...cqXMR4gp_A"
    },
    {
    "header": { "alg":"A128KW","kid":"7" },
    "encrypted_key": "6KB707dM9YTIgH...9locizkDTHzBC2IlrT1oOQ"
    }
  ],
  "iv": "AxY8DCtDaGlsbGljb3RoZQ",
  "ciphertext": "KDlTtXchhZTGufMYmOYGS4HffxPSUrfmqCHXaI9wOGY",
  "tag": "Mz-VPPyU4RlcuYv1IwIvzw"
}
```

结构很容易理解，如下所示：

- protected：之前的头部声明，利用b64uri加密；
- unprotected：一般放JWS的额外声明，这段内容不会被b64加密；
- iv：64加密后的iv参数；
- add：额外认证数据；
- ciphertext：b64加密后的加密数据；
- recipients：b64加密后的认证标志-加密链，这是一个数组，每个数组中包含了两个信息；
- header：主要是声明当前密钥的算法；
- encrypted_key：JWE加密密钥。
