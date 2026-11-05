# Family Holiday Planner — Static Demo

This branch contains a database-free demo of the Family Holiday Planner, built as a static Next.js export and deployed with GitHub Pages.

## Expected demo URL

https://supermegamine.github.io/Holiday-planner/

The URL becomes available after the first successful Pages deployment.

## Demo behavior

- Sample trips for Copenhagen, Crete, and the Alps, including daily activities.
- Create, edit, and delete trips.
- Open a trip to explore its agenda on mobile or calendar on larger screens.
- Add, edit, and delete activities for each day.
- Data is stored in this browser's `localStorage`; it is never sent to Supabase or a server and is not shared with other visitors.
- On a later visit, trip date ranges and their dated activities roll forward by the elapsed number of days. The relative day-by-day itinerary stays intact.
- Use **Reset sample data** in the banner to restore the built-in sample trips.

There is no database, API server, or runtime backend in this demo. The original Supabase-backed application remains on `main`.

## Deploy

The workflow at `.github/workflows/deploy-demo.yml` builds the Next.js app as a static export and deploys the `out/` directory to GitHub Pages whenever `demo/github-pages` is updated.

One-time setup, if GitHub Pages is not already enabled:

1. Open **Settings → Pages** in the repository.
2. Set the source to **GitHub Actions**.
3. Open **Settings → Environments → github-pages**.
4. Under **Deployment branches and tags**, allow the `demo/github-pages` branch (or allow all branches).
5. Push a commit to `demo/github-pages` or run **Deploy Holiday Planner demo to GitHub Pages** from the Actions tab.

The Next.js configuration uses `/Holiday-planner` as the base path for the repository's project Pages URL.

## Run locally

```bash
npm ci
npm run dev
```

To verify the production export:

```bash
npm run build
npx serve out
```

## Notes

- The dynamic `/holidays/[id]` route is replaced with a static `/holiday/?id=...` route so newly created trips work on static hosting.
- The data store seeds the browser on first visit and preserves user changes in local storage.
- Clearing browser storage resets the demo.
- Sample names, trips, and activities are fictional. Avoid entering personal or sensitive information.
