---
title: Axios vs. Fetch API，你该选哪个？
date: 2024-08-08
category: JavaScript/TypeScript
---

# Axios vs. Fetch API，你该选哪个？

在前端开发中，与远程服务器无缝互动并通过网络交换数据是必不可少的一环。不论是从API获取数据、执行CRUD操作，还是处理其他网络相关任务，HTTP请求的重要性不言而喻。为了让开发者更轻松地处理HTTP请求，JavaScript社区中诞生了两个非常流行的库：Axios和Fetch。

那么，究竟哪个工具更适合你的项目需求呢？今天，我们就来深度解析Axios和Fetch的优缺点，看看它们在不同任务中的表现如何。通过这篇文章，你不仅能全面了解这两种API的使用方法，还能更有信心地选择适合自己的工具。准备好了吗？让我们一起开始吧！

## Axios——功能强大的第三方库

Axios是一个第三方的HTTP客户端库，用于发起网络请求。它基于Promise，提供了一个干净且一致的API来处理请求和响应。

你可以通过内容分发网络（CDN）或使用包管理器（如npm）将其添加到项目中。Axios的一些核心功能包括：在浏览器中发起XMLHttpRequests、在Node.js环境中发起HTTP请求、取消请求以及拦截请求和响应。

### Axios的主要特点：

1. 在浏览器中发起XMLHttpRequests

2. 在Node.js中发起HTTP请求

3. 请求取消功能

4. 请求和响应的拦截器

## Fetch——现代浏览器的内置API

Fetch也是一个基于Promise的HTTP客户端API。由于它是内置的，所以我们不需要安装或导入任何东西。Fetch在所有现代浏览器中都可用，你可以在 `caniuse` 上查看其支持情况。
Fetch在Node.js中也可用。

### Fetch的主要特点：

1. 内置API，无需额外安装

2. 现代浏览器中可用

3. 在Node.js中可用

## 一、基础语法

### 使用Axios发送POST请求

Axios 提供了一个链式API，使得配置请求参数如 headers、data 和请求方法变得非常简单。它会自动将数据转换为 JSON 格式，省去了手动处理的麻烦。

```javascript
const axios = require('axios');

const url = 'https://api.example.com/posts';
const data = {
  title: '你好，世界',
  body: '这是一条测试内容。',
  userId: 1,
};

axios
  .post(url, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
  .then(({ data }) => {
    console.log("POST请求成功，响应数据:", data);
  })
  .catch(error => {
    console.error('请求出错:', error);
  });
```

### 使用Fetch发送POST请求

Fetch API 是 JavaScript 内置的，用来发起 HTTP 请求。虽然 Fetch 比较灵活，但是需要更多的手动操作，比如需要手动转换响应数据为 JSON。

```javascript
const url = "https://api.example.com/posts";

const options = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
  body: JSON.stringify({
    title: "你好，世界",
    body: "这是一条测试内容。",
    userId: 1,
  }),
};

fetch(url, options)
  .then((response) => response.json())
  .then((data) => {
    console.log("POST请求成功，响应数据:", data);
  })
  .catch(error => {
    console.error('请求出错:', error);
  });
```

### 对比分析

1. 数据发送方式：
   
   - Axios 使用 data 属性来发送数据。
   
   - Fetch 使用 body 属性来发送数据，并且需要手动将数据转换成 JSON 字符串。

2. 响应数据处理：
   
   - Axios 自动将服务器响应数据转换为 JSON 对象。
   
   - Fetch 需要手动调用 response.json() 方法来解析响应数据。

3. 便捷性：
   
   - Axios 自动处理很多细节，比如响应数据的转换，错误处理等，更加方便易用。
   
   - Fetch 则提供了更灵活的配置选项，但需要开发者写更多代码来处理响应数据和错误。

## 二、错误处理

在进行 HTTP 请求时，处理响应和错误是开发中非常重要的一部分。Fetch 和 Axios 在这方面各有优劣。接下来，我们将分别用这两种工具来实现一个 GET 请求，并比较它们的错误处理方式。

### 使用Fetch处理GET请求和错误

Fetch 提供了对加载过程的精确控制，但同时也增加了复杂性。它需要处理两个 Promise，并且还要手动解析 JSON 数据。此外，Fetch 默认认为服务器返回的所有状态码（包括错误状态码如404）都是成功的，因此需要开发者手动检查 `response.ok` 属性来处理错误。

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP错误：${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('接收到的数据:', data);
  })

  .catch(error => {
    console.error('错误信息:', error.message);
  });
