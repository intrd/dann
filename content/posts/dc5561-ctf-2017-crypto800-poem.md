---
title: "DC5561 CTF 2017 : crypto800-poem"
date: "2017-11-09T21:47:04.000Z"
lastmod: "2017-11-09T21:47:04.000Z"
tags: ["cryptography", "reverse engineering", "stream cipher", "python", "ctf", "dc5561"]
slug: "dc5561-ctf-2017-crypto800-poem"
url: "/dc5561-ctf-2017-crypto800-poem/"
---
There's a poem..

```
I'm not a good writer, and Shakespeare is better than me
But writing a little poem, oh gosh, how hard can it be?

Let's go, let's go, let's go, let's write a rhyme for crypto
Don't know, don't know, don't know, ok let's just use TIPTOE

Ok, ok, ok, so what's this CHALLENGE about?
Don't know a word to say and time has just ran out

Those RANDOM numbers, ya know, they always have a SEED
To find this FLAG, ya know, I guess that's what you need

Oh my gosh! Oh my gosh! I have to admit
The CERTIFICATE we've hit, oh man it seems legit!

Oh my gosh! Oh my gosh! Did they change it just a bit?
The ARRAY you just have found, what you gonna do with it?

I know, I know, you're tired of all this sh...ame
Calm down, calm down, the FLAG looks like a name

I know, I know, you're tired of all this game
Calm down, calm down, the flag will bring you FAME!
```

The poem have some highlighted words...

```
TIPTOE
CHALLENGE
RANDOM
SEED
FLAG
CERTIFICATE
ARRAY
FLAG
FAME
```

Also there's a file called `certificate.txt`

![](/content/images/2017/11/Selection_999-2312-.png)

This certificate, looks a `base64`.. we tried to decode and it worked, resulted in a `Windows PE executable`

![](/content/images/2017/11/Selection_999-2314-.png)

Renamed it to `decode1.exe` and runned on a Windows VM..

![](/content/images/2017/11/Selection_999-2316-.png)

.. it shows a encrypted text `<=$uj{-3azseg?&(j2 <1<j7=6{,7-9$;|j'*"=?1z9)` and keeps expecting for some input.

Analyzing it we got some interesting hard-coded strings and we can already have an idea that this is a type of crackme challenge..

![](/content/images/2017/11/Selection_999-2318-.png)

Also got this hint..

![](/content/images/2017/11/Selection_999-2320-.png)

What most caught our attention was this string `Ok, enter it:`, if we wrongly answer to the first question the program closes and this string is not displayed.

![](/content/images/2017/11/Selection_999-2321-.png)

Maybe it was expecting for some key.. so, we had to figure out the correct answer for the question and possibly get into this input to enter something to see what happen.

Instead of trying to find the first correct command we patched the binary modifying this `jnz`

![](/content/images/2017/11/Selection_999-2322-.png)

..to `jz` to bypass the verification of the question and go directly to `Ok, enter it:`, and it works, now we can test our keys.

Before we start thinking about bruteforce we were able to understand exactly what the encryption algorithm was doing..

> Its a simple `stream cipher`, `XOR` each byte of encrypted string w/ each byte of the key.

Using the key `test` we got this result..

![](/content/images/2017/11/Selection_999-2323--1.png)

Emulating it on python using the 1st 4 bytes of ciphertext..

```python
#!/usr/bin/python
## Keygen solution to crypto800-poem @ DC5561 CTF 2017  
# solved by intrd & r00tc0d3r - p4f team

string = [0x3c,0x3d,0x24,0x24] # 1st 4 bytes of encrypted text: <=$uj{-3azseg?&(j2 <1<j7=6{,7-9$;|j'*"=?1z9)  
xor_key = [0x74,0x65,0x73,0x74] # 4 byte key: test

str=""  
for i in range(0,4):  
    i=string[i]^xor_key[i]
    str += chr(i)
print(str)
```

