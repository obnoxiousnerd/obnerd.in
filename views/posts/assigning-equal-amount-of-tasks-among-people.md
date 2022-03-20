---
title: 'Assigning equal amount of tasks among people'
description: 'Post about some code that assigns m number of tasks to n people, considering that everyone gets equal amount of tasks.'
date: 2022-02-26
tags:
  - snippets
  - python
---

# Context

So I had this edge-case scenario where I was to assign tasks among the four of us for a video project. We had initially decided to take the tasks numerically, but then I thought, "let's make this randomized". The tasks were equally dividable, and my team members gave in, ergo I created this little script to do the work.

# Finding the right thing to do the job

Obviously, TypeScript is the first option to do this, but the interface for random numbers isn't the most pleasing one for this situation. There's also shell scripts (`fish` is my pick), but I never dealt with random numbers in the command line. So then its Python which will be used to do the job.

## `random.shuffle()`

Checking [this question on StackOverflow](https://stackoverflow.com/a/473983), there was a function in the `random` module of Python to shuffle the lists _in place_. Phew. I thought I was going to write a bunch of more stuff for shuffling the lists and stuff 😅

So the plan was clear, use this function and build code around it and get the job done.

# The script

```python
import random

# Obviously these are not the real names and tasks.
people = ["Jack", "Jamie"]
tasks = [
	"Going for the messages",
	"Water the plants",
	"Check the mailbox",
	"Wash the clothes",
	"Clean the plates",
	"Cook lunch",
]

task_per_person = len(tasks) / len(people)

# This shouldn't continue if the tasks cannot be divided equally. If this
# is the case, then one has to remove some number of tasks to make the
# number correct, or else make a custom solution.
if task_per_person % 1 != 0:
	raise Exception("Tasks cannot be equally divided")

c = 0
for i in range(int(task_per_person)):
	# Shuffling the tasks list is totally optional
	random.shuffle(tasks)
	shuffled = people
	random.shuffle(shuffled)
	for person in shuffled:
		print(f"{tasks[c]} : {person}")
		c += 1

```

## On what would it won't work?

This won't work when the tasks are not equally assignable. For instance. 8 tasks among 4 people is possible, but 7 tasks among 3 isn't. I'll probably write code for this too in the future.

---

<small>The names in the snippet are a reference to an Ed Sheeran's song. Check if you can find out ;)</small>
