---
title: 打造一个好用的MacOS开发环境
date: 2024-07-19
---

# 打造一个好用的MacOS开发环境

本篇文章我会把一步一步打造我自己喜欢的 MacOS 开发环境的过程记录下来，换电脑或者重装系统的时候可以参考。

> 很多软件只是我认为好用，大家可以自行寻找自己喜欢的。记录下来是用在下次换电脑或者安装新电脑的时候便于查阅，一步到位。

## Terminal 工具

关于MacOS上面的Terminal工具，大家见仁见智，很多推荐，我就不一一列举了。我只推荐两个我用的比较顺手的，我是两个都安装了的。

### 1. iTerm2

> **What is iTerm2?**
>
> iTerm2 is a replacement for Terminal and the successor to iTerm. It works on Macs with macOS 10.14 or newer. iTerm2 brings the terminal into the modern age with features you never knew you always wanted.

下载地址：https://iterm2.com/downloads.html

主要有点有用起来顺手，主题配色也比较多，然后SSH能一步到位，一秒链接。

更多的使用技巧和主题下载，请自行Google。强烈推荐。

### 2. Warp

Warp是一款基于Rust开发的命令行工具软件，据说Google也投资了，而且与AI深度集成，实用性，速度方面都还可以。
个人感觉还是不如iTerm2功能那么多，但是也在慢慢成熟中，我日常也会一直使用

下载地址：https://www.warp.dev/

### 3. oh-my-zsh

严格来说， `oh-my-zsh` 并不能算是终端工具，只能算是Zsh的一个配置管理工具，但是挺好用的。
一个漂亮好用的终端应该是每个程序员装逼的利器。

具体的配置，相应的主题，在社区里面还是有很多自愿的。能够定制出很多不同的样式。再搭配一些神级插件，效率爆棚。

下载地址：https://ohmyz.sh/

:::info 推荐：
推荐使用 `Powerlevel10k` 这个主题，酷炫到底，并且搭配NerdFonts使用哦。

- https://github.com/romkatv/powerlevel10k
- https://www.nerdfonts.com/
:::

放一张我现在用的终端工具配置好之后的截图，感觉很舒服。

![my-terminal.png](/images/terminal.png)

## IDE 开发工具

关于IDE，其实没什么好说的，`VSCode` 一统天下了。最大的优点就是免费，然后社区活跃用户多，插件也很多，你能用到的开发语言都能完美支持。

下载地址：https://code.visualstudio.com/

推荐插件：

- **Atom Material Icons**（文件和文件夹的图标）
- **CodeSnap**（巨好用的代码片段美化工具，自行阅读它的readme，裂墙推荐）
- **ESLint**（不多说了，前端人都用的）
- **Github Actions**（用来跟踪和查看Github的Actions，比如deployment成功与否）
- **GitLens**（好用的版本历史查看工具）
- **Markdown All in One**（Markdown支持）
- **One Dark Pro**（一款好看的主题，我用到现在）
- **PlantUML**（描述式生成序列图）
- **Stylelint**（懂得都懂）
- **Prettier**（格式化代码神器）

:::info 注意
我并没有把语言相关的插件列出来，如果你用 `React` 或者 `Vue` 或者 `Nodejs` 或者 `巴拉巴拉`，自行添加相应的插件。没有你找不到的插件。
:::


BTW，我同时购买了 `WebStorm` 的授权，属于用习惯了不肯撒手不肯改变的这种。

WebStorm相关介绍就不赘述了，我是从接触前端开发就一直用，用的也算顺手，快捷键之类的，加上强大的IDE集成性能，各种工具应有尽有，用着挺舒心。
唯一的缺点就是一个，贵。

下载地址：https://www.jetbrains.com/webstorm/

> 如果你是学生，可以用免费的学生版。如果是正儿八经的工作人员，自行去搜索怎么样能少花钱。原价一年毛500块，是有点割韭菜了。我当时买的时候一年135，现在不忍直视。
> 而且工作人员巨牛逼，发邮件都是横横的，我们好用，我们没优惠，你爱用不用。我已经准备转战 `VsCode` 了，不想继续当韭菜。

:::danger 提示：
其他开发工具什么的我在这里就不多说了，XCode，POSTMAN，Docker，数据库相关的，还有很多，这个就大家自行按照自己的需求安装好了。
:::

## 一些好用的软件

1. **为知笔记** / **Notion** / **Obsidian**

    为知笔记属于国内做笔记做的比较好的，尤其是打开速度。我也挺喜欢Notion的，但是加载速度真的是一天世界。这个大家自行选择。

    - https://www.wiz.cn/wiznew.html
    - https://www.notion.so/
    - https://obsidian.md/

2. **Tencent Lemon** / **Clean My Mac**

    腾讯柠檬是一款还不错的系统辅助软件，如果你是从 `windows` 系统转投 `MacOS` 的，你一定会喜欢，定时清理一下系统垃圾之类的，对吧。
    
    其实我同时也当过韭菜买过 `Clean My Mac` 这个软件，结果有一次优化过分了，直接系统崩溃了，从此不再用。而且之前是一次性买断 license的，现在好像是订阅制了，在割韭菜的路上越走越远了。

3. **Magnet**

    一款好用的分屏工具，在 App Store 就能下载。还有其他替代品，可以自行搜索。

## 前端开发环境搭建

这里我就列出我常用的了。作为参考：

-  nvm
   - https://github.com/nvm-sh/nvm
- pnpm
   - https://pnpm.io/installation
- vite
   - https://vitejs.dev/guide/
- Webpack
   - https://webpack.js.org/concepts/
- Golang
   - https://go.dev/
- Nextjs
   - https://nextjs.org/docs
- Nestjs
   - https://docs.nestjs.com/


## 总结

这篇文章主要是用来当我重装系统的时候一步到位的安装常用的软件，同时给大家提供一些参考。
