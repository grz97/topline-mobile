<template>
  <div>
    <!-- 缓存路由组件-->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'layout'
}
</script>

<style>
</style>
