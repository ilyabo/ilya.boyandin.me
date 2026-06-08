# Astro Migration Media Strategy

The migration keeps the existing public media URLs stable while introducing a path for Astro-optimized images.

## Source Control

- Continue tracking large public media files with Git LFS:
  - `public/media/**`
  - `public/assets/**`
- Track future optimized-source media with Git LFS:
  - `src/media/**`

## First Pass

- Do not move the full `public/media` archive.
- Keep PDFs, videos, audio, and raw downloadable assets in `public/media` or `public/assets`.
- Continue serving existing public URLs so old links do not break.
- Use `src/lib/media.ts` to resolve existing preview and Markdown media paths from content entries.

## Future Optimized Media

- Move or copy only first-pass important preview/inline images to `src/media` when the route/UI stages are ready to use Astro `Image` or `Picture`.
- First-pass important pages:
  - `/p/sqlrooms`
  - `/p/flowmap-city`
  - `/p/flowmap.blue`
  - `/p/flowmap.gl`
  - `/p/fsq-spatial-desktop`
  - `/p/fsq-studio`
  - `/p/column-flow`
  - `/p/mapcanv`
  - `/p/flowstrates`
  - `/p/swiss-maps`
  - recent talks

## Resolver Rules

- External URLs pass through unchanged.
- Root-relative URLs pass through unchanged.
- Relative project media resolves to `/media/projects/{slug}/{path}`.
- Relative talk media resolves to `/media/talks/{slug}/{path}`.
- Optimizable image detection is extension-based and currently recognizes AVIF, GIF, JPEG, JPG, PNG, SVG, and WebP.
