---
title: "SHX10 : web200-read_my_email"
date: "2017-05-24T04:31:19.000Z"
lastmod: "2017-06-05T15:22:36.000Z"
tags: ["shx10", "web security", "django", "code leak", "debug", "stream cipher", "ctf"]
slug: "shx10-web200-read_my_email"
url: "/shx10-web200-read_my_email/"
---
Can you read the admin's email?   
User: billy   
Pass: TheKid

## Solution

There's a mail system, if you input the given credentials..

![](/content/images/2017/05/Selection_999-094-.png)

..it will login and display a email sent from administrador.

![](/content/images/2017/05/Selection_999-096-.png)

...

![](/content/images/2017/05/Selection_999-095-.png)

I dug up the system and found no other functionality.

So, to read the email you do this `POST` request:

```python
POST /viewmail/ HTTP/1.1  
Host: lab.shellterlabs.com:32867  
Content-Length: 63  
Cache-Control: max-age=0  
Origin: http://lab.shellterlabs.com:32867  
Upgrade-Insecure-Requests: 1  
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36  
Content-Type: application/x-www-form-urlencoded  
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8  
Referer: http://lab.shellterlabs.com:32867/  
Accept-Encoding: gzip, deflate  
Accept-Language: en-US,en;q=0.8  
Cookie: sessionid="billy:6405552caf11c7b1aa5b18a3346ae1f13eafa516"; csrftoken=s3iaLUoYZpWFkJaaMjvj8YOsCATokC9e  
Connection: close

csrfmiddlewaretoken=s3iaLUoYZpWFkJaaMjvj8YOsCATokC9e&email_id=1
```

The `csrfmiddlewaretoken` has not working here, It just need to be equal the cookie `csrftoken`. But when you change the `sessionid` on `cookie` the request will fail:

![](/content/images/2017/05/Selection_999-097-.png)

Well, the challenge consists in read the email of the administrator. The footer gives the clue, the **SHX Mail Administrator** username is `nealcaffrey`.

To read the `nealcaffrey` email we need to forge his `sessionid`, but how?

I started by fuzzing the form fields and when I sent some symbols it triggered a `django debuggin page` displaying details from an exception and `leaking` part of the `source code`.

![](/content/images/2017/05/Selection_999-099-.png)

![](/content/images/2017/05/Selection_999-100-.png)

Nice, the administrator forgotten to disable `Debug` in a production environment, very common..

```python
def generate_session_token(username):  
    user_hash = sha1(username).digest()
    return stream_cipher(user_hash).encode('hex')
```

This code is showing us how the `sessionid` is created:

- The `user_hash` is the `hex` of `sha1("billy")`
- `sessionid` is the `hex` result of some `Stream Cipher` algorithm over the `user_hash`

## What is a Stream Cipher?

**Wikipedia says**: A stream cipher is a symmetric key cipher where plaintext digits are combined with a pseudorandom cipher digit stream (keystream). In a stream cipher, each plaintext `digit is encrypted one at a time` with the corresponding digit of the keystream, to give a digit of the ciphertext stream.

We don't know which algorithm is used, there's so much popular stream cipher algorithms out there, but the most common one is a simple `XOR byte-per-byte` and I bet the challenger used it. But to test it we need first recover the key used in encryption.

### Recovering the key and the flag

- Create the `billy_user_hash`
- **XOR byte-per-byte** `billy_user_hash` with `sessionid_hash`
- Now we can **XOR** the `key` with any `username_user_hash`, including `nealcaffrey_user_hash` to get a valid `admin sessionid`

### Final script

<script src="https://gist.github.com/intrd/d7a0c03fc50b4d30a7ba9945555712a7.js"></script>
> Just for note, you can replace this `xor_bytearray()` function and part of this code by a simple `hex(hex1 ^ hex2)`, because Python do a `xor byte-wise` by default in HEX values!

![](/content/images/2017/05/Selection_999-101-.png)

..and the flag

![](/content/images/2017/05/Selection_999-103-.png)

Thanks **ShellterLabs** and **RoboCore**, awesome contest!
