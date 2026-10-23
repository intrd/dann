---
title: "GCL-Prequals 2017 : Sniffing GGoCySEA Agent Comms Link (rev part)"
date: "2017-09-20T22:26:11.000Z"
lastmod: "2017-09-22T00:31:29.000Z"
tags: ["bruteforce", "gclprequals2k17", "reverse engineering", "cryptography", "forensics", "cryptcat"]
slug: "gcl-prequals-2017-sniffing-ggocysea-agent-comms-link-rev-part"
url: "/gcl-prequals-2017-sniffing-ggocysea-agent-comms-link-rev-part/"
---
Our inside crew was able to set up a sniffer and intercept some comms, but we haven't had time to analyze it yet. Critical information is needed! Submit the `ver`, `seccoms` and `cry` t0k3n. Download PCAP from ~~<http://bit.ly/wgzPacMan>~~ -- If you've already downloaded wgzPacMan, no need to download it again.

## Solution (ver t0k3n)

Analyzing the PCAP we've discovered that the Agent Smith is running a secure communication service @ `52.204.153.56:443` and received the `ver t0k3n` on plaintext.

![](/content/images/2017/09/Selection_999-1808-.png)

Following the TCP stream we got this conversation:

```
A. Smith: GGoCySEA Agent Comms Link
A. Smith: Agent Smith here... 
Client: Agent Smith, this is Agent Rollins, I was told I could contact you here.
A. Smith: This is Agent Smith, send your verification t0k3n
Client: th3 ver t0k3n y0u s33k is: !@mag3ntr0ll!n$
A. Smith: ver t0k3n verified, what can I do for you?
Client: I...ve sent you a file that you need to look at on open comms channel
A. Smith: I have it, but you shouldn...t send files over that channel you need to use secure comms, connect to 8989 for the software then connect to the secure comms channel on 4443, send your seccomms verification t0k3n once you connect
...comms out...
```

## Solution (seccomms t0k3n)

Agent Rollins (client) made a mistake to sent a confidential file on open channel (yes, we already intercepted this before and extracted some t0k3ns from it).

Then Agent Smith called the attention to use a `specific secure software` to send/receive sensitive data.

..this software:

- Was downloaded from port `8989`;
- Used the A. Rollins `seccomms t0k3n` to establish the communication;
- And possibly used to sent more sensitive data. Our `cry t0k3n` maybe?

![](/content/images/2017/09/Selection_999-1811-.png)

So, searching for packets that passed through `8989` port, the first occurrence was this `ELF` binary.

![](/content/images/2017/09/Selection_999-1821-.png)

