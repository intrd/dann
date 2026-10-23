---
title: "3DSCTF 2016 : misc100-base3200"
date: "2017-01-08T17:17:37.000Z"
lastmod: "2017-06-05T15:30:05.000Z"
tags: ["3dsctf-2k16", "cryptography", "python", "ctf"]
slug: "3dsctf-2016-misc100-base3200"
url: "/3dsctf-2016-misc100-base3200/"
---
base3200 - One more message sent by R3cursiv3 Hacker was intercepted.   
You challenge is to decode the message and reveal the flag.   
The recovered message is on the attached zip file.

Solved by 89 Teams Created by @ea_sh

## Solution

I received a zip file w/ a giant(45mb) msg.txt

..let's inspect header/footer:

![](/writeups/3dsctf-2k16/misc100-base3200/pasted_image.png)

loooks a true base64..

![](/writeups/3dsctf-2k16/misc100-base3200/pasted_image002.png)

yes, after some `cat msg.txt | base64 --decode >> n.txt`, look at the file size reducing, it is enconded w/ a **recursive base64**, and the title gives the tip

Title=base3200.. **3200/64=50** <- it means, encoded w/ base64 50 times.

Wrote a py to decode 50 times

<script src="https://gist.github.com/c63db7bd3d0951f0653d6fdf7ea169d6.js"> </script>

![](/content/images/2017/03/Selection_999-038-.png)

Flag: **3DS{CENSORED}**
