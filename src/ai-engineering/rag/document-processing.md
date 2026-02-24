---
title: 文档处理
position: 4
---

# 博客/企业文档如何变成 AI 知识库（文档分片、向量化、构建索引）

> 想让 AI 真正“懂”你的知识？关键在于如何把杂乱无章的文档变成结构化、可检索的智能资产。

让模型"读懂"海量文本的关键在于将非结构化文档转化为易于检索的向量形式。具体流程通常包括：文档分片、向量化 和 索引构建 三个步骤。

## 文档分片（Chunking）

首先将长文档切分为较小的段落或片段，以适应模型上下文窗口限制。常见的分片策略是按固定字数或句子数切分，并在片段间引入重叠（overlap）以保留上下文连贯。例如，可将每篇博客按段落拆分成长度约 500 字的片段并保留前一片段的末句作为重叠。分片的目的在于减少每个输入片段的“噪音”，突出相关信息，并确保后续 embedding 过程能捕捉局部语义。

```python
# 假设 texts 列表包含若干长文档字符串
from textwrap import wrap
chunk_size = 500  # 每个片段约 500 字符
overlap = 50      # 重叠部分长度
documents = []
for text in texts:
    # 简单按照固定长度切分，并添加重叠
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size - overlap)]
    documents.extend(chunks)
print(f"切分后得到 {len(documents)} 个文档片段")
````

上面的代码演示了将文档列表按固定长度切分片段。在实际应用中，可以使用现有工具如 LangChain 或 LlamaIndex 提供的文本分割器，这些工具支持按句子、段落甚至编程代码单元进行智能切分，并可配置重叠大小。例如，LlamaIndex 默认采用 1024 tokens 的块大小并附带一定重叠。

## 向量化（Vectorization）

对每个文档片段，通过预训练的文本嵌入模型提取向量表示。嵌入模型可以选择通用的预训练模型（如 `sentence-transformers` 系列）或领域专用模型。若使用 OpenAI 的 API，也可以采用诸如 `text-embedding-ada-002` 等模型获取向量。向量化后的结果是一个高维向量（数百维到上千维不等），捕捉了文本片段的语义特征。这些向量将作为“知识”的表征被存储备用。

```python
# 利用 OpenAI 的文本嵌入模型将文档片段列表转换为向量（伪代码）
import openai
EMBEDDING_MODEL = "text-embedding-ada-002"
embeddings = []
for doc in documents:
    resp = openai.Embedding.create(model=EMBEDDING_MODEL, input=doc)
    embeddings.append(resp["data"][0]["embedding"])
```

在实际场景中，应考虑批量请求以提高向量提取的效率，并留意 API 调用的费用。同时需要为每个向量保存元数据，例如该片段所属的文档 ID、段落位置等，以便检索结果用于生成答案时可以定位来源。


## 构建索引

将得到的向量集合插入到选定的向量数据库中，建立索引以支持相似度检索。多数向量数据库提供便捷的方法插入批量向量并自动构建索引。例如，使用 Chroma 向量库，可以这样创建索引并存储向量：

```python
# 安装 Chroma 数据库的 Python 库（需要在有网络的环境执行）
# pip install chromadb
from chromadb import Client
client = Client()
collection = client.create_collection("knowledge_base")

# 批量插入向量及其关联的文本或元数据
collection.add(
    embeddings=embeddings,
    documents=documents,
    ids=[f"doc_{i}" for i in range(len(documents))]
)
```

以上代码演示了使用 Chroma 创建一个名为“knowledge_base”的集合，并添加向量数据和对应文本。在添加时我们为每个向量指定了一个 ID，用于将检索结果与原始内容关联。不同的向量数据库添加向量的方式会有所区别，但本质都是将文本向量及其标识存储起来，供后续相似度搜索。

经过以上三步，我们就将博客或企业文档转化为了 AI 知识库。当用户提问时，RAG 流程会将问题向量化，在向量数据库中检索语义相似的几个片段，作为上下文提供给 LLM 生成答案。这种方式使得 LLM 的回答既基于自身掌握的语言知识，又参考了检索到的权威资料，从而提高准确性和可信度。
