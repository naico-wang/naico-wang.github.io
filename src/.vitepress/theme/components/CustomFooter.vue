
<script setup lang="ts">
import { useSidebar } from 'vitepress/theme'

const { hasSidebar } = useSidebar()
</script>

<template>
  <footer class="VPFooter" :class="{ 'has-sidebar': hasSidebar }">
    <div class="container">
      <p class="message">
        Powered by <a href="https://vitepress.dev/">VitePress</a>.
      </p>
      <p class="copyright">
        Copyright © 2024 <a href="https://github.com/naico-wang">Naico Wang</a>
      </p>
      <p class="statics">
        Statics By
        <a target="_blank" title="51la网站统计" href="https://v6.51.la/land/3ItqjsY11mrrfGg3">
          <img class="staticimg" src="https://sdk.51.la/icon/2-1.png" alt="51la统计" />
        </a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}

.VPFooter.has-sidebar {
  display: none;
}

.VPFooter :deep(a) {
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition: color 0.25s;
}

.VPFooter :deep(a:hover) {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .VPFooter {
    padding: 32px;
  }
}

.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}

.message,
.copyright,
.statics {
  line-height: 22px;
  font-size: 12px;
  font-weight: 400;
  color: var(--vp-c-text-2);
}

.statics {
  display: flex;
  align-items: center;
  justify-content: center;
}

.staticimg {
  margin-left: 6px;
}
</style>
