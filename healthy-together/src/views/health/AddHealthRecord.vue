<template>
  <div class="health-record">
    <!-- 运动记录表单 -->
    <van-form @submit="onExerciseSubmit" v-if="activeTab === 'exercise'">
      <van-cell-group inset>
        <van-field
          v-model="exerciseForm.type"
          name="type"
          label="运动类型"
          placeholder="例如：跑步、游泳"
          :rules="[{ required: true, message: '请输入运动类型' }]"
        />
        <van-field
          v-model="exerciseForm.duration"
          type="number"
          name="duration"
          label="运动时长"
          placeholder="请输入运动时长（分钟）"
          :rules="[{ required: true, message: '请输入运动时长' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          记录运动
        </van-button>
      </div>
    </van-form>

    <!-- 饮食记录表单 -->
    <van-form @submit="onDietSubmit" v-if="activeTab === 'diet'">
      <van-cell-group inset>
        <van-field
          v-model="dietForm.type"
          name="type"
          label="餐食类型"
          placeholder="例如：早餐、午餐"
          :rules="[{ required: true, message: '请输入餐食类型' }]"
        />
        <van-field
          v-model="dietForm.calories"
          type="number"
          name="calories"
          label="卡路里"
          placeholder="请输入卡路里"
          :rules="[{ required: true, message: '请输入卡路里' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          记录饮食
        </van-button>
      </div>
    </van-form>

    <!-- 健康目标设置表单 -->
    <van-form @submit="onGoalsSubmit" v-if="activeTab === 'goals'">
      <van-cell-group inset>
        <van-field
          v-model="goalsForm.exerciseMinutes"
          type="number"
          name="exerciseMinutes"
          label="每日运动时长"
          placeholder="请输入目标运动时长（分钟）"
          :rules="[{ required: true, message: '请输入目标运动时长' }]"
        />
        <van-field
          v-model="goalsForm.exerciseDays"
          type="number"
          name="exerciseDays"
          label="每周运动天数"
          placeholder="请输入每周目标运动天数"
          :rules="[{ required: true, message: '请输入每周目标运动天数' }]"
        />
        <van-field
          v-model="goalsForm.calories"
          type="number"
          name="calories"
          label="每日目标卡路里"
          placeholder="请输入每日目标卡路里"
          :rules="[{ required: true, message: '请输入每日目标卡路里' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          保存目标
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import { healthApi } from '@/services/api'

const props = defineProps<{
  activeTab: 'exercise' | 'diet' | 'goals'
}>()

const emit = defineEmits<{
  (e: 'recordAdded'): void
}>()

// 运动表单数据
const exerciseForm = ref({
  type: '',
  duration: ''
})

// 饮食表单数据
const dietForm = ref({
  type: '',
  calories: ''
})

// 目标表单数据
const goalsForm = ref({
  exerciseMinutes: '',
  exerciseDays: '',
  calories: ''
})

// 提交运动记录
const onExerciseSubmit = async () => {
  try {
    await healthApi.addExercise({
      type: exerciseForm.value.type,
      duration: Number(exerciseForm.value.duration),
      date: new Date().toISOString()
    })
    showSuccessToast('运动记录添加成功')
    exerciseForm.value = { type: '', duration: '' }
    emit('recordAdded')
  } catch (error: any) {
    showFailToast(error.message || '添加失败')
  }
}

// 提交饮食记录
const onDietSubmit = async () => {
  try {
    await healthApi.addDiet({
      type: dietForm.value.type,
      calories: Number(dietForm.value.calories),
      date: new Date().toISOString()
    })
    showSuccessToast('饮食记录添加成功')
    dietForm.value = { type: '', calories: '' }
    emit('recordAdded')
  } catch (error: any) {
    showFailToast(error.message || '添加失败')
  }
}

// 提交健康目标
const onGoalsSubmit = async () => {
  try {
    await healthApi.setGoals({
      exerciseMinutes: Number(goalsForm.value.exerciseMinutes),
      exerciseDays: Number(goalsForm.value.exerciseDays),
      calories: Number(goalsForm.value.calories)
    })
    showSuccessToast('目标设置成功')
  } catch (error: any) {
    showFailToast(error.message || '设置失败')
  }
}

// 获取当前健康目标
const fetchGoals = async () => {
  try {
    const response = await healthApi.getGoals()
    if (response.success) {
      const { goals } = response
      goalsForm.value = {
        exerciseMinutes: String(goals.exerciseMinutes),
        exerciseDays: String(goals.exerciseDays),
        calories: String(goals.calories)
      }
    }
  } catch (error) {
    console.error('Failed to fetch goals:', error)
  }
}

onMounted(() => {
  if (props.activeTab === 'goals') {
    fetchGoals()
  }
})
</script>

<style scoped>
.health-record {
  padding: 16px;
}
</style>
