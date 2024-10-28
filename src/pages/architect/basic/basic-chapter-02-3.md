---
title: 2.互联网架构设计的四大原则(三)
date: 2024-10-28
category: 架构基础系列
---

# 2.互联网架构设计的四大原则(三)

## 2.3 大型互联网架构高并发设计

高并发一直是大型互联网架构的重点和难点，尤其是2C类系统，在一些活动大促、节日活动、秒杀和团购场景中，经常面临突然的流量爆发，造成系统的高并发访问。用户访问量可能超出系统的承载能力，从而造成服务器性能下降，导致应用服务器和数据库服务器宕机。

解决方案：这并不是一个单点技术问题，不可能只通过增加数据库和后端服务器的处理能力就能达到对高并发业务的完美支撑，而是需要在整个交易链路上，采用多级策略进行精准和严格的控制，在前端、网络传输、负载、网关、后端、数据库等多个层面进行严格控制。

高并发的主要策略有**多级缓存策略**、**异步化策略**和**读写分离策略**。

### 2.3.1 多级缓存策略

多级缓存的主要目的是减少客户端与服务端的网络交互，减少用户请求穿透到服务端和数据库。尽量将资源放置在离用户更近的地方，让用户能够更快地得到应答。缓存可分为客户端缓存和服务端缓存两大类。用户访问可以分为静态资源的访问和动态接口的请求两种。其中H5、安卓、iOS、微信等终端的本地存储都属于客户端缓存的范畴，而CDN、负载、应用内存、缓存中间件都属于服务端缓存。

#### 1.缓存的使用流程

无论是哪种缓存，其使用方式基本都是相同的，缓存的使用流程如下：

- （1）客户端发起请求给服务端后，服务端先去缓存中查找是否有符合要求的数据，如果缓存没有命中（没有找到匹配的缓存数据），则再去数据库中查找，数据库中找到数据后，将此数据存入缓存中，然后给客户端应答。
- （2）当用户再次请求相同数据时，服务端可以直接在缓存中找到匹配的数据（缓存命中），然后返回给客户端，这样就避免了数据库查询操作。

因此，缓存位置越靠近用户，应答速度越快。要最大程度地避免对数据库的直接操作，因为数据库数据毕竟存储在磁盘上，磁盘的I/O性能与内存相差巨大，不但速度慢还会形成性能瓶颈，在高并发场景下很容易出现宕机问题。

#### 2.客户端缓存

服务架构整体上可以分为C/S和B/S两大类。

- C/S（Client/Server）结构，即客户端/服务器结构，如手机上的App、计算机上的游戏客户端都属于C/S结构。它的优点是性能更好、更流畅，缺点是升级维护比较麻烦。例如，如果某一款游戏升级，那么所有安装了游戏客户端的用户都必须升级。

- B/S（Browser/Server）结构，即浏览器/服务器结构，浏览器实际上也是一种软件客户端，所以B/S结构属于C/S结构的一种。它的优点是升级十分方便，一次升级所有客户端都不需要做任何改变；缺点是性能差一些，容易出现卡顿。

基于B/S结构的客户端缓存要充分利用Local Storage和Session Storage进行数据存储，如用户基本信息、静态参数信息、字典信息等，并通过设置其失效时间来进行更新，减少与服务端的交互。

使用浏览器的Storage存储键值对比Cookie方式更加友好，容量更大。其中Session Storage属于临时存储，只在浏览器的会话期间有效，浏览器关闭则清空；Local Storage属于长期存储，有效期是永久的，浏览器关闭依然保留，一般可存储5MB左右的数据。Local Storage作用域是协议、主机名、端口。 Session Storage作用域是浏览器窗口、协议、主机名、端口。

对于C/S结构的桌面软件和App应用，可以利用设备的内存、磁盘、客户端数据库来缓存更多信息，如页面、图片、视频等静态资源，系统参数、业务流程数据、字典数据等，从而减少与服务端的交互。充分利用HTTP缓存来进行静态页面、图片、CSS样式文件、JavaScript脚本文件的缓存，让静态资源加载得更加迅速。非必要情况下不要禁用HTTP缓存，否则会对性能影响很大。

#### 3. CDN缓存

对于系统中的静态资源访问，主要存在两大问题：网络带宽问题和响应速度问题。

**（1）网络带宽问题。**

在高并发的情况下会出现页面无法打开、资源加载缓慢的情况，机房的主干网络由于大量的资源请求造成拥堵。带宽与网络供应商、网络设备相关，很难实现动态扩容，而且网络带宽升级成本极高，因此要避免用户对于静态资源的大量请求占用机房带宽。

