---
title: 3.分布式微服务架构设计(三)
date: 2024-10-28
tags: [ReadingNotes]
---

# 3.分布式微服务架构设计(三)

## 3.13 章节练习

### 1.微服务是一种什么技术？

这是典型的陷阱题，微服务并不是一种技术，而是一种架构风格和解决方案。

### 2.微服务架构的演变过程是什么？

单体架构/集群架构 -> SOA架构/ESB架构 -> 微服务架构。

### 3. SOA架构/ESB架构与微服务架构的区别是什么？

微服务架构是SOA架构更加细粒度的拆分，两者都属于多服务协作的分布式架构。ESB架构是SOA架构的一种实现方式，但是由于ESB的引入导致SOA产生了中心化问题，而微服务架构是提倡去中心化的。SOA架构的目的是更好地做系统集成，微服务架构的目的是更好地做系统拆分，两者相辅相成。

### 4.微服务架构的优缺点分别是什么？

微服务架构的优点：分布式去中心化；服务伸缩性更好；服务自治能力；服务内聚更高，耦合更低；敏捷开发；异构开发；对硬件要求降低。 

微服务架构的缺点：拆分粒度难以界定；增加了运维难度；交易流程变得复杂；网络延迟增加。

### 5.服务注册与发现是什么，它能解决哪些问题？

服务注册：当微服务启动时，将自己本机的IP地址、端口、服务名称等元数据信息发送至注册中心。

服务发现：当微服务需要调用其他微服务时，可以从注册中心及本地注册表获取到其他服务的IP地址、端口、服务名称等信息进行调用。服务注册与发现实现了服务的自我感知，可以随时增加微服务节点进行水平扩展。当服务发生故障时，可以自动剔除节点，从而达到自治的效果，让整个系统的可用性和伸缩性变得更高。当服务的IP地址、端口等信息发生变化时，也不需要调整代码。

### 6.注册中心怎样高可用？

思想还是利用冗余、数据同步和故障转移技术。

例如，Eureka可以部署多个服务节点，节点之间相互复制，多个节点同时对外提供服务，当某个节点发生故障时，则剔除故障节点。

Nacos、Consul、Zookeeper也可以部署多个节点，节点之间数据相互复制，同时使用选举算法确定Leader和Slave服务，保障服务高可用和故障自动转移。

### 7.注册中心是怎样检测服务是否正常的？

心跳检查机制，注册中心会定期地向所有微服务节点发送心跳检查请求，如果微服务能够正常应答，则代表服务正常；如果微服务多次无法应答，并且达到设定的阈值，则认为服务已经不可用，从而将其从注册表中剔除。

还有一种方式是反向的过程，由各个微服务主动向注册中心报告自己的健康状况。如果注册中心在一定时间内收到的报告小于某个阈值，则认为服务已经不可用，从而将其从注册表中剔除。

### 8.客户端负载均衡和服务端负载均衡有什么区别？

客户端负载均衡：由客户端根据负载算法直接请求目标服务器，整个过程在客户端完成，无须借助其他负载硬件或软件。

服务端负载均衡：需要借助负载硬件或软件，由负载均衡器根据算法选择将请求转发给特定的微服务。

### 9.微服务架构中客户端负载均衡的实现原理是什么？

当某个微服务需要调用其他微服务时，先根据被调用方的服务名称获取到它的所有服务列表。例如，被调用的服务部署了3台服务器，则返回3个IP地址和端口，这时客户端就可以根据负载策略进行选择，再将请求发送至选定的服务即可。

### 10.微服务架构中客户端负载均衡策略有哪些？

轮询策略、最小并发数策略、最小连接数策略、可用性过滤策略、响应时间权重策略、重试策略、随机策略、可用区域策略。每种策略的作用可参见3.5节。

### 11.微服务中熔断的作用是什么？

熔断的作用类似于保险丝，对系统起到一种保护作用，提高系统的容错性，当系统发生故障时，避免情况恶化和扩散。

避免复杂分布式系统中服务失效所引发的雪崩效应，在大型的分布式系统中，存在各种复杂的依赖关系。如果某个服务失效，则很可能会对其他服务造成影响，形成连锁反应。

### 12.服务降级、回退（Fallback）是什么？

当某个接口服务因压力过大、故障等原因导致频繁的响应超时时，就可能触发熔断。为了保证交易的完整性，可以返回一个预先设置好的应答消息，如“当前服务繁忙，请稍后再试”，这就是Fallback。这样会造成用户体验下降，但是却避免了服务发生雪崩，影响其他微服务，这种容错机制就是服务降级，Fallback是实现服务降级的一种方式。

### 13.网关都有哪些功能？

网关主要具有八大功能：身份验证和安全、洞察和监测、动态路由、压力测试、服务限流、负载分配、静态资源代理、多区域弹性。详细说明可参见3.7.2小节。

### 14.如果微服务架构中所有服务调用都必须通过网关中转，有什么优缺点？

- 优点：可以利用网关的身份验证、安全控制、日志记录、访问限流功能，减少其他微服务的开发量，做到接口调用的统一过滤与管理。

- 缺点：会使微服务架构变为类似ESB的集中式架构，当网关发生故障时，就会影响全部的微服务，降低系统稳定性。同时，由于服务调用比点对点调用多经过了一个节点，因此会导致网络延迟增加。

### 15. Nginx是否也可以作为微服务的网关使用？

Nginx同样具有反向代理、负载均衡、服务限流、故障转移能力，因此它也可以作为微服务的网关使用。


## 3.14 案例设计

### 1. 场景设计题：大型互联网电商微服务案例设计

请使用微服务架构设计一个大型互联网电商系统，系统要满足如下要求。

- 类似于淘宝，要同时支持个人的商品购买、商家的产品上下架和日常运营。
- 个人用户要具有搜索和查看商品、下单支付、维护订单、查看物流、评价等功能。
- 商家用户要具有商品上下架、库存管理、发货、物流管理、活动促销等功能。
- 系统要具有99.99%的极高可用性，同时支持秒杀、活动大促等高并发场景。
- 商家产品、用户评论都要支持文字、图片、视频形式。
- 支撑日活用户量达到5亿级别。如果您作为企业的系统架构师，会怎样进行系统设计，需要考虑哪些内容？

### 2. 设计思路指引

- 按照微服务的架构特点，先进行主题域的抽象，主要涉及用户、商品、库存、支付、订单、物流、评价、营销几大主题域。所以，微服务的划分也主要按照主题域进行拆分，可分为用户、商品、库存、支付、订单、物流、评价、营销共8个微服务群。

- 每个微服务群都应该具有自己独立拆分的数据库，根据各自微服务的特点可以采用不用的数据库存储结构。主要采用关系型数据库，以全文检索数据库、文档型数据库作为辅助，以支撑海量的评论信息、图片介绍信息、商品检索信息的存储。

- 除八大业务微服务外，还涉及用户的认证授权，短信、邮件、消息的发送，系统的监控，链路追踪，服务网关，配置管理。因此，还要加入认证中心、消息中心、监控中心、链路追踪、网关、配置中心共六大公共微服务。

- 系统要求具有极高的可用性，因此微服务要采用无状态开发，各节点必须进行水平扩展，并借助容器化技术进行快速的持续集成和部署。

- 系统中存在大量的图片、视频等静态资源文件的存储和查询，因此应该采用对象存储、分布式文件存储，提高存储的水平扩展能力，同时使用CDN提高全国各地用户的访问速度，并减轻服务端压力。

- 系统存在秒杀、活动大促等高并发访问情况，因此系统必须采用多级缓存策略。在活动开始前进行数据预热，将热点数据加载到缓存中以应对高并发请求。

- 系统必须具有熔断降级能力，避免某个微服务故障导致系统发生雪崩。

- 由于日活用户量巨大，同时具有海量的产品信息，因此数据库必须采用伸缩性设计，或者进行节点预留，提前进行分库分表。

- 库存、订单、支付数据库要求具有较高的一致性，需要重点解决分布式事务问题，互联网电商系统的可用性要更加重要，因此一般采用最终一致性的解决方案，并不使用强事务。

- （10）系统会产生海量的程序日志，为了便于日志的使用，应该进行日志采集、清洗、存储、分析的架构设计。
