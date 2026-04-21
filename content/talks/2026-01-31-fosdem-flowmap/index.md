---
kind: talk
title: "FOSDEM 2026: Mobility Flow Visualization"
date: 2026-01-31
preview: preview.webp
category: talk
---

# Scaling Mobility Flow Visualization: Origin-Destination Data with DuckDB, Flowmap.gl, and SQLRooms

<button href="https://video.fosdem.org/2026/k3601/DC9M73-sqlrooms-flowmap.av1.webm">Video</button>
<button href="https://fosdem.org/2026/schedule/event/DC9M73-sqlrooms-flowmap/">FOSDEM page</button>
<button href="/p/flowmap-city" variant=outline>Flowmap City</button>
<button href="/p/sqlrooms" variant=outline>SQLRooms</button>

I gave this talk at [FOSDEM 2026](https://fosdem.org/2026/) in Brussels, in the Railways and Open Transport developer room.

In the talk I showed how to prepare and visualize large origin-destination mobility datasets in the browser using [DuckDB](https://duckdb.org/), [flowmap.gl](https://flowmap.gl/), and [SQLRooms](/p/sqlrooms). The focus was on scaling interactive flow maps to datasets with millions of movements without depending on cloud infrastructure.

I introduced `sqlrooms-flowmap`, a Python tool that prepares OD data for tiled serving with hierarchical clustering, nested Hilbert indexing, and optional spatio-temporal aggregation. The prepared data can then be explored in a browser-based app built with SQLRooms, combining SQL querying with interactive map-based analysis.

For the live demo I used Switzerland's National Passenger Transport Model data and walked through the full pipeline from raw mobility data to an interactive flow visualization. The recording and conference materials are linked from the FOSDEM event page above.

Video:

<video preload="preload" controls="controls" width="75%">
  <source src="https://video.fosdem.org/2026/k3601/DC9M73-sqlrooms-flowmap.av1.webm" type="video/webm; codecs=&quot;av01.0.08M.08.0.110.01.01.01.0&quot;" />
  <source src="https://video.fosdem.org/2026/k3601/DC9M73-sqlrooms-flowmap.mp4" type="video/mp4" />
</video>

The conference materials are linked from the FOSDEM event page above.
