---
title: "3DSCTF 2016 : rev100-warmup"
date: "2017-01-08T16:31:22.000Z"
lastmod: "2017-06-05T15:30:21.000Z"
tags: ["reverse engineering", "3dsctf-2k16", "python", "binary patching", "ctf"]
slug: "3dsctf2k16-rev100-warmup"
url: "/3dsctf2k16-rev100-warmup/"
---
Find the flag inside the binary.   
Flag format: "3DS{flag}"

## Solution

Received a file **rev1.rar** w/ a binary(rev1_merces) ELF 32bit

![](/writeups/3dsctf-2k16/rev100-warmup/pasted_image.png)

Strings returned something..

![](/writeups/3dsctf-2k16/rev100-warmup/pasted_image001.png)

Tried this fake flag and some combinations: **3DS{c0ruj0u}**, **3DS{c0ruj0u_te_prende}**.. no success.

Launched radare2 and look for the functions..

```bash
$ radare2 -Ad rev1_merces
```

![](/writeups/3dsctf-2k16/rev100-warmup/pasted_image002.png)

We can see two interesting functions **main**(), **flag**() and the **eip** does not point to **main**() by default, maybe need some args..

![](/writeups/3dsctf-2k16/rev100-warmup/pasted_image003.png)

With some args it runs **main**() and displays the fake flag.. so lets take a look inside **flag**() function

![](/content/images/2017/03/Selection_999-042-.png)

As u can see, its already possible to figure out the flag.

This functions gets the fake flag and add/remove chars, do a lot of shit and return the true flag..

Ok, i've set a breakpoint at entry point **0x08048330** and start doing some jumps reading the **esp** data..

![](/content/images/2017/03/Selection_999-041-.png)

The last one is **0x804842b**, who returned the full flag.

![](/content/images/2017/03/Selection_999-171-.png)

Jumping to the beginning of flag() function **0x804842b** didn't returned the flag.. we need to jump to **0x804842c**

![](/writeups/3dsctf-2k16/rev100-warmup/pasted_image007.png)

Maybe this function generate the full flag break it again then return..

## Patching the binary to always return the flag

Start radare in debug+write mode

```bash
$ radare2 -Adw rev1_merces
```

go to entry point and rewrite it w/ a jmp to that address who return the flag..

![](/writeups/3dsctf-2k16/rev100-warmup/pasted_image012.png)

get out the radare and run the patched program..

![](/content/images/2017/03/Selection_999-170-.png)

All done.

Flag: **3DS{CENSORED}**
