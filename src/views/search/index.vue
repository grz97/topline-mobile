<template>
  <div>
    <!-- 搜索框 -->
    <van-search
      placeholder="请输入搜索关键词"
      v-model="searchText"
      show-action
    />
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell title="hello" icon="search" />
      <van-cell title="hello" icon="search" />
      <van-cell title="hello" icon="search" />
      <van-cell title="hello" icon="search" />
      <van-cell title="hello" icon="search" />
      <van-cell title="hello" icon="search" />
      <van-cell title="hello" icon="search" />
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <!-- /历史记录 -->
  </div>
</template>

<script>
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: ''
    }
  }
}
</script>

<style lang="less" scoped></style>
