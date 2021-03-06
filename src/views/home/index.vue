<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页" fixed />
      <!--
        activeChannelIndex 绑定当前激活的标签页，使用索引
      -->
      <van-tabs van-tabs__content class="channel-tabs" v-model="activeChannelIndex">
        <div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
          <van-icon name="wap-nav" />
        </div>
        <van-tab v-for="channelItem in channels" :key="channelItem.id" :title="channelItem.name">
          <!--
            下拉刷新
            isLoading 用来控制下拉刷新的 loading 状态
            下拉刷新的时候，它会自动将 loading 设置为 true
            @refresh 当下拉刷新的时候会触发
          -->
          <van-pull-refresh
            v-model="channelItem.downPullLoading"
            @refresh="onRefresh"
            :success-text="channelItem.downPullSuccessText"
            :success-duration="1000"
          >
            <!--
              列表组件：主要提供上拉加载更多的功能
              loading 用来控制加载中 loading 状态
              finished 用来控制是否加载完毕
              @load 加载更多的时候触发的一个事件，它自动会调用 onLoad 函数拿数据，以填充页面
                  它每次调用 onLoad 会自动将 loading 设置为 true
                  我们需要在 onLoad 中拿到本次加载的数据以后，将 loading 设置为 false
            -->
            <van-list
              v-model="channelItem.upPullLoading"
              :finished="channelItem.upPullFinished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="articleItem in channelItem.articles"
                :key="articleItem.art_id.toString()"
                :title="articleItem.title"
              >
               <div slot="label">
                <template v-if="articleItem.cover.type">
                  <van-grid :border="false" :column-num="3">
                    <van-grid-item
                      v-for="(img, index) in articleItem.cover.images"
                      :key="index"
                    >
                      <van-image :src="img" lazy-load/>
                    </van-grid-item>
                  </van-grid>
                </template>
                <p>
                  <span>{{ articleItem.aut_name }}</span>
                  &nbsp;
                  <span>{{ articleItem.comm_count }}评论</span>
                  &nbsp;
                  <span>{{ articleItem.pubdate | relativeTime }}</span>
                   <van-icon class="close" name="close" @click="handleShowMoreAction(articleItem)" />
                </p>
              </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <!--频道管理组件 -->
        <!--
         v-model实际上是
         v-bind：value="数据"
         v-on:input="数据=$event"
        -->
        <!-- <HomeChannel v-model="isChannelShow"
        :user-channels="channels"
        :active-index="activeChannelIndex"/> -->
      </van-tabs>
      <HomeChannel
        v-model="isChannelShow"
        :user-channels="channels"
         :active-index.sync="activeChannelIndex"
      />
       <!-- 更多操作 -->
    <more-action
    v-model="isMoreActionShow"
    :current-article="currentArticle"
    @dislike-success="handleDislikeSuccess"
    @add-blacklist-success="handleDislikeSuccess"/>

    <!-- /更多操作 -->
    </div>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import HomeChannel from './components/channel'
