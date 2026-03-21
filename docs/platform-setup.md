# Platform Setup

Date: March 21, 2026

## 1. Install Dependencies

```bash
npm install
```

## 2. Create And Link The Vercel Project

Local auth is already working on this machine:

```bash
vercel whoami
```

Create or link the project from this repo root:

```bash
vercel link
```

What to choose:

1. Scope: your `raymo001` account or the team you want.
2. Link to existing project: `No` for a fresh project.
3. Project name: `campaign-studio`
4. Directory: current directory

After linking, Vercel writes `.vercel/project.json`.

Useful follow-up:

```bash
vercel env pull .env.local
```

That pulls any Vercel-managed environment values into your local file without exposing them in git.

## 3. Create And Link The Convex Project

Add Convex to this repo if it is not already initialized:

```bash
npx convex dev
```

What this does:

1. prompts you to log in if needed
2. creates a new Convex project and dev deployment if this repo is not linked yet
3. writes the local Convex config files
4. generates the deployment URL for `NEXT_PUBLIC_CONVEX_URL`

After the initial link:

```bash
npx convex env set VANPELLA_FEED_URL "$VANPELLA_FEED_URL"
npx convex env set VANPELLA_FEED_OWNER_ID "$VANPELLA_FEED_OWNER_ID"
npx convex env set VANPELLA_FEED_TOKEN "$VANPELLA_FEED_TOKEN"
```

Later, when you are ready for production:

```bash
npx convex deploy
```

## 4. Set Up Cloudflare R2

Wrangler is installed, but Cloudflare auth is not active on this machine yet. First authenticate:

```bash
npx wrangler login
```

Confirm account access:

```bash
npx wrangler whoami
```

Create the bucket:

```bash
npx wrangler r2 bucket create vanpella-campaign-studio-assets --location=weur
```

If you want a public delivery domain later:

```bash
npx wrangler r2 bucket domain add vanpella-campaign-studio-assets --domain=assets.studio.vanpella.com
```

Then create an R2 API token in Cloudflare with object read/write permissions and fill:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_R2_BUCKET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_PUBLIC_BASE_URL`

Optional CORS setup once the env vars are filled:

```bash
npm run r2:cors
```

## 5. Local Environment Flow

The project includes:

- `.env.example` for the safe tracked template
- `.env.local` for machine-local secrets and project IDs

Recommended order:

1. fill OpenAI key
2. run `vercel link`
3. run `npx convex dev`
4. log into Cloudflare and create the R2 bucket
5. update `.env.local`
6. restart `npm run dev`

## 6. Git Remote

This repo is intended to push to:

```bash
https://github.com/raymo001/Campaign_studio.git
```

If you ever need to relink it manually:

```bash
git remote add origin https://github.com/raymo001/Campaign_studio.git
git push -u origin main
```
