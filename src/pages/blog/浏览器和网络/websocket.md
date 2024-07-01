---
title: 深入浅出WebSocket
date: 2023-12-25
abstract: 公司的项目正好要用到WebSocket，所以我做了一些deep dive，整理了这篇文档。
---

# 深入浅出WebSocket

## 什么是WebSocket?

​[WebSocket](http://websocket.org/) 是一种网络通信协议，很多高级功能都需要它。初次接触 WebSocket 的人，都会问同样的问题：我们已经有了 HTTP 协议，为什么还需要另一个协议？它能带来什么好处？ 答案很简单，因为 HTTP 协议有一个缺陷：通信只能由客户端发起。 举例来说，我们想了解今天的天气，只能是客户端向服务器发出请求，服务器返回查询结果。HTTP 协议做不到服务器主动向客户端推送信息。 这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。我们只能使用["轮询"](https://www.pubnub.com/blog/2014-12-01-http-long-polling/)：每隔一段时候，就发出一个询问，了解服务器有没有新的信息。最典型的场景就是聊天室。轮询的效率低，非常浪费资源（因为必须不停连接，或者 HTTP 连接始终打开）。因此，工程师们一直在思考，有没有更好的方法。WebSocket 就是这样发明的。

​它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于[服务器推送技术](https://en.wikipedia.org/wiki/Push_technology)的一种。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017051502.png)

其他特点包括：

- 建立在 TCP 协议之上，服务器端的实现比较容易。
- 与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
- 数据格式比较轻量，性能开销小，通信高效。
- 可以发送文本，也可以发送二进制数据。
- 没有同源限制，客户端可以与任意服务器通信。
- 协议标识符是`ws`（如果加密，则为`wss`），服务器网址就是 URL。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017051503.jpg)

## WebSocket 握手

WebSocket 服务端使用标准 TCP 套接字监听进入的连接。下文假定服务端监听 example.com 的 8000 端口，响应 example.com/chat 上的 GET 请求。

握手是 WebSocket 中 “Web”。它是从 HTTP 到 WebSocket 的桥梁。在握手过程中，协商连接的细节，并且如果行为不合法，那么任何一方都可以在完成前退出。服务端必须仔细理解客户端的所有要求，否则可能出现安全问题。

### 客户端请求握手

客户端通过联系服务端，请求 WebSocket 连接的方式，发起 WebSocket 握手流程。客户端发送带有如下请求头的标准 HTTP 请求（HTTP 版本必须是 1.1 或更高，并且请求方法必须是 GET）：

```javascript
GET /chat HTTP/1.1
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```
在这里，客户端可以请求扩展和/或子协议。此外，也可以使用常见的请求头，比如 User-Agent、Referer、Cookie 或者身份验证请求头。这些请求头与 WebSocket 没有直接关联。

如果存在不合法的请求头，那么服务端应该发送 400 响应（“Bad Request”），并且立即关闭套接字。通常情况下，服务端可以在 HTTP 响应体中提供握手失败的原因 。如果服务端不支持该版本的 WebSocket，那么它应该发送包含它支持的版本的 Sec-WebSocket-Version 头。在上面的示例中，它指示 WebSocket 协议的版本为 13。

在请求头中，最值得关注的是 Sec-WebSocket-Key。接下来，将讲述它。

### 服务端握手响应

当服务端收到握手请求时，将发送一个特殊响应，该响应表明协议将从 HTTP 变更为 WebSocket。该响应头大致如下（记住，每个响应头行以 \r\n 结尾，在最后一行的后面添加额外的 \r\n，以说明响应头结束）：

```javascript
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

## WebSocket的消息格式

之所以要使用webSocket是因为client和server可以随时随地发送消息。这是websocket的神奇所在。那么发送的消息是什么格式的呢？我们来详细看一下。
client和server端进行沟通的消息是以一个个的frame的形式来传输的。frame的格式如下：

```javascript
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
```

MASK表示的是消息是否是被编码过的，对于从client过来的消息来说，MASK必须是1。如果client发送给server端的消息，MASK不为1，则server需要断开和client的连接。但是server端发送给client端的消息，MASK字段就不需要设置了。

RSV1-3是扩展的字段，可以忽略。

opcode表示怎么去解释payload字段。payload就是实际要传递的消息。0x0表示继续，0x1表示文本，0x2表示二进制，其他的表示控制字段。

FIN表示是否是消息的最后一个frame。如果是0，表示该消息还有更多的frame。如果是1表示，该frame是消息的最后一部分了，可以对消息进行处理了。

为什么需要Payload len字段呢？因为我们需要知道什么时候停止接收消息。所以需要一个表示payload的字段来对消息进行具体的处理。
怎么解析Payload呢？这个就比较复杂。

- 首先读取9-15 bits，将其解析为无符号整数。如果其小于125，那么这个就是payload的长度，结束。如果是126，那么就去到第二步。如果是127，那么就去到第三步。
- 读取下一个16 bits，然后将其解析为无符号整数，结束。
- 读取下一个64 bits。将其解析为符号整数。结束。
- 如果设置了Mask，那么读取下4个字节，也就是32bits。这个是masking key。当数据读取完毕之后，我们就获取到了编码过后的payload:ENCODED,和MASK key。要解码的话，其逻辑如下：
  
  ```javascript
  var DECODED = "";
  for (var i = 0; i < ENCODED.length; i++) {
    DECODED[i] = ENCODED[i] ^ MASK[i % 4];
    ...
  }
  ```

FIN可以和opcode一起配合使用，用来发送长消息。

FIN=1表示，是最后一个消息。 0x1表示是text消息，0x2是0，表示是二净值消息，0x0表示消息还没有结束，所以0x0通常和FIN=0 一起使用。

## Extensions和Subprotocols

在客户端和服务器端进行握手的过程中，在标准的websocket协议基础之上，客户端还可以发送Extensions或者Subprotocols。这两个有什么区别呢？
首先这两个都是通过HTTP头来设置的。但是两者还是有很大的不同。Extensions可以对WebSocket进行控制，并且修改payload，而subprotocols只是定义了payload的结构，并不会对其进行修改。
Extensions是可选的，而Subprotocols是必须的。
你可以将Extensions看做是数据压缩，它是在webSocket的基础之上，对数据进行压缩或者优化操作，可以让发送的消息更短。
而Subprotocols 表示的是消息的格式，比如使用soap或者wamp。
子协议是在WebSocket协议基础上发展出来的协议，主要用于具体的场景的处理，它是是在WebSocket协议之上，建立的更加严格的规范。
比如，客户端请求服务器时候，会将对应的协议放在Sec-WebSocket-Protocol头中：

```javascript
GET /socket HTTP/1.1
...
Sec-WebSocket-Protocol: soap, wamp
```

服务器端会根据支持的类型，做对应的返回，如：

```javascript
Sec-WebSocket-Protocol: soap
```

## WebSocket简单示例

```javascript
var ws = new WebSocket("ws://echo.websocket.org");

ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
 }
