---
title: 13. 经典算法实现
date: 2024-10-19
category: 数据结构与算法
---

# 13. 经典算法实现

## 排序算法
```javascript
function swap(arr, pos1, pos2) {
	let temp = arr[pos1];
	arr[pos1] = arr[pos2];
	arr[pos2] = temp;
}
```

### 选择排序
```javascript
// 通过 min 指针找到剩下区间的最小值，然后往有序区放置，第一次的时候就是与第一位进行交换
function selectSort(arr) {
	for (let i = 0; i < arr.length - 1; i++) {
		let min = i; // min 代表最小的元素索引
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[j] < arr[min]) {
				min = j;
			}
		}
		swap(arr, i, min);
	}
}
```

```javascript
{
	const testArr = [3, 2, 6, 8, 4, 7, 1, 5];
	selectSort(testArr);
	console.log(testArr);
}
```
    [
      1, 2, 3, 4,
      5, 6, 7, 8
    ]

### 冒泡排序
```javascript
function bubbleSort(arr) {
	for (let i = 0; i < arr.length - 1; i++) {
		// 这里的 i 代表着前面有序区的长度
		for (let j = 0; j < arr.length - 1 - i; j++) {
			if (arr[j + 1] < arr[j]) {
				swap(arr, j, j + 1); // 两两交换就可以把最大的交换到最后面去，第二次就是第二大的
			}
		}
	}
}

```

```javascript
{
	const testArr = [3, 2, 6, 8, 4, 7, 1, 5];
	bubbleSort(testArr);
	console.log(testArr);
}

```
    [
      1, 2, 3, 4,
      5, 6, 7, 8
    ]
    

### 合并排序
```javascript
function merge(left, right) {
	// 将两个有序数组合并为一个有序数组
	const res = [];
	while (left.length && right.length) {
		if (left[0] < right[0]) {
			res.push(left.shift());
		} else {
			res.push(right.shift());
		}
	}
	if (left.length) res.push(...left);
	if (right.length) res.push(...right);
	return res;
}
function mergeSort(arr) {
	// 利用递归实现分治的思想
	if (arr.length <= 1) return arr;
	let mid = Math.floor(arr.length / 2);
	let left = mergeSort(arr.slice(0, mid));
	let right = mergeSort(arr.slice(mid, arr.length));
	return merge(left, right);
}

```

```javascript
{
	const testArr = [3, 2, 6, 8, 4, 7, 1, 5];
	let res = mergeSort(testArr); // 注意并不是在原数组上操作的
	console.log(res);
}

```

    [
      1, 2, 3, 4,
      5, 6, 7, 8
    ]
    

### 快速排序
```javascript
function quickSort(arr) {
	if (arr.length <= 1) return arr;
	let pivot = arr.splice(0, 1);
	let less = arr.filter((val) => val < pivot);
	let greater = arr.filter((val) => val > pivot);
	return quickSort(less).concat(pivot, quickSort(greater));
}
```

```javascript
{
	const testArr = [3, 2, 6, 8, 4, 7, 1, 5];
	let res = quickSort(testArr); // 注意并不是在原数组上操作的
	console.log(res);
}
```

    [
      1, 2, 3, 4,
      5, 6, 7, 8
    ]
    

### 堆排序
```javascript
function heapSort(arr) {
	let len = arr.length;
	function siftDown(start, end) {
		// 因为后续需要划分为有序区和无序区，end 就是这条分界线
		let root = start;
		while (true) {
			// 这个 while 循环是为了解决你把父节点交换给子节点后，
			// 有可能子节点小于了孙子节点，所以为了保证大根堆的性质，就需要继续判断子节点与孙子节点的大小关系
			let child = 2 * root + 1; // 选择左孩子
			if (child > end) break; // 是否有左孩子，左孩子没，右孩子肯定没，所以直接跳出
			if (
				child + 1 <= end && // 是否有右孩子且如果大于左孩子就选择这个
				arr[child] < arr[child + 1]
			)
				child++;
			if (arr[root] < arr[child]) {
				// 跟节点与较大孩子的比较
				[arr[root], arr[child]] = [arr[child], arr[root]];
				root = child; // 因为交换了，所以可能子节点可能不会保持大根堆的性质，所以继续判断子节点
			} else break;
		}
	}
	// 创建大根堆， 其中有一步是为了找到第一个非终端节点
	for (let start = Math.floor((len - 2) / 2); start >= 0; start--) {
		siftDown(start, len - 1);
	}
	// 堆排序-->逐渐扩大有序区
	for (let end = len - 1; end > 0; end--) {
		[arr[0], arr[end]] = [arr[end], arr[0]];
		siftDown(0, end - 1);
	}
	return arr;
}

```

