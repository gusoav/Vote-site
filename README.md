# Daily Vote Dashboard

Public site: two pie charts and vote counts only.

## Public files
- `index.html` — dashboard UI
- `styles.css` — styling
- `app.js` — loads `votes.json` and renders charts
- `votes.json` — published vote data consumed by the site

## Public architecture
1. The page reads `votes.json`.
2. The page renders one chart for Mira and one for Gianfranco.
3. No database is used on the public site.
4. No public editing controls are exposed.

## Notes
- This repository is intended to stay safe for public hosting.
- Backend automation and account-specific integrations are kept outside the public repo.
