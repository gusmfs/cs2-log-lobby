# CS2 Log Lobby - Backend

API backend para o sistema CS2 Log Lobby, construído com Node.js, Express, TypeScript, Prisma e PostgreSQL.

## 🚀 Dependências Instaladas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web para Node.js
- **TypeScript** - Superset tipado do JavaScript
- **Prisma ORM** - ORM moderno para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT (jsonwebtoken)** - Para autenticação
- **Bcrypt** - Para hash de senhas
- **Cors** - Para requisições cross-origin
- **Helmet** - Para cabeçalhos de segurança
- **Morgan** - Para logs HTTP
- **Dotenv** - Para variáveis de ambiente

## 📋 Pré-requisitos

1. **PostgreSQL** instalado e rodando
2. **Node.js** (versão 16 ou superior)

## ⚙️ Configuração

1. **Configure o banco de dados:**
   ```bash
   # Copie o arquivo de template para .env
   cp env.template .env
   
   # Edite o arquivo .env e configure sua string de conexão PostgreSQL
   DATABASE_URL="postgresql://username:password@localhost:5432/cs2_log_lobby?schema=public"
   ```

2. **Gere o cliente Prisma:**
   ```bash
   npm run db:generate
   ```

3. **Execute as migrações (ou push para desenvolvimento):**
   ```bash
   # Para desenvolvimento (sincroniza o schema)
   npm run db:push
   
   # OU para produção (cria migrações)
   npm run db:migrate
   ```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Executar versão buildada
npm start

# Gerenciar banco de dados
npm run db:generate    # Gera o cliente Prisma
npm run db:push        # Sincroniza schema (desenvolvimento)
npm run db:migrate     # Cria e executa migrações
npm run db:studio      # Abre o Prisma Studio (interface visual)
npm run db:seed        # Executa seeds (quando implementado)
```

## 🏗️ Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Controladores da API
│   ├── middlewares/     # Middlewares personalizados
│   ├── routes/         # Definições de rotas
│   ├── services/       # Lógica de negócio
│   ├── types/          # Definições de tipos TypeScript
│   └── index.ts        # Ponto de entrada da aplicação
├── prisma/
│   └── schema.prisma   # Schema do banco de dados
├── dist/               # Arquivos JavaScript compilados
├── package.json        # Dependências e scripts
└── tsconfig.json       # Configuração do TypeScript
```

## 🔐 Autenticação

O projeto está configurado com JWT para autenticação. Para usar:

1. Configure o `JWT_SECRET` no arquivo `.env`
2. Use os helpers de autenticação nos controllers
3. Aplique middlewares de autenticação nas rotas protegidas

## 🗃️ Banco de Dados

O schema inicial inclui:
- **User model** - Para autenticação de usuários

Você pode expandir o schema em `prisma/schema.prisma` e executar migrações conforme necessário.

## 🌐 Endpoints

- `GET /health` - Health check da API
- `GET /api` - Informações básicas da API

## 🔧 Desenvolvimento

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **A API estará disponível em:**
   - Local: `http://localhost:3000`
   - Health Check: `http://localhost:3000/health`

3. **Para visualizar o banco de dados:**
   ```bash
   npm run db:studio
   ```

## 📝 Próximos Passos

1. Implemente os controllers de autenticação
2. Crie middlewares de autorização
3. Desenvolva as rotas da API
4. Configure testes
5. Adicione validação de dados
6. Implemente logs mais robustos
