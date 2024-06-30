---
title: 为VitePress添加评论系统
date: 2024-06-30
---

# 为VitePress添加Giscus评论系统

> VitePress 搭建了这个网站，所以就开始想点骚东西，想弄个评论系统，看看有没有人来骂我，哈哈哈哈 :smile:
> 所以就有了这篇文章。
>
> 研究了一些解决方案，发现 **`giscus` 是最简单而且工作量最少的**，这里要感谢作者。
> 
> 如果你感兴趣，可以跟着步骤一步步来，搭建属于你的 VitePress 评论系统。

## 必须符合的前提条件

::: warning 前提条件
- 该仓库是[公开](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/setting-repository-visibility#making-a-repository-public)的，否则访客将无法查看 discussion
- [giscus app](https://github.com/apps/giscus) 已经安装，否则访客将无法评论和回应
- Discussion 功能[已在你的仓库中启用](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/enabling-or-disabling-github-discussions-for-a-repository)
:::

## 设置 Repo 的 Discussion 模块

1. 打开你的 GitPages 的 Repository

    E.g.: [naico-wang](https://github.com/naico-wang/naico-wang.github.io)

2. 点击菜单栏的 **`Settings`** 按钮

    ![Github Settings](/images/giscus/github-setting.png)

3. 在 **`Features`** 选项卡中勾选 **`Discussions`**

    ![tick-discussion](/images/giscus/tick-discussion.png)

这样 Discussion 模块就开启完毕了。下面来设置Giscus

## 设置 Giscus

1. 在浏览器打开 [https://github.com/apps/giscus](https://github.com/apps/giscus) 然后点击 **`Configure`** 按钮

    ![Add Giscus](/images/giscus/add-giscus.png)

2. 在应用设置页面，Giscus将检查权限，你可以根据你的喜好设置，这里**建议选择你的 GitPages 所在的 Repository **

    ![Giscus Settings](/images/giscus/giscus-settings.png)

3. 打开 [https://giscus.app/](https://giscus.app/)，在页面的 **`Configuration`** 部分，配置你需要的参数。

4. 配置完成后你将得到类似于下面的一段Script，这就是你将嵌入到页面中的代码
    ```javascript
    <script src="https://giscus.app/client.js"
      data-repo="[ENTER REPO HERE]"
      data-repo-id="[ENTER REPO ID HERE]"
      data-category="[ENTER CATEGORY NAME HERE]"
      data-category-id="[ENTER CATEGORY ID HERE]"
      data-mapping="pathname"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="bottom"
      data-theme="preferred_color_scheme"
      data-lang="en"
      crossorigin="anonymous"
      async>
    </script>
    ```

## 设置 VitePress

::: info
**Giscus** 官方提供了JavaScript + WebComponent 的接入方法，也可以实现最终效果，但是我个人还是推荐用 Giscus 官方的npm包
[https://github.com/giscus/giscus-component](https://github.com/giscus/giscus-component)
:::

1. 安装 giscus vue 版本的npm包
  
    ```bash
    npm i @giscus/vue -d
    ```

2. 定义一个自定义的组件来放guscus的 Web Component。

   ::: danger <注意>
   组件中用到的一些属性值，就是上面步骤中在giscus设置页面生成的代码里面以`data-`开头的属性的值，你可以自己试一下具体的效果。

   其实重要的就是 **`repoid`**，**`categoryid`**，一定不能弄错了！
   :::
   
   我的文件路径: **`~/.vitepress/theme/components/GiscusComment.vue`**
    ```javascript
    <script setup>
      import Giscus from '@giscus/vue';
      import { useRoute, useData } from 'vitepress';

      const route = useRoute();
      const { isDark } = useData();
      </script>

      <template>
        <div style="margin-top: 24px">
          <Giscus
            id="comments"
            repo="[YOUR_REPO_NAME]"
            repoid="[YOUR_REPO_ID]"
            category="[YOUR_CATEGORY]"
            categoryid="[YOUR_CATEGORY_ID]"
            mapping="title"
            term="Welcome to giscus!"
            reactionsenabled="0"
            emitmetadata="0"
            inputposition="top"
            loading="lazy"
            lang="zh-CN"
            :theme="isDark ? 'dark' : 'light'"
            :key="route.path"
          />
        </div>
      </template>
    ```

3. 由于 VitePress 提供了很多内容插槽，所以我们可以根据需要来将 Component 塞到你想显示的地方。

    这里我放在了每篇文档的末尾，使用的是 **`doc-after`** 这个插槽。
    
    具体的所有可用插槽的定义，请看VitePress关于`layout-slots`的文档：[https://vitepress.dev/zh/guide/extending-default-theme#layout-slots](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots)

    在 **`~/.vitepress/theme/index.ts`** 文件中，定义在每篇文档的末尾输出giscus组件，示例代码如下：

    ```javascript
    import { h } from 'vue';
    import GiscusComment from './components/GiscusComment.vue';

    export default {
      ...DefaultTheme,
      Layout() {
        return h(DefaultTheme.Layout, null, {
            'doc-after': () => h(GiscusComment),
        });
      },
    }
    ```
4. 大功告成

   ::: details 来看下最终效果图
   ![最终效果](/images/giscus/giscus.png)
   :::

## 参考文档

- [Introducing giscus](https://laymonage.com/posts/giscus)
- [Giscus Documentation](https://giscus.app/zh-CN)
- [VitePress Layout Slots](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots)