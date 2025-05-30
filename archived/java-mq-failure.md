---
title: 如何处理 MQ 消费失败的消息？
date: 2024-10-06
---

# 如何处理 MQ 消费失败的消息？

## 01、背景介绍

请大家想一下，我们为何项目中要引用 MQ 消息中间件？

我们知道，在电商平台中常见的用户下单，会经历以下几个流程。

当用户下单时，创建完订单之后，会调用第三方支付平台，对用户的账户金额进行扣款，如果平台支付扣款成功，会将结果通知到对应的业务系统，接着业务系统会更新订单状态，同时调用仓库接口，进行减库存，通知物流进行发货！

![MQ-image1](https://mmbiz.qpic.cn/mmbiz_jpg/W6hztuXHKU4ibQdHicvPqYDmQ6vtpiaMvMk6uicJmOdoSLe6dfpics02jr8VI45Uko6etNG8yhK0KtyCgrCYE7l5I0g/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

试想一下，从订单状态更新、到扣减库存、通知物流发货都在一个方法内同步完成，假如用户支付成功、订单状态更新也成功，但是在扣减库存或者通知物流发货步骤失败了，那么就会造成一个问题，用户已经支付成功了，只是在仓库扣减库存方面失败，从而导致整个交易失败！

一单失败，老板可以假装看不见，但是如果上千个单子都因此失败，那么因系统造成的业务损失，将是巨大的，老板可能坐不住了！

因此，针对这种业务场景，架构师们引入了异步通信技术方案，从而保证服务的高可用，大体流程如下：

![MQ-image2](https://mmbiz.qpic.cn/mmbiz_jpg/W6hztuXHKU4ibQdHicvPqYDmQ6vtpiaMvMkGUT89nP4Y4AIRQbkdqFeLUXfm5hp0icDyC5f4M5tRHVWeiakt68ic0SfQ/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

当订单系统收到支付平台发送的扣款结果之后，会将订单消息发送到 MQ 消息中间件，同时也会更新订单状态。

在另一端，由仓库系统来异步监听订单系统发送的消息，当收到订单消息之后，再操作扣减库存、通知物流公司发货等服务！

在优化后的流程下，即使扣减库存服务失败，也不会影响用户交易。

**正如《人月神话》中所说的，软件工程，没有银弹！**

当引入了 MQ 消息中间件之后，同样也会带来另一个问题，假如 MQ 消息中间件突然宕机了，导致消息无法发送出去，那仓库系统就无法接受到订单消息，进而也无法发货！

针对这个问题，业界主流的解决办法是采用**集群部署，一主多从模式**，从而实现服务的高可用，即使一台机器突然宕机了，也依然能保证服务可用，在服务器故障期间，通过运维手段，将服务重新启动，之后服务依然能正常运行！

但是还有另一个问题，假如仓库系统已经收到订单消息了，但是业务处理异常，或者服务器异常，导致当前商品库存并没有扣减，也没有发货！

这个时候又改如何处理呢？

今天我们所要介绍的正是这种场景，假如消息消费失败，我们应该如何处理？

## 02、解决方案

针对消息消费失败的场景，我们一般会通过如下方式进行处理：

- 当消息消费失败时，会对消息进行重新推送 
- 如果重试次数超过最大值，会将异常消息存储到数据库，然后人工介入排查问题，进行手工重试

![MQ-image3](https://mmbiz.qpic.cn/mmbiz_jpg/W6hztuXHKU4ibQdHicvPqYDmQ6vtpiaMvMkib1tWicgGm32ZPcqCiaqZRIicfJUyhQ3ib04CjmeK8hichEQTYS9vG1M5O5Q/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

当消息在客户端消费失败时，我们会将异常的消息加入到一个消息重试对象中，同时设置最大重试次数，并将消息重新推送到 MQ 消息中间件里，当重试次数超过最大值时，会将异常的消息存储到 `MongoDB` 数据库中，方便后续查询异常的信息。

基于以上系统模型，我们可以编写一个公共重试组件，话不多说，直接干！

## 03、代码实践

本次补偿服务采用 rabbitmq 消息中间件进行处理，其他消息中间件处理思路也类似！

### 3.1、创建一个消息重试实体类

```java
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class MessageRetryDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 原始消息body
     */
    private String bodyMsg;

    /**
     * 消息来源ID
     */
    private String sourceId;

    /**
     * 消息来源描述
     */
    private String sourceDesc;

    /**
     * 交换器
     */
    private String exchangeName;

    /**
     * 路由键
     */
    private String routingKey;

    /**
     * 队列
     */
    private String queueName;

    /**
     * 状态,1:初始化，2：成功，3：失败
     */
    private Integer status = 1;

    /**
     * 最大重试次数
     */
    private Integer maxTryCount = 3;

    /**
     * 当前重试次数
     */
    private Integer currentRetryCount = 0;

    /**
     * 重试时间间隔（毫秒）
     */
    private Long retryIntervalTime = 0L;

    /**
     * 任务失败信息
     */
    private String errorMsg;

    /**
     * 创建时间
     */
    private Date createTime;

    @Override
    public String toString() {
        return "MessageRetryDTO{" +
                "bodyMsg='" + bodyMsg + '\'' +
                ", sourceId='" + sourceId + '\'' +
                ", sourceDesc='" + sourceDesc + '\'' +
                ", exchangeName='" + exchangeName + '\'' +
                ", routingKey='" + routingKey + '\'' +
                ", queueName='" + queueName + '\'' +
                ", status=" + status +
                ", maxTryCount=" + maxTryCount +
                ", currentRetryCount=" + currentRetryCount +
                ", retryIntervalTime=" + retryIntervalTime +
                ", errorMsg='" + errorMsg + '\'' +
                ", createTime=" + createTime +
                '}';
    }

    /**
     * 检查重试次数是否超过最大值
     *
     * @return
     */
    public boolean checkRetryCount() {
        retryCountCalculate();
        //检查重试次数是否超过最大值
        if (this.currentRetryCount < this.maxTryCount) {
            return true;
        }
        return false;
    }

    /**
     * 重新计算重试次数
     */
    private void retryCountCalculate() {
        this.currentRetryCount = this.currentRetryCount + 1;
    }
}
```

### 3.2、编写服务重试抽象类

```java
public abstract class CommonMessageRetryService {
    private static final Logger log = LoggerFactory.getLogger(CommonMessageRetryService.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 初始化消息
     *
     * @param message
     */
    public void initMessage(Message message) {
        log.info("{} 收到消息: {}，业务数据：{}", this.getClass().getName(), message.toString(), new String(message.getBody()));
        try {
            //封装消息
            MessageRetryDTO messageRetryDto = buildMessageRetryInfo(message);
            if (log.isInfoEnabled()) {
                log.info("反序列化消息:{}", messageRetryDto.toString());
            }
            prepareAction(messageRetryDto);
        } catch (Exception e) {
            log.warn("处理消息异常，错误信息：", e);
        }
    }

    /**
     * 准备执行
     *
     * @param retryDto
     */
    protected void prepareAction(MessageRetryDTO retryDto) {
        try {
            execute(retryDto);
            doSuccessCallBack(retryDto);
        } catch (Exception e) {
            log.error("当前任务执行异常，业务数据：" + retryDto.toString(), e);
            //执行失败，计算是否还需要继续重试
            if (retryDto.checkRetryCount()) {
                if (log.isInfoEnabled()) {
                    log.info("重试消息:{}", retryDto.toString());
                }
                retrySend(retryDto);
            } else {
                if (log.isWarnEnabled()) {
                    log.warn("当前任务重试次数已经到达最大次数，业务数据：" + retryDto.toString(), e);
                }
                doFailCallBack(retryDto.setErrorMsg(e.getMessage()));
            }
        }
    }

    /**
     * 任务执行成功，回调服务(根据需要进行重写)
     *
     * @param messageRetryDto
     */
    private void doSuccessCallBack(MessageRetryDTO messageRetryDto) {
        try {
            successCallback(messageRetryDto);
        } catch (Exception e) {
            log.warn("执行成功回调异常，队列描述：{}，错误原因：{}", messageRetryDto.getSourceDesc(), e.getMessage());
        }
    }

    /**
     * 任务执行失败，回调服务(根据需要进行重写)
     *
     * @param messageRetryDto
     */
    private void doFailCallBack(MessageRetryDTO messageRetryDto) {
        try {
            saveMessageRetryInfo(messageRetryDto.setErrorMsg(messageRetryDto.getErrorMsg()));
            failCallback(messageRetryDto);
        } catch (Exception e) {
            log.warn("执行失败回调异常，队列描述：{}，错误原因：{}", messageRetryDto.getSourceDesc(), e.getMessage());
        }
    }

    /**
     * 执行任务
     *
     * @param messageRetryDto
     */
    protected abstract void execute(MessageRetryDTO messageRetryDto);

    /**
     * 成功回调
     *
     * @param messageRetryDto
     */
    protected abstract void successCallback(MessageRetryDTO messageRetryDto);

    /**
     * 失败回调
     *
     * @param messageRetryDto
     */
    protected abstract void failCallback(MessageRetryDTO messageRetryDto);

    /**
     * 构建消息补偿实体
     * @param message
     * @return
     */
    private MessageRetryDTO buildMessageRetryInfo(Message message){
        //如果头部包含补偿消息实体，直接返回
        Map<String, Object> messageHeaders = message.getMessageProperties().getHeaders();
        if(messageHeaders.containsKey("message_retry_info")){
            Object retryMsg = messageHeaders.get("message_retry_info");
            if(Objects.nonNull(retryMsg)){
                return JSONObject.parseObject(String.valueOf(retryMsg), MessageRetryDTO.class);
            }
        }
        //自动将业务消息加入补偿实体
        MessageRetryDTO messageRetryDto = new MessageRetryDTO();
        messageRetryDto.setBodyMsg(new String(message.getBody(), StandardCharsets.UTF_8));
        messageRetryDto.setExchangeName(message.getMessageProperties().getReceivedExchange());
        messageRetryDto.setRoutingKey(message.getMessageProperties().getReceivedRoutingKey());
        messageRetryDto.setQueueName(message.getMessageProperties().getConsumerQueue());
        messageRetryDto.setCreateTime(new Date());
        return messageRetryDto;
    }

    /**
     * 异常消息重新入库
     * @param retryDto
     */
    private void retrySend(MessageRetryDTO retryDto){
        //将补偿消息实体放入头部，原始消息内容保持不变
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setContentType(MessageProperties.CONTENT_TYPE_JSON);
        messageProperties.setHeader("message_retry_info", JSONObject.toJSON(retryDto));
        Message message = new Message(retryDto.getBodyMsg().getBytes(), messageProperties);
        rabbitTemplate.convertAndSend(retryDto.getExchangeName(), retryDto.getRoutingKey(), message);
    }

    /**
     * 将异常消息存储到mongodb中
     * @param retryDto
     */
    private void saveMessageRetryInfo(MessageRetryDTO retryDto){
        try {
            mongoTemplate.save(retryDto, "message_retry_info");
        } catch (Exception e){
            log.error("将异常消息存储到mongodb失败，消息数据：" + retryDto.toString(), e);
        }
    }
}
```

### 3.3、编写监听服务类

在消费端应用的时候，也非常简单，例如，针对扣减库存操作，我们可以通过如下方式进行处理！

```java
@Component
public class OrderServiceListener extends CommonMessageRetryService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceListener.class);

    /**
     * 监听订单系统下单成功消息
     * @param message
     */
    @RabbitListener(queues = "mq.order.add")
    public void consume(Message message) {
        log.info("收到订单下单成功消息: {}", message.toString());
        super.initMessage(message);
    }


    @Override
    protected void execute(MessageRetryDTO messageRetryDto) {
        //调用扣减库存服务，将业务异常抛出来
    }

    @Override
    protected void successCallback(MessageRetryDTO messageRetryDto) {
        //业务处理成功，回调
    }

    @Override
    protected void failCallback(MessageRetryDTO messageRetryDto) {
        //业务处理失败，回调
    }
}
```

当消息消费失败，并超过最大次数时，会将消息存储到 mongodb 中，然后像常规数据库操作一样，可以通过web接口查询异常消息，并针对具体场景进行重试！

## 04、小结

可能有的同学会问，为啥不将异常消息存在数据库？

起初的确是存储在 MYSQL 中，但是随着业务的快速发展，订单消息数据结构越来越复杂，数据量也非常的大，甚至大到 MYSQL 中的 text 类型都无法存储，同时这种数据结构也不太适合在 MYSQL 中存储，因此将其迁移到 mongodb！

本文主要围绕消息消费失败这种场景，进行基础的方案和代码实践讲解，如果有描述不对的地方，欢迎大家留言指出！

## 05、参考

- https://blog.csdn.net/qq_42046105/article/details/114156904
