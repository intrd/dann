---
title: "TAMUctf 2017 : pwn200-pwn4"
date: "2017-04-24T14:38:32.000Z"
lastmod: "2017-06-05T15:26:11.000Z"
tags: ["ctf", "pwn", "reverse engineering", "tamuctf2k17"]
slug: "tamuctf-2017-pwn200-pwn4"
url: "/tamuctf-2017-pwn200-pwn4/"
---
nc web.ctf.tamu.edu 4324   
I didn't like echoing inputs anyways.   
(You do not need to get a shell to get the flag)

## Solution

This one was fun.. again you can start by triggering a buffer overflow w/ `11 bytes` of junk

![](/content/images/2017/04/Selection_662.png)

..and you have a `flag_func()` which prints the flag

![](/content/images/2017/04/Selection_663.png)

if you try the obvious.. rewrite the return pointer to it. And it works!

![](/content/images/2017/04/Selection_665.png)

But when u try to retrieve the flag remotely you discover that you've been trolled :)

Ok, let's take a look a little more at the program..

![](/content/images/2017/04/Selection_666.png)

Disassembling the `flag_func()` we can see that the program is reading the contents of the file `flag2.txt` and cat'ing for us:

`Did you really think it would be that easy?`

What we need is the `flag.txt` content. There's some tricks to remove this `2` and `cat` the right flag file, but..

![](/content/images/2017/04/Selection_667.png)

..already there's a string allocated on memory w/ `/bin/cat flag.txt`

So, what our exploit need to do is a basic **ROP**:

- return to `flag_func()`
- force the program to push `0x0804a028` into memory, `/bin/cat flag.txt` the correct cat string.
- passing this string to `system()` located @ `0x080484d9`

**Exploit layout**

```
OVERFLOW + flag_func_ADDRESS + STRING_ADDRESS + SYSTEM_ADDRESS
```

### Final remote exploit

<script src="https://gist.github.com/intrd/786dec9cdcbac342da74eaa3e6abb36d.js"></script>
