<script setup>
</script>

<style scoped>
section {
  padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) 64px 32px;
}
.container {
  margin: 0 auto;
  max-width: 1152px;
}
h1 {
  line-height: 64px;
  font-size: 56px;
  color: var(--vp-home-hero-name-color);
  background: var(--vp-home-hero-name-background);
  background-clip: text;
  font-weight: 700;
  white-space: pre-wrap;
  letter-spacing: -0.4px;
}
.description {
  line-height: 64px;
  font-size: 36px;
  font-weight: 700;
  margin: 0 auto;
  padding: 16px 12px 0;
  text-align: right;
  color: var(--vp-home-hero-name-color);
  background: var(--vp-home-hero-name-background);
  background-clip: text;
}
</style>

<template>
  <section>
    <div class="container">
      <h1>苟利国家生死以，岂因祸福避趋之</h1>
      <div class="description">Hello, I'm Naico (Hongyu) Wang</div>
    </div>
  </section>
</template>
