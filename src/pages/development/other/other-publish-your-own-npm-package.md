---
title: 教你如何发布自己的npm包
date: 2024-07-18
tag: 杂七杂八
category: 杂七杂八
abstract: npm包相信大家都用了很多了，下面我来教大家如何发布一个自己的npm package.
---

# 一步一步构建发布一个基于 `TypeScript` 的 `NPM Package`

昨天突发奇想，做了个关于在控制台能输出不同颜色的信息的小function组件。然后想到我可以发布到npm上供大家使用。所以就发布到了npm上面去。大家可以在这里找到：

> [weapp-colourful-console](https://www.npmjs.com/package/weapp-colorful-console)

发布完了以后顺手写了这篇文档，希望能让大家少走弯路。

:::danger 注意啦！！！
我为了图方便，并没有加入单元测试，这是很不好的行为。大家不要学我，我纯粹是因为懒...
:::

## 准备工作

整个包使用了 `TypeScript` + `TSLint` + `Prettier`

首先确定你电脑安装了 `Node` 和 `NPM` 环境，这里我使用的是nvm作为node的版本管理软件。
这个大家萝卜青菜，自行选择。

安装好之后运行下面的命令确保安装成功

```shell
node -v // v20.15.1
npm -v // 10.7.0
```

安装好 `node+npm` 的环境之后，为你的npm package起一个名字。

:::info 注意
npm package 的名字必须是 `pascal-case` 并且全部小写。
因为 NPM 上有 700k+ 的包，所以你需要在构建之前先去 `www.npmjs.com` 查询你的包名有没有被使用。
:::

这里我使用的包名字是 `weapp-colourful-console`，你可以用以下的命令来查看你的名字是不是被占用了：

```shell
npm search package-name
```

## 基本构建

- 选择一个合适的名字

  ```shell
  mkdir weapp-colourful-console && cd weapp-colourful-console
  ```

- 新建 `.gitignore` 文件并写入 `node_modules`，新建 `README` 文件。

  ```shell
  echo "node_modules" >> .gitignore
  echo "# WeChat Colorful Console" >> README.md
  ```

- Git 初始化包并关联远程仓库。下面 Git Repository Url 是远程仓库的 Url

  ```shell
  git init
  git add . && git commit -m "Initial commit"
  git remote add origin <Git Repository Url>
  git push -u origin master
  ```

- NPM 初始化包，后续我们会修改生成的 `package.json`。
  
  ```shell
  npm init -y
  ```

至此，一个可以发布到npm的仓库就创建完成了。

## 添加 `TypeScript` 作为 `devDependencies`

- 下载 TypeScript, 下载完后，在根目录下多了 `node_modules` 文件夹和 `package-lock.json` 文件。

  ```shell
  npm install typescript -d
  ```

- 为了编译 TypeScript，我们需要一个配置文件，在根目录下新建 `tsconfig.json`，内容如下。

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "declaration": true,
    "outDir": "./lib",
    "strict": true,
    "lib": ["es6", "dom"],
    "moduleResolution": "Node"
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/__tests__/*"]
}
```

> 字段解释:
>
> - **target**：编译之后生成的 JavaScript 文件需要遵循的标准，可选值："ES3"（默认），"ES5"，"ES6"/"ES2015"，"ES2016"，"ES2017"或"ESNext"。我们选择了 es5 为了使包具有更好的浏览器兼容性。
> - **module**：指定生成哪个模块系统代码，默认值：target === "ES3" or "ES5" ? "CommonJS" : "ES6"。
> - **declaration**：是否生成对应的声明文件，默认值：false。在构建包时，应该设置为 true，这样 TypeScript 会将生成的声明文件和对应编译后的 JavaScript 代码一起导出，以便包可以在 TypeScript 和 JavaScript 项目中同时使用。本项目中生成的声明文件是 /lib/index.d.ts。
> - **outDir**：指定输出目录。编译后的 JavaScript 代码会在与 tsconfig.json 同级的 lib 文件夹中。
> - **strict**：是否启用所有严格类型检查选项，默认值：false。
> - **lib**：编译需要的库文件，例如你指定的 target 是 ES5，但是在代码中使用了 ES6 特性，就需要在 lib 中加上 ES6。默认值：如果 lib 没有指定默认注入的库的列表，默认注入的库为：
> - **target ES5**：DOM，ES5，ScriptHost。
> - **target ES6**：DOM，ES6，DOM.Iterable，ScriptHost。
> - **include**：指定要编译的目录。
> - **exclude**：指定不编译的目录。node_modules 和 __tests__ 只是在开发阶段使用，构建阶段无需编译。
>
> 更多详细的配置请参考这里：https://www.typescriptlang.org/docs/handbook/compiler-options.html

- 创建 `src` 文件夹，在其下新建一个 `index.ts`，把你要发布的包的内容放进去，这里源码我就不加了。

- 在 `package.json` 中添加 `build script`。

  ```shell
  "build": "tsc"
  ```
  
  然后在控制台运行一下 `npm run build`，你会看到多出了一个 `lib`文件夹，这个就是我们要发布到 npm 的源文件。

- 更新 `.gitignore` 文件，将不需要跟踪的文件添加到这个文件夹：

```json
# webstorm
.idea
# Node Modules
node_modules
lib
```

## Code Formatting 和 Linting

- 下载 `prettier` `tslint` `tslint-config-prettier`。和 `TypeScript` 一样，它们只是在包开发阶段所需的工具，所以是 devDependencies。

  ```shell
  npm install -d prettier tslint tslint-config-prettier
  ```

- 在根目录下，新建 `tslint.json`，添加如下内容：

  ```json
  {
    "extends": ["tslint:recommended", "tslint-config-prettier"],
    "rules": {
      "no-console": false
    }
  }
  ```

- 在根目录下，新建 `.prettierrc`，添加如下内容：

  ```json
  {
    "printWidth": 120,
    "trailingComma": "all",
    "singleQuote": true
  }
  ```

- 最后，在 `package.json` 中添加 `lint` 和 `format` 相关的script。

  ```json
  "format": "prettier --write \"src/**/*.ts\" \"src/**/*.js\"",
  "lint": "tslint -p tsconfig.json"
  ```

- 在控制台运行 **npm run lint** / **npm run format**

- 移除不必要的文件，在 `package.json` 中设置文件白名单。

  ```json
  "files": ["lib/**/*"]
  ```

## 设置 npm 使用的脚本

一个好的包应该尽可能自动化。
接下来，我们来看看 NPM 中其他的 scripts, 注意，这些 script 都是添加在 package.json 文件中的 “script” 中。

- `prepare`

  会在打包和发布包之前以及本地 npm install （不带任何参数）时运行。

  ```shell
  "prepare": "npm run build"
  ```

- `prepublishOnly`

  在 `prepare script` 之前运行，并且仅在 `npm publish` 运行。在这里，我们可以运行 `npm run test & npm run lint` 以确保我们不会发布错误的不规范的代码。

  ```shell
  "prepublishOnly": "npm run lint"
  ```

- `perversion`

  在发布新版本包之前运行，为了更加确保新版本包的代码规范，我们可以在此运行 npm run lint。

  ```shell
  "preversion": "npm run lint"
  ```

- `version`

  在发布新版本包之后运行。如果您的包有关联远程 `Git` 仓库，像我们的情况一样，每次发布新版本时都会生成一个提交和一个新的版本标记，那么就可以在此添加规范代码的命令。又因为 `version script` 在 `git commit` 之前运行，所以还可以在此添加 `git add`。

  ```shell
  "version": "npm run format && git add -A src"
  ```

- `postversion`

  在发布新版本包之后运行，在 `git commit` 之后运行，所以非常适合推送。

  ```shell
  "postversion": "git push && git push --tags"
  ```

到此为止，所有的改动都已经完成，现在可以编译发布我们的 npm package 了。

## 发布到 npm 

在发布之前，如果你没有 NPM 账号的话，必须先注册一个。你可以在 www.npmjs.com/signup 上注册或者通过运行 npm adduser 注册。如果你已经有账号了，运行 npm login 登陆你的 NPM 账号。

```shell
npm login
```

登录完之后，执行发布命令：

```shell
npm publish

> weapp-colorful-console@0.0.4 prepare
> npm run build


> weapp-colorful-console@0.0.4 build
> tsc

npm notice
npm notice 📦  weapp-colorful-console@0.0.4
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 861B README.md
npm notice 467B lib/index.d.ts
npm notice 1.7kB lib/index.js
npm notice 1.1kB package.json
npm notice 1.7kB src/index.ts
npm notice Tarball Details
npm notice name: weapp-colorful-console
npm notice version: 0.0.4
npm notice filename: weapp-colorful-console-0.0.4.tgz
npm notice package size: 2.5 kB
npm notice unpacked size: 6.8 kB
npm notice shasum: 6e95e21498264dd627dda568f1f684e9ece8bdf9
npm notice integrity: sha512-5fqNhXFOyflvc[...]9RMIBKdFX4UVw==
npm notice total files: 6
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and default access
+ weapp-colorful-console@0.0.4
```

到此为止，你的第一个 npm package 已经发布完毕了。

## 查看你的包

现在，你可以到npm上面去看看你发布的包了，地址：[https://www.npmjs.com/](https://www.npmjs.com/)，打开然后搜索你的包名字就可以了。

比如我的包地址在这里：https://www.npmjs.com/package/weapp-colorful-console


## 创建一个新版本

当你有东西要更新，想要发布一个新版本的时候，你可以执行以下命令：

```shell
npm version patch
```

这个命令会创建一个新版本， `preversion`，`version`，`postversion` scripts 会被执行，创建一个新的 `tag` 并且推送到我们的远程仓库。

然后可以再发布一次，新版本就更新上去了。

```shell
npm publish
```

## 总结

这篇文章只是抛砖引玉，发布了一个只有单文件的Javascript类库，在此基础上，你可以发布更为复杂的npm package，来满足自己的需求。
欢迎各路大神指正。