After some research we figured out this is a modded version of [CryptCat](http://cryptcat.sourceforge.net/info.php). Cryptcat is the standard `netcat` enhanced with `Twofish encryption`.

![](/content/images/2017/09/Selection_999-1814-.png)

They changed/added some args description on the software:

- **-T** - display a `temporary seccoms t0k3n` (this is not our token yet, we need the token used by Agent Rollins);
- **-k** - set a peer-to-peer pre-shared key.

> If you send some data without setting the `-k` it will encrypt w/ Twofish using the default key, setting `-k` you can use your own privkey.

Well, A. Smith said he should use port `4443` for communication through this software, let's take a look.

![](/content/images/2017/09/Selection_999-1815-.png)

Interesting..   
Some encrypted data (unknown header/body/footer).

Why not try to put up the binary as server `./elf.elf -vvlp 4445` and send this data back emulating the server answer?

This is what we did..   
Using Python to take more control of the data flow and possibly figure out the encryption we sent back to localhost the bytes of first server answer:

![](/content/images/2017/09/Selection_999-1822-.png)

..and we got it decrypted! So, we wrote this script...

```python
import sys, binascii  
from pwn import *

HOST = '127.0.0.1'  
PORT = 4445  
conn = remote(HOST,PORT,typ="tcp")

## Attention to the Twofish pattern 16 bytes key + data
encdata = "2c087117c9d469d622f3a117de0990e3"  
encdata += "d52cb4e656ce4e0ce2ad7882715f451a2a41cb53ed889e1909ef0c245cdbd5474637987eb7b9ca3b0ebfe23a01d5bf7f518ed86b4d3c"  
encdata += "b52eb51ac555153b4eb9a26d0ef9be46"  
encdata += "06b5f2e428d3ab42a9920973f39e6d614699950dadca96952d9911de146fef0e83640a727cdb06af681434f46ec20be62ec7d39c1d6fa14f1c595e84284db71c5e07a2d18311d8"  
encdata += "4a822e4ca0efad0543e2f7aec7c5c9de"  
encdata += "eda3ee5bb3e046d837cca186570c41e05877d30e94392539b07e1e879fd0d6d76fea04e476a7592a6ae61ffea2c4809b8406ac5e127f96cbb666c6e73246030e0f5c8cd1dc3f6b51bc0bf4d4bc5e829947890ca59caf6d49b9e702cc745e26047d42c812fa15e242d14b121ef83d09c756a5"  
encdata += "33078bb44d6de30bb799eeb5f8f125d2"  
encdata += "b209c7d65f08981b9935b9114538facc2a599f6f3ecbed7af1e738b960489dce"  
encdata = binascii.unhexlify(encdata)

conn.sendline(encdata)
```

..to decode the entire conversation.

![](/content/images/2017/09/Selection_999-1824-.png)

```
Server: GGoCySEA Secure Comms Link
Client: This is Agent Rollins checking back in
Server: send your seccomms verification t0k3n
Client: th3 seccoms t0k3n y0u s33k is: ag3ntr0ll!n$s3cur3c0mm$
Server: secure comms t0k3n verified, send your file with the GovSec Agency approved password on port 6345
...comms out...
```

## Solution (cry t0k3n)

As you can see, decoding the last comm we got:

- Agent Rollins `seccoms tok3n`;
- A new port, `6345` used to send files encrypted w/ a `custom password` aproved by GovSec Agency.

Back to PCAP we confirmed that a good amount of encrypted data(57kb) has passed through this port.

![](/content/images/2017/09/Selection_999-1825-.png)

So, we have the `encrypted data` and the `Software` to decrypt it. But.. how about the `password`? We can bruteforce or reverse it?

During the CTF we've found some passwords, but how to test it?

The first thing is to figure out how to use the `-k` (pre-shared key) in a way to bruteforce it.

![](/content/images/2017/09/Selection_999-1831-.png)

As you can see it works like a charm..

1. We created a `dummy file` w/ some content;
2. Setup a server w/ a `supersecretpassword`;
3. Sent the dummy file w/ the `correct password` and got it decrypted on the other side;
4. If the `password was wrong`, it didn't even try to decrypt it.. `0 bytes are transferred` and the connection is killed.

```bash
## server side
$ ./elf.elf -k supersecretpassword 127.0.0.1 -vvvlp 6345

## client side
$ ./elf.elf -w 1 -k supersecretpassword 127.0.0.1 6345 < dummyfile
```

`Note`: i've used `-w 1` to set a timeout, otherwise when the password was correct it keeps the connection opened.

Now we back to PCAP and extracted the `1st encrypted chunk`. If we can decrypt it we will got a known file header confirming the decryption success.

![](/content/images/2017/09/Selection_999-1828-.png)

So, we launched a endless loop acting as client sending the encrypted chunk..

```bash
$ while true; do nc 127.0.0.1 6345 < 1stchunk; done
```

**Note**: We are using `netcat` instead `CryptCat` because this chunk already is encrypted, we don't want to encrypt again, right?

On the server side we launched a `multi-thread` python bruteforce script, it will run until we get some decrypted data!

<script src="https://gist.github.com/intrd/b26d3b24c817073c2bca9e4899cd08cc.js"></script>

And done, the script found the password `freedom246` on `rockyou.txt`! We also have the 1st chunk decrypted..

![](/content/images/2017/09/Selection_999-1834-.png)

> With `20 threads` it stills took some time because the bottleneck on the client side single thread. (if you did it in a smarter way, plz let me know).

Now, with the password we can decrypt every chunk and merge it in a single file.

ops..   
![](/content/images/2017/09/Selection_999-1832-.png)
not yet!

If you try to send the entire conversation to it, the 57kb, it overflow the Cryptcat `buffer[8192]` and returns a `Segmentation fault`.

I've tried a lot to split it into chunks of 8192 bytes, it works but we have some problem w/ PNG IDAT and CRC shit.

So, the solution we found was to patch the CryptCat to allow a bigger buffer. To do this..

Download the <http://cryptcat.sourceforge.net/> source.

On `netcat.c` increase the `BIGSIZ` size `8192` to `9193`...

![](/content/images/2017/09/Selection_999-1842-.png)

On `farm9crypt.cc` also increase the `outBuffer`, `inBuffer` and `size` size..

![](/content/images/2017/09/Selection_999-1843-.png)

Recompile w/ `make linux`..

Now just send the entire dump..

![](/content/images/2017/09/Selection_999-1844-.png)

..do it to retrieve the `cry t0k3n`.

![](/content/images/2017/09/flag.png)

## References

- Cryptcat, The standard netcat enhanced with twofish encryption with ports for WIndows NT, BSD and Linux - <http://cryptcat.sourceforge.net/>
- h3x_pr0ph3ts team, <https://www.cyberlympics.org/?portfolio=team-h3x-pr0ph3ts-2017>
- nc linux man page, <https://linux.die.net/man/1/nc>
- Another solution(by v0s) to bruteforce cryptcat twofish key -
  <https://gist.github.com/v0s/002f1c7cc6dca258417c19a1eabff858>
