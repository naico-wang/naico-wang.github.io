---
title: 2024年 Nodejs 生态合集
date: 2024-08-12
abstract: 2024年，nodejs 在 Javascript 运行时中仍然占据着霸主的地位。其丰富的生态系统是其他运行时无法比拟的。今天我们就来盘点下2024年当下 nodejs 的生态系统。
---

# 2024年 Nodejs 生态合集

2024年，nodejs 在 Javascript 运行时中仍然占据着霸主的地位。其丰富的生态系统是其他运行时无法比拟的。今天我们就来盘点下2024年当下 nodejs 的生态系统。

数据来源于 [Nodejs Toolbox](https://nodejstoolbox.com/) 网站，该网站展示了 Nodejs 生态系统中积极维护且流行的库。按照下载量进行排序。

## Authentication

Handle the authentication of users for web applications

```wbs
* Authentication
** passport
** express-session
** grant
** @hapi/bell
```

## Authorization

Restrict user actions according to various access control patterns

```wbs
* Authorization
** @casl/ability
** oso
** casbin
** accesscontrol
```

## Benchmarking

Run code benchmarks in Node.js and analyze results

```wbs
* Benchmarking
** benchmark
** tinybench
** benny
```

## Browser Testing

Write automated tests that run in real-world browser environments

```wbs
* Browser Testing
** puppeteer
** @playwright/test
** selenium-webdriver
** cypress
** nightmare
** webdriverio
** nightwatch
```

## Build Systems

Manage codebases containing multiple distinct projects (Monorepos)

```wbs
* Build Systems
** lerna
** nx
** turbo
** bolt
** oao
** bit
```

## Bundlers

Bundle an application's source code into a single file. Mostly used for frontend apps to minimize network requests

```wbs
* Bundlers
** webpack
** vite
** parcel
** esbuild
** rollup
** tsup
```

## Code Complexity

Analyze and visualize code complexity to help you refactor (legacy) codebases

```wbs
* Code Complexity
** plato
** code-complexity
** es6-plato
** complexity-report
** typhonjs-escomplex
```

## Code Graphs

Generate a visual graph of your code's internal dependencies

```wbs
* Code Graphs
** madge
** dependency-cruiser
```

## Code Linters & Formatters

Format code and fix problems before shipping to production

```wbs
* Code Linters & Formatters
** prettier
** eslint
** @typescript-eslint/eslint-plugin
** rome
** stylelint
** jshint
** hint
```

## Command Line Prompts

Create interactive command line tools by asking for user input

```wbs
* Command Line Prompts
** inquirer
** prompts
** @inquirer/prompts
** enquirer
```

## Command Line Styling

Create beautiful command line tools

```wbs
* Command Line Styling
** chalk
** colors
** ink
** kleur
** cli-color
** terminal-in-react
```

## Command Line Utilities

Use Node.js to create powerful command line applications

```wbs
* Command Line Utilities
** commander
** yargs
** minimist
** optionator
** nopt
** meow
```

## Configuration Management

Load environment variables and configure your applications

```wbs
* Configuration Management
** dotenv
** rc
** config
** nconf
** convict
```

## Content Management Systems

Create and manage content seamlessly using Node.js-based CMS solutions

```wbs
* Content Management Systems
** @strapi/strapi
** ghost
** directus
** decap-cms-app
** payload
** @keystone-6/core
** @tinacms/cli
```

## CSV Parsers

Work with CSV files from Node.js

```wbs
* CSV Parsers
** papaparse
** csv-parse
** csvtojson
** fast-csv
** csv-parser
** d3-dsv
** lil-csv
```

## Date & Time

A more intuitive approach to dates and times than the standard library

```wbs
* Date & Time
**[#pink] moment (Deprecated)
** dayjs
** date-fns
** luxon
```

## Dependency Management

Review outdated dependencies and manually (or automatically) update them

```wbs
* Dependency Management
** renovate
** npm-check-updates
** npm-check
** depcheck
** updtr
** depngn
** updates
```

## Email Delivery

Send emails with ease from Node.js

```wbs
* Email Delivery
** nodemailer
** email-templates
** emailjs
** sendmail
```

## Excel Spreadsheets

Parse and write excel spreadsheets in Node.js

```wbs
* Excel Spreadsheets
** xlsx
** exceljs
** node-xlsx
```

## File Uploads

Handle file uploads in Node.js applications

```wbs
* File Uploads
** multer
** formidable
** busboy
** express-fileupload
** multiparty
```

## Full-stack Frameworks

Quickly develop full-stack applications with these batteries-included frameworks

```wbs
* Full-stack Frameworks
** @nestjs/core
** meteor
** sails
** egg
** @redwoodjs/core
** @adonisjs/core
** @feathersjs/feathers
** @loopback/core
** @foal/core
```

## HTML Scrapers

Easily find and extract the data you need from HTML

```wbs
* HTML Scrapers
** jsdom
** cheerio
** @mozilla/readability
** @postlight/parser
** node-html-parser
```

## HTTP Clients

Send network requests and fetch data from external APIs

```wbs
* HTTP Clients
** axios
**[#pink] request (Deprecated)
** node-fetch
** got
** undici
** wretch
** urllib
```

## HTTP Frameworks

Minimalist frameworks based around HTTP verbs and routes

```wbs
* HTTP Frameworks
** express
** koa
** fastify
** @hapi/hapi
** hono
** restify
** micro
** polka
** @tinyhttp/app
** faasjs
```

## HTTP Mocking

Mock network requests and test modules in isolation

```wbs
* HTTP Mocking
** superagent
** msw
** nock
** axios-mock-adapter
** counterfact
```

## Image Processing

Resize, crop and convert images to various formats

```wbs
* Image Processing
** sharp
** jimp
** gm
** imagemin
** imagemagick
** compress-images
```

## Job Queues

Schedule and process CPU intensive tasks off the main thread

```wbs
* Job Queues
** bull
** kue
** agenda
** bullmq
** bee-queue
** pg-boss
** node-resque
```

## JSON Schema Validators

Use JSON Schema language to validate user input and anything else

```wbs
* JSON Schema Validators
** ajv
** jsonschema
** is-my-json-valid
** @cfworker/json-schema
** @exodus/schemasafe
** djv
** json-schema-library
```

## JSON Web Token (JWT)

Sign and verify JWTs in Node.js

```wbs
* JSON Web Token (JWT)
** jsonwebtoken
** jose
** jwt-decode
** node-jose
** fast-jwt
```

## Logging

Log events to help you debug problems in your application

```wbs
* Logging
** winston
** pino
**[#pink] npmlog(Deprecated)
** morgan
** loglevel
** log4js
** bunyan
```

## MongoDB Clients

MongoDB clients for Node.js

```wbs
* MongoDB Clients
** mongoose
** mongodb
```

## MySQL Clients

Node.js drivers for MySQL

```wbs
* MySQL Clients
** mysql
** mysql2
```

## Object-relational Mapping (ORM)

Map SQL database tables to JavaScript objects

```wbs
* Object-relational Mapping (ORM)
** typeorm
** sequelize
** prisma
** drizzle-orm
** objection
** mikro-orm
** orange-orm
```

## Object Schema Validators

Simple and intuitive validation with object schemas

```wbs
* Object Schema Validators
** validator
** zod
** joi
** yup
** valibot
```

## Package Publishing

Automate your package release workflow

```wbs
* Package Publishing
** semantic-release
**[#pink] standard-version (Deprecated)
** release-it
** np
```

## Package to Executable

Package a Node.js application into a single executable file

```wbs
* Package to Executable
** bun
** pkg
** nexe
** @vercel/ncc
```

## PDF Generation

Generate PDF files with Node.js

```wbs
* PDF Generation
** jspdf
** pdfmake
** pdfkit
** pdf-lib
** @pdfme/generator
```

## PostgreSQL Clients

Interact with PostgreSQL databases from Node.js

```wbs
* PostgreSQL Clients
** pg
** postgres
** slonik
** pg-promise
```

## QR Code Generation

Programmatically generate QR codes in Node.js

```wbs
* QR Code Generation
** qrcode
** qrcode-generator
** qrcode-terminal
** qr-image
** headless-qr
**[#pink] @shortcm/qr-image (Deprecated)
```

## Query Builders

Write JavaScript to build SQL queries

```wbs
* Query Builders
** knex
** kysely
```

## Random Data Generation

Generate random data to test your application

```wbs
* Random Data Generation
** @faker-js/faker
** chance
** json-schema-faker
** casual
** @ngneat/falso
```

## Redis Clients

Redis clients for Node.js

```wbs
* Redis Clients
** redis
** ioredis
```

## Scheduling

Run tasks on a schedule

```wbs
* Scheduling
** cron
** node-schedule
** node-cron
** bree
** toad-scheduler
```

## Shell Execution

Execute shell commands from Node.js

```wbs
* Shell Execution
** execa
** zx
** shelljs
```

## SQLite Clients

Node.js drivers for SQLite

```wbs
* SQLite Clients
** sqlite3
** better-sqlite3
```

## Static Servers

Serve a statically generated site on localhost

```wbs
* Static Servers
** http-server
** serve
** live-server
** anywhere
** sirv-cli
```

## Template Engines

Render dynamic HTML output

```wbs
* Template Engines
** handlebars
** pug
** mustache
** ejs
** nunjucks
** eta
```

## Test Frameworks

Frameworks to help you write automated tests

```wbs
* Test Frameworks
** jest
** mocha
** ava
** vitest
** qunit
** jasmine
```

## Web Scraping Frameworks

Crawl and scrape entire websites using Node.js

```wbs
* WSF
** crawlee
** x-ray
```

::: info Github 源码地址：
[https://github.com/Maximization/nodejs-toolbox-catalog](https://github.com/Maximization/nodejs-toolbox-catalog)
:::