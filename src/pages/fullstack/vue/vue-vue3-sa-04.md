---
title: 阅读Vue3源码 - Spec语法
date: 2024-08-14
category: Vue源码与进阶
---

# 阅读Vue3源码 - Spec语法

对于基础类库来说，保证其质量和稳定性是最重要的。开源工具的架构设计中，lodash、vue、react、ant-design，无一例外其中都包含了大量的前端自动化测试内容，用来保证类库的稳定性。

再从研发的整个过程来看测试集成，**测试环节是保证持续集成和交付的关键**。

## 测试集成

借用经典的软件开发测试模型--V-Model模型来说明，对测试集成的分类可以分为**单元测试**、**集成测试**、**冒烟测试**、**验收测试**4个环节。通过CI/CD流水线，其中的一些测试方式可以集成到其中。

### 单元测试

**单元测试**（`Unit Test`），属于对编码实现细节的测试，把模块、组件或者函数作为一个单元编写测试用例，来对功能做验证。单测的用例代码和模块的源码放在一起，随着模块的编译构建一起执行。

前端开发中经常见到的 `jest`、`mocha`都属于单元测试库。

### 集成测试

**集成测试**（`Integration Test`），属于泛指系统的功能性测试，确保了系统的所有单元可以按照预期的功能运行。把相关的组件、模块集成在 Web页面中进行统一测试，通常和端到端的一起进行。一般在模块编译构建结束后执行。集成测试关注的是产品的单独一块功能，端到端测试关注的是产品功能之前的使用链路和数据流向。

集成测试也可以用单测库进行。前端常用的端到端类库有`PhantomJS`，`casperJs`，`puppeteer`。

### 系统测试

**系统测试**（`System Test`），属于对业务系统兼容性、性能、回归、可伸缩性、安全性等方面（web应用中可能还包括网络服务、IO、物理机CPU占用、内存消耗等等）的测试。通常需要配合使用一些GUI工具进行测试，一般在做系统功能测试时同步进行。

### 验收测试

**验收测试**（`Acceptance Test`），指从一个从用户的角度出发执行的测试，因此称为验收测试。这种测试在将软件交付给客户（即生产环境）之前执行。

## 单元测试

上面已经介绍了单元测试的定义，关于单元测试有几个概念需要了解下。

**测试用例**是组成单元测试模块的最小结构，也就是说把测试用例放到一个测试模块里，就是一个完整的单元测试。

**断言**是测试用例中最核心的部分，比如nodejs中的 `assert` 模块，如果当前程序的某种状态符合 `assert` 的期望此程序才能正常执行，否则直接退出应用。

> **断言是单元测试框架中核心的部分，断言失败会导致测试不通过，或报告错误信息。**

对于常见的断言，举一些例子如下：

- 同等性断言 `Equality Asserts`
  - expect(sth).toEqual(value)
  - expect(sth).not.toEqual(value)

- 比较性断言 `Comparison Asserts`
  - expect(sth).toBeGreaterThan(number)
  - expect(sth).toBeLessThanOrEqual(number)

- 类型性断言 `Type Asserts`
  - expect(sth).toBeInstanceOf(Class)

- 条件性测试 `Condition Test`
  - expect(sth).toBeTruthy()
  - expect(sth).toBeFalsy()
  - expect(sth).toBeDefined()

用一个函数来说明：

```javascript
// 待测试函数 multiple
 
function multiple(a, b) {
  let result = 0;
  for (let i = 0; i < b; ++i)
      result += a;
  return result;
}
 
// 断言
const assert = require('assert');
assert.equal(multiple(1, 2), 2);
```

但是nodejs 自带的 assert 模块只能满足一些简单场景的需要，而且提供的错误信息提示不太友好，其次输出的内容是程序的错误报告，而不是一个单元测试报告，所以在做单元测时需要专业的断言库提供测试报告，这样才能看到有哪些断言通过没通过。

### 断言库

断言库主要提供上述断言的语义化方法，用于对参与测试的值做各种各样的判断。这些语义化方法会返回测试的结果，要么成功、要么失败。常见的断言库有 Should.js, Chai.js 等。

## 测试工具

首先要明确一点，所有的单元测试要在不同的环境下执行就要打不同环境对应的包，所以在搭建测试工具链时要确定自己运行在什么环境中，如果在 `Node` 中只需要加一层 `babel` 转换，如果是在真实浏览器中，则需要增加 `webpack` 处理步骤。

### mocha

`mocha` 是一个经典的测试框架，它提供了一个单元测试的骨架，可以将不同子功能分成多个文件进行测试，最后生成一份结构型的测试报告。karma是一个测试执行过程管理工具，可以watch文件更新。

- Node 环境下测试 : `mocha` + `chai` + `babel`
- 浏览器环境测试 : `karma` + `mocha` + `chai` + `webpack` + `babel` + `jsdom`

但是mocha配置起来比较繁琐，还有一些额外的工具例如单元覆盖率（`istanbul`），函数模拟 (`sinon.js`）等辅助工具，选型的成本比较高。

### jasmine

`jasmine` 也是一个常用的测试框架，里面包含了 测试流程框架，断言函数，mock工具等测试中会遇到的工具。可以近似地看作 **`jasmine` = `mocha` + `chai` + `辅助工具`**。

- Node 环境下测试 : `Jasmine` + `babel`
- 浏览器环境测试 : `karma` + `Jasmine` + `webpack` + `babel` + `jsdom`

### Jest

`Jest` 是 `facebook` 出的一个完整的单元测试技术方案，集 `测试框架`, `断言库`, `启动器`, `快照`，`沙箱`，`mock工具`于一身，也是 `React` 官方使用的测试工具。

Jest的优势是明显的：速度快，具备监控模式，API 简单，易配置，隔离性好，Mock 丰富，多项目并行。

- Node 环境下测试 : `Jest` + `babel`
- 浏览器环境测试 : `Jest` + `babel` + `JSDOM`（组件需要 `react-testing-library`, `Enzyme`, `TestUtils` 三选一) + `webpack`
