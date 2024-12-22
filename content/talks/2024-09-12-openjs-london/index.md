---
kind: talk
title: OpenJS Visualization Summit London
date: 2024-09-12
category: talk
preview: preview.png
---

# Real-Time Collaborative Map Drawing with deck.gl

<button href="https://mapcanv.com">Live demo</button>
<button href="https://github.com/ilyabo/mapcanv" variant=outline>GitHub</button>
<button  variant=outline href="https://www.youtube.com/watch?v=feMRman7iSo&list=PLyspMSh4XhLN1_EQY-_eyg_gs8z3psSJ2&index=17">Video</button>
<button href="https://vimeo.com/1027410793">Video #2</button>
<button href="https://docs.google.com/presentation/d/1MYJyhuwWawoC4MRmYsPxAwblP1QxNGY6A6l6ogeyvZc/edit?usp=sharing" variant=outline>Slides</button>

![MapCanv collaborative map drawing app](mapcanv.png)

In his groundbreaking 1968 presentation, which was later called the "Mother of All Demos", Douglas Engelbart introduced many fundamental technologies which were years ahead of their time but are now common in modern computing.
Engelbart demonstrated the use of windows as a visual interface. It was the first public demonstration of the computer mouse. He showcased a hypertext system that allowed users to link between documents which laid the groundwork for what would eventually become the World Wide Web. He demonstrated early forms of what we now call video conferencing and collaborative editing, where two users could edit the same document in real time.

Engelbart's presentation showed how computers could be used as a communication tool for collaboration, envisioning many of the ways in which we use computers today.
The modern internet's role in teamwork is enormous. People often work in teams and these teams are becoming increasingly distributed. At least since the COVID-19 pandemic remote work is the norm. But despite being available online to anyone at any time, most of web applications do not support real-time collaboration.
When collaborating remotely on the same piece, document, spreadsheet, or code versioning is a major challenge.

Real-time collaborative apps like Google Docs, Notion, and Figma have set new expectations for seamless teamwork, particularly among distributed teams. These apps have made collaboration feel natural, but building such systems comes with significant technical challenges, particularly around data synchronization and conflict resolution. Fortunately, modern tools such as Firebase, Liveblocks, and Replicache, along with conflict-free data structure implementations like Automerge and Yjs, are making it easier to tackle these issues. The highly concurrent Phoenix framework, which powers platforms like Discord and Felt, also plays a crucial role by enabling real-time message exchange between users.

By leveraging these technologies, I developed a collaborative GeoJSON editor. In this talk, I will share the implementation details using deck.gl, Phoenix, Elixir, and Yjs, delve into real-time messaging, conflict resolution with CRDTs, and scalability, and demonstrate how these modern tools are transforming the way we build real-time, multi-user geo-visualization applications.

Video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/feMRman7iSo?si=rOH_ho9EQpPS8OQn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Video 2 (same talk, different venue):

<iframe src="https://player.vimeo.com/video/1027410793" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:100%"></iframe>

Slides:

<iframe src="https://docs.google.com/presentation/d/1MYJyhuwWawoC4MRmYsPxAwblP1QxNGY6A6l6ogeyvZc/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
