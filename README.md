# Universal Monorepo Template

A production-ready Copier template for universal apps with Next.js, Expo, and Tauri.

## Tech Stack

- **Web**: Next.js 16 + React 19 + Tailwind CSS 4
- **Mobile**: Expo SDK 54 + React Native 0.81 + NativeWind
- **Desktop**: Tauri 2 (wraps the web app)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: BetterAuth (email, Google, Apple)
- **Payments**: Stripe
- **Monorepo**: Turborepo + Bun workspaces
- **UI**: shadcn/ui components + Storybook

## Quick Start

### Generate a new project

```bash
pipx install copier
copier copy gh:arunbaby0/universal-monorepo-template my-app
cd my-app
bun install
docker compose up -d  # Start PostgreSQL
bun run db:push       # Push schema to database
bun run dev:web       # Start the web app
```

### Template options

| Option | Default | Description |
|--------|---------|-------------|
| `project_name` | (required) | Kebab-case project name |
| `project_description` | "A universal app" | One-liner |
| `include_mobile` | true | Expo mobile app |
| `include_desktop` | false | Tauri desktop app |
| `include_payments` | true | Stripe integration |
| `include_storybook` | true | Storybook |
| `include_sample_entity` | true | Sample "notes" CRUD |
| `auth_providers` | email_google_apple | Auth provider set |

### Update an existing project

```bash
cd my-app
copier update
```

Copier performs a three-way merge so your local changes are preserved.

## Project Structure (generated)

```
my-app/
├── apps/
│   ├── web/           # Next.js web app (always included)
│   ├── mobile/        # Expo app (if include_mobile)
│   └── desktop/       # Tauri app (if include_desktop)
├── packages/
│   ├── api/           # Server-side: auth + stripe
│   ├── db/            # Drizzle ORM schemas + client
│   ├── types/         # Shared TypeScript types
│   ├── ui/            # Shared utilities (cn helper)
│   └── modules/
│       ├── auth/      # useAuth Zustand store
│       ├── profile/   # useProfile store
│       ├── notifications/ # useNotifications + NotificationCenter
│       ├── payments/  # usePayment store (if include_payments)
│       └── notes/     # useNotes store (if include_sample_entity)
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Development

```bash
bun run dev           # All apps in parallel
bun run dev:web       # Web only
bun run dev:mobile    # Mobile only (requires Expo Go)
bun run dev:desktop   # Desktop (start web first)
bun run dev:storybook # Storybook
bun run type-check    # TypeScript checks
bun run build         # Production build
bun run db:studio     # Drizzle Studio (DB browser)
```

## License

MIT
