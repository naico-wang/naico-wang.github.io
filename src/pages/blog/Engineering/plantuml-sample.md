---
title: PlantUML的一些参考图例
date: 2024-07-24
abstract: 最近工作中画了不少UML的图，推荐一个PlantUML的VSCode插件，让你画图无忧
---

# PlantUML的一些参考图例

关于PlantUML的详细讲解，请参考官网：https://plantuml.com/

这里只是展示常用的用法和相应的生成的示例图，让大家快速查阅使用。

## 语法

@startuml TCP 三次握手
client -> server: SYN(J)
server --> client: SYN(seq=J) ACK(J+1)
client -> server: ACK(K+1)
@enduml

:::details 代码：
```text
@startuml TCP 三次握手
client -> server: SYN(J)
server --> client: SYN(seq=J) ACK(J+1)
client -> server: ACK(K+1)
@enduml
```
:::

## 对象图

@startuml Object
object 大佬 {
    衣着: 女装格子
    头发: 不用电风吹
}
@enduml

@startuml 关系
object Obj1
object Obj2
object Obj3
object Obj4
object Obj5
object Obj6
object Obj7
object Obj8

Obj1 <|-- Obj2 : 2 继承 1
Obj3 *-- Obj4 : 3 由 4 组成 (强依赖)
Obj5 o-- "6" Obj6 : 5 由 6 组成 (弱依赖)
Obj7 .. Obj8 : 相互关联
@enduml

:::details 代码：
```text
@startuml Object
object 大佬 {
    衣着: 女装格子
    头发: 不用电风吹
}
@enduml

@startuml 关系
object Obj1
object Obj2
object Obj3
object Obj4
object Obj5
object Obj6
object Obj7
object Obj8

Obj1 <|-- Obj2 : 2 继承 1
Obj3 *-- Obj4 : 3 由 4 组成 (强依赖)
Obj5 o-- "6" Obj6 : 5 由 6 组成 (弱依赖)
Obj7 .. Obj8 : 相互关联
@enduml
```
:::

## 类图

@startuml 基础类图
class Foo {
  String data
  void methods()
}
@enduml

@startuml 属性
class Dummy {
 -field1
 #field2
 ~method1()
 +method2()
}
@enduml

@startuml 抽象与静态
class Dummy {
  {static} String id
  {abstract} void methods()
}
@enduml

@startuml 高级类图
class Foo1 {
  You can use
  several lines
  ..
  as you want
  and group
  ==
  things together.
  __
  You can have as many groups
  as you want
  --
  End of class
}

class User {
  .. Simple Getter ..
  + getName()
  + getAddress()
  .. Some setter ..
  + setName()
  __ private data __
  int age
  -- encrypted --
  String password
}
@enduml

@startuml 类联系
Class01 <|-- Class02
Class03 *-- Class04
Class05 o-- Class06
Class07 .. Class08
Class09 -- Class10
@enduml

@startuml 抽象类和接口
abstract class AbstractList
abstract AbstractCollection
interface List
interface Collection

List <|-- AbstractList
Collection <|-- AbstractCollection

Collection <|- List
AbstractCollection <|- AbstractList
AbstractList <|-- ArrayList

class ArrayList {
  Object[] elementData
  size()
}

enum TimeUnit {
  DAYS
  HOURS
  MINUTES
}

annotation SuppressWarnings
@enduml

@startuml 隐藏类
class Foo1
class Foo2
Foo2 *-- Foo1
hide Foo2
@enduml

@startuml 泛型（generics）
class Foo<? extends Element> {
  int size()
}
Foo *- Element
@enduml

