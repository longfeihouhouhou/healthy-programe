<!-- DashboardView.vue -->
<template>
  <div class="dashboard-container">
    <!-- 用户信息卡片 -->
    <div class="user-card card">
      <van-row>
        <van-col span="16">
          <h2 class="greeting">你好，{{ username }}！</h2>
          <p class="subtitle">今天是你坚持的第 {{ streak }} 天</p>
        </van-col>
        <van-col span="8" style="text-align: right;">
          <van-tag type="primary" size="medium">Level {{ level }}</van-tag>
        </van-col>
      </van-row>
    </div>

    <!-- 今日打卡 -->
    <div class="card">
      <van-row justify="space-between" align="center">
        <van-col>
          <h3>今日打卡</h3>
        </van-col>
        <van-col>
          <van-tag type="success" v-if="allChecked">已完成</van-tag>
          <van-tag type="warning" v-else>待完成</van-tag>
        </van-col>
      </van-row>
      <van-grid :column-num="3" :border="false">
        <van-grid-item 
          @click="toggleExercise" 
          :class="{ active: exerciseChecked, disabled: exerciseChecked, 'exercise-grid-item': true }"
        >
          <template #icon>
            <van-icon :name="exerciseChecked ? 'like' : 'like-o'" 
                     :color="exerciseChecked ? '#07c160' : '#969799'" 
                     size="24" />
          </template>
          <template #text>
            <span :style="{ color: exerciseChecked ? '#07c160' : '#969799' }">运动</span>
          </template>
        </van-grid-item>
        <van-grid-item 
          @click="toggleDiet" 
          :class="{ active: dietChecked, disabled: dietChecked, 'diet-grid-item': true }"
        >
          <template #icon>
            <van-icon :name="dietChecked ? 'shopping-cart' : 'shopping-cart-o'" 
                     :color="dietChecked ? '#07c160' : '#969799'" 
                     size="24" />
          </template>
          <template #text>
            <span :style="{ color: dietChecked ? '#07c160' : '#969799' }">饮食</span>
          </template>
        </van-grid-item>
        <van-grid-item 
          @click="showWeightInput"
          class="weight-grid-item"
        >
          <template #icon>
            <van-icon :name="weightChecked ? 'balance-list' : 'balance-list-o'" 
                     :color="weightChecked ? '#07c160' : '#969799'" 
                     size="24" />
          </template>
          <template #text>
            <span :style="{ color: weightChecked ? '#07c160' : '#969799' }">体重</span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 健康概览 -->
    <div class="card">
      <h3>体重变化曲线</h3>
      <div class="health-overview">
        <div class="chart-container" ref="healthChart"></div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="card">
      <h3>本周数据</h3>
      <div class="stats">
        <div class="stat-item">
          <van-circle :rate="(weeklyStats.exercise / 7) * 100" 
                     :speed="100" 
                     size="80" 
                     :stroke-width="60"
                     color="#07c160">
            <span class="circle-value">{{ weeklyStats.exercise }}/7</span>
          </van-circle>
          <span class="label">运动天数</span>
        </div>
        <div class="stat-item">
          <van-circle :rate="(weeklyStats.diet / 7) * 100" 
                     :speed="100" 
                     size="80" 
                     :stroke-width="60"
                     color="#07c160">
            <span class="circle-value">{{ weeklyStats.diet }}/7</span>
          </van-circle>
          <span class="label">饮食达标</span>
        </div>
        <div class="stat-item">
          <div class="weight-trend">
            <span class="value">{{ weeklyStats.weight }}</span>
            <span class="weight-unit">kg</span>
            <span class="trend-value" :class="{ down: weeklyStats.weightTrend < 0, up: weeklyStats.weightTrend > 0 }">
              {{ weeklyStats.weightTrend > 0 ? '+' : '' }}{{ weeklyStats.weightTrend }}
            </span>
          </div>
          <span class="label">当前体重</span>
        </div>
      </div>
    </div>

    <!-- 打卡排行 -->
    <div class="card">
      <h3>好友排行</h3>
      <van-cell-group inset>
        <van-cell v-for="(user, index) in leaderboard" :key="user.id"
          :title="user.name"
          :label="'连续打卡 ' + user.streak + ' 天'"
          :value="'第 ' + (index + 1) + ' 名'"
        >
          <template #icon>
            <van-image
              round
              width="40"
              height="40"
              :src="user.avatar"
              style="margin-right: 8px"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>

  <!-- 体重输入弹窗 -->
  <van-dialog v-model:show="showWeightDialog"
    title="记录体重"
    show-cancel-button
    @confirm="saveWeight"
  >
    <van-field
      v-model="currentWeight"
      type="number"
      label="体重"
      placeholder="请输入体重(kg)"
    />
  </van-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  showToast, 
  showSuccessToast,
  Dialog, 
  Grid, 
  GridItem, 
  Cell, 
  CellGroup, 
  Image as VanImage,
  Icon,
  Tag,
  Circle,
  Row,
  Col,
  Button
} from 'vant'
import * as echarts from 'echarts'
import { useUserStore } from '@/stores/user'
import { getHealthStats, getWeightHistory, addWeight, getHealthRecords, addExercise, addDiet } from '@/api/health'
import type { HealthStats, WeightHistory } from '@/api/health'

