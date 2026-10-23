---
title: "BIOHACKING : How I got two NFC implants @ DEF CON 27, bricked and fixed it"
date: "2019-08-16T00:42:55.000Z"
lastmod: "2019-08-18T23:04:50.000Z"
tags: ["hardware", "defcon"]
images: ["/content/images/2019/08/2019-08-15_21-40.png"]
slug: "biohacking-how-i-got-two-nfc-implants-def-con-27-and-how-i-bricked-and-fixed-it"
url: "/biohacking-how-i-got-two-nfc-implants-def-con-27-and-how-i-bricked-and-fixed-it/"
---
I haven't updated this blog for a long time. Too busy with the new job. But I got some time to tell you an interesting tale of a n00b on BioHacking Village @ DEF CON 27.

Biohacking is an exciting thing, something that combines minimalism with Open Source technology that allows me to load a few bytes of data into my body that can be wireless readable, it always seemed like a good idea to me. **Amal Graafstra**, founder and CEO of @[DangerousThings](https://twitter.com/DangerousThings) was the pioneer, a good overview here: [TEDx talk](https://www.youtube.com/watch?v=7DxVWhFLI6E).

## Looking for a professional body piercers

So, while watching some talks on DEF CON 27, I found a tweet from @[c00p3r_7](https://twitter.com/c00p3r_7) (Dangerous Minds) saying there would be some implants available on [Biohacking village](https://twitter.com/dc_bhv).

![](/content/images/2019/08/2019-08-16_01-33.png)

..so I rushed to [Biohacking village](https://twitter.com/dc_bhv)

![](/content/images/2019/08/2019-08-15_18-15_1.jpg)

## Choosing the implant

Did a little research on available chips and choose the **xNT NFC Chip:**

![](/content/images/2019/08/2019-08-15_21-44.png)
*Picture from chipmylife.io*

A 13.56MHz ISO14443A & NFC Type 2 chip (2x12mm cylindrical sterile bioglass implant) w/ 886 bytes of user read/write memory. Perfect size/capacity for the applications that I want.

> Passive NFC chips are magnetically coupled devices that power themselves and communicate data over a shared magnetic field the reader generates. It has no battery, when it is out of the magnetic field it is useless like a splinter.

Quality of the bioglass? take a look at [x-series stress tests](https://forum.dangerousthings.com/t/tests-weve-performed-on-our-x-series-tags/474) by Dangerousthings.

## The implant

So no frills, a nice and very professionally girl made the implant, video:

<iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0" height="390" src="https://www.youtube.com/embed/OLxfu4jF4Qs" width="693"></iframe>

Implant technical details? [Professional Guide to 2x12mm GlassTransponder Installation](https://dangerousthings.com/wp-content/uploads/Professional-Guide-to-2x12mm-transponder-installation.pdf) published by Dangerousthings.

Also, if you are curious about how to remove it, here is a random [video](https://www.youtube.com/watch?v=_Qpj2ZztycE) (graphic).

## Read/Write test

A few hours later when I arrived back to the hotel, so I did the first reading/writing using **NFC Tools** on a mobile phone.

![](/content/images/2019/08/2019-08-16_02-40.png)

> I noticed that the power of the smartphone reader that's enough but not so strong/stable, so a minimum movement would end up damaging the reading/writing operation.

## Soft bricking the NFC implant

I live to break/fix things, already imagined that would brick my implant (but not so fast). And of course, I didn't [RTFM](https://dangerousthings.com/wp-content/uploads/NTAG213_215_216.pdf) and did not used the official DT [app](https://play.google.com/store/apps/details?id=com.dangerousthings.nfc&hl=en) (that prepares the user memory pages protecting the config pages to read/write).

So after a few read/writes with NFC Tools Pro, while writing some records (a `String text` and a `BTC pubkey`), I've write protected it by setting a password.

> ..but this time the writing did not end entirely and threw a writing an error, I think I took it too early and confirmed bricked my NFC implant.

Now, no application had writing permission on my implant, even the official one. Also tried to send some low-level authentication instructions, but it returns `NAK (denied)`.

![](/content/images/2019/08/2019-08-15_19-57.png)

I even thought I could have written the password in half or some symbol truncated the password, because I'd tried to set a strong password, tried just a few bytes, possible mutations, but no success.

> No problem, my 1st NFC implant become bricked but not useless, reading still works, a cool text string and my btc pubkey was stored, like a permanent tattoo :)

![](/content/images/2019/08/2019-08-15_20-26.png)

## Second NFC implant

My permanent tattoo was ok, but I liked the thing, So why not do another implant? Then I did it!

Meet @[c00p3r_7](https://twitter.com/c00p3r_7) (Dangerous Minds) at @[toool](https://twitter.com/toool) Lockpick Village.

![](/content/images/2019/08/2019-08-15_23-00.png)

..and got a new one on my right hand! This time I didn't even touch the implants until I back home.

![](/content/images/2019/08/2019-08-16_02-39.png)

## RTFM & Unbricking the implant

Now with a computer, proper devices and time to read the [datasheet documentation](https://dangerousthings.com/wp-content/uploads/NTAG213_215_216.pdf) and all material from the [DangerThings forum](https://forum.dangerousthings.com/c/info), i'm ready to try some things.

After understanding the memory organization, the function of **ACCESS**, **MIRROR** page.

![](/content/images/2019/08/2019-08-15_20-34.png)

..and **AUTH0/PROT/PWD** configuration parameters, I finally figured out what happened.

![](/content/images/2019/08/2019-08-15_20-37.png)
![](/content/images/2019/08/2019-08-15_20-43.png)

Comparing w/ my bricked NFC implant config pages parameters:

![](/content/images/2019/08/2019-08-15_20-51.png)

As you can see, NFC Tools Pro write every record ok, also set the `E2` page read-only locking permissions dependent of a password, and changed the `AUTH0` config flag to mark every page below the `00` as read-only (everything including user memory and config page), but the connection broken while setting the password page which remained the standard. Luckily we can still read the config page including the password.

> That's why the password I was using didn't work anymore and that combination was not accepted by GUI NFC applications.

So, I authed with the default password `1B FFFFFFFF` (it returns `0000` if the default pw is correct not `PAK` or `NAK`). Then sent `A2 E3040000E2` to change `AUTH0` from `00` to `E2`.

![](/content/images/2019/08/2019-08-15_21-03.png)
...
![](/content/images/2019/08/2019-08-15_21-08.png)

And done, I am able to write to it again!

![](/content/images/2019/08/2019-08-15_21-14.png)

I've changed the default pw and now after sending `A2 E480050000` to set config pages password-dependent also for reading the config pages are returned like this:

```
...
[E1] ?  00 00 00 00 |....|
[E2] ?p XX XX XX XX (LOCK2-LOCK4, CHK)
[E3] ?p XX XX XX XX (CFG, MIRROR, AUTH0)
[E4] ?p XX XX -- -- (ACCESS)
[E5] +P XX XX XX XX (PWD0-PWD3)
[E6] +P XX XX -- -- (PACK0-PACK1)
```

![](/content/images/2019/08/2006-03-30_-_Hands.0.0.jpg)
x-ray picture by @dylanmatt from [Vox](https://www.vox.com/2015/9/11/9307991/biohacking-grinders-rfid-implant)

Awesome, now I have about 2kb storage wireless readable built-in in my body!

DEF CON as always providing amazing experiences.

## Recommended tools

- Dangerous NFC (BETA) - <https://play.google.com/store/apps/details?id=com.dangerousthings.nfc&hl=en>
- NFC TagInfo by NXP - <https://play.google.com/store/apps/details?id=com.nxp.taginfolite&hl=en>
- NFC Tools Pro Edition - <https://play.google.com/store/apps/details?id=com.wakdev.nfctools.pro&hl=en>
- NFC TagWriter by NXP - <https://play.google.com/store/apps/details?id=com.nxp.nfc.tagwriter&hl=en>
- NFC Mobile Shell - <https://forum.dangerousthings.com/uploads/default/original/1X/6b6999b1515b5d7dfa47368938daf2b488c3bcf3.apk>

## Recommended hardware

- Dangerous KBR1 (ISO14443A) - <https://cyborg.ksecsolutions.com/kit/dt-kbr1/>
- Chameleon Mini RevE Rebooted, ISO14443A Codec Mifare Ultralight emulation (emulation and reader) - <https://hackerwarehouse.com/product/chameleon-mini-reve-rebooted/>
- ACR122U 13,56 mhz ISO14443 A/B (NTAG213, NTAG215 e NTAG216) reader/writer - <https://www.acs.com.hk/en/download-manual/419/API-ACR122U-2.04.pdf>

## References

- Biohacking, the forefront of a new kind of human evolution by Amal Graafstra at TEDxSFU - <https://www.youtube.com/watch?v=7DxVWhFLI6E>
- Tests we’ve performed on our x-series tags - <https://forum.dangerousthings.com/t/tests-weve-performed-on-our-x-series-tags/474>
- Dangerous Minds Podcast - <https://www.dangerousminds.io/>
- Help! Can’t write to xNT - <https://forum.dangerousthings.com/t/help-cant-write-to-xnt/3131/2>
- xNT stuck in read only mode - <https://forum.dangerousthings.com/t/xnt-stuck-in-read-only-mode/2782>
- TOOOL - <https://twitter.com/toool>
- Removal of RFID implant (graphic) - <https://www.youtube.com/watch?v=_Qpj2ZztycE>
- Professional Guide to 2x12mm GlassTransponder Installation - <https://dangerousthings.com/wp-content/uploads/Professional-Guide-to-2x12mm-transponder-installation.pdf>
- Biohacking Village @ DEF CON - <https://twitter.com/dc_bhv>
- DangerousThings - <https://twitter.com/DangerousThings>
- Chip My Life - <https://chipmylife.io>
- NTAG213/215/216NFC Forum Type 2 Tag compliant IC with 144/504/888 bytes user memory - <https://dangerousthings.com/wp-content/uploads/NTAG213_215_216.pdf>
- I got a computer chip implanted into my hand - <https://www.vox.com/2015/9/11/9307991/biohacking-grinders-rfid-implant>