**（2）响应速度问题。**

北京、上海、广东的用户都访问相同的资源文件（如某个页面、音频、视频）。服务器部署在北京机房，因此距离北京的用户最近，网络传输最短，网络冲突损耗最低，所以访问速度也最快，而上海、广东的用户访问就会很慢。

解决这个问题，就需要使用到CDN（Content Delivery Network，内容分发网络）技术。CDN可以让用户的访问模式变为图2-82所示的模式。在北京、上海、广东各自建设资源存储服务器，让各个地区的用户都可以访问距离自己最近的节点去获取静态资源，以此来加快不同地区用户的访问速度。

由于CDN具有加快资源访问速度的能力，因此它也被形象地称为网络加速器。由于资源都存储在用户的边缘，因此这些CDN节点也被称为边缘存储、边缘缓存、边缘服务器。

CDN主要用于缓存静态文件，如网页文件、CSS样式文件、JavaScript脚本文件、图片文件、视频文件、音频文件等。对于电影、音乐、图片等网站，以及大量应用H5技术的互联网系统都会采用CDN技术进行静态资源加速。CDN属于一种基础设置，需要在全国设立存储节点，节点越多则效果越好。因此，一般只有资金雄厚的云服务厂商才能够搭建，企业应用一般是购买这些云服务厂商的CDN服务使用。

由于存储节点遍布全国各地，静态文件的内容如何进行同步就成为一个问题，因此CDN必须具有一个管理节点，负责将资源分发到其他节点。当静态资源发生了更改，就需要将其同步到所有边缘存储节点中，这时就可以在管理节点发起推送动作或刷新动作，更新各个节点的缓存。各种静态资源都可以设置其失效时间，当资源失效后，用户首次访问时，会重新加载该资源。

用户访问静态资源的方式也与使用其他缓存相同，当用户访问某个文件时，会先到距离自己最近的网络设备中查找，如果找到了，则直接返回；如果没有找到，则CDN边缘存储服务器会去管理中心拉取最新文件进行存储，然后再返回给用户。

CDN的节点同步、资源分发是比较耗时的，各个地区的延迟也不相同，有时需要10到20分钟才能保证全国节点同步完毕。

#### 4. 负载缓存

服务端一般都会采用负载均衡做集群部署，在减轻单一服务节点压力的同时，增强系统的可靠性，如图2-84所示。负载设备可以是F5（硬件设备），也可以是LVS、Nginx、HAProxy等软件。为了减少请求穿透到上游服务节点，减轻高并发的压力，就可以在负载节点上做缓存，如果缓存命中了，则直接返回给客户端；如果缓存没有命中，则再去访问上游服务节点，这样就能够最大程度地减少服务请求穿透到上游服务器。需要注意的是，负载缓存一般只针对静态资源做缓存，而不对服务端接口做缓存，因为服务端接口的业务处理和应答消息都是动态变化的。

#### 5. 应用内存级缓存

应用内存级缓存是将信息直接放在应用服务器的内存中，一般采用Map结构进行存储。其优点是存储和读取速度快，主要目的是提高程序的执行效率。

这样，在高并发的场景下能够减少对数据库的访问，提高程序响应速度。其缺点是稳定性差，重启则丢失；存储数据量有限，受内存限制；无法在集群和分布式环境下共用，造成重复缓存。

内存级缓存主要用于对象类和配置类缓存。例如，线程池、对象池、连接池本质上也属于一种内存级缓存技术。把一些大对象、创建比较耗时的对象先存起来，在使用时可以节省创建时间。

在集群架构下，每个节点都有自己的内存缓存，它们相互之间无法共用，并且缓存的内容都是重复的，但是存取速度极快。

在分布式架构下，每个节点也都有自己的内存缓存，缓存的内容各不相同，只缓存与系统本身相关的内容。如图2-92所示，订单服务缓存订单配置信息，用户服务缓存用户配置信息，产品服务缓存产品配置信息，各个服务的缓存也同样无法共用。

内存级缓存的应用极其广泛。例如，线程池、对象池、连接池就是最常用的一种。内存级缓存比较适合小型项目的开发、单体架构的内部系统开发，具有性能高、依赖少、开发快的特点。

#### 6. 中间件缓存

当下主流的缓存中间件有Memcached、Redis等，它们以独立服务的模式存在，主要目的是对数据库进行保护，防止大量的并发请求到达数据库，有效应对高并发。

