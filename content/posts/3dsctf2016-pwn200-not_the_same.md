---
title: "3DSCTF 2016 : pwn200-not_the_same"
date: "2017-01-20T19:57:26.000Z"
lastmod: "2017-06-05T15:28:58.000Z"
tags: ["3dsctf-2k16", "reverse engineering", "pwn", "python", "buffer overflow", "rop", "ctf"]
slug: "3dsctf2016-pwn200-not_the_same"
url: "/3dsctf2016-pwn200-not_the_same/"
---
A lamer friend ask for your help to exploit a new bin. Can you help him?   
Send to 54.175.35.248 8006   
PS: You dont need shell access to retrieve this flag. The binary have everything.   
PS 2: Send to the server like you would do through netcat. Ex: "cat myexploit | nc 54.175.35.248 8009". The server will handle the input and pass to the binary, greping the flag output (if correct). The server does not accept "\x00" or "\x0a" (and it's not necessary to grab the flag)

Solved by 7 Teams - Created by @fallc0nn

## Solution

Received a 32bit ELF binary(not stripped) that when you run it asks something and exit.

![](/content/images/2017/01/Selection_199.jpg)

### Analyzing and locally cracking

With the binary loaded on **radare2** in analyze/debug mode.

```bash
$ r2 -Ad not_the_same
```

![](/content/images/2017/01/Selection_200.jpg)

We can se a buffer of `0x3c (decimal=60)` allocated, wich certainly can be overflown allowing us to take control of the Return.. but where we will point to get the flag?

![](/content/images/2017/01/Selection_203.jpg)

Searching for the obvious, we can see that the `get_secret()` function is working w/ the string `flag.txt`, probably the filename of the file containing the flag as in the last chall([pwn200-get_started](/3dsctf-2016-rev200-getstarted/)).

Created `flag.txt` file locally w/ random content to try exploit and read it in some way, and start debuggin..

Set a breakpoint at `main() return` and tried to jump directy to `get_secret() 0x080489a0`. It runs but return anything..

![](/content/images/2017/01/Selection_204.jpg)

Ok, put another breakpoint a his `return(0x080489de)`, jumped again and read the `obj.fl4g(0x80eca2d)`.

![](/content/images/2017/01/Selection_205.jpg)

Nice, this address was storing our `flag.txt` content. But, how to print it out without debugger?

Remember that `__printf()` function at `main()` function? This will be our gadget!

![](/content/images/2017/01/Selection_206.jpg)

This function expect 2 vars, reads the second and print out the content.

### Making the exploit

First we need to discover the exact offset to overflow the buffer and take control of the return.

In this case you can do this by trial and error incrementing the number of **a's** until get a **Segmentation fault**:

```bash
...
$ python -c 'print "a"*43' | ./not_the_same
b0r4 v3r s3 7u 4h o b1ch4o m3m0...  
$ python -c 'print "a"*44' | ./not_the_same
b0r4 v3r s3 7u 4h o b1ch4o m3m0...  
$ python -c 'print "a"*45' | ./not_the_same
Segmentation fault
```

**Offset** = `45`

But let's find this offset by the hacker way..

Start **not_the_same** on a looping bash at port **1337**

```bash
$ while true; do nc -nlvp 1337 -e ./not_the_same ; done
```

![](/content/images/2017/01/Selection_207.jpg)

Now start `gdb-peda` and `attach` to the running `pid`

```bash
$ ps x|grep not_the_same
 2810 pts/0    S+     0:00 nc -nlvp 1337 -e ./not_the_same
```

![](/content/images/2017/01/Selection_208.jpg)

`gdb` is watching, let's overflow it..

Generate a offset pattern using `pattern_create.rb` from **Metasploit framework**..

```bash
$ sudo `locate pattern_create.rb` -l 200
```

..and send the generated pattern through port 1337 using `nc -nvv 127.0.0.1 1337`

![](/content/images/2017/01/Selection_209.jpg)

![](/content/images/2017/01/Selection_210.jpg)

**gdb-peda** will show you the address the pattern has broken is `0x41356241`.

Pass this address to `pattern_offset.rb`

```bash
$ sudo `locate pattern_offset.rb` -q 0x41356241
```

![](/content/images/2017/01/Selection_211.jpg)

..and you will get the exact match at `offset 45`.

### Payload structure

1. Send `"a"*45`, 45 bytes to overflow the input buffer leaving some bytes to move the next Return.
2. Move the return to `0x80489a0`, get_secret() address.
3. Move the return to `0x0804f0a0` __printf() address + `AAAA` 4 bytes junk address + `0x80eCa2d` address of `fl4g` to print out.

### Final exploit

<script src="https://gist.github.com/intrd/8927be9893665a26cba6db52f6fb73e0.js"></script>

```bash
$ ./ppwn.py | ./not_the_same
```

![](/content/images/2017/03/Selection_999-029-.png)

The exploit is working locally, now uncomment the remote lines to run through `netcat.py` or simply pipe it through `nc` to get the flag..

```bash
$ ./ppwn.py | nc 54.175.35.248 8006
```

![](/content/images/2017/03/Selection_999-030-.png)

Flag: **3DS{CENSORED}**

### Bonus: Pwntools exploit

<script src="https://gist.github.com/intrd/69a1a084fa1928bd6311fac8152249ef.js"></script>
