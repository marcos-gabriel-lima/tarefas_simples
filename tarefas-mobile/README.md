# 📱 Sistema de Tarefas Mobile

Um aplicativo mobile completo para gerenciamento de tarefas pessoais, desenvolvido com tecnologias web modernas e empacotado como APK Android usando Capacitor.

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

### Interface Mobile
- **Design responsivo** otimizado para dispositivos móveis
- **Interface touch-friendly** com botões e elementos adequados
- **Animações suaves** e transições elegantes
- **Notificações toast** para feedback das ações
- **PWA (Progressive Web App)** - pode ser instalado como app nativo
- **Tema moderno** com gradientes e sombras

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com Flexbox e animações
- **JavaScript ES6+** - Lógica da aplicação com classes
- **Capacitor** - Framework para criar apps nativos
- **LocalStorage** - Persistência de dados no dispositivo
- **PWA** - Funcionalidades de aplicativo web progressivo

## 📁 Estrutura do Projeto

```
tarefas-mobile/
├── www/                    # Arquivos web da aplicação
│   ├── index.html         # Página principal
│   └── manifest.json      # Manifesto PWA
├── android/                # Projeto Android nativo
├── src/                    # Código fonte Vue/Quasar (opcional)
├── package.json           # Dependências do projeto
├── capacitor.config.ts    # Configuração do Capacitor
└── README.md             # Este arquivo
```

## 🚀 Como Executar

### 1. Executar como PWA (Recomendado para Teste)
1. **Abra o arquivo** `www/index.html` em qualquer navegador moderno
2. **Registre um usuário** ou faça login se já tiver conta
3. **Comece a gerenciar** suas tarefas!
4. **Instale como PWA**: No Chrome/Edge, clique no ícone de instalação na barra de endereços

### 2. Executar como APK Android

#### Pré-requisitos
- **Android Studio** instalado
- **Android SDK** configurado
- **Java Development Kit (JDK)** instalado
- **Node.js** e **npm** instalados

#### Configuração do Ambiente

1. **Instalar Android Studio**:
   - Baixe em: https://developer.android.com/studio
   - Instale com as configurações padrão

2. **Configurar Android SDK**:
   - Abra Android Studio
   - Vá em `Tools > SDK Manager`
   - Instale o Android SDK (versão 33 ou superior)
   - Anote o caminho do SDK (geralmente: `C:\Users\[usuario]\AppData\Local\Android\Sdk`)

3. **Configurar Variáveis de Ambiente**:
   ```bash
   # Adicione ao PATH do sistema:
   ANDROID_HOME=C:\Users\[usuario]\AppData\Local\Android\Sdk
   PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
   ```

4. **Atualizar arquivo local.properties**:
   ```properties
   sdk.dir=C:\\Users\\[seu-usuario]\\AppData\\Local\\Android\\Sdk
   ```

#### Comandos para Build

```bash
# Instalar dependências
npm install

# Sincronizar com Android
npx cap sync android

# Abrir no Android Studio
npx cap open android

# Ou buildar diretamente
npx cap build android
```

#### Gerando APK no Android Studio

1. **Abra o projeto** no Android Studio:
   ```bash
   npx cap open android
   ```

2. **Configure a assinatura** (opcional para teste):
   - Vá em `Build > Generate Signed Bundle/APK`
   - Escolha `APK`
   - Crie uma chave de debug para testes

3. **Build o APK**:
   - Vá em `Build > Build Bundle(s)/APK(s) > Build APK(s)`
   - O APK será gerado em: `android/app/build/outputs/apk/debug/`

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
- **Dados locais** - Todas as informações ficam armazenadas apenas no dispositivo
- **Separação por usuário** - Cada usuário acessa apenas suas próprias tarefas
- **Validação de entrada** - Prevenção contra caracteres especiais e tamanhos inadequados

## 🎨 Características do Design Mobile

- **Interface otimizada para touch** com elementos grandes e espaçados
- **Cores intuitivas** - azul para ações principais, verde para sucesso, vermelho para exclusão
- **Animações fluidas** para melhor experiência do usuário
- **Layout responsivo** que se adapta a diferentes tamanhos de tela
- **Tipografia clara** com hierarquia visual bem definida
- **Navegação simplificada** para uso com uma mão

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

## 📱 Funcionalidades PWA

- **Instalação nativa** - Pode ser instalado como app no dispositivo
- **Funcionamento offline** - Funciona mesmo sem conexão com internet
- **Notificações push** - Suporte para notificações (futuro)
- **Ícones personalizados** - Ícones específicos para diferentes tamanhos de tela
- **Splash screen** - Tela de carregamento personalizada

## 🚀 Próximas Melhorias

- [ ] Notificações push para lembretes
- [ ] Sincronização em nuvem
- [ ] Categorias de tarefas
- [ ] Prioridades e datas de vencimento
- [ ] Busca e filtros avançados
- [ ] Exportação de tarefas
- [ ] Temas personalizáveis
- [ ] Modo escuro
- [ ] Backup automático

## 🐛 Solução de Problemas

### Erro: "SDK location not found"
- Verifique se o Android SDK está instalado
- Configure a variável ANDROID_HOME
- Atualize o arquivo `android/local.properties`

### Erro: "Gradle build failed"
- Abra o projeto no Android Studio
- Sincronize o projeto: `File > Sync Project with Gradle Files`
- Limpe o projeto: `Build > Clean Project`

### App não instala no dispositivo
- Verifique se a depuração USB está habilitada
- Instale drivers USB do dispositivo
- Verifique se o dispositivo está autorizado para depuração

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de tarefas pessoais em dispositivos móveis**
