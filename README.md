# Repertório IPB

Sistema de repertório musical da Igreja Presbiteriana. Gerencia sugestões, aprovações e o catálogo de músicas do ministério de louvor.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Neon em produção, Docker local)
- **ORM:** Prisma 7
- **Auth:** NextAuth v5 (Credentials)
- **UI:** shadcn/ui + Tailwind CSS
- **Fontes:** Newsreader (display) · Source Serif 4 (corpo) · Outfit (UI)

## Funcionalidades

- Catálogo de músicas com letra, tom, referência bíblica e número de hinário
- Busca com suporte a acentos (unaccent + ILIKE)
- Sugestão de novas músicas por membros
- Fluxo de revisão: PENDING → APPROVED / REJECTED
- Edição de músicas existentes com sugestão justificada
- Importação de letras via PPTX
- Papéis: ADMIN, REVIEWER, MEMBER
- Vídeos do YouTube incorporados
- Design editorial/litúrgico com paleta IPB (verde #0e4f35, dourado #ce9768)

## Modelo de dados

```
User (MEMBER | REVIEWER | ADMIN)
  └─ Suggestion (NEW_SONG | EDIT_EXISTING)
       └─ PENDING → revisado por REVIEWER → APPROVED | REJECTED
  └─ Song
       ├─ Category (N:N via SongCategory)
       └─ SongVideo
```

## Começando

### Pré-requisitos

- Node.js 20+
- Docker Desktop (para banco local) ou conta no [Neon](https://neon.tech)

### Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Subir PostgreSQL com Docker
docker compose up -d

# 3. Configurar .env (copie e ajuste)
cp .env.example .env
# Edite DATABASE_URL para apontar para localhost

# 4. Sincronizar schema + seed
npx prisma db push
npx prisma db seed

# 5. Iniciar dev server
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Credenciais de teste (seed)

| Papel | Email | Senha |
|---|---|---|
| ADMIN | admin@ipb.com | 123456 |
| REVIEWER | revisor1..3@ipb.com | 123456 |
| MEMBER | membro1..6@ipb.com | 123456 |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build de produção |
| `npm run seed` | Popular banco com dados de teste |
| `npm run db:push` | Sincronizar schema Prisma |
| `npm run db:studio` | Abrir Prisma Studio |
| `npm run db:migrate` | Criar migration |

## Deploy

Projeto configurado para deploy na Vercel. Variáveis necessárias:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string Neon (com pooler) |
| `AUTH_SECRET` | Gerar com `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | `1` |

Após o deploy, rodar uma vez:

```bash
npx prisma db push
npx prisma db seed
```

## Estrutura

```
├── app/           # Páginas (App Router)
│   ├── admin/     # Área administrativa
│   ├── musicas/   # Detalhe da música
│   ├── busca/     # Busca
│   ├── sugerir/   # Sugestão de música
│   └── auth/      # Login
├── components/    # Componentes reutilizáveis
│   └── ui/        # shadcn/ui
├── lib/           # Prisma, Auth, actions
├── prisma/        # Schema + seed
└── scripts/       # Utilitários (import PPTX, etc.)
```