```

## WebSocket常用API介绍

下面是我们在使用原生JavaScript的一些例子：

### WebSocket构造函数

```javascript
let ws = new WebSocket('ws://localhost:8080');
```

执行上面语句之后，客户端就会与服务器进行连接。

### WebSocket的状态(readyState)

readyState属性返回实例对象的当前状态，总共有四种状态。

```javascript
CONNECTING：值为0, 正在连接
OPEN：值为1，连接成功
CLOSING：值为2，连接正在关闭
CLOSED：值为3，连接已经关闭
```

### WebSocket.onopen(连接成功之后的回调函数)

实例对象的`onopen`属性，用于指定连接成功后的回调函数。

```javascript
ws.onopen = function () {
  ws.send('Hello Server!');
}
```

如果要指定多个回调函数，可以使用`addEventListener`方法。

```javascript
ws.addEventListener('open', function (event) {
  ws.send('Hello Server!');
});
```

### WebSocket.onclose(关闭之后调用的方法)

实例对象的`onclose`属性，用于指定连接关闭后的回调函数。

```javascript
ws.onclose = function(event) {
  console.log('onclose')
}
```

如果要指定多个回调函数，可以使用`addEventListener`方法。

```javascript
ws.addEventListener("close", function(event) {
  console.log('onclose')
});
```

### WebSocket.onmessage(接受到服务器数据之后的回调函数)

```javascript
ws.onmessage = function(event) {
  // 获取数据event.data
  var data = event.data;
  // 处理数据
};
```

### WebSocket.send(向服务器端发送数据)

```javascript
ws.send('your message')
```

### WebSocket.onerror(报错时调用的方法)

```javascript
ws.onerror = function(event) {
  // handle error event
};
```

## WebSocket的心跳重连

WebSocket是前后端交互的长连接，前后端也都可能因为一些情况导致连接失效并且相互之间没有反馈提醒。因此为了保证连接的可持续性和稳定性，WebSocket心跳重连就应运而生。

在使用原生WebSocket的时候，如果设备网络断开，不会立刻触发WebSocket的任何事件，前端也就无法得知当前连接是否已经断开。这个时候如果调用WebSocket.send方法，浏览器才会发现链接断开了，便会立刻或者一定短时间后（不同浏览器或者浏览器版本可能表现不同）触发onclose函数。后端WebSocket服务也可能出现异常，造成连接断开，这时前端也并没有收到断开通知，因此需要前端定时发送心跳消息ping，后端收到ping类型的消息，立马返回pong消息，告知前端连接正常。如果一定时间没收到pong消息，就说明连接不正常，前端便会执行重连。

为了解决以上两个问题，以前端作为主动方，定时发送ping消息，用于检测网络和前后端连接问题。一旦发现异常，前端持续执行重连逻辑，直到重连成功。

####一般的心跳检测的函数：

```javascript
// 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
let heartCheck = {
  // 心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。
  timeout: 100000,
  serverTimeoutObj: null,
  reset: function() {
    clearTimeout(this.serverTimeoutObj)
    return this
  },
  start: function() {
    this.serverTimeoutObj = window.setInterval(() => {
      if (websocket.readyState === 1) {
        websocket.send('ping')
      } else {
        window.clearTimeout(this.serverTimeoutObj)
        // 处理逻辑：重连或者其他
      }
    }, this.timeout)
  }
}
```

## WebSocket完整的代码实例

```javascript
function newWebSocket(option) {
  console.log('new webSocket.....')
  let websocket = null
  // 判断当前环境是否支持websocket
  if (window.WebSocket) {
    if (!websocket) {
      websocket = new WebSocket('你的请求地址')
    }
  } else {
    console.log('not support websocket')
  }
  // 连接成功建立的回调方法
  websocket.onopen = function(e) {
    // 成功建立连接后，重置心跳检测
    heartCheck.reset().start()
    console.log('connected successfully')
  }
  // 连接发生错误，连接错误时会继续尝试发起连接
  websocket.onerror = function() {
    console.log(`onerror`)
    newWebSocket()
  }
  // 接受到消息的回调方法
  websocket.onmessage = function(e) {
    console.log('onmessage', e.data)
    var message = e.data
    if (message) {
      // 执行接收到消息的操作
      if (option != undefined) {
        // 执行传入对象的方法，传出消息
        option.onmessage(message)
      }
    }
  }

  // 接受到服务端关闭连接时的回调方法
  websocket.onclose = function() {
    console.log('onclose')
  }
  // 监听窗口事件，当窗口关闭时，主动断开websocket连接，防止连接没断开就关闭窗口，server端报错
  window.onbeforeunload = () => {
    return websocket.close()
  }

  // 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
  var heartCheck = {
    // 心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。
    timeout: 100000,
    serverTimeoutObj: null,
    reset: function() {
      clearTimeout(this.serverTimeoutObj)
      return this
    },
    start: function() {
      this.serverTimeoutObj = window.setInterval(() => {
        if (websocket.readyState === 1) {
          websocket.send('ping')
        } else {
          console.log('websocket stop', websocket.readyState)
          window.clearTimeout(this.serverTimeoutObj)
          newWebSocket(option)
        }
      }, this.timeout)
    }
  }
  return websocket
}
```
## 一些常用的WebSocket类库

下面介绍几个我在实际项目中研究过的好用的类库

- [Socket.IO](https://socket.io/)
  - 支持及时、双向与基于事件的交流。它可以在每个平台、每个浏览器和每个设备上工作，可靠性和速度同样稳定。
  - 官网：[https://socket.io/](https://socket.io/)
- [ws](https://github.com/websockets/ws)
  - 一个简单易用，速度比较快的WebSocket服务器端和客户端都能用的库
  - 官网：[https://github.com/websockets/ws](https://github.com/websockets/ws)

