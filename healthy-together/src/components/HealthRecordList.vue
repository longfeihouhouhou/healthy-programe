<template>
  <div class="health-record-list">
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="运动记录" name="exercise">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell-group inset v-for="record in records" :key="record._id">
            <van-cell :title="record.data.exerciseType" :label="formatDate(record.date)">
              <template #value>
                <span class="duration">{{ record.data.exerciseDuration }}分钟</span>
              </template>
            </van-cell>
          </van-cell-group>
        </van-list>
      </van-tab>

      <van-tab title="饮食记录" name="diet">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell-group inset v-for="record in records" :key="record._id">
            <van-cell :title="record.data.dietType" :label="formatDate(record.date)">
              <template #value>
                <span class="calories">{{ record.data.calories }}卡路里</span>
              </template>
            </van-cell>
          </van-cell-group>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { healthApi } from '@/services/api'
import { showFailToast } from 'vant'

const activeTab = ref('exercise')
const loading = ref(false)
const finished = ref(false)
const records = ref<any[]>([])

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 加载数据
const onLoad = async () => {
  try {
    const response = await healthApi.getRecords(activeTab.value)
    if (response.success) {
      records.value = response.records
      finished.value = true // 暂时不做分页
    }
  } catch (error: any) {
    showFailToast(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 切换标签时重新加载数据
watch(activeTab, () => {
  records.value = []
  finished.value = false
  loading.value = false
  onLoad()
})
</script>

<style scoped>
.health-record-list {
  margin-top: 16px;
}

.duration {
  color: #1989fa;
  font-weight: bold;
}

.calories {
  color: #ff976a;
  font-weight: bold;
}
</style>
