<template>
  <div class="tasks-page">
    <!-- Header -->
    <div class="header-section">
      <div class="header-content">
        <h1>📝 {{ groupStore.currentGroup?.name || 'Minhas Tarefas' }}</h1>
        <div class="user-info">
          <span>{{ userStore.currentUser }}</span>
          <div class="header-actions">
            <button v-if="groupStore.currentGroup" @click="editCurrentGroup" class="edit-group-btn" title="Editar grupo atual">
              ✏️ Editar Grupo
            </button>
            <button @click="backToGroups" class="back-btn">
              ← Voltar aos Grupos
            </button>
            <button @click="handleLogout" class="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Adicionar Tarefa -->
    <div class="add-task-section">
      <form @submit.prevent="handleAddTask" class="add-task-form">
        <input
          v-model="newTaskText"
          placeholder="Digite uma nova tarefa..."
          maxlength="100"
          class="task-input"
        />
        <button type="submit" :disabled="!newTaskText.trim() || addingTask" class="add-btn">
          {{ addingTask ? 'Adicionando...' : 'Adicionar' }}
        </button>
      </form>
    </div>

    <!-- Tarefas Pendentes -->
    <div class="tasks-section">
      <div class="section-header">
        <h2>Tarefas Pendentes</h2>
        <span class="badge">{{ taskStore.pendingCount }}</span>
      </div>
      
      <div v-if="taskStore.pendingTasks.length === 0" class="empty-state">
        <p>🎉 Nenhuma tarefa pendente!</p>
      </div>
      
      <div v-else class="tasks-list">
        <div
          v-for="task in taskStore.pendingTasks"
          :key="task.id"
          class="task-item"
          @click="toggleTask(task.id)"
        >
          <div class="task-checkbox" :class="{ checked: task.completed }"></div>
          <span class="task-text">{{ task.text }}</span>
          <div class="task-actions">
            <button @click.stop="editTask(task.id)" class="edit-btn" title="Editar tarefa">
              ✏️
            </button>
            <button @click.stop="deleteTask(task.id)" class="delete-btn" title="Excluir tarefa">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tarefas Concluídas -->
    <div class="completed-section">
      <div class="section-header">
        <h2>Tarefas Concluídas</h2>
        <div class="completed-actions">
          <span class="badge completed">{{ taskStore.completedCount }}</span>
          <button
            @click="resetCompletedTasks"
            :disabled="taskStore.completedCount === 0"
            class="reset-btn"
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>
      
      <div v-if="taskStore.completedTasks.length === 0" class="empty-state">
        <p>Nenhuma tarefa concluída ainda.</p>
      </div>
      
      <div v-else class="tasks-list">
        <div
          v-for="task in taskStore.completedTasks"
          :key="task.id"
          class="task-item completed"
          @click="toggleTask(task.id)"
        >
          <div class="task-checkbox checked"></div>
          <span class="task-text completed">{{ task.text }}</span>
          <div class="task-actions">
            <button @click.stop="editTask(task.id)" class="edit-btn" title="Editar tarefa">
              ✏️
            </button>
            <button @click.stop="deleteTask(task.id)" class="delete-btn" title="Excluir tarefa">
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
import { useTaskStore } from '../stores/task'
import { useGroupStore } from '../stores/group'

