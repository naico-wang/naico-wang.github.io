<style lang="less" scoped>
.home-wrapper {
  height: calc(100vh - var(--vp-nav-height) - 20rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  background: url("/images/avatar.png") center no-repeat;
  background-size: contain;
}

.banner {
  margin-top: 2rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.footer {
  background-color: #ffffff;
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
    <div class="avatar" />
    <div class="banner">Too Young, Too Simple, Sometimes Naive.</div>
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