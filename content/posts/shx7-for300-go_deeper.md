---
title: "SHX7 : for300-go_deeper"
date: "2017-05-08T03:10:11.000Z"
lastmod: "2017-06-05T15:25:33.000Z"
tags: ["shx7", "forensics", "volatility", "keepass2", "memory dump", "ctf"]
slug: "shx7-for300-go_deeper"
url: "/shx7-for300-go_deeper/"
---
We have been able to capture some computer artifacts from a criminal cell and we are trying to access some accounts for more information to try to stop the attacks. But they use password management service e we could not find the files and passwords. You can help us with?

## Solution

```bash
$ wget https://shellter-static.s3.amazonaws.com/media/files/dd87da10-e4e0-48b5-8420-beae1316ba4f.7z

Saving to: ‘dd87da10-e4e0-48b5-8420-beae1316ba4f.7z’

dd87da10-e4e0-48b5-8420-beae131 100%[======================================================>] 151.42M  7.55MB/s    in 25s

$ 7z x dd87da10-e4e0-48b5-8420-beae1316ba4f.7z
$ file img.vmem 
img.vmem: data
```

Well, [Volatility](https://github.com/volatilityfoundation/volatility/wiki/Command-Reference) can help us w/ this memory dump..

```bash
volatility imageinfo -f img.vmem
```

![](/content/images/2017/05/Selection_832.png)

This is a `Windows X86` memory dump, let's check all process running..

```bash
volatility -f img.vmem --profile=Win81U1x86 psscan
```

![](/content/images/2017/05/Selection_831.png)

Nice, there's a `KeePass.exe` and challenge description says something about `password management service`.

Maybe the idea behind this is find a way to leak the keepass `.kdbx` database and his `master password` from memory.

First thing to do is a dump of the memory allocated for `pid=3884 KeePass.exe`

```bash
volatility -f img.vmem --profile=Win81U1x86 memdump -p 3884 -D dump
```

![](/content/images/2017/05/Selection_833.png)

Now instead a `512mb` dump, we now have only `199mb` to analyze..

So, if there's a keepass2 database loaded into memory, then you have a `XML header` too..

How did I know this? [reading the frickn' manual](https://github.com/Stoom/KeePass/wiki/KDBX-v2-File-Format)

![](/content/images/2017/05/Selection_834.png)

`Strings` can give some clue..

```bash
strings -n 5 img.vmem > strings
```

Just search for XML default header `<?xml`

![](/content/images/2017/05/Selection_835.png)

Nice! our encrypted database `shx7.kdbx` can be found at memory, from this XML you can leak all information about the `.kdbx` file, if its using a `Key file` you can leak his path too, but it's not our case..

As you can see, here is our encrypted flag.

```
<String>  
<Value>Flag</Value>  
<Key>Password</Key>  
<Value Protected="True">MuyOAKBXFhF3w8QoPhVTJ3ao1k4DOp/ScPWxzSTggZGBllE=</Value>
```

Now we still need:

- Leak the `master password` from memory (maybe its on clipboard?)
- Leak the entire `shx7.kdbx` keepass database from memory (not only the XML)

Still analyzing strings, and Wow! luckly the `master password` was copied in the memory some entries before the XML of the database ..

![](/content/images/2017/05/Selection_847.png)

Now with the password.. we need to find a way to dump the entire `.kdbx` from memory.

Start by greping dumpfile for the kdbx signature...

Remember?

```
       |   kdb      |  kdbx pre-rel | kdbx relese |
byte 1 | 0x9aa2d903 | 0x9aa2d903    | 0x9aa2d903  |  
byte 2 | 0xb54bfb65 | 0xb54bfb66    | 0xb54bfb67  |
```

More details from here: <https://gist.github.com/msmuenchen/9318327>

Well, `0x9aa2d903 0xb54bfb67` because the [Little endian](https://www.cs.umd.edu/class/sum2003/cmsc311/Notes/Data/endian.html), in memory will appear like this `d903 9aa2 fb67 b54b`.

Now back to `3884.dmp`(KeePass.exe memorydump) and `grep` for this..

```bash
hexdump 3884.dmp | grep "d903 9aa2 fb67 b54b"
```

![](/content/images/2017/05/Selection_838-1.png)

Omg, we have a problem here.. there's more than one entry of this file at memory, we need to extract the correct one or it will be a corrupted database.

Launch your preferred hex editor, I like [wXhexEditor](http://www.wxhexeditor.org/).

Search by our hex `kdbx` file signature `03 D9 A2 9A 67 FB 4B B5`

![](/content/images/2017/05/Selection_840.png)

9 entries of `shx7.kdbx` on memory.

Look for a entry that has not blank spaces breaking the header and file footer.. select and dump w/ right mouse button..

![](/content/images/2017/05/Selection_844.png)

Perfect!

![](/content/images/2017/05/Selection_842.png)

Now, launch `keepass2` and open the password database w/ master password! (there's a version of keepass2 on Linux emulated w/ mono).

```bash
keepass2 shx7.kdbx
```

![](/content/images/2017/05/Selection_845.png)

Awesome challenge [shellterlabs](http://shellterlabs.com/)!   
I really liked this one :)

## References

- Volatility cmd reference: <https://github.com/volatilityfoundation/volatility/wiki/Command-Reference>
- KDBX v2 File Format -
  <https://github.com/Stoom/KeePass/wiki/KDBX-v2-File-Format>
- KeePass v2.x (KDBX v3.x) file format bloody details -
  <https://gist.github.com/msmuenchen/9318327>
