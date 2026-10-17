# Developer onboarding

The website is the public event page. The portal handles participant registration, teams, and judging. Each has its own Next.js frontend and Symfony backend.

Start here to install the tools, then follow each repository's README to run it. The later sections show where to find the code and what to check before a pull request.

## 1. Get access and choose your terminal

Ask an organizer for access to the [website](https://github.com/RebelHacks/website) and [portal](https://github.com/RebelHacks/portal) repositories, the issue you will start with, and a reviewer.

### Windows: work inside WSL

Run everything in this guide inside Ubuntu in WSL, including Git, npm, Composer, and MariaDB, and keep the repositories under your Linux home directory, such as `~/code/rebelhacks`. The installation commands below are for Ubuntu 24.04. Ubuntu 22.04 works too, with one extra step that's marked in section 2.

If you don't have WSL yet, run `wsl --install -d Ubuntu-24.04` in PowerShell as administrator. Official references: [install WSL](https://learn.microsoft.com/en-us/windows/wsl/install) and [VS Code with WSL](https://code.visualstudio.com/docs/remote/wsl).

### macOS and Linux

Use your normal terminal. On macOS, install the command-line developer tools if Git is unavailable:

```bash
xcode-select --install
```

On macOS, install [Homebrew](https://brew.sh/) before continuing. Ubuntu users can use the Ubuntu commands below. For another Linux distribution, install the same tools through its package manager.

## 2. Install the development tools

### Git and Node.js

On Ubuntu 24.04, including WSL:

```bash
sudo apt update
sudo apt install git curl ca-certificates build-essential
```

On all three platforms, install nvm using its [official installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating), then reopen your terminal and run:

```bash
nvm install 24
nvm use 24
node --version
npm --version
git --version
```

Expect Node `v24.x`. Both projects use this version. If a new terminal selects another version, run `nvm use 24`. Run npm commands without `sudo`.

### PHP, Composer, and MariaDB

The website's pages only need Node, so if that's all you're working on, you can skip this part and come back when you need it. PHP runs the backends, Composer installs their PHP packages, and MariaDB stores the portal's data.

**Ubuntu / WSL:**

On Ubuntu 22.04 only, add the package source for PHP 8.3 first. Skip this on 24.04:

```bash
sudo apt install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
```

Then, on either version:

```bash
sudo apt install php8.3-cli php8.3-curl php8.3-mbstring php8.3-xml php8.3-zip php8.3-intl php8.3-mysql composer mariadb-server
```

On 22.04 you'll get MariaDB 10.6 instead of 10.11, which works for the portal.

**macOS:**

```bash
brew install php@8.3 composer mariadb@10.11
export PATH="$(brew --prefix php@8.3)/bin:$(brew --prefix mariadb@10.11)/bin:$PATH"
```

Add the `export PATH` line to `~/.zshrc` if you use the default macOS shell. This makes new terminals use PHP 8.3 and MariaDB 10.11.

**Check your tools:**

```bash
php -v
composer --version
mariadb --version
php -r 'var_export(extension_loaded("pdo_mysql")); echo PHP_EOL;'
```

Use PHP 8.3, Composer 2, and MariaDB 10.11 (10.6 on Ubuntu 22.04). The PHP extension check should print `true`.

If Composer reports a missing PHP extension, install that extension for PHP 8.3 and rerun the command.

Official references: [Composer installation](https://getcomposer.org/download/), [Homebrew PHP 8.3](https://formulae.brew.sh/formula/php@8.3), and [Homebrew MariaDB 10.11](https://formulae.brew.sh/formula/mariadb@10.11).

## 3. Clone the repositories

The commands below use HTTPS. Use the SSH URLs instead if that's how you work with GitHub.

```bash
mkdir -p ~/code/rebelhacks
cd ~/code/rebelhacks
git clone https://github.com/RebelHacks/website.git
git clone https://github.com/RebelHacks/portal.git
```

If GitHub reports "Repository not found", check that the Git account you're using has access.

## 4. Run the applications

First follow the [website README](../README.md#development-setup). Then open the portal's `README.md` in your editor or use the [portal setup guide](https://github.com/RebelHacks/portal#development-setup). It shows how to create the database and sign in with a sample account.

| Service | Address | Run commands from |
| --- | --- | --- |
| Website frontend | http://localhost:3000 | `website/frontend` |
| Website API, when needed | http://127.0.0.1:8000/api | `website/backend` |
| Portal frontend | http://localhost:3001 | `portal/frontend` |
| Portal API | http://127.0.0.1:8001/api | `portal/backend` |

Each server needs its own terminal. The ports above let both projects run at the same time.

Each `.env.example` file lists the settings an application needs. The READMEs say which values to fill in.

## 5. Take a short code tour

When a page needs data from the backend:

1. It uses functions in `frontend/lib/api.ts` to send an HTTP request.
2. A PHP controller in `backend/src/Controller/` handles that request.
3. In the portal, the controller can read or update MariaDB using the PHP classes in `backend/src/Entity/`.
4. The backend returns JSON, which the page uses to update what you see.

Start with `website/frontend/app/page.tsx`: it puts the homepage's sections together. Open a component under `app/components/ui/` and its `.module.css` file to see the markup and styles. An import beginning with `@/` starts at the `frontend` directory.

In the portal, start with a page under `frontend/app/`. Look for the API function it calls, then find the PHP controller that handles that URL. Login rules are in `backend/config/packages/security.yaml`. Scripts that create sample users and teams are in `backend/src/DataFixtures/`.

Some useful conventions:

- Match the formatting in the file you're editing, and leave unrelated lines alone.
- Keep each pull request about one task so a teammate can review it.

## 6. Before you open a pull request

Pull requests go from your own branch into `main`, with Nick requested. If `main` has moved since you branched, merge it into your branch first.

Run the frontend checks from `frontend`:

```bash
npm run lint
npx next typegen
npx tsc --noEmit --incremental false
npm run build
```

If a check fails, paste its output in the pull request description and say whether it was already failing before your change. `npm run lint` already reports a few errors on a fresh clone of either project, so run it once before you start: whatever shows up then was there before you. Neither frontend has an `npm test` command.

Check your change in a wide browser window and a narrow one. For forms and buttons, try keyboard navigation, valid input, and invalid input.

In the pull request, describe what changed and how you tested it, and add screenshots of visible changes.

Keep these out of your commit:

- `.env` files containing passwords, private keys, or access tokens.
- Unrevealed track categories, including in comments, branch names, and PR text.
- Unrelated generated files or dependency updates.

Next.js and TypeScript generate files during setup. Some are already in Git: `frontend/.next/types/` in the website, and `frontend/next-env.d.ts` and `frontend/tsconfig.tsbuildinfo` in the portal. Check them in `git diff` before committing. If a file changed only because you ran a setup command, undo the change with `git restore` followed by the file's path, such as `git restore frontend/next-env.d.ts`.

## Common setup problems

| Problem | What to check |
| --- | --- |
| `npm` or `node` not found | Reopen the shell after installing nvm, then run `nvm use 24`. On Windows, do this inside Ubuntu. |
| Port is already in use | Check whether you already have that development server running in another terminal. Use the port assignments above. |
| `apt` cannot locate a PHP 8.3 package | Check `cat /etc/os-release`. On Ubuntu 22.04, do the extra step in section 2 first. On any other release, ask a teammate. |
| A saved edit does not update the browser in WSL | Open the project with `code .` from Ubuntu and check the editor's WSL connection. Keep the repository in the Linux home directory, and check that the development server and browser have finished their initial load. |
| Backend environment variable missing | Create the backend's `.env` from its template before `composer install`. Check whether an old `.env.local` overrides your new settings. |
| Browser shows a network/CORS error | Check that both servers are running. Compare `NEXT_PUBLIC_API_URL` with the backend's address. The backend's CORS settings must include the frontend address you opened in the browser, including `http://` and the port. |
| Google font download fails during build | Check your internet connection and whether your network blocks Google Fonts. |
| Types mention a removed or old route | Stop the dev server, run `npx next typegen`, and retry the type check. Review generated changes before committing. |
| `npm ci` says `package.json` and `package-lock.json` are not in sync | From the repository root, run `git status`. If either file is listed as changed, undo it with `git restore frontend/package.json frontend/package-lock.json` and run `npm ci` again. If neither is listed, tell a maintainer: the copy in the repository needs fixing. |
| `npm ci` reports vulnerabilities and suggests `npm audit fix` | Leave it. `npm audit fix` rewrites `package-lock.json`, which doesn't belong in your pull request. |
| MariaDB or portal login fails | Try the database login command in the portal README, then its sample API login. This helps you find which step is failing. |

### Windows browser cannot reach a WSL server

Try `curl http://localhost:3000` inside Ubuntu for the website, or port `3001` for the portal. If that also fails, check the terminal running the frontend for errors. If it works in Ubuntu but not in your Windows browser, ask a teammate to help check WSL networking. Include the URL you tried and the terminal output.
