import axios from 'axios'
import { showToast } from 'vant'

const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.error('Response error:', error)
    const message = error.response?.data?.message || '请求失败，请重试'
    showToast({
      message,
      type: 'fail'
    })
    return Promise.reject(error)
  }
)

export default request
