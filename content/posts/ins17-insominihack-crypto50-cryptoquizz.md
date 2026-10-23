---
title: "Insomini'hack 2017 : crypto50-cryptoquizz"
date: "2017-01-30T12:43:05.000Z"
lastmod: "2017-06-05T15:28:49.000Z"
tags: ["guessing", "programming", "python", "cryptography", "ins17", "ctf"]
slug: "ins17-insominihack-crypto50-cryptoquizz"
url: "/ins17-insominihack-crypto50-cryptoquizz/"
---
Hello, young hacker. Are you ready to fight rogue machines ? Now, you'll have to prove us that you are a genuine cryptographer. (created by cryptopathe)

Running on quizz.teaser.insomnihack.ch:1031

## Solution

When the connection is estabilished..

```
~ Hello, young hacker. Are you ready to fight rogue machines ?
~ What is the birth year of Rafail Ostrovsky ?
```

..and the connection drop off after 2 secs. So, we need a prog solution.

Clearly it is a cryptographer list, maybe extracted from here: <https://en.wikipedia.org/wiki/List_of_cryptographers>. Wrote a socket script to isolate the name and fetch the birth data with this Wikipedia profile infobox parser..

<script src="https://gist.github.com/intrd/2c19ee22c3bd98ed07612c6ad3adc25d.js"></script>

..generated this array:

```
fullnames = {'Serge Vaudenay': 1968, 'Ron Rivest': 1947, 'Yvo Desmedt': 1956, 'Joan Daemen': 1965, 'Antoine Joux': 1967, 'Amos Fiat': 1956, 'Daniel Bleichenbacher': 1964, 'Jacques Stern': 1949, 'Paul van Oorschot': 1962, 'Bart Preneel': 1963, 'Taher Elgamal': 1955, 'Shafi Goldwasser': 1958, 'Alex Biryukov': 1969, 'Rafail Ostrovsky': 1963, 'Mitsuru Matsui': 1961, 'Donald Davies': 1924, 'Daniel J. Bernstein': 1971, 'David Chaum': 1955, 'Oded Goldreich': 1957, 'Mihir Bellare': 1962, 'Jean-Jacques Quisquater': 1945, 'Gilles Brassard': 1955, 'Ueli Maurer': 1960, 'Silvio Micali': 1954, 'Scott Vanstone': 1947, 'Don Coppersmith': 1950, 'Bruce Schneier': 1963, 'Wang Xiaoyun': 1966, 'Claude Shannon': 1916, 'Neal Koblitz': 1948, 'Ivan Damgard': 1956, 'Vincent Rijmen': 1970, 'Amit Sahai': 1974, 'Kaisa Nyberg': 1948, 'Alan Turing': 1912, 'Markus Jakobsson': 1968, 'Adi Shamir': 1952, 'Ross Anderson': 1956, 'Whitfield Diffie': 1944, 'Jacques Patarin': 1965, 'Michael O. Rabin': 1931, 'Dan Boneh': 1969, 'Ronald Cramer': 1968, 'Claus-Peter Schnorr': 1943, 'Moni Naor': 1961, 'Horst Feistel': 1915, 'Niels Ferguson': 1965, 'Shai Halevi': 1966, 'Douglas Stinson': 1956, 'Yehuda Lindell': 1971, 'Ralph Merkle': 1952, 'Nigel P. Smart': 1967, 'Lars Knudsen': 1962, 'Victor S. Miller': 1947, 'Arjen K. Lenstra': 1956, 'Paul Kocher': 1973, 'David Naccache': 1967, 'Eli Biham': 1960, 'Tatsuaki Okamoto': 1952, 'Jim Massey': 1934, 'Martin Hellman': 1945, 'Xuejia Lai': 1954 }
```

- Some cryptographer from this list is not a celebrety and the profile infobox is incomplete, at this cases you need to extract the birth year by hand.

Now simply loop into a socket..

![](/content/images/2017/03/Selection_999-028-.png)

Flag: **INS{CENSORED}**

### Full script

<script src="https://gist.github.com/intrd/c6435d9cd77341375943bbbd59322ad2.js"></script>
