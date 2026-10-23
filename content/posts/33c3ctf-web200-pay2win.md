---
title: "33C3CTF : web200-pay2win"
date: "2017-01-11T15:22:16.000Z"
lastmod: "2017-06-05T15:29:32.000Z"
tags: ["33c3ctf", "pwn", "web security", "ctf"]
slug: "33c3ctf-web200-pay2win"
url: "/33c3ctf-web200-pay2win/"
---
Do you have enough money to buy the flag?   
<http://78.46.224.78:5000/>

## Solution

![](/content/images/2017/01/Selection_081.jpg)

The web application list two products to buy..

#### Cheap

Which you can buy with valid card generated [here](http://www.getcreditcardnumbers.com/)

![](/content/images/2017/01/Selection_082.jpg)

#### Flag

Accept the valid card but return a `limit exceeded` error message:

![](/content/images/2017/01/Selection_083.jpg)

### Analyzing callback data

When the order is accepted/declined you get a callback data parameter from the server..

**Cheap callback**

```
http://78.46.224.78:5000/payment/callback?data=5765679f0870f4309b1a3c83588024d7c146a4104cf9d2c8de817b1d05ac501928df361f896eb3c3706cda0474915040
Hello, customer!
Payment status: good
Filename: cheap.txt
Content: MAKE C3 HACK AGAIN!
```

**Flag callback**

```
http://78.46.224.78:5000/payment/callback?data=232c66210158dfb23a2eda5cc945a0a9650c1ed0fa0a08f6d80475334bb8e8a1aef38fd25e8ce9872f7ef761e2bbe791
Hello, customer!
Payment status: failed
Credit card limit exceeded!
```

After running a data sequencer(unique) in the `flag` callback data, we could notice that there was not much entropy.

![](/content/images/2017/01/Selection_080.jpg)

Comparing it next to the flag callback was noticeable that in fact it was divided in 3 blocks..

![](/content/images/2017/01/Selection_013.png)

So after a lot of trial and error moving the blocks in different positions we got the one that made the purchase of the flag.

![](/content/images/2017/03/Selection_999-034-.png)

##### The buy formula

> buyflag*callback = (cheap*block[1] + cheap*block[2] + flag*block[2] + flag_block[3])
>
> buyflag_callback = 5765679f0870f4309b1a3c83588024d7c146a4104cf9d2c86a5c7ef475a00033472741d1bbc3c34f2f7ef761e2bbe791

```
http://78.46.224.78:5000/payment/callback?data=5765679f0870f4309b1a3c83588024d7c146a4104cf9d2c86a5c7ef475a00033472741d1bbc3c34f2f7ef761e2bbe791
Payment status: good
Filename: flag.txt
Content: 
Flag: 33C3_CENSORED
```
