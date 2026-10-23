---
title: "AlexCTF 2017 : rev100-c++_is_awesome"
date: "2017-02-11T03:23:00.000Z"
lastmod: "2017-06-05T15:27:43.000Z"
tags: ["ctf", "reverse engineering", "alexctf2k17"]
images: ["/content/images/2017/02/logo_11-3.png"]
slug: "alexctf2k17-rev100-c-_is_awesome"
url: "/alexctf2k17-rev100-c-_is_awesome/"
---
They say C++ is complex, prove them wrong!

## Solution

As always, started by checking binary details/protections..

```python
intrd@inix:~/ctf/alexctf2k17/rev100$ file re2

re2: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.32, BuildID[sha1]=08fba98083e7c1f7171fd17c82befdfe1dcbcc82, stripped

intrd@inix:~/ctf/alexctf2k17/rev100$ python -c 'from pwn import *; elf = ELF("./re2")'

[*] '/home/intrd/ctf/alexctf2k17/rev100/re2'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE
```

..and disabled the `ASLR` protection to stop messing the memory addresses allocated to our program.

```bash
sudo bash -c "echo 0" > /proc/sys/kernel/randomize_va_space
```

The program apparently consists of sending the correct flag as parameter.. otherwise it returns the error message..

```language
intrd@pwn4food /media/sf_ctf/alexctf2k17/rev100# ./re2 asd  
Better luck next time
```

Launched `radare2` w/ a dummy flag `AXXX` and started by debugging the main function.

![](/content/images/2017/02/Selection_626.png)

Searching by the string `Better luck next time` found the function `fcn.00400b56` which is called if this `cmp` fails. Set a breakpoing on it.

It compares `dl` with `al`, where `dl=rdx` and `al=rax`.

### Dumping the registers

![](/content/images/2017/02/Selection_627.png)

It is comparing the first letter of my test flag stored in `rdx` with the `rax` value, possibly the correct letter of the flag.

In this case `rdx=0x41=A` and `rax=0x41=A`, the `cmp` is `true` program loop to compare the next letter..

![](/content/images/2017/02/Selection_629.png)

Continuing the program, now `rdx=0x58=X` and `rax=0x4c=L`, the compare fails because we are using a dummy flag AX.., but now we are sure that the `rax` is really storing the correct letter of the flag.

ALEXCTF uses the flag format `ALEXCTF{}` so we know the first 8 letters, let's grab the next one debugging w/ the payloader `ALEXCTF{X`

![](/content/images/2017/02/Selection_630.png)

As you can see, the program is expecting the `W` letter `0x00000057`, we can continue doing this manually but is painful!

### Bruteforcing the binary

Knowing that the program tests letter by letter of the flag and exits when the letter is wrong we can easily launch a bruteforce.

Used `crunch` to create a wordlist w/ all possible characters..

```bash
intrd@inix:~$ crunch 1 1 "@$,.\!/\'\"1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_{}" -o ~/ctf/alexctf2k17/rev100/1_alphanumsimbs.txt

Crunch will now generate the following amount of data: 148 bytes  
Crunch will now generate the following number of lines: 74  
crunch: 100% completed generating output
```

.. and wrote a pipe bruteforcer script to process it

![](/content/images/2017/02/flag.gif)

<script src="https://gist.github.com/intrd/97a6c1805f1f4604bd8e8d0b0c98092e.js"></script>
