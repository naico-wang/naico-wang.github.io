---
title: 计算机操作系统 - 基础知识
date: 2024-10-19
category: Operation System
tag: Operation System
abstract: 计算机操作系统 - 基础知识
---

# 操作系统基础

## 引论

### 并发与并行

> 操作系统都具有并发性、共享性、虚拟性、不确定性等共同特征，其中，并发是操作系统中最重要的特征，其他三个特征都是以并发为前提的；

并发：从宏观上看，这些进程是同时进行并向前推进的，从微观讲，任何时刻只能有一个进程执行，如果在单 CPU 条件下，那么这些进程就是在 CPU 上交替执行的；

**区别：**

并发和并行是两个不同的概念，并发是指两个或多个程序在同一时间段内同时执行，即宏观上并行，微观上串行；而并行性则是指同时执行，如不同硬件(CPU 与 IO 设备)同时执行。

**补充：**

共享性：

> 在内存中并发执行的多个进程可以同时使用系统中的资源（包括硬件资源和信息资源）。

- 互斥使用方式
- 同时使用方式

虚拟性

异步性(不确定性)

- 每个进程在多少时间内完成都是不可预知的；
- 并发进程的执行结果也可能不确定；
- 外部设备中段断、I/O 请求、程序运行时发生中断的时间等都是不可预测的；

### 系统调用

> 隐藏了底层硬件的物理特性差异和复杂的处理细节，并向上提供方便、有效和安全的接口；
>
> 操作系统内核提供了一组具有特定功能的内核函数，并通过一组称为系统调用的接口呈现给用户使用；

系统调用通常而称为陷阱，主要功能：

- 产生一个访管中断，把 CPU 工作状态由原来的用户态转换为内核态；
- 执行对应的系统调用子程序（内核函数）；
- 系统调用子程序运行完成后将 CPU 工作状态切换回用户态；

实现过程：

- 系统产生软中断，CPU 由用户态切换为内核态，保存用户程序的现场信息；

- 分析功能号并在入口地址地址表中查找对应的系统调用子程序（内核函数），有时还需要进行安全控制检查；

- 执行系统调用子程序并得到结果；

