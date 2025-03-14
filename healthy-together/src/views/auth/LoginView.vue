<!-- LoginView.vue -->
<template>
  <div class="login-container">
    <h2>登录</h2>
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button 
          round 
          block 
          type="primary" 
          native-type="submit"
          :loading="userStore.loading"
        >
          {{ userStore.loading ? '登录中...' : '登录' }}
        </van-button>
      </div>
    </van-form>
    <div class="register-link">
      还没有账号？
      <router-link to="/register">立即注册</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const username = ref('')
const password = ref('')

const onSubmit = async () => {
  try {
    await userStore.login(username.value, password.value)
    showSuccessToast('登录成功')
    router.push('/dashboard')
  } catch (error: any) {
    showFailToast(error.message || '登录失败')
  }
}
</script>

<style scoped>
.login-container {
  padding: 20px;
}

.register-link {
  text-align: center;
  margin-top: 16px;
}

.register-link a {
  color: var(--van-primary-color);
  text-decoration: none;
}
</style>
