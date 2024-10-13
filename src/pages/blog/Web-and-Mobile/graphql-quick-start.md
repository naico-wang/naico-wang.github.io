---
title: GraphQL 快速入门
date: 2024-10-13
abstract: 本文纯搬运，正好最近在深耕GraphQL，这篇文章通俗易懂，非常适合新手入门。原文链接:https://www.less-bug.com/posts/graphql-quick-start/
---

# GraphQL 快速入门

## 环境

https://github.com/notiz-dev/nestjs-prisma-starter 是一个基于 NestJS 和 Prisma 的后端项目模板，可以用来快速搭建后端项目。

## Schema

在 GraphQL 中，Schema 描述数据类型和操作。Schema 由自定义类型（User Type）、查询（Query）、变更（Mutation）和订阅（Subscription）组成。

下面是一个示例 Schema：

```graphql
type Query {
  posts: [Post]
  post(id: ID!): Post
}
type Mutation {
  createPost(title: String!, content: String!): Post!
  updatePost(id: ID!, title: String!, content: String!): Post!
  deletePost(id: ID!): Boolean
}
type Subscription {
  postAdded: Post
}
type Post {
  id: ID!
  title: String!
  content: String!
  author: User
}
type User {
  id: ID!
  name: String!
  email: String!
}
```

这里，Post 和 User 是自定义类型，Query、Mutation 和 Subscription 是操作。


```graphql
type Query {
  posts: [Post]
  post(id: ID!): Post
}
```

表示 Query 操作有两个字段，分别是 posts 和 post。posts 返回一个 Post 类型的数组，post(id: ID!): Post 这是一个参数为 id 的函数，返回一个 Post 类型的对象。! 表示这个字段是必须的。

## 一个真实的 Schema 例子

```graphql
type Auth {
  # JWT access token
  accessToken: JWT!
  # JWT refresh token
  refreshToken: JWT!
  user: User!
}
input ChangePasswordInput {
  newPassword: String!
  oldPassword: String!
}
input CreatePostInput {
  content: String!
  title: String!
}
# A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
scalar DateTime
# A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.
scalar JWT
input LoginInput {
  email: String!
  password: String!
}
type Mutation {
  changePassword(data: ChangePasswordInput!): User!
  createPost(data: CreatePostInput!): Post!
  login(data: LoginInput!): Auth!
  refreshToken(token: JWT!): Token!
  signup(data: SignupInput!): Auth!
  updateUser(data: UpdateUserInput!): User!
}
# Possible directions in which to order a list of items when provided an `orderBy` argument.
enum OrderDirection {
  asc
  desc
}
type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}
type Post {
  author: User
  content: String
  # Identifies the date and time when the object was created.
  createdAt: DateTime!
  id: ID!
  published: Boolean!
  title: String!
  # Identifies the date and time when the object was last updated.
  updatedAt: DateTime!
}
type PostConnection {
  edges: [PostEdge!]
  pageInfo: PageInfo!
  totalCount: Int!
}
type PostEdge {
  cursor: String!
  node: Post!
}
input PostOrder {
  direction: OrderDirection!
  field: PostOrderField!
}
# Properties by which post connections can be ordered.
enum PostOrderField {
  content
  createdAt
  id
  published
  title
  updatedAt
}
type Query {
  hello(name: String!): String!
  helloWorld: String!
  me: User!
  post(postId: String!): Post!
  publishedPosts(
    after: String
    before: String
    first: Int
    last: Int
    orderBy: PostOrder
    query: String
    skip: Int
  ): PostConnection!
  userPosts(userId: String!): [Post!]!
}
# User role
enum Role {
  ADMIN
  USER
}
input SignupInput {
  email: String!
  firstname: String
  lastname: String
  password: String!
}
type Subscription {
  postCreated: Post!
}
type Token {
  # JWT access token
  accessToken: JWT!
  # JWT refresh token
  refreshToken: JWT!
}
input UpdateUserInput {
  firstname: String
  lastname: String
}
type User {
  # Identifies the date and time when the object was created.
  createdAt: DateTime!
  email: String!
  firstname: String
  id: ID!
  lastname: String
  posts: [Post!]
  role: Role!
  # Identifies the date and time when the object was last updated.
  updatedAt: DateTime!
}
```

上面的 Schema 描述了一个博客系统的数据类型和操作。大多数内容都很好理解。除了下面这个可能需要解释一下：


```graphql
type PostConnection {
  edges: [PostEdge!]
  pageInfo: PageInfo!
  totalCount: Int!
}
type PostEdge {
  cursor: String!
  node: Post!
}
```

