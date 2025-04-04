---
title: 07. 查找
date: 2024-10-19
category: 数据结构与算法
---

# 07. 查找

## 基础查找方法

### 评价方法

- 查找效率
  - 占用存储空间的多少
  - 算法本身复杂程度
- 平均查找长度 ASL

$$
ASL = \sum_{i=1}^{n}p_ic_i
$$

p_i 为查找表中第 i 个元素的概率，
$$
\sum_{i=1}^{n}p_i = 1
$$
c_i 为找到表中第 i 个元素所需比较次数。

### 顺序查找

从表的一端开始，逐一开始查找。

<img src="https://oss.justin3go.com/blogs/image-20220120201939795.png" alt="image-20220120201939795" style="zoom:67%;" />

### 折半查找

ASL：log_2(n)

适合表结点比较稳定、很少做插入或删除操作的顺序表。

### 分块查找

<img src="https://oss.justin3go.com/blogs/image-20210609220020696.png" alt="image-20210609220020696" style="zoom:50%;" />

### 插值查找

类似于二分查找，不过不是取中间位置，而是取数据的中值，也要求数据有序。

适用于查找表数据量较大、数据分布比较均匀。

### 斐波拉契查找

······

## 二叉排序树(BST)

### 关键：

按中序遍历该树得到的序列是递增有序的

<img src="https://oss.justin3go.com/blogs/image-20210609220516391.png" alt="image-20210609220516391" style="zoom:50%;" />

### 二叉排序树的查：

<img src="https://oss.justin3go.com/blogs/image-20210609220954999.png" alt="image-20210609220954999" style="zoom:50%;" />

### 性能分析

- ASL 与二叉树的形态有关
- ASL = （n+1）/2[顺序表]~~~log_2(n)

### 二叉排序树的删除

- p 是叶子，直接删除。
- p 有一个孩子，将孩子与双亲相连，然后删除。
- **p 有两个孩子，用中序遍历的前趋替代 p。**

<img src="https://oss.justin3go.com/blogs/image-20210609221501920.png" alt="image-20210609221501920" style="zoom:50%;" />

## 平衡二叉树(AVL)及其调整

**对给定序列建立 BST，使左子树和右子树高度差的绝对值（平衡因子）不超过 1。**

插入或删除结点后，可能使树失去平衡，需调平：

<img src="https://oss.justin3go.com/blogs/image-20210609222036103.png" alt="image-20210609222036103" style="zoom:50%;" />

<img src="https://oss.justin3go.com/blogs/image-20210609222053595.png" alt="image-20210609222053595" style="zoom:50%;" />

## 哈希表

。。。

见散列表实现查找
