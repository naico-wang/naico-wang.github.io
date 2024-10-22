---
title: 我认为的 Vue3 核心知识点
date: 2024-08-13
category: Vue2/3
---

# 我认为的 Vue3 核心知识点

## 引子

Vue3 发布有一段时间了，近期有空一探究竟，特此总结。本文将从以下角度加以阐述：

- 全面支持 TypeScript
- 全新的数据响应式
- 性能优化
- Tree Shaking
- Composition API

## 全面支持 TypeScript

众所周知 Vue2 对 TypeScript 的支持不太友好。
我们通常需要单独安装组件本身的装饰器 `vue-class-component` 及 `vue-property-decorator`，如项目中引入了 Vuex，还需要加入 `vuex-class` 等第三方插件，再加上 Webpack 文件的配置，使得在 Vue2 中引入 `TypeScript` 成本太高。
这一点在 Vue3 中得到了很大的改善。

- 安装上，Vue Cli 直接内置了 TypeScript 工具支持，不需要单独安装引入。
- 在 npm 包的官方声明中

    随着应用的增长，静态类型系统可以帮助防止许多潜在的运行时错误，这就是为什么 Vue3 是用 TypeScript 编写的。这意味着在 Vue3 中使用 TypeScript 不需要任何额外的工具——它作为头等公民被支持。

- 定义 Vue 组件
  
    ```javascript
    import { defineComponent, PropType } from 'vue';
    interface Student {
      name: string,
      address: string,
      age: number,
    }
    const Component = defineComponent({
      // 已启用类型推断
      props: {
        success: { type: String },
        callback: {
          type: Function as PropType<() => void>,
        },
        student: {
          type: Object as PropType<Student>,
          required: true,
        },
      },
      data () {
        return {
          message: 'Vue3 code style',
        };
      },
      computed: {
        reversedMessage(): string {
          return this.message.split(' ').reverse().join('');
        },
      },
    })
    ```

## 全新的数据响应式

相信面试过 `Vue` 的同学，都会被面试官问到这个问题，`Vue2` 是怎么完成数据响应式的？

答案大家也都司空见惯了，通过 `Object.defineProperty` 完成数据劫持，通过递归的方式把一个对象的所有属性都转化成 `get` 和 `set` 方法，从而拦截到对象属性的访问和变更。

是否有考虑过这么做的缺点是什么？

