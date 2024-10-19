---
title: 常用Monorepo工具横向对比
date: 2024-07-03
tag: JavaScript
abstract: 横向比较了常见的monorepo工具，并整理成了表格可供大家参阅
---

# 常用Monorepo工具横向对比

::: info
Each tool fits a specific set of needs and gives you a precise set of features.
Depending on your needs and constraints, we'll help you decide which tools best suit you.
:::

## 常用工具框架

- Bazel (by Google)
   
   [https://bazel.build/](https://bazel.build/)

    > "A fast, scalable, multi-language and extensible build system."

- Gradle (by Gradle, Inc)

    [https://gradle.org/](https://gradle.org/)

    > "A fast, flexible polyglot build system designed for multi-project builds."

- Lage (by Microsoft)

    [https://microsoft.github.io/lage/](https://microsoft.github.io/lage/)

    > "Task runner in JS monorepos", "Never build the same code twice"

- Lerna (maintained by Nx team)

    [https://lerna.js.org/](https://lerna.js.org/)

    > "A tool for managing JavaScript projects with multiple packages."

- Moonrepo (by moonrepo)

    [https://moonrepo.dev/](https://moonrepo.dev/)

    > "A task runner and monorepo management tool for the web ecosystem."

- Nx

    [https://nx.dev/](https://nx.dev/)

    > "Next generation build system with first class monorepo support and powerful integrations."

- Pants (by Pants Build)

    [https://www.pantsbuild.org/](https://www.pantsbuild.org/)

    [https://www.pantsbuild.org/blog/2022/03/15/effective-monorepos-with-pants](https://www.pantsbuild.org/blog/2022/03/15/effective-monorepos-with-pants)

    > "A fast, scalable, user-friendly build system for codebases of all sizes."

- Rush Stack (by Microsoft)

    [https://rushstack.io/](https://rushstack.io/)

    > "Geared for large monorepos with lots of teams and projects. Part of the Rush Stack family of projects."

- Turborepo (by Vercel)

    [https://turbo.build/](https://turbo.build/)

    > "The high-performance build system for JavaScript & TypeScript codebases."

## 横向对比

|                                      	| Bazel   	| Gradle  	| Lage    	| Lerna   	| moon    	| Nx      	| Pants   	| Rush Stack 	| Turborepo 	|
|--------------------------------------	|---------	|---------	|---------	|---------	|---------	|---------	|---------	|------------	|-----------	|
| Fast                                 	|         	|         	|         	|         	|         	|         	|         	|            	|           	|
| Local computation caching            	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes**    	| **Yes**   	|
| Local task orchestration             	| **Yes** 	|         	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes**    	| **Yes**   	|
| Distributed computation caching      	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes**    	| **Yes**   	|
| Distributed task execution           	| **Yes** 	| No      	| ---     	| **Yes** 	| No      	| **Yes** 	| **Yes** 	| No         	| ---       	|
| Transparent remote execution         	| **Yes** 	| ---     	| ---     	| ---     	| ---     	| ---     	| **Yes** 	| ---        	| ---       	|
| Detecting affected projects/packages 	| No      	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes**    	| **Yes**   	|
| Understandable                       	|         	|         	|         	|         	|         	|         	|         	|            	|           	|
| Workspace analysis                   	| No      	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes** 	| **Yes**    	| **Yes**   	|
| Dependency graph visualization       	| **Yes** 	| No      	| No      	| Yes     	| Yes     	| Yes     	| No      	| No         	| **Yes**   	|
| Manageable                           	|         	|         	|         	|         	|         	|         	|         	|            	|           	|
| Source code sharing                  	| Yes     	| Yes     	| Yes     	| Yes     	| Yes     	| Yes     	| Yes     	| Yes        	| Yes       	|
| Consistent tooling                   	| Yes     	| Yes     	| ---     	| ---     	| Yes     	| Yes     	| Yes     	| ---        	| ---       	|
| Code generation                      	| No      	| No      	| No      	| No      	| Yes     	| Yes     	| Yes     	| No         	| No        	|
| Project constraints and visibility   	| Yes     	| No      	| No      	| No      	| Yes     	| Yes     	| No      	| Yes        	| No        	|

数据来源：[https://monorepo.tools/](https://monorepo.tools/)

## References

- [The One Version Rule – opensource.google](https://opensource.google/docs/thirdparty/oneversion?utm_source=monorepo.tools)
- [Why TurboRepo Will Be The First Big Trend of 2022](https://dev.to/swyx/why-turborepo-will-be-the-first-big-trend-of-2022-4gfj?utm_source=monorepo.tools)
- [Build Monorepos, not Monoliths](https://dev.to/agentender/build-monorepos-not-monoliths-4gbc?utm_source=monorepo.tools)
- [Lerna 5.1 - New website, new guides, new Lerna example repo, distributed caching support and speed!](https://dev.to/nrwl/lerna-51-new-website-new-guides-new-lerna-example-repo-distributed-caching-support-and-speed-31oe?utm_source=monorepo.tools)
- [Nx monorepo documentation](https://nx.dev/guides/why-monorepos#monorepos?utm_source=monorepo.tools)
- [Pants Articles](https://www.pantsbuild.org/docs/media#posts--articles?utm_source=monorepo.tools)
