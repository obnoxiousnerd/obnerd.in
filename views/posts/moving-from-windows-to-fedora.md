---
title: Moving from Windows to Fedora
description: An entry discussing the things I did to migrate my laptop from 
  Windows 11 to Fedora.
date: 2022-08-02
updated: 2022-08-05
tags: [fedora, linux]
---

# Motivation

The motives behind this was to

1. Understand my system better (working with UEFI, Secure boot, etc)
2. Simplify my developing experience, as most of my stuff runs on ~~Linux~~ WSL
3. Not send tons of telemetry to Microsoft
4. Make my system configurable to my liking (eg. stuff going on in r/unixporn)

# Fedora test-drive

I downloaded the KDE spin of Fedora 36 since I had some previous memories with
KDE distros in Virtualbox and then live-booted to it. It was exactly what I
thought it would be but KDE was looking overwhelming and less polished (the
defaults) to me. So I then tried out the GNOME one, Fedora 36 Workstation, and
it was pretty much what I'd like to use and be productive daily without spending
days to customize it to my liking. GNOME simply has better UI defaults, IMO. The
one thing I noticed was that Wi-Fi was not behaving normally. The connection
dropped randomly, then the Wi-Fi card would disable and re-enable. I thought
this would need work and moved on. Much much later, I found out that the builtin
kernel drivers for Realtek Wi-Fi cards are
[not the best ones](https://unix.stackexchange.com/questions/690485/realtek-driver-randomly-stops-working)
and that I need a custom one.
Also, no hate for KDE, I like them and their app ecosystem.

# Backups

Before going any further, it was necessary for me to backup my stuff. For my
programming projects, I ran [`npkill`](https://npmjs.com/npkill) to remove
`node_modules` which I don't need in the backup. There was also one Python
project using `venv` which was contributing a big chunk to the backup size. For
that, it received the same treatment except here the `.venv` directory was
removed. I decided to test brotli for backups, and so ran these:

```fish
tar -cvf Programming.tar Programming/
brotli -j Programming.tar
```

Which gives a `Programming.tar.br` and gave decent results compression wise, I'd
say. For backing up keys, I followed a similar procedure. I created the
following directory structure:

```
keys-backup/
├── gpg
└── ssh
```

In `ssh/`, contents of `~/.ssh` were tossed into. For `gpg/`, I followed
[this excellent guide](https://www.jwillikers.com/backup-and-restore-a-gpg-key)
to export my GPG keys. The resulting directory:

```
keys-backup/
├── gpg
│   ├── priv.asc
│   ├── pub.asc
│   └── trustdb.txt
└── ssh
    ├── config
    ├── gh_codespaces.id_ed25519
    ├── gh_codespaces.id_ed25519.pub
    ├── github.id_ed25519
    ├── github.id_ed25519.pub
    ├── id_ed25519
    ├── id_ed25519.pub
    ├── known_hosts
    ├── known_hosts.old
    ├── srht.id_ed25519
    └── srht.id_ed25519.pub
```

This was then converted into a `.tar.br` using the commands used previously.
These `.tar.br` files were then copied to [MEGA](https://mega.io) and a flash
drive.

For pictures and videos, I didn't really had much pictures to backup, most of
them were screenshots that can be safely left behind; didn't need them. I had
videos of some work that I had done in school, so they and the remaining
pictures went into a [7-Zip](https://www.7-zip.org/) archive which was then
transferred to the flash drive.

# Windows recovery drive

I was ready to jump ship, but before that, I decided I would make a Windows
recovery drive, _just in case_. So I ordered
[this flash drive](https://www.flipkart.com/sandisk-ultra-flair-usb-3-0-32-gb-pen-drive/p/itmcf7d79b775c99)
and in the mean time, read up on other things regarding installing Fedora.
After it came, I immediately created a Windows recovery drive on it. It took
almost 16 gigabytes of space and took almost 3 hours to complete. If the
recovery drive isn't used for a long period of time, I will eventually
clean it and start using it for normal usage.

# Decisions to be made

## LUKS

This was a no-brainer, I previously used
[Bitlocker](https://en.wikipedia.org/wiki/BitLocker) with the TPM chip which
came with in my laptop. I also figured out
[Fedora supports LUKS](https://docs.fedoraproject.org/en-US/quick-docs/encrypting-drives-using-LUKS/)
and decided to configure it during the installation.

## Secure Boot

_To secure boot, or not to secure boot, that is the question._

From previous sections, it was clear that I needed to install a custom driver,
and also read that it'd be a little different procedure to install it. To do
this on a secure boot enabled system, you can either

1. Don't secure boot and install the driver
2. Enroll your own keys in the MOK and sign the driver before installing it

[Some sources](https://www.fsf.org/campaigns/campaigns/secure-boot-vs-restricted-boot)
convey that Secure Boot might be one of Microsoft's shenanigans, while
[some](https://superuser.com/a/1368702) suggest legitimate reasons to use it. So turning
to Fedora, its said
[in the docs](https://docs.fedoraproject.org/en-US/fedora/latest/system-administrators-guide/kernel-module-driver-configuration/Working_with_the_GRUB_2_Boot_Loader/#sec-UEFI_Secure_Boot_Support_in_Fedora)
that it supports Secure boot, so time to go ahead. Also,
[one of the "issues"](https://github.com/tomaspinho/rtl8821ce/issues/280)
posted on a [custom Realtek Wi-Fi driver](https://github.com/tomaspinho/rtl8821ce)
I was eyeing, they claimed the driver can be installed on Secure Boot and also
kindly offered advice on how to install it. This all boils down to one
conclusion: not bad at all to install with Secure Boot enabled.

## Dual booting

No. I wanted my full drive for Fedora.

# Installing Fedora

The Fedora Workstation image I previously live-booted from will be the one from
which I can install Fedora. This image was stored in an old Transcend 4GB
JetFlash-400 flash drive which was chilling in dust. For HP laptops, I had to
spam F9 during the boot process to interrupt it and choose a boot device. This
is not similar to changing the boot device order since that changes it
permanently while this is only for the current boot. Nevertheless, I booted to
Fedora successfully and then proceeded with the installation process.

Before proceeding with the install,
[I asked](https://fosstodon.org/web/@retronav/108742362070065915)
folks on the Fediverse if they had some words of advice for me. And they
[didn't](https://fosstodon.org/@mxu/108742493483156516)
[let](https://fosstodon.org/@benjaminhollon/108742861835203831)
[me](https://fosstodon.org/@allinone0/108743085063947317)
down.

Most of what I did is shown in this
[excellent tutorial](https://yewtu.be/watch?v=vNX764kURb8) by Adam Turner, with
a little bit of difference in some steps. I also chose "Custom Storage
Configuration" like Adam does in the video. Since I had a bit of exposure to
data partitions, I made no mistake in yeeting the Windows partitions and
installing a brtfs layout on the whole SSD. There was also an option to encrypt
my drive with LUKS, which I did. With that, it had correctly identified my
keyboard layout and time zone, so was time to begin the installtion. It hardly
took 10 minutes, and after that I was straight into my laptop running Fedora. As
someone who has hardly had exposure to devices running Linux distros bare-metal
IRL, this was unbelieveable for me! Yay!

# Wi-Fi

As I was vibing with my new Fedora installation, curiously checking out the
built-in apps, browsing the internet on Firefox. Ah yes, the point where it all
was meant to break. The builtin driver started its usual shenanigans and I was
no longer able to even ping a domain.

## Installing a custom driver

I had came across lwfinger's excellent
[Wi-Fi driver](https://github.com/lwfinger/rtw88) meant for rtw88 Realtek
network cards. Technically my network card also falls under rtw88, so I decided
to try this one, maybe it will fix the issues I was having. So I followed the
steps for Secure Boot systems given in the README and then rebooted. I confirmed
the driver was active but alas, the problems persisted. I then decided to
uninstall this driver, and this is where I messed up. I'm not sure where it went
wrong, but now I couldn't figure out what to do.

## Installing the other custom driver

Since I had not upgraded the kernel, this was the perfect chance to fix this.
After upgrading the kernel, I then installed 
[Tomás Pinho's driver](https://github.com/tomaspinho/rtl8821ce)
which is
specifically made for Realtek RTL8821CE network card. Following the instructions
given in the README, I was able to install this driver. Minor differences in the
process installation were:

- Installing `kernel-devel` along with `kernel-headers`
- Following the [GitHub issue instructing how to sign the module](https://github.com/tomaspinho/rtl8821ce/issues/280)

I shut down the laptop, came back after some time, and booted it, hoping this
one will solve the issue. And it did! Wi-Fi back to normal, I could now browse
the Internet, run updates, do stuff. Life back to normal.

# More things I did to make stuff work

> I intend this section to be a "living section"; keeping track of things I
> did to make stuff work. This might eventually get moved to a seperate, living
> document.

- Firefox was not playing videos. From the solutions mentioned on
  [this page](https://unix.stackexchange.com/q/690359), installing `ffmpeg`
  did the trick.
- Bring back the
  [system tray](https://extensions.gnome.org/extension/615/appindicator-support/)
  in the top bar.
- Set `snd-hda-intel`'s model to
  [`headset-mic`](https://www.kernel.org/doc/html/latest/sound/hd-audio/models.html)
  via modprobe to make headset mic working again.
- For some reason OBS outputs poor recordings when using the `FFMPEG VAAPI`
  encoder, so to make it print better, albeit more huge recordings, use CQP
  for "Rate Control" with QP=30 (works fine enough for my use case).
