/**
 * 封装文章相关接口请求函数
 *
 */
import request from '@/utils/request'
/**
 * 获取推荐频道列表数据
 */
export const getArticles = ({
  channelId, // 频道
  timestamp, // 时间戳
  withTop // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1--包含置顶，0--不包含
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}

/**
 *  对文章不喜欢
 */
export const dislickArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}
/**
 * 举报文章
 */
export const reportArticle = ({
  articleId, // 举报的文章id
  type, // 举报类型： 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，7-涉嫌违法犯罪，8-侵权'
  remark = '' // 其他问题 的附加说明
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type,
      remark
    }
  })
}