```

### 使用Axios处理GET请求和错误

Axios 简化了响应的处理，直接提供了 `data` 属性。同时，它会自动拒绝状态码不在200-299范围内的响应（即非成功响应）。使用 `.catch()` 块可以方便地获取错误信息，包括是否收到了响应以及响应的状态码。

```javascript
const axios = require("axios");

axios
  .get("https://api.example.com/data")
  .then((response) => {
    console.log("接收到的数据:", response.data);
  })
  .catch((error) => {
    if (error.response) {
      console.error(`HTTP错误：${error.response.status}`);
    } else if (error.request) {
      console.error("请求错误：未收到响应");
    } else {
      console.error("错误信息:", error.message);
    }
  });
```

### 对比分析

1. 错误处理机制：
   
   - Fetch 默认认为所有响应都是成功的，需要手动检查 response.ok 属性。
   
   - Axios 自动拒绝非成功状态码的响应，更加简化了错误处理。

2. 响应数据解析：
   
   - Fetch 需要手动调用 response.json() 方法来解析 JSON 数据。
   
   - Axios 自动将响应数据解析为 JSON 对象，并通过 response.data 提供访问。

3. 错误信息获取：
   
   - Fetch 在 `.catch()` 块中只能捕获网络错误或代码中的错误，需手动抛出 HTTP 错误。
   
   - Axios 在 `.catch()` 块中可以获取详细的错误信息，包括响应和请求的详细情况。

## 三、拦截HTTP请求和响应

Axios 的一个重要特性是能够拦截 HTTP 请求和响应。HTTP 拦截器在需要检查或修改从应用程序到服务器的 HTTP 请求或从服务器到应用程序的响应时非常有用。这一功能对于日志记录、身份验证或重试失败的 HTTP 请求等任务非常重要。

通过使用拦截器，你不需要为每个 HTTP 请求单独编写代码。HTTP 拦截器有助于设置一个全局策略，处理所有的请求和响应。

### 使用Axios拦截HTTP请求

```javascript
const axios = require("axios");

// 注册请求拦截器
axios.interceptors.request.use((config) => {
  // 在发送任何 HTTP 请求之前记录一条消息
  console.log("请求已发送");
  return config;
});

// 发送GET请求
axios
  .get("https://api.example.com/data")
  .then(({data}) => {
    console.log("接收到的数据:", data);
  })
  .catch((error) => {
    console.error("错误信息:", error.message);
  });
