<template>
  <van-popup
    :style="{ height: '95%' }"
    :value="value"
    @input="$emit('input',$event)"
    position="bottom"
    get-container="body"
    :lazy-render="false"
  >
    <!--我的频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button type="danger" plain size="mini"
          @click="isEdit = !isEdit">{{isEdit? '完成':'编辑'}}</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
        v-for="(item,index) in userChannels"
        :key="item.id"
        @click="handleUserChannelClick(item,index)">
          <span class="text" :class="{active:index===activeIndex && !isEdit}">{{item.name}}</span>
          <van-icon class="close-icon" name="close" v-show="isEdit && !aliveChannels.includes(item.name)" />
        </van-grid-item>
      </van-grid>
    </div>
    <!--/我的频道 -->
    <!--推荐频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
        v-for="item in recommendChannels"
        :key="item.id"
        @click="handleAddChannel(item)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
    <!--/推荐频道 -->
  </van-popup>
</template>

<script>
// import { getAllChannels, deleteUserChannel } from '@/api/channel'
import {
  getAllChannels,
  deleteUserChannel,
  resetUserChannels
} from '@/api/channel'
import { mapState } from 'vuex'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [], // 所有的频道列表
      isEdit: false,
      aliveChannels: ['推荐']
    }
  },
  computed: {
    /** 计算属性会监视内部依赖的实例中的成员，当数据发生改变，它会重新调用计算
     * 该计算属性用于处理获取推荐数据（也就是不包含用户频道列表的其它所有频道列表）
     */
    recommendChannels () {
      // 拿到所有重复的数据 id
      const duplicates = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    },
    // Vuex的辅助方法，用来将state中的数据映射到本地计算属性
    // 就是 user= thandleAddChannel
    ...mapState(['user'])
  },

  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    },
    changeChannel (item, index) {
      this.$emit('update:active-index', index)
      this.$emit('input', false)
    },
    async deleteChannel (item, index) {
      this.userChannels.splice(index, 1)
      // 手动的设置一下当前激活的标签索引，用来触发那个onload调用，
      // 否则可能会看不到那个数据
      // this.$emit('update:active-index', 1)
      if (this.user) {
        // 登录 发请求删除
        await deleteUserChannel(item.id)
        return
      }
      // 未登录 删除本地存储的数据
      window.localStorage.setItem('channels', JSON.stringify(this.userChannels))
    },

    async handleAddChannel (item) {
      // 将点击添加的频道添加到用户频道中
      this.userChannels.push(item)
      // 持久化 ：
      // const {user} = handleAddChannel
      // 如果用户已登录，则将数据请求添加到后端
      // 如果未登录，则将数据持久化到本地存储
      // const { user } = this.$store.state
      if (this.user) {
        // 如果用户已登录，则将数据请求添加到后端
        const data = this.userChannels.slice(1).map((item, index) => {
          return {
            id: item.id, // 频道id
            seq: index + 2
          }
        })
        await resetUserChannels(data)
        return
      }
      // 如果未登录，则将数据持久化到本地存储
      window.localStorage.setItem('channels', JSON.stringify(this.userChannels))
      console.log(this.userChannels)
    },
    handleUserChannelClick (item, index) {
      // 如果是非编辑状态：切换频道
      if (!this.isEdit) {
        this.changeChannel(item, index)
      } else {
        // 如果是编辑状态：删除频道
        // this.deleteChannel(item, index)
        !this.aliveChannels.includes(item.name) && this.deleteChannel(item, index)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .channel-content {
    .text {
      font-size: 24px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 28px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
