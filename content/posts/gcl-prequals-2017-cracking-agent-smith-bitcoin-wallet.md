---
title: "GCL-Prequals 2017 : Cracking Agent Smith bitcoin wallet from public key"
date: "2017-08-13T03:46:00.000Z"
lastmod: "2017-08-20T01:48:07.000Z"
tags: ["cryptography", "bitcoin", "bruteforce", "gclprequals2k17"]
slug: "gcl-prequals-2017-cracking-agent-smith-bitcoin-wallet"
url: "/gcl-prequals-2017-cracking-agent-smith-bitcoin-wallet/"
---
This weekend I helped the team of friends, `H3x Pr0ph3ts` in Global Cyberlympics Pre-Quals. At some point of the competition we found this file containing a Bitcoin Paper Wallet addressed to Agent Smith

![](/content/images/2017/08/photo_2017-08-12_06-51-23.jpg)

### Bitcoin wallets

- Private key, a single unsigned 256 bit integer (32 bytes)
- Public key, a number that corresponds to a private key, but does not need to be kept secret.

> A public key can be calculated from a private key, but not vice versa.

Looking at the image, our objective is recover the private key in a way to import into a new wallet to take control of Agent Smith funds. (Or just post it as flag).

The public key is not properly blurred, we can read it.. but the private key is unreadable(maybe not for [this guy](https://img.vos.uz/9px67la4.jpg) who almost recovered the private key from blurry qrcode).

Bitcoin wallets are secure and is impossible to recover the private key if it was properly random generated. My thoughts is they used a Brain Wallet, a bitcoin wallet derived from a Passphrase, a password easy to memorize.

### What is the problem with Brain Wallets?

> Brain wallets can be brute forced because it is based on a simple password, and to make it worse, humans love to reuse passwords.

To help with the task i've used a [tool](https://github.com/ryancdotorg/brainflayer) created by Ryan Castellucci, he made a [awesome talk @ DEFCON 23](https://www.youtube.com/watch?v=foil0hzl4Pg) about this.

Before input the public address in [brainflayer](http://https://github.com/ryancdotorg/brainflayer) we need to follow the reverse path of [creating a bitcoin wallet](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses). The first task is extract the [Hash160 from pubkey](http://bitcoinvalued.com/tools.php) public address.

![](/content/images/2017/08/Selection_999-1319-.png)

- **Pubkey(b58c)**: 175sZR2eBf6JapbxWZFJk3qeicUsg3Atqr
- **Hash160**: 42BC9F7ABBE700EA1E105D9877E6DE82F77F370B

From this `HEX`, pre-compute the `BLF`..

```bash
$ echo 175sZR2eBf6JapbxWZFJk3qeicUsg3Atqr > ex2.hex
$ hex2blf ex2.hex ex2.blf
```

And run brainflayer against it using a common password list, my first try was the classic `rockyou.txt`

![](/content/images/2017/08/Selection_999-1320-.png)

Bingo!

```
42bc9f7abbe700ea1e105d9877e6de82f77f370b:u:sha256:itsasecret
```

`itsasecret` is a passphrase used to create the brainwallet.

..now create a [new brain wallet](https://brainwalletx.github.io/#generator) w/ the recovered passphrase

![](/content/images/2017/08/Selection_999-1322-.png)

Take the secret exponent and keep following the reverse path of [creating a bitcoin wallet](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses), the final step is to convert it to `Base58Check`

![](/content/images/2017/08/Selection_999-1323-.png)

Now you have a valid bitcoin wallet privkey. You can import it to a wallet and recover A. Smith funds.

**FLAG**: 5J4whis157ZkfhPa1CfEzExR4VE7HGRx3fYBYNe73dGMPyrG2Hg

![](/content/images/2017/08/photo_2017-08-12_02-25-05.jpg)

## References

- [Technical background of version 1 Bitcoin addresses](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses)
- [DEF CON 23 - Ryan Castellucci - Cracking CryptoCurrency Brainwallets](https://www.youtube.com/watch?v=foil0hzl4Pg)
- [A proof-of-concept cracker for cryptocurrency brainwallets](https://github.com/ryancdotorg/brainflayer)
- <http://bitcoinvalued.com/tools.php>
- <https://brainwalletx.github.io/#generator>
