<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Header -->
      <div class="login-header">
        <h1>📝 Sistema de Tarefas</h1>
        <p>Gerencie suas tarefas pessoais</p>
      </div>

      <!-- Formulário de Login -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Nome do Usuário:</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Digite seu nome de usuário"
            maxlength="20"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Senha:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
            maxlength="30"
            required
          />
        </div>

        <div class="login-actions">
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>

          <button type="button" @click="handleRegister" class="btn-secondary" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Registrar' }}
          </button>
        </div>
      </form>

      <!-- Lista de Usuários -->
      <div class="user-list">
        <h3>Usuários Cadastrados</h3>
        <div class="users-grid">
          <span
            v-for="user in userStore.usersList"
            :key="user.username"
            @click="selectUser(user.username)"
            class="user-chip"
          >
            {{ user.username }}
          </span>
        </div>
        <div v-if="userStore.usersList.length === 0" class="empty-users">
          Nenhum usuário cadastrado
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const username = ref('')
    const password = ref('')
    const loading = ref(false)

    onMounted(() => {
      userStore.loadUsers()
      
      // Auto-login se usuário já estiver logado
      if (userStore.checkAutoLogin()) {
        router.push('/tasks')
      }
    })

    const selectUser = (selectedUsername) => {
      username.value = selectedUsername
      password.value = ''
    }

    const handleLogin = async () => {
      try {
        loading.value = true
        
        userStore.validateCredentials(username.value, password.value)
        userStore.login(username.value, password.value)
        
        alert(`Bem-vindo, ${username.value}!`)
        router.push('/tasks')
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
      }
    }

    const handleRegister = async () => {
      try {
        loading.value = true
        
        userStore.validateCredentials(username.value, password.value)
        userStore.register(username.value, password.value)
        
        alert(`Usuário "${username.value}" registrado com sucesso!`)
        
        // Limpar formulário após registro
        username.value = ''
        password.value = ''
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      password,
      loading,
      userStore,
      selectUser,
      handleLogin,
      handleRegister
    }
  }
})
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #667eea;
  font-size: 2.2rem;
  font-weight: 300;
  margin-bottom: 10px;
}

.login-header p {
  color: #6c757d;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #495057;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.btn-primary, .btn-secondary {
  padding: 15px 25px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
}

.btn-secondary:hover:not(:disabled) {
  background: #e9ecef;
  transform: translateY(-1px);
}

.btn-primary:disabled, .btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-list {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.user-list h3 {
  color: #495057;
  font-size: 1rem;
  margin-bottom: 15px;
  text-align: center;
}

.users-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.user-chip {
  background: #f8f9fa;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.user-chip:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

.empty-users {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px;
}

@media (max-width: 600px) {
  .login-container {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .login-header h1 {
    font-size: 1.8rem;
  }
}
</style>