---
title: 浅谈常见的七种加密算法及实现
date: 2024-07-04
category: 杂七杂八
---

# 浅谈常见的七种加密算法及实现(转载)

> 原文链接：https://juejin.cn/post/6844903638117122056

## 前言

**数字签名**、**信息加密** 是前后端开发都经常需要使用到的技术，应用场景包括了用户登入、交易、信息通讯、`oauth` 等等，不同的应用场景也会需要使用到不同的签名加密算法，或者需要搭配不一样的 **签名加密算法** 来达到业务目标。这里简单的给大家介绍几种常见的签名加密算法和一些典型场景下的应用。

## 1. 数字签名

**数字签名**，简单来说就是通过提供 **可鉴别** 的 **数字信息** 验证 **自身身份** 的一种方式。一套 **数字签名** 通常定义两种 **互补** 的运算，一个用于 **签名**，另一个用于 **验证**。分别由 **发送者** 持有能够 **代表自己身份** 的 **私钥** (私钥不可泄露),由 **接受者** 持有与私钥对应的 **公钥** ，能够在 **接受** 到来自发送者信息时用于 **验证** 其身份。

![数字签名](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/13/16493f2bfa18df72~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

> 注意：图中 加密过程 有别于 公钥加密，更多 介绍戳[这里](https://www.zhihu.com/question/25912483)。签名 最根本的用途是要能够唯一 证明发送方的身份，防止 中间人攻击、`CSRF` 跨域身份伪造。基于这一点在诸如 设备认证、用户认证、第三方认证 等认证体系中都会使用到 签名算法 (彼此的实现方式可能会有差异)。

## 2. 加密和解密

### 2.1 加密

**数据加密** 的基本过程，就是对原来为 **明文** 的文件或数据按 **某种算法** 进行处理，使其成为 **不可读** 的一段代码，通常称为 **“密文”**。通过这样的途径，来达到 **保护数据** 不被 **非法人窃取**、阅读的目的。

### 2.2 解密

**加密** 的 **逆过程** 为 解密，即将该 **编码信息** 转化为其 **原来数据** 的过程。

## 3. 对称加密和非对称加密

加密算法分 **对称加密** 和 **非对称加密**，其中对称加密算法的加密与解密 **密钥相同**，非对称加密算法的加密密钥与解密 **密钥**不同，此外，还有一类 **不需要密钥** 的 **散列算法**。

> 常见的 **对称加密** 算法主要有 `DES`、`3DES`、`AES` 等，常见的 **非对称算法** 主要有 `RSA`、`DSA` 等，**散列算法** 主要有 `SHA-1`、`MD5` 等。

### 3.1 对称加密

**对称加密算法** 是应用较早的加密算法，又称为 **共享密钥加密算法**。在 **对称加密算法** 中，使用的密钥只有一个，**发送** 和 **接收** 双方都使用这个密钥对数据进行 **加密** 和 **解密**。这就要求加密和解密方事先都必须知道加密的密钥。

![对称加密](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/13/16493f2bfa02dbcd~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

1. 数据加密过程：在对称加密算法中，**数据发送方** 将 **明文** (原始数据) 和 **加密密钥** 一起经过特殊 **加密处理**，生成复杂的 **加密密文** 进行发送。
2. 数据解密过程：**数据接收方** 收到密文后，若想读取原数据，则需要使用 **加密使用的密钥** 及相同算法的 **逆算法** 对加密的密文进行解密，才能使其恢复成 **可读明文**。

### 3.2 非对称加密

**非对称加密算法**，又称为 **公开密钥加密算法**。它需要两个密钥，一个称为 **公开密钥 (`public key`)**，即 **公钥**，另一个称为 **私有密钥 (`private key`)**，即 **私钥**。
因为 **加密** 和 **解密** 使用的是两个不同的密钥，所以这种算法称为 **非对称加密算法**。

![非对称加密](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/13/16493f2bfa06e955~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

1. 如果使用 **公钥** 对数据 **进行加密**，只有用对应的 **私钥** 才能 **进行解密**。
2. 如果使用 **私钥** 对数据 **进行加密**，只有用对应的 **公钥** 才能 **进行解密**。

> **例子**：甲方生成 **一对密钥** 并将其中的一把作为 **公钥** 向其它人公开，得到该公钥的 **乙方** 使用该密钥对机密信息 **进行加密** 后再发送给甲方，甲方再使用自己保存的另一把 **专用密钥 (私钥)**，对 **加密** 后的信息 **进行解密**。

## 4. 常见的签名加密算法

### 4.1 MD5算法

`MD5` 用的是 **哈希函数**，它的典型应用是对一段信息产生 **信息摘要**，以 **防止被篡改**。严格来说，`MD5` 不是一种 **加密算法** 而是 **摘要算法**。无论是多长的输入，`MD5` 都会输出长度为 `128bits` 的一个串 (通常用 `16` 进制 表示为 `32` 个字符)。

```java
public static final byte[] computeMD5(byte[] content) {
    try {
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        return md5.digest(content);
    } catch (NoSuchAlgorithmException e) {
        throw new RuntimeException(e);
    }
}
```

### 4.2 SHA1算法

`SHA1` 是和 `MD5` 一样流行的 **消息摘要算法**，然而 `SHA1` 比 `MD5` 的 **安全性更强**。对于长度小于 `2 ^ 64` 位的消息，`SHA1` 会产生一个 `160` 位的 **消息摘要**。基于 `MD5`、`SHA1` 的信息摘要特性以及 **不可逆** (一般而言)，可以被应用在检查 **文件完整性** 以及 **数字签名** 等场景。

```java
public static byte[] computeSHA1(byte[] content) {
    try {
        MessageDigest sha1 = MessageDigest.getInstance("SHA1");
        return sha1.digest(content);
    } catch (NoSuchAlgorithmException e) {
        throw new RuntimeException(e);
    }
}
```

### 4.3 HMAC算法

`HMAC` 是密钥相关的 **哈希运算消息认证码（Hash-based Message Authentication Code）**，`HMAC` 运算利用 **哈希算法** (MD5、SHA1 等)，以 **一个密钥** 和 **一个消息** 为输入，生成一个 **消息摘要** 作为 **输出**。

`HMAC` **发送方** 和 **接收方** 都有的 `key` 进行计算，而没有这把 `key` 的第三方，则是 **无法计算** 出正确的 **散列值**的，这样就可以 **防止数据被篡改**。

```java
package net.pocrd.util;
import net.pocrd.annotation.NotThreadSafe;
import net.pocrd.define.ConstField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;


@NotThreadSafe
public class HMacHelper {
    private static final Logger logger = LoggerFactory.getLogger(HMacHelper.class);
    private Mac mac;

    /**
     * MAC算法可选以下多种算法
     * HmacMD5/HmacSHA1/HmacSHA256/HmacSHA384/HmacSHA512
     */
    private static final String KEY_MAC = "HmacMD5";
    public HMacHelper(String key) {
        try {
            SecretKey secretKey = new SecretKeySpec(key.getBytes(ConstField.UTF8), KEY_MAC);
            mac = Mac.getInstance(secretKey.getAlgorithm());
            mac.init(secretKey);
        } catch (Exception e) {
            logger.error("create hmac helper failed.", e);
        }
    }
    public byte[] sign(byte[] content) {
        return mac.doFinal(content);
    }
    
    public boolean verify(byte[] signature, byte[] content) {
        try {
            byte[] result = mac.doFinal(content);
            return Arrays.equals(signature, result);
        } catch (Exception e) {
            logger.error("verify sig failed.", e);
        }
        return false;
    }
}
```

> 测试结论：`HMAC` 算法实例在 **多线程环境** 下是 **不安全的**。但是需要在 **多线程访问** 时，进行同步的辅助类，使用 `ThreadLocal` 为 **每个线程缓存** 一个实例可以避免进行锁操作。

### 4.4 AES/DES/3DES算法

`AES`、`DES`、`3DES` 都是 **对称** 的 **块加密算法**，**加解密** 的过程是 **可逆的**。常用的有 `AES128`、`AES192`、`AES256` (默认安装的 `JDK` 尚不支持 `AES256`，需要安装对应的 `jce` 补丁进行升级 `jce1.7`，`jce1.8`)。

#### 4.4.1 DES算法

`DES` 加密算法是一种 **分组密码**，以 `64` 位为 **分组**对数据 **加密**，它的 **密钥长度** 是 `56` 位，**加密解密** 用 **同一算法**。

`DES` 加密算法是对 **密钥** 进行保密，而 **公开算法**，包括加密和解密算法。这样，只有掌握了和发送方 **相同密钥** 的人才能解读由 `DES`加密算法加密的密文数据。因此，破译 `DES` 加密算法实际上就是 **搜索密钥的编码**。对于 `56` 位长度的 **密钥** 来说，如果用 **穷举法** 来进行搜索的话，其运算次数为 `2 ^ 56` 次。

#### 4.4.2 3DES算法

是基于 `DES` 的 **对称算法**，对 **一块数据** 用 **三个不同的密钥** 进行 **三次加密**，强度更高。

#### 4.4.3. AES算法

`AES` 加密算法是密码学中的 **高级加密标准**，该加密算法采用 **对称分组密码体制**，密钥长度的最少支持为 `128` 位、 `192` 位、`256` 位，分组长度 `128` 位，算法应易于各种硬件和软件实现。这种加密算法是美国联邦政府采用的 **区块加密标准**。

`AES` 本身就是为了取代 `DES` 的，`AES` 具有更好的 **安全性**、**效率** 和 **灵活性**。

```java
import net.pocrd.annotation.NotThreadSafe;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;

@NotThreadSafe
public class AesHelper {
    private SecretKeySpec keySpec;
    private IvParameterSpec iv;

    public AesHelper(byte[] aesKey, byte[] iv) {
        if (aesKey == null || aesKey.length < 16 || (iv != null && iv.length < 16)) {
            throw new RuntimeException("错误的初始密钥");
        }
        if (iv == null) {
            iv = Md5Util.compute(aesKey);
        }
        keySpec = new SecretKeySpec(aesKey, "AES");
        this.iv = new IvParameterSpec(iv);
    }

    public AesHelper(byte[] aesKey) {
        if (aesKey == null || aesKey.length < 16) {
            throw new RuntimeException("错误的初始密钥");
        }
        keySpec = new SecretKeySpec(aesKey, "AES");
        this.iv = new IvParameterSpec(Md5Util.compute(aesKey));
    }

    public byte[] encrypt(byte[] data) {
        byte[] result = null;
        Cipher cipher = null;
        try {
            cipher = Cipher.getInstance("AES/CFB/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, iv);
            result = cipher.doFinal(data);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    public byte[] decrypt(byte[] secret) {
        byte[] result = null;
        Cipher cipher = null;
        try {
            cipher = Cipher.getInstance("AES/CFB/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, keySpec, iv);
            result = cipher.doFinal(secret);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    public static byte[] randomKey(int size) {
        byte[] result = null;
        try {
            KeyGenerator gen = KeyGenerator.getInstance("AES");
            gen.init(size, new SecureRandom());
            result = gen.generateKey().getEncoded();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}
```

### 4.5 RSA算法

`RSA` 加密算法是目前最有影响力的 **公钥加密算法**，并且被普遍认为是目前 **最优秀的公钥方案** 之一。`RSA` 是第一个能同时用于 **加密** 和 **数字签名** 的算法，它能够 **抵抗** 到目前为止已知的 **所有密码攻击**，已被 `ISO` 推荐为公钥数据加密标准。

> `RSA` **加密算法** 基于一个十分简单的数论事实：将两个大 **素数** 相乘十分容易，但想要对其乘积进行 **因式分解** 却极其困难，因此可以将 **乘积** 公开作为 **加密密钥**。

```java
import net.pocrd.annotation.NotThreadSafe;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.security.KeyFactory;
import java.security.Security;
import java.security.Signature;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

@NotThreadSafe
public class RsaHelper {
    private static final Logger logger = LoggerFactory.getLogger(RsaHelper.class);
    private RSAPublicKey publicKey;
    private RSAPrivateCrtKey privateKey;

    static {
        Security.addProvider(new BouncyCastleProvider()); //使用bouncycastle作为加密算法实现
    }

    public RsaHelper(String publicKey, String privateKey) {
        this(Base64Util.decode(publicKey), Base64Util.decode(privateKey));
    }

    public RsaHelper(byte[] publicKey, byte[] privateKey) {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            if (publicKey != null && publicKey.length > 0) {
                this.publicKey = (RSAPublicKey)keyFactory.generatePublic(new X509EncodedKeySpec(publicKey));
            }
            if (privateKey != null && privateKey.length > 0) {
                this.privateKey = (RSAPrivateCrtKey)keyFactory.generatePrivate(new PKCS8EncodedKeySpec(privateKey));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public RsaHelper(String publicKey) {
        this(Base64Util.decode(publicKey));
    }

    public RsaHelper(byte[] publicKey) {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            if (publicKey != null && publicKey.length > 0) {
                this.publicKey = (RSAPublicKey)keyFactory.generatePublic(new X509EncodedKeySpec(publicKey));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] encrypt(byte[] content) {
        if (publicKey == null) {
            throw new RuntimeException("public key is null.");
        }

        if (content == null) {
            return null;
        }

        try {
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            int size = publicKey.getModulus().bitLength() / 8 - 11;
            ByteArrayOutputStream baos = new ByteArrayOutputStream((content.length + size - 1) / size * (size + 11));
            int left = 0;
            for (int i = 0; i < content.length; ) {
                left = content.length - i;
                if (left > size) {
                    cipher.update(content, i, size);
                    i += size;
                } else {
                    cipher.update(content, i, left);
                    i += left;
                }
                baos.write(cipher.doFinal());
            }
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] decrypt(byte[] secret) {
        if (privateKey == null) {
            throw new RuntimeException("private key is null.");
        }

        if (secret == null) {
            return null;
        }

        try {
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            int size = privateKey.getModulus().bitLength() / 8;
            ByteArrayOutputStream baos = new ByteArrayOutputStream((secret.length + size - 12) / (size - 11) * size);
            int left = 0;
            for (int i = 0; i < secret.length; ) {
                left = secret.length - i;
                if (left > size) {
                    cipher.update(secret, i, size);
                    i += size;
                } else {
                    cipher.update(secret, i, left);
                    i += left;
                }
                baos.write(cipher.doFinal());
            }
            return baos.toByteArray();
        } catch (Exception e) {
            logger.error("rsa decrypt failed.", e);
        }
        return null;
    }

    public byte[] sign(byte[] content) {
        if (privateKey == null) {
            throw new RuntimeException("private key is null.");
        }
        if (content == null) {
            return null;
        }
        try {
            Signature signature = Signature.getInstance("SHA1WithRSA");
            signature.initSign(privateKey);
            signature.update(content);
            return signature.sign();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean verify(byte[] sign, byte[] content) {
        if (publicKey == null) {
            throw new RuntimeException("public key is null.");
        }
        if (sign == null || content == null) {
            return false;
        }
        try {
            Signature signature = Signature.getInstance("SHA1WithRSA");
            signature.initVerify(publicKey);
            signature.update(content);
            return signature.verify(sign);
        } catch (Exception e) {
            logger.error("rsa verify failed.", e);
        }
        return false;
    }
}
```

### 4.6 ECC算法

`ECC` 也是一种 **非对称加密算法**，主要优势是在某些情况下，它比其他的方法使用 **更小的密钥**，比如 `RSA` 加密算法，提供 **相当的或更高等级** 的安全级别。不过一个缺点是 **加密和解密操作** 的实现比其他机制 **时间长** (相比 `RSA` 算法，该算法对 `CPU` 消耗严重)。

```java
import net.pocrd.annotation.NotThreadSafe;
import org.bouncycastle.jcajce.provider.asymmetric.ec.BCECPrivateKey;
import org.bouncycastle.jcajce.provider.asymmetric.ec.BCECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.security.KeyFactory;
import java.security.Security;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

@NotThreadSafe
public class EccHelper {
    private static final Logger logger = LoggerFactory.getLogger(EccHelper.class);
    private static final int SIZE = 4096;
    private BCECPublicKey  publicKey;
    private BCECPrivateKey privateKey;

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    public EccHelper(String publicKey, String privateKey) {
        this(Base64Util.decode(publicKey), Base64Util.decode(privateKey));
    }

    public EccHelper(byte[] publicKey, byte[] privateKey) {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("EC", "BC");
            if (publicKey != null && publicKey.length > 0) {
                this.publicKey = (BCECPublicKey)keyFactory.generatePublic(new X509EncodedKeySpec(publicKey));
            }
            if (privateKey != null && privateKey.length > 0) {
                this.privateKey = (BCECPrivateKey)keyFactory.generatePrivate(new PKCS8EncodedKeySpec(privateKey));
            }
        } catch (ClassCastException e) {
            throw new RuntimeException("", e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public EccHelper(String publicKey) {
        this(Base64Util.decode(publicKey));
    }

    public EccHelper(byte[] publicKey) {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("EC", "BC");
            if (publicKey != null && publicKey.length > 0) {
                this.publicKey = (BCECPublicKey)keyFactory.generatePublic(new X509EncodedKeySpec(publicKey));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] encrypt(byte[] content) {
        if (publicKey == null) {
            throw new RuntimeException("public key is null.");
        }
        try {
            Cipher cipher = Cipher.getInstance("ECIES", "BC");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            int size = SIZE;
            ByteArrayOutputStream baos = new ByteArrayOutputStream((content.length + size - 1) / size * (size + 45));
            int left = 0;
            for (int i = 0; i < content.length; ) {
                left = content.length - i;
                if (left > size) {
                    cipher.update(content, i, size);
                    i += size;
                } else {
                    cipher.update(content, i, left);
                    i += left;
                }
                baos.write(cipher.doFinal());
            }
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] decrypt(byte[] secret) {
        if (privateKey == null) {
            throw new RuntimeException("private key is null.");
        }
        try {
            Cipher cipher = Cipher.getInstance("ECIES", "BC");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            int size = SIZE + 45;
            ByteArrayOutputStream baos = new ByteArrayOutputStream((secret.length + size + 44) / (size + 45) * size);
            int left = 0;
            for (int i = 0; i < secret.length; ) {
                left = secret.length - i;
                if (left > size) {
                    cipher.update(secret, i, size);
                    i += size;
                } else {
                    cipher.update(secret, i, left);
                    i += left;
                }
                baos.write(cipher.doFinal());
            }
            return baos.toByteArray();
        } catch (Exception e) {
            logger.error("ecc decrypt failed.", e);
        }
        return null;
    }

    public byte[] sign(byte[] content) {
        if (privateKey == null) {
            throw new RuntimeException("private key is null.");
        }
        try {
            Signature signature = Signature.getInstance("SHA1withECDSA", "BC");
            signature.initSign(privateKey);
            signature.update(content);
            return signature.sign();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean verify(byte[] sign, byte[] content) {
        if (publicKey == null) {
            throw new RuntimeException("public key is null.");
        }
        try {
            Signature signature = Signature.getInstance("SHA1withECDSA", "BC");
            signature.initVerify(publicKey);
            signature.update(content);
            return signature.verify(sign);
        } catch (Exception e) {
            logger.error("ecc verify failed.", e);
        }
        return false;
    }
}
```

## 5. 各种加密算法对比

### 5.1 散列算法比较

| 名称  	| 安全性 	| 速度 	|
|-------	|--------	|------	|
| **SHA-1**	| 高     	| 慢   	|
| **MD5**  	| 中     	| 快   	|

### 5.2 对称加密算法比较

| 名称 	| 密钥名称        	| 运行速度 	| 安全性 	| 资源消耗 	|
|------	|-----------------	|----------	|--------	|----------	|
| **DES** 	| 56位            	| 较快     	| 低     	| 中       	|
| **3DES**	| 112位或168位    	| 慢       	| 中     	| 高       	|
| **AES** 	| 128、192、256位 	| 快       	| 高     	| 低       	|

### 5.3 非对称加密算法比较

| 名称 	| 成熟度 	| 安全性 	| 运算速度 	| 资源消耗 	|
|--------	|--------	|--------	|----------	|----------	|
| **RSA** | 高     	| 高     	| 中       	| 中       	|
| **ECC** | 高     	| 高     	| 慢       	| 高       	|

### 5.4 对称算法与非对称加密算法

#### 5.4.1 对称算法

- **密钥管理**：比较难，不适合互联网，一般用于内部系统
- **安全性**：中
- **加密速度**：快好 **几个数量级** (软件加解密速度至少快 `100` 倍，每秒可以加解密数 `M` **比特** 数据)，适合大数据量的加解密处理

#### 5.4.2 非对称算法

- **密钥管理**：密钥容易管理
- **安全性**：高
- **加密速度**：比较慢，适合 **小数据量** 加解密或数据签名

## 小结

本文介绍了 **数字签名**，**加密和解密**，**对称加密和非对称加密**，然后详细介绍了 `MD5`，`SHA-1`，`HMAC`，`DES/AES`，`RSA` 和 `ECC` 这几种加密算法和代码示例。


### 参考文章

- [RSA的公钥和私钥到底哪个才是用来加密和哪个用来解密？](https://www.zhihu.com/question/25912483)
