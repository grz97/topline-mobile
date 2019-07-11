<template>
  <div class="login-wrap">
    <van-nav-bar title="标题" />
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          v-validate="'required'"
          name="mobile"
          :error-message="errors.first('mobile')"
          required
          clearable
          label="用户名"
          placeholder="请输入手机号"
        />

        <van-field
          v-model="user.code"
          v-validate="'required'"
          :error-message="errors.first('code')"
          name="code"
          type="code"
          label="验证码"
          placeholder="请输入验证码"
          required
        />
      </van-cell-group>
      <div class="login-btn">
        <van-button class="btn" type="info" @click.prevent="handleLogin" :loading="loginLoading">登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '18734800169',
        code: '246810'
      },
      loginLoading: false // 控制登录请求的加载状态
    }
  },
  created () {
    this.configCustomMessage()
  },
  methods: {
    async handleLogin () {
      this.loginLoading = true
      try {
        const valid = await this.$validator.validate()
        // 如果表单验证失败则什么都不做
        if (!valid) {
          // 验证失败，代码不会往后执行 所以这里也要取消loading
          this.loginLoading = false
          return
        }
        // 表单验证通过 提交表单
        const data = await login(this.user)
        // 通过提交mutation 更新Vuex容器的装填
        this.$store.commit('setUser', data)
        // 登录成功 跳转到首页
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败')
      }
      this.loginLoading = false
    },
    configCustomMessage () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号码不能为空'
          },
          code: {
            required: () => '验证码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn {
  padding: 20px;
  .btn {
    width: 100%;
  }
}
</style>
