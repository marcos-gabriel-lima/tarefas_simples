<template>
  <div class="groups-page">
    <!-- Header -->
    <div class="header-section">
      <div class="header-content">
        <h1>📁 Meus Grupos</h1>
        <div class="user-info">
          <span>{{ userStore.currentUser }}</span>
          <button @click="handleLogout" class="logout-btn">
            Sair
          </button>
        </div>
      </div>
    </div>

    <!-- Adicionar Grupo -->
    <div class="add-group-section">
      <form @submit.prevent="handleAddGroup" class="add-group-form">
        <input
          v-model="newGroupName"
          placeholder="Nome do grupo..."
          maxlength="50"
          class="group-input"
        />
        <button type="submit" :disabled="!newGroupName.trim() || addingGroup" class="add-btn">
          {{ addingGroup ? 'Criando...' : 'Criar Grupo' }}
        </button>
      </form>
    </div>

    <!-- Lista de Grupos -->
    <div class="groups-section">
      <div v-if="groupStore.groups.length === 0" class="empty-state">
        <p>Nenhum grupo criado ainda.<br>Crie seu primeiro grupo para organizar suas tarefas!</p>
      </div>
      
      <div v-else class="groups-list">
        <div
          v-for="group in groupStore.groups"
          :key="group.id"
          class="group-item"
          @click="selectGroup(group.id)"
        >
          <div class="group-info">
            <h3>📁 {{ group.name }}</h3>
            <p>Criado em {{ formatDate(group.createdAt) }}</p>
          </div>
          <div class="group-actions">
            <button @click.stop="editGroup(group.id)" class="edit-btn" title="Editar grupo">
              ✏️
            </button>
            <button @click.stop="deleteGroup(group.id)" class="delete-btn" title="Excluir grupo">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useGroupStore } from '../stores/group'

export default defineComponent({
  name: 'GroupsPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const groupStore = useGroupStore()

    const newGroupName = ref('')
    const addingGroup = ref(false)

    onMounted(() => {
      if (!userStore.currentUser) {
        router.push('/login')
        return
      }
      
      groupStore.loadGroups(userStore.currentUser)
    })

    const handleAddGroup = async () => {
      if (!newGroupName.value.trim()) return
      
      try {
        addingGroup.value = true
        groupStore.addGroup(newGroupName.value, userStore.currentUser)
        
        alert('Grupo criado com sucesso!')
        newGroupName.value = ''
      } catch (error) {
        alert(error.message)
      } finally {
        addingGroup.value = false
      }
    }

    const selectGroup = (groupId) => {
      try {
        groupStore.selectGroup(groupId)
        router.push('/tasks')
      } catch (error) {
        alert(error.message)
      }
    }

    const editGroup = async (groupId) => {
      const group = groupStore.groups.find(g => g.id === groupId)
      if (!group) return

      const newName = prompt(`Editar nome do grupo "${group.name}":`, group.name)
      
      if (newName === null) return // Usuário cancelou
      
      try {
        groupStore.editGroup(groupId, newName, userStore.currentUser)
        alert('Grupo editado com sucesso!')
      } catch (error) {
        alert(error.message)
      }
    }

    const deleteGroup = async (groupId) => {
      const group = groupStore.groups.find(g => g.id === groupId)
      if (!group) return

      const confirmMessage = `Tem certeza que deseja excluir o grupo "${group.name}"?\n\nTodas as tarefas deste grupo também serão excluídas.`
      
      if (confirm(confirmMessage)) {
        try {
          groupStore.deleteGroup(groupId, userStore.currentUser)
          alert('Grupo excluído com sucesso!')
        } catch (error) {
          alert(error.message)
        }
      }
    }

    const handleLogout = () => {
      if (confirm('Tem certeza que deseja sair?')) {
        userStore.logout()
        groupStore.clearGroups()
        router.push('/login')
        alert('Logout realizado com sucesso!')
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    return {
      userStore,
      groupStore,
      newGroupName,
      addingGroup,
      handleAddGroup,
      selectGroup,
      editGroup,
      deleteGroup,
      handleLogout,
      formatDate
    }
  }
})
</script>

<style scoped>
.groups-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 0;
}

.header-section {
  background: rgba(0, 0, 0, 0.1);
  padding: 20px;
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
}

.header-content h1 {
  color: white;
  font-size: 2rem;
  font-weight: 300;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.add-group-section {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.add-group-form {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  display: flex;
  gap: 15px;
  align-items: center;
}

.group-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.group-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-btn {
  padding: 15px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.groups-section {
  padding: 0 20px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.groups-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.group-item {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.group-info {
  flex: 1;
}

.group-info h3 {
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.group-info p {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.group-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #138496;
  transform: translateY(-1px);
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.empty-state {
  background: white;
  border-radius: 15px;
  padding: 40px 25px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .groups-section {
    padding: 0 10px 15px;
  }
  
  .add-group-section {
    padding: 15px;
  }
  
  .add-group-form {
    flex-direction: column;
    gap: 15px;
  }
  
  .add-btn {
    width: 100%;
  }
  
  .groups-list {
    grid-template-columns: 1fr;
  }
  
  .group-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .group-actions {
    justify-content: flex-end;
  }
}
</style>
