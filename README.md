# Villa Stradale - Next.js

Projeto Next.js otimizado para SEO com React Server Components.

## 🚀 Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com SSR/SSG
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI baseados em Radix UI

### Bibliotecas
- **TanStack Query** - Gerenciamento de estado e cache
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **Supabase** - Backend (quando necessário)

### SEO & Performance
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Metadata API do Next.js
- Sitemap automático (`/sitemap.xml`)
- Robots.txt automático (`/robots.txt`)
- Otimização de imagens com next/image
- Otimização de fontes com next/font

## 📦 Instalação

```bash
npm install
```

## 🔧 Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
├── app/
│   ├── layout.tsx       # Layout raiz com metadata
│   ├── page.tsx         # Homepage
│   ├── globals.css      # Estilos globais
│   ├── sitemap.ts       # Sitemap para SEO
│   └── robots.ts        # Robots.txt
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   └── providers.tsx    # React Query Provider
├── lib/
│   └── utils.ts         # Utilitários (cn, etc)
├── hooks/               # Custom hooks
└── public/              # Arquivos estáticos
```

## 🎨 Componentes UI

Este projeto usa [shadcn/ui](https://ui.shadcn.com/). Para adicionar componentes:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## 🌐 Deploy

### Vercel (Recomendado)

1. Push o código para GitHub/GitLab
2. Conecte o repositório na [Vercel](https://vercel.com)
3. Deploy automático configurado

## 📝 Notas de Desenvolvimento

- Use **Server Components** por padrão (melhor performance e SEO)
- Use **Client Components** (`'use client'`) apenas quando necessário:
  - Hooks do React (useState, useEffect, etc)
  - Event handlers (onClick, onChange, etc)
  - Browser APIs
  - Framer Motion

## 🔗 Links Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