```javascript
{
	const testArr = [3, 2, 6, 8, 4, 7, 1, 5];
	let res = heapSort(testArr); // 注意并不是在原数组上操作的
	console.log(res);
}

```

    [
      1, 2, 3, 4,
      5, 6, 7, 8
    ]
    

### 插入排序
```javascript
function insertSort(arr) {
	for (let k = 1; k < arr.length; k++) {
		let cur = arr[k]; // 记录，之后会被改变需要重新赋值
		let j = k;
		while (j > 0 && arr[j - 1] > cur) {
			arr[j] = arr[j - 1];
			j--;
		}
		arr[j] = cur;
	}
	return arr;
}

```

```javascript
{
	const testArr = [3, 2, 6, 8, 4, 7, 1, 5];
	let res = insertSort(testArr); // 注意并不是在原数组上操作的
	console.log(res);
}

```

    [
      1, 2, 3, 4,
      5, 6, 7, 8
    ]
    

### 希尔排序
```javascript
function shellSort(arr) {
	let len = arr.length;
	let gap = Math.floor(len / 2);
	while (gap > 0) {
		for (let i = gap; i < len; i++) {
			let temp = arr[i];
			let j = i;
			while (j >= gap && arr[i - gap] > temp) {
				arr[j] = arr[j - gap];
				j -= gap;
			}
			arr[j] = temp;
		}
		gap = Math.floor(gap / 2);
	}
	return arr;
}

```

```javascript
{
	const testArr = [3, 2, 6, 8, 4, 7, 1, 5];
	let res = shellSort(testArr); // 注意并不是在原数组上操作的
	console.log(res);
}

```

    [
      1, 2, 4, 3,
      6, 5, 7, 8
    ]
    

### 快速选择-选择第 K 小
```javascript
function LomutoPartition(A, l, r) {
	let p = A[l];
	let s = l;
	// 通过 i 指针遍历，每次找到比 p 小的数，就扩大 s 的范围，然后交换，所以就形成了我们想要的结果：[0,s]是小于 p 的，(s,len)是大于等于 p 的
	for (let i = l + 1; i <= r; i++) {
		if (A[i] < p) {
			s++;
			[A[s], A[i]] = [A[i], A[s]];
		}
	}
	[A[s], A[l]] = [A[l], A[s]];
	return s;
}
// A：数组， l,r：左右指针，k：选择的第 k 小
function quickSelect(A, l, r, k) {
	let s = LomutoPartition(A, l, r);
	if (s === l + k - 1) {
		return A[s];
	} else if (s > l + k - 1) {
		A[s] = quickSelect(A, l, s - 1, k);
		return A[s];
	} else {
		A[s] = quickSelect(A, s + 1, r, l + k - 1 - s);
		return A[s];
	}
}

```

```javascript
{
	let res = quickSelect([3, 2, 6, 8, 4, 7, 1, 5], 0, 9, 4);
	console.log(res);
}

```

    [
      1, 2, 3, 4,
      5, 7, 6, 8
    ]
    4
    

## 动态规划
### 币值最大化
给定一排硬币，这些整数不一定两两相同，使得在其原始位置互不相邻的条件下，所选的硬币金额最大
-   包括最后一枚的：$c_n + F(n-2)$
-   不包括最后一枚的：$F(n-1)$
```javascript
function coinRow(coins) {
	const F = [0];
	F.push(coins[0]);
	for (let i = 1; i < coins.length; i++) {
		// coins 从 0 开始，初始 1 时是第二枚硬币，coins[i]与 F[i - 1]是间隔的 
		F.push(Math.max(coins[i] + F[i - 1], F[i]));
	}
	return F[coins.length];
}
```

```javascript
testCoin = [5, 1, 2, 10, 6, 2];
coinRow(testCoin);
```
    17

### 找零
m 种币值，找零金额为 n，求最少使用多少枚币

