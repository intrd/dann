---
title: "SHX5 : rev400-again"
date: "2017-03-16T15:37:41.000Z"
lastmod: "2017-06-05T15:27:05.000Z"
tags: ["ctf", "reverse engineering", "shx5"]
images: ["/content/images/2017/03/Selection_018.png"]
slug: "shx5-rev400-again"
url: "/shx5-rev400-again/"
---
Can you reverse it and find the flag?   
Format: shellter{flag_here}   
*Download the binary at <shellterlabs.com>

## Solution

![](/content/images/2017/03/Selection_999-318-.png)

This is a classic keygen challenge, but I will solve it in 3 ways:

1. Disassembling the program, understanding the code and writing a keygen
2. Patching anti-debug protections and dumping the flag from memory
3. Bruteforcing w/ [nozzlr](https://github.com/intrd/nozzlr)

### 1. Writing a keygen

Disassembling the `main`, we can see a call to a function `sub.strlen_7c5` before the last `test` that prints the flag or the error message.

![](/content/images/2017/03/Selection_001.png)

Dumping the registers to retrieve the flag is not possible because this function do some maths w/ our input and return the result. If you try to skip this function it will return something like this `shellter{yourinput}`.

Well, disassembling `sub.strlen_7c5` the first thing we note is this `21 byte` stacked:

![](/content/images/2017/03/Selection_002.png)

..and just below, a `strlen` function retrieving the length of our array = `0x14(20)` following by a loop XOR'ing `0x14(20)` times the first byte `0xd1` w/ every byte of the array!

It's clearly our flag.. let's code this..

<script src="https://gist.github.com/intrd/a1c99739bce352ea0f65c0b42531ce71.js"></script>

![](/content/images/2017/03/Selection_003.png)

### Patching anti-debug protections

So, we just have our flag, but let's try to understand a little bit more about the program..

Strlen reveals the length of the flag `0x14(20)` and start a 20x loop..

![](/content/images/2017/03/Selection_004.png)

..after the XOR, we can see a `cmp` testing if the resulting byte is the same loaded into the `rbp-local_25h`

![](/content/images/2017/03/Selection_005.png)

If `je` is `True` it loops back to test the next byte.. if not, kicks me out and print the message `[!] Peem! Get out of here!!`

If we send any `20len` flag `AAAAAAAAAAAAAAAAAAAA` and set a breakpoint at this `cmp` and dump `rbp-local_25h` content, we will retrieve every byte of our flag.

But its not possible because we have some anti-debug protections.. the first one is found at `init` function

![](/content/images/2017/03/Selection_006.png)

Which do some test detecting any debugger, preventing the program from entering the `main` while debugging.

![](/content/images/2017/03/Selection_007.png)

No problem, we can simple patch the `je` to `jne` and skip this test

![](/content/images/2017/03/Selection_008.png)

..and now the program enters the `main` function

![](/content/images/2017/03/Selection_013.png)

..but theres one more protection after the XOR.. a **time based** protection

![](/content/images/2017/03/Selection_010.png)

..lets skip this too by pathing `jg` to `jle`

![](/content/images/2017/03/Selection_012.png)

Now we can run the program and dump the next `cmp`

![](/content/images/2017/03/Selection_014.png)

`0x42(B)` is our flag first byte stored at `0x7ffebdb0b187`.

To dump all characters at once we will also patch the next `je` to `jne`

![](/content/images/2017/03/Selection_016.png)

..this will avoid exit the program when the next inputed character is invalid.

![](/content/images/2017/03/Selection_015.png)

And now u can easily dump the whole flag :)

### Bruteforcing w/ [nozzlr](https://github.com/intrd/nozzlr)

Now with the patched program, it became easy to launch a bruteforce and read all bytes of the flag independent of the debugger software.

[Nozzlr](https://github.com/intrd/nozzlr) is a bruteforce framework which I developed to perform bruteforces in absolutely any protocol/situation.. In this case i've used my [ARGV bruteforce sample](https://github.com/intrd/nozzlr/blob/1.1/samples/argv_bruteforce.py) and wrote this nozzlr template

<script src="https://gist.github.com/intrd/6f65213b758f4a84bd3c3b399896f77e.js"></script>

Running nozzlr bruteforce..

```bash
$ nozzlr argv_bruteforce.py alphanumdigs.txt 1 --repeats=11 --offset=0
```

![](/content/images/2017/03/rev400.gif)

I'm not showing the rest of the flag.. do it by your own :)
