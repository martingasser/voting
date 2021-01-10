import { createRouter, createWebHistory } from 'vue-router'
import Vote from '../views/Vote.vue'
import api from '@/api'

const routes = [
  {
    path: '/',
    name: 'Vote',
    component: Vote,
    beforeEnter (to, from, next) {
      if (! api.isAuthenticated()) {
        return next('/login')
      }
      next()    
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
