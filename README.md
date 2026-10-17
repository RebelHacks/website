# RebelHacks Website

The public RebelHacks website uses a Next.js frontend and a Symfony API. You can work on the homepage without running the API or installing a database. The contact form and API demo need the backend.

New to the team? Start with [developer onboarding](docs/ONBOARDING.md) to install the tools, find your way around the code, and see what to check before a pull request.

## Development setup

Use Node.js 24 and npm for the frontend. Backend work also needs PHP 8.3, its extensions, and Composer 2; installation instructions are in the onboarding guide.

These commands are for a fresh clone. Keep your existing environment files if you already have a working setup. On Windows, run the commands inside Ubuntu/WSL.

### Start the frontend

From the website repository root:

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev -- --port 3000
```

Open **http://localhost:3000**. Keep this terminal running; Ctrl+C stops the server. Editing a homepage component should update the browser automatically.

`NEXT_PUBLIC_API_URL` tells the frontend where to send API requests. The example uses `http://127.0.0.1:8000/api`. Restart the frontend after editing `.env.local`. Visitors can read values beginning with `NEXT_PUBLIC_`, so keep passwords and private keys out of them.

### Start the backend when needed

In another terminal, start from the website repository root:

```bash
cd backend
cp .env.example .env
php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
```

Copy the generated value into `APP_SECRET` in `backend/.env`, replacing the placeholder. Then run:

```bash
composer install
composer check-platform-reqs
php bin/console about
php -S 127.0.0.1:8000 -t public
```

In another terminal, check:

```bash
curl http://127.0.0.1:8000/api/health
```

Expect JSON containing `"status":"ok"`. Open **http://localhost:3000/api-demo** to check a browser request to the backend.

`MAILER_DSN=null://null` turns off email delivery. You can submit the contact form, but it won't send an email. Ask a maintainer for mail-server settings if your task involves sending email.

### Starting again tomorrow

From `website/frontend`, run `npm run dev -- --port 3000`. If your task needs the backend, run `php -S 127.0.0.1:8000 -t public` from `website/backend` in a second terminal. You do not need to copy environment files or reinstall dependencies every day.

## Quick Links

| Path | Purpose |
| --- | --- |
| `frontend/app/page.tsx` | Puts the homepage sections together |
| `frontend/app/components/ui/` | Homepage sections, including tracks and photos |
| `frontend/app/globals.css` | Shared styles and CSS variables |
| `frontend/public/images/` | The site's image files |
| `frontend/lib/api.ts` | Sends requests to the backend |
| `frontend/hooks/` | React hooks for loading API data |
| `backend/src/Controller/` | Handles API requests |
| `backend/src/EventListener/` | Allows the frontend to call the API from a different port |

## Checks before a pull request

From `frontend`, run each check separately:

```bash
npm run lint
npx next typegen
npx tsc --noEmit --incremental false
npm run build
```

There is no `npm test` script. `npm run lint` already reports an error on a fresh clone, so run it once before you start your task: whatever shows up then was there before you. If a check fails, paste its output in the pull request description and say whether it was already failing before your change.

For backend changes, run `composer check-platform-reqs` and `php bin/console lint:container` from `backend`, then try the API route you changed.

Also check the affected page at desktop and mobile widths, use keyboard navigation for interactive elements, and inspect `git diff` before staging files. See the [onboarding guide](docs/ONBOARDING.md#6-before-you-open-a-pull-request) for what to keep out of a commit.

## API reference

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | API status |
| GET | `/api/data` | Sample items |
| GET | `/api/items/{id}` | One sample item |
| POST | `/api/submit` | Demo form submission |
| POST | `/api/contact-email` | Contact form |

## License

See [LICENSE](LICENSE).
