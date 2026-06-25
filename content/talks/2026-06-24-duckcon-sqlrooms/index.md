---
kind: talk
title: "DuckDB as an analytical runtime: Building local-first analytics apps with SQLRooms"
description: "DuckCon #7 lightning talk about using DuckDB as an analytical runtime for local-first analytics apps and portable SQLRooms project files."
date: 2026-06-24
preview: preview.png
category: talk
---

# DuckDB as an analytical runtime: Building local-first analytics apps with SQLRooms

<button href="https://www.youtube.com/watch?v=sRru2U5Jljc">Video</button>
<button href="https://duckdb.org/events/2026/06/24/duckcon7/" variant=outline>DuckCon page</button>
<button href="/p/sqlrooms" variant=outline>SQLRooms</button>

What if a DuckDB file could contain an entire analytics workspace?

At [DuckCon #7](https://duckdb.org/events/2026/06/24/duckcon7/) in Amsterdam, I gave a short talk about this idea and how we're exploring it in [SQLRooms](/p/sqlrooms).

SQLRooms is an open-source framework for building local-first data analytics apps with DuckDB. It provides building blocks for queries, dashboards, documents, Python cells, AI-assisted analysis, custom artifacts, and application state.

The next experiment is a CLI where one `.db` file can become a portable project file: data, state, and analytical artifacts in one place.

It's still early and experimental, but I think this direction could make it much easier to build and share analytical applications without always needing a server, a hosted BI platform, or a complex deployment setup.

<iframe width="560" height="315" src="https://www.youtube.com/embed/sRru2U5Jljc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