获取 n 的途径只能是：在总金额为$n-d_j$的一堆硬币加入一个面值为$d_j$的硬币，其中$j=1,2,...,m,$并且$n \geq d_j$。因此我们只需考虑所有满足上述要求的$d_j$并选择使得$F(n-d_j)+1$最小的$d_j$即可。由于 1 是常量，我们显然可以先找出最小的$F(n-d_j)$，然后加 1 即可
```javascript
function changeMaking(D, n) {
	const F = [0];
	for (let i = 1; i <= n; i++) { // 自底向上，求找零金额为 1-6 的最少硬币
		let temp = Number.MAX_VALUE;
		let j = 0;
		// 下一张就是从 D[]里面选，这里找出还没选时之前最小的，这个最小的就是这次找零最小的，因为下一张无论币值为多少，也只有一张，是常量；
		while (j < D.length && i >= D[j]) {
			temp = Math.min(F[i - D[j]], temp); // 求的是下一张选择不同零钱的集合的最小值
			j++;
		}
		F.push(temp + 1);  // 加上 1，选中的币值
	}
	return F[n];
}
```

```javascript
changeMaking([1, 3, 4], 6);
```
    2

### 背包
这个我觉得需要注意的就是记录方式为什么变为了二维的了：

行号：物品的数量，这里是物品的索引，可以找到对应的价值和重量；
列号：书包承受的重量；
值：这个参数下的最大价值；
因为有两个参数的变化能影响值
#### 基本背包问题解法
找出在下述参数（n, c, w, v）中价值最大的组合。

对于第 i 件的物品，在限重为 j 的条件下，它也是有两种情况：
-   第 i 件物品重量比此时限重 j 还要大，那么不放入背包，当前价值最优解就是对前 i-1 件物品处理最优结果
-   第 i 件物品重量小于等于此时限重 j，那么我们就有两种选择：不放入背包内和放入背包内。对于不放入背包内，处理结果和上面那种情况一样了；而对于放入背包内，则背包里已有的物品重量之和不能超过 j-w[i]，如果已有物品已经是最优解，那么放入第 i 件物品之后还是最优解。这两种选择，我们选取更优的结果就可以了。

递推式：
- $dp[i][j] = dp[i-1][j]$
- $dp[i][j] = Math.max(dp[i-1][j], v[i] + dp[i-1][j-w[i]])$
```javascript
function bag(n, c, w, v) {
	// 置零，表示初始状态，注意这里不能使用两个 fill 函数进行填充，否则会出现第二维都是指向一个数组，改一个而动全部
	const value = new Array(n+1); 
	for(let i = 0;i < value.length; i++){
		value[i] = new Array(c+1).fill(0);
	}
	for (let i = 1; i <= n; i++) {
		for (let j = 1; j <= c; j++) {
			value[i][j] = value[i - 1][j];  // 不包括第 i 个物品的情况
			// 包括第 i 个物品的情况与上面的作比较，取大（就是那个公式）
			if (j >= w[i - 1] && value[i][j] < value[i - 1][j - w[i - 1]] + 
v[i - 1])
// 不包含第 i 个物品需要找到 当前书包重量 j - 第 i 个物品的重量 取出对应的最大价值(之前有记录)，再加上第 i 个物品的价值
				value[i][j] = value[i - 1][j - w[i - 1]] + v[i - 1];
		}
	}
	return value;
}
```

```javascript
{
	let n = 4; // 物品的数量，
	let c = 5; // 书包能承受的重量，
	let w = [2, 1, 3, 2]; // 每个物品的重量，
	let v = [12, 10, 20, 15]; // 每个物品的价值
	let value = bag(n, c, w, v);
	console.log(value);  // 第零行列忽略，之后每一行代表每个物品，列代表承重量
	console.log(value[n][c]);  // n = 4, c = 5 的最佳组合
}
```
    [
      [ 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 12, 12, 12, 12 ],
      [ 0, 10, 12, 22, 22, 22 ],
      [ 0, 10, 12, 22, 30, 32 ],
      [ 0, 10, 15, 25, 30, 37 ]
    ]
    37
**总结一条：** 这两道题都需要找到缺当前量的前一个最值量，然后和现在的量进行组合，比较是否需要加当前量；

#### 回溯找组合
```javascript
function show(n, c, w, value) {
  console.log('最大价值为：', value[n][c]);
  let x = new Array(n).fill(false);
  // 回溯
  for (let i = n, j = c; i > 0; i--) {
    if (value[i][j] > value[i - 1][j]) {
      x[i - 1] = true;  // 说明选了第 i 个
      j -= w[i - 1];  // 减去对应选择的数量，注意这里 w，n 这些都是 0 开始的，而 value 数组是从 1 开始的
    }
  }
  console.log('背包中所装物品为：');
  for (let i = 0; i < n; i++) {
    if (x[i]) console.log(`第${i + 1}个`);
  }
}
```

