---
kind: project
title: "Election fraud"
description: "Visualizing traces of fraud in Russian presidential election in 2012 and estimating the amount of fraud."
category: works
tags: [ "Tableau", "D3", "JavaScript" ]
date: 2012-03-13
preview: 2012-orangevaya-zaraza3-crop.png
---

<button href="http://public.tableausoftware.com/views/russian-presidential-elections-2012-map-orange/sheet1?:embed=y">Try live</button>

  The presidential election in 2012 in Russia was clearly fradulent.
  Despite manipulating the results the authorities published very detailed data on the elections
  which made it possible to analyse it and find traces of fraud.

![Vote for Putin in 2012 presidential elections in Russia.](2012-orangevaya-zaraza3-crop.png)

The dark blue dots show polling stations which reported unlikely high votes for Putin:
![](orangevaya-zaraza-large-3.png)


The above visualization was used by the Danish online magazine Europa in [this article](http://translate.google.com/translate?sl=auto&tl=en&js=n&prev=_t&hl=en&ie=UTF-8&u=http%3A%2F%2Fmagasineteuropa.dk%2F%3Fp%3D5544&act=url) (translated from Danish).



## Vote for Putin vs Turnout

Each dot is a polling station, x-axis is the turnout, y-axis is vote for Putin. Here you can see that there is a very high correlation between the turnout (the percentage of people who voted) and the vote for Putin. This correlation is most probably due to the fact that in the polling stations where the turnout was reported as unlikely high votes for Putin were injected.
Anoter anomaly is “the grid pattern”, that is, the higher concentration of reported turnout and vote for Putin around 75, 80, 85, 90, 95%. This is a clear evidence of fraud.

![Vote for Putin in 2012 presidential elections in Russia.](vote-to-turnout-sm.png)


## Estimating the amount of fraud

This simple visualization allows to estimate the amount of fraud by eliminating one of the suspicious anomalies of the vote distribution, namely, the correlation between turnout and vote for Putin. Click for the interactive version:

[![Estimating the amount of fraud in 2012 presidential elections in Russia.](estimate.png)](http://diuf.unifr.ch/people/boyandii/pub/elections/2012/)
