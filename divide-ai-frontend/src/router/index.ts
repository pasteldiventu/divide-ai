// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import CreateAccount from '@/views/CreateAccount.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      redirect: '/login' 
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: CreateAccount
    }
  ]
})

export default router