- 数据庞大所带来的性能问题：`Observer` 方法上，由于需要对对象的每一个属性进行拦截，那么所有的 `key` 都要进行循环和递归。
- `Object.defineProperty` 方法的瓶颈：该 `API` 不支持**数组**，Vue2 是通过**数组方法重写**完成的响应式支持（[链接](https://vue-js.com/learn-vue/reactive/array.html#_6-%E6%95%B0%E7%BB%84%E6%96%B0%E5%A2%9E%E5%85%83%E7%B4%A0%E7%9A%84%E4%BE%A6%E6%B5%8B)）。
- 动态添加或删除对象属性无法被侦测：`defineProperty` 的 `setter` 方法做不到，所以我们经常会用指令 `$set` 为属性赋值。

**再来看看 Vue3 的处理方法：**

ES6 `Proxy` 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

该过程针对当前对象的所有属性，无论原始的还是新增的，只要是外界对该对象的访问，都必须先通过这层拦截。

```javascript
const obj = {
  name: 'whisky',
  age: '27',
  alcohol:[
    { name: '麦卡伦' },
    { name: '罗曼湖' },
  ],
}
const p = new Proxy(obj, {
  get(target, propKey, receiver) {
    console.log('你访问了' + propKey);
    return Reflect.get(target, propKey, receiver);
  },
  set(target, propKey, value, receiver) {
    console.log('你设置了' + propKey);
    console.log('新的' + propKey + '=' + value);
    Reflect.set(target, propKey, value, receiver);
  }
});
p.age = '20';
console.log(p.age);
// 你设置了age
// 新的age=20
// 你访问了age
// 20
p.newPropKey = '新属性';
console.log(p.newPropKey);
// 你设置了newPropKey
// 新的newPropKey=新属性
// 你访问了newPropKey
// 新属性

//其中，尽管有新增属性 newPropKey，也并不需要重新添加响应式处理
```

Vue3 的操作是通过 `Proxy` 对对象进行拦截操作，而 Vue2 中的 `defineProperty` 是针对对象的属性进行操作。

## 性能优化

结论：**对比 Vue2，总体性能提升翻倍**。

优化点如下：

### 静态标记 PatchFlags

`diff` 算法的优化——静态标记

Vue2 的 `diff` 算法采用的是 `全量比较` 的策略。

原始策略:
当 `Virtual DOM` 节点发生改变时，会生成新的 `VNode`, 该 `VNode` 和 `oldVNode` 节点作对比，如果发现有差异，则直接在真实的 `DOM` 上操作修改成新值，同时替换 `oldVNode` 的值为 `VNode`。

```javascript
<div id="app">
  <h1>Vue2的diff</h1>       // 静态节点
  <p>今天基金又绿啦</p>       // 静态节点
  <div>{{ name }}</div>       // 动态节点
</div>

function render() {
  with(this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_c('h1', [_v("Vue2的diff")]), _c('p', [_v("今天基金又绿啦")]), _c('div', [_v(_s(name))])])
  }
}
```

这种 **全量比较** 的策略毫无疑问可以遍布所有 `VNode` 节点，但是所谓的 **全量** 对比，意味着全部节点的对比。

在我们真实的业务场景下，其实存在一部分静态的标签名、类名, 甚至标签内容都不会变的元素，如果这部分静态元素也参与了 **全量** 对比的替换过程中，毫无疑问就产生了一笔时间消耗。

让我们看看 Vue3 做了什么：

```javascript
<div id="app">
  <h1>Vue3的diff</h1>       // 静态节点
  <p>今天基金又绿啦</p>       // 静态节点
  <div>{{ name }}</div>       // 动态节点
</div>

render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", { id: "app" }, [
    _createVNode("h1", null, "Vue3的diff"),
    _createVNode("p", null, "今天基金又绿啦"),
    _createVNode("div", null, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}
```

以上，我们发现 **静态标记** 实际上是在第一步创建 `Virtual DOM` 时，根据每个 `VNode` 节点变化与否，添加了相应的 标记 ，这样一来，之后 `VNode` 与 `oldVNode` 对比的过程中，就只需要对比有标记的节点。

其中，节点变化类型的参考系，是一个枚举 **PatchFlags**：

```javascript
export const enum PatchFlags {
  TEXT = 1,
  CLASS = 1 << 1,
  STYLE = 1 << 2,
  PROPS = 1 << 3,
  FULL_PROPS = 1 << 4,
  HYDRATE_EVENTS = 1 << 5,
  STABLE_FRAGMENT = 1 << 6,
  KEYED_FRAGMENT = 1 << 7,
  UNKEYED_FRAGMENT = 1 << 8,
  NEED_PATCH = 1 << 9,
  DYNAMIC_SLOTS = 1 << 10,
  HOISTED = -1,
  BAIL = -2
}
```

显而易见的是，如果只是文本动态变化，取值为 `1`，如果是样式动态变化，取值为 `1 << 2`，依次类推。当存在组合变化时，通过位运算组合，生成相应的标记节点代码。

### 事件绑定的优化

`Vue2` 中的事件绑定被视为**动态绑定**，但实际上每次点击事件执行的内容是一样的，于是在 `Vue3` 中，就把这个事件想办法直接缓存起来，通过复用就会提升性能。

上文中提到的 `PatchFlags` 里，动态属性的值是 `1 << 3`，结果是 `8`，照理来说点击事件会按这个值进行编译和静态标记，这时候加入事件监听缓存 `cacheHandlers`，原本的静态标记就不存在了。

```javascript
export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", _hoisted_1, [
    _createVNode("button", {
      onClick: _cache[1] || (_cache[1] = $event => (_ctx.confirmHandler($event)))
    }, "确认"),
    _createVNode("span", null, _toDisplayString(_ctx.vue3), 1 /* TEXT */)
  ]))
}
// 首次渲染时， 将事件缓存在 _cache[1] 中
// 再次调用时， 判断是否有缓存，如果有直接从缓存中获取事件，无需再次创建更新，减少消耗 
```

### 静态提升 hoistStatic

在 **静态标记** 的部分我们了解到，有一些静态元素是不需要参与更新的，但是他们仍然需要每一次的创建过程，在这之后进行渲染。这个时候，通过静态提升（`_hostied` 标记的元素），就可以让指定元素只创建一次，在渲染时直接复用第一次也是唯一一次的创建结果，从而省去开销。

```javascript
const _hoisted_1 = /*#__PURE__*/_createVNode("div", null, "静态提升", -1 /* HOISTED */)
```

## Tree Shaking

什么是 `Tree Shaking`？从字面意义出发，一棵树，通过晃动，甩掉多余的残叶。

回到代码世界，就是在我们前端的 `Webpack` 打包阶段，移除 `JavaScript` 上下文中的未引用代码。

我们在 Vue2 中应该都写过如下代码：

```javascript
import Vue from 'vue';

Vue.nextTick(() => {
  // 和 DOM 有关的一些操作
});
```

> TIPS：单文件中的 `$nextTick` 其实本质和 `Vue.nextTick` 一样。

思考一个问题：

假如你没有用到 `Vue.nextTick` 这个方法，或者你更喜欢用 `setTimeout` 来代替实现，这样的话 `Vue` 中 `nextTick` 的部分将会变成 `dead code`——徒增代码体积但从来不会被用到，这对于客户端渲染的 `web app` 来说是拖累性能的一大因素。

于是，在 `Vue3` 中，官方团队重构了所有**全局 API** 的组织方式，让所有的 `API` 都支持了 `Tree Shaking`，故上例我们可以改写成：

```javascript
import { nextTick } from 'vue';
 
nextTick(() => {
  // 和 DOM 有关的一些操作
});
```

## Composition API 与实战

### 起因

在 `Vue2` 风靡的时期，组件复用是团队开发中很重要的一环，同时，基于 `slot` 或 `prop` 的组件内容传递，也帮助抽象了逻辑。

但是，在数据传递层数高的时候，组件内容会显得混乱。我们时常需要把负责增减的 `method` 和 `data` 分在代码块的不同位置，在小组件中如果还可以一眼看到，但是在一些有着几十行几百行的组件中，分布在 `data`，`compute`，`method` 的中的函数交互将会变得难以理解，增加了阅读、心智、维护、修改的负担。

### 体验

Composition API 给予了用户灵活的组织组件代码块的能力。

我将在下文中通过一个 ToDoList，来比较 Options API 与 Composition API 的区别。

先来看看如果用 Options API，我们会怎么处理该需求：

```vue
<template>
  <section class="todo-app">
    <header class="header"></header>
    <section class="main"></section>
    <footer class="footer"></footer>
  </section>
</template>

<script>
export default {
  data() {
    return {
      todos: [],             // 存储 todo 的数组
      newTodo: '',           // 当前新增的 todo 项
      editTodo: '',           // 当前修改的 todo 项
    };
  },
  computed: {
    // 当前遗留项
    remaining: function () {
      return this.todos.filter((todo) => !todo.completed).length;
    },
    // 全选逻辑
    allDone: {
      get: function () {
        return this.remaining === 0;
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value;
        });
      },
    },
  },
  methods: {
    addTodo () {},
    deleteTodo () {},
    editTodo () {},
    doneEdit () {},
    cancelEdit () {},
    removeCompleted () {},
  },
};
</script>
```

直接来看 Composition API 该怎么写：

```vue
<template>
  <section class="todo-app">
    <header class="header"></header>
    <section class="main"></section>
    <footer class="footer"></footer>
  </section>
</template>

<script>
import { ref, reactive, computed, toRefs } from "vue";
// ref 用来追踪普通数据
// reactive 用来追踪对象或数组
// toRefs 把 reactive 的值处理为ref
export default {
  setup() {
    // 数据层
    const test = ref('this is test');
    const state = reactive({
      todos: [],             // 存储 todo 的数组
      newTodo: '',           // 当前新增的 todo 项
      editTodo: '',           // 当前修改的 todo 项
    });
    
    // computed 层
    const remaining = computed(
      () => state.todos.filter(todo => !todo.completed).length
    );
    const allDone = computed({});
    
    // methods 层
    function addTodo () {},
    function removeTodo () {},
    function editTodo () {},
    ...
    
    return {
      ...toRefs(state),
      remaining,
      allDone,
      addTodo，
      removeTodo,
      editTodo,
      ... // 省略了其他方法
    };
  }
}
</script>
```

### 对比总结

经过对比发现，`Composition API` 其实是一种更倾向于 `hooks` 的写法。

1. **新函数 setup**

   它会在 created 生命周期之前执行，并且可以接受 props（用来内部访问）， context 两个参数（上下文对象，可以通过 context 来访问实例 this）。

2. **`ref`，`reactive`，`toRefs`**

   - ref 可以接受一个传入值作为参数，返回一个基于该值的 响应式 Ref 对象，该对象中的值一旦被改变和访问，都会被跟踪到，通过修改 test 的值，可以触发模板的重新渲染，显示最新的值。
   - reactive 与 ref 的区别仅仅是，通过 reactive 来修饰对象或数组。
   - toRefs 可以将 reactive 创建出来的响应式对象转换成内容为 ref 普通对象。

3. **有关 `computed`， `watch`， `watchEffect`**

   - computed 用来创建计算属性，返回值是一个 ref 对象，需要单独引入。
   - watch 与 Vue2 中的方法一致，需要侦听数据，并执行它的侦听回调。
   - watchEffect 会立即执行传入的函数，并响应式侦听其依赖，并在其依赖变更时重新运行该函数。

4. **生命周期相关**

   Vue3 的 生命周期 钩子有了小幅度的改变：

    ```javascript
    Vue2--------------vue3
    beforeCreate  -> setup()
    created       -> setup()
    beforeMount   -> onBeforeMount
    mounted       -> onMounted
    beforeUpdate  -> onBeforeUpdate
    updated       -> onUpdated
    beforeDestroy -> onBeforeUnmount
    destroyed     -> onUnmounted
    activated     -> onActivated
    deactivated   -> onDeactivated
    errorCaptured -> onErrorCaptured
    ```

    可以看到的是，原有的 生命周期 基本都是存在的，只不过加上了 `on` 前缀。其中，`setup` 相当于融合了 `beforeCreate` 和 `created` 两个钩子，剩下的钩子，直接跟在 `setup` 内部书写即可：

    ```vue
    <script>
    import {
      ref
      onBeforeMount,
      onMounted,
      onBeforeUpdate,
      onUpdated,
      onBeforeUnmount,
      onUnmounted
    } from "vue"
    export default {
      setup() {
        const count = ref(0);
        // 其他的生命周期都写在这里
        onBeforeMount (() => {
          count.value++;
          console.log('onBeforeMount', count.value);
        })
        onMounted (() => {
          count.value++;
          console.log('onMounted', count.value);
        })
        // 注意，onBeforeUpdate 和 onUpdated 里面不要修改值，会死循环的哦！
        onBeforeUpdate (() => {
          console.log('onBeforeUpdate', count.value);
        })
        onUpdated (() => {
          console.log('onUpdated', count.value);
        })
        onBeforeUnmount (() => {
          count.value++;
          console.log('onBeforeUnmount', count.value);
        })
        onUnmounted (() => {
          count.value++;
          console.log('onUnmounted', count.value);
        })
        return {
          count,
        };
      },
    };
    </script>
    ```

    注意这里所有的生命周期，都是单独引入的，日常开发当中我们或许用不到这么多钩子，按需引入削减了体积大小，这就是 Tree shaking 的好处。

    至此，Composition API 的基本用法我们已经基本掌握了。有关组件调用的部分，其实与 Vue2 的做法别无二致，只是我们可能会提取如上例提到的 ToDoList 的代码作为一个函数组件，之后在父组件中引用即可。

    提取逻辑 useTodos，通过 `setup` 方法来返回所有数据，于是可以定义组件 useTodos：

    ```javascript
    // useTodos.js
    const useTodos = () => {
      // 数据层
      const state = reactive({
        todos: [],             // 存储 todo 的数组
        newTodo: '',           // 当前新增的 todo 项
        editTodo: '',           // 当前修改的 todo 项
      });
      
      // computed 层
      const remaining = computed(
        () => state.todos.filter(todo => !todo.completed).length
      );
      const allDone = computed({});
      
      // methods 层
      function addTodo () {}, 
      function removeTodo () {},
      function editTodo () {},
      ...
      
      return {
        ...toRefs(state),
        remaining,
        allDone,
        addTodo, 
        removeTodo,
        editTodo,
        ...
      };
    }
    ```

    现在，我们如果需要使用 todos 组件，就可以：

    ```vue
    <script>
    import useTodos from './useTodos';

    export default {
      setup () {
        const { remaining, allDone, state ... } = useTodos();

        return {
          remaining,
          allDone,
          state,
          ...
        }
      }
    }
    </script> 
    ```

## 总结

Vue3 已经发布有一年多的时间了，相信很多开发者已经体会到了其中的魅力，以上观点是结合官网及各大平台开发者的见解进行分析和比较，希望能给在路上和已经在路上的 Vue3 爱好者带来帮助。
