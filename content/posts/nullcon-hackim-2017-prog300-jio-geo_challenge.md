---
title: "Nullcon HackIM 2017 - prog300-jio-geo_challenge"
date: "2017-03-04T21:20:59.000Z"
lastmod: "2017-06-05T15:27:14.000Z"
tags: ["programming", "python", "hackim2017", "ip spoofing", "ctf"]
slug: "nullcon-hackim-2017-prog300-jio-geo_challenge"
url: "/nullcon-hackim-2017-prog300-jio-geo_challenge/"
---
Do you think you can win this Jio-Geo challenge ?   
52.90.9.177:33333

## Solution

Well, wtf is Jio-geo? i don't know.. search engine doesn't help.. and why only a few teams solved this challenge?

After a few tries I figured out that I need to send a message containing my unique signature(md5 hashed), then the server register 1 hit from my IP/Country.

![](/content/images/2017/03/Selection_999-117-.png)

What I need to do is hit the server w/ my unique signature from 40 different countries!

![](/content/images/2017/03/Selection_999-118-.png)

Doing a test with some proxies i was able to confirm this.

So, where will I find 40 working connections(socks) from different countries **without spending money**?

> There are 196 countries in the world today.

This type of challenge that involves the mastery of external resources does not attract many people, but I like it very much because it is very common in real situations.

### Using Tor

My first idea is Tor.

Editing `/etc/torrc` you can force Tor to choose exit nodes by country:

```
ExitNodes {ua},{br},{us},{ie}  
StrictNodes 1
```

```
Country                               Abbrev  
ASCENSION ISLAND                      {ac}  
AFGHANISTAN                           {af}  
ALAND                                 {ax}  
ALBANIA                               {al}  
ALGERIA                               {dz}  
ANDORRA                               {ad}  
...
```

Full countrycode list [here](http://www.b3rn3d.com/blog/2014/03/05/tor-country-codes/)

Enable/use **ControlPort** to change exit node on the fly:

```bash
printf "AUTHENTICATE \"yourpassword\"\r\nSIGNAL NEWNYM\r\n" | nc 127.0.0.1 9051
```

..or w/ a simple `service tor restart`

I've scripted this into a loop and almost works.. with Tor I was able to solve half the challenge `28/40`

![](/content/images/2017/03/Selection_463.png)

Also discovered that it is very difficult to find working exit nodes in more than 25 countries..

> <https://torstatus.blutmagie.de/> can help you to find countries w/ working exit nodes (move the mouse over the flag icon, that is the country code to use at `torrc`)

### Finishing the work w/ free Socks proxy list

At this point we need more 12 countries, so I had the idea of using a free/public Socks Proxy list organized by countries and eventually some would work..

Found this one <http://www.gatherproxy.com/proxylistbycountry> provided by **GatherProxy**

![](/content/images/2017/03/Selection_999-108-.png)

Manually and slowly I was able to finish the challenge.

![](/content/images/2017/03/Selection_468.png)

**FLAG**: flag{I_am_a_global_citizen}

### Full code

<script src="https://gist.github.com/intrd/a6dbbb04940c619020fc08d1b525da38.js"></script>

## References

- <http://www.b3rn3d.com/blog/2014/03/05/tor-country-codes/>
- <https://torstatus.blutmagie.de/>
- <http://www.gatherproxy.com/sockslist/sockslistbycountry>
