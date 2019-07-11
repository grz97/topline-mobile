<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页" fixed=""/>
      <!--
        activeChannelIndex 绑定当前激活的标签页，使用索引
      -->
      <van-tabs van-tabs__content class="channel-tabs" v-model="activeChannelIndex">
        <van-tab
        v-for="channelItem in channels"
        :key="channelItem.id"
        :title="channelItem.name">
          <!--
            下拉刷新
            isLoading 用来控制下拉刷新的 loading 状态
            下拉刷新的时候，它会自动将 loading 设置为 true
            @refresh 当下拉刷新的时候会触发
          -->
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!--
              列表组件：主要提供上拉加载更多的功能
              loading 用来控制加载中 loading 状态
              finished 用来控制是否加载完毕
              @load 加载更多的时候触发的一个事件，它自动会调用 onLoad 函数拿数据，以填充页面
                  它每次调用 onLoad 会自动将 loading 设置为 true
                  我们需要在 onLoad 中拿到本次加载的数据以后，将 loading 设置为 false
            -->
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
              <van-cell v-for="item in list" :key="item" :title="item" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
export default {
  name: 'HomeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [] // 存储频道列表
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      const { user } = this.$store.state
      let channels = []
      // 判断是否登录
      if (user) { // 如果已登录
        const data = await getUserChannels()
        channels = data.channels
      } else {
        // 未登录
        // 如果有本地存储频道数据则请求获取默认推荐频道列表
        const locaChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (locaChannels) {
          channels = locaChannels
        } else {
          // 如果没有本地存储频道列表数据则请求获取默认推荐频道列表
          const data = await getUserChannels()
          channels = data.locaChannels
        }
      }
      this.channels = channels
    },
    onLoad () {
      console.log('onLoad')
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh () {
      console.log('onRefresh')
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
    }
  }
}
</script>

<style lang="less" scoped>
.channel-tabs{
  margin-bottom: 100px;
}
.channel-tabs /deep/ .van-tabs__wrap{
  position:fixed;
  top:92px;
}
.channel-tabs /deep/ .van-tabs__content{
margin-top: 100px;
}
</style>
