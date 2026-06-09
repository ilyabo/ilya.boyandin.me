---
kind: project
title: ColumnFlow
description: 'Reusable React component for column-organized node-link graphs such as supply chains, process networks, lineage diagrams, and multipartite relationships.'
date: 2026-05-05
preview: column-flow.webp
---

<button href="https://column-flow.pages.dev">Live example</button>
<button href="https://github.com/ilyabo/column-flow/" variant=outline>GitHub</button>

ColumnFlow is a reusable React component for supply chain visualizations, process networks, lineage views, and other layered or multipartite relationship data where nodes belong to ordered columns and links connect nodes across those columns.

It is visually related to Sankey diagrams, but it does not imply quantitative edge width.

I built it for situations where the layout itself carries meaning: stages in a process, tiers in a supply chain, or ordered groups in a relationship graph. The component handles column layout, curved links, node positioning, and interaction hooks while staying small enough to embed in custom analytical interfaces.

![](column-flow.webp)