..and running we can see the 1st 4 bytes of the result was the same `HXWP` returned by the binary! Success!

![](/content/images/2017/11/Selection_999-2324-.png)

Ok, but how to find the correct key? So, why not try that poem `highlighted words`?

Bingo! the first key we tried `TIPT` decoded to `http`..

![](/content/images/2017/11/Selection_999-2325-.png)

So, we updated the script to decode the remaining bytes repeating the key along the way.. `TIPTOETIPTOETIPTOETIPTOETIPTOETIPTOETIPTOETIP`, `45 bytes` same length of ciphertext.

```python
# #!/usr/bin/python
# ## crypto800-poem decoder @ DC5561 CTF 2017  
# # by intrd & r00tc0d3r - p4f team

def sxor(s1,s2):  
    return ''.join(chr(ord(a) ^ ord(b)) for a,b in zip(s1,s2))

key = "TIPTOE"  
print repr(sxor(key*20, "<=$$uj{-3azseg?&(j2 <1<j7=6{,7-9$;|j'*\"=?1z9)"))
```

..the result can't be better!

![](/content/images/2017/11/Selection_999-2326-.png)

A URL w/ some python scrypt!   
`http://dc5561.org/files/ctf/crypto3/script.py`

```python
#!/usr/bin/env python
"""This is just a simple yet challening Python script.
   Not finished yet, though...
   Use the hints you have so far to finish it and get your FLAG!"""

import sys  
import random

def my_rand(seed):  
    r = random.Random()
    # TODO - the seed needs to come from the "user"
    # temporarly I'll just leave 'SEED' here. Hope someone fixes this...
    r.seed('SEED')
    return round(r.random() * 10)

def char_sub(str_array, position):  
    var = str_array[int(position)]
    var = var.replace("a", "@")
    var = var.replace("e", "3")
    var = var.replace("i", "1")
    var = var.replace("o", "0")
    return var

def main(argv):  
    mixed_array = [".", "phrase:", "Best", "William.", "be?", "To", "not", "or", "to", "be", " - SHAKESPEARE, " ]
    # TODO - I'm lazy, so this function is not ready yet...
    # organize_array()
    # TODO - organized_array should be different from the mixed_array
    organized_array = mixed_array
    # Get the right word
    index = my_rand(argv[1])
    print "Index: ", int(index)
    print "This is the flag:", char_sub(organized_array, index)

if __name__ == "__main__":  
    main(sys.argv)
```

> So, analyzing the code, it uses a `predefined random() seed` to select a `random string` from a `mixed_array` and replace a `random byte` of this string w/ a [l33t speak](https://en.wikipedia.org/wiki/Leet) character.

![](/content/images/2017/11/Selection_999-2329-.png)

Also there's a function we need to code to organize the array..

![](/content/images/2017/11/Selection_999-2330-.png)

..but i'm lazy too and dit it by hand

![](/content/images/2017/11/Selection_999-2331-.png)

So, now we need the correct `random seed` to get the correct flag. Back to the poem, there are some lines that mention elements of this python script.

![](/content/images/2017/11/Selection_999-2332-.png)

We decided to test the rest of the highlighted words and the seed `ARRAY` was the only one that returned me something that looked like a flag..

![](/content/images/2017/11/Selection_999-2333-.png)

Nice! the poem says `Calm down, calm down, the FLAG looks like a name`, this can be the flag (remembering that we have limited attempts to submit the flag).

And done! every challenge solved **p4f team 1st place**! very proud of our team..

![](/content/images/2017/11/ctf.png)

Thanks to [DC5561](https://www.dc5561.org/) **DEFCON Group Brasilia** for hosting this CTF.

## References

- Stream Cipher - <https://en.wikipedia.org/wiki/Stream_cipher>
- Patching the binary w/ radare2 and writing a keygen in Python -
  [http://dann.com.br/shx5-rev200-lil_arm/](/shx5-rev200-lil_arm/)
