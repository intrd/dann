---
title: "3DSCTF 2016 : web200-mapos"
date: "2017-01-08T17:19:00.000Z"
lastmod: "2017-06-05T15:29:49.000Z"
tags: ["ctf", "web security", "3dsctf-2k16"]
images: ["/content/images/2017/01/3ds_109-2.jpg"]
slug: "3dsctf-2016-web200-mapos"
url: "/3dsctf-2016-web200-mapos/"
---
MapOs - I just overheard a conversation from the company next door to MapOs and found out that their main system is being updated due to 2 bugs. One of them is related to authentication, but I don't know nothing about the other one besides the fact that it could lead an attacker to gain access to their main server.   
Being such a good hacker as you are, take a look over there. There's a file in their server with the flag.   
PROTIP: begin with [admin@admin.com](mailto:admin@admin.com)   
- Container for this chall is restarted every 3h. In other words, your entire effort should be done in less than 3h from last restart.

Solved by 7 Teams Created by @h4kboot

## Solution

Following the protip: [admin@admin.com](mailto:admin@admin.com) and no anti-csrf protection, i launchd a bruteforce using my Patator script w/ rockyou.txt

<script src="https://gist.github.com/intrd/9e5f4d4ae72b46f4abe35ffe982dc3cf.js" style="background: #000000"></script>

Note this rule: `quit:fgrep!="Disallowed Key Characters.",fgrep!='esult":false'`

**Patator** will quit if **http result** does not contain **"Disallowed Key Characters."** and **"esult":false"** (This means that we found the password, or something unexpected happened that we should treat in the script)

![](/writeups/3dsctf-2k16/web200-mapos/pasted_image.png)

It works,   
i've used 2 threads, so I had to test the last 4 passwords.. now im logged on panel, tried ZAP scanner to fuzz common flaws.. but nothing found.. just some absense of csrf tokens..

So I decided to take a look at the functions available in the system..

![](/writeups/3dsctf-2k16/web200-mapos/pasted_image004.png)

At **Configurações/Cadastrar Dados do Emitente** is possible to send files, let's see if we can send any kind of file..

Wrote a simple php backdoor..

<script src="https://gist.github.com/821e6284ea6505befd911997f04cd833.js"> </script>

tried to upload.. **back.php** and **back.jpg.php**...

![](/writeups/3dsctf-2k16/web200-mapos/pasted_image007.png)

![](/writeups/3dsctf-2k16/web200-mapos/pasted_image008.png)

nop.. seems filtered properly..

But the **Arquivos** (Files) area allows you to list files on the system.. and after some research discovered that it is possible to give admin user permission to send files and this enables the **Adicionar Arquivo** button.

![](/writeups/3dsctf-2k16/web200-mapos/pasted_image010.png)

![](/writeups/3dsctf-2k16/web200-mapos/pasted_image019.png)

ok, the backdoor is planted, now click on print icon to discover his url and have fun w/ your shell commands..

```language
view-source:http://54.175.35.248:8008/assets/arquivos/26-12-2016/2ce1f54098a72b3c3224181c8683bd66.php?cmd=uname -a
```

![](/writeups/3dsctf-2k16/web200-mapos/pasted_image013.png)

```language
view-source:http://54.175.35.248:8008/assets/arquivos/26-12-2016/2ce1f54098a72b3c3224181c8683bd66.php?cmd=ls -la ../../../../../
```

![](/writeups/3dsctf-2k16/web200-mapos/pasted_image015.png)

```bash
view-source:http://54.175.35.248:8008/assets/arquivos/26-12-2016/2ce1f54098a72b3c3224181c8683bd66.php?cmd=cat ../../../../../flag.txt
```

![](/content/images/2017/03/Selection_999-036-.png)

Flag: **3DS{CENSORED}**

Done!
