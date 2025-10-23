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
        
        // Inicializar o GroupManager para o usuário atual
        if (window.groupManager) {
            window.groupManager.destroy();
        }
        window.groupManager = new GroupManager(this.currentUser);
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

// Classe para gerenciar grupos por usuário
class GroupManager {
    constructor(username) {
        this.username = username;
        this.groups = this.loadGroups();
        this.currentGroup = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderGroups();
    }

    bindEvents() {
        const addGroupBtn = document.getElementById('addGroupBtn');
        const groupNameInput = document.getElementById('groupNameInput');
        const backToGroupsBtn = document.getElementById('backToGroupsBtn');
        const editCurrentGroupBtn = document.getElementById('editCurrentGroupBtn');

        addGroupBtn.addEventListener('click', () => this.addGroup());
        groupNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addGroup();
            }
        });
        backToGroupsBtn.addEventListener('click', () => this.showGroupsView());
        editCurrentGroupBtn.addEventListener('click', () => this.editCurrentGroup());

        groupNameInput.focus();
    }

    addGroup() {
        const groupNameInput = document.getElementById('groupNameInput');
        const groupName = groupNameInput.value.trim();

        if (groupName === '') {
            this.showMessage('Por favor, digite um nome para o grupo!', 'error');
            return;
        }

        if (this.groups.find(group => group.name === groupName)) {
            this.showMessage('Já existe um grupo com este nome!', 'error');
            return;
        }

        const group = {
            id: Date.now().toString(),
            name: groupName,
            createdAt: new Date().toISOString(),
            username: this.username
        };

        this.groups.push(group);
        this.saveGroups();
        this.renderGroups();
        
        groupNameInput.value = '';
        groupNameInput.focus();
        
        this.showMessage(`Grupo "${groupName}" criado com sucesso!`, 'success');
    }

    selectGroup(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (group) {
            this.currentGroup = group;
            this.showGroupTasks();
            
            // Inicializar o TaskManager para o grupo selecionado
            if (window.taskManager) {
                window.taskManager.destroy();
            }
            window.taskManager = new TaskManager(this.username, groupId);
        }
    }

    editGroup(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;

        const newName = prompt(`Editar nome do grupo "${group.name}":`, group.name);
        
        if (newName === null) return; // Usuário cancelou
        
        const trimmedName = newName.trim();
        
        if (trimmedName === '') {
            this.showMessage('Nome do grupo não pode estar vazio!', 'error');
            return;
        }

        if (trimmedName === group.name) {
            return; // Nome não mudou
        }

        // Verificar se já existe outro grupo com este nome
        if (this.groups.find(g => g.id !== groupId && g.name === trimmedName)) {
            this.showMessage('Já existe um grupo com este nome!', 'error');
            return;
        }

        group.name = trimmedName;
        group.updatedAt = new Date().toISOString();
        
        this.saveGroups();
        this.renderGroups();
        
        // Se este grupo está sendo visualizado, atualizar o título
        if (this.currentGroup && this.currentGroup.id === groupId) {
            document.getElementById('selectedGroupName').textContent = group.name;
        }
        
        this.showMessage(`Grupo renomeado para "${trimmedName}"!`, 'success');
    }

    deleteGroup(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;

        const confirmMessage = `Tem certeza que deseja excluir o grupo "${group.name}"?\n\nTodas as tarefas deste grupo também serão excluídas.`;
        
        if (confirm(confirmMessage)) {
            this.groups = this.groups.filter(g => g.id !== groupId);
            this.saveGroups();
            this.renderGroups();
            
            // Remover tarefas do grupo do localStorage
            localStorage.removeItem(`tasks_${this.username}_${groupId}`);
            
            // Se o grupo excluído estava sendo visualizado, voltar para a lista de grupos
            if (this.currentGroup && this.currentGroup.id === groupId) {
                this.showGroupsView();
            }
            
            this.showMessage(`Grupo "${group.name}" excluído com sucesso!`, 'success');
        }
    }

    showGroupsView() {
        document.querySelector('.groups-section').style.display = 'block';
        document.getElementById('groupTasksSection').style.display = 'none';
        this.currentGroup = null;
        
        if (window.taskManager) {
            window.taskManager.destroy();
        }
    }

    showGroupTasks() {
        document.querySelector('.groups-section').style.display = 'none';
        document.getElementById('groupTasksSection').style.display = 'block';
        document.getElementById('selectedGroupName').textContent = this.currentGroup.name;
    }

    editCurrentGroup() {
        if (this.currentGroup) {
            this.editGroup(this.currentGroup.id);
        }
    }

    renderGroups() {
        const groupsList = document.getElementById('groupsList');
        groupsList.innerHTML = '';

        if (this.groups.length === 0) {
            groupsList.innerHTML = '<div class="empty-state">Nenhum grupo criado ainda.<br>Crie seu primeiro grupo para organizar suas tarefas!</div>';
            return;
        }

        this.groups.forEach(group => {
            const groupElement = this.createGroupElement(group);
            groupsList.appendChild(groupElement);
        });
    }

    createGroupElement(group) {
        const div = document.createElement('div');
        div.className = 'group-item';
        div.innerHTML = `
            <div class="group-info" onclick="groupManager.selectGroup('${group.id}')">
                <h3>📁 ${this.escapeHtml(group.name)}</h3>
                <p>Criado em ${new Date(group.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <div class="group-actions">
                <button class="edit-group-btn" onclick="event.stopPropagation(); groupManager.editGroup('${group.id}')" title="Editar grupo">
                    ✏️
                </button>
                <button class="delete-group-btn" onclick="event.stopPropagation(); groupManager.deleteGroup('${group.id}')" title="Excluir grupo">
                    🗑️
                </button>
            </div>
        `;
        return div;
    }

    saveGroups() {
        localStorage.setItem(`groups_${this.username}`, JSON.stringify(this.groups));
    }

    loadGroups() {
        const savedGroups = localStorage.getItem(`groups_${this.username}`);
        return savedGroups ? JSON.parse(savedGroups) : [];
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
        this.groups = [];
        this.currentGroup = null;
    }
}

