<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Header -->
      <div class="login-header">
        <h1>✨ Sistema de Tarefas</h1>
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
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 50%, #764ba2 75%, #f093fb 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255,255,255,0.2),
    inset 0 1px 0 rgba(255,255,255,0.3);
  padding: 48px;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255,255,255,0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.login-header h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  letter-spacing: -0.5px;
}

.login-header p {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.8;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}

.form-group input {
  width: 100%;
  padding: 18px 24px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  font-weight: 500;
}

.form-group input:focus {
  border-color: #667eea;
  box-shadow: 
    0 0 0 4px rgba(102, 126, 234, 0.1),
    0 4px 12px rgba(102, 126, 234, 0.15);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
}

.form-group input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.login-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
}

.btn-primary, .btn-secondary {
  padding: 18px 32px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
  box-shadow: 
    0 8px 20px rgba(102, 126, 234, 0.3),
    0 0 0 1px rgba(255,255,255,0.1);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 
    0 12px 28px rgba(102, 126, 234, 0.4),
    0 0 0 1px rgba(255,255,255,0.2);
}

.btn-primary:hover:not(:disabled)::before {
  left: 100%;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.8);
  color: #374151;
  border: 2px solid rgba(229, 231, 235, 0.8);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.95);
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.btn-primary:disabled, .btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.user-list {
  border-top: 1px solid rgba(229, 231, 235, 0.5);
  padding-top: 32px;
  margin-top: 32px;
}

.user-list h3 {
  color: #374151;
  font-size: 1.1rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.users-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.user-chip {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 12px 20px;
  border-radius: 24px;
  font-size: 14px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  font-weight: 600;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.user-chip::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.3s;
}

.user-chip:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  border-color: transparent;
}

.user-chip:hover::before {
  left: 100%;
}

.empty-users {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 24px;
  font-size: 15px;
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