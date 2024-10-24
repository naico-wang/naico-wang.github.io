---
title: 06 - 原理细节
date: 2024-08-12
category: NestJS
---

# 06 - 原理细节

## 依赖注入

我们将依赖的实例委托给`IOC`容器，在这里，这个`IOC`容器就是`NestJS`运行时系统本身，`NestJS`在这里处理所有繁重的工作，而不是尝试自己实现依赖注入。本质上，当我们“ask”类构造函数中的依赖项时，`NestJS`处理并检索返回给我们的对象，以及它可能需要的任何依赖项等等。

![image-20220426130720264](https://oss.justin3go.com/blogs/image-20220426130720264.png)

比如，当我们使用`CoffeeService`并将其注入到我们的构造函数中时，`NestJS`发生了什么才能使所有这些工作。

```typescript
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService){

  }
  // ...
```

在依赖注入过程中有 3 个关键步骤

- 首先，在我们的`CoffeeService`中，`@Injectable`装饰器声明了一个可以由 Nest 容器管理的类，此装饰器将`CoffeeService`类标记为`Provider`。

  ```typescript
  @Injectable()
  export class CoffeesService {
      // ...
  }
  ```

- 其次，如果我们进入`CoffeesController`，我们可以看到构造函数中正在请求`CoffeesService`，这个请求告诉 Nest 将提供程序`inject`到我们的控制器类中以便使用

  ```typescript
  export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService){
  	// ...
    }
  }
  ```

- 最后，Nest 知道 this 类也是一个提供者，因为我们在`CoffeeModule`中包含了该提供者,，它向`Nest ` `IOC`容器注册了这个提供者，这就是它在我们代码本身的运作方式。

  ```typescript
  @Module({
  // ...
    providers: [CoffeesService],
  }
  ```

更加深入的理解：

当 Nest 容器实例化`CoffeesController`时，它首先查看是否由任何依赖项需要，在我们的例子中，有一个`CoffeeService`，当 Nest 容器找到`CoffeesService`依赖项时，它会对`CoffeesService token`执行查找，从而返回`CoffeeService`类，假设该`Provider`具有单例范围，这就是可注入提供程序的默认行为，然后，Nest 将创建`CoffeesService`的实例，将其缓存并返回，或者已有缓存直接返回。<自下而上>

![image-20220426133843167](https://oss.justin3go.com/blogs/image-20220426133843167.png)

```typescript
@Module({
// ...
  providers: [CoffeesService],
})
```

其实是下面的缩略写法：

```typescript
@Module({
// ...
  providers: [{
      provide: CoffeesService,
      useClass: CoffeesService,
  }],
})
```

在这个完整的写法中，我们可以清楚地将`TOKEN` `CoffeesService`与类`CoffeesService`相关联

## 控制 module 封装

默认情况下，`NestJS`模块封装了它们的提供者，这意味这无法注入不直接属于当前模块的提供者，也无法注入不是从导入模块导出的提供程序，因此你可以把从一个模块导出的提供者看作是该模块的公共接口。

![image-20220426193348314](https://oss.justin3go.com/blogs/image-20220426193348314.png)

```typescript
// nest g mo coffee-rating
// nest g s coffee-rating
// 生成一个例子
```

假设我们的新`CoffeeRatingService`依赖`CoffeesService`从数据库中获取咖啡，而`CoffeesService`属于不同模块，所以我们需要在新的`CoffeeRatingModule`中导入`CoffeesModule`

![image-20220426193843547](https://oss.justin3go.com/blogs/image-20220426193843547.png)

使用基于构造函数的注入添加`CoffeesService`：

```typescript
// coffee-rating.service
import { Injectable } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';

@Injectable()
export class CoffeeRatingService {
  constructor(private readonly coffeesService: CoffeesService){
    
  }
}
```

```typescript
// coffee-rating.module
@Module({
  imports: [CoffeesModule],
  providers: [CoffeeRatingService]
})
```

此时如果直接运行会报依赖错误。

此时我们需要在`CoffeesModule`中将其添加到`exports`中：

```typescript
// coffees.module
@Module({
// ...
  exports:[CoffeesService],
})
```

现在就没任何问题了...

## 深入`CUSTOM PROVIDER`

一些更为复杂的情况：

1. 当我们正在创建我们的提供者的自定义实例，而不是让`Nest`为我们实例化该类；
2. 假设我们想在第二个依赖项中**重用现有类；**
3. 如果我们想用模拟版本覆盖一个类进行测试；
4. 如果我们想使用策略模式，我们可以提供一个抽象类并根据不同的交换条件实际实现。

Nest 允许我们自定义提供程序来处理这些用例

### Value based Providers

`useValue`对于注入连续的值很有用，比如这里我们使用 mock 的数据`MockCoffeesService`类

```typescript
class MockCoffeesService{}

@Module({
  imports:[TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [{provide: CoffeesService, useValue: new MockCoffeesService}],  // 这里
  exports:[CoffeesService],
})
```

这时候，每当`CoffeesService TOKEN`被解析时，它将指向`MockCoffeesService`，任何时候偶们都会在我们的应用程序中注入`CoffeesService`

### Nonclassbased Provider Tokens

有时我们可能希望灵活地使用字符串或符号作为依赖注入`token`

```typescript
// coffees.module
@Module({
  imports:[TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [CoffeesService, {provide: 'COFFEES_BRANDS', useValue: ['buddy brew', 'nescafe']}],
  exports:[CoffeesService],
})
```

那么现在我们该如何使用呢？

我们需要使用类名声明依赖项，因为这就是 Nest 在`IOC`容器中查找依赖项的方式。

```typescript
// coffees.service
@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject('COFFEES_BRANDS')  // 这里
    coffeeBrands: string[],
  ) {
    console.log(coffeeBrands);
  }
```

需要注意的是，虽然我们可以直接在内部使用`COFFEES_BRANDS`来注入装饰器，但最好在一个单独的文件定义`Token`，以便可以在整个应用程序中使用：

```typescript
// /coffee 创建 coffees.constants.ts
export const COFFEES_BRANDS = "COFFEES_BRANDS";
```

然后将` @Inject('COFFEES_BRANDS')  // 这里`换成对应的变量`COFFEES_BRANDS`就可以了<最佳实践>

### Class Provider

`useclass`允许我们动态确定一个 Token 应该解析到的 Class

```typescript
// coffees.module
// ...
// 我们希望我们的 config 因环境而异
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    { provide: 'COFFEES_BRANDS', useValue: ['buddy brew', 'nescafe'] },
    {  // 这里
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
  ],
  exports: [CoffeesService],
})
```

### Factor Provider

`useFactory`允许我们动态创建提供者，如果提供者的值是基于各种其他依赖项值等。因为它们本身可以注入计算返回结果所需的其他提供程序。

```typescript
// coffees.module
@Injectable()
export class CoffeeBrandFactory{
  create(){
    /** do something */
    return ['buddy brew', 'nescafe']
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeeBrandFactory,
    { 
      provide: 'COFFEES_BRANDS', 
      useFactory: (brandFactory: CoffeeBrandFactory)=>brandFactory.create(),
      inject: [CoffeeBrandFactory],  // 这里会传递到 useFactory 的函数里，从而允许我们在其中随心所欲的使用
    },
// ...
  ],
  exports: [CoffeesService],
})
```

### Leverage Async Provider

有时我们需要引导程序延迟执行，直到一个或多个`Asynchronous Tasks`完成，我们需要做的就是`async/await`与`useFactory`相结合。

```typescript
// coffees.module
	{
      provide: 'COFFEES_BRANDS',
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeeBrands = await connection.query('SLELECT * ...')
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        return coffeeBrands;
      },
      inject: [Connection],
    },
```

## 动态模块

当我们有一个通用模块，该模块需要在不同情况下表现不同，将这个概念想象成一个博客系统，我们的动态模块需要一些配置才能被消费者使用。

> 这里出于演示，生成`nest g mo database`

```typescript
import { Module } from '@nestjs/common';
import { createConnection } from 'typeorm';

@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useValue: createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
      }),
    },
  ],
})
export class DatabaseModule {}
```

由于我们对这些选项进行了硬编码，我们不能轻易地在不同地应用程序之间共享这个模块，如果另一个应用程序想要使用这个模块但它需要使用不同的端口怎么办？

这时候，我们就可以使用 Nest 的动态模块功能，我们可以让消费模块使用 API 来控制导入时自定义此`DatabaseModule`

```typescript
import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({
  imports:[  // 这里是导入的其他模块，只是这里演示简化了没导入
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      password: 'pass123',
      port: 5432,
    })
  ]
}
)
export class DatabaseModule {
  static register(options: ConnectionOptions):DynamicModule{
    //DynamicModule 与我们的@Modules 具有基本相同的接口，但需要传递一个 module 属性
    return {
      module: DatabaseModule,
      providers:[
        {
          provide: 'CONNECTION',
          useValue: createConnection(options),
        }
      ]
    }
  }
}
```

## 控制`Provider`范围

NodeJS 并不遵循请求/响应的多线程无状态模型，这种模型每个请求都由单独一个线程来处理。

![image-20220427103557556](https://oss.justin3go.com/blogs/image-20220427103557556.png)

因此，使用`Singleton`实例对我们的应用程序来说是完全安全的，但是在某些极端情况下，你可能需要提供者为某种所需行为提供基于请求的生命周期。

![image-20220427103842353](https://oss.justin3go.com/blogs/image-20220427103842353.png)

`@INnjection()`的**作用域**允许我们获得所需的提供者生命周期行为，默认情况下，NestJS 中的每个提供者都是一个单例。

```typescript
// coffees.Service
@Injectable()
// 实际上是下面这种
@Injectable({scope: Scope.DEFAULT})
// 提供者的实例生命周期与我们应用程序的生命周期直接相关
```

对于大多数用例，建议使用单例范围，其为最佳实践。

`@Injectable`提供者可用的另外两个生命周期：`transent`和`request-scoped`

### transent

`transent`提供者不会在消费者之间共享，注入瞬态提供者的每个消费者都将收到提供者的新专用实例

![image-20220427104745572](https://oss.justin3go.com/blogs/image-20220427104745572.png)

```typescript
@Injectable({scope: Scope.TRANSIENT})
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject(COFFEES_BRANDS)
    coffeeBrands: string[],
  ) {
    console.log("CoffeesService intantiated");
  }
```

注意，该`Service`使用了两次，分别是在`CoffeesController`以及`CoffeeBrandsFactory`中，所以这里也实例化了两次。

![image-20220427105458127](https://oss.justin3go.com/blogs/image-20220427105458127.png)

如果我们删除`{scope: Scope.TRANSIENT}`会只实例化一次，该实例在`CoffeesController`以及`CoffeeBrandsFactory`中共享，这样会节约性能。

![image-20220427105810904](https://oss.justin3go.com/blogs/image-20220427105810904.png)

你也可以在`Module`里面像这样添加：

```typescript
@Module({
// ...
  providers: [
    CoffeesService,
    {
      provide: 'COFFEES_BRANDS',
      useFactory: ()=>['buddy brew', 'nescafe'],
      scope:Scope.TRANSIENT,  // COFFEES_BRANDS 就变成瞬态的了
      inject: [Connection],
    },
```

### request-scoped

`request-scoped`会为每个到来的请求提供一个新的提供者实例，当然，在请求完成处理后，也会对实例进行垃圾收集

```typescript
@Injectable({scope: Scope.REQUEST})
```

初始时，没有进行任何实例化，后面进行了三次请求：

![image-20220427110951688](https://oss.justin3go.com/blogs/image-20220427110951688.png)

意味着该服务是为每个请求创建的。

`CoffeesController`是一个单例，为什么`CoffeesService`会被创建 3 次，我们并没有在控制器装饰器中修改任何东西？

其实在 Nest 中，这些 scope 会向上的注入链冒泡，这意味着如果`CoffeesController`依赖于属于`REQUSET`范围的`CoffeesService`，它也会隐式地变成`REQUSET`范围

我们在其中添加 log：

```typescript
export class CoffeesController {
  // readonly 是一种最佳实践
  constructor(private readonly coffeeService: CoffeesService){
    console.log("CoffeesController created");
  }
```

然后请求三次：

![image-20220427111720045](https://oss.justin3go.com/blogs/image-20220427111720045.png)

这对于你访问请求特定信息，非常有用，例如标头、cookie、IP 等

显示的使用：

```typescript
export class CoffeesController {

  constructor(
    private readonly coffeeService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('CoffeesController created');
  }
    //...
```
