---
title: 'Upgrading your Ubuntu LTS distro in WSL'
description: 'A short guide + notes for upgrading your WSL Ubuntu LTS distro'
date: 2022-01-20
tags:
  - wsl
  - notes
---

> Note: This post was written after upgrading my Ubuntu 20.04 LTS, so I don't have any relevant screenshots/logs at the moment. Things are subject to change in the future.

I was configuring my git settings when I realised that git's version was an older one (2.25). So I tried to update, but it didn't do that and instead told that it's already up-to-date. It didn't took long to realise that the newer versions are on the repositories of the newer versions and so I need to upgrade my WSL distro. Here are the steps:

1. Run `sudo do-release-upgrade`
   At this stage you will probably see some error telling you that it couldn't find any release, that is because it is looking for LTS releases but there isn't any (as of writing this), so you need to change some configuration files.
   - Open the `/etc/update-manager/release-upgrades`, and set the `Prompt` from `lts` to `normal` (only do this if you are OK with a non-LTS version). Now you can run the original command again.
2. It will start pulling the repositories of the newest upgradable release. If you notice that the installer is hanging and then terminating, that is because of it trying to start `snap`. So, for the upgrade to proceed, you need to remove `snap`. Don't worry, if you need it, you can install it back after the upgrade ([why is snap even in WSL when it doesn't work by default? ¯\\\_(ツ)\_/¯](https://discourse.ubuntu.com/t/using-snapd-in-wsl2/12113)). Remove the `snap` and `snapd` packages, you'd be good to go.
3. Now follow the prompts. At one point it will ask for permission to restart all services. Grant the permission and let it continue.
4. BOOM! You have upgraded to a newer version! Hope you enjoy your distro with a breath of fresh air.

---

I could find this on [another post](https://www.hughrawlinson.me/posts/2021/06/04/solved-do-release-upgrade-hangs-in-ubuntu-on-wsl) by Hugh Rawlinson, however their Ubuntu's version was 18.04 LTS, but the steps are pretty much the same.
