---
title: 10 - 测试
date: 2024-08-12
category: NestJS
---

# 10 - 测试

## 初识 Jest

- 很好的错误消息和内置 Mocking 实用程序
- 可靠的并行运行测试
- 优先运行以前失败的测试
- 根据测试文件花费的时间重新组织测试运行

```typescript
// npm run test  # for unit tests
// npm run test:cov  # for test coverage
// npm run test:e2e  # for e2e tests
```

**注意：**测试程序不支持绝对路径的导入，VSCODE 自动导入的需要换成相对路径

## 开始 unit

- 对于 nest 的单元测试，通常的做法是将`.spec.ts`文件保存在与它们测试的应用程序源代码相同的文件夹中。控制器、提供者、服务等都应该有自己的专用测试文件并且必须是`.spec.ts`后缀
- 对于 nest 的端到端测试，默认这些文件位于专用的`/test/`目录下，自动化的端到端测试帮助我们确保系统的整体行为是正确的。

`coffees.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';

// describe 块将所有与 CoffeeService 类相关的单元测试分组
describe('CoffeesService', () => {
  let service: CoffeesService;

  // 在每次测试之前执行的钩子函数，称为设置阶段，出此之外，还有 beforeAll(),afterEach(),afterAll()
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoffeesService],
    }).compile();  // 利用这个模块获取 CoffeesService，compile()引导模块及其依赖项，类似于 main.ts 中的 bootstrap

    service = module.get<CoffeesService>(CoffeesService);  // 然后存储在该变量中
    // service = await module.resolve(CoffeesService);  // 检索请求范围和瞬态范围的提供程序
  });

  // it 表达单独测试，该测试目前仅检查是否定义了 service 变量
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

运行：`npm run test:watch --coffees.service`

<会出现依赖错误>

我们的`TestingModule`仅包含 1 个提供程序，即`CoffeesService`，理论上我们要修复错误只需将所需的提供程序添加到`prociders[]`中。然而，这将违反最佳实践和单元测试背后的通用理念。单元测试应该在-isolation-中执行，但这并不意味着完全隔离，隔离是指测试不应该依赖于外部依赖，单元测试的理念是在这种情况下模拟一切，但这通常会导致难以维护的脆弱测试，并且不会带来任何重大价值。我们的`CoffeesService`依赖于与数据库相关的提供者，但我们要做的最后一件事是实例化一个真实数据库的`Connection`，只是为了单元测试。所以需要其他选择：无需创建复杂的 Mocks 或连接到真实数据库，我们真正要做的就是确保 u 偶有请求的提供者都可用于`TestingModule`，作为临时解决方案，我们使用自定义提供程序语法来提供我们`CoffeesSerice`所依赖的所有类：

```typescript
providers: [
  CoffeesService,
  { provide: Connection, useValue: {} },
  { provide: getRepositoryToken(Flavor), useValue: {} },
  { provide: getRepositoryToken(Coffee), useValue: {} },
]
```

`getRepositoryToken`接受一个实体，返回一个`InjectionToken`。为这些所有的 Providers 一个空对象作为值，一旦我们开始测试特定的方法，我们将用 Mocks 替换这些空对象。

![image-20220503155428639](https://oss.justin3go.com/blogs/image-20220503155428639.png)

## 添加单元测试

在测试包含业务逻辑的服务或类似的类时，我们更喜欢按**方法**对相关测试进行分组，使用方法名称作为我们的 describe()块。

这里测试下面这个方法：

```typescript
async findOne(id: string) {
  const coffee = await this.coffeeRepository.findOne(id, {  //我们必须确保模拟这个 coffeeRepository 方法才能让我们的测试正常运行
    relations: ['flavors'],
  });
  if (!coffee) {  // 我们必须通过单元测试覆盖两种不同的场景
    throw new NotFoundException(`Coffee ${id} not found`);
  }

  return coffee;
}
```

定义测试用例：

```typescript
describe('findOne', () => {
  describe('when coffee with ID exists', () => {
    it('should return the coffee object', async () => {
      const coffeeId = '1';
      const expectedCoffee = {};

      const coffee = await service.findOne(coffeeId);
      expect(coffee).toEqual(expectedCoffee);
    });
  });
  describe('otherwise', () => {
    it('shuold throw the "NotFountException"', async () => {});
  });
});
```

运行会发现：

![image-20220503161230167](https://oss.justin3go.com/blogs/image-20220503161230167.png)

这里理所当然的，因为我们之前使用空对象作为了我们的实体，显然里面没有定义任何方法，所以这个错误时有道理的。

最好的方法是创建一个通用函数，该函数仅返回一个 Mock 对象，其中包含存储库类提供的所有相同方法，然后对这些方法进行 stub，以根据特定条件操纵它们的行为：

```typescript
// 由该存储库类型的一些属性组成，并由 Jest 提供的模拟函数模拟值
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>():MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
})
```

然后替换：

```typescript
{ provide: getRepositoryToken(Flavor), useValue: createMockRepository() },
{ provide: getRepositoryToken(Coffee), useValue: createMockRepository() },
```

然后第二步我们需要在我们的测试函数中使用`coffeeRespository`变量，所以我们需要判断其是否定义。

```typescript
describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  // ...
});
```

```typescript
  beforeEach(async () => {
// ...
    service = module.get<CoffeesService>(CoffeesService); // 然后存储在该变量中
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });
```

模拟对应的方法：

```typescript
it('should return the coffee object', async () => {
  const coffeeId = '1';
  const expectedCoffee = {};

  coffeeRepository.findOne.mockReturnValue(expectedCoffee);  // 这里模拟了返回值
  const coffee = await service.findOne(coffeeId);
  expect(coffee).toEqual(expectedCoffee);
});
```

最后测试成功：

![image-20220503163606037](https://oss.justin3go.com/blogs/image-20220503163606037.png)

接下来完成失败路径的测试逻辑：

```typescript
describe('otherwise', () => {
  it('shuold throw the "NotFountException"', async () => {
    const coffeeId = '1';
    coffeeRepository.findOne.mockReturnValue(undefined);

    try {
      await service.findOne(coffeeId);
    } catch(err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toEqual(`Coffee ${coffeeId} not found`);
    }
  });
});
```

最后也成功：

![image-20220503164354456](https://oss.justin3go.com/blogs/image-20220503164354456.png)

完整代码：

```typescript
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import exp from 'constants';
import { Connection, Repository } from 'typeorm';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
// import { Event } from 'src/events/entities/event.entity';

