---
kind: talk
title: "DINAcon 2025"
date: 2025-11-18
preview: preview2.webp
category: talk
---

# SQLRooms: Building browser-based AI-assisted analytics apps with DuckDB

<button href="https://dinacon.ch/dinacon-2025/">DINAcon 2025</button>
<button href="https://pretalx.com/dinacon-2025/talk/LTUE93/" variant=outline>Session page</button>
<button href="/p/sqlrooms" variant=outline>SQLRooms</button>

I gave this talk at [DINAcon 2025](https://dinacon.ch/dinacon-2025/) in Bern on Tuesday, November 18, 2025 at 14:10.

The talk focused on [SQLRooms](/p/sqlrooms), a browser-first framework for building analytics applications with [DuckDB](https://duckdb.org/) and React. I showed how far local-first analytics can go without a backend, vendor lock-in, or sending data to third-party servers, while still supporting rich visualisation workflows and AI-assisted exploration.

The session covered several core ideas behind SQLRooms:

- browser-native analytics with DuckDB-WASM over gigabyte-scale datasets
- modular UI building blocks that can be combined with Vega-Lite, Kepler.gl, Cosmos, and custom React components
- agentic AI that can turn natural-language questions into SQL and visualisations fully client-side
- collaborative review workflows with inline discussion around queries, charts, and AI-generated insights

As part of the demo, I used [Flowmap City](/p/flowmap-city) to show Zürich transit flows and to illustrate how SQLRooms components can be mixed and matched into privacy-preserving analytics apps for civic-tech and research use cases.
