# Decisions

Architecture decisions for Liftlog, newest at the bottom.

## ADR-001: Hosting and database (2026-11-11)

### Context

Liftlog is a portfolio app with very few users (the author plus a few testers and recruiters).
It should be live permanently and cost close to nothing.
The backend is FastAPI with SQLModel on Postgres; the frontend is a React SPA served by the same container.
The app already runs on Fly.io with `auto_stop_machines = 'stop'`, so it scales to zero when idle.

### Options considered

| Option | Pros | Cons |
|---|---|---|
| **Neon free tier (Postgres)** | Free, scales to zero like the Fly machine, plain Postgres, only `DATABASE_URL` changes | Usage limits, short restore history, cold start after 5 min idle |
| Fly Managed Postgres | Same provider, private network | Tens of dollars per month, far more than the rest of the app |
| SQLite on a Fly volume plus Litestream | Very cheap, no network hop | Pins the app to one machine and volume, extra backup setup, moves away from Postgres |

### Decision

- **Database:** Neon free tier, region `aws-eu-central-1` (Frankfurt).
  Autoscaling fixed to the smallest compute size (min and max), since Liftlog needs no more.
- **App:** Fly.io, region `fra` (Frankfurt), one `shared-cpu-1x` machine with 256 MB.
  App and database in the same city keep each query at about 1 ms instead of 5 to 10 ms from Amsterdam.
- **Machines:** one machine, no redundancy.
  The database is a single instance, so a second app machine adds cost but little availability.
- **Networking:** shared IPv4 plus IPv6, both free (verified with `fly ips list`).

### Expected cost

**Neon:** 0 €.

| Neon resource | Free allowance | Expected use |
|---|---|---|
| Compute | 100 CU-hours per month | About 6 CU-hours (about 25 hours awake at 0.25 CU) |
| Storage | 1 GB per project | About 1 MB per heavy user per year (estimated from the schema) |
| Public network transfer | 5 GB per month | A few MB |
| Restore history | 6 hours, max 1 GB | Not a backup, see risks |

**Fly.io:** about $0.15 per month expected.

| Fly item | Price | Expected |
|---|---|---|
| `shared-cpu-1x` 256 MB running | $0.0030 per hour ($2.19 per month always on) | About 30 hours per month, about $0.09 |
| Stopped machine rootfs | $0.15 per GB per month | About 0.3 GB image, about $0.05 |
| IPv4 and IPv6 | Shared IPv4 and IPv6 are free | $0 |

Worst case: bot traffic keeps the machine running all month, about $2.50 per month.
Fly may waive invoices under $5; not confirmed, verify with the first invoice.

### Capacity

One `shared-cpu-1x` machine handles the expected load easily.
All endpoints are sync `def`, so FastAPI runs them in a thread pool (40 threads by default).
Requests mostly wait on the database, not the CPU.
The first bottleneck would be database connections, not CPU; the pooled Neon connection string is decided in P1-03.

### Limits and risks

- **Compute budget exhaustion:** anything that keeps the database awake (cron job, monitoring ping, a health check that queries the DB) uses about 180 CU-hours per month and exhausts the budget in about 16 days.
  The Fly health check must not query the database (P1-08).
- **Behavior at the compute limit:** to verify whether Neon suspends compute until the next month or bills.
- **Backups:** 6 hours of restore history and 1 manual snapshot are not a backup.
  A bug noticed the next day is outside the window.
  Real backups are planned in P1-16 (for example a nightly `pg_dump`).
- **Cold start:** scale to zero cannot be disabled on Neon, and the Fly machine also stops when idle.
  The first request after a pause waits for both to start; accepted for a portfolio app, measured in P1-08.
- **Monitoring history:** Neon keeps only 1 day, so long-term trends need our own checks.

### Revisit when

- Monthly Neon compute passes 50 CU-hours.
- Database size passes 500 MB (`select pg_size_pretty(pg_database_size(current_database()));`).
- Fly metrics show sustained high CPU, or database connections run out.
- The first Fly invoice is higher than expected.
- Liftlog gets real users beyond the author and testers.

### Exit path

Neon is plain Postgres, so `pg_dump` and `pg_restore` move the data to a paid Neon plan or any other Postgres host.
Only `DATABASE_URL` changes in the app.

### Sources

- Neon pricing and free plan limits: https://neon.com/pricing (checked 2026-11-11)
- Fly.io pricing: https://fly.io/docs/about/pricing/ (checked 2026-11-11)

## ADR-002: Database connection strings (2026-11-12)

### Context

Neon offers two connection strings per branch: a direct one to Postgres and a pooled one (`-pooler` host) through PgBouncer in transaction mode.
The backend uses SQLAlchemy with its own connection pool, which keeps connections open between requests.
Compute is the binding Neon limit (ADR-001), so nothing may keep the database awake.

### What we verified

- **Idle connections do not block scale to zero.**
  An idle open connection was held for 9 minutes, once pooled and once direct; in both cases the compute went from `active` to `idle` after about 5 minutes (tested 2026-11-12 with `neon postgres computes list`).
- **Suspend drops connections**, so the engine uses `pool_pre_ping=True` to replace dead connections instead of failing the first request after a pause.
- **TLS:** both strings use `sslmode=require`; the client connection runs TLS 1.3.
- **Pooled limitations:** transaction mode does not support SQL-level `PREPARE`, session advisory locks, `SET`/`RESET`, `LISTEN`/`NOTIFY` or temporary tables across transactions.
  The app uses none of these; SQLAlchemy with psycopg2 does not use server-side prepared statements.
  Neon recommends direct connections for schema migrations.

### Decision

- **App:** `DATABASE_URL` is the pooled string.
  It caps server connections in PgBouncer, so more app machines or threads cannot exhaust Postgres connections on the small compute.
- **Migrations (Alembic, P1-04):** `DATABASE_URL_UNPOOLED` is the direct string, as Neon recommends, so DDL and any session-level state run on one real Postgres session.
- **SQL logging:** off by default; enabled only with `SQL_ECHO=true` for local debugging.
- **Postgres version:** 18 on Neon and in local Docker, so development matches production.

### Revisit when

- A feature needs `LISTEN`/`NOTIFY`, advisory locks or session settings (use the direct string for that code path).
- The app moves to async SQLAlchemy with asyncpg, which uses prepared statements and needs extra configuration behind PgBouncer.

### Sources

- Neon connection pooling: https://neon.com/docs/connect/connection-pooling (checked 2026-11-12)
- Neon scale to zero: https://neon.com/docs/introduction/scale-to-zero (checked 2026-11-12)
