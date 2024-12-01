<style lang="scss" scoped>
.company-list {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  padding: 10px 0;
  align-items: center;
  justify-content: center;

  & img {
    height: 30px;
    width: auto;
  }
}
</style>

<template>
  <div class="company-list">
    <img alt="Grain Tech" src="/icons/company-grain.png" />
    <img alt="ChinaSoft" src="/icons/company-chinasoft.png" />
    <img alt="MicroSoft" src="/icons/company-microsoft.png" />
    <img alt="Mercer" src="/icons/company-mercer.png" />
    <img alt="Farfetch" src="/icons/company-farfetch.png" />
    <img alt="Marriott" src="/icons/company-marriott.png" />
  </div>
</template>
