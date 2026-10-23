---
title: "3DSCTF 2016 : stego300-simone_entao_e_natal"
date: "2017-01-08T17:18:00.000Z"
lastmod: "2017-06-05T15:29:56.000Z"
tags: ["ctf", "forensics", "3dsctf-2k16"]
slug: "3dsctf-2k16-stego300-simone-entao-e-natal"
url: "/3dsctf-2k16-stego300-simone-entao-e-natal/"
---
Simone - Entao e natal - The end of the year has come... and along with him comes these things of always in Brazil... Simone, Roberto Carlos's special presentation, etc.   
It seems that some crazy guy for Simone has hidden a flag on her album. Can you find it?   
P.S: Flag in non-standard format. When you find it, put inside on 3DS{}.   
NEW FILE!

Solved by 2 Teams Created by @fallc0nn

## Solution [post-event]

Download the file **simone.jpg**

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image.png)

pt_BR comment means: **Simone again on christmas?** WTF! (This album plays at all houses at the end of the year here ok? It's awful)

...its a valid jpeg

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image002.png)

**binwalk** returned that hides something...

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image003.png)

I dont know why but i can simply extract by renaming the jpg to .7z and opening at **Archive Manager**...

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image004.png)

but let's do the right/hacker way..

binwalk simone.jpg (to get decimal)

`dd if=simone.jpg bs=1 skip=72120 of=simone.7z` to isolate 7z into a new file

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image007.png)

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image008.png)

Now we have..

- a playable awful song..
- a fake flag **3DS{t0d0_4no_3ss4_m3rd4}**
- and a new tip **"There was this amazing tool in !Garoa. Check this."**, note: this tip was changed in the new file during the event.. the old comment was: **"There was a tool in the middle of Garoa."**, maybe the ! is to emphasis Garoa.., a mention to **Garoa Hacker Club**.

btw i've listened this song for hours and tried spectrogram by the several ways w/ several softwares.. no success...

## Wrong way

Then googling for garoa+steganography i found this:

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image009.png)

..ended up watching this video about Glassdoor Exfill Toolkit

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image010.png)

Glassdoor uses some LSB techniques to hide things.. maybe a tip to LSB..

Tried a lot of LSB decoders.. nothing works..

Also tried to decode with steghide it returns "invalid password", different msg than a file that contains nothing encrypted with steghide. Then I finished the event believing that the flag would be in there and some of the tips would be somehow the steghide password.. but I did not even try to bruteforce it.   
and give up!

## Post event solution

After event, @fallc0nn talked on google hangout that mp3 file is a fucking decoy.. :|

The flag is hidden at the end of original jpg, after the 7z.

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image011.png)
its true..

**binwalk** does not found this shit, and i let it pass at **strings** command.

Maybe `binwalk -E` could have given a clue..

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image012.png)

Ok, now we know this wav lets extract using header signature..

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image013.png)

To do this, using **Bless Hex Editor** i selected `52 49 46 46` and all below, then copy/paste into a new file..

the result..

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image015.png)

looks good..

#### Radare2 tip to find/extract WAV

We can easily find this WAV and extract using **radare2** file carving tools..

```bash
$ r2 -n simone.mp3
```

`/m` command to search magic headers with [libmagic](http://search.cpan.org/~drolsky/File-LibMagic-1.15/lib/File/LibMagic.pm) plugin and will find the WAV header address, seek to it using `s 0xaddress` and write to file w/ `wtf!` command.

![](/content/images/2017/01/Selection_216.jpg)

This could have saved a lot of time to get into the WAV file..

## Plotting WAV w/ python

At post-event hangout **@fallc0nn** also mentioned that he used software called **Rabiscoscopio** to generate the wav file, and this softwares is presented at **Garoa hacker club** (**!Garoa** is a direct search at <http://duckduckgo.com/>)

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image005.png)

Found this: <http://dalpix.com/blog/oscilloscope-drawing-everyone> but.. its one-way, you cannot convert wave back to svg usigng **Rabiscoscopio.**

<script src="https://gist.github.com/b34697b89bd8d323756531fb5465ad47.js"> </script>

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image016.png)

almost..

![](/writeups/3dsctf-2k16/stego300-simone_entao_e_natal/pasted_image017.png)

inverting x->y...

![](/content/images/2017/03/Selection_999-037-.png)

done!

Flag: **3DS{CENSORED}**
