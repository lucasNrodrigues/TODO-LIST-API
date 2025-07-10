API de Gerenciamento de Tarefas (To-Do List)
📖 Sobre o Projeto

Este projeto consiste em uma API RESTful completa para um sistema de gerenciamento de tarefas (To-Do List), desenvolvida como projeto final para a disciplina de Sistemas Distribuídos.

A arquitetura segue o padrão de três camadas (apresentação, negócios e dados) e implementa funcionalidades essenciais de um sistema moderno, incluindo autenticação de usuários, autorização baseada em tokens e operações CRUD (Create, Read, Update, Delete) para listas e tarefas. O objetivo é demonstrar as competências adquiridas na construção de um sistema distribuído robusto, seguro e escalável.
✨ Funcionalidades Principais

    Autenticação de Usuários: Cadastro e Login seguros utilizando senhas criptografadas (bcrypt).

    Autorização com JWT: Geração de JSON Web Tokens no login para proteger rotas e garantir que um usuário só possa acessar seus próprios dados.

    Gerenciamento de Listas: Usuários podem criar, visualizar, atualizar e deletar suas próprias listas de tarefas.

    Gerenciamento de Tarefas: Dentro de cada lista, usuários podem criar, visualizar, atualizar (status, prioridade, etc.) e deletar tarefas.

    Estrutura de Dados Relacional: Utilização do PostgreSQL para garantir a integridade e o relacionamento entre usuários, listas e tarefas.

🚀 Tecnologias Utilizadas

    Backend: Node.js

    Framework: Express.js

    Banco de Dados: PostgreSQL

    Autenticação: JSON Web Tokens (JWT)

    Criptografia de Senhas: Bcrypt.js

    Driver do Banco: node-postgres (pg)

⚙️ Como Executar Localmente

Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento.

Pré-requisitos:

    Node.js (versão 16 ou superior)

    PostgreSQL instalado e rodando.

Passos:

    Clone o repositório:

    git clone https://github.com/lucasNrodrigues/TODO-LIST-API.git
    cd TODO-LIST-API

    Instale as dependências:

    npm install

    Configure as variáveis de ambiente:

        Crie um arquivo chamado .env na raiz do projeto.

        Copie o conteúdo do arquivo .env.example (se houver) ou adicione as seguintes variáveis:

        # URL de conexão com seu banco de dados PostgreSQL local
        DATABASE_URL="postgres://SEU_USUARIO:SUA_SENHA@localhost:5432/SEU_BANCO"

        # Chave secreta para assinar os tokens JWT
        JWT_SECRET="SUA_CHAVE_SECRETA_SUPER_SECRETA"

    Crie as tabelas no banco de dados:

        Conecte-se ao seu banco PostgreSQL.

        Execute o script SQL encontrado em src/database/schema.sql (ou similar) para criar as tabelas users, task_lists e tasks.

    Inicie o servidor:

    # Para desenvolvimento (reinicia automaticamente ao salvar)
    npm run dev

    # Para produção
    npm start

O servidor estará rodando em http://localhost:3333.
Endpoints da API

A seguir estão as principais rotas disponíveis na API. Todas as rotas, exceto /auth, são protegidas e exigem um Bearer Token de autenticação.
Autenticação (/auth)

    POST /auth/register: Registra um novo usuário.

    POST /auth/login: Autentica um usuário e retorna um token JWT.

Listas de Tarefas (/lists)

    POST /lists: Cria uma nova lista de tarefas.

    GET /lists: Retorna todas as listas do usuário logado.

    PUT /lists/:listId: Atualiza uma lista específica.

    DELETE /lists/:listId: Deleta uma lista específica.

Tarefas (/tasks)

    POST /tasks: Cria uma nova tarefa em uma lista.

    GET /tasks/in-list/:listId: Retorna todas as tarefas de uma lista específica.

    PUT /tasks/:taskId: Atualiza uma tarefa específica.

    DELETE /tasks/:taskId: Deleta uma tarefa específica.

👨‍💻 Autor

Lucas Rodrigues

    GitHub: @lucasNrodrigues

    LinkedIn: https://www.linkedin.com/in/lucas-rodrigues-30317b23a/

📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
