# Database Setup

The frontend now talks to Neon via Drizzle ORM. This page summarizes the moving parts so you can regenerate the schema or rotate credentials without spelunking through the codebase.

## Environment variables

Store the following secrets in `frontend/paynote/.env.local` (never commit them):

```bash
DATABASE_URL=postgresql://<user>:<password>@ep-xxx.ap-southeast-2.aws.neon.tech/<db>?sslmode=require
NEON_SHADOW_DATABASE_URL=postgresql://<user>:<password>@ep-shadow-xxx.ap-southeast-2.aws.neon.tech/<db>?sslmode=require
```

`DATABASE_URL` is used at runtime and by Drizzle migrations. `NEON_SHADOW_DATABASE_URL` is optional but recommended when you add a migration that needs a shadow database (generate/push will auto-detect it).

## Tooling

| Command               | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| `npm run db:generate` | Diff the schema in `src/db/schema.ts` and emit SQL into `drizzle/`.                  |
| `npm run db:push`     | Apply the latest SQL to Neon (uses `DATABASE_URL`).                                  |
| `npm run db:studio`   | Open Drizzle Studio for quick inspection.                                            |
| `npm run db:seed`     | Insert the starter organizations + Privy accounts defined in `scripts/seed-neon.ts`. |

`drizzle.config.ts` already loads `.env.local`, so the commands above just work once the env vars exist.

## Schema summary

All auth-related state that previously lived in the in-memory `store.ts` now persists to Postgres:

- `accounts`: Privy user linkage, profile fields, and the default wallet id.
- `organizations`: Workspace metadata (slug, plan, currency).
- `organization_memberships`: Accounts ↔ orgs join table so a user can belong to multiple workspaces later.
- `wallets`: Wallet metadata keyed by normalized address.

Any new columns should be modelled in `src/db/schema.ts` and in the corresponding TypeScript interfaces under `src/types/interfaces/`.

## Development flow

1. Update `src/db/schema.ts`.
2. Run `npm run db:generate` to create a new migration file under `drizzle/`.
3. Review the SQL, then run `npm run db:push` to apply it to Neon.
4. Commit both the schema changes and the new files inside `drizzle/`.
5. (Optional) Run `npm run db:seed` to recreate the default workspace + accounts after a fresh database reset.

If you ever need to inspect data quickly without touching the UI, run `npm run db:studio` and use Drizzle Studio’s browser UI.
