# 📝 Sistema de Gerenciamento de Tarefas

Um sistema web completo para gerenciamento de tarefas pessoais com autenticação de usuários, desenvolvido com HTML5, CSS3 e JavaScript vanilla.

## 🚀 Funcionalidades

### Autenticação de Usuários
- **Registro de novos usuários** com validação de credenciais
- **Login seguro** com hash de senhas
- **Lista de usuários cadastrados** para facilitar o acesso
- **Logout** com limpeza de sessão
- **Auto-login** para manter sessão ativa

### Gerenciamento de Tarefas
- **Adicionar novas tarefas** com validação de entrada
- **Marcar tarefas como concluídas** com interface intuitiva
- **Excluir tarefas** com confirmação
- **Reiniciar tarefas concluídas** em lote
- **Contadores dinâmicos** de tarefas pendentes e concluídas
- **Separação por usuário** - cada usuário tem suas próprias tarefas

### Interface e Experiência
- **Design responsivo** adaptado para desktop e mobile
- **Animações suaves** e transições elegantes
- **Notificações toast** para feedback das ações
- **Atalhos de teclado** para produtividade
- **Tema moderno** com gradientes e sombras

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com Flexbox e animações
- **JavaScript ES6+** - Lógica da aplicação com classes e módulos
- **LocalStorage** - Persistência de dados no navegador
- **Responsive Design** - Interface adaptável

## 📁 Estrutura do Projeto

```
tarefas/
├── index.html          # Página principal com estrutura HTML
├── script.js           # Lógica JavaScript (UserManager + TaskManager)
├── styles.css          # Estilos CSS responsivos
└── README.md          # Documentação do projeto
```

## 🚀 Como Executar

1. **Clone ou baixe** os arquivos do projeto
2. **Abra o arquivo** `index.html` em qualquer navegador moderno
3. **Registre um usuário** ou faça login se já tiver conta
4. **Comece a gerenciar** suas tarefas!

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Não requer servidor web (funciona localmente)

## 📖 Como Usar

### Primeiro Acesso
1. Digite um nome de usuário (mínimo 3 caracteres, apenas letras, números e underscore)
2. Crie uma senha (mínimo 4 caracteres)
3. Clique em "Registrar" para criar sua conta
4. Faça login com suas credenciais

### Gerenciando Tarefas
- **Adicionar**: Digite a tarefa no campo e pressione Enter ou clique em "Adicionar"
- **Concluir**: Clique no checkbox ao lado da tarefa
- **Excluir**: Clique no botão "Excluir" da tarefa
- **Reiniciar**: Use o botão "🔄 Reiniciar" para voltar todas as tarefas concluídas ao status pendente

### Atalhos de Teclado
- **Enter**: Adicionar tarefa ou fazer login
- **Ctrl + Enter**: Adicionar tarefa rapidamente
- **Escape**: Limpar campo de entrada de tarefa

## 🔒 Segurança e Privacidade

- **Senhas com hash** - Senhas são criptografadas antes do armazenamento
- **Dados locais** - Todas as informações ficam armazenadas apenas no seu navegador
- **Separação por usuário** - Cada usuário acessa apenas suas próprias tarefas
- **Validação de entrada** - Prevenção contra caracteres especiais e tamanhos inadequados

## 🎨 Características do Design

- **Interface moderna** com gradientes e sombras
- **Cores intuitivas** - azul para ações principais, verde para sucesso, vermelho para exclusão
- **Animações fluidas** para melhor experiência do usuário
- **Layout responsivo** que se adapta a diferentes tamanhos de tela
- **Tipografia clara** com hierarquia visual bem definida

## 🔧 Arquitetura do Código

### UserManager
- Gerencia autenticação e sessões de usuários
- Valida credenciais e gerencia registro/login
- Controla navegação entre telas

### TaskManager
- Gerencia tarefas específicas de cada usuário
- Implementa CRUD completo para tarefas
- Mantém contadores e estados atualizados

### Persistência
- Utiliza LocalStorage para manter dados entre sessões
- Separação de dados por usuário usando prefixos
- Backup automático de todas as operações

## 🚀 Próximas Melhorias

- [ ] Categorias de tarefas
- [ ] Prioridades e datas de vencimento
- [ ] Busca e filtros avançados
- [ ] Exportação de tarefas
- [ ] Temas personalizáveis
- [ ] Sincronização em nuvem
- [ ] Notificações push
- [ ] Modo offline aprimorado

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de tarefas pessoais**
