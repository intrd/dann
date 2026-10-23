---
title: "3DSCTF 2016 : crypto100-hotsun"
date: "2017-01-08T16:02:55.000Z"
lastmod: "2017-06-05T15:30:29.000Z"
tags: ["guessing", "cryptography", "3dsctf-2k16", "python", "ctf"]
slug: "3dsctf-2016-crypto100-hotsun"
url: "/3dsctf-2016-crypto100-hotsun/"
---
Surfing in the Shallowweb, we have discovered a new algorithm that promises to be the newest substituition cipher. The algorithm to encrypt works as following: the user informs the text to be encrypted and a number N. Initially, the algorithm shift all letters one position to the right (e.g. 'A' tuns into 'B'). With this result, in the next step, the algorithm now shift the text two positions to the right. And with the text from the previous output, it repeats the shift procedure until N. Your task is quite simple: given an encrypted flag and an N number, discover the flag.   
Encrypted flag: 3RG{hv1g_f0h_1g_b0h_g0_V0h}   
N: 11

Solved by 12 Teams Created by @j3r3mias

## Solution

Well, the chall's desc mention a cipher that shift all letters one position, e.g: A->B until N, and N=11..   
This is known as ROT(n)/Caesar cipher, let's try my Caesar script:

<script src="https://gist.github.com/2c19d329885dfee9fc70c38910394a7d.js"> </script>

![](/content/images/2017/03/Selection_999-044-.png)

bam!

flag: **3DS{CENSORED}**

**Note**: Why i ROTed 1 to 40 if the tip says N=11? Always u use caesar, try to ROT more than tip says.. and do some visual spection looking for the flag, these motherfuckrs love fake tips.
