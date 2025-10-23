import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTaskStore = defineStore('task', () => {
  // Estado
  const tasks = ref([])

  // Getters
  const pendingTasks = computed(() => tasks.value.filter(task => !task.completed))
  const completedTasks = computed(() => tasks.value.filter(task => task.completed))
  const pendingCount = computed(() => pendingTasks.value.length)
  const completedCount = computed(() => completedTasks.value.length)

  // Actions
  function loadTasks(username, groupId) {
    const savedTasks = localStorage.getItem(`tasks_${username}_${groupId}`)
    tasks.value = savedTasks ? JSON.parse(savedTasks) : []
  }

  function saveTasks(username, groupId) {
    localStorage.setItem(`tasks_${username}_${groupId}`, JSON.stringify(tasks.value))
  }

  function addTask(text, username, groupId) {
    if (!text.trim()) {
      throw new Error('Por favor, digite uma tarefa válida!')
    }

    const task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      username: username,
      groupId: groupId
    }

    tasks.value.push(task)
    saveTasks(username, groupId)
    return task
  }

  function toggleTask(taskId, username, groupId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      saveTasks(username, groupId)
      return task
    }
    throw new Error('Tarefa não encontrada!')
  }

  function editTask(taskId, newText, username, groupId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) {
      throw new Error('Tarefa não encontrada!')
    }

    if (!newText.trim()) {
      throw new Error('Texto da tarefa não pode estar vazio!')
    }

    if (newText.trim() === task.text) {
      return task // Texto não mudou
    }

    task.text = newText.trim()
    task.updatedAt = new Date().toISOString()
    
    saveTasks(username, groupId)
    return task
  }

  function deleteTask(taskId, username, groupId) {
    const taskIndex = tasks.value.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
      saveTasks(username, groupId)
      return true
    }
    throw new Error('Tarefa não encontrada!')
  }

  function resetCompletedTasks(username, groupId) {
    const completedTasks = tasks.value.filter(task => task.completed)
    
    if (completedTasks.length === 0) {
      throw new Error('Não há tarefas concluídas para reiniciar!')
    }

    tasks.value.forEach(task => {
      if (task.completed) {
        task.completed = false
      }
    })

    saveTasks(username, groupId)
    return completedTasks.length
  }

  function clearTasks() {
    tasks.value = []
  }

  return {
    // Estado
    tasks,
    // Getters
    pendingTasks,
    completedTasks,
    pendingCount,
    completedCount,
    // Actions
    loadTasks,
    saveTasks,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    resetCompletedTasks,
    clearTasks
  }
})