在 GraphQL 中，连接（Connection）和边缘（Edge）是分页数据的常用表示形式。

连接：表示分页数据的列表。

边缘：则表示连接中的单个元素，包括游标和节点。

Connection 和 Edge 这两个术语最初是由 Facebook 在 GraphQL 规范中引入的，用于描述分页数据的传输和表示形式。对于信息流的内容，一个连续的信息流就是一个连接，而每条信息就是一个边缘。这样，还可以通过边缘的游标来定位信息流中的某一条信息。

在这个示例 Schema 中，PostConnection 表示帖子列表的连接。它包括一个 edges 数组，每个元素都是一个 PostEdge 对象，表示一个帖子的边缘。

PostEdge 包括两个字段：cursor 和 node。cursor 是一个字符串类型的字段，它表示帖子边缘在连接中的位置。node 是一个 Post 类型的字段，它表示帖子节点本身。当你查询 PostConnection 时，你将获得一个包含多个 PostEdge 对象的 edges 数组。

读者可能疑问为什么使用 cursor 而非 id。这是因为 id 是唯一的，而 cursor 不必要唯一。游标通常是由服务器随机生成的，不透明的字符串。这意味着，它的值只能由服务器生成和解析。客户端不需要了解游标的具体含义，只需要在后续查询中将游标值作为参数传递给服务器即可。

## 作为客户端使用 GraphQL

我们以一个完整的博客使用流程来说明如何使用 GraphQL。经历如下步骤：

1. 注册用户 
2. 登录 
3. 创建帖子 
4. 查询帖子列表 
5. 查询帖子详情 
6. 更新帖子 
7. 删除帖子

### 1. 注册用户

们使用 signup 变更来创建新用户。signup 变更需要一个包含 email、password、firstname 和 lastname 的 SignupInput 输入对象，并返回一个包含访问令牌、刷新令牌和用户信息的 Auth 对象。

可以使用以下查询：

```graphql
mutation {
  signup(data: {
    email: "test@example.com",
    password: "password",
    firstname: "John",
    lastname: "Doe"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      firstname
      lastname
      role
    }
  }
}
```
执行上述查询后，返回：

```json
{
  "data": {
    "signup": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGc3YXBheTMwMDAwa2NvMnQ5NnUzaXVvIiwiaWF0IjoxNjgwOTE3MjAzLCJleHAiOjE2ODA5MTczMjN9.5B5E5bm5a-8o505HMzi82NTtc06v7gWy9-1c1L7p354",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGc3YXBheTMwMDAwa2NvMnQ5NnUzaXVvIiwiaWF0IjoxNjgwOTE3MjAzLCJleHAiOjE2ODE1MjIwMDN9.8UaJU_YJW7rUq9-eRZjef9EqVumhQBMXr_1Ib9yb1Iw",
      "user": {
        "id": "clg7apay30000kco2t96u3iuo",
        "email": "test@example.com",
        "firstname": "John",
        "lastname": "Doe",
        "role": "USER"
      }
    }
  }
}
```

现在，我们已经注册了一个新用户，并收到了访问令牌和刷新令牌。

> 访问令牌用于访问需要身份验证的资源，刷新令牌用于获取新的访问令牌。

### 2. 登录

使用 login 变更来进行登录。login 变更需要一个包含 email 和 password 的 LoginInput 输入对象，并返回一个包含访问令牌、刷新令牌和用户信息的 Auth 对象。

使用以下查询：

```graphql
mutation {
  login(data: {
    email: "test@example.com",
    password: "password"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      firstname
      lastname
      role
    }
  }
}
```

执行上述查询后，返回：

```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGc3YXBheTMwMDAwa2NvMnQ5NnUzaXVvIiwiaWF0IjoxNjgwOTIxNzcyLCJleHAiOjE2ODA5MjE4OTJ9.1e7Dk5wibQ4UCCcvzs_nyBOYkiB7x2hXRzLPMG9aznI",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGc3YXBheTMwMDAwa2NvMnQ5NnUzaXVvIiwiaWF0IjoxNjgwOTIxNzcyLCJleHAiOjE2ODE1MjY1NzJ9.N50PYxSSD2IuAU7aW4AtHvV_sS0g0S-RtjJ6dI0H7mI",
      "user": {
        "id": "clg7apay30000kco2t96u3iuo",
        "email": "test@example.com",
        "firstname": "John",
        "lastname": "Doe",
        "role": "USER"
      }
    }
  }
}
```

### 3. 创建帖子

