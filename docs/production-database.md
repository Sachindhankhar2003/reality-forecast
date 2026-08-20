# Production Database Configuration & Migration Guide

## Dual-Database Architecture
Reality Forecast is configured to run on:
- **Local Development**: SQLite (`file:./dev.db`)
- **Production**: Managed PostgreSQL (*AWS RDS, Supabase, Neon, or Railway*)

## Switch Database Provider for Production

### 1. Update `prisma/schema.prisma`
To deploy to production PostgreSQL, update the `datasource` block:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Set Environment Variable
In production environment settings:
```env
DATABASE_URL="postgresql://user:password@db-host.postgres.database.azure.com:5432/reality_forecast?sslmode=require"
```

### 3. Run Production Migration Commands
```bash
npx prisma migrate deploy
npx prisma generate
```

## Schema Migration Safety Policy
- Never run `prisma db push --force-reset` on production databases.
- Always use `npx prisma migrate dev` in staging and `npx prisma migrate deploy` in production.