在集群架构下，客户端的请求经由负载设备被分发到不同的集群节点，所有的节点使用同一个Redis缓存服务。

在分布式架构下，每个服务都可以使用自己独立的缓存服务，也可以共享缓存服务。至于选择哪种模式，还要根据具体的业务和数据量进行分析。如果是小型分布式系统，需要缓存的数据量不大，并且对于缓存的隔离性没有要求，则可以采用共享模式。

如果是大型分布式系统，缓存数据量大，并且具有隔离性要求，则应该采用独立模式。其中隔离性要求是考虑的重点，在共享模式下，所有子系统的数据都缓存在一个Redis服务中，所以数据对所有人可见，存在被修改和删除的风险。

使用中间件缓存需要注意3种问题：**缓存穿透**、**缓存击穿**和**缓存雪崩**。

**（1）缓存穿透。**

缓存穿透属于一种攻击行为，或者严重的程序bug，是指缓存和数据库中都没有指定的数据，而客户端不断发起请求进行查询，导致大量请求到达数据库，使数据库压力过大甚至宕机。例如，经过猜测和轮询验证，发现用户ID为0的数据是不存在的，因此就进行疯狂的攻击调用。

**解决方案：**
- ① 对于缓存和数据库中都不存在的数据，依然存入缓存中，存储的值为NULL、空字符串或空JSON串；
- ② 缓存有效时间设置得短一些，如10~30秒，能够有效应对缓存穿透攻击行为；
- ③ 可以在应用层增加过滤器或切面，或者在单独的Controller层增加校验，对于一些明显不合理的请求参数予以屏蔽。

**（2）缓存击穿。**

缓存击穿是指某个单一热点缓存到期，同时并发请求量巨大，引起数据库压力瞬间剧增，造成过大压力甚至宕机。这就像一面墙上被打了一个洞，因此称为击穿现象。

**解决方案**：系统启动时就要对热点数据进行提前加载，并且设置热点数据永远不过期，需要清除热点缓存时选择在低风险时段清除。

**（3）缓存雪崩。**

缓存雪崩是指大批量的缓存集中过期，而此时并发量较大，从而引起数据库压力过大甚至宕机。由于一个服务的故障，还可能会引起其他服务相继出现问题，就像雪崩一样。

**解决方案**：尽量将缓存设置不同的过期时间，也可以进行随机设置，尽量将过期时间设置在业务低谷时间段。对于热点配置数据，应该设置永不过期。

### 2.3.2 异步化策略

异步化策略是提高系统并发能力的重要方法，它可以有效地提高系统的吞吐量，让系统可以承载更大的业务请求，然后进行消化处理。

异步化策略主要从技术和业务两个层面进行设计。技术层面主要利用线程池、消息队列等异步化技术达到削峰填谷的目的。业务层面主要对复杂的业务流程进行拆分，将大事务拆分为小事务，将大流程拆分为小流程。

#### 1.异步化技术方案

异步化是有效的流量削峰方式，在程序内部可以采用异步线程池、异步回调技术实现。在程序之外可以借助消息中间件实现。

异步方式可以承载大量的并发请求，服务端接收请求后，交由异步线程处理，或者直接丢入消息队列中，然后立即给客户端应答，具有响应速度快、吞吐量高的特点。

在程序开发层面主要利用线程池、响应式编程、事件驱动等技术来达到异步化的目的。

在消息队列模式下，可以通过增加生产者的数量来增加客户端连接数，在高并发的情况下让更多的用户请求接入进来（图2-96）。当消费者处理能力不足时，例如，业务复杂而处理缓慢，可以通过增加消费者的数量来提高业务处理能力。就算无法快速增加消费者节点，也可利用MQ强大的消息缓存能力慢慢处理，而不至于将服务器压垮。

**（1）削峰填谷。**

使用Kafka、RabbitMQ、ActiveMQ、RocketMQ等消息队列中间件，能达到削峰填谷的效果。客户端的请求并不是稳定而持续的，而是有时流量很大，有时流量很小。流量大时可能超出服务的处理能力，流量小时又无法发挥服务的最佳性能。

实线代表使用消息队列之前的请求处理情况，有高有低，有波峰，有波谷。波峰会超出系统处理能力，波谷会浪费服务器性能。使用MQ之后，就可以变为虚线的处理曲线，波峰被削掉，填充到波谷中，形成比较平缓的曲线，从而能够有效地发挥服务性能。使用MQ时一定要保证消费的幂等性，不能造成错序消费、重复消费问题。

**（2）同步、异步、阻塞和非阻塞。**

