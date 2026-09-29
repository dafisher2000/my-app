# App

A React app built with Vite, made in the Integra demo factory.

## Run it

```sh
npm install
npm run dev
```

## Build it

```sh
npm run build
```

The built site is in `dist/`. It is static: any host that serves files can serve it.

## Deploy it

- **Cloudflare:** `npm run build && npx wrangler deploy`. `wrangler.jsonc` serves `dist/` as static assets, and
  answers any unknown path with `index.html`.
- **Vercel:** import the repository at vercel.com/new; Vercel detects Vite. `vercel.json` sends every path to
  `index.html`.
