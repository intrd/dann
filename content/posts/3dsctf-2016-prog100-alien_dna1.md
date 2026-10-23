---
title: "3DSCTF 2016 : prog100-alien_dna1"
date: "2017-01-13T11:18:41.000Z"
lastmod: "2017-06-05T15:29:23.000Z"
tags: ["ctf", "programming", "3dsctf-2k16"]
images: ["/content/images/2017/01/3ds_109.jpg"]
slug: "3dsctf-2016-prog100-alien_dna1"
url: "/3dsctf-2016-prog100-alien_dna1/"
---
Access the server in 54.175.35.248:8001

![](/content/images/2017/01/Selection_569.png)

## Solution

No secret here, we need to figure out the logic behind the correct answer and send it to server. The picture seems more confusing than helping and I doubt there is any relationship with real DNA subtracting.

After some trial and error we understood the logic. Its a simple [set theory](https://en.wikipedia.org/wiki/Set_theory#Basic_concepts_and_notation) exercise.. in ths case **difference** between two sets.

> {C, C, G, T} \ {G, A, G, G} difference is {A, T, C} = 3

My team tried to answer manually but things got worse when hit 50 Stage hahah..

![](/content/images/2017/01/Selection_69s1.png)

So I quickly wrote this script..

<script src="https://gist.github.com/intrd/7831a7e9b6d425f76f974a13db2aedf1.js"></script>

.. and done!

![](/content/images/2017/03/Selection_999-033-.png)
