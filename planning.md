# Repertório Digital - Igreja Presbiteriana

## Visão Geral

Aplicativo web para gerenciamento do repertório musical de uma igreja presbiteriana, similar ao letras.mus.br, com suporte a letras editadas para adequação teológica, fluxo de aprovação, e autenticação por papéis.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Auth:** NextAuth.js (Auth.js v5) — Credentials + Prisma Adapter
- **UI:** shadcn/ui + Tailwind CSS
- **Deploy:** Vercel
- **Host:** Neon PostgreSQL

## Paleta de Cores (IPB)

| Token | Hex | Uso |
|---|---|---|
| `--color-ipb-green-dark` | `#05321f` | Backgrounds escuros, footer |
| `--color-ipb-green-primary` | `#0e4f35` | Primary, botões principais |
| `--color-ipb-green-muted` | `#7fa596` | Secondary, muted accents |
| `--color-ipb-gold` | `#ce9768` | Accent, destaques |
| Dourado opcional | `#C4A43C` | Detalhes |
| Azul escuro | `#0B2B5E` | Alternativo para header |
| Verde sarça | `#2E7D32` | Call-to-action |
| White | `#FFFFFF` | Background principal |
| Black | `#000000` | Texto |

## Modelo de Dados

### User
- `id` (String, cuid)
- `name` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `role` (Role enum: MEMBER | REVIEWER | ADMIN)
- `createdAt`, `updatedAt`

### Song
- `id` (String, cuid)
- `title` (String)
- `originalTitle` (String?)
- `author` (String)
- `originalAuthor` (String?)
- `lyrics` (String) — versão oficial
- `originalLyrics` (String?) — versão original do compositor
- `observation` (String?) — justificativa teológica da edição
- `tone` (String?) — tom musical
- `hymnNumber` (String?) — numeração no hinário
- `bibleReference` (String?) — referência bíblica
- `status` (SongStatus: PUBLISHED | DRAFT | ARCHIVED)
- `categories` (Many-to-many com Category via SongCategory)
- `videos` (relação com SongVideo)
- `createdBy` (relação com User)
- `createdAt`, `updatedAt`

### Category
- `id` (String, cuid)
- `name` (String, unique) — ex: Abertura, Ceia, Ritmada, Contrição, Oferta, Hinário

### SongCategory
- `songId`, `categoryId` (composite key)

### SongVideo
- `id` (String, cuid)
- `songId` (String)
- `url` (String) — YouTube embed URL
- `label` (String?) — descrição do vídeo
- `createdAt`

### Suggestion
- `id` (String, cuid)
- `type` (SuggestionType: NEW_SONG | EDIT_EXISTING)
- `songId` (String?, opcional — se for edição)
- `title` (String)
- `author` (String)
- `lyrics` (String)
- `tone` (String?)
- `bibleReference` (String?)
- `note` (String?) — observação do sugeridor
- `status` (SuggestionStatus: PENDING | APPROVED | REJECTED)
- `suggestedBy` (String, relação com User)
- `reviewedBy` (String?, relação com User)
- `reviewedAt` (DateTime?)
- `reviewNote` (String?) — parecer do revisor
- `createdAt`, `updatedAt`

### Account & Session (NextAuth)
- Models padrão do PrismaAdapter para sessão e accounts

## Papéis de Usuário

| Role | Ações |
|---|---|
| **MEMBER** | Ver repertório, sugerir músicas |
| **REVIEWER** | Tudo de MEMBER + aprovar/rejeitar/editar sugestões, gerenciar músicas, cadastrar usuários |
| **ADMIN** | Tudo de REVIEWER + gerenciar revisores |

## Fluxo de Sugestão

1. **MEMBER** preenche formulário com título, autor, letra, tom, ref. bíblica
2. Suggestion fica com status `PENDING`
3. **REVIEWER/ADMIN** abre painel de revisão:
   - Vê letra original do sugeridor (read-only, lado esquerdo)
   - Edita a letra se necessário (textarea, lado direito)
   - Preenche `observation` se editou
   - Escolhe categoria(s)
   - Ações: **Aprovar** | **Aprovar com alterações** | **Rejeitar** + motivo
4. Se aprovada: Song é criada/atualizada com lyrics (e originalLyrics se houve edição)
5. Se rejeitada: status REJECTED com reviewNote

## Importação (PPTX)

Script one-time em Node.js que:
1. Lê todos `.pptx` de uma pasta
2. Extrai texto dos slides
3. Usa nome do arquivo como título
4. Cria Suggestions com status PENDING para revisão
5. Não precisa virar feature do app

## Funcionalidades

### Páginas Públicas
- `/` — Homepage: grid de categorias com contagem de músicas
- `/musicas/[id]` — Página da música: letra, tom, ref. bíblica, vídeos embedados, tags de categoria
- `/busca?q=termo` — Resultados de busca (ILIKE + debounce)
- `/auth/login` — Login
- `/auth/register` — (futuro: convite por email)

### Páginas Protegidas (MEMBER+)
- `/sugerir` — Formulário de sugestão de música

### Páginas Protegidas (REVIEWER+)
- `/admin` — Dashboard
- `/admin/sugestoes` — Lista de sugestões (abas: Pendentes/Aprovadas/Rejeitadas)
- `/admin/sugestoes/[id]` — Revisão de sugestão (lado a lado)
- `/admin/musicas` — Gerenciar repertório
- `/admin/musicas/[id]` — Editar música
- `/admin/categorias` — Gerenciar categorias
- `/admin/usuarios` — Gerenciar usuários (criar, definir papel)

## Ideias Futuras

- **Cifras:** Editor de cifras por linha, transposição automática de tom
- **Notificações por email:** Convite para novos membros, notificação de aprovação/rejeição
- **Playlists:** Listas de músicas para cultos específicos
- **Modo offline:** PWA para consultar letras sem internet
- **Histórico de versões:** Ver todas as edições anteriores de uma letra
- **Comentários:** Membros comentarem em músicas (sugestões de tom, correções)
- **Integração com Holyrics:** Exportar repertório para o software de projeção
- **Busca avançada:** pg_trgm para fuzzy matching, busca por trechos de letra
- **Dark mode:** Tema escuro
- **API pública:** Endpoints para consumo por outros apps da igreja
- **App mobile:** React Native ou Expo para acesso nativo