// 由该存储库类型的一些属性组成，并由 Jest 提供的模拟函数模拟值
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>():MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
})


// describe 块将所有与 CoffeeService 类相关的单元测试分组
describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  // 在每次测试之前执行的钩子函数，称为设置阶段，出此之外，还有 beforeAll(),afterEach(),afterAll()
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: Connection, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: createMockRepository() },
        { provide: getRepositoryToken(Coffee), useValue: createMockRepository() },
        // { provide: getRepositoryToken(Event), useValue: {} },
      ],
    }).compile(); // 利用这个模块获取 CoffeesService，compile()引导模块及其依赖项，类似于 main.ts 中的 bootstrap

    service = module.get<CoffeesService>(CoffeesService); // 然后存储在该变量中
    // service = await module.resolve(CoffeesService);  // 检索请求范围和瞬态范围的提供程序
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  // it 表达单独测试，该测试目前仅检查是否定义了 service 变量
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = '1';
        const expectedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('shuold throw the "NotFountException"', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try{
          await service.findOne(coffeeId);
        }catch(err){
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee ${coffeeId} not found`);
        }
      });
    });
  });
});
```

## 开始 E2E 测试

初始文件：

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';  // 用于测试 HTTP 应用的高级抽象包
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // 实例化一个实际的 Nest 运行时环境，而不是单元测试中保存对 service 的引用
    app = moduleFixture.createNestApplication();  
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      // .set('Authorization', process.env.API_KEY)
      .expect(200)
      .expect('Hello World!');
  });
});
```

运行：`npm run test:e2e `

![image-20220503182312116](https://oss.justin3go.com/blogs/image-20220503182312116.png)

这个警告意味着有一些异步操作在我们的测试中没有终止，你需要关闭应用程序：

```typescript
afterAll(async () => {
  await app.close();
});
```

最终代码：

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest'; // 用于测试 HTTP 应用的高级抽象包
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 我们不想为每个端到端测试重新创建应用程序
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // 实例化一个实际的 Nest 运行时环境，而不是单元测试中保存对 service 的引用
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});

```

## 创建 e2e 测试

在 test 文件夹下创建`/coffee/`文件夹，并在内创建`coffee.e2e-spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CoffeesModule } from '../../src/coffees/coffees.module';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffeesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
});
```

加入待做事项提醒：

```typescript
it.todo('Create [POST /]');
it.todo('Get ll [GET /]');
it.todo('Get one [GET /:id]');
it.todo('Update one [PATCH /:id]');
it.todo('Delete one [DELETE /:id]');
```

但显然此时运行会出现之前见过的依赖错误，就是没有连接数据库，总的来说有三种方法解决：

- mock
- 使用较为简单的 SQLite 替代
- 直接使用原数据库 postgresql

这里用第三种方法：

打开`docker-compose`文件

```yaml
version: '3'

services:
  db:
    image: postgres
    restart: always
    ports:
      ["5432:5432"]
    environment:
      POSTGRES_PASSWORD: pass123

  test-db:
  image: postgres
  restart: always
  ports:
    ["5433:5432"]
  environment:
    POSTGRES_PASSWORD: pass123
```

然后在 package.json 下添加脚本简化操作：

```json
"scripts": {
  "pretest:e2e":"docker-compose up -d test-db",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  "posttest:e2e":"docker-compose stop test-db && docker-compose rm -f test-db"
},
// npm 允许我们添加生命周期钩子脚本，在对应的脚本名上加上'pre'和'post'前缀，就会在该脚本执行前后自动执行对应命令。 
```

回到`coffees.e2e-spec`文件并导入`TypeOrmModule.forRoot()`进行初始化：

```typescript
describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: +5433,  // 注意这里使用的是不同的端口
            username: 'postgres',
            password: 'pass123',
            database: 'postgres',
            autoLoadEntities: true,
            synchronize: true,
        }),
      ],
    }).compile();
// ...
});

```

`createTestingModule`会创建一个应用实例，我们需要将`main.ts`中的配置全部添加到该文件下：

```typescript
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
// ...
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({  // 这里
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));
    await app.init();
  });
```

使用需要 jasmine 需要安装并添加最后一行：

```typescript
// jest-e2e.json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "testRunner":"jasmine2"
}
```

添加逻辑之后的代码：

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreack Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: +5433, // 注意这里使用的是不同的端口
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
    .post('/coffees')
    .send(coffee as CreateCoffeeDto)
    .expect(HttpStatus.CREATED)
    .then(({body})=>{
      // 使用 jasmine 进行部分撇皮，当期望在执行实际而是时只关心某些键\值对时很有用。
      const expectdCoffee = jasmine.objectContaining({
        ...coffee,
        flavors: jasmine.arrayContaining(  // 每种 flavor 在应用中都是一个实体
          coffee.flavors.map(name=> jasmine.objectContaining({name})),
        ),
      });
      expect(body).toEqual(expectdCoffee);
    })
  });
  it.todo('Get ll [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
```
