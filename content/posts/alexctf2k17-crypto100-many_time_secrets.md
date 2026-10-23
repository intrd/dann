---
title: "AlexCTF 2017 : crypto100-many_time_secrets"
date: "2017-02-07T13:05:26.000Z"
lastmod: "2017-06-05T15:28:12.000Z"
tags: ["cryptography", "alexctf2k17", "otp", "one time pad", "ctf"]
slug: "alexctf2k17-crypto100-many_time_secrets"
url: "/alexctf2k17-crypto100-many_time_secrets/"
---
CR2: Many time secrets   
This time Fady learned from his old mistake and decided to use onetime pad(OTP) as his encryption technique, but he never knew why people call it one time pad!

## Solution

```bash
Encrypted message:  
0529242a631234122d2b36697f13272c207f2021283a6b0c7908  
2f28202a302029142c653f3c7f2a2636273e3f2d653e25217908  
322921780c3a235b3c2c3f207f372e21733a3a2b37263b313012  
2f6c363b2b312b1e64651b6537222e37377f2020242b6b2c2d5d  
283f652c2b31661426292b653a292c372a2f20212a316b283c09  
29232178373c270f682c216532263b2d3632353c2c3c2a293504  
613c37373531285b3c2a72273a67212a277f373a243c20203d5d  
243a202a633d205b3c2d3765342236653a2c7423202f3f652a18  
2239373d6f740a1e3c651f207f2c212a247f3d2e65262430791c  
263e203d63232f0f20653f207f332065262c3168313722367918  
2f2f372133202f142665212637222220733e383f2426386b
```

So, from Wikipedia:

> In cryptography, the one-time pad (OTP) is an encryption technique that cannot be cracked, but requires the use of a one-time pre-shared key the same size as the message being sent. In this technique, a plaintext is paired with a random secret key (also referred to as a one-time pad). Then, each bit or character of the plaintext is encrypted by combining it with the corresponding bit or character from the pad using modular addition. If the key is truly random, is at least as long as the plaintext, is `NEVER REUSED` in whole or in part, and is kept completely secret, then the resulting ciphertext will be impossible to decrypt or break.

At this challenge, Fady send 11 messages reusing the same private key to encrypt each one.

### What could be wrong?

Let's say you have the image   
![](/content/images/2017/02/GGJpC.gif)

..and you encrypt it by using the binary one-time-pad (XOR-ing on black and white)
![](/content/images/2017/02/HtXag.gif)

..you get the following extremely secure encryption
![](/content/images/2017/02/CqiLY.gif)

Impossible to decrypt this one.. but you encrypt a smiley face with the same one-time-pad   
![](/content/images/2017/02/FR32c.png)

..you get another secure encryption
![](/content/images/2017/02/a1tQa.gif)

But if you have both and you XOR them together   
![](/content/images/2017/02/mTvmW.png)

..then you get the image
![](/content/images/2017/02/0Fktn.gif)

Reusing the same key multiple times is called giving the encryption 'depth' - and it is intuitive that the more depth given, the more likely it is that information about the plaintext is contained within the encrypted text. *(Source: <http://crypto.stackexchange.com/a/108>)*

Knowing this, we just need a script that does the same w/ the 11 messages.

Luckly found this well coded [script](https://github.com/Jwomers/many-time-pad-attack/blob/master/attack.py), changed the ciphers and printed out the privkey:

<script src="https://gist.github.com/intrd/a12e1bb564b1825e864efa2ebeb37874.js"></script>

Summing up.. the script works by passing the 11 messages and selecting one to XOR w/ the each others..

![](/content/images/2017/02/Selection_392.png)

..the result is a almost readable text like this: `cure, Let*M**k*ow if *o{*a`, just fix it manually to `cure, Let Me know if you a` and you will get a fully decrypted text.

The flag is at the private key!

![](/content/images/2017/03/Selection_999-021-.png)

Flag: **ALEXCTF{CENSORED}**
