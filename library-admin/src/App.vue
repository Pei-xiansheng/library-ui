<template>
  <el-container>
    <div id="app">
      <router-view></router-view>
    </div>
  </el-container>
</template>
<script>
export default {
  name: 'App',
}
</script>
<style>
*{
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}
/*alert 成功弹出框样式*/
.el-message{
  font-size: 18px !important;
  padding: 15px 15px 15px 20px !important;
}
 
.el-message__content {
  font-size: 18px !important;
  font-weight: 300 !important;
}

</style>
