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
      <van-cell
      icon="location-o"
      v-for="item in reportTypes"
      :key="item.value"
      :title="item.label"
      @click="handleReportArticle(item.value)"/>
    </van-cell-group>
  </van-dialog>
</template>

<script>
import { dislickArticle, reportArticle } from '@/api/article'
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
      isReportShow: false,
      reportTypes: [
        { label: '标题夸张', value: 1 },
        { label: '低俗色情', value: 2 },
        { label: '错别字多', value: 3 },
        { label: '旧闻重复', value: 4 },
        { label: '广告软文', value: 5 },
        { label: '内容不实', value: 6 },
        { label: '涉嫌违法犯罪', value: 7 },
        { label: '侵权', value: 8 },
        { label: '其他问题', value: 0 }
      ]
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
    },
    async handleReportArticle (type) {
      try {
        await reportArticle({
          articleId: this.currentArticle.art_id,
          type
        })
        // 事件不是强制的，我只是给你提供了，用不用说你的事儿
        this.$emit('report-success')
        // 关闭对话框
        this.$emit('input', false)
        // 提示
        this.$toast('举报成功')
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.$toast('该文章已被举报过')
        } else {
          this.$toast('操作失败')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