在异步化中有同步、异步、阻塞和非阻塞4个概念经常容易混淆，下面用一个生活场景来进行说明。

例如，我们要使用洗衣机洗衣服，将所有的衣服、水、洗衣液都已经准备完毕。

第一种方法：启动开关后，洗衣机开始洗衣服，我们就站在洗衣机旁边守着，不断地去看是否洗完了，这就是同步阻塞。

第二种方法：启动开关后，我们就去做别的事情了，但是隔一段时间来看一下是否洗完了，这就是同步非阻塞。

第三种方法：启动开关后，我们就站在旁边守着，但是我们不再去看它是否洗完了，而是洗完之后洗衣机会自动播放音乐，通知我们洗完了，这就是异步阻塞。

第四种方法：启动开关后，我们就去做别的事情了，等衣服洗完后，洗衣机自动播放音乐通知我们，这就是异步非阻塞。

可以看出，异步非阻塞是效率最高的处理方式，客户端响应最快，同时服务器资源利用充分。同步非阻塞对于客户端来说感觉上没有什么变化，依然要主动询问结果，但是对于服务端而言效率得到明显提升。同步阻塞是用得最多的一种方式，大多数的实时接口都采用这种方式。

技术方案和理论知晓了，但是如何在具体的业务场景中使用呢？这就是业务流程异步化架构设计。

#### 2.业务流程异步化

线程池、响应式编程、消息队列等异步化技术只是解决问题的工具，核心是如何将业务流程异步化，这也是架构设计的重点和难点。

### 2.3.3 读写分离策略

大多数的互联网业务都是读多写少，充分利用这个特性可以极大地减轻数据库的压力。对于MySQL、Oracle等关系型数据库，MongoDB等文档型数据库，Redis、Memcached等NoSQL数据库，都可以采用这种策略。

读写分离的原理就是充分利用主从模式同步数据，利用代理模式对客户端请求进行分发。

- 第一种方式是由应用程序本身实现，如果是写入，则使用主库数据源；如果是查询，则使用从库数据源。这涉及语句的判断及数据源的动态切换，实现比较烦琐，但是可控性更好，开发人员可以随意控制规则。

- 第二种方式是借助代理软件，客户端只需要与代理软件进行通信，而不需要知道到底哪个数据库是主库，哪个数据库是从库，数据库的具体部署方式也完全不用关心。代理软件负责数据库请求的连接、解析、转发等。这种方式的好处是分层解耦，服务透明化，客户端无须进行任何代码改动。

## 2.4 大型互联网架构安全性设计

无论是互联网系统还是企业内网系统，无论是B/S架构还是C/S架构的系统，都会面临各种安全性问题。

总体而言，暴露在互联网上的系统面临更多的安全威胁，因此衍生出了各种安全产品网络防火墙、高防IP、网盾等。除采购各种硬件和服务外，重点是要在自己的系统设计上加大安全控制的投入。

安全控制要具有整体性，客户端、网络传输、服务端、数据库各个环节都要进行相应的安全性设计。这涉及代码混淆、App加固、加密签名、认证授权、加密存储、验证码等众多技术细节。本节将对安全性的设计原则和技巧进行整体介绍，后续章节还会继续深入这一问题。

### 2.4.1 安全控制的整体性

系统安全是一个庞大的领域，现在系统的架构形式非常多，可以是浏览器、App、微信、小程序、电视、冰箱等，它们都属于用户网络区，通过家中的路由或运营商基站接入互联网，经过一系列的网络设备转发，经由互联网，最终到达服务端所在的系统网络区（机房/数据中心），又要经过各种网络设备、负载设备，最终到达后端服务，而后端服务又需要与外联系统、数据库、中间件等进行交互，整个交互链条非常复杂。

每个节点、每个链路（两个实体之间的连接线）都要进行安全控制。每个终端设备、每个网络设备、每个服务器都要解决自身的安全性问题，同时也要解决与其他设备交互的安全性问题。

硬件的安全性、网络设备的安全性、应用系统的安全性缺一不可。在进行安全性设计时，必须从整体考虑，某个单点系统再安全、再健壮也是没用的。就好比一个银行的App，后端服务十分健壮安全，然而它忘记了做登录校验功能，谁都可以随意使用。

### 2.4.2 应用系统安全性设计

由于系统开发人员对硬件设备、网络设备等安全不太关注，因此应该由更加专业的网络工程师、硬件工程师负责。开发人员应该重点关注应用系统的安全性设计。

无论是在C/S还是B/S模式下，每个节点都需要进行安全控制。

