# Daily Vote Dashboard

Live site:
- https://gusoav.github.io/Vote-site/

Public repo:
- https://github.com/gusoav/Vote-site

## Purpose
This is the public read-only dashboard for the daily vote system.

It shows:
- one chart for Mira
- one chart for Gianfranco
- percentages for green / orange / red
- raw vote counts since the tracking start date

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
5. No account credentials or backend source are stored in this public repo.

## Current live behavior
- tracking start: `2026-07-04`
- site is public and safe for GitHub Pages hosting
- the dashboard updates when the private backend publishes a new `votes.json`

## Security posture
This repository is intentionally limited to static public content only.

Not stored here:
- Google Apps Script backend source
- GitHub write-token handling
- email-recipient configuration
- private operational notes

## Notes
- This repo is intended to stay public.
- Backend automation and account-specific integrations are kept outside the public repo.