- 恢复用户程序的现场信息，CPU 切换回用户态并返回结果，必要时进行安全检查；

  ![image-20220108181023530](https://oss.justin3go.com/blogs/image-20220108181023530.png)

  > 此外，对于单用户、单任务操作系统(DOS)来说，只有在一个系统调用执行完成后，才能开始对另一个系统调用，即“内核不可重入”

### 用户态与核心态

- 内核态
  - 特点：指操作系统程序运行的状态，在该状态下可以执行操作系统的所有指令（包括特权指令），并能够使用系统的全部资源；
  - 优势：访问的资源多；
  - 缺点：可靠性、安全性要求高，维护管理比较复杂；
- 用户态
  - 特点：指用户程序运行的状态，在该状态下所能执行的指令和访问的资源都将受到限制；
  - 优势：可靠性、安全性要求低，编写程序和维护管理都比较简单；
  - 缺点：访问的资源有限；
- 举例：文件系统本身的管理必须放在内核态下，否则人格人都有可能破坏文件系统的结构，用户文件（程序和数据）的管理则可以放在用户态下；
- 内核态与用户态的转换：
  - 中断和异常时 CPU 从用户态转换到内核态的唯一途径；
  - 当 CPU 处于内核态时，可以通过修改程序状态字（PSW）直接进入用户态运行；
  - 当 CPU 处于用户态时，如果需要切换到内核态则一般是通过访管指令或系统调用来实现；
  - 访管指令和系统调用的主要功能：
    - 通过中断实现从用户态到内核态的改变；
    - 在内核态下由操作系统代替用户完成其请求（用户指定的操作）；
    - 操作系统完成指定操作后再修改程序状态字(PSW)由内核态切换回用户态；
- 补充：PSW 主要用来控制指令的执行顺序，并保留与运行程序相关的各种信息；

### 其他

- 什么是操作系统？

  操作系统是驾驭计算机硬件和应用软件之间的一个软件系统，即操作系统的下面是硬件平台，而上面是软件平台。

- 操作系统是掌控计算机上所有事情的系统软件，它需要完成以下 5 种功能：

  - 控制和管理计算机系统的所有硬件和软件资源；
  - 合理组织计算机的工作流程，保证计算机资源的公平竞争和使用；
  - 方便用户使用计算机；
  - 防止对计算机资源的非法侵占和使用；
  - 保证操作系统自身的正常运转

- 操作系统的逻辑结构

  - 单内核结构
    - 内核在结构上可以看成一个整体，操作系统运行在内核态下，内核代码高度集成；
    - 优点：结构紧密，模块间可以方便地组合以满足不同地需求，灵活性较好，效率高；
    - 缺点：对模块功能的划分往往不能精确确定，模块的独立性较差；模块之间的调用关系复杂，导致系统结构不清晰正确性和可靠性不容易保证，系统维护也比较困难；
  - 分层式结构
    - 优点：模块之间的依赖、调用关系更加清晰和规范；
    - 系统的效率会受到一定的影响；
  - 微内核结构
    - 仅将系统的一部分核心功能放如内核；
    - 只完成极少的核心态任务，如进程管理和调度、内存管理、消息传递和设备驱动等，内核构成了操作系统的基本部分；
    - 优点：
      - 为进程的请求提供了一致性接口，不必区分内核级服务和用户级服务，所有服务均采用消息传递机制提供；
      - 具有较好的科扩充性和易修改性；
      - 可移植性好；
      - 对分布式系统提供有力支持；
    - 缺点：虽然运行效率比分层式结构有所提升，但仍然不够高，这是因为进程之间必须通过内核的通信机制才能相互通信；

- 中断技术

  - 中断机制是实现多道程序并发执行的重要条件，能改变操作的执行顺序；

  - 特点：随机、可恢复、自动处理；

  - 中断向量：每个中断有一个唯一的与其对应的中断向量号（通常为中断类型号），并按照中断向量号从小到大的顺序放在中断向量表中，因此系统可以根据中断向量的不同，来为中断请求提供不同的中断服务；

  - 检测中断的硬件机构：中断扫描机构

  - 中断发现过程：

    ![image-20220108165007571](https://oss.justin3go.com/blogs/image-20220108165007571.png)

  - 中断处理过程包括硬件操作和中断处理程序操作两部分：

    ![image-20220108164829508](https://oss.justin3go.com/blogs/image-20220108164829508.png)

  - 中断处理过程;

    ![image-20220108165318419](https://oss.justin3go.com/blogs/image-20220108165318419.png)

## 处理器管理

### 进程概念

定义：进程是一个可并发执行的、具有独立功能的程序关于某个数据集合的一次执行过程，也是操作系统进行资源分配和保护的基本单位；

PCB：一个数据结构，用来存储程序向前推进的执行过程中所要记录的有关运行信息，即该进程动态执行的相关资源；

特征：

- 动态性
- 并发性
- 独立性
- 异步性
- 结构性

进程与程序的区别：进程是正在执行的程序；

### 进程基本状态转换图及转换原因

##### 两态模型

运行->非运行

##### 三态模型

![image-20220108185600838](https://oss.justin3go.com/blogs/image-20220108185600838.png)

重点：哪些可以转换，哪些不能转换：

- 进程由就绪态变迁到运行态是由进程调度程序完成的；
- 运行变迁到阻塞状态，通常是由运行进程自身提出的
- 进程由阻塞状态变迁为就绪态总是由外界事件引起的。因为处于阻塞状态的进程没有任何活动能力；
- 进程由运行状态变为就绪状态通常在分时操作系统中出现；
- 进程不能由阻塞状态直接变迁到运行状态；

##### 五态模型

> 引入了创建状态和终止状态

![image-20220108190426184](https://oss.justin3go.com/blogs/image-20220108190426184.png)

新增了三个进程状态变迁：

- 由空到创建状态；
- 由创建状态变迁到就绪状态；
- 运行状态变迁到终止状态；

##### 进程的挂起

> 采用交换技术将内存中的进程暂时移出保存到外存；

进程挂起的原因：

- 用户的请求；
- 父进程的请求；
- 操作系统的原因：
  - 交换：内存不足，需要平衡系统负载；
  - 出现问题或故障时；
  - 操作系统的需要，为监视系统的活动；

![image-20220108193627760](https://oss.justin3go.com/blogs/image-20220108193627760.png)

增加了 6 种状态转换关系：

总体来说就是多了内存空间不足的处理，其他和三态一致；

![image-20220108215953004](https://oss.justin3go.com/blogs/image-20220108215953004.png)

### 进程并发运行的实质

##### 程序的顺序执行特点：

- 顺序性
- 封闭性
- 可再现性
- 不能并行工作，资源利用率低，计算机系统效率不高；

##### 程序的并发执行:

> 在计算机硬件引入通道和中断机构后，就使得 CPU 与外部设备之间，以及外部设备与外部设备之间可以并行操作；
>
> 资源共享一方面提高了资源的利用率，另一方面却引发了多个并发程序对资源的竞争；

- 间断性
- 失去了封闭性
- 不可再现性

### 调度算法

> 分析多进程的调度情况，计算平均周转时间、带权周转时间

周转时间

- 周转时间$T_i$=完成时间-提交时间；
- 周转时间$T_i$=运行时间+等待时间；

带权周转时间（越大越不公平）

- 带权周转时间$W_i$=周转时间/运行时间=1+等待时间/运行时间

平均周转时间

- ![image-20220108205327919](https://oss.justin3go.com/blogs/image-20220108205327919.png)

平均带权周转时间

- ![image-20220108205400125](https://oss.justin3go.com/blogs/image-20220108205400125.png)

响应时间：提交一个请求开始，知道系统首次产生响应为止的时间间隔；

截止时间：某实时任务必须完成的最迟时间；

##### 先来先服务(FCFS)

- 优点：实现简单，保证了一定的公平性；
- 没有考虑作业的类型和进程/线程执行时间的长短，短作业或 IO 进程/线程等待时间过长；
- ![image-20220108205842310](https://oss.justin3go.com/blogs/image-20220108205842310.png)

##### 短作业优先(SJF/SPF)

- 每次从后备作业队列中，选择估计运行时间最短的作业进入内存，并创建相应的进程；
- 优点：有效地降低作业/进程地平均等待时间、提高系统的吞吐量（单位时间内完成工作的一种度量）；
- 缺点：预估时间不一定准确，长作业/长进程可能长时间等待而得不到运行；
- ![image-20220108210143285](https://oss.justin3go.com/blogs/image-20220108210143285.png)

##### 最短剩余时间优先

剩余时间越短优先级越高

##### 高响应比优先(HRRF)

- 动态优先数的非抢占式调度算法

- 其中的优先数也称为响应比$R_p$

- $$
  R_p = 响应时间/运行时间=1+等待时间/运行时间
  $$

  其中等待时间在变，而运行时间需要预估；

- 优点：既照顾短作业/短进程，又不会使长作业/长进程等待时间过长；

- 缺点：需要预估运行时间；需要计算响应比，会消耗不少的 CPU 时间；

- ![image-20220108213308331](https://oss.justin3go.com/blogs/image-20220108213308331.png)

##### 静态优先级()

作业/进程在进入系统或创建时被赋予一个优先级，该优先级一旦确定则在整个生命期内不再改变。对于作业，其优先级可依据费用来确定；对于进程，其优先级主要依据进程的类型（系统进程还是用户进程）、进程的资源需求（资源需求少的进程优先级高）、时间需求（短进程优先）和用户要求来确定；

- 优点：简单，系统开销小；
- 缺点：不够公平也不灵活；

##### 时间片轮转(RR)

- 进程/线程每次使用 CPU 的时间只能是一个时间片，当运行进程/线程用完规定的时间片时必须放弃 CPU 的使用权；
- 时间片很长：则可能大多数进程/线程都能在一个时间片内完成，退化为 FCFS 调度算法；
- 时间片很短：切换频繁，消耗系统资源；
- 实际上是一种基于时钟的抢占式调度算法；

### 线程的概念

> 引入线程后，进程就仅仅是资源的基本单位

线程：CPU 调度和执行的最小单位

其他提法（便于理解）

- 进程内的一个执行单元；
- 进程内的一个可独立调度实体；
- 线程是进程中一个相对独立的控制流序列；
- 线程是执行的上下文；

线程具有以下 4 个属性：

- 线程属于轻型实体，基本不拥有系统资源，只拥有保证其运行而必不可少的资源。如仅有一个线程控制块（TCB）、程序计数器（PC）、一组寄存器及堆栈等；
- 线程是独立调度和分配的基本单位，也是能够独立运行的基本单位；
- 同一个进程中的所有线程共享该进程所拥有的全部资源；
- 不同进程的多个线程也可以并发执行；

其他：

- 线程也有生命周期；
- 由于线程不是资源的拥有单位，因此挂起状态对单个线程没有意义（挂起状态是进程级，而不是线程级）
- 线程终止后并不立即释放它所占用的系统资源；

## 进程同步与通信

> - 间接制约关系：资源共享；
> - 直接制约关系：进程间合作；
> - 进程同步：若干进程为完成一个共同的任务而合作；
> - 进程互斥：某一资源同一时间只允许一个进程对其进行访问；
> - 临界资源：一段时间内只允许一个进程使用的资源称为临界资源；
> - 把进程中访问临界资源的代码称为临界区；

### 进程同步或互斥的解决方案

##### 硬件方法（了解）

- 开中断指令
- 测试与设置指令 TS
- 交换指令

##### 软件方法（能想出来具体代码）

- 两标志进程互斥算法；
- 改进后的两标志进程互斥算法；
- 三标志进程互斥算法；

### 解决互斥问题应遵循的四个准则

- 空闲让进；
- 忙则等待
- 有限等待；
- 让权等待；

### 用信号量解决基本的进程同步或互斥问题

- 司机进程与售票员进程；
- 两进程的三态模型；
- 生产者-消费者问题；
- 哲学家进餐问题；
- 读者-写者问题

### 进程通信

进程的独立性造成了进程之间无法直接交换数据，而需要借助进程通信机制来实现；

- 发送、接收双方经过实现约定，利用磁盘等外存设备由发送进程 A 把要交换恶的数据写入外存的指定区域中
- 利用内核运行在内核的特点，发送进程 A 通过内核程序，将数据写入内核空间指定的区域，接收进程 B 则哦通过另一组内核程序从内核指定指定区域中读取数据，并写入接收进程 B 的内存数据空间，从而实现数据从进程 A 传送到进程 B。不需要 IO 操作，因此速度快；
- 低级通信：进程之间一次只能传送很少的信息，比如信号量方式；
- 高级通信：进程间一次可以传送大量的信息

##### 共享内存通信方式

> 在内存中划出一块内存区作为共享数据区，通信的进程双方将自己的虚拟地址空间映射到共享内存分区上，它是进程之间最快捷、最有效的一种通信方式，可以实现多个进程之间的信息交换，但如何实现对共享分区的互斥使用由编程人员完成；

![image-20220109152629862](https://oss.justin3go.com/blogs/image-20220109152629862.png)

##### 消息缓冲通信方式（消息传递通信方式：利用操作系统提供的消息传递系统实现进程通信）

- 消息缓冲通信属于直接通信方式；
- 对于发送者：
  - 发送完信息后不等消息被接收者接收就继续前进；
  - 发送完消息后阻塞自己，直到收到接收者的消息回答后才继续前进；
- 对于接收者：
  - 若有消息则接收这个消息后继续前进，若无消息则阻塞自己；
  - 若有消息则接收这个消息后继续前进，若无消息则放弃接收消息而继续前进；
- 成功的通信过程：
  - 发送者在发送消息前，先将自己的内存空间设置一个发送区，把欲发送的消息填入其中；
  - 发送者申请一个消息缓冲区，将已准备好的消息从发送区送到该消息缓冲区，并将发送者进程的名字、消息的开始地址以及消息的长度等信息填入该消息缓冲区中，然后把该消息缓冲区挂在接收进程的消息链上；
  - 接收者在接收消息前先在自己的内存空间设置相应的接收区；
  - 接收者摘下消息链上的第一条消息，将该消息从消息缓冲区复制到接收区，然后释放该消息缓冲区；
- 其中 2、4 步为原语操作，是为了解决以下可能出现的问题：
  - 接收进程的消息链是临界资源，即对消息队列的操作是临界区，应保证发送和接收满足互斥性；
  - 前述通信过程的第四步要求接收者摘下消息链上的第一条消息，而此时消息缓冲区中可能没有消息存在；
  - 消息链上也可能挂有多条消息，则如何管理消息连山给的多条消息；
  - 可能同时 i 存在多个发送者申请消息缓冲区，也就是说消息缓冲区也是临界资源；

![image-20220109164222969](https://oss.justin3go.com/blogs/image-20220109164222969.png)



##### 信箱通信方式（消息传递通信方式）

> 信箱通信方式又称为间接通信方式，对同步的要求没有那么严格；

![image-20220109164323563](https://oss.justin3go.com/blogs/image-20220109164323563.png)

规则：

- 若发送信件时信箱已满，则发送进程应转变成等待信件状态，直到信箱有空信格时才被唤醒；
- 若取信件时信箱中已无信件，则接收进程转变成等待信件状态，直到有信件时才被唤醒；

步骤：

- 接收者创建属于自己的私用信箱；
- 发送者产生一封信件；
- 发送者把信件投入接收者的私用信箱；
- 接收者从自己的私用信箱中读取信件；

投递操作与读取操作采用原语的原因：

- 3 中发送者发送信件时可能信箱已满；
- 4 中接收者读取信件时可能信箱已空；

##### 管道通信方式（共享文件通信方式）

> 指连接在两个进程之间的一个打开的共享文件；

- 管道专门用于通信；
- 管道只能单向传送数据；
- 在对管道进行读写操作过程中，发送者进程和接收者进程所需要的同步和互斥都由系统自动进行，即对用户透明；

### 死锁的含义

指多个进程在并发执行过程中因争夺不可抢占资源而造成的一种僵局；

死锁与死循环的区别

死锁与饥饿的区别

死锁是偶然发生的：

资源竞争可能导致死锁但不一定就发生死锁，死锁的发生还取决于进程推进的速度，以及对不可抢占资源申请的顺序，也就是说，产生死锁的因素不仅与系统拥有的资源数量有关，而且与资源的分配策略（可抢占式还是不可抢占式）、进程对资源的使用顺序以及并发进程的推进速度有关；

### 死锁产生的原因

- 系统资源不足；
- 进程推进顺序不当；

### 死锁产生的必要条件

> 必要：产生死锁这四个条件一定具备，只要有一个条件不具备，就一定没有产生死锁现象；

- 互斥条件；
- 请求和保持条件；
- 不可抢占条件；
- 循环等待条件；

### 死锁的具体解决方案

##### 死锁的预防

- 破坏请求保持条件
  - 每个进程在运行之前一次申请它需要的全部资源；
  - 优点：安全、简单且易于实现；
  - 缺点：进程一直无法推进，比如前面一段时间只需要 9 个资源而结束时才会去使用最后一个资源；
- 破坏不可抢占条件
  - 必须释放它已获得的全部资源而进入阻塞状态，待以后需要时重新申请；
  - 缺点：资源已经被修改了，需要回退；
- 破坏循环等待条件
  - 采用资源有序分配策略
  - 缺点：资源不同的编号方法对资源的利用率有重要影响，且很难找到最优的编号方法；

##### 死锁的避免

银行家算法

- 系统可用资源向量 Available
- 最大需求矩阵 Max
- 分配矩阵 Allocation
- 需求矩阵 Need
- 请求向量 Request

##### 死锁的检测

死锁的资源分配图化简

##### 死锁的解除

- 撤销所有死锁进程；
- 让死锁进程回撤到正常执行状态的某个检查点；
- 按照某种顺序逐个撤销死锁进程，直到不再发生死锁为止；
- 采用抢占资源的策略直到不再发生死锁；

## 存储管理

| 技术         | 说明                                                         | 优势                                                         | 弱点                                                         |
| ------------ | :----------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 固定分区     | 在系统生成阶段，内存被划分成许多静态分区。进程可以被装入到大于或等于自身大小正好的分区中 | 实现简单，只需要极少的操作系统开销                           | 由于有内部碎片，对内存的使用不充分；活动进程的最大数目是固定的 |
| 动态分区     | 分区是动态创建的，因而使得每个进程可以装入到与自身大小正好相等的分区中 | 没有内部碎片；可以更充分地使用内存                           | 由于需要压缩外部碎片，处理器利用率低                         |
| 简单分区     | 内存被划分成许多大小相等的页框；每个进程被划分成大小与页框相等的页；要装入进程，需要把进程包含的所有页都装入内存中不一定连续的某些动态分区中 | 没有外部碎片                                                 | 有少量的内部碎片                                             |
| 简单分段     | 每个进程被划分伟许多段；要装入进程，需要把进程包含的所有段都装入到内存中不一定连续的某些动态分区中 | 没有内部碎片；相对于动态分区，提高了内存利用率，减少了开销   | 存在外部碎片                                                 |
| 虚拟内存分页 | 除了不需要装入进程的所有页之外，与简单分页一样；非驻留页在以后需要时自动调入内存 | 没有外部碎片；支持更高道数的多道程序设计；巨大的虚拟地址空间；支持保护与共享 | 复杂的内存管理开销                                           |
| 虚拟内存分段 | 除了不需要装入进程的所有段之外，与简单分段一样；非驻留段在以后需要时自动调入内存 | 没有内部随拍你；支持度更高道数的多道程序设计；巨大的虚拟地址空间；支持保护和共享 | 复杂的内存管理开销                                           |



### 各种存储管理方案的基本原理

TODO

##### 可变分区

TODO

##### 分页

TODO

##### 分段

TODO

##### 请求分页

TODO

##### 请求分段

TODO

### 不同存储管理方案的地址变换，逻辑地址到物理地址的转换

TODO

### 虚拟存储器的定义理解和特征

TODO

### 常见页面置换算法的置换原则，(页面序列或地址序列)缺页率

TODO

##### FIFO

TODO

##### OPT

TODO

##### LRU

TODO

##### Clock

TODO

##### 改进 Clock 算法

TODO

## 设备管理

### 设备控制方式

##### 程序控制

##### 中断方式

##### DMA

##### 通道

### 缓冲区的作用与类型

### 磁盘访问时间组成

### 常见磁盘调度算法

> 磁盘请求服务序列及平均寻道长度

## 文件管理

### 文件目录结构 TODO

### 文件物理结构 TODO

### 文件共享方法 TODO