```

在这段代码中，`axios.interceptors.request.use()` 方法用于定义在发送 HTTP 请求之前运行的代码。

此外，`axios.interceptors.request.use()` 还可以用来拦截服务器的响应。例如，在发生网络错误时，可以使用响应拦截器重试相同的请求。

### 使用Fetch拦截HTTP请求

默认情况下，`fetch()` 没有提供拦截请求的方法，但可以通过重写全局 `fetch()` 方法来实现拦截器功能。

```javascript
fetch = ((originalFetch) => {
  return (...args) => {
    return originalFetch.apply(this, args).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP错误：${response.status}`);
      }
      console.log("请求已发送");
      return response;
    });
  };
})(fetch);

fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => {
    console.log("接收到的数据:", data);
  })
  .catch((error) => {
    console.error("错误信息:", error.message);
  });
```

### 对比分析

1. 代码简洁性：
   
   - Axios 提供了内置的拦截器支持，代码更加简洁。
   
   - Fetch 需要手动重写全局方法，代码略显冗长。

2. 功能性：
   
   - Axios 拦截器功能强大，可以在请求和响应阶段进行操作。
   
   - Fetch 通过重写方法实现拦截，灵活性较高，但代码复杂度增加。

3. 错误处理：
   
   - Axios 自动处理 HTTP 错误并抛出异常，便于统一处理。
   
   - Fetch 需要手动检查响应状态码，并抛出异常。

通过以上对比可以看出，使用 Axios 可以更加简化拦截和错误处理的代码，更加便于维护。而 Fetch 提供了更高的灵活性，但需要更多的手动处理。

## 四、响应超时处理

响应超时是比较 Fetch 和 Axios 的另一个重要方面。响应超时指的是客户端等待服务器响应的时长，超过这个时间后请求将被视为失败。

在 Axios 中设置超时非常简单，只需在配置对象中使用 `timeout` 属性即可。这种简便的方法使得开发者可以在请求配置中直接定义超时持续时间，提供了更大的控制和易用性。

### 使用Axios设置响应超时

```javascript
const axios = require('axios');

// 定义超时持续时间（毫秒）
const timeoutDuration = 5000; // 5秒

// 创建配置对象并设置超时属性
const config = {
  timeout: timeoutDuration
};

// 发送带有超时设置的GET请求
axios.get('https://api.example.com/items', config)
  .then(response => {
    console.log('接收到的数据:', response.data);
  })
  .catch(error => {
    console.error('获取数据出错:', error.message);
  });
```

在这个示例中，我们使用 Axios 发送了一个 GET 请求，并将配置对象作为第二个参数传递以指定超时。如果请求成功，接收到的数据将被记录到控制台。如果请求过程中发生错误或超时，错误信息将被记录到控制台。

### 使用Fetch设置响应超时

Fetch 提供了类似的功能，但需要使用 `AbortController` 接口，这比 Axios 的实现稍微复杂一些。

```javascript
const timeoutDuration = 5000; // 5秒
// 创建一个AbortController实例
const controller = new AbortController();
const signal = controller.signal;

// 设置定时器，在指定时间后中止请求
const timeoutId = setTimeout(() => {
  controller.abort();
}, timeoutDuration);

// 发送带有超时设置的GET请求
fetch('https://api.example.com/items', { signal })
  .then(response => {
    if (!response.ok) {
      throw new Error('网络响应不正常');
    }
    return response.json();
  })
  .then(data => {
    console.log('接收到的数据:', data);
  })
  .catch(error => {
    // 检查错误是否由于请求被中止
    if (error.name === 'AbortError') {
      console.error('请求超时');
    } else {
      console.error('获取数据出错:', error.message);
    }
  })
  .finally(() => {
    // 清除定时器，防止请求完成后定时器继续运行
    clearTimeout(timeoutId);
  });
```

在这个示例中，我们为 fetch 请求设置了 5 秒的超时时间，并创建了一个 `AbortController` 实例来在超时后取消请求。通过 `setTimeout` 启动一个定时器，在指定时间后中止请求。然后，发送包含中止信号的 fetch 请求。响应后，检查请求是否成功并解析数据。管理超时等错误情况。最后，清除定时器以避免请求完成后不必要的延迟。

### 对比分析

1. 代码简洁性：
   
   - Axios 提供了内置的超时设置，代码更加简洁。
   
   - Fetch 需要使用 AbortController 和定时器来实现超时功能，代码略显复杂。

2. 功能性：
   
   - Axios 允许在配置对象中直接设置超时，方便控制。
   
   - Fetch 通过 AbortController 实现超时，提供了更高的灵活性，但实现较为复杂。

3. 错误处理：
   
   - Axios 自动处理超时错误，并在请求超时时抛出异常。
   
   - Fetch 需要手动检查请求是否被中止，并处理相应的错误。

通过以上对比可以看出，对于初学者来说，使用 Axios 可以更加简化超时处理的代码，更加便于维护。而 Fetch 提供了更高的灵活性，但需要更多的手动处理。

## 五、同时发送多个请求

同时发送多个请求，或并发请求，是比较 Fetch 和 Axios 的另一个重要方面。在性能和响应速度至关重要的应用中，这个功能尤为重要。

### 使用Axios同时发送多个请求

Axios 提供了 `axios.all()` 方法来发送多个并发请求。只需将请求数组传递给这个方法，然后使用 `axios.spread()` 来将响应展开为单独的参数，从而可以分别处理每个响应。

```javascript
const axios = require('axios');

// 定义请求的基础URL
const baseURL = 'https://api.example.com/resources';

// 定义请求的URL
const urls = [
  `${baseURL}/1`,
  `${baseURL}/2`,
  `${baseURL}/3`
];

// 创建一个Axios请求promise的数组
const axiosRequests = urls.map(url => axios.get(url));

// 使用`axios.all()`同时发送多个请求
axios.all(axiosRequests)
  .then(axios.spread((...responses) => {
    // 处理所有请求的响应
    responses.forEach((response, index) => {
      console.log(`来自${urls[index]}的响应:`, response.data);
    });
  }))
  .catch(error => {
    console.error('获取数据出错:', error.message);
  });
```

### 使用Fetch同时发送多个请求

要使用 Fetch 实现同样的功能，需要依赖内置的 `Promise.all()` 方法。将所有 fetch 请求作为数组传递给 `Promise.all()`，然后使用异步函数处理响应。

```javascript
// 定义请求的基础URL
const baseURL = "https://api.example.com/resources";

// 定义请求的URL
const urls = [`${baseURL}/1`, `${baseURL}/2`, `${baseURL}/3`];

// 创建一个存储fetch请求promise的数组
const fetchRequests = urls.map((url) => fetch(url));

// 使用`Promise.all()`同时发送多个请求
Promise.all(fetchRequests)
  .then((responses) => {
    // 处理所有请求的响应
    responses.forEach((response, index) => {
      if (!response.ok) {
        throw new Error(
          `请求 ${urls[index]} 失败，状态码为 ${response.status}`
        );
      }
      response.json().then((data) => {
        console.log(`来自${urls[index]}的响应:`, data);
      });
    });
  })
  .catch((error) => {
    console.error("获取数据出错:", error.message);
  });
```

### 对比分析

1. 代码简洁性：
   
   - Axios 提供了内置的方法 axios.all() 和 axios.spread()，使得代码更加简洁易读。
   
   - Fetch 需要使用 Promise.all() 并手动处理每个响应，代码略显复杂。

2. 响应处理：
   
   - Axios 使用 axios.spread() 将响应展开为单独的参数，可以更方便地处理每个响应。
   
   - Fetch 需要在 Promise.all() 之后手动解析每个响应的 JSON 数据，增加了额外的复杂性。

3. 错误处理：
   
   - Axios 自动处理每个请求的错误，并在并发请求时统一捕获错误。
   
   - Fetch 需要手动检查每个响应的状态码，并在解析 JSON 数据时处理可能的错误。

## 六、向后兼容性

向后兼容性指的是软件系统或产品即使在使用旧版本的依赖或旧环境时，也能正常或有效地运行的能力。

### Axios的向后兼容性

Axios 提供了更好的开箱即用的向后兼容性，并提供了额外的功能以便与旧系统或代码库兼容。Axios 的一个主要卖点是其广泛的浏览器支持，由于其使用 XMLHttpRequest，因此即使在 IE11 等旧版浏览器中也能兼容。

### Fetch的向后兼容性

相比之下，Fetch 的浏览器支持更有限，主要面向现代浏览器如 Chrome、Firefox、Edge 和 Safari。如果项目需要在不支持的浏览器中使用 Fetch 的功能，可以集成一个 polyfill，例如 `whatwg-fetch`，来弥补这个差距。这个 polyfill 可以扩展 Fetch 的支持到旧版浏览器，确保兼容性。

首先，通过 npm 安装 polyfill：

```shell
npm install whatwg-fetch --save
```

然后，可以这样使用 Fetch 进行请求：

```javascript
import 'whatwg-fetch';

const baseURL = 'https://api.mywebsite.com/data';

// 发送GET请求
window.fetch(`${baseURL}/item`)
  .then(response => {
    if (!response.ok) {
      throw new Error('网络响应不正常');
    }
    return response.json();
  })
  .then(data => {
    console.log('接收到的数据:', data);
  })
  .catch(error => {
    console.error('获取数据出错:', error.message);
  });
```

请注意，在某些旧版浏览器中，你可能还需要一个 Promise 的 polyfill。

### 对比分析

1. 向后兼容性：
   
   - Axios 由于使用 XMLHttpRequest，可以在包括 IE11 在内的更旧的浏览器中使用。
   
   - Fetch 主要面向现代浏览器，需要使用 polyfill 才能在旧版浏览器中使用。

2. 安装和使用：
   
   - Axios 不需要额外的配置即可在旧浏览器中使用。
   
   - Fetch 需要安装 whatwg-fetch polyfill，并可能需要 Promise polyfill，以确保在旧版浏览器中的兼容性。

## 总结

总的来说，Axios 以其简单、强大和广泛的浏览器支持脱颖而出，特别适合那些需要兼容旧版浏览器的项目。另一方面，Fetch 提供了更原生的方式，直接内置于浏览器中，支持流处理等功能，并能无缝配合其他Web平台API。

在选择 Axios 和 Fetch 时，开发者应仔细评估项目需求，包括易用性、性能考虑、浏览器兼容性以及所需的额外功能。

那么，小伙伴们，你们更倾向于使用 Axios 还是 Fetch 呢？有没有在项目中遇到过需要兼容旧版浏览器的情况？你们又是如何解决的呢？欢迎在评论区分享你们的经验和见解，我们一起讨论、学习。
