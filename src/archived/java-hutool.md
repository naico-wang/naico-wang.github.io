---
title: 不要再封装各种 Util 工具类了，这个神级框架值得拥有！
date: 2024-08-27
abstract: 今天给大家推荐一个非常好用的Java工具类库，企业级常用工具类，基本都有，能避免重复造轮子及节省大量的开发时间，非常不错，值得大家去了解使用。
---

# 不要再封装各种 Util 工具类了，这个神级框架值得拥有！

**Hutool** 谐音 “糊涂”，寓意追求 “万事都作糊涂观，无所谓失，无所谓得” 的境界。

**Hutool** 是一个 Java 工具包，也只是一个工具包，它帮助我们简化每一行代码，减少每一个方法，让 Java 语言也可以 “甜甜的”。Hutool 最初是我项目中 “util” 包的一个整理，后来慢慢积累并加入更多非业务相关功能，并广泛学习其它开源项目精髓，经过自己整理修改，最终形成丰富的开源工具集。

## 功能

一个 Java 基础工具类，对文件、流、加密解密、转码、正则、线程、XML 等 JDK 方法进行封装，组成各种 Util 工具类，同时提供以下组件：

- tool-aop JDK 动态代理封装，提供非 IOC 下的切面支持 
- hutool-bloomFilter 布隆过滤，提供一些 Hash 算法的布隆过滤
- hutool-cache 缓存
- hutool-core 核心，包括 Bean 操作、日期、各种 Util 等
- hutool-cron 定时任务模块，提供类 Crontab 表达式的定时任务
- hutool-crypto 加密解密模块
- hutool-db JDBC 封装后的数据操作，基于 ActiveRecord 思想
- hutool-dfa 基于 DFA 模型的多关键字查找
- hutool-extra 扩展模块，对第三方封装（模板引擎、邮件等）
- hutool-http 基于 HttpUrlConnection 的 Http 客户端封装
- hutool-log 自动识别日志实现的日志门面
- hutool-script 脚本执行封装，例如 Javascript
- hutool-setting 功能更强大的 Setting 配置文件和 Properties 封装
- hutool-system 系统参数调用封装（JVM 信息等）
- hutool-json JSON 实现
- hutool-captcha 图片验证码实现

## 安装

maven项目在pom.xml添加以下依赖即可：

```xml
<dependency>
  <groupId>cn.hutool</groupId>
  <artifactId>hutool-all</artifactId>
  <version>${hutool.version}</version>
</dependency>
```

## 常用工具类

### DateUtil

日期时间工具类，定义了一些常用的日期时间操作方法。

```java
//Date、long、Calendar之间的相互转换
//当前时间
Date date = DateUtil.date();
//Calendar转Date
date = DateUtil.date(Calendar.getInstance());
//时间戳转Date
date = DateUtil.date(System.currentTimeMillis());
//自动识别格式转换
String dateStr = "2017-03-01";
date = DateUtil.parse(dateStr);
//自定义格式化转换
date = DateUtil.parse(dateStr, "yyyy-MM-dd");
//格式化输出日期
String format = DateUtil.format(date, "yyyy-MM-dd");
//获得年的部分
int year = DateUtil.year(date);
//获得月份，从0开始计数
int month = DateUtil.month(date);
//获取某天的开始、结束时间
Date beginOfDay = DateUtil.beginOfDay(date);
Date endOfDay = DateUtil.endOfDay(date);
//计算偏移后的日期时间
Date newDate = DateUtil.offset(date, DateField.DAY_OF_MONTH, 2);
//计算日期时间之间的偏移量
long betweenDay = DateUtil.between(date, newDate, DateUnit.DAY);
```

### StrUtil

字符串工具类，定义了一些常用的字符串操作方法。