```javascript
{
  let n = 4; // 物品的数量，
	let c = 5; // 书包能承受的重量，
	let w = [2, 1, 3, 2]; // 每个物品的重量，
	let v = [12, 10, 20, 15]; // 每个物品的价值
	let value = bag(n, c, w, v);
  show(n, c, w, value)
}
```
    最大价值为： 37
    背包中所装物品为：
    第 1 个
    第 2 个
    第 4 个
    

#### 带记忆功能的背包问题解法(递归形式的背包解法，不重要)
```javascript
function bagRemember(n, c, w, v) {
  function getArr(n, c) {
    // 生成第一列，第一行为 0，其余为 null(-1 表示)的二维数组
    let value = new Array(n + 1);
    value[0] = new Array(c + 1).fill(0);
    for (let i = 1; i <= n; i++) {
      value[i] = new Array(c + 1).fill(-1);
      value[i][0] = 0;
    }
    return value;
  }
  let value = getArr(n, c)
  function bagCore(i, j, w, v) {
    if (value[i][j] < 0) {  // 如果计算过了，那么就直接返回结果
      let temp = 0;
      if (j < w[i - 1]) temp = bagCore(i - 1, j, w, v);  // 剩余容量装不下当前物品了，只能不要当前物品
      else temp = Math.max(bagCore(i - 1, j, w, v),  //也是要当前物品与不要当前物品作比较
      bagCore(i - 1, j - w[i - 1], w, v) + v[i - 1])  
      value[i][j] = temp;
    }
    return value[i][j];
  }
  return bagCore(n, c, w, v);
}
```

```javascript
{
  let n = 4; // 物品的数量，
	let c = 5; // 书包能承受的重量，
	let w = [2, 1, 3, 2]; // 每个物品的重量，
	let v = [12, 10, 20, 15]; // 每个物品的价值
  bagRemember(n, c, w, v)
}
```
    37

#### 优化空间的尾部迭代法（不重要）
```javascript
// 仅仅使用一个一维数组保存最优解
function bagImproveSpace(n, c, w, v) {
  let values = new Array(c + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    for (let j = c; j > 0; j--) {
      if (j >= w[i - 1])
        values[j] = Math.max(values[j - w[i - 1]] + v[i - 1], values[j])
    }
  }
  return values;
}
```

```javascript
{
  let n = 4; // 物品的数量，
	let c = 5; // 书包能承受的重量，
	let w = [2, 1, 3, 2]; // 每个物品的重量，
	let v = [12, 10, 20, 15]; // 每个物品的价值
  bagImproveSpace(n, c, w, v)
}
```
    [ 0, 10, 15, 25, 30, 37 ]

## 顺序检索技术
### BF(暴力)
```javascript
function BF(s, p) {
	const indies = [];
	for (let i = 0; i < s.length - p.length + 1; i++) {
		let tempI = i;
		for (let j = 0; j < p.length; j++) {
			if (s[tempI] === p[j]) tempI++;
			else break;
		}
		if (tempI - i === p.length) {
			indies.push(i);
		}
	}
	return indies;
}
```


```javascript
BF("ddwyhdghwdghwdghwdghwdghwdghwdghwdwhdghwd", "wd");
```
    [
       8, 12, 16, 20,
      24, 28, 32, 39
    ]

### [🔗KMP](https://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)
```javascript
function getNextList(s) {
	let len = s.length;
	const nextList = [0, 0];
	let j = 0;
	for (let i = 1; i < len; i++) {
		while (j > 0 && s[i] !== s[j]) {
			j = nextList[j];
		}
		if (s[i] === s[j]) j++;
		nextList.push(j);
	}
	return nextList;
}
getNextList("ABCABC");
```
    [
      0, 0, 0, 0,
      1, 2, 3
    ]

```javascript
// KMP 算法的优势就在于不用回溯 j 指针
function KMP(s, p) {
	lenS = s.length;
	lenP = p.length;
	const nextList = getNextList(p);
	const indeis = [];
	let j = 0;
	for (let i = 0; i < lenS; i++) {
		// i 仍然是在一步步移动，只不过通过 j 跳过不需要的字符串，变的是 j；
		while (s[i] !== p[j] && j > 0) j = nextList[j];
		if (s[i] === p[j]) {
			j++;
			if (j === lenP) {
				indeis.push(i - lenP + 1);
				j = nextList[j];
			}
		}
	}
	return indeis;
}
KMP("ddwyhdghwdghwdghwdghwdghwdghwdghwdwhdghwd", "wd");
```
    [
       8, 12, 16, 20,
      24, 28, 32, 39
    ]

