// Sistema de Gerenciamento de Usuários e Tarefas
class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.bindLoginEvents();
        this.renderUsersList();
        this.checkAutoLogin();
    }

    bindLoginEvents() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('userPassword');

        loginBtn.addEventListener('click', () => this.login());
        registerBtn.addEventListener('click', () => this.register());
        logoutBtn.addEventListener('click', () => this.logout());

        // Enter para login/registro
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.login();
            }
        });
    }

    register() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('userPassword').value.trim();

        if (!this.validateCredentials(username, password)) {
            return;
        }

        if (this.users.find(user => user.username === username)) {
            this.showMessage('Usuário já existe!', 'error');
            return;
        }

        const newUser = {
            username: username,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        this.renderUsersList();
        this.clearLoginForm();
        
        this.showMessage(`Usuário "${username}" registrado com sucesso!`, 'success');
    }

    login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('userPassword').value.trim();

        if (!this.validateCredentials(username, password)) {
            return;
        }

        const user = this.users.find(u => u.username === username);
        if (!user || user.password !== this.hashPassword(password)) {
            this.showMessage('Usuário ou senha incorretos!', 'error');
            return;
        }

        this.currentUser = username;
        this.saveCurrentUser();
        this.showMainScreen();
        this.showMessage(`Bem-vindo, ${username}!`, 'success');
    }

    logout() {
        this.currentUser = null;
        this.clearCurrentUser();
        this.showLoginScreen();
        this.showMessage('Logout realizado com sucesso!', 'success');
    }

    validateCredentials(username, password) {
        if (username.length < 3) {
            this.showMessage('Nome de usuário deve ter pelo menos 3 caracteres!', 'error');
            return false;
        }
        if (password.length < 4) {
            this.showMessage('Senha deve ter pelo menos 4 caracteres!', 'error');
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.showMessage('Nome de usuário deve conter apenas letras, números e underscore!', 'error');
            return false;
        }
        return true;
    }

    hashPassword(password) {
        // Hash simples para demonstração (em produção, use bcrypt ou similar)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('username').focus();
    }

    showMainScreen() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        document.getElementById('currentUser').textContent = this.currentUser;
        
        // Inicializar o TaskManager para o usuário atual
        if (window.taskManager) {
            window.taskManager.destroy();
        }
        window.taskManager = new TaskManager(this.currentUser);
    }

    checkAutoLogin() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser && this.users.find(u => u.username === savedUser)) {
            this.currentUser = savedUser;
            this.showMainScreen();
        } else {
            this.showLoginScreen();
        }
    }

    renderUsersList() {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        if (this.users.length === 0) {
            usersList.innerHTML = '<div class="empty-state">Nenhum usuário cadastrado</div>';
            return;
        }

        this.users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.textContent = user.username;
            userItem.addEventListener('click', () => {
                document.getElementById('username').value = user.username;
                document.getElementById('userPassword').focus();
            });
            usersList.appendChild(userItem);
        });
    }

    clearLoginForm() {
        document.getElementById('username').value = '';
        document.getElementById('userPassword').value = '';
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    loadUsers() {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    }

    saveCurrentUser() {
        localStorage.setItem('currentUser', this.currentUser);
    }

    clearCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Classe para gerenciar tarefas por usuário
class TaskManager {
    constructor(username) {
        this.username = username;
        this.tasks = this.loadTasks();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        this.updateCounters();
    }

    bindEvents() {
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskInput = document.getElementById('taskInput');
        const resetTasksBtn = document.getElementById('resetTasksBtn');

        addTaskBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        resetTasksBtn.addEventListener('click', () => this.resetCompletedTasks());

        taskInput.focus();
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            this.showMessage('Por favor, digite uma tarefa válida!', 'error');
            return;
        }

        const task = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            username: this.username
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateCounters();
        
        taskInput.value = '';
        taskInput.focus();
        
        this.showMessage('Tarefa adicionada com sucesso!', 'success');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateCounters();
            
            const message = task.completed ? 'Tarefa concluída!' : 'Tarefa reativada!';
            this.showMessage(message, 'success');
        }
    }

    deleteTask(taskId) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateCounters();
            this.showMessage('Tarefa excluída!', 'success');
        }
    }

    resetCompletedTasks() {
        const completedTasks = this.tasks.filter(task => task.completed);
        
        if (completedTasks.length === 0) {
            this.showMessage('Não há tarefas concluídas para reiniciar!', 'info');
            return;
        }

        const confirmMessage = `Tem certeza que deseja reiniciar ${completedTasks.length} tarefa(s) concluída(s)?\n\nElas voltarão para o status pendente.`;
        
        if (confirm(confirmMessage)) {
            // Marcar todas as tarefas concluídas como pendentes
            this.tasks.forEach(task => {
                if (task.completed) {
                    task.completed = false;
                }
            });

            this.saveTasks();
            this.renderTasks();
            this.updateCounters();
            this.showMessage(`${completedTasks.length} tarefa(s) reiniciada(s) com sucesso!`, 'success');
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const completedList = document.getElementById('completedList');
        
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);

        // Renderizar tarefas pendentes
        tasksList.innerHTML = '';
        if (pendingTasks.length === 0) {
            tasksList.innerHTML = '<li class="empty-state">Nenhuma tarefa pendente! 🎉</li>';
        } else {
            pendingTasks.forEach(task => {
                tasksList.appendChild(this.createTaskElement(task));
            });
        }

        // Renderizar tarefas concluídas
        completedList.innerHTML = '';
        if (completedTasks.length === 0) {
            completedList.innerHTML = '<li class="empty-state">Nenhuma tarefa concluída ainda.</li>';
        } else {
            completedTasks.forEach(task => {
                completedList.appendChild(this.createTaskElement(task));
            });
        }
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="taskManager.toggleTask('${task.id}')"></div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="delete-btn" onclick="taskManager.deleteTask('${task.id}')">Excluir</button>
            </div>
        `;
        return li;
    }

    updateCounters() {
        const pendingCount = this.tasks.filter(task => !task.completed).length;
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        document.getElementById('pendingCount').textContent = pendingCount;
        document.getElementById('completedCount').textContent = completedCount;
        
        // Habilitar/desabilitar botão de reiniciar baseado nas tarefas concluídas
        const resetBtn = document.getElementById('resetTasksBtn');
        resetBtn.disabled = completedCount === 0;
    }

    saveTasks() {
        // Salvar tarefas com prefixo do usuário para separar os dados
        localStorage.setItem(`tasks_${this.username}`, JSON.stringify(this.tasks));
    }

    loadTasks() {
        // Carregar tarefas específicas do usuário
        const savedTasks = localStorage.getItem(`tasks_${this.username}`);
        return savedTasks ? JSON.parse(savedTasks) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    destroy() {
        // Limpar event listeners se necessário
        this.tasks = [];
    }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Inicializar o sistema quando a página carregar
let userManager;
document.addEventListener('DOMContentLoaded', () => {
    userManager = new UserManager();
});

// Atalhos de teclado globais
document.addEventListener('keydown', (e) => {
    // Ctrl + Enter para adicionar tarefa (apenas se estiver na tela principal)
    if (e.ctrlKey && e.key === 'Enter' && window.taskManager) {
        taskManager.addTask();
    }
    
    // Escape para limpar o input de tarefa
    if (e.key === 'Escape' && window.taskManager) {
        const taskInput = document.getElementById('taskInput');
        taskInput.value = '';
        taskInput.focus();
    }
});