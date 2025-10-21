# Projeto React + TypeScript + Supabase

Este projeto foi criado com Vite e inclui uma stack moderna para desenvolvimento web.

## 🚀 Stack

- **React 18** com TypeScript
- **Vite** - Build tool e dev server
- **Supabase** - Backend (Auth, Database, Storage)
- **TailwindCSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Query** - Gestão de estado servidor
- **React Router** - Roteamento

## 📦 Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis
│   └── ui/          # Componentes Shadcn
├── pages/           # Páginas da aplicação
├── hooks/           # Custom hooks
├── contexts/        # Context providers (Auth, Theme)
├── services/        # Serviços de API
├── integrations/    # Integrações externas
│   └── supabase/    # Cliente e types do Supabase
├── lib/             # Utilitários
└── types/           # TypeScript types
```

## 🛠️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e adicione suas credenciais do Supabase:

```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Executar o Projeto

```bash
npm run dev
```

## 🔑 Funcionalidades

- ✅ Autenticação com Supabase (Login/Signup)
- ✅ Rotas protegidas
- ✅ Tema claro/escuro
- ✅ React Query configurado
- ✅ TypeScript configurado
- ✅ Aliases de importação (@/)

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🚢 Deploy

Este projeto está pronto para deploy na Vercel:

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Deploy automático a cada push

## 📚 Documentação

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/docs)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/)
