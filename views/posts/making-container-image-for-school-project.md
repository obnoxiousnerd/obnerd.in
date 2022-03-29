---
title: Making a container image for my school python project
description:
  An entry discussing the journey of making a container image for a school
  project using podman and buildah.
date: 2022-03-23
tags: [python, podman, buildah, container, school]
---

# What is this?

This is a simple documentation/journal/story of me trying to create a container
image for my school python project using `podman`/`buildah` for the first time.

I used:

- `podman`: The pick for me because Docker has too many features that I don't
  use.
- `buildah`: Used for making the container image.
- All scripts written in [`fish`](https://fishshell.com) unless specified.

# First steps

I've had experience with Docker but I found `podman` and `buildah` to be more of
the tool I'd like to use. Especially `buildah`; the fact that I can make shell
scripts to build container images really made it look attractive to me.
So the first step definitely was to dig into using both the tools.

## Choosing a base image

**[Spoiler - Bad Idea]**

For me, the go-to image for containers is the Alpine Linux image (due to its
small size), but never did I knew that I will be swapping it out because the
whole thing wouldn't even work at all!

# Making the binary work in the container

So the first steps were to try out my application binary (made using
`pyinstaller`) in the image. So the commands to make it were:

```fish
set id (buildah from --pull alpine)
buildah copy $id ./dist/cli /
buildah run $id -- sh
```

Note that I am jumping into the container's shell because I didn't want
to commit an image right now. Tried to run the binary, only to get

```
sh: ./dist/cli: not found
```

I was initially confused by this error message, but later got to know that this
is a
[common symptom of a dynamic link failure](https://stackoverflow.com/a/66974607)
, which is entirely right, because Alpine Linux uses `musl-libc`, and not
`glibc`, so definitely the glibc libraries will be missing there. After a bit of
searching, I found a
[way to run glibc programs on Alpine linux](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)
. So tried that, and...

```
/ # ./cli --help
Error relocating /tmp/_MEIAdPkMp/libz.so.1: crc32_z: symbol not found
```

So, definitely I was clueless about what to do. So I really had two options:
switch to another image, or not containerise. Fortunately, I picked the
first one - choose a different image.

## Choosing another image

Since the app was working well enough in my Ubuntu 20.04 LTS distro
(WSL by the way), I decided to go for it. Checked the
[20.04 tag](https://hub.docker.com/_/ubuntu?tab=tags&page=1&name=20.04) on the
`ubuntu` image. ~76 MB uncompressed disk size, not bad. So I pulled the image,
slapped the binary in, and tried `./cli --help`, it worked! So I was ready to
do the next.

# Making the PDF generation work in the container

My application uses [Playwright](https://playwright.dev/python) to generate the
report card PDFs, based on a Jinja template filled with data which can be
sourced from different places. So if you go to the website of Playwright, throw
in a few clicks by navigating through the website, you will land here - the page
that tells how to
[install system dependencies](https://playwright.dev/python/docs/cli#install-system-dependencies). So I pulled on a temporary Ubuntu container
and tried to install python3 and pip, but...

```
root@35423fdec4a9:/# apt install -y python3 python3-pip
...
Need to get 72.5 MB of archives.
After this operation, 319 MB of additional disk space will be used.
```

319 MB? Just to install the system dependencies? I was shocked. I decided to
leave this here and instead take a look in the source code of the Playwright CLI
, to figure out how it figures out system dependencies. So after quite a bit of
searching, I landed at this
[nativeDeps.ts file](https://github.com/microsoft/playwright/blob/eaf2507ec1322401e5fb05c976a0d2a4d1c438f9/packages/playwright-core/src/utils/nativeDeps.ts),
which has a list of dependencies required for Playwright to function. Immediately realising this is an TypeScript file, an idea came to my mind. What if we just get the dependencies every time from this file when we start building out image?

## Installing dependencies, the DIY way

If we run playwright without the dependencies installed, we will get something
like this:

```
╔════════════════════════════════════════════════════════════╗
║ Host system is missing a few dependencies to run browsers. ║
║ Please install them with the following command:            ║
║                                                            ║
║     playwright install-deps                                ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```

So I hacked up a little Deno script to fetch the dependencies:

```
deno eval "import {deps} from 'https://raw.githubusercontent.com/microsoft/playwright/main/packages/playwright-core/src/utils/nativeDeps.ts'; console.log(deps['ubuntu20.04']['chromium'].join('\n'));"
```

<small>Cheeky enough, I know 😉. By the way, Deno is used because the source is
a TypeScript file, and I wouldn't like to install several dozen packages on Node
just to get the dependencies list.</small>

And tried installing that in the container but apt decided to greet me with an
error message:

```
E: Unable to locate package <all-the-package-names-seperated-by-a-space>
```

Realising how naïve this was, I tried to look up for solutions to this. One
[solution that particularly stood out](https://unix.stackexchange.com/a/212214)
was somewhat like this:

1. Store the list of dependencies in a file, one item on a line.
2. Using `xargs` to pass the arguments to apt
   So I came up with these lines to do it:

```fish
# Install dependencies
deno eval "import {deps} from 'https://raw.githubusercontent.com/microsoft/playwright/main/packages/playwright-core/src/utils/nativeDeps.ts'; console.log(deps['ubuntu20.04']['chromium'].join('\n'));" > /tmp/deps.txt
buildah copy $id /tmp/deps.txt /tmp
buildah run $id -- xargs -a /tmp/deps.txt apt install -y
```

Which gets those packages installed, claiming ~117 MB of space in the process
(not to shabby, at least better than the previous 319 MB).

## The tzdata prompt problem

While doing the installation, I noticed a prompt popping up:

```
Configuring tzdata

------------------

Please select the geographic area in which you live. Subsequent configuration

questions will narrow this down by presenting a list of cities, representing

the time zones in which they are located.

1. Africa 4. Australia 7. Atlantic 10. Pacific 13. Etc

2. America 5. Arctic 8. Europe 11. SystemV

3. Antarctica 6. Asia 9. Indian 12. US

Geographic area:
```

This was really a disappointment since building container image is supposed to
be an automated process. [Looking up a
solution](https://serverfault.com/a/992421) for this on the Web, I found out
that if I set the `DEBIAN_FRONTEND` environment variable to `noninteractive`, I
can stop the prompt from appearing. But I still need a time zone somehow! There
was another solution for it:

```
buildah config --env TZ=Asia/Kolkata $id
buildah run $id -- ln -snf /usr/share/zoneinfo/\$TZ /etc/localtime
```

<small>Notice the \$TZ. The \$ was to prevent the TZ env from the host to creep
in</small> Running this, gets the job done. No more tzdata prompt in the middle
of an installation, yay!

# Setting up the image's public interface

The first step was to change the working directory, since the app is being
copied to `/app`.

```
buildah config --entrypoint '["/app/cli"]' $id
```

After this, I commit the image and then remove the working container:

```
buildah commit $id rep
buildah rm $id
```

# Building the image

After this, I thought the thing was done. So I start the process of building the
image and leave the machine alone for some time. After the build was done, I
tried to run the image just to see that everything is working.

```
podman run -it --rm localhost/rep
```

And I see a very, very peculiar error:

```
Usage: cli [OPTIONS] COMMAND [ARGS]...
Try 'cli --help' for help.

Error: No such command 'bash'.
```

But I didn't pass bash as a parameter! However, digging in the logs, I see a
line:

```
WARN[0000] cmd "bash" exists and will be passed to entrypoint as a parameter
```

Some more "looking up" and I get to know that I have not set the `cmd` key in
the image config[^1]. So I had two attempts to fix it:

1. `buildah config --cmd "" $id`
2. `buildah config --cmd '[""]' $id` But they didn't work. I, getting bonkers
   about not getting a solution, ran `buildah config --cmd '[]' $id` and it
   worked! There was no "bash" being passed as a parameter!

## Running the image

For this one, I use this command to run it:

```
podman run -it --rm -v $PWD/config:/app/config -v $PWD/out:/app/out localhost/rep
```

And it worked flawlessly. I was happy.

## Size of the image

I also took a look at the image size just to see if our efforts have made any
significant effect. So running `podman image ls` gives:

```
REPOSITORY                 TAG         IMAGE ID      CREATED            SIZE
localhost/rep              latest      4c129f4360a0  About an hour ago  494 MB
```

494 MB. Still OK. ~~Could have easily been in the range of 1GB if I would
install Python to install the dependencies.~~ I did that too, here are some
rough figures:

- With Python and pip: 1.1 GB
- With Python and pip, but deleted them afterwards plus ran `apt autoremove`:
  ~580 MB

# Getting attracted to Alpine, again

**SPOILER: BAD IDEA AGAIN! :(**

As I am writing this post, another idea pops up: what if, we bundle the app into
an AppImage bundle, and pop it inside an Alpine container? After all, AppImage
bundles, if done correctly, can run anywhere, even in the scratch container.
Also we could save more storage space. The Ubuntu image still has lots of things
that are of no use to my app and we could, in theory, cut on a lot of bloat. The
general process could be:

1. Figure out the shared libraries of the app and the Playwright-supplied
   Chromium binary.
2. Create an AppImage.
3. Pop it in the `scratch`/`alpine` image ~~Could be a very nice plan to do, but
   not now, its for another day!~~ Figured out the shared libraries using `ldd`,
   I made an AppImage, tried to run it on my host machine, but it failed to
   generate the PDFs. Maybe the Chromium binary was missing a library or two,
   who knows. Later I found a Docker image for [running Chrome in
   Alpine](https://hub.docker.com/r/zenika/alpine-chrome) and thought of trying
   it out. But first, I checked the image size, it was 282.18 MB compressed. If
   I consider the compression ratio to be about as half, that, plus, my binary,
   the total storage space would be well over the current image size. Not worth
   the effort.

# Ending Words

This was really my first time making an image, and it was a fun adventure, span
over the course of a week.

If you are interested about this project,
[check it out here](https://github.com/retronav/rep).

Also, here's a
[direct link](https://github.com/retronav/rep/blob/main/scripts/build-image.fish)
to the script that makes the container image.

[^1]:
    ( https://www.mankier.com/1/buildah-config#--cmd ) Always read your man
    pages when in doubt. It helps. If it doesn't, then you might need to look up
    elsewhere.
