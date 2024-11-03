
<style scoped>
.layout-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.aside {
  width: 45%;
  padding: 20px;
  border: solid 1px var(--vp-button-brand-hover-bg);
  border-radius: 10px;
}

.main {
  flex: 1;
  padding: 20px;
  border: solid 1px var(--vp-button-brand-hover-bg);
  border-radius: 10px;
}

@media (max-width: 740px) {
  .layout-container {
    flex-direction: column;
  }
  .aside {
    width: 100%;
  }
}
</style>

<template>
  <div class="layout-container">
    <aside class="aside">
      <slot name="aside"></slot>
    </aside>
    <main class="main">
      <slot name="main"></slot>
    </main>
  </div>
</template>