## 贪心算法
### Prim
```javascript
function cmp(key1, key2) {
  return key1 < key2 ? [key1, key2] : [key2, key1]
}

function prim(graph, initNode) {
  const visited = new Set(initNode);  // 已访问集
  const candidate = new Set(Object.keys(graph));  // 候选集
  candidate.delete(initNode);  // 添加所有除开始顶点的其他顶点
  const tree = [];  //结果
  while (candidate.size > 0) {
    let edgeMap = new Map();
    for (let node of visited) {  // 找到所有已访问节点
      for (let [connectNode, weight] of Object.entries(graph[node])) {  // 拿到与该节点相连的节点
        if (candidate.has(connectNode)) { // 没访问过就加入待选集
          edgeMap.set(cmp(connectNode, node), weight);  
        }
      }
    }
    let minKey = null, minVal = Number.MAX_VALUE;
    for (let [key, val] of edgeMap) {  //从待选集找到最小的权重路径
      if (val < minVal) {
        minKey = key;
        minVal = val;
      }
    }
    tree.push(minKey);
    visited.add(minKey[0]); // 把选中的加入已访问集合
    visited.add(minKey[1]);
    candidate.delete(minKey[0]);  // 把选中的移除候选集合
    candidate.delete(minKey[1]);

  }
  return tree;
}
let p_graph1 = {
  'a': { 'b': 3, 'e': 6, 'f': 5 },
  'b': { 'a': 3, 'c': 1, 'f': 4 },
  'c': { 'b': 1, 'd': 6, 'f': 4 },
  'd': { 'c': 6, 'e': 8, 'f': 5 },
  'e': { 'a': 6, 'd': 8, 'f': 2 },
  'f': { 'a': 5, 'b': 4, 'c': 4, 'd': 5, 'e': 2 }
}
let p_graph2 = {
  'a': { 'b': 5, 'c': 7, 'e': 2 },
  'b': { 'a': 5, 'd': 6, 'e': 3 },
  'c': { 'a': 7, 'd': 4, 'e': 4 },
  'd': { 'b': 6, 'c': 4, 'e': 5 },
  'e': { 'a': 2, 'b': 3, 'c': 4, 'd': 5 }
}
console.log(prim(p_graph1, 'a'));
console.log(prim(p_graph2, 'a'));
```

    [
      [ 'a', 'b' ],
      [ 'b', 'c' ],
      [ 'b', 'f' ],
      [ 'e', 'f' ],
      [ 'd', 'f' ]
    ]
    [ [ 'a', 'e' ], [ 'b', 'e' ], [ 'c', 'e' ], [ 'c', 'd' ] ]
    

### Kruskal
```javascript
function cmp(){
  
}
```

### Dijkstra
```javascript
const INF = Number.MAX_SAFE_INTEGER;
// 查找最近的点
const minDistance = (dist, visited) => {
  let min = INF;
  let minIndex = -1;
  for (let v = 0; v < dist.length; v++) {
    if (visited[v] === false && dist[v] <= min) {
      min = dist[v];
      minIndex = v;
    }
  }
  return minIndex;
};
/** 
 * @param {图：邻接矩阵} graph 
 * @param {顶点索引} src 
 */
const dijkstra = (graph, src) => {
  const dist = [];
  // 用于标识顶点 src 至其他顶点的距离是否确定
  const visited = [];
  const { length } = graph; 
  for (let i = 0; i < length; i++) {
    dist[i] = INF;
    visited[i] = false;
  }
  dist[src] = 0;
  for (let i = 0; i < length - 1; i++) {
    const u = minDistance(dist, visited);
    // 标识顶点 src 到此顶点的距离已经确认
    visited[u] = true;
    for (let v = 0; v < length; v++) {
      if (!visited[v] && graph[u][v] !== 0 && dist[u] !== INF && dist[u] + graph[u][v] < dist[v]) {
        // 更新 dist
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }
  return dist;
};

// test 
const graph = [
    [0, 2, 4, 0, 0, 0],
    [0, 0, 2, 4, 2, 0],
    [0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 2],
    [0, 0, 0, 3, 0, 2],
    [0, 0, 0, 0, 0, 0]
];

const dist = dijkstra(graph, 0);
for (let i = 0; i < dist.length; i++) {
    console.log(i + '\t\t' + dist[i]);
}
```

    0		0
    1		2
    2		4
    3		6
    4		4
    5		6
