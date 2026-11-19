---
kind: project
title: 'Flowmap.gl'
description: 'WebGL library for rendering large origin-destination flow maps in browser-based geospatial applications.'
category: works
preview: swiss-cantons-new.png
date: 2018-07-01
keywords:
  [
    'geo',
    'transport',
    'mobility',
    'flow maps',
    'WebGL',
    'library',
    'open source',
    'graphs',
    'networks',
    'visualization',
    '3D',
  ]
---

<button href="https://flowmap.gl" variant=outline>Project page</button>
<button href="https://flowmap.gl/demo/" variant=outline>Live demo</button>
<button href="https://teralytics.github.io/flowmap.gl/" variant=outline>Early version</button>

[Flowmap.gl](https://flowmap.gl) is a library
for visualizing movement of people (e.g. migration) or objects between
geographic locations:

It provides a GPU-accelerated flow layer for applications that need to render many curved origin-destination links interactively. I originally developed it while working on mobility analytics, where dense movement datasets quickly become too slow or visually cluttered for traditional SVG or canvas rendering.

![Early version of Flowmap.gl](swiss-cantons-new.png)

[![Flowmap.gl](flowmap-gl.jpg)](https://flowmap.gl/demo/)

The library uses WebGL for rendering. It can handle relatively
large numbers of flows with a good rendering performance.
It implements adaptive filtering of the flows and zoom-dependent clustering of the locations:

<embed src="flowmap-gl-globe.mp4" maxwidth=500 title="Flowmap.gl – Globe mode" />

There's also a drawing mode which animates the flow lines. It's an alternative way to represent the flow directions:

<embed src="nl-relocations-animation-lighter.mp4" maxwidth=500 />

Morning and evening peaks:

<embed src="morning-evening-peaks.mp4" maxwidth=500 />
