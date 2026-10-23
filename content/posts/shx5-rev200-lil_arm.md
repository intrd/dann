---
title: "SHX5 : rev200-lil_arm"
date: "2017-03-16T18:54:27.000Z"
lastmod: "2017-06-05T15:26:55.000Z"
tags: ["ctf", "reverse engineering", "shx5"]
slug: "shx5-rev200-lil_arm"
url: "/shx5-rev200-lil_arm/"
---
Sniffing a public network we found a hash traveling in plain text.   
With a little observation we discovered that it was transmitted by a device that updates access passwords. Probably an IoT device.   
We got a copy of the binary that creates the hash.   
Can you help me figure it out this?

HASH: b5a7adbec4cd12410c1751871691b01a51a91961ac1de1e021f1fc1f826024f2a82ce2a631d2e72ee362347

Download the binary at [shellterlabs.com](http://shellterlabs.com)

## Solution

![](/content/images/2017/03/Selection_020.png)

As u can see, this is a `ARM aarch64` binary and we can't run directly..

Tried, but I can't figure out the hashing algorithm disassembling the `getHash` function..

![](/content/images/2017/03/Selection_021.png)

..but the flag possibly has `0x20(32)` length and we can hash single letters testing if it match the captured hash.

To run this binary we need to emulate `ARM aarch64`.

### ARM aarch64 QEMU emulation

I've found this pre-built QEMU image [aarch64-linux-3.15rc2-buildroot.img](http://people.linaro.org/~alex.bennee/images/aarch64-linux-3.15rc2-buildroot.img) and following [this](https://www.bennee.com/~alex/blog/2014/05/09/running-linux-in-qemus-aarch64-system-emulation-mode/) a member of our team, **[marcioRAGarcia](https://www.linkedin.com/in/marciorag/)**, can boot-up the machine w/ this args:

```bash
$ sudo qemu-system-aarch64 -machine virt -cpu cortex-a57 -machine type=virt -nographic -smp 1 -m 2048 -kernel aarch64-linux-3.15rc2-buildroot.img -fsdev local,id=r,path=/ARM,security_model=none -device virtio-9p-device,fsdev=r,mount_tag=r
$ mount -t 9p -o trans=virtio r /mnt
```

**Note**: `/ARM` is the path of host machine shared folder. We need this to share file between host and ARM machine.

![](/content/images/2017/03/Selection_023.png)

Perfect! As I thought.. the binary is hashing letter by letter.. and it matches with the default header of the flag `shellter{`

```
CAPTURED HASH: 
b5a7adbec4cd12410c1751871691b01a51a91961ac1de1e021f1fc1f826024f2a82ce2a631d2e72ee362347i
936874e8df0b4105a9f11c0ec0c39f8a

shellter{
b5a7adbec4cd12410c175
```

After some tries, I figure out that every byte start by hashing on two bytes, and after `t` it starts by hashing on 3 bytes

```bash
$ ./hash.bin shellter{B
UPDATE Users SET password = 'b5a7adbec4cd12410c175187' WHERE user_id = 55;
```

`U` is hashed as `187`, so, the whole flag is:

```
s   h   e  l  l  t  e   r   {   U   ...
b5  a7  ad be c4 cd 124 10c 175 187 169 1b0 1a5 1a9 196 1ac 1de 1e0 21f 1fc 1f8 260 24f 2a8 2ce 2a6 31d 2e7 2ee 362 347i
```

Luckly, our pre-built machine has python installed, and now.. [nozzlr](https://github.com/intrd/nozzlr) bruteforce comes ripping!

![](/content/images/2017/03/Selection_024.png)

### Hash bruteforce with nozzlr

[nozzlr](https://github.com/intrd/nozzlr) module to bruteforce this hash..

<script src="https://gist.github.com/intrd/3db9a49167b84785287e01059f3188ec.js"></script>

Running..

```bash
$ python nozzlr.py argv_bruteforce.py wordlists/alphanumdigs.txt 1 --repeats=11 --offset=0
```

![](/content/images/2017/03/rev200.gif)

The rest of the flag is w/ you :)

## References

- Running Linux in QEMU’s aarch64 system emulation mode - <https://www.bennee.com/~alex/blog/2014/05/09/running-linux-in-qemus-aarch64-system-emulation-mode/>
- nozzlr, a multithread bruteforcer, trully modular and script-friendly - <https://github.com/intrd/nozzlr>
