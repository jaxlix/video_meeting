<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  #app {
    width: 100%;
    height: 100%;
  }
}
</style>


