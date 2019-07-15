<template>
  <van-dialog
    :value="value"
    @input="$emit('input', $event)"
    :showConfirmButton="false"
    closeOnClickOverlay
  >
    <van-cell-group v-if="!isReportShow">
      <van-cell icon="location-o" title="不感兴趣"  @click="handleDislick"/>
      <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isReportShow = true" />
      <van-cell icon="location-o" title="拉黑作者" @click="handleAddBalckList"/>
    </van-cell-group>

    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReportShow = false" />
      <van-cell icon="location-o" title="拉黑作者" />
      <van-cell icon="location-o" title="拉黑作者" />
      <van-cell icon="location-o" title="拉黑作者" />
      <van-cell icon="location-o" title="拉黑作者" />
      <van-cell icon="location-o" title="拉黑作者" />
      <van-cell icon="location-o" title="拉黑作者" />
      <van-cell icon="location-o" title="拉黑作者" />
      <van-cell icon="location-o" title="拉黑作者" />
    </van-cell-group>
  </van-dialog>
</template>

<script>
import { dislickArticle } from '@/api/article'
import { addBlacklist } from '@/api/user'
export default {
  name: 'MoreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentArticle: {
      type: Object
    }
  },
  data () {
    return {
      isReportShow: false
    }
  },
  methods: {
    async handleDislick () {
      try {
        await dislickArticle(this.currentArticle.art_id)
        // 移除客户端的那个文章
        this.$emit('dislike-success')
        // 关闭对话框
        // this.$emit('input', false)
        // 提示操作成功
        // this.$toast('操作成功')
      } catch (err) {
        this.$toast('操作失败')
      }
    },
    async handleAddBalckList  () {
      try {
        await addBlacklist(this.currentArticle.aut_id)
        this.$emit('add-blacklist-success')
      } catch (err) {
        this.$toast('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
