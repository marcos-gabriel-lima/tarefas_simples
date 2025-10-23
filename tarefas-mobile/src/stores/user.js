import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // Estado
  const currentUser = ref(null)
  const users = ref([])

  // Getters
  const isAuthenticated = computed(() => !!currentUser.value)
  const usersList = computed(() => users.value)

  // Actions
  function loadUsers() {
    const savedUsers = localStorage.getItem('users')
    users.value = savedUsers ? JSON.parse(savedUsers) : []
  }

  function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  function register(username, password) {
    if (users.value.find(user => user.username === username)) {
      throw new Error('Usuário já existe!')
    }

    const newUser = {
      username: username,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    }

    users.value.push(newUser)
    saveUsers()
    return newUser
  }

  function login(username, password) {
    const user = users.value.find(u => u.username === username)
    if (!user || user.password !== hashPassword(password)) {
      throw new Error('Usuário ou senha incorretos!')
    }

    currentUser.value = username
    localStorage.setItem('currentUser', username)
    return user
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  function checkAutoLogin() {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser && users.value.find(u => u.username === savedUser)) {
      currentUser.value = savedUser
      return true
    }
    return false
  }

  function hashPassword(password) {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString()
  }

  function validateCredentials(username, password) {
    if (username.length < 3) {
      throw new Error('Nome de usuário deve ter pelo menos 3 caracteres!')
    }
    if (password.length < 4) {
      throw new Error('Senha deve ter pelo menos 4 caracteres!')
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('Nome de usuário deve conter apenas letras, números e underscore!')
    }
    return true
  }

  return {
    // Estado
    currentUser,
    users,
    // Getters
    isAuthenticated,
    usersList,
    // Actions
    loadUsers,
    saveUsers,
    register,
    login,
    logout,
    checkAutoLogin,
    hashPassword,
    validateCredentials
  }
})
