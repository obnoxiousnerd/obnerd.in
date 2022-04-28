---
title: 'Assigning unequal amount of tasks among people'
description:
  'Sequel to the previous post; this time with unequal amount of tasks
  for each person.'
date: 2022-04-10
draft: true
tags:
  - experiment
  - snippets
  - lua
---

In a previous [post](/posts/assigning-equal-amount-of-tasks-among-people), we
took a look at how we can randomly assign tasks of equal priority among some
people. But this time, the game is now a bit harder. We have a certain number
of tasks to assign to some people and that number is not divisible to the
number of people.

# Upping the game

Well, this is not really a game, but this one was a bit harder and required
some thinking. This time, we have

- m number of tasks to divide among n people
- m is not divisible by n

To design a model for this task, I've used [Exclalidraw](https://excalidraw.com) to
whip up a drawing real quick, explaining what my plans are.

![An image](TODO)
