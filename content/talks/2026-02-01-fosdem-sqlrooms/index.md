---
kind: talk
title: "FOSDEM 2026: SQLRooms and Loro"
date: 2026-02-01
preview: fosdem-sqlrooms.webp
category: talk
---

# SQLRooms: Local-First Analytics with DuckDB, Collaborative Canvas, and Loro CRDT Sync


<button href="https://video.fosdem.org/2026/k3201/FGDCP7-sqlrooms-local-first-analytics-duckdb-loro.av1.webm">Video</button>
<button href="https://fosdem.org/2026/schedule/event/FGDCP7-sqlrooms-local-first-analytics-duckdb-loro/">FOSDEM page</button>
<button href="/p/sqlrooms" variant=outline>SQLRooms</button>


I gave this talk at [FOSDEM 2026](https://fosdem.org/2026/) in Brussels, in the Local-First, sync engines, CRDTs developer room.

The talk focused on [SQLRooms](/p/sqlrooms), our open-source framework for building local-first analytics tools powered by [DuckDB](https://duckdb.org/). I covered how SQLRooms can run entirely in the browser with DuckDB-WASM, or connect to a shared backend running native DuckDB for larger datasets, while still keeping the application architecture local-first.

I also presented our ongoing work on collaborative canvases, notebooks, and dependency tracking between cells, together with CRDT-based sync using [Loro](https://loro.dev/). One of the key ideas is that in analytics apps the data itself does not always need to be synchronized. DuckDB can stay a read-only query engine, while collaboration is handled by syncing the UI state: queries, layouts, annotations, comments, and notebook structure.

Video:

<video preload="preload" controls="controls" width="75%">
  <source src="https://video.fosdem.org/2026/k3201/FGDCP7-sqlrooms-local-first-analytics-duckdb-loro.av1.webm" type="video/webm; codecs=&quot;av01.0.08M.08.0.110.01.01.01.0&quot;" />
  <source src="https://video.fosdem.org/2026/k3201/FGDCP7-sqlrooms-local-first-analytics-duckdb-loro.mp4" type="video/mp4" />
</video>

The conference materials are linked from the FOSDEM event page above.
