# Search Console Baseline

Captured from the Search Console screenshots and CSV export provided before the migration work.

## Indexing Summary

- Indexed pages: 7
- Not indexed pages: 127
- Total web search clicks in the visible performance window: 0

## Not Indexed Reasons

- Crawled - currently not indexed: 115 pages
- Page with redirect: 6 pages
- Not found (404): 3 pages
- Discovered - currently not indexed: 3 pages

## Crawled - Currently Not Indexed

- Validation started: 2026-06-03
- Exported issue: `Crawled - currently not indexed`
- Exported affected pages trend:
  - 2026-05-25: 104 pages
  - 2026-05-26: 115 pages
  - 2026-05-27: 115 pages
  - 2026-05-28: 115 pages
  - 2026-05-29: 115 pages
- Example affected URLs:
  - `https://ilya.boyandin.me/`
  - `https://ilya.boyandin.me/p/beer`
  - `https://ilya.boyandin.me/p/d3-bipartite`
  - `https://ilya.boyandin.me/talks/2018-03-06-robot-workshop`
  - `https://ilya.boyandin.me/p/russia-protests`
  - `https://ilya.boyandin.me/talks/2026-04-02-geospatial-serbia-meetup`
  - `https://ilya.boyandin.me/p/cgvis`
  - `https://ilya.boyandin.me/talks/2019-04-03-unibern`
  - `https://ilya.boyandin.me/p/tera-transport`
  - `https://ilya.boyandin.me/talks/2024-09-17-techtalks-foursquare`

## Page With Redirect

- Affected pages: 6
- First detected: 2026-05-26
- Pattern: trailing-slash URLs redirecting to slashless canonical URLs.
- Example affected URLs:
  - `https://ilya.boyandin.me/p/d3-bipartite/`
  - `https://ilya.boyandin.me/p/swiss-maps/`
  - `https://ilya.boyandin.me/p/covid-19/`
  - `https://ilya.boyandin.me/p/flowmap-user-study/`
  - `https://ilya.boyandin.me/talks/2018-07-11-react-meetup/`
  - `https://ilya.boyandin.me/talks/2014-09-16-sichh/`

## Discovered - Currently Not Indexed

- Affected pages: 3
- First detected: 2026-05-30
- Example affected URLs:
  - `https://ilya.boyandin.me/p/column-flow`
  - `https://ilya.boyandin.me/p/romip`
  - `https://ilya.boyandin.me/p/swissinfo-ballot-visualization`

## Migration Implications

- Preserve route parity and slashless canonicals.
- Preserve or improve per-page metadata and sitemap coverage.
- Do not treat trailing-slash redirects as a migration blocker if slashless URLs remain canonical.
- Prioritize stronger text, descriptions, and image alt text for important pages that Google crawled but did not index.
