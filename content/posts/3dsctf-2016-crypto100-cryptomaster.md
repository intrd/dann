---
title: "3DSCTF 2016 : crypto100-cryptomaster"
date: "2017-01-08T17:12:50.000Z"
lastmod: "2017-06-05T15:30:13.000Z"
tags: ["ctf", "cryptography", "3dsctf-2k16"]
images: ["/content/images/2017/01/3ds_109-5.jpg"]
slug: "3dsctf-2016-crypto100-cryptomaster"
url: "/3dsctf-2016-crypto100-cryptomaster/"
---
John says that he is the master of his personal server. He created a script that talks to him as if it was his disciple. The problem is that in order to access the server, one needs to know the logic used by the script. Access the server and get the flag.

Server: 54.175.35.248:8002

## Solution

Connected to server through **nc 54.175.35.248 8002**

![](/writeups/3dsctf-2k16/crypto100-cryptomaster/pasted_image002.png)

.. he is asking me to prove that I am his master,
typed "a" and he kickd me out..

Ok, saw that there is an logic for letter substitution, but let's solve this step by the quickest way.. bruteforce!

<script src="https://gist.github.com/ebc6316c792e6734f22e3dde4d1ca683.js"> </script>

![](/writeups/3dsctf-2k16/crypto100-cryptomaster/pasted_image001.png)

Success!

The 1st answer is **Q**, `Q=I`, now let's decrypt the cryptd sentence: `QYMFRUMYGFUHKTWQJRUHG`

What we know?

![](/writeups/3dsctf-2k16/crypto100-cryptomaster/pasted_image003.png)

Create a alphadigits table like this and complete by substitution until figure out the sentence:

![](/content/images/2017/03/Selection_999-040-.png)

flag: **3DS{CENSORED}**