const userStore = useUserStore()
const username = ref(userStore.user?.username || '用户')
const level = ref(3)
const streak = ref(12)
const healthChart = ref<HTMLElement | null>(null)

const exerciseChecked = ref(false)
const dietChecked = ref(false)
const weightChecked = ref(false)
const showWeightDialog = ref(false)
const currentWeight = ref('')

const weeklyStats = reactive<HealthStats>({
  exercise: 0,
  diet: 0,
  weight: 0,
  weightTrend: 0
})

const allChecked = computed(() => {
  return exerciseChecked.value && dietChecked.value && weightChecked.value
})

const leaderboard = ref([
  {
    id: 1,
    name: '张三',
    streak: 7,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 2,
    name: '李四',
    streak: 5,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 3,
    name: '王五',
    streak: 3,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
])

const loadTodayRecords = async () => {
  try {
    const response = await getHealthRecords({ 
      date: '2025-02-13'  // 只传当天日期
    })
    const { data: { records } } = response
    console.log('Today records response:', { records })

    if (!records) {
      console.error('Invalid data format for today records:', response)
      return
    }

    // 检查今天是否已经打卡
    exerciseChecked.value = records.some(record => record.type === 'exercise')
    dietChecked.value = records.some(record => record.type === 'diet')
    weightChecked.value = records.some(record => record.type === 'weight')
    
    // 将打卡状态保存到 localStorage
    localStorage.setItem('exerciseChecked', JSON.stringify(exerciseChecked.value))
    localStorage.setItem('dietChecked', JSON.stringify(dietChecked.value))
    localStorage.setItem('weightChecked', JSON.stringify(weightChecked.value))
  } catch (error) {
    console.error('Failed to load today records:', error)
  }
}

const toggleExercise = async () => {
  if (exerciseChecked.value) return // 如果已经打卡，直接返回
  try {
    await addExercise('运动', 30)
    exerciseChecked.value = true
    showSuccessToast('运动打卡成功')
    await loadHealthStats() // 刷新统计数据
    localStorage.setItem('exerciseChecked', JSON.stringify(exerciseChecked.value))
  } catch (error) {
    console.error('Failed to toggle exercise:', error)
  }
}

const toggleDiet = async () => {
  if (dietChecked.value) return // 如果已经打卡，直接返回
  try {
    await addDiet('健康饮食', 2000)
    dietChecked.value = true
    showSuccessToast('饮食打卡成功')
    await loadHealthStats() // 刷新统计数据
    localStorage.setItem('dietChecked', JSON.stringify(dietChecked.value))
  } catch (error) {
    console.error('Failed to toggle diet:', error)
  }
}

const showWeightInput = () => {
  showWeightDialog.value = true
}

const saveWeight = async () => {
  try {
    await addWeight({ weight: Number(currentWeight.value) });
    await loadWeightHistory();
    await loadTodayRecords(); // 重新加载今天的记录来更新图标状态
    showWeightDialog.value = false;
    currentWeight.value = '';
    showSuccessToast('体重记录成功');
  } catch (error) {
    console.error('Failed to save weight:', error);
  }
};

const loadWeightHistory = async () => {
  try {
    const { success, data } = await getWeightHistory(7); // 修改为请求最近一周的数据
    console.log('Weight history response:', { success, data })

    if (!success || !data?.dates || !data?.weights) {
      console.error('Invalid data format for weight history:', { success, data })
      return
    }
    
    if (healthChart.value) {
      const chart = echarts.init(healthChart.value)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>体重: {c}kg'
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.dates.map(date => date.slice(5)), // 只显示月-日
          axisLabel: {
            interval: Math.floor(data.dates.length / 6) // 控制显示的标签数量
          }
        },
        yAxis: {
          type: 'value',
          name: '体重(kg)',
          scale: true,
          min: function(value) {
            if (!data.weights.some(w => w !== null)) return 40;
            const validWeights = data.weights.filter(w => w !== null);
            return Math.floor(Math.min(...validWeights) - 1);
          },
          max: function(value) {
            if (!data.weights.some(w => w !== null)) return 100;
            const validWeights = data.weights.filter(w => w !== null);
            return Math.ceil(Math.max(...validWeights) + 1);
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '体重',
            type: 'line',
            smooth: true,
            data: data.weights,
            connectNulls: true, // 连接空值点
            areaStyle: {
              opacity: 0.1
            },
            itemStyle: {
              color: '#07c160'
            },
            lineStyle: {
              width: 2
            }
          }
        ]
      }
      
      console.log('Chart option:', option)
      chart.setOption(option)
      
      // 清理之前的 resize 事件监听器
      const handleResize = () => chart.resize()
      window.removeEventListener('resize', handleResize)
      window.addEventListener('resize', handleResize)
    }
  } catch (error) {
    console.error('Failed to load weight history:', error)
  }
}