import MoreAction from './components/more-action'
export default {
  name: 'HomeIndex',
  components: {
    HomeChannel,
    MoreAction
  },
  data () {
    return {
      activeChannelIndex: 0,
      channels: [], // 存储频道列表
      isChannelShow: false,
      isMoreActionShow: false,
      currentArticle: null
    }
  },
  computed: {
    /**
     * 当前激活的频道
     */
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  watch: {
    // 监视容器中的user用户
    // 凡是能this.点出来的成员都可以直接在这里监视
    // 由于路由缓存了，所以这里监视用户的登录状态 如果登录了
    // 则加载用户的频道列表
    async '$store.state.user' () {
      // 重新加载用户频道列表
      this.loadChannels()
      // 频道数据改变，重新加载当前激活频道的数据
      // 只需将上拉加载更多设置为true，它就会自动去调用onload请求函数
      this.activeChannel.upPullLoading = true
    },
    isChannelShow () {
      // 如果频道面板隐藏了，并且当前频道没有数据，那我们就手动的 onLoad 加载更多
      if (!this.isChannelShow && !this.activeChannel.articles.length) {
        this.activeChannel.upPullLoading = true
        this.onLoad()
      }
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
      if (user) {
        // 如果已登录
        const data = await getUserChannels()
        channels = data.channels
      } else {
        // 未登录
        // 如果有本地存储频道数据则请求获取默认推荐频道列表
        const localChannels = JSON.parse(
          window.localStorage.getItem('channels')
        )
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有本地存储频道列表数据则请求获取默认推荐频道列表
          const data = await getUserChannels()
          channels = data.channels
        }
      }
      // 修改 channels，将这个数据结构修改为满足我们使用的需求
      channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.channels = channels
    },
    /**
     * 上拉加载更多，push数据
     */
    async onLoad () {
      console.log('onLoad')
      await this.$sleep(800)
      let data = []
      data = await this.loadArticles()
      // 如果没有pre_timestamp,并且数组是空的，则意味着没有数据
      if (!data.pre_timestamp && !data.results.length) {
        // 设置该频道数据已加载完毕 组件会自动给出提示，并且不再用onload
        this.activeChannel.upPullFinished = true
        // 取消loading
        this.activeChannel.upPullLoading = false
        // 代码不要往后执行了
        return
      }
      // pre_timestamp 下一页的页码，{上次时间点推荐的数据}
      // results 文章列表
      // 没有最新数据 那就加载上一次推荐数据
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        // 加载下一页数据
        data = await this.loadArticles()
      }
      // 数据加载好以后，将 pre_timestamp 更新到当前频道的中用于加载下下页数据
      this.activeChannel.timestamp = data.pre_timestamp
      // 将文章数据更新到频道中（注意：是 push 追加，不是覆盖）
      this.activeChannel.articles.push(...data.results)
      // 数据加载完毕，取消上拉 loading
      this.activeChannel.upPullLoading = false
    },
    /**
     * 下拉刷新，如果有数据，则重置列表数据
     */
    async onRefresh () {
      const { activeChannel } = this
      // 备份加载下一页数据的时间戳
      const timestamp = activeChannel.timestamp
      // 使用最新时间戳去请求最新的推荐数据
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()
      // 如果有最新数据，将数据更新到频道列表的文章列表中
      if (data.results.length) {
        // 将当前最新的推荐内容重置到频道文章中
        activeChannel.articles = data.results
        // 由于你重置了文章列表，
        // 那么当前数据的pre_timestamp 就是上拉加载更多的下一页数据的时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'
        // 当下拉刷新有数据并重置之后数据无法满足一屏，
        // 所以我们使用onload再多加载一页数据
        this.onLoad()
      } else {
        // 如果没有最新数据，提示已是最新内容
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      // 下拉刷新结束，取消loading 状态
      activeChannel.downPullLoading = false
      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      activeChannel.timestamp = timestamp
    },
    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId, // 当前激活频道id
        timestamp, // 当前频道
        withTop: 1 // 是否包含置顶数据
      })
      return data
    },
    handleShowMoreAction (article) {
      // 当执行更多操作的文章记录起来，通过组件传值传给 MoreAction 组件
      this.currentArticle = article
      // 显示更多操作的弹框
      this.isMoreActionShow = true
    },
    handleDislikeSuccess () {
      const articles = this.activeChannel.articles
      const delIndex = articles.findIndex(item => item === this.currentArticle)
      articles.splice(delIndex, 1)
      this.isMoreActionShow = false
      this.$toast('操作成功')
    }
  }
}
</script>

<style lang="less" scoped>
.channel-tabs {
  margin-bottom: 100px;
}
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 100px;
}
.channel-tabs /deep/ .wap-nav {
  position: fixed;
  right: 0;
}
.channel-tabs .close {
  float: right;
  font-size: 30px;
}
</style>
