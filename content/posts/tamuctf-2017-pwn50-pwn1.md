---
title: "TAMUctf 2017 : pwn50-pwn1"
date: "2017-04-24T13:09:09.000Z"
lastmod: "2017-06-05T15:26:31.000Z"
tags: ["ctf", "pwn", "reverse engineering", "tamuctf2k17"]
images: ["/content/images/2017/04/Selection_649.png"]
slug: "tamuctf-2017-pwn50-pwn1"
url: "/tamuctf-2017-pwn50-pwn1/"
---
nc pwn.ctf.tamu.edu 4322   
Can you figure out my secret variable?

### Solution

Well.. there's a 32bit binary, it asks for a secret word and it's vulnerable to buffer overflow

![](/content/images/2017/04/Selection_632.png)

disassembling main() we quickly noticed that program will call `print_flag()` if the variable `local_ch` located @ `ebp-0xc` == `0xca11ab1e`

![](/content/images/2017/04/Selection_636.png)

and the `print_flag()` will open `flag.txt` file and print content for us

![](/content/images/2017/04/Selection_635.png)

> All we need to do is overflow the stack enough to rewrite the `ebp-0xc` w/ the value `0xca11ab1e`

Checking protections..

```
CANARY    : disabled  
FORTIFY   : disabled  
NX        : ENABLED  
PIE       : disabled  
RELRO     : Partial
```

Just `NX` protection found, to avoid us to rewrite return pointer directly to `print_flag()`.

No problem, start by sending `36 bytes(0x24)` of junk to fill the buffer and crash the program..

```bash
gdb$ r <<< $(python -c "print 'A'*36 " )
```

![](/content/images/2017/04/Selection_639.png)

As you can see.. we've filled the buffer and hit the return pointer, but we need to overwrite `ebp-0xc`.

To debug it, set a breakpoint @ `0x80485fd <main+75>: cmp DWORD PTR [ebp-0xc],0xca11ab1e`, now run and dump the `ebp-0xc` value

![](/content/images/2017/04/Selection_641.png)

..our variable is set to `0x0`, send more junk and try to change it

![](/content/images/2017/04/Selection_644.png)

Nice! We have control of this variable.. now set it to `0xca11ab1e`, `\x1e\xab\x11\xca` in little endian..

![](/content/images/2017/04/Selection_647.png)

Done!

If you continue running the program it will print your local `flag.txt` content.

#### Final remote exploit

```bash
python -c 'print "A"*27 + "\x1e\xab\x11\xca"*1 ' | nc pwn.ctf.tamu.edu 4322
```