export default defineComponent({
  name: 'TasksPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const taskStore = useTaskStore()
    const groupStore = useGroupStore()

    const newTaskText = ref('')
    const addingTask = ref(false)

    onMounted(() => {
      if (!userStore.currentUser) {
        router.push('/login')
        return
      }
      
      if (!groupStore.currentGroup) {
        router.push('/groups')
        return
      }
      
      taskStore.loadTasks(userStore.currentUser, groupStore.currentGroup.id)
    })

    const handleAddTask = async () => {
      if (!newTaskText.value.trim()) return
      
      try {
        addingTask.value = true
        taskStore.addTask(newTaskText.value, userStore.currentUser, groupStore.currentGroup.id)
        
        alert('Tarefa adicionada com sucesso!')
        newTaskText.value = ''
      } catch (error) {
        alert(error.message)
      } finally {
        addingTask.value = false
      }
    }

    const toggleTask = async (taskId) => {
      try {
        const task = taskStore.toggleTask(taskId, userStore.currentUser, groupStore.currentGroup.id)
        const message = task.completed ? 'Tarefa concluída!' : 'Tarefa reativada!'
        alert(message)
      } catch (error) {
        alert(error.message)
      }
    }

    const editTask = async (taskId) => {
      const task = taskStore.tasks.find(t => t.id === taskId)
      if (!task) return

      const newText = prompt(`Editar tarefa:`, task.text)
      
      if (newText === null) return // Usuário cancelou
      
      try {
        taskStore.editTask(taskId, newText, userStore.currentUser, groupStore.currentGroup.id)
        alert('Tarefa editada com sucesso!')
      } catch (error) {
        alert(error.message)
      }
    }

    const deleteTask = async (taskId) => {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
          taskStore.deleteTask(taskId, userStore.currentUser, groupStore.currentGroup.id)
          alert('Tarefa excluída!')
        } catch (error) {
          alert(error.message)
        }
      }
    }

    const resetCompletedTasks = () => {
      if (confirm(`Tem certeza que deseja reiniciar ${taskStore.completedCount} tarefa(s) concluída(s)?\n\nElas voltarão para o status pendente.`)) {
        try {
          const count = taskStore.resetCompletedTasks(userStore.currentUser, groupStore.currentGroup.id)
          alert(`${count} tarefa(s) reiniciada(s) com sucesso!`)
        } catch (error) {
          alert(error.message)
        }
      }
    }

    const editCurrentGroup = async () => {
      if (!groupStore.currentGroup) return

      const newName = prompt(`Editar nome do grupo "${groupStore.currentGroup.name}":`, groupStore.currentGroup.name)
      
      if (newName === null) return // Usuário cancelou
      
      try {
        groupStore.editGroup(groupStore.currentGroup.id, newName, userStore.currentUser)
        alert('Grupo editado com sucesso!')
      } catch (error) {
        alert(error.message)
      }
    }

    const backToGroups = () => {
      groupStore.clearCurrentGroup()
      taskStore.clearTasks()
      router.push('/groups')
    }

    const handleLogout = () => {
      if (confirm('Tem certeza que deseja sair?')) {
        userStore.logout()
        groupStore.clearGroups()
        taskStore.clearTasks()
        router.push('/login')
        alert('Logout realizado com sucesso!')
      }
    }

    return {
      userStore,
      taskStore,
      groupStore,
      newTaskText,
      addingTask,
      handleAddTask,
      toggleTask,
      editTask,
      deleteTask,
      resetCompletedTasks,
      editCurrentGroup,
      backToGroups,
      handleLogout
    }
  }
})
</script>

<style scoped>
.tasks-page {
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
  flex-wrap: wrap;
}

.user-info span {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.edit-group-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.edit-group-btn:hover {
  background: #138496;
  transform: translateY(-1px);
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
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

.add-task-section {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.add-task-form {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  display: flex;
  gap: 15px;
  align-items: center;
}

.task-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.task-input:focus {
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
  min-width: 120px;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tasks-section, .completed-section {
  margin: 0 20px 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  overflow: hidden;
}

.section-header {
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
  color: #495057;
  font-size: 1.3rem;
  font-weight: 600;
}

.completed-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.badge {
  background: #667eea;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  min-width: 25px;
  text-align: center;
}

.badge.completed {
  background: #28a745;
}

.reset-btn {
  background: #ffc107;
  color: #212529;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover:not(:disabled) {
  background: #e0a800;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(255, 193, 7, 0.3);
}

.reset-btn:disabled {
  background: #6c757d;
  color: #fff;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tasks-list {
  padding: 0;
}

.task-item {
  padding: 20px 25px;
  border-bottom: 1px solid #f1f3f4;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.task-item:hover {
  background: #f8f9fa;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item.completed {
  opacity: 0.8;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #667eea;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.task-checkbox.checked {
  background: #667eea;
  border-color: #667eea;
}

.task-checkbox.checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.task-text {
  flex: 1;
  font-size: 16px;
  color: #495057;
  transition: all 0.3s ease;
}

.task-text.completed {
  text-decoration: line-through;
  color: #6c757d;
}

.task-actions {
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
  font-size: 12px;
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
  font-size: 12px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.empty-state {
  padding: 40px 25px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .user-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  
  .edit-group-btn, .back-btn, .logout-btn {
    width: 100%;
    justify-content: center;
  }
  
  .tasks-section, .completed-section {
    margin: 0 10px 15px;
  }
  
  .add-task-section {
    padding: 15px;
  }
  
  .add-task-form {
    flex-direction: column;
    gap: 15px;
  }
  
  .add-btn {
    width: 100%;
  }
  
  .task-item {
    padding: 15px 20px;
    flex-wrap: wrap;
  }
  
  .task-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>