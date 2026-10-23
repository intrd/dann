---
title: "SHX9 : for200-basic_auth"
date: "2017-05-08T04:37:21.000Z"
lastmod: "2017-06-05T15:25:25.000Z"
tags: ["ctf", "forensics", "networking", "shx9"]
images: ["/content/images/2017/05/Selection_861.png"]
slug: "shx9-for200-basic_auth"
url: "/shx9-for200-basic_auth/"
---
We intercepted this communication on the internal network and we made a pivoting to the administration page of a spy cell, but we do not have a wifi password to decode and access a page of them. Can you help us?   
Tip: I think they use a custom password with shx.

## Solution

On this challenge we have access to a router administration page..

![](/content/images/2017/05/Selection_875.png)

and a `pcap` file..

![](/content/images/2017/05/Selection_849.png)

I've bruteforced this router admin page w/ some common logins/passwords, but no success..

If we load this `.pcap` at `Wireshark`, all `802.11` traffic is encrypted.. so we need to crack this password and decrypt w/ `master key`.

Used `aircrack-ng` extracting the hash to work with `Hashcat` (with [Hashcat](https://hashcat.net/hashcat/) my GPU performs better than `John` and `Pyrit`)

```bash
aircrack-ng SHX9-01.cap -J shx9
```

![](/content/images/2017/05/Selection_851.png)

**Update**: If you have problem with `hccap` version, use this: <https://hashcat.net/cap2hccapx/> to generate a `hccapx`. (thx [dbaser](https://dbaser.github.io/))

As you can see, it's a `WPA-PSK`, challenge description give a tip, we need to generate a wordlist containing "shx" at permutations.

So, `WPA-PSK` starts w/ `lentgh = 8`, and I do not believe that `shellterlabs` used a password above 8~9 digits because it would consume a lot of processing power to crack.

Then, my 1st permutation started w/ `shx?1?1?1?1?1`, every `?1` contains `?l?d?s`, all lower letters, simbols and digits. Hashcat is awesome, because we can do this permutations on the fly..

```bash
/home/intrd/appz/hashcat/hashcat64.bin -m 2500 shx9.hccap -a3 -1 ?l?d?s shx?1?1?1?1?1
```

![](/content/images/2017/05/Selection_853.png)

Nice! Recovered the password on my first try! If won't worked i'll try `?1?1?1?1?1shx` and soon, `crunch` can help u w/ more advanced permutations.

Wireshark needs WPA-PSK `Master Key` to decrypt traffic and hashcat didn't give to us..

Knowing the `plain text password` is easy to get the Master Key doing this:

```bash
echo "sample@p@ssword" >> pwds  
echo "sample@p@ssword" >> pwds  
echo "sample@p@ssword" >> pwds  
aircrack-ng -b 18:A6:F7:8F:2B:F0 -w pwds SHX9-01.cap
```

![](/content/images/2017/05/Selection_856.png)

With the master key, launch `Wireshark` and decrypt all 802.11 traffic between client and router.

![](/content/images/2017/05/Selection_862.png)

**Update**: You can decrypt traffic without the need of wireshark `airdecap-ng -e shx9 -p sample@p@ssword SHX9-01.cap`, thx [marcioRAGarcia](https://www.linkedin.com/in/marciorag/) )

And now, follow all the `GET/POST` requests between `router` and `client` and you will find the `HTTP basic auth` coded in `base64` w/ our admin page login/password!

![](/content/images/2017/05/Selection_859.png)

```bash
echo captured_http_basicauth | base64 --decode
```

![](/content/images/2017/05/Selection_860.png)

Router pwned, client pwned!   
..and there is our flag!

## References

- Hashcat wiki - <https://hashcat.net/wiki/>
- How to Crack WPA/WPA2 - <https://www.aircrack-ng.org/doku.php?id=cracking_wpa>