:::details 代码：
```text
@startuml 基础类图
class Foo {
  String data
  void methods()
}
@enduml


@startuml 属性
class Dummy {
 -field1
 #field2
 ~method1()
 +method2()
}
@enduml

@startuml 抽象与静态
class Dummy {
  {static} String id
  {abstract} void methods()
}
@enduml

@startuml 高级类图
class Foo1 {
  You can use
  several lines
  ..
  as you want
  and group
  ==
  things together.
  __
  You can have as many groups
  as you want
  --
  End of class
}

class User {
  .. Simple Getter ..
  + getName()
  + getAddress()
  .. Some setter ..
  + setName()
  __ private data __
  int age
  -- encrypted --
  String password
}
@enduml

@startuml 类联系
Class01 <|-- Class02
Class03 *-- Class04
Class05 o-- Class06
Class07 .. Class08
Class09 -- Class10
@enduml

@startuml 抽象类和接口
abstract class AbstractList
abstract AbstractCollection
interface List
interface Collection

List <|-- AbstractList
Collection <|-- AbstractCollection

Collection <|- List
AbstractCollection <|- AbstractList
AbstractList <|-- ArrayList

class ArrayList {
  Object[] elementData
  size()
}

enum TimeUnit {
  DAYS
  HOURS
  MINUTES
}

annotation SuppressWarnings
@enduml


@startuml 隐藏类
class Foo1
class Foo2
Foo2 *-- Foo1
hide Foo2
@enduml


@startuml 泛型（generics）
class Foo<? extends Element> {
  int size()
}
Foo *- Element
@enduml
```
:::

## 组件图

@startuml 组件图
component VueComponet as VC
Props -> VC
VC -> Events
note top of Props : 传入 props
note top of Events : 抛出事件
@enduml


@startuml 组件组合
component Componet1 as C1
component Componet2 as C2
Props1 -> C1
C1 -> Events
Events ..> Props2
Props2 -> C2
note right of Events : 抛出事件
@enduml


@startuml 组合组件

package "Some Group" {
  HTTP - [First Component]
  [Another Component]
}
 
node "Other Groups" {
  FTP - [Second Component]
  [First Component] --> FTP
} 

cloud {
  [Example 1]
}


database "MySql" {
  folder "This is my folder" {
	[Folder 3]
  }
  frame "Foo" {
	[Frame 4]
  }
}


[Another Component] --> [Example 1]
[Example 1] --> [Folder 3]
[Folder 3] --> [Frame 4]

@enduml


@startuml 改变颜色

skinparam interface {
  backgroundColor RosyBrown
  borderColor orange
}

skinparam component {
  FontSize 13
  BackgroundColor<<Apache>> Red
  BorderColor<<Apache>> #FF6655
  FontName Courier
  BorderColor black
  BackgroundColor gold
  ArrowFontName Impact
  ArrowColor #FF6655
  ArrowFontColor #777777
}

() "Data Access" as DA

DA - [First Component] 
[First Component] ..> () HTTP : use
HTTP - [Web Server] << Apache >>

@enduml

::: details 代码：
```text
@startuml 组件图
component VueComponet as VC
Props -> VC
VC -> Events
note top of Props : 传入 props
note top of Events : 抛出事件
@enduml


@startuml 组件组合
component Componet1 as C1
component Componet2 as C2
Props1 -> C1
C1 -> Events
Events ..> Props2
Props2 -> C2
note right of Events : 抛出事件
@enduml


@startuml 组合组件

package "Some Group" {
  HTTP - [First Component]
  [Another Component]
}
 
node "Other Groups" {
  FTP - [Second Component]
  [First Component] --> FTP
} 

cloud {
  [Example 1]
}


database "MySql" {
  folder "This is my folder" {
	[Folder 3]
  }
  frame "Foo" {
	[Frame 4]
  }
}


[Another Component] --> [Example 1]
[Example 1] --> [Folder 3]
[Folder 3] --> [Frame 4]

@enduml


@startuml 改变颜色

skinparam interface {
  backgroundColor RosyBrown
  borderColor orange
}

skinparam component {
  FontSize 13
  BackgroundColor<<Apache>> Red
  BorderColor<<Apache>> #FF6655
  FontName Courier
  BorderColor black
  BackgroundColor gold
  ArrowFontName Impact
  ArrowColor #FF6655
  ArrowFontColor #777777
}

() "Data Access" as DA

DA - [First Component] 
[First Component] ..> () HTTP : use
HTTP - [Web Server] << Apache >>

@enduml
```
:::

## 部署图

### 部署图用于对系统的物理结构建模

@startuml 部署图
actor 活动人员
agent 代理
artifact artifact
boundary 限制分界
card 卡片
cloud 云
component 组件
control 控制器
database 数据库
entity 实体
file 文件
folder 文件价
frame 框架
interface 接口
node 节点
package 包
queue 队列
stack 堆
rectangle 矩形啦
storage 存储
usecase 用例
@enduml


