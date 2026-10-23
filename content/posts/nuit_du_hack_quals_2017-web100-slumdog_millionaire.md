---
title: "Nuit du Hack quals 2017 : web100-slumdog_millionaire"
date: "2017-04-02T11:23:51.000Z"
lastmod: "2017-06-05T15:26:41.000Z"
tags: ["ctf", "web security", "programming", "ndhquals2k17"]
slug: "nuit_du_hack_quals_2017-web100-slumdog_millionaire"
url: "/nuit_du_hack_quals_2017-web100-slumdog_millionaire/"
---
The PiggyBank corporation has dediced to open source its new gambling application, SlumdogMillionaire! Since then, it has become a world phenomenon. They are particularly proud of their new algorithm and hope to prove their game is fair by giving "Carte Blanche" for anyone to audit their code!

![](/content/images/2017/04/Selection_339.png)

**SlumdogMillionaire, part of source code**

```python
#!/usr/bin/python2.7
import random  
import config  
import utils

random.seed(utils.get_pid())  
ngames = 0  
def generate_combination():  
    numbers = ""
    for _ in range(10):
        rand_num = random.randint(0, 99)
        if rand_num < 10:
            numbers += "0"
        numbers += str(rand_num)
        if _ != 9:
            numbers += "-"
    return numbers

def reset_jackpot():  
    random.seed(utils.get_pid())
    utils.set_jackpot(0)
    ngames = 0

def draw(user_guess):  
    ngames += 1
    if ngames > config.MAX_TRIES:
        reset_jackpot()
    winning_combination = generate_combination()
    if winning_combination == user_guess:
        utils.win()
        reset_jackpot()
```

## Solution

So, how to guess the next winning combination?   
Looking at the code(python2.7), the combination is a random sentence based on a custom seed.

```python
#!/usr/bin/python2.7
...
random.seed(utils.get_pid())  
...
```

The seed is some [linux pid](https://en.wikipedia.org/wiki/Process_identifier) number, and remains the same for your session/IP until you hit the `config.MAX_TRIES==10000`. We don't have access to `config` but you can discover this by bruteforce, forcing the jackpot reset.

Well, if you guess the seed, you are able to generate all the next winning numbers for current session.

> Under Linux, the maximum process ID is given by the pseudo-file `/proc/sys/kernel/pid_max`

![](/content/images/2017/04/Selection_340.png)
There's only `32768` possible seeds! But, which pid my session is using?

1. Go to website and get some of the latest winning numbers. If you no longer have access to the first 10 numbers, bruteforce it until hit 10k max tries and reset the session.
2. Pick the first winning number and check which seed matches on a `python2.7` loop in range `0..32768`.
3. Using the matched seed, generate the next winning numbers.
4. Win.

### Final code

```python
#!/usr/bin/python2.7
import random

user_guess = "39-67-24-84-62-02-71-37-03-67" #current session first winning number

for i in range(0,32769):  
    def generate_combination():
        numbers = ""
        for _ in range(10):
            rand_num = random.randint(0, 99)
            if rand_num < 10:
                numbers += "0"
            numbers += str(rand_num)
            if _ != 9:
                numbers += "-"
        return numbers

    random.seed(i)
    winning_combination = generate_combination()

    if winning_combination == user_guess:
        print user_guess
        for _ in range(0,10):
            print generate_combination()
```

![](/content/images/2017/04/Selection_337.png)
![](/content/images/2017/04/Selection_333.png)

### Alternative solution

If you are fast enough, running a multi-thread script you are able to get the last winning combination and replay before the server fully processes the last request.

![](/content/images/2017/04/Selection_329.png)

It did not work for me because the server was all time overloaded, but I think it's possible.
