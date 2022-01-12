---
title: 'One Liner for rimraf that gets the job done'
date: 2021-07-10T06:30:00Z
draft: false
summary: Oneliner to replace rimraf and delete folders/files in a cross-platform way.
categories:
  - programming
tags:
  - snippets
layout: ../../layouts/PostLayout.astro
---

I have been striving to cut down on node_modules. Most of the times, I need rimraf to delete a folder (usually `public`/`dist`/`build`) and to keep the project cross platform. So, here is a one-liner to delete a folder/file:

```shell
node -e "require('fs').rmSync('PATH',{recursive:true,force:true})"
```

Note: Replace `PATH` by the path to the folder/file. This works the same as `rm -rf` command, but cross-platform.
