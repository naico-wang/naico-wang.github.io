<style lang="scss" scoped>
.user-info {
  color: var(--vp-c-black);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    padding: 20px 0;
  }

  & .basic-info {
    flex: 1;

    & .name {
      font-size: 32px;
      line-height: 2.5;
    }

    & ul > li {
      padding: 5px 0 5px 16px;
      font-size: 16px;
      position: relative;

      &:before {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        background-color: var(--vp-c-black);
        border-radius: 50%;
      }
    }
  }

  & .avatar {
    margin-right: 36px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: url("/icons/avatar.png") center no-repeat;
    background-size: contain;
  }
}
</style>

<template>
  <div class="user-info">
    <div class="basic-info">
      <div class="name">Hello, I'm <strong>Naico (Hongyu) Wang</strong>.</div>
      <ul>
        <li>Work as Pricinple Solution Architect.</li>
        <li>Used to be an Engineer Lead.</li>
        <li>PMP Certified.</li>
      </ul>
    </div>
    <div class="avatar" />
  </div>
</template>
