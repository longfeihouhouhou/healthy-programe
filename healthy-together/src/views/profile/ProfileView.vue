<!-- ProfileView.vue -->
<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <div class="profile-container">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-info">
        <van-image
          round
          width="80"
          height="80"
          :src="userStore.user?.avatar || 'https://via.placeholder.com/80'"
        />
        <div class="user-details">
          <h2>{{ userStore.user?.username }}</h2>
          <p>{{ userStore.user?.email }}</p>
        </div>
      </div>
      <div class="user-stats">
        <div class="stat-item">
          <span class="value">{{ stats.days || 0 }}</span>
          <span class="label">打卡天数</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ stats.exercise || 0 }}</span>
          <span class="label">运动次数</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ stats.diet || 0 }}</span>
          <span class="label">饮食记录</span>
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <van-cell-group inset class="menu-group">
      <van-cell title="运动记录" icon="medal-o" is-link to="/exercise-records" />
      <van-cell title="饮食记录" icon="notes-o" is-link to="/diet-records" />
      <van-cell title="我的好友" icon="friends-o" is-link />
    </van-cell-group>

    <van-cell-group inset class="menu-group">
      <van-cell title="健康目标" icon="aim" is-link @click="showGoalSetting = true" />
      <van-cell title="提醒设置" icon="bell" is-link @click="showNotificationSetting = true" />
      <van-cell title="隐私设置" icon="shield-o" is-link />
    </van-cell-group>

    <van-cell-group inset class="menu-group">
      <van-cell title="关于我们" icon="info-o" is-link />
      <van-cell title="退出登录" icon="cross" @click="logout" />
    </van-cell-group>



    <!-- 目标设置弹窗 -->
    <van-dialog v-model:show="showGoalSetting"
      title="设置健康目标"
      show-cancel-button
      @confirm="saveGoals"
    >
      <van-cell-group inset>
        <van-field
          v-model="goals.weight"
          label="目标体重"
          type="number"
          placeholder="请输入目标体重(kg)"
        />
        <van-field
          v-model="goals.exercise"
          label="每周运动"
          type="number"
          placeholder="请输入每周运动次数"
        />
      </van-cell-group>
    </van-dialog>

    <!-- 提醒设置弹窗 -->
    <van-dialog v-model:show="showNotificationSetting"
      title="提醒设置"
      show-cancel-button
      @confirm="saveNotifications"
    >
      <van-cell-group inset>
        <van-cell title="运动提醒" center>
          <template #right-icon>
            <van-switch v-model="notifications.exercise" size="24" />
          </template>
        </van-cell>
        <van-cell title="饮食提醒" center>
          <template #right-icon>
            <van-switch v-model="notifications.diet" size="24" />
          </template>
        </van-cell>
        <van-cell title="体重记录提醒" center>
          <template #right-icon>
            <van-switch v-model="notifications.weight" size="24" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-dialog>
  </div>
  </van-pull-refresh>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { showSuccessToast, showFailToast, showDialog } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { healthApi } from '@/services/api'

const router = useRouter()
const userStore = useUserStore()

// 用户统计数据
const stats = ref({
  days: 0,
  exercise: 0,
  diet: 0
})

const refreshing = ref(false)

// 刷新数据
const onRefresh = async () => {
  try {
    await fetchUserStats()
    showSuccessToast('刷新成功')
  } catch (error) {
    showFailToast('刷新失败')
  } finally {
    refreshing.value = false
  }
}

const showGoalSetting = ref(false)
const showNotificationSetting = ref(false)

const goals = reactive({
  weight: '',
  exercise: ''
})

const notifications = reactive({
  exercise: true,
  diet: true,
  weight: false
})

// 获取用户统计数据
const fetchUserStats = async () => {
  try {
    const response = await healthApi.getStats()
    if (response.success) {
      stats.value = {
        days: response.stats.days || 0,
        exercise: response.stats.exercise || 0,
        diet: response.stats.diet || 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch user stats:', error)
  }
}

const saveGoals = () => {
  showSuccessToast('目标设置成功')
}

const saveNotifications = () => {
  showSuccessToast('提醒设置成功')
}

const logout = () => {
  showDialog({
    title: '确认退出',
    message: '您确定要退出登录吗？',
    showCancelButton: true
  }).then((action) => {
    if (action === 'confirm') {
      userStore.logout()
      router.push('/login')
    }
  })
}

onMounted(() => {
  fetchUserStats()
})
</script>

<style scoped>
.profile-container {
  padding: 16px;
}

.user-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-details {
  margin-left: 16px;
}

.user-details h2 {
  margin: 0;
  font-size: 20px;
}

.user-details p {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.stat-item .value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: var(--van-primary-color);
}

.stat-item .label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.menu-group {
  margin-bottom: 16px;
}

:deep(.van-cell) {
  align-items: center;
}

:deep(.van-dialog__content) {
  padding: 20px 0;
}
</style>
