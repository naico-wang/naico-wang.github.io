---
title: 一文带你看懂 2024 前端现状
date: 2024-11-06
category: 杂七杂八
---

# 一文带你看懂 2024 前端现状

最近，TSH 发布了一年一度的前端状态调查结果，本文将探讨 2024 年前端的现状。

## 前端框架

过去一年使用过的前端框架：

![image1](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaicicEYSJXgFrTIic0iaNummh3Cb94FF5yN6Y99wgdtm0JYqNIKjgno6iaog/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

过去一年使用过的渲染框架：

![image2](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaicu0XjWADPAsKWLjoQpuaAznNJnIRibfiaRM0rNWb8GBbDaFss5rkOXbA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

当前前端框架现状：

- **React与Next.js的主导地位**：React凭借其强大的社区支持和生态系统，在前端开发中持续占据主导地位。同时，Next.js作为React应用的全栈框架，因其服务端渲染、高效的路由以及对React 19新特性的早期采用，而备受开发者青睐。

- **新兴框架崭露头角**：Astro和SvelteKit作为新兴的渲染框架，正在迅速崛起并受到开发者的高度关注。此外，Qwik和SolidJS也在社区中逐渐崭露头角，这些框架为前端开发提供了与传统React、Vue、Angular不同的方法和思路。

- **开发者对新框架的热情**：许多开发者对学习Svelte表现出了浓厚的兴趣，其次是HTMX和Qwik。然而，对Angular.js和Ember的兴趣却在逐渐下降，这可能表明开发者对这些传统框架的未来发展持观望态度。

## 前端库

过去一年使用过的验证库：

![image3](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7ia7jUeM6EODsCUhFcICjp6Bul5MzXYoicicWyLCicArchzRBbIibGsCNt3cQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

过去一年使用过的日期库：

![image4](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaW7ZWsXNcQe1sVLVAu89htumEO8AibfthPpBHqvHQum4EQ7cxvV38nTw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

过去一年使用过的状态管理库：

![image5](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaMtkDkOU2FCvcNQNictwb4CS3AYXZGmjiaEx5aVw9GibQwBTMD5diaGIpicg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

过去一年使用过的其他库：

![image6](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iadoA9FyjNicNoTic9mZQTGK6em5tm7hUgeCIibFbs78q4w5mFzDGkW7mCA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 数据获取

数据获取领域现状稳定，开发者倾向使用成熟可靠的工具如 TanStack Query、Axios和fetch API，对新库需求不大。

![image7](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaxztiafDW4Ricy3f7aVXkZSqiaIMbL260hxeicaLC7Miatibyh154k2lSmBqw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 微前端

微前端采用率大幅下降，反映了行业趋势转变，部分公司因技术和准备不足而放弃，同时服务器渲染、静态站点生成兴起，模块联邦成新标准，预计2025年微前端领域将因 AI 集成而保持活跃。

![image8](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaTf9Yaw4MwOjibbLdgVdJvJEd7ZWcrrZcq7viafRwhgf0ic4aibTeWNKFbw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 包管理器

NPM主导Node.js包管理器市场，但Yarn和PNPM正稳步增长。Yarn以性能和高级功能受欢迎，PNPM则因高效依赖管理获青睐。新兴Bun虽未正式列入调查，但因性能提升被开发者关注。

![image9](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iabeES0uayia2UvmQvYujg6ibTl11WMGgF0rzJNLYgwsl7C2aYcph2uEOg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## JS运行时

Node.js凭稳定性、丰富生态和社区支持主导前端开发，但面临Bun和Deno等新运行时在速度、兼容性和开发者体验上的竞争，未来这些新运行时可能因性能优化和TypeScript支持而更具吸引力。

![image10](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaw6ucqgicLryA9libkzHtVNCw4UlhVPpKhTLribKSx6ibdGfvwpBogiav8OA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 类型方法

TypeScript使用率增长，超半数开发者视其为网络标准。开发者依赖TypeScript增强开发体验，但类型检查速度成瓶颈。构建工具转向原生代码加速反馈，类型检查或成速度关键。未来，TypeScript 前景光明且注重类型安全。 

![image11](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7ia6D0fBtUWHSrPBOZjzz4S6LPsicvMZ6ZRm9dg9PzWTtuG9cSIWyqtTZQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

TypeScript 现状如何：

![image12](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iazpURBQcSaqmBQCdxibY3wmHSNM2hNgJkdibjq4BM0wIXJCUkwcmOZmFw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 浏览器技术

Fetch API 因其简单易用而迅速成为标准，使用率几乎是存储API的两倍。这推动了开发者更倾向于使用本地存储技术，如IndexedDB和 Service Workers，以提高应用加载速度和用户体验。尽管渐进式Web应用（PWA）的概念很有前景，但在功能完善方面还有很长的路要走，尤其是文件系统访问API，目前只支持Chromium内核浏览器。

![image13](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaan86fFpxicMtkMDtOJtaFicGpCVAEcWk8WzQSUWxwJoXUcmepd5xmvCQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## UI组件库

在UI框架方面，shadcn/ui以28.1%的使用率领先，结合Tailwind、Radix和React，通过直接复制实现文件到项目来自定义。MUI第二，以可访问性、主题性和高定制性著称，解决了与NextJS的兼容问题。Bootstrap虽源于Web 2.0，但生态系统庞大，与React集成良好。Ant Design以7.3%的使用率排第五，为企业提供轻量级MUI替代品。

![image14](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaDKtiag7tVzMnUZHq1eVZPuVmVQJfBRuwssRlMD7S9VkNf0n10Ojhe1w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 样式工具

纯 CSS 最受欢迎，74.8%受访者爱用，且正取代部分JS任务。Sass/SCSS使用率为71.8%，因功能和预处理能力受开发者喜爱。Tailwind CSS实用主义方法获66.7%认可，尤其与React和Next.js契合。CSS Modules和Styled Components使用率分别为56.7%和42.9%，因作用域化样式和组件架构集成受青睐。

![image15](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaFfonjvIEuYDoEjxcS6jPChafgb17nrPnsPlUuvHKyZ2LVGbfrU0tlg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 测试

![image16](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaf7xia7Y2kkhnz1NoTz9MyNgXOXYzmPdbMp1qBOusOUk5u8PdAO9BhPA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

![image17](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iadwV7LWrjSdwDlxRQYiaosU434A9ZHyYdnQj8DibPxictsqoqcGDLFkYRw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

过去一年使用的测试工具：

![image17](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7ia1ticiceXHwUiaTicfh2p8eFA1PrJHcLZAPDYueib7epwpJg0gEPX9tpV5eg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

大多数测试由开发者或与QA团队合作完成，这加快了开发速度并提供了可靠反馈。虽然77%的受访者进行了测试，但主要集中于单元测试，不过端到端和集成测试也很重要。Jest和Cypress是热门工具，但Vitest和Playwright作为新工具越来越受欢迎，特别是Vitest 随着 Vite 的兴起而越来越流行，Playwright则因性能优越和设置简化获青睐。

## 代码编辑器

前端开发者最爱用 Visual Studio Code，占75.1%，它免费且扩展丰富。JWebStorm 排第二，专为前端设计，稳定可靠，目前个人版已免费开放。另外，AI驱动编辑器正在崛起，Cursor 利用新大语言模型，虽目前用户不多，但潜力巨大。VS Code 也在加强AI功能，编辑器大战一触即发。

![image18](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iasBhz63eXlc0xWvNhiaxtXyIu1ichcQQD7NEia3VLzx1cZogErrDqAACuQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 构建工具

Vite 因速度快、启动快、配置少，受开发者欢迎，满意度高达82.4%，成Webpack替代品。Webpack使用率相近，但用户反馈分化，44%满意，38.5%烦恼其复杂配置。Create React App接受度不一，不再适合生产环境，官方推荐Next.js、Remix或Gatsby等框架。

![image19](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iazSdylcUAR8hJNuwRoRNqGlscSXCNfic8QdtDAKuQmliaC7onzh0ZP8ow/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 代码检查

在linting工具方面，ESLint和Prettier继续占据主导地位，Stylelint 则展现出增长潜力。

![image20](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaLSzrGOU38Cs0ib7zjXZ2w9Ia0kufrKDuqmBT2GzFPMCIIlWu1M0NOVQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 操作系统

主要使用的操作系统：

![image21](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iafguJOP3V92nZaH51zREwgQrXxibRhGTq3dU5FsYhmnjPO4UTb2FUjnQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## AI 工具

过去一年使用的 AI 工具：

![image22](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaOEWfDmSrVj4LNhZT9TSBFE0ibWGxOv7kTzjzaxvl0IgRpQt2nAtPtng/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

在开发中使用 AI 的用途：

![image23](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iahyFjyxstWbjDRo9pbXol5oiaeoZxwmkQ3X6XicONBFyaWUicAhXG2rw9A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

对 AI 的态度：

![image24](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7ia3VhOxnmnUicyVpOI2zbMO1j2JS5tIRWzjvbna3BdiczZxqicVEtFtfEYw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

开发者对 AI 的态度由忧转喜，75.8% 认为 AI 将提升工作效率，而不会替代前端开发者。ChatGPT和GitHub Copilot等AI工具广受欢迎，助力编码与问题解决。未来，AI在软件中将更普及，改变我们的工作方式。尽管有挑战，但整合AI是必然趋势。

## 未来趋势

![image25](https://mmbiz.qpic.cn/sz_mmbiz_png/EO58xpw5UMPASgibyuu7FG6XHctk4vic7iaUIkjV0rBCjlW2RhLaaCMxjSeuIFEaF25vFJQvyogkkv7rlx026YvGA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 参考

前端现状调查结果：https://tsh.io/state-of-frontend/