现在可以使用访问令牌来创建帖子。在 Playground 的 HTTP Headers 中添加 Authorization 头，值为 Bearer <accessToken>。例如：

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGc3YXBheTMwMDAwa2NvMnQ5NnUzaXVvIiwiaWF0IjoxNjgwOTIxNzcyLCJleHAiOjE2ODA5MjE4OTJ9.1e7Dk5wibQ4UCCcvzs_nyBOYkiB7x2hXRzLPMG9aznI"
}
```

如果不设置访问令牌，会得到 Unauthorized 响应。

使用以下查询：

```graphql
mutation {
  createPost(data: {
    title: "My First Blog Post",
    content: "This is my first blog post using GraphQL"
  }) {
    id
    title
    content
    published
    author {
      id
      email
      firstname
      lastname
    }
  }
}
```

执行上述查询后，返回：

```json
{
  "data": {
    "createPost": {
      "id": "clg7dg0r20003kco2tkcx98d4",
      "title": "My First Blog Post",
      "content": "This is my first blog post using GraphQL",
      "published": true,
      "author": {
        "id": "clg7apay30000kco2t96u3iuo",
        "email": "test@example.com",
        "firstname": "John",
        "lastname": "Doe"
      }
    }
  }
}
```

现在，我们已经创建了一个新帖子，并且可以在查询帖子列表中看到它。

### 4. 查询帖子列表

现在，我们想查询所有已发布的帖子的列表。在 GraphQL Schema 中，我们使用 publishedPosts 查询来获取已发布的帖子。publishedPosts 查询接受以下参数：

- after：分页游标，用于获取后续页的数据。 
- before：分页游标，用于获取先前页的数据。 
- first：要返回的第一页中的帖子数。 
- last：要返回的最后一页中的帖子数。 
- orderBy：用于排序帖子的字段和方向。 
- query：用于搜索帖子的搜索字符串。 
- skip：要跳过的帖子数。

使用以下查询：

```graphql
query {
  publishedPosts(first: 10) {
    edges {
      node {
        id
        title
        content
        author {
          id
          email
          firstname
          lastname
        }
      }
    }
  }
}
```

执行上述查询后，返回：

```json
{
  "data": {
    "publishedPosts": {
      "edges": [
        {
          "node": {
            "id": "clg78awi60001kc2b327lbr8x",
            "title": "Join us for Prisma Day 2019 in Berlin",
            "content": "https://www.prisma.io/day/",
            "author": {
              "id": "clg78awi60000kc2bu023og4d",
              "email": "lisa@simpson.com",
              "firstname": "Lisa",
              "lastname": "Simpson"
            }
          }
        },
        {
          "node": {
            "id": "clg78awif0007kc2b1k85yo4r",
            "title": "Subscribe to GraphQL Weekly for community news",
            "content": "https://graphqlweekly.com/",
            "author": {
              "id": "clg78awif0006kc2b3wdoe1zu",
              "email": "bart@simpson.com",
              "firstname": "Bart",
              "lastname": "Simpson"
            }
          }
        },
        {
          "node": {
            "id": "clg7dg0r20003kco2tkcx98d4",
            "title": "My First Blog Post",
            "content": "This is my first blog post using GraphQL",
            "author": {
              "id": "clg7apay30000kco2t96u3iuo",
              "email": "test@example.com",
              "firstname": "John",
              "lastname": "Doe"
            }
          }
        }
      ]
    }
  }
}
```

现在，我们已经成功查询到了所有已发布的帖子，并且可以在结果中看到我们创建的帖子。

### 5. 查询帖子详情

我们想查询我们刚刚创建的帖子的详细信息。在 GraphQL Schema 中，我们使用 post 查询来获取单个帖子。post 查询接受一个名为 postId 的字符串参数，并返回一个包含帖子信息的 Post 对象。

使用以下查询：

```graphql
query {
  post(postId: "clg7dg0r20003kco2tkcx98d4") {
    id
    title
    content
    published
    author {
      id
      email
      firstname
      lastname
    }
  }
}
```
执行上述查询后，返回：

```json
{
  "data": {
    "post": {
      "id": "clg7dg0r20003kco2tkcx98d4",
      "title": "My First Blog Post",
      "content": "This is my first blog post using GraphQL",
      "published": true,
      "author": {
        "id": "clg7apay30000kco2t96u3iuo",
        "email": "test@example.com",
        "firstname": "John",
        "lastname": "Doe"
      }
    }
  }
}
```

现在，我们已经成功查询到了我们刚刚创建的帖子的详细信息。

### 6. 更新帖子

现在我们想更新我们刚刚创建的帖子。在 GraphQL Schema 中，我们使用 updatePost 变更来更新帖子。updatePost 变更需要一个包含 postId、title 和 content 的 UpdatePostInput 输入对象，并返回一个包含帖子信息的 Post 对象。

使用以下查询：

```graphql
mutation {
  updatePost(data: {
    postId: "clg7dg0r20003kco2tkcx98d4",
    title: "My Updated Blog Post",
    content: "This is my updated blog post using GraphQL"
  }) {
    id
    title
    content
    published
    author {
      id
      email
      firstname
      lastname 
    }
  }
}
```

执行上述查询后，返回：

```json
{
  "error": {
    "errors": [
      {
        "message": "Cannot query field \"updatePost\" on type \"Mutation\". Did you mean \"createPost\" or \"updateUser\"?",
        "locations": [
          {
            "line": 2,
            "column": 3
          }
        ],
        "extensions": {
          "code": "GRAPHQL_VALIDATION_FAILED",
          "stacktrace": [
            "GraphQLError: Cannot query field \"updatePost\" on type \"Mutation\". Did you mean \"createPost\" or \"updateUser\"?",
            "    at Object.Field (<SECRET>/node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.js:51:13)",
            "    at Object.enter (<SECRET>/node_modules/graphql/language/visitor.js:301:32)",
            "    at Object.enter (<SECRET>/node_modules/graphql/utilities/TypeInfo.js:391:27)",
            "    at visit (<SECRET>/node_modules/graphql/language/visitor.js:197:21)",
            "    at validate (<SECRET>/node_modules/graphql/validation/validate.js:91:24)",
            "    at processGraphQLRequest (<SECRET>/node_modules/@apollo/server/src/requestPipeline.ts:245:38)",
            "    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
            "    at internalExecuteOperation (<SECRET>/node_modules/@apollo/server/src/ApolloServer.ts:1290:12)",
            "    at runHttpQuery (<SECRET>/node_modules/@apollo/server/src/runHttpQuery.ts:232:27)",
            "    at runPotentiallyBatchedHttpQuery (<SECRET>/node_modules/@apollo/server/src/httpBatching.ts:85:12)"
          ]
        }
      }
    ]
  }
}
```

这是因为还没有实现 updatePost 变更。下面我们来实现这个变更。

在文件 src/posts/posts.resolver.ts 添加如下代码：

```typescript
@UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @UserEntity() user: User,
    @Args('data') data: UpdatePostInput,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: data.postId },
    });
    if (!post || post.authorId !== user.id) {
      throw new ForbiddenException('You can only update your own posts.');
    }
    return this.prisma.post.update({
      where: { id: data.postId },
      data: {
        title: data.title,
        content: data.content,
      },
      include: {
        author: true,
      },
    });
  }
