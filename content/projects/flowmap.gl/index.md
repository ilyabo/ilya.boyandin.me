---
kind: project
title: "Flowmap.gl"
description: "WebGL library for rendering large origin-destination flow maps in browser-based geospatial applications."
category: works
preview: swiss-cantons-new.png
date: 2018-07-01
---

<button href="https://flowmap.gl" variant=outline>Project page</button>

[Flowmap.gl](https://flowmap.gl) is a library
for visualizing movement of people (e.g. migration) or objects between
geographic locations:

It provides a GPU-accelerated flow layer for applications that need to render many curved origin-destination links interactively. I originally developed it while working on mobility analytics, where dense movement datasets quickly become too slow or visually cluttered for traditional SVG or canvas rendering.


![Flowmap.gl](flowmap-gl.jpg)

![Flowmap.gl – Swiss migration flow map](swiss-cantons-new.png)

The library uses WebGL for rendering. Hence, it can handle relatively
large numbers of flows with a good rendering performance:

<embed src="nl-relocations-animation-lighter.mp4" maxwidth=500 />

Morning and evening peaks:

<embed src="morning-evening-peaks.mp4" maxwidth=500 />
