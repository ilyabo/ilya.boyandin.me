---
kind: project
title: 'MapCanv collaborative map editor'
description: 'Collaborative GeoJSON map editor built with deck.gl, Phoenix, Elixir, and Yjs for real-time shared spatial editing.'
date: '2024-09-01'
category: works
preview: 'mapcanv.png'
---

<button href="https://mapcanv.com">Live demo</button>
<button href="https://github.com/ilyabo/mapcanv" variant=outline>GitHub</button>
<button  variant=outline href="https://www.youtube.com/watch?v=feMRman7iSo&list=PLyspMSh4XhLN1_EQY-_eyg_gs8z3psSJ2&index=17">Talk video</button>

MapCanv is a collaborative GeoJSON editor for drawing, editing, and discussing geographic features together in real time. It is implemented using deck.gl for map rendering, Phoenix and Elixir for the server, and Yjs for conflict-free collaborative state.

The project explores what a shared map editing surface can feel like when it behaves more like a multiplayer document than a traditional GIS file editor. Check [my OpenJS Visualization Summit talk](/talks/2024-09-12-openjs-london) for more details.

I use it as a compact experiment in real-time spatial collaboration: cursors, feature edits, map state, and comments need to stay understandable even when several people work in the same geographic canvas.

![MapCanv collaborative GeoJSON editor](mapcanv.png)