```

创建如下 src/posts/dto/update-post.input.ts 文件：

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
@InputType()
export class UpdatePostInput {
  @Field()
  @IsNotEmpty()
  postId: string;
  @Field()
  @IsNotEmpty()
  title: string;
  @Field()
  @IsNotEmpty()
  content: string;
}
```

再次尝试，返回：

```json
{
  "data": {
    "updatePost": {
      "id": "clg7dg0r20003kco2tkcx98d4",
      "title": "My Updated Blog Post",
      "content": "This is my updated blog post using GraphQL",
      "published": true,
      "author": {
        "id": "clg7apay30000kco2t96u3iuo",
        "email": "test@example.com",
        "firstname": "John",
        "lastname": "Doe"
      }
    }
  }
}
```

现在，我们已经成功更新了我们刚刚创建的帖子。

### 7. 删除帖子

现在我们想删除我们刚刚创建的帖子。在 GraphQL Schema 中，我们使用 deletePost 变更来删除帖子。deletePost 变更需要一个名为 postId 的字符串参数，并返回一个包含布尔值的 Boolean 对象，表示是否成功删除帖子。

我们首先实现它：

路径：src/posts/posts.resolver.ts

```typescript
@UseGuards(GqlAuthGuard)
@Mutation(() => Boolean)
async deletePost(
  @UserEntity() user: User,
  @Args('postId') postId: string,
) {
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
  });
  if (!post || post.authorId !== user.id) {
    throw new ForbiddenException('You can only delete your own posts.');
  }
  await this.prisma.post.delete({
    where: { id: postId },
  });
  return true;
}
```

使用以下查询：

```graphql
mutation {
  deletePost(postId: "clg7dg0r20003kco2tkcx98d4")
}
```

执行上述查询后，返回：

```json
{
  "data": {
    "deletePost": true
  }
}
```

现在，我们已经成功删除了我们刚刚创建的帖子。
