import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard',
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../views/social/SocialView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/health',
      name: 'health',
      component: () => import('../views/health/HealthView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/exercise-records',
      name: 'exerciseRecords',
      component: () => import('../views/profile/ExerciseRecordsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/diet-records',
      name: 'dietRecords',
      component: () => import('../views/profile/DietRecordsView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') // 这里后续会改为更安全的验证方式
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
