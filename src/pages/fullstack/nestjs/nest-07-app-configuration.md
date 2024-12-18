---
title: 07 - 应用配置
date: 2024-08-12
category: NestJS
---

# 07 - 应用配置

## 准备

```typescript
// npm i @nestjs/config
```

然后在导入：

```typescript
// app.module
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // forRoot 将从默认位置(根目录)加载和解析我们的.env 文件
    // ConfigModule 还将.env 文件中的键/值对与分配给`process.env`的环境变量合并
    ConfigModule.forRoot(),
      // ...
```

然后在根目录下创建`.env`文件

```typescript
DATABASE_USER=postgres
DATABASE_PASSWORD=pass123
DATABASE_NAME=postgres
DATABASE_PORT=5432
DATABASE_HOST=localhost
```

注意，你应该在`.gitignore`文件下添加`*.env`

## 使用

然后，你就可以像下面的方式使用对应的变量值了，注意这里所有的变量值都是字符串，而`port`要求的是数字，所以我们还需要进行一个转换。

```typescript
@Module({
  imports: [
    // forRoot 将从默认位置(根目录)加载和解析我们的.env 文件
    // ConfigModule 还将.env 文件中的键/值对与分配给`process.env`的环境变量合并
    ConfigModule.forRoot(),
    CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,  // 这里做了隐式转换
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CoffeeRatingModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
```

## 切换路径

下面这种方式就会从根目录的`.environment`中找。

```typescript
ConfigModule.forRoot({envFilePath: '.environment'}),
```

## 禁用

有时候，需要禁用，如下：

```typescript
ConfigModule.forRoot({ignoreEnvFile: true}),
```

## 验证配置

配置未通过验证，抛出异常是一个最佳做法。

```typescript
// npm i @hapi/joi
// npm i --save-dev @types/hapi__joi  // 相关的类型声明文件
```

定义一个`Joi`验证模式

```typescript
import * as Joi from '@hapi/joi';  // 确保这里导入了所有

ConfigModule.forRoot({
    validationSchema:Joi.object({
        DATABASE_HOST: Joi.required(),  // 默认情况下，所有键都是可选的，这里设置为必选的
        DATABASE_PORT: Joi.number().default(5432),
    })
}),
```

## ConfigService

我们在应用程序中设置的`ConfigModule`带有一个名为`ConfigService`的有用服务，其中有一个`get`方法来读取我们所有已解析的配置变量。

首先导入

```typescript
// coffees.module
@Module({
  imports: [/* ... */, ConfigModule],
    // ...
```

然后就可以导入`ConfigService`注入到`constructor`中

```typescript
@Injectable()
export class CoffeesService {
  constructor(
  //...
    private readonly configService: ConfigService,
  ) {  // 这里的 string 只是编译器上的 string，即使我们指定为 number，也不会进行任何的类型转换
    const databaseHost = this.configService.get<string>('DATABASE_HOST')
    console.log(databaseHost);
  }
```

`get`还有第二个参数作为默认值进行使用：

```typescript
this.configService.get<string>('DATABASE_HOST', 'localhost')
```

## 分组配置

创建文件`config/app.config.ts`

```typescript
export default () =>({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port:parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
})
```

然后在`app.module`中使用它

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
      // ...
```

同样，这里我们也可以使用上一部分提到的`ConfigService.get()`使用其中的配置，因为该方法不仅允许你通过键检索环境变量，还可以遍历我们自定义文件中创建的嵌套自定义配置对象。

```typescript
// coffees.service
// ...
    private readonly configService: ConfigService,
  ) {
    const databaseHost = this.configService.get('database.host','localhost')  // 这里没有<string>了
    console.log(databaseHost);
  }
```

注意这里是使用的`database.host`获取属性，因为在`config`中我们是这样定义的

```typescript
  database: {
    host: process.env.DATABASE_HOST,
    port:parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
```

这对于大型复杂应用来说，可能会很快变得不可维护，因为这种方法没有类型推断，`'database.host'`这是个字符串，我们不断的输入字符串，根本不知道对应位置是否有相应的属性。

## 配置的 NameSpace

在`/coffees/`文件夹中创建一个新的`/config/`目录，并在其中创建`coffees.config.ts`文件

```typescript
import { registerAs } from "@nestjs/config";

// registerAs 在对应的 key 上注册了一个命名空间配置对象
export default registerAs('coffees', ()=>({
  foo: 'bar',
}))
```

然后在`coffees.module`中使用`.forFeature()`导入:

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ], // 部分注册，在靠近其域的位置注册它们，而不是将所有这些文件加载到根目录
 // 并且，我们之前也使用了 ConfigModule.forRoot 处理了根模块中的配置文件
```

在对应的`service`中使用：

```typescript
@Injectable()
export class CoffeesService {
  constructor(
// ...
    private readonly configService: ConfigService,
  ) {
    const coffeesConfig = this.configService.get('coffees')
    console.log(coffeesConfig);
  }
```

```typescript
控制台: { foo: 'bar' }

const coffeesConfig = this.configService.get('coffees.foo')  // log: bar
```

为了避免这种在字符串中使用`.`运算符，从而可能造成一些小错误，所以我们通常是直接注入整个命名空间配置对象，每个命名空间配置都暴露了一个`key`属性

```typescript
//...    
@Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    console.log(coffeesConfiguration.foo);  // 这里就会有检查和提示
  }
```

## 异步配置

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({   // 1
      load: [appConfig],
    }),
    CoffeesModule,
    TypeOrmModule.forRoot({   // 2
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
// ...
})
```

当我们交换位置，就会抛出错误！

```typescript
@Module({
  imports: [
    TypeOrmModule.forRoot({     // 2
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({  // 1
      load: [appConfig],
    }),
// ...
})
```

顺序很容易被忽略，我们应该怎么解决防止将来出现这个问题呢？

```typescript
    TypeOrmModule.forRootAsync({   // 2  // forRootAsync 以及 useFactory
      useFactory:()=>({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    ConfigModule.forRoot({   // 1
      load: [appConfig],
    }),
```
