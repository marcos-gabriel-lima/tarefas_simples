import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import GroupsPage from '../pages/GroupsPage.vue'
import TasksPage from '../pages/TasksPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/groups',
    component: GroupsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    component: TasksPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('currentUser')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/groups')
  } else {
    next()
  }
})

export default router
