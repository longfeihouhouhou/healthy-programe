import request from '@/utils/request'

export interface HealthStats {
  exercise: number
  diet: number
  weight: number
  weightTrend: number
}

export interface WeightHistory {
  dates: string[]
  weights: number[]
}

export interface HealthRecord {
  _id: string
  user: string
  type: 'exercise' | 'diet' | 'weight'
  date: string
  data: {
    exerciseType?: string
    exerciseDuration?: number
    dietType?: string
    calories?: number
    weight?: number
  }
}

export const getHealthStats = () => {
  return request.get<{ success: boolean; data: HealthStats }>('/health/stats')
}

export const getWeightHistory = async (days = 30) => {
  const response = await request.get<{ success: boolean; data: WeightHistory }>(`/health/weight/history?days=${days}`)
  return response.data
}

export const getHealthRecords = (params: { 
  type?: string | null
  date?: string     // 查询指定日期的记录
  limit?: number 
}) => {
  const queryParams = new URLSearchParams()
  if (params.type) queryParams.append('type', params.type)
  if (params.date) queryParams.append('date', params.date)
  if (params.limit) queryParams.append('limit', params.limit.toString())
  
  return request.get<{ success: boolean; data: { records: HealthRecord[] } }>(
    `/health/records?${queryParams.toString()}`
  )
}

export const addWeight = (data: { weight: number; date: Date }) => {
  return request.post<{ success: boolean; data: any }>('/health/weight', data)
}

export const addExercise = (type: string, duration: number) => {
  return request.post('/health/exercise', { type, duration })
}

export const addDiet = (type: string, calories: number) => {
  return request.post('/health/diet', { type, calories })
}