```java
//判断是否为空字符串
String str = "test";
StrUtil.isEmpty(str);
StrUtil.isNotEmpty(str);
//去除字符串的前后缀
StrUtil.removeSuffix("a.jpg", ".jpg");
StrUtil.removePrefix("a.jpg", "a.");
//格式化字符串
String template = "这只是个占位符:{}";
String str2 = StrUtil.format(template, "我是占位符");
LOGGER.info("/strUtil format:{}", str2);
```

### NumberUtil

数字处理工具类，可用于各种类型数字的加减乘除操作及判断类型。

```java
double n1 = 1.234;
double n2 = 1.234;
double result;
//对float、double、BigDecimal做加减乘除操作
result = NumberUtil.add(n1, n2);
result = NumberUtil.sub(n1, n2);
result = NumberUtil.mul(n1, n2);
result = NumberUtil.div(n1, n2);
//保留两位小数
BigDecimal roundNum = NumberUtil.round(n1, 2);
String n3 = "1.234";
//判断是否为数字、整数、浮点数
NumberUtil.isNumber(n3);
NumberUtil.isInteger(n3);
NumberUtil.isDouble(n3);
BeanUtil
JavaBean的工具类，可用于Map与JavaBean对象的互相转换以及对象属性的拷贝。

PmsBrand brand = new PmsBrand();
brand.setId(1L);
brand.setName("小米");
brand.setShowStatus(0);
//Bean转Map
Map<String, Object> map = BeanUtil.beanToMap(brand);
LOGGER.info("beanUtil bean to map:{}", map);
//Map转Bean
PmsBrand mapBrand = BeanUtil.mapToBean(map, PmsBrand.class, false);
LOGGER.info("beanUtil map to bean:{}", mapBrand);
//Bean属性拷贝
PmsBrand copyBrand = new PmsBrand();
BeanUtil.copyProperties(brand, copyBrand);
LOGGER.info("beanUtil copy properties:{}", copyBrand);
```

### MapUtil

Map操作工具类，可用于创建Map对象及判断Map是否为空。

```java
//将多个键值对加入到Map中
Map<Object, Object> map = MapUtil.of(new String[][]{
    {"key1", "value1"},
    {"key2", "value2"},
    {"key3", "value3"}
});
//判断Map是否为空
MapUtil.isEmpty(map);
MapUtil.isNotEmpty(map);
AnnotationUtil
注解工具类，可用于获取注解与注解中指定的值。

//获取指定类、方法、字段、构造器上的注解列表
Annotation[] annotationList = AnnotationUtil.getAnnotations(HutoolController.class, false);
LOGGER.info("annotationUtil annotations:{}", annotationList);
//获取指定类型注解
Api api = AnnotationUtil.getAnnotation(HutoolController.class, Api.class);
LOGGER.info("annotationUtil api value:{}", api.description());
//获取指定类型注解的值
Object annotationValue = AnnotationUtil.getAnnotationValue(HutoolController.class, RequestMapping.class);
```

### SecureUtil

加密解密工具类，可用于MD5加密。

```java
//MD5加密
String str = "123456";
String md5Str = SecureUtil.md5(str);
LOGGER.info("secureUtil md5:{}", md5Str);
```

### CaptchaUtil

验证码工具类，可用于生成图形验证码。

```java
//生成验证码图片
LineCaptcha lineCaptcha = CaptchaUtil.createLineCaptcha(200, 100);
try {
    request.getSession().setAttribute("CAPTCHA_KEY", lineCaptcha.getCode());
    response.setContentType("image/png");//告诉浏览器输出内容为图片
    response.setHeader("Pragma", "No-cache");//禁止浏览器缓存
    response.setHeader("Cache-Control", "no-cache");
    response.setDateHeader("Expire", 0);
    lineCaptcha.write(response.getOutputStream());
} catch (IOException e) {
    e.printStackTrace();
}
```

## 更多工具类

Hutool中的工具类很多，可以参考官网：https://www.hutool.cn/

当然，还有很多其他非常方便的方法，留着你自己去测试吧！使用Hutool工具，可以大大提高你的开发效率！