@startuml 组合
folder folder [
这是一个 <b>文件夹
----
您可以使用
====
不同类型
....
的分隔符
]

node node [
这是一个 <b>结点
----
您可以使用
====
不同类型
....
的分隔符
]

database database [
这是个数据库 <b>数据库
----
您可以使用
====
不同类型
....
的分隔符
]
usecase usecase [
这是个 <b>用例
----
您可以使用
====
不同类型
....
的分隔符
]
@enduml


### 您可以在元素之间创建简单链接
@startuml 简单链接

node node1
node node2
node node3
node node4
node node5
node1 -- node2
node1 .. node3
node1 ~~ node4
node1 == node5

@enduml


@startuml 横向的链接
left to right direction
frame user1 {
card root
card sub1
card sub2
}

card leaf1
card leaf2

root --> sub1
root --> sub2
sub1 --> leaf1
sub1 --> leaf2
@enduml


@startuml 链接样式

cloud cloud1
cloud cloud2
cloud cloud3
cloud cloud4
cloud cloud5
cloud1 -0- cloud2
cloud1 -0)- cloud3
cloud1 -(0- cloud4
cloud1 -(0)- cloud5

@enduml


@startuml 包装组合 1
artifact Foo1 {
  folder Foo2
}

folder Foo3 {
  artifact Foo4
}

frame Foo5 {
  database Foo6
}

@enduml


@startuml 包装组合 2
node Foo1 {
 cloud Foo2 
}

cloud Foo3 {
  frame Foo4
}

database Foo5  {
  storage Foo6
}

storage Foo7 {
  storage Foo8
}
@enduml

:::details 代码：
```text
### 部署图用于对系统的物理结构建模

@startuml 部署图
actor 活动人员
agent 代理
artifact artifact
boundary 限制分界
card 卡片
cloud 云
component 组件
control 控制器
database 数据库
entity 实体
file 文件
folder 文件价
frame 框架
interface 接口
node 节点
package 包
queue 队列
stack 堆
rectangle 矩形啦
storage 存储
usecase 用例
@enduml


@startuml 组合
folder folder [
这是一个 <b>文件夹
----
您可以使用
====
不同类型
....
的分隔符
]

node node [
这是一个 <b>结点
----
您可以使用
====
不同类型
....
的分隔符
]

database database [
这是个数据库 <b>数据库
----
您可以使用
====
不同类型
....
的分隔符
]
usecase usecase [
这是个 <b>用例
----
您可以使用
====
不同类型
....
的分隔符
]
@enduml


### 您可以在元素之间创建简单链接
@startuml 简单链接

node node1
node node2
node node3
node node4
node node5
node1 -- node2
node1 .. node3
node1 ~~ node4
node1 == node5

@enduml


@startuml 横向的链接
left to right direction
frame user1 {
card root
card sub1
card sub2
}

card leaf1
card leaf2

root --> sub1
root --> sub2
sub1 --> leaf1
sub1 --> leaf2
@enduml


@startuml 链接样式

cloud cloud1
cloud cloud2
cloud cloud3
cloud cloud4
cloud cloud5
cloud1 -0- cloud2
cloud1 -0)- cloud3
cloud1 -(0- cloud4
cloud1 -(0)- cloud5

@enduml


@startuml 包装组合 1
artifact Foo1 {
  folder Foo2
}

folder Foo3 {
  artifact Foo4
}

frame Foo5 {
  database Foo6
}

@enduml


@startuml 包装组合 2
node Foo1 {
 cloud Foo2 
}

cloud Foo3 {
  frame Foo4
}

database Foo5  {
  storage Foo6
}

storage Foo7 {
  storage Foo8
}
@enduml
```
:::

## 用例图

@startuml 角色
actor M1
actor M2
@enduml


@startuml 基础示例
海绵 --> (排队打饭) : 开饭啦
展昭 ---> (排队打饭) : 这位离得比较远
@enduml


@startuml 继承
:Main Admin: as Admin
(Use the application) as (Use)

User <|-- Admin
(Start) <|-- (Use)
@enduml


@startuml 注释
:Main Admin: as Admin
(Use the application) as (Use)

User -> (Start)
User --> (Use)
Admin ---> (Use)

note right of Admin : This is an example.
note right of (Use)
  A note can also
  be on several lines
end note
note "This note is connected\nto several objects." as N2
(Start) .. N2
N2 .. (Use)
@enduml



@startuml 一个完整的例子
left to right direction
skinparam packageStyle rectangle
actor customer
actor clerk
rectangle checkout {
  customer -- (checkout)
  (checkout) .> (payment) : include
  (help) .> (checkout) : extends
  (checkout) -- clerk
}
@enduml

:::details 代码：
```text
@startuml 角色
actor M1
actor M2
@enduml


@startuml 基础示例
海绵 --> (排队打饭) : 开饭啦
展昭 ---> (排队打饭) : 这位离得比较远
@enduml


@startuml 继承
:Main Admin: as Admin
(Use the application) as (Use)

User <|-- Admin
(Start) <|-- (Use)
@enduml


@startuml 注释
:Main Admin: as Admin
(Use the application) as (Use)

User -> (Start)
User --> (Use)
Admin ---> (Use)

note right of Admin : This is an example.
note right of (Use)
  A note can also
  be on several lines
end note
note "This note is connected\nto several objects." as N2
(Start) .. N2
N2 .. (Use)
@enduml



@startuml 一个完整的例子
left to right direction
skinparam packageStyle rectangle
actor customer
actor clerk
rectangle checkout {
  customer -- (checkout)
  (checkout) .> (payment) : include
  (help) .> (checkout) : extends
  (checkout) -- clerk
}
@enduml
```
:::

## 时序图

@startuml 时序图
actor 参与者
boundary 限制
control 控制
entity 实体
database 数据库
collections 收集

参与者 -> 限制 : 满足边界条件
参与者 -> 控制 : 控制系统
参与者 -> 实体 : 操作实体
参与者 -> 数据库 : 同步数据库
参与者 -> 收集 : 完成数据采集
@enduml

@startuml 修改箭头样式
Bob ->x Alice
Bob -> Alice
Bob ->> Alice
Bob -\ Alice
Bob \\- Alice
Bob //-- Alice

Bob ->o Alice
Bob o\\-- Alice

Bob <-> Alice
Bob <->o Alice
@enduml

@startuml 修改箭头的颜色
Bob -[#red]> Alice : hello
Alice -[#0000FF]->Bob : ok
@enduml

@startuml 序号标签
autonumber "<b>[000]"
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response

autonumber 15 "<b>(<u>##</u>)"
Bob -> Alice : Another authentication Request
Bob <- Alice : Another authentication Response

autonumber 40 10 "<font color=red><b>Message 0  "
Bob -> Alice : Yet another authentication Request
Bob <- Alice : Yet another authentication Response

@enduml



@startuml 注释
Alice->Bob : hello
note left: this is a first note

Bob->Alice : ok
note right: this is another note

Bob->Bob : I am thinking
note left
	a note
	can also be defined
	on several lines
end note
@enduml


@startuml 生命线的激活与撤销
participant User

User -> A: DoWork
activate A

A -> B: << createRequest >>
activate B

B -> C: DoWork
activate C
C --> B: WorkDone
destroy C

B --> A: RequestCreated
deactivate B

A -> User: Done
deactivate A

@enduml

:::details 代码：
```text
@startuml 时序图
actor 参与者
boundary 限制
control 控制
entity 实体
database 数据库
collections 收集

参与者 -> 限制 : 满足边界条件
参与者 -> 控制 : 控制系统
参与者 -> 实体 : 操作实体
参与者 -> 数据库 : 同步数据库
参与者 -> 收集 : 完成数据采集
@enduml

@startuml 修改箭头样式
Bob ->x Alice
Bob -> Alice
Bob ->> Alice
Bob -\ Alice
Bob \\- Alice
Bob //-- Alice

Bob ->o Alice
Bob o\\-- Alice

Bob <-> Alice
Bob <->o Alice
@enduml

@startuml 修改箭头的颜色
Bob -[#red]> Alice : hello
Alice -[#0000FF]->Bob : ok
@enduml

@startuml 序号标签
autonumber "<b>[000]"
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response

autonumber 15 "<b>(<u>##</u>)"
Bob -> Alice : Another authentication Request
Bob <- Alice : Another authentication Response

autonumber 40 10 "<font color=red><b>Message 0  "
Bob -> Alice : Yet another authentication Request
Bob <- Alice : Yet another authentication Response

@enduml



@startuml 注释
Alice->Bob : hello
note left: this is a first note

Bob->Alice : ok
note right: this is another note

Bob->Bob : I am thinking
note left
	a note
	can also be defined
	on several lines
end note
@enduml


@startuml 生命线的激活与撤销
participant User

User -> A: DoWork
activate A

A -> B: << createRequest >>
activate B

B -> C: DoWork
activate C
C --> B: WorkDone
destroy C

B --> A: RequestCreated
deactivate B

A -> User: Done
deactivate A

@enduml
```
:::

## 活动图 

@startuml 新版活动图
:Hello world;
:This is on defined on
several **lines**;
:end;
@enduml


@startuml 开始结束stop
start
:Hello world;
:This is on defined on
several **lines**;
stop
@enduml


@startuml 开始结束end
start
:Hello world;
:This is on defined on
several **lines**;
end
@enduml


@startuml 条件语句
start

if (今天下雨☔️?) then (下了)
  :记得带伞;
else (没下)
  :没啥事了;
endif
  :反正要上班;
stop
@enduml


@startuml 多个分支测试
start
if (condition A) then (yes)
  :Text 1;
elseif (condition B) then (yes)
  :Text 2;
  stop
elseif (condition C) then (yes)
  :Text 3;
elseif (condition D) then (yes)
  :Text 4;
else (nothing)
  :Text else;
endif
stop
@enduml


@startuml 重复循环
start
repeat
  :read data;
  :generate diagrams;
repeat while (more data?)
stop
@enduml




@startuml while循环
start
while (data available?)
  :read data;
  :generate diagrams;
endwhile
stop
@enduml



@startuml endwhile
while (check filesize ?) is (not empty)
  :read file;
endwhile (empty)
:close file;
@enduml


@startuml 并行处理

start
if (multiprocessor?) then (yes)
  fork
	:Treatment 1;
  fork again
	:Treatment 2;
  end fork
else (monoproc)
  :Treatment 1;
  :Treatment 2;
endif
@enduml



@startuml 连接器
start
:Some activity;
(A)
detach
(A)
:Other activity;
@enduml



@startuml 组合
start
partition Initialization {
	:read config file;
	:init internal variable;
}
partition Running {
	:wait for user interaction;
	:print information;
}
stop
@enduml


@startuml 通道
|Swimlane1|
start
:foo1;
|#ccc|Swimlane2|
:foo2;
:foo3;
|Swimlane1|
:foo4;
|Swimlane2|
:foo5;
stop
@enduml


@startuml 分离
 :start;
 fork
   :foo1;
   :foo2;
 fork again
   :foo3;
   detach
 endfork
 if (foo4) then
   :foo5;
   detach
 endif
 :foo6;
 detach
 :foo7;
 stop
@enduml


@startuml 完整的例子
start
:ClickServlet.handleRequest();
:new page;
if (Page.onSecurityCheck) then (true)
  :Page.onInit();
  if (isForward?) then (no)
	:Process controls;
	if (continue processing?) then (no)
	  stop
	endif
	
	if (isPost?) then (yes)
	  :Page.onPost();
	else (no)
	  :Page.onGet();
	endif
	:Page.onRender();
  endif
else (false)
endif

if (do redirect?) then (yes)
  :redirect process;
else
  if (do forward?) then (yes)
	:Forward request;
  else (no)
	:Render page template;
  endif
endif
stop
@endum

:::details 代码：
```text
@startuml 新版活动图
:Hello world;
:This is on defined on
several **lines**;
:end;
@enduml


@startuml 开始结束stop
start
:Hello world;
:This is on defined on
several **lines**;
stop
@enduml


@startuml 开始结束end
start
:Hello world;
:This is on defined on
several **lines**;
end
@enduml


@startuml 条件语句
start

if (今天下雨☔️?) then (下了)
  :记得带伞;
else (没下)
  :没啥事了;
endif
  :反正要上班;
stop
@enduml


@startuml 多个分支测试
start
if (condition A) then (yes)
  :Text 1;
elseif (condition B) then (yes)
  :Text 2;
  stop
elseif (condition C) then (yes)
  :Text 3;
elseif (condition D) then (yes)
  :Text 4;
else (nothing)
  :Text else;
endif
stop
@enduml


@startuml 重复循环
start
repeat
  :read data;
  :generate diagrams;
repeat while (more data?)
stop
@enduml




@startuml while循环
start
while (data available?)
  :read data;
  :generate diagrams;
endwhile
stop
@enduml



@startuml endwhile
while (check filesize ?) is (not empty)
  :read file;
endwhile (empty)
:close file;
@enduml


@startuml 并行处理

start
if (multiprocessor?) then (yes)
  fork
	:Treatment 1;
  fork again
	:Treatment 2;
  end fork
else (monoproc)
  :Treatment 1;
  :Treatment 2;
endif
@enduml



@startuml 连接器
start
:Some activity;
(A)
detach
(A)
:Other activity;
@enduml



@startuml 组合
start
partition Initialization {
	:read config file;
	:init internal variable;
}
partition Running {
	:wait for user interaction;
	:print information;
}
stop
@enduml


@startuml 通道
|Swimlane1|
start
:foo1;
|#ccc|Swimlane2|
:foo2;
:foo3;
|Swimlane1|
:foo4;
|Swimlane2|
:foo5;
stop
@enduml


@startuml 分离
 :start;
 fork
   :foo1;
   :foo2;
 fork again
   :foo3;
   detach
 endfork
 if (foo4) then
   :foo5;
   detach
 endif
 :foo6;
 detach
 :foo7;
 stop
@enduml


@startuml 完整的例子
start
:ClickServlet.handleRequest();
:new page;
if (Page.onSecurityCheck) then (true)
  :Page.onInit();
  if (isForward?) then (no)
	:Process controls;
	if (continue processing?) then (no)
	  stop
	endif
	
	if (isPost?) then (yes)
	  :Page.onPost();
	else (no)
	  :Page.onGet();
	endif
	:Page.onRender();
  endif
else (false)
endif

if (do redirect?) then (yes)
  :redirect process;
else
  if (do forward?) then (yes)
	:Forward request;
  else (no)
	:Render page template;
  endif
endif
stop
@endum
```
:::

## 状态图

@startuml 简单状态
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]
@enduml

@startuml 箭头方向
[*] -up-> First
First -right-> Second
Second --> Third
Third -left-> Last
@enduml

@startuml 注释
[*] --> Active
Active --> Inactive
note left of Active : this is a short\nnote
note right of Inactive
  A note can also
  be defined on
  several lines
end note
@enduml


@startuml 合成状态
scale 350 width
[*] --> NotShooting

state NotShooting {
  [*] --> Idle
  Idle --> Configuring : EvConfig
  Configuring --> Idle : EvConfig
}

state Configuring {
  [*] --> NewValueSelection
  NewValueSelection --> NewValuePreview : EvNewValue
  NewValuePreview --> NewValueSelection : EvNewValueRejected
  NewValuePreview --> NewValueSelection : EvNewValueSaved
  
  state NewValuePreview {
	 State1 -> State2
  }
  
}
@enduml

:::details 代码：
```text
@startuml 简单状态
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]
@enduml

@startuml 箭头方向
[*] -up-> First
First -right-> Second
Second --> Third
Third -left-> Last
@enduml

@startuml 注释
[*] --> Active
Active --> Inactive
note left of Active : this is a short\nnote
note right of Inactive
  A note can also
  be defined on
  several lines
end note
@enduml


@startuml 合成状态
scale 350 width
[*] --> NotShooting

state NotShooting {
  [*] --> Idle
  Idle --> Configuring : EvConfig
  Configuring --> Idle : EvConfig
}

state Configuring {
  [*] --> NewValueSelection
  NewValueSelection --> NewValuePreview : EvNewValue
  NewValuePreview --> NewValueSelection : EvNewValueRejected
  NewValuePreview --> NewValueSelection : EvNewValueSaved
  
  state NewValuePreview {
	 State1 -> State2
  }
  
}
@enduml
```
:::
