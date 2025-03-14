<template>
  <div class="exercise-records">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { healthApi } from '@/services/api'
import { showFailToast } from 'vant'

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
    const response = await healthApi.getRecords('exercise')
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
</script>

<style scoped>
.exercise-records {
  padding: 16px;
}

.duration {
  color: #1989fa;
  font-weight: bold;
}
</style>
