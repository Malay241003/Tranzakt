# Deploying TranZakt to Render

TranZakt is deployed as **one** free Render web service (the Next.js `user-app`).
The separate `bank-webhook` Express service is **not** deployed — "Add Money" now
credits the wallet directly, so no Postman and no second service are needed.

---

## 0. What you need

- A GitHub repo with this code pushed.
- A hosted PostgreSQL connection string (you said you already have one). It should
  look like:
  ```
  postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
  ```
- A long random string for `JWT_SECRET`. Generate one:
  ```bash
  openssl rand -base64 32
  ```

---

## 1. Apply the database schema (one-time)

From your machine, point Prisma at the hosted DB and apply migrations:

```bash
# PowerShell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
npx prisma migrate deploy --schema packages/db/prisma/schema.prisma
```

> The Render build command below ALSO runs `migrate deploy`, so this step is
> optional — but running it once locally first confirms the connection string
> works before you wait on a deploy.

(Optional) seed two demo users (alice / bob):

```bash
npx prisma db seed --schema packages/db/prisma/schema.prisma
```

---

## 2. Deploy (Blueprint — easiest)

1. Push this repo to GitHub (it includes `render.yaml`).
2. In Render: **New +  →  Blueprint**, pick this repo.
3. Render reads `render.yaml` and asks for the `sync:false` env vars:
   - `DATABASE_URL` → your hosted Postgres URL
   - `JWT_SECRET` → the random string from step 0
   - `NEXTAUTH_URL` → leave blank for now (you'll set it in step 3)
4. Click **Apply**. The first build runs:
   `npm install` → `prisma generate` → `prisma migrate deploy` → `turbo build --filter=docs`.

### Manual setup (if you skip the Blueprint)

Create a **Web Service** from the repo with:

| Setting | Value |
|---|---|
| Runtime | Node |
| Region | Singapore (closest free region to India) |
| Build Command | `npm install && npx prisma generate --schema packages/db/prisma/schema.prisma && npx prisma migrate deploy --schema packages/db/prisma/schema.prisma && npx turbo build --filter=docs` |
| Start Command | `npm run start --workspace=docs` |
| Health Check Path | `/api/health` |
| Env: `NODE_VERSION` | `20` |
| Env: `DATABASE_URL` | your Postgres URL |
| Env: `JWT_SECRET` | random string |
| Env: `NEXTAUTH_URL` | set after step 3 |

> Render automatically sets `PORT`; `next start` listens on it. Don't hardcode a port.

---

## 3. Set `NEXTAUTH_URL` to the live URL

After the first deploy, Render gives the service a URL like
`https://tranzakt.onrender.com`.

1. Go to the service → **Environment**.
2. Set `NEXTAUTH_URL` to that exact URL (no trailing slash).
3. Save → Render redeploys.

Login/signup will not work correctly until this matches the real URL.

---

## 4. Keeping it awake (no spin-down)

Render's free tier sleeps a service after ~15 min with no traffic. This app keeps
itself awake: on boot, `instrumentation.ts` starts a timer that pings its own
`/api/health` **every 10 minutes** (an inbound request resets the idle timer).

- It pings `SELF_PING_URL`, falling back to `NEXTAUTH_URL`, then Render's
  auto-provided `RENDER_EXTERNAL_URL`. So it works even before you set
  `NEXTAUTH_URL`.
- It's disabled locally via `DISABLE_SELF_PING=true` in `apps/user-app/.env`.

**Recommended backup:** the self-ping can't fire if the process ever fully dies
between requests. Add a free external monitor as a safety net:

- [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com)
- URL: `https://YOUR-APP.onrender.com/api/health`
- Interval: every 10 minutes

> Note: free instance hours are ~750/month — about enough for **one** always-on
> service. That's another reason we deploy only the user-app.

---

## 5. Verify

- Open `https://YOUR-APP.onrender.com/api/health` → `{"status":"ok",...}`
- Sign up a new user → dashboard shows **₹1000** starting balance (signup bonus).
- Transfer → **Add Money** (any amount) → balance increases immediately.
- Render logs show `[self-ping] ... -> 200` lines every 10 minutes.

---

## Environment variables reference

| Service | Variable | Purpose |
|---|---|---|
| user-app | `DATABASE_URL` | Postgres connection (Prisma) |
| user-app | `JWT_SECRET` | Signs NextAuth session JWTs |
| user-app | `NEXTAUTH_URL` | Public URL of the app (no trailing slash) |
| user-app | `DISABLE_SELF_PING` | `true` locally; unset/false in prod |
| user-app | `SELF_PING_URL` | Optional explicit keep-alive URL |
| db (local) | `DATABASE_URL` | Same Postgres URL for local Prisma CLI |
