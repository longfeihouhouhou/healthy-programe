<template>
  <div class="health-container">
    <van-tabs v-model:active="activeTab">
      <van-tab title="运动记录" name="exercise">
        <add-health-record active-tab="exercise" @record-added="onRecordAdded" />
      </van-tab>
      <van-tab title="饮食记录" name="diet">
        <add-health-record active-tab="diet" @record-added="onRecordAdded" />
      </van-tab>
      <van-tab title="健康目标" name="goals">
        <add-health-record active-tab="goals" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import AddHealthRecord from './AddHealthRecord.vue'

const router = useRouter()
const activeTab = ref('exercise')

// 记录添加成功后的处理
const onRecordAdded = () => {
  // 跳转到个人中心页面
  router.push('/profile')
}
</script>

<style scoped>
.health-container {
  height: 100%;
  background-color: var(--van-background);
}
</style>
