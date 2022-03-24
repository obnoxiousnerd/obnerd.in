---
title: I'm moving my blog to Eleventy
description: Long Rambling about why I'm migrating my website to Eleventy.
date: 2022-03-17
tags: [11ty, astro, hugo]
---

You read the title. I've migrated my site over to [Eleventy](https://11ty.dev),
from [Astro](https://astro.build).

# Backstory

First of all, I always wanted to love [Eleventy (or 11ty)](https://11ty.dev).
When I discovered it (in 2020), it was love at first sight, and I wanted to
build my site with it. But that time the project was probably in the beta stage,
which reflected by its 0.x version number. Docs were not arranged good enough
for me, some things required deep understanding of Eleventy. I felt it's
probably not for me at that stage, and then moved on. Then comes
[Hugo](https://gohugo.io). I built my site using Hugo. It was fast, like,
_exceptionally fast_. There were lots of themes/templates to choose from, and I
got my site up within a week. But there was a problem. Hugo basically had very
little opportunities for extensibility. Being written Go, which is a compiled
language, there was no concept of "plugins" for it. Everything had to be done
using scripting. I remember spending an afternoon to write a script to highlight
code blocks using [Shiki](https://github.com/shikijs/shiki). In retrospect, it
did get the job done, but it was still problematic. If I had went on, it'd been
a "script hell" around Hugo to build my site.

# Astro

Then comes Astro, which I got to know about in May of 2021. It was a very young
project, but with a clear vision - to create static sites with on-demand
JavaScript. I quickly got in contact with the awesome people making it, and had
some good time. I decided to re-build my website in Astro. It was a bold move, I
know, making important stuff with beta software is never a good idea. The docs
were written very well, and most of the times the answer was in the docs. And
the people there in the Discord server were always ready to answer my (sometimes
silly) questions. During the process of writing my site in Astro, I had
struggled quite a lot due to bugs, in that process I think I was of much use to
the Astro community because I was helping other people with issues I faced
earlier, reporting bugs on Discord, and sending a couple of pull requests on
GitHub. I also implemented [the draft posts
feature](https://github.com/withastro/astro/releases/tag/astro%400.22.15)(the
`@obnoxiousnerd`'s me btw), of which I feel very proud of myself. Astro's team
also had decided to rewrite their compiler in Go, which they were successful
with. With that I remember finding my website completely broken and then
spending more time fixing it. It was good, the grind was good. They also
selected me for their
[Community Recognition Award, January 2022](https://opencollective.com/astrodotbuild/expenses/63326),
which counts as
my first earning from contributing to open source, of which I am very grateful
of. But, there's a few things which were not fitting quite well with my site
with Astro, which boils down to a few personal preferences and the beta nature
of Astro, as I'm writing this.

## The reasons behind the change

1. Beta software. Now no one here is to be blamed for this, it's always good to
   be a kind of early adopter for new software. Astro, I think, is doing things
   the right way, or to be more precise, the way they should be. Astro,
   [Slinkity](http://slinkity.dev/), [Remix](https://remix.run) are some of the
   newer tools which are doing the web things the right way, ship HTML, with JS
   stepping down as the second-in-line. Doing things the right way takes time,
   and I know it very well. The new compiler in Go unfortunately has some
   bizarre bug which would throw random errors even on files with the correct
   syntax. It was a pain to get things fixed with that.
2. Personal preferences. Astro, like Hugo or Eleventy, does not have
   shortcodes[1] as of now (there will be, I know it, probably I'll implement it
   if I get the chance), which I absolutely like to use. I was not very pleased
   with writing JSX-esque components in my Markdown. Also my way of writing and
   structuring my personal website didn't align with the structure of a typical
   Astro project. My code was getting clunky, and it was time to switch.
   Nunjucks? Boy did I missed it a lot.
3. I like the idea of Webmentions, but I was totally not sure how to implement
   it with Astro. Maybe if someone knows it, they must create a guide for it.

# Back to Eleventy

I was checking on Eleventy after quite a few months now, and looks like they've
released their first stable version! Looking at this, I check out their docs,
this time its well structured and in place, and I just couldn't resist myself
switching to it. Templates, Data files, all that felt like the perfect hole my
plugs were not filing. The structure of my site under Hugo with endless
extensibility, just what I needed. And so here we are, now.

With Astro, my website was still sturctured very good and was very modular, and
that helped me migrate to Eleventy in just two days. Astro's very good, give it
a try!

# The future

So as it stands, I am sticking with Eleventy for now, regarding my website. But
that doesn't mean it's all over for me and Astro. Astro, and its community will
always have a special place in my heart, and I will continue working with Astro
with some of my projects (There is already one in the works, and the folks on
Astro's Discord server know about it 😉). Migrating from Astro does give me a
sense of me betraying Astro, but I hope I'll feel better after rambling about
this. And, I will be writing my Projects page in Astro, because I want some
dynamic things in it without sacrificing static HTML! There you go, yet another
case of extensibility.

[1]: In Astro, shortcodes basically means using a component written in a
framework or Astro's own templating language. I'll implement them if its in
the plans and if I get it done correctly.
