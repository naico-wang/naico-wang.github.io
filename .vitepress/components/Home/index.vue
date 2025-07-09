<style lang="less" scoped>
.home-wrapper {
  margin: 0 auto;
  padding: 0 4rem;
}

.banner {
  padding-top: 2rem;
  text-align: center;
  margin: 0 auto 2rem;

  & fieldset {
    font-weight: bold;
    text-align: center;
    border-width: 3px;
    border-style: dashed;
    padding: 1rem 0;

    & legend {
      font-weight: 600;
      font-size: 1.25rem;
    }

    & img {
      width: 8rem;
      border-radius: 50%;
      margin: 0 auto;
    }

    & .title {
      font-size: 1.25rem;
      margin-top: 1rem;
      color: #000000;
    }

    & .introduction {
      margin-top: 1rem;
    }

    & .introduction > li {
      padding: 0.25rem 0;
      font-weight: 500;
      color: #666666;
      font-size: 0.875rem;
    }
  }
}

.dark .banner {
  & .banner-content {
    & .title {
      color: #ffffff;
    }
  }
}

.module-title {
  padding: 0.75rem 0;
  border-bottom: solid 1px #e1e1e1;
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 700;

  &:before {
    content: '';
    width: 4px;
    height: 20px;
    background-color: #000000;
    margin-right: 0.5rem;
  }
}

.module-content {
  margin: 1rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem;

  & .menu-item {
    border: solid 1px #e1e1e1;
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: var(--lulu-box-shadow);
    }

    & .menu-icon {
      background-color: #e3e3e3;
      border-radius: 0.5rem;
      padding: 2rem 0;

      & .image-src {
        width: 2rem;
        height: 2rem;
        margin: 0 auto;
      }
    }

    & .menu-text {
      margin-top: 0.5rem;

      & .title {
        font-size: 1.125rem;
        font-weight: 600;
      }

      & .desc {
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }
    }
  }
}
.image-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem 0;

  & img {
    width: 20rem;
    height: 5rem;
    padding: 1rem;
    object-fit: contain;
    border: solid 1px #e1e1e1;
    border-radius: 0.5rem;
    box-shadow: var(--lulu-box-shadow);
  }
}
</style>

<template>
  <main class="home-wrapper">
    <div class="banner">
      <fieldset>
        <legend>Naico (Hongyu) Wang</legend>
        <img src="/images/avatar.png" alt="naico.wang" />
        <div class="title">Too Young, Too Simple, Sometimes Naive.</div>
        <ul class="introduction">
          <li>Work as Staff Engineer - Web</li>
          <li>Talk is Cheap, Show me the CODE</li>
          <li>PPT Engineer / Confluence Engineer</li>
          <li>PMP / PMI-ACP</li>
        </ul>
      </fieldset>
    </div>
    <div class="module-title">推荐内容</div>
    <div class="module-content">
      <a
        v-for="(item, idx) in homeFeatures"
        class="menu-item"
        :href="item.link"
      >
        <div class="menu-icon" :key="idx">
          <img class="image-src" :src="item.image"  alt="documents"/>
        </div>
        <div class="menu-text">
          <span class="title">{{item.title}}</span>
          <p class="desc">{{item.description}}</p>
        </div>
      </a>
    </div>
    <div class="module-title">过往工作经历</div>
    <div class="image-container">
      <img src="/images/company-grain.png" alt="ChinaSoft" />
      <img src="/images/company-chinasoft.png" alt="ChinaSoft" />
      <img src="/images/company-microsoft.png" alt="ChinaSoft" />
      <img src="/images/company-mercer.png" alt="ChinaSoft" />
      <img src="/images/company-farfetch.png" alt="ChinaSoft" />
      <img src="/images/company-marriott.png" alt="ChinaSoft" />
    </div>
  </main>
</template>

<script setup lang="ts">
const homeFeatures = [
  {
    image: '/images/home-icon-documents.svg',
    title: '经典设计模式',
    description: '21种经典设计模式详解，原书：《深入设计模式》',
    link: '/'
  },
  {
    image: '/images/home-icon-radar.svg',
    title: '面试八股文',
    description: '让人又恨又爱的八股文，涵盖了算法，前端，后端，操作系统',
    link: '/'
  },
  {
    image: '/images/home-icon-swagger.svg',
    title: '系统架构设计',
    description: '常见的系统架构设计以及结构思想相关文章',
    link: '/'
  }
]
</script>