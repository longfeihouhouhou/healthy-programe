<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { 
  Card, 
  Grid, 
  GridItem, 
  Icon,
  Progress,
  Cell,
  CellGroup
} from 'vant'
import * as echarts from 'echarts'

const userStore = useUserStore()
const username = ref(userStore.user?.username || '用户')
const stepsChart = ref<HTMLElement | null>(null)
const healthScore = ref(85)

// 模拟数据
const todaySteps = ref(6800)
const targetSteps = 10000
const stepsProgress = ref((todaySteps.value / targetSteps) * 100)

const quickActions = [
  { icon: 'records', text: '运动记录', route: '/exercise-records' },
  { icon: 'chart-trending-o', text: '健康报告', route: '/health' },
  { icon: 'friends-o', text: '社交圈', route: '/social' },
  { icon: 'setting-o', text: '设置', route: '/profile' }
]

const healthTips = ref([
  '今天天气晴朗，非常适合户外运动哦！',
  '记得多喝水，保持充足的水分补充',
  '建议适当休息，不要久坐'
])

onMounted(() => {
  if (stepsChart.value) {
    const chart = echarts.init(stepsChart.value)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value',
        name: '步数'
      },
      series: [{
        data: [5000, 7000, 6000, 8000, 6800, 9000, 6800],
        type: 'line',
        smooth: true,
        areaStyle: {}
      }]
    }
    chart.setOption(option)
  }
})
</script>

<template>
  <div class="home-container">
    <!-- 顶部欢迎区 -->
    <Card class="welcome-card">
      <template #title>
        <div class="welcome-title">
          <h2>你好，{{ username }}！</h2>
          <p class="subtitle">今天是充满活力的一天</p>
        </div>
      </template>
      <template #extra>
        <div class="health-score">
          <span class="score">{{ healthScore }}</span>
          <span class="label">健康指数</span>
        </div>
      </template>
    </Card>

    <!-- 快捷操作区 -->
    <Grid :column-num="4" :border="false" class="quick-actions">
      <GridItem v-for="action in quickActions" :key="action.text" :to="action.route">
        <Icon :name="action.icon" size="24" />
        <span>{{ action.text }}</span>
      </GridItem>
    </Grid>

    <!-- 今日步数 -->
    <Card class="steps-card">
      <template #title>
        <div class="card-header">
          <span>今日步数</span>
          <span class="steps-count">{{ todaySteps }} / {{ targetSteps }}</span>
        </div>
      </template>
      <Progress
        :percentage="stepsProgress"
        :stroke-width="10"
        color="#07c160"
      />
    </Card>

    <!-- 周步数趋势 -->
    <Card class="chart-card" title="本周运动趋势">
      <div ref="stepsChart" style="width: 100%; height: 200px;"></div>
    </Card>

    <!-- 健康提示 -->
    <Card class="tips-card" title="今日健康提醒">
      <CellGroup inset>
        <Cell v-for="(tip, index) in healthTips" 
              :key="index"
              :title="tip"
              icon="bulb-o" />
      </CellGroup>
    </Card>
  </div>
</template>

<style scoped>
.home-container {
  padding: 16px;
  background: #f7f8fa;
  min-height: 100vh;
}

.welcome-card {
  margin-bottom: 16px;
  background: linear-gradient(135deg, #4fc08d, #42b983);
  color: white;
}

.welcome-title h2 {
  margin: 0;
  font-size: 20px;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.health-score {
  text-align: center;
}

.health-score .score {
  font-size: 24px;
  font-weight: bold;
}

.health-score .label {
  font-size: 12px;
  display: block;
}

.quick-actions {
  margin: 16px 0;
  background: white;
  border-radius: 8px;
}

.steps-card,
.chart-card,
.tips-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.steps-count {
  font-size: 14px;
  color: #666;
}

:deep(.van-grid-item__content) {
  padding: 16px 8px;
}

:deep(.van-grid-item__icon) {
  margin-bottom: 8px;
}
</style>
