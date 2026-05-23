# ClassCircle — Free-tier deployment

## Stack

| Layer    | Service (free tier)     |
|----------|-------------------------|
| Frontend | Vercel                  |
| API      | Render or Railway       |
| Database | Neon PostgreSQL         |

## Environment

### Backend (Render/Railway)

Copy `server/.env.example` and set:

- `DATABASE_URL` — Neon connection string
- `JWT_SECRET` — long random string
- `CLIENT_URL` — `https://your-app.vercel.app` (comma-separate multiple origins)
- `PORT` — usually provided by the host (`5000` locally)

### Frontend (Vercel)

Copy `client/.env.example`:

- `NEXT_PUBLIC_API_URL` — public API URL (e.g. `https://your-api.onrender.com`)
- `NEXT_PUBLIC_SOCKET_URL` — same as API URL for Socket.IO

## Docker (VPS / local production)

```bash
docker compose up --build
```

- App: http://localhost:3001
- API: http://localhost:5000
- Postgres: localhost:5432

Set `JWT_SECRET` in the shell or a `.env` file before `docker compose up`.

## Health checks

- API root: `GET /` on the server port
- Uploads served at `/uploads/...` relative paths returned by the API

## Notes

- Set `NODE_ENV=production` on the API so TypeORM `synchronize` is disabled.
- Persist `uploads` volume on Render/Railway or use object storage in a future iteration.
- CORS only allows origins listed in `CLIENT_URL` when that variable is set.
