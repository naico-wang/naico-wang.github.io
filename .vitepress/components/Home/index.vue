<style lang="less" scoped>
.home-wrapper {
  margin: 0 auto;
  padding: 0 4rem;
}

.banner {
  padding-top: 2rem;
  margin: 0 auto 2rem;

  & fieldset {
    font-weight: bold;
    text-align: center;
    border-width: 3px;
    border-style: dashed;
    border-color: #222222;
    padding-top: 1rem;

    & legend {
      font-weight: 600;
      font-size: 1.25rem;
    }

    & .title {
      text-align: center;
      font-size: 1.25rem;
      color: #000000;
    }

    & .content {
      max-width: 25rem;
      padding: 1rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 1.5rem;

      & img {
        width: 6.5rem;
        height: 6.5rem;
        border-radius: 50%;
        box-shadow: var(--lulu-box-shadow);
      }

      & .introduction {
        flex: 1;
      }

      & .introduction > li {
        padding: 0.15rem 0.25rem;
        font-weight: 500;
        color: #666;
        font-size: 0.75rem;
        text-align: left;
        display: flex;
        align-items: center;

        &:before {
          content: '';
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: #666;
          margin-right: 0.5rem;
        }
      }
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

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.5rem;

  .module-title {
    padding: 0.75rem 0;
    border-bottom: solid 1px #222222;
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
    grid-template-columns: 1fr;
    grid-gap: 2rem;

    &.image {
      grid-template-columns: 1fr 1fr;
    }

    & .module-item {
      border: solid 1px #222222;
      border-radius: 0.5rem;
      padding: 1rem 0;
      transition: all 0.2s ease-in-out;
      text-align: center;

      &:hover {
        box-shadow: var(--lulu-box-shadow);
      }

      & .title {
        font-size: 1rem;
        font-weight: 600;
      }

      & .desc {
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
    }
    & img {
      width: 15rem;
      height: 86px;
      border-radius: 0.5rem;
      padding: 1rem;
      object-fit: contain;
      border: solid 1px #222222;
      box-shadow: var(--lulu-box-shadow);
    }
  }
}

.footer {
  border-top: solid 1px #222222;
  margin-top: 2rem;
  padding-top: 1rem;
  font-size: 0.75rem;
  text-align: center;
  color: #999999;

  a {
    text-decoration: underline;

    &:hover {
      color: #000000;
    }
  }
}
</style>

<template>
  <main class="home-wrapper">
    <div class="banner">
      <fieldset>
        <legend>Naico (Hongyu) Wang</legend>
        <div class="title">Too Young, Too Simple, Sometimes Naive.</div>
        <div class="content">
          <img src="/images/avatar.png" alt="naico.wang" />
          <ul class="introduction">
            <li>Work as Staff Engineer - Web</li>
            <li>Talk is Cheap, Show me the CODE</li>
            <li>PPT Engineer / Confluence Engineer</li>
            <li>PMP / PMI-ACP</li>
          </ul>
        </div>
      </fieldset>
    </div>
    <main class="main-content">
      <aside>
        <div class="module-title">推荐内容</div>
        <div class="module-content">
          <a
            v-for="(item, idx) in homeFeatures"
            :href="item.link"
          >
            <div class="module-item" :key="idx">
              <span class="title">{{item.title}}</span>
              <p class="desc">{{item.description}}</p>
            </div>
          </a>
        </div>
      </aside>
      <section>
        <div class="module-title">过往工作经历</div>
        <div class="module-content image">
          <img src="/images/company-grain.png" alt="ChinaSoft" />
          <img src="/images/company-chinasoft.png" alt="ChinaSoft" />
          <img src="/images/company-microsoft.png" alt="ChinaSoft" />
          <img src="/images/company-mercer.png" alt="ChinaSoft" />
          <img src="/images/company-farfetch.png" alt="ChinaSoft" />
          <img src="/images/company-marriott.png" alt="ChinaSoft" />
        </div>
      </section>
    </main>
    <footer class="footer">
      <p>
        Powered by <a href="https://vitepress.dev/">VitePress</a>. Statics by <a target="_blank" title="51la网站统计" href="https://v6.51.la/land/3ItqjsY11mrrfGg3">51la统计</a>
      </p>
      <p>
        Copyright © 2024 <a href="https://github.com/naico-wang">Naico Wang</a>
      </p>
    </footer>
  </main>
</template>

<script setup lang="ts">
const homeFeatures = [
  {
    title: '经典设计模式',
    description: '21种经典设计模式详解',
    link: '/'
  },
  {
    title: '面试八股文',
    description: '涵盖了算法，前端，后端，操作系统',
    link: '/'
  },
  {
    title: '系统架构设计',
    description: '常见的系统架构设计相关文章',
    link: '/'
  }
]
</script>