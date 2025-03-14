<!-- MainLayout.vue -->
<template>
  <div class="layout-container">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      v-if="showBack"
    />
    <van-nav-bar
      :title="title"
      v-else
    />
    
    <div class="content">
      <slot></slot>
    </div>

    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/dashboard">数据</van-tabbar-item>
      <van-tabbar-item icon="plus" to="/health">记录</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/social">社交</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const active = ref(0)

// 根据路由设置标题
const title = computed(() => {
  switch (route.path) {
    case '/dashboard':
      return '健康数据'
    case '/health':
      return '健康记录'
    case '/social':
      return '社交圈'
    case '/profile':
      return '个人中心'
    default:
      return 'HealthyTogether'
  }
})

// 是否显示返回按钮
const showBack = computed(() => {
  return !['/', '/dashboard', '/health', '/social', '/profile'].includes(route.path)
})

const onClickLeft = () => {
  router.back()
}
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding-bottom: 50px;
}
</style>