const loadHealthStats = async () => {
  try {
    const { data } = await getHealthStats()
    Object.assign(weeklyStats, data)
  } catch (error) {
    console.error('Failed to load health stats:', error)
  }
}

onMounted(async () => {
  // 从 localStorage 中读取打卡状态
  exerciseChecked.value = JSON.parse(localStorage.getItem('exerciseChecked') || 'false')
  dietChecked.value = JSON.parse(localStorage.getItem('dietChecked') || 'false')
  weightChecked.value = JSON.parse(localStorage.getItem('weightChecked') || 'false')

  await Promise.all([
    loadWeightHistory(),
    loadHealthStats(),
    loadTodayRecords()
  ])
})
</script>

<style scoped>
.dashboard-container {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.greeting {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  margin: 8px 0 0;
  color: #666;
}

.health-overview {
  margin-top: 16px;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}

.stat-item {
  text-align: center;
}

.circle-value {
  font-size: 12px;
  color: #333;
}

.label {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.weight-trend {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-top: 16px;
}

.value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.weight-unit {
  font-size: 14px;
  color: #666;
  margin: 0 4px;
}

.trend-value {
  font-size: 14px;
  &.up {
    color: #ee0a24;
  }
  &.down {
    color: #07c160;
  }
}

.weight-grid-item,
.exercise-grid-item,
.diet-grid-item {
  position: relative;
  cursor: pointer;
}

.weight-grid-item::after,
.exercise-grid-item::after,
.diet-grid-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.2s;
}

.weight-grid-item:hover::after,
.exercise-grid-item:hover::after,
.diet-grid-item:hover::after {
  opacity: 1;
}
</style>
