---
title: 禁止用户调试你的页面
date: 2024-09-22
category: JavaScript
---

# 如何禁止用户调试你的页面？

在前端开发中，大家都想在production环境不让别人调试你的代码，那究竟要怎么做呢？这里有几个方法...

::: danger
注意：**生产模式** 才需要禁止调试！！！
:::

## 定时器 + debugger

当你打开调试面板的时候，代码里的 `debugger` 断点会进行执行，阻塞你的代码执行

当使用 `定时器` + `debugger` 会让调试者一直跳不出断点，从而起到禁止调试代码的作用

![定时器+debugger](https://mmbiz.qpic.cn/mmbiz_png/TZL4BdZpLdhGFUEicr0nS8jxpRCOnusDfWqzr1f5QhFJCicTLwPVdkKUQlQ5LEUmHGaFMWjPC4m1lQ2LdFeSw6iaw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

![debugger gif](https://mmbiz.qpic.cn/mmbiz_gif/TZL4BdZpLdhGFUEicr0nS8jxpRCOnusDfKg7dxG9zeP61MPo3RrTsHmLfaU2ONBg1CxpcnbalfTIp7rISQGeibRA/640?wx_fmt=gif&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

### 破解方法 + 应对方法

但是这种方式是能破解的

- 方法一：Activate breakpoints
    ![image](https://mmbiz.qpic.cn/mmbiz_gif/TZL4BdZpLdhGFUEicr0nS8jxpRCOnusDfCMxoymVeTdzmBcPfTzGibMn4ib1ib2dImkCbT6jID5npX3z7nOhKAnp1Q/640?wx_fmt=gif&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

    但是如果这样的话，那么调试者无意是饮鸩止渴，因为你都把调试关了，那你还怎么调试呢？

- 方法二：Add logpoint
   ![image2](https://mmbiz.qpic.cn/mmbiz_gif/TZL4BdZpLdhGFUEicr0nS8jxpRCOnusDflud9Hiap5hwAgFNibS2XD3Y1MkXasdGtK0SgqK7NDUwn8gTSkaoFONiaQ/640?wx_fmt=gif&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

   对于这个方式的话，其实也好解决，只需要通过打包工具代码压缩，把代码都放在一行即可

   ![image3](https://mmbiz.qpic.cn/mmbiz_png/TZL4BdZpLdhGFUEicr0nS8jxpRCOnusDfoRPFnIaiaPhw2XuFDr9pjP7z8b9zZnWEBwE3au9zPTLiaQt6ib0UawXyw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

   ![image4](https://mmbiz.qpic.cn/mmbiz_gif/TZL4BdZpLdhGFUEicr0nS8jxpRCOnusDfOxrcqpLnfyfbnTsI0ib6EgygDvCiaZLoBs7uaqcbGbrSl61icdibeYhutQ/640?wx_fmt=gif&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)