#### 1. Web端安全控制点

- （1）代码安全：可以进行代码混淆、代码压缩，以降低代码可读性。
- （2）Cookie存储：尽量不存储敏感信息，如果存储，则需要进行加密，必须设置有效期，并设置清空机制。
- （3）Local Storage和Session Storage存储：尽量不存储敏感信息，如果存储，则需要进行加密，并设置清空机制。
- （4）防止SQL注入，防止XSS攻击：严格地进行客户端录入校验，对于有注入风险的内容予以阻止或转义，服务端需要同样的预防措施，一般可以在AOP或过滤器中做统一处理。
- （5）跨域限制：默认不允许跨域，如果需要跨域，则需要严格限定请求来源。
- （6）环境限制：如果页面只允许在微信中调用，则应该做相应控制；如果页面只允许在App中调用，则应该要做相应控制。

#### 2. Android端安全控制点

- （1）代码安全：可以进行代码混淆、代码压缩，以降低代码可读性。
- （2）APK包：需要安全加固，使用第三方付费功能，防止反编译破解，市场上的一些免费加固的实际效果并不理想。
- （3）本地文件、SD卡文件存储：尽量不存储敏感信息，如果涉及敏感信息，则可以对文件进行加密，或者对内容进行二次加密。
- （4）本地数据库：安卓系统自带密钥安全控制，无须额外处理。

#### 3. iOS端安全控制点

- （1）代码安全：可以进行代码混淆、代码压缩，以降低代码可读性。
- （2）安装包：苹果应用商店自动加固，企业版没有加固（可以反编译，市场上还没有加固工具）。
- （3）本地文件存储（包含数据库）：尽量不存储敏感信息，如果涉及敏感信息，则可以对文件进行加密，或者对内容进行二次加密。
- （4）本地数据库：iOS系统自带加密和密钥安全控制，无须额外处理。

#### 4.传输安全

在客户端与服务端交互的过程中，要注意传输过程的安全控制，防止传输内容被窃取或篡改。根据控制的等级不同，可分为低安全级别、中安全级别和高安全级别。

- （1）低安全级别：使用HTTP，明文传输，使用明文与服务端交互，性能好但安全性较差。 
- （2）中安全级别：使用HTTPS，加密传输，使用明文与服务端交互，性能中等但安全性较高，可以防止网络嗅探（网络嗅探就是网络抓包，可以看到所有在网络上传输的内容）。
- （3）高安全级别：使用HTTPS，加密传输，与服务端的交互数据进行加密和签名，可以防止网络嗅探、数据泄露和篡改。

加密和签名交互流程分为以下4个步骤。

- （1）客户端将请求报文进行加密，然后进行签名，以密文的形式请求服务端。
- （2）服务端接收到加密的报文后，先进行验证签名，然后进行解密。如果验证签名不通过，则说明内容可能被非法篡改；如果无法解密，则说明对方使用了错误的密钥。
- （3）服务端将应答信息同样进行先加密后签名的处理，以密文的形式应答给客户端。
- （4）客户端收到服务端应答之后，同样进行验证签名和解密处理。

### 2.4.3 数据安全性设计

数据安全性设计需要遵循3个原则：数据脱敏原则、数据加密原则和数据隔离原则。

#### 1.数据脱敏原则

敏感数据一定要进行脱敏展示。脱敏是指用掩码、截取等方式避免展示全部数据内容。例如，用户的身份证号、银行卡号、手机号等，展示为“152***********1233”“身份证号尾号为1233”“银行卡尾号9899”“手机尾号9527”的方式。

数据脱敏必须从后端服务脱敏，而不能采用前端JavaScript脱敏（假脱敏），因为通过查看页面源码和交互信息很容易获取到用户敏感数据。

对于内部管理系统，有关用户信息的报表能不展示用户敏感信息的就不展示，如果必须展示，则尽量脱敏；如果必须原文展示，则需要记录详尽的访问日志，哪个用户查询过此报表，谁导出过数据，以便日后追查。

#### 2.数据加密原则

对于安全等级较高的数据，可以采用加密存储和分片存储的方式。

如账户的密码需要加密存储，可采用哈希算法加密存储（其他密码安全措施可参见5.3节）。

如用户的图片、视频、机密文件等重要数据，可以拆分为多份，存储在不同服务器的不同位置，在使用时才合并在一起。

如用户的聊天记录等私密信息也要先加密，再分散存储。

#### 3.数据隔离原则

用户之间的私有数据一定要相互隔离，自己只能访问自己的数据，防止数据越权访问。