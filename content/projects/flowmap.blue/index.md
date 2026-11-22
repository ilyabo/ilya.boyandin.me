---
kind: project
title: 'FlowmapBlue'
description: 'Free web tool for publishing interactive flow maps from origin-destination data stored in Google Sheets.'
category: works
preview: ny.jpg
orderDate: 2040-01-01
date: 2019-02-05
keywords:
  [
    'geo',
    'transport',
    'mobility',
    'flow maps',
    'migration',
    'Google Sheets',
    'open source',
    'graphs',
    'networks',
    'visualization',
    'UX',
  ]
---

<button href="https://flowmap.blue">Try live</button>
<button href="https://github.com/FlowmapBlue/FlowmapBlue" variant=outline>GitHub</button>

[FlowmapBlue](https://flowmap.blue)
is a free tool for representing aggregated numbers of movements between geographic
locations as flow maps. It is used to visualize urban mobility, commuting behavior,
bus, subway and air travels, bicycle sharing, human and bird migration, refugee flows,
marine traffic, freight transportation, trade, supply chains, scientific collaborations,
epidemiological and historical data and data on many other topics.

The main goal is accessibility: people who are not programmers or GIS specialists can prepare a simple spreadsheet, connect it to FlowmapBlue, and publish an interactive map. The tool handles the visual encoding, map interaction, filtering, clustering, and sharing mechanics that would otherwise require custom development.

The project [won bronze](https://twitter.com/kachkaev/status/1197262339935997952)
at the [Information is Beautiful Awards](https://www.informationisbeautifulawards.com/showcase/3815-flowmap-blue)
in 2019.

![Tweets about FlowmapBlue](flowmap-blue-tweets.png)

## Case study: Alta Flow for transportation planning

[Alta Planning + Design](https://altago.com/) built **Alta Flow** on top of
FlowmapBlue, extending it to show multiple transport modes together and communicate
trip distances. Their team used it to explore travel demand, inform infrastructure
priorities, and prepare maps for grant applications. Alta describes the work and
credits FlowmapBlue in [Tools for Understanding Active Transportation Potential](https://blog.altaplanning.com/tools-for-understanding-active-transportation-potential-9284419c7ad5).

In this episode of **Active Towns**, David Wasserman and Samuel Zneimer explain how
they use the tool, in conversation with host John Simmerman.

<iframe src="https://www.youtube.com/embed/pBn7SyhK-h0?start=395" title="Active Towns: Alta Planning + Design on using Alta Flow" width="640" height="360" loading="lazy" frameborder="0" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>

### Finding opportunities for walking and cycling

For South Orange County, Alta mapped short trips to identify connections with
potential for walking and cycling. Line widths made the strength of connections
visible, helping planners explain investment priorities to decision makers and
residents. As Zneimer puts it, the visualization:

> “really helps us communicate that to the public”
>
> — Samuel Zneimer, [08:47](https://youtu.be/pBn7SyhK-h0?t=527)

### Exploring different travel patterns

Users could select Bay Area counties and switch between modeled walking, cycling,
and short car trips. Unlike a fixed map, the interactive view let them explore
questions by changing the selection:

> “you can show different modes”
>
> — David Wasserman, [12:28](https://youtu.be/pBn7SyhK-h0?t=748)

### Understanding changes in bike-share use

For a Toronto bike-share expansion plan, Alta explored trip distances and geographic
patterns, comparing usage before and during the pandemic:

> “we can also look at 2021 versus 2019 data”
>
> — David Wasserman, [13:12](https://youtu.be/pBn7SyhK-h0?t=792)

The discussion also explores annual versus casual riders. These examples show how
interactive flow maps support both analysis and conversations about what the data
means. Watch the [full interview](https://youtu.be/pBn7SyhK-h0), published May 20, 2022.

![New York Citi Bike trips 2018](ny.jpg)

![BIXI rides Montreal](bixi.jpg)

Until recently making flow maps has involved manual drawing, knowledge of programming or
specialised software.
I had learned from my experience developing
[flow](https://github.com/ilyabo/jflowmap)
[mapping](https://github.com/ilyabo/jflowmap.js)
[libraries](https://github.com/teralytics/flowmap.gl)
that there was a need for an _easy-to-use_ tool with which people without special
knowledge could make flow maps.
This is why I decided to develop flowmap.blue.
The tool makes it possible to publish interactive flow maps from data uploaded to Google Sheets.
It's free, it requires no installation and allows anyone to create a flow map in no time.

<embed src="flowmapblue-brisbane-zoom-anim-4mapbox.mp4">

<embed src="flowmapblue-palermo-anim-4mapbox.mp4">

![Cyclable trips in Waterloo Region](waterloo2.jpg)

<iframe src="https://player.vimeo.com/video/378757494" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:100%"></iframe>
