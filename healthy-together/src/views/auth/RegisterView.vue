<!-- RegisterView.vue -->
<template>
  <div class="register-container">
    <h2>注册</h2>
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="email"
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        :rules="[
          { required: true, message: '请填写邮箱' },
          { pattern: /.+@.+\..+/, message: '请输入正确的邮箱格式' }
        ]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[
          { required: true, message: '请填写密码' },
          { min: 6, message: '密码至少为6位' }
        ]"
      />
      <van-field
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        label="确认密码"
        placeholder="请再次输入密码"
        :rules="[
          { required: true, message: '请确认密码' },
          { validator: validatePassword, message: '两次输入的密码不一致' }
        ]"
      />
      <div style="margin: 16px;">
        <van-button 
          round 
          block 
          type="primary" 
          native-type="submit"
          :loading="userStore.loading"
        >
          {{ userStore.loading ? '注册中...' : '注册' }}
        </van-button>
      </div>
    </van-form>
    <div class="login-link">
      已有账号？
      <router-link to="/login">立即登录</router-link>
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
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const validatePassword = () => {
  return password.value === confirmPassword.value
}

const onSubmit = async () => {
  try {
    await userStore.register(username.value, email.value, password.value)
    showSuccessToast('注册成功')
    router.push('/dashboard')
  } catch (error: any) {
    showFailToast(error.message || '注册失败')
  }
}
</script>

<style scoped>
.register-container {
  padding: 20px;
}

.login-link {
  text-align: center;
  margin-top: 16px;
}

.login-link a {
  color: var(--van-primary-color);
  text-decoration: none;
}
</style>
