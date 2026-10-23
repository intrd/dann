---
title: "SHX2 : crypto100-ancient_code"
date: "2017-01-30T14:56:58.000Z"
lastmod: "2017-06-05T15:28:30.000Z"
tags: ["ctf", "cryptography", "shx2"]
slug: "shx2-crypto100-ancient_code"
url: "/shx2-crypto100-ancient_code/"
---
We found this strange symbol. Digging for a little more, we also found a paper that can help translate it. Can you help us?

Format: shellter{FLAGHERE}

## Solution

![](/content/images/2017/01/strange-language.jpg)
![](/content/images/2017/01/strange-language-alphabet.jpg)

I started by visually extracting the letters...

![](/content/images/2017/01/Selection_418.jpg)

**Result**: AAAAEMRRNNGTTP

It looks like an anagram.. tried some [online solvers](http://www.anagram-solver.org/?letters=AAAAEMRRNNGTTP) to list some English words and try to figure out..

![](/content/images/2017/01/Selection_445.jpg)

Well, `PENTAGRAM` almost is an anagram of `ANAGRAM`, im sure we will have the word **ANAGRAM** in this sentence.

Fixed `ANAGRAM` letters and left `AERNTTP` to solve..

![](/content/images/2017/03/Selection_999-046-.png)

Thx spell checker..

CENSORED? CENSORED ANAGRAM? make sense..

`AAAAEMRRNNGTTP > CENSORED`

Flag: **shellter{CENSORED}**

### intrd's anagram solver v0.1

After this challenge I ended up writing a py to solve anagrams, I will be updating this as needed..

![](/content/images/2017/03/Selection_999-047-.png)

<script src="https://gist.github.com/intrd/218ed10041f87e6756443934e9344e97.js"></script>
