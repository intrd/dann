---
title: "SHX8 : web200-freelyrics"
date: "2017-04-28T16:34:55.000Z"
lastmod: "2017-06-05T15:25:43.000Z"
tags: ["ctf", "web security", "shx8"]
images: ["/content/images/2017/04/Selection_704-1.png"]
slug: "shx8-web200-freelyrics"
url: "/shx8-web200-freelyrics/"
---
Can you exploit this website and capture the flag? The manager uses a strong password. You won't be able to find it in any wordlist, not even rockyou. Go custom and be happy.

URL: <http://lab.shellterlabs.com:32895/>

## Solution

![](/content/images/2017/04/Selection_732.png)

Looks a default Wordpress installation w/ some posts and comments..

![](/content/images/2017/04/Selection_734.png)

Fingerprinting with WPScan..

```bash
wpscan -u http://lab.shellterlabs.com:32912 --enumerate p
```

![](/content/images/2017/04/Selection_735.png)

Default themes/plugins and fully updated..

There's a warning about Akismet, but this is very common when WPScan can't confirm the plugin version.

#### Back to challenge description..

> Can you exploit this website and capture the flag? The manager uses a strong password. You won't be able to find it in any `wordlist`, not even rockyou. `Go custom` and be happy.

At first sight, I missunderstood that by using a strong/unusual password the admin is excluding the possibility of some bruteforce attack. But, if you look closely, this website is full of words, maybe the description tip is pointing us to generate a targeted/custom wordlist.

WPScan enumerated the username `singwithme`, and we can confirm it by `/wp-login.php`

![](/content/images/2017/04/Selection_754.png)
![](/content/images/2017/04/Selection_755.png)

And it looks like it has no active protection against bruteforce.

So, launched `CeWL` to generate a worlist based on website content..

```bash
cewl http://lab.shellterlabs.com:32914 --write sing1.txt --depth 1 -v -o
```

![](/content/images/2017/04/Selection_737.png)

..and it not work as expected, because when CeWL goes spider offsite due to a CeWL bug it back to default http port `80`, shellterlabs uses a custom port `32914`

![](/content/images/2017/04/Selection_738.png)

Yes, i've [reported](https://github.com/digininja/CeWL/issues/17) this issue to CeWL developers.

So, there's another tool called [smeegescrape](http://www.smeegesec.com/2014/01/smeegescrape-text-scraper-and-custom.html), but i really want to use CeWL to do this.

To work around this issue i've written some `iptables` rules and forwarded `localhost:80` to `lab.shellterlabs.com:32914`

<script src="https://gist.github.com/intrd/1822496093fd081e309c339e4edc01a6.js"></script>

```bash
cewl http://localhost --write sing1.txt --depth 1 -v -o
```

![](/content/images/2017/04/Selection_741.png)

Now it works flawlessly.

Then launched [nozzlr](https://github.com/intrd/nozzlr) w/ a custom template to bruteforce wordpress:

<script src="https://gist.github.com/intrd/84f8304b2ca239049a78db7ba8d43256.js"></script>

```bash
nozzlr http_wordpress_bruteforce.py users.txt sing1.txt 30
```

No success.   
Considering that this challenge worth 200 points, ShellterLabs will not give us the flag so easily.

Well, back to description tip..

> Go custom and be happy.

Let's try some permutations. `Nozzlr` is awesome because we can do this by code without the need to create other wordlists.

Considering `payload[1]` is every word from wordlist, I started from common permutations:

```python
"pwd": payload[1].lower(),
...
"pwd": payload[1].upper(),
...
"pwd": "0"+payload[1],
"pwd": "1"+payload[1],
"pwd": "2"+payload[1],
"pwd": "3"+payload[1],
"pwd": "4"+payload[1],
"pwd": "5"+payload[1],
...
"pwd": payload[1]+"0",
"pwd": payload[1]+"1",
...
```

![](/content/images/2017/04/Selection_722.png)

And luckly found the correct permutation!

The password gave me access to the wordpress admin panel!

![](/content/images/2017/04/Selection_744.png)

Looked all over the panel but could not find tge flag. Maybe it would be in a file on the server so the next step was to get a shell..

Using wordpress built-in `theme editor` we can inject our webshell at some `.php` that is allowed to be accessed externally, i choose `404.php`

![](/content/images/2017/04/Selection_746.png)

![](/content/images/2017/04/Selection_747.png)

..and we have our shell

```
find / -name *flag*
```

![](/content/images/2017/04/Selection_751.png)

```
cat /pathofflag/flag
```

![](/content/images/2017/04/Selection_753.png)

Thanks again ShellterLabs.   
Awesome challenge!

## References

- CeWL - Custom Word List generator : <https://github.com/digininja/CeWL>