// Classe para gerenciar tarefas por usuário e grupo
class TaskManager {
    constructor(username, groupId) {
        this.username = username;
        this.groupId = groupId;
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
            username: this.username,
            groupId: this.groupId
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

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newText = prompt(`Editar tarefa:`, task.text);
        
        if (newText === null) return; // Usuário cancelou
        
        const trimmedText = newText.trim();
        
        if (trimmedText === '') {
            this.showMessage('Texto da tarefa não pode estar vazio!', 'error');
            return;
        }

        if (trimmedText === task.text) {
            return; // Texto não mudou
        }

        task.text = trimmedText;
        task.updatedAt = new Date().toISOString();
        
        this.saveTasks();
        this.renderTasks();
        
        this.showMessage('Tarefa editada com sucesso!', 'success');
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
                <button class="edit-btn" onclick="taskManager.editTask('${task.id}')" title="Editar tarefa">✏️</button>
                <button class="delete-btn" onclick="taskManager.deleteTask('${task.id}')" title="Excluir tarefa">🗑️</button>
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
        // Salvar tarefas com prefixo do usuário e grupo para separar os dados
        localStorage.setItem(`tasks_${this.username}_${this.groupId}`, JSON.stringify(this.tasks));
    }

    loadTasks() {
        // Carregar tarefas específicas do usuário e grupo
        const savedTasks = localStorage.getItem(`tasks_${this.username}_${this.groupId}`);
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
    // Ctrl + Enter para adicionar tarefa (apenas se estiver na tela de tarefas)
    if (e.ctrlKey && e.key === 'Enter' && window.taskManager) {
        taskManager.addTask();
    }
    
    // Escape para limpar o input de tarefa ou voltar aos grupos
    if (e.key === 'Escape') {
        if (window.taskManager) {
            const taskInput = document.getElementById('taskInput');
            taskInput.value = '';
            taskInput.focus();
        } else if (window.groupManager) {
            const groupInput = document.getElementById('groupNameInput');
            groupInput.value = '';
            groupInput.focus();
        }
    }
});