# Ilya Boyandin's home page

## Media requires git lfs

    git lfs install
    git lfs pull

## Development

    pnpm install
    pnpm dev

## Résumé PDF

The PDF generator reads `content/data/resume.yml` through the same translation,
validation, and Markdown renderer as the website. Install its Python dependency
once (a virtual environment is recommended):

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r scripts/requirements-resume-pdf.txt
pnpm resume:pdf --lang de
pnpm resume:pdf --lang en
```

Files are written to `output/pdf/ilya-boyandin-cv-{de,en}.pdf`. Use `--output`
to choose another destination. The generator automatically uses `.venv/bin/python`
when available, otherwise `python3`. Use `--python path/to/python` to override it.
If you see `ENOENT` for `.venv/bin/python`, create the environment and install
the dependency using the first two commands above.
The application layout uses short experience bullets, four selected earlier
positions, technical expertise, and education. It starts a new page after the
first three current positions; review pagination when changing the content.
Arial is embedded when available on macOS; otherwise the generator embeds
ReportLab's bundled Bitstream Vera fonts.
