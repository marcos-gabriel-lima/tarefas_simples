import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGroupStore = defineStore('group', () => {
  // Estado
  const groups = ref([])
  const currentGroup = ref(null)

  // Getters
  const groupsCount = computed(() => groups.value.length)

  // Actions
  function loadGroups(username) {
    const savedGroups = localStorage.getItem(`groups_${username}`)
    groups.value = savedGroups ? JSON.parse(savedGroups) : []
  }

  function saveGroups(username) {
    localStorage.setItem(`groups_${username}`, JSON.stringify(groups.value))
  }

  function addGroup(name, username) {
    if (!name.trim()) {
      throw new Error('Por favor, digite um nome para o grupo!')
    }

    if (groups.value.find(group => group.name === name.trim())) {
      throw new Error('Já existe um grupo com este nome!')
    }

    const group = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      username: username
    }

    groups.value.push(group)
    saveGroups(username)
    return group
  }

  function editGroup(groupId, newName, username) {
    const group = groups.value.find(g => g.id === groupId)
    if (!group) {
      throw new Error('Grupo não encontrado!')
    }

    if (!newName.trim()) {
      throw new Error('Nome do grupo não pode estar vazio!')
    }

    if (newName.trim() === group.name) {
      return group // Nome não mudou
    }

    // Verificar se já existe outro grupo com este nome
    if (groups.value.find(g => g.id !== groupId && g.name === newName.trim())) {
      throw new Error('Já existe um grupo com este nome!')
    }

    group.name = newName.trim()
    group.updatedAt = new Date().toISOString()
    
    saveGroups(username)
    return group
  }

  function deleteGroup(groupId, username) {
    const groupIndex = groups.value.findIndex(g => g.id === groupId)
    if (groupIndex === -1) {
      throw new Error('Grupo não encontrado!')
    }

    const group = groups.value[groupIndex]
    groups.value.splice(groupIndex, 1)
    saveGroups(username)
    
    // Remover tarefas do grupo do localStorage
    localStorage.removeItem(`tasks_${username}_${groupId}`)
    
    // Se o grupo excluído estava sendo visualizado, limpar currentGroup
    if (currentGroup.value && currentGroup.value.id === groupId) {
      currentGroup.value = null
    }
    
    return group
  }

  function selectGroup(groupId) {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      currentGroup.value = group
      return group
    }
    throw new Error('Grupo não encontrado!')
  }

  function clearCurrentGroup() {
    currentGroup.value = null
  }

  function clearGroups() {
    groups.value = []
    currentGroup.value = null
  }

  return {
    // Estado
    groups,
    currentGroup,
    // Getters
    groupsCount,
    // Actions
    loadGroups,
    saveGroups,
    addGroup,
    editGroup,
    deleteGroup,
    selectGroup,
    clearCurrentGroup,
    clearGroups
  }
})