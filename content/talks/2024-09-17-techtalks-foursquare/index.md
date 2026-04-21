---
kind: talk
title: "TechTalks@Foursquare"
date: 2024-09-17
category: talk
preview: preview.webp
---

# Real-time Collaborative Map Drawing with deck.gl

<button href="https://github.com/ilyabo/mapcanv" variant=outline>GitHub</button>
<button href="https://vimeo.com/1027410793" variant=outline>Video</button>
<button href="https://docs.google.com/presentation/d/1MYJyhuwWawoC4MRmYsPxAwblP1QxNGY6A6l6ogeyvZc/edit?usp=sharing" variant=outline>Slides</button>


Video:

<iframe src="https://player.vimeo.com/video/1027410793" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:100%"></iframe>

I gave this talk at TechTalks@Foursquare on September 17, 2024.

Real-time collaborative apps like Google Docs, Notion, and Figma have set new expectations for seamless teamwork, particularly among distributed teams. These apps have made collaboration feel natural, but building such systems comes with significant technical challenges, particularly around data synchronisation and conflict resolution.

Fortunately, modern tools such as Liveblocks, Replicache and Zerosync, along with conflict-free data structure implementations like Automerge and Yjs, are making it easier to tackle these issues. The highly concurrent Phoenix framework, which powers platforms like Discord and Felt, also plays a crucial role by enabling real-time message exchange between users.

By leveraging some of these technologies, I developed a collaborative GeoJSON editor. In this talk, I share the implementation details using deck.gl, Phoenix, Elixir, and Yjs, delve into real-time messaging, conflict resolution with CRDTs, and scalability, and demonstrate how these modern tools are transforming the way we build real-time, multi-user geo-visualisation applications.


Slides:

<iframe src="https://docs.google.com/presentation/d/1MYJyhuwWawoC4MRmYsPxAwblP1QxNGY6A6l6ogeyvZc/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
