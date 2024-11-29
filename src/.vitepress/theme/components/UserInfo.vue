<style lang="scss" scoped>
.user-wrapper {
  padding: 20px 40px;
  border-radius: 10px;
  background-color: #f6f6f6;
  display: flex;
  align-items: center;

  @media (max-width: 500px) {
    flex-direction: column;
  }
  & .user-avatar {
    width: 60px;
    height: auto;
    border-radius: 50%;
  }

  & .site-title {
    font-size: 24px;
    line-height: 1.5;
    font-weight: bold;
    padding: 10px 0;
    margin-left: 20px;
    color: transparent;
    background-color: var(--vp-c-green-1);
    background-image: -webkit-linear-gradient(30deg, var(--vp-c-brand-1), var(--vp-c-important-1));
    background-clip: text;
    text-align: center;

    @media (max-width: 500px) {
      font-size: 24px;
      line-height: 1.5;
      margin-left: 0;
    }
  }
}
</style>

<template>
  <div class="user-wrapper">
    <img class="user-avatar" alt="智库" src="/icons/icon-avatar.png" />
    <div class="site-title">TOO YOUNG TOO SIMPLE, SOMETIMES NAIVE</div>
  </div>
</template>
