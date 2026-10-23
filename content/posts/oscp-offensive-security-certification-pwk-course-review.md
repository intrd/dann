---
title: "OSCP : Offensive Security Certification & PWK review"
date: "2018-02-25T16:59:00.000Z"
lastmod: "2018-03-08T17:26:10.000Z"
tags: ["oscp", "offensive security", "review", "penetration test"]
slug: "oscp-offensive-security-certification-pwk-course-review"
url: "/oscp-offensive-security-certification-pwk-course-review/"
---
The end of 2017 was intense for me, I attended to do the most complete hands-on penetration testing course, the well renowned Offensive Security’s PWK, and got my **Offensive Security Proffesional Certification**.

In this review I will be talking about my preparation, my exceptional experience with the PWK Labs, the insane 24 hour exam that leaded me to OSCP certification and of course I will share some important tips.

## My background

The idea of doing OSCP appeared during the year of 2017 when I spent the whole year participating of CTF(capture-the-flag) competitions.

![](/content/images/2018/02/gc.png)
Playing for **h3x_pr0ph3ts**, the [Morphus Labs](https://morphuslabs.com/) team @ [Global Cyberlympics Finals](https://www.cyberlympics.org/global-cyberlympics-world-finals-makes-international-news/), Netherlands

This same **Morphus Labs** team developed [shellterlabs.com](http://shellterlabs.com/), a awesome plataform to help anyone who wants to join on this CTF world and improve your hacking skills by solving challenges. They have also developed a itinerant platform and are always hosting hacking competitions by the country.

I also had the pleasure of collaborating with this platform and writing the [binary exploitation tutorial/challenges](https://shellterlabs.com/en/training/get-started/writing-exploits/).

![](/content/images/2018/02/Selection_999-488-.png)
Playing for **p4f** @ [DC5561 DEFCON Group Brasilia](https://twitter.com/dc5561)

**p4f** is the team that I created thinking of improving members hacking skills focusing on CTFs and knowledge sharing. More about p4f [here](/ctf/).

### CTF versus PWK/OSCP

Different from CTFs that looks like more a game with a specific categorized challenge, the PWK/OSCP are focused on a **professional penetration test**, an authorized attack on a computer system.

Offsec provides you a corporation environment to identify/exploit weaknesses in order to gain access to the system's features and data which will be used in a way to compromise the entire environment.

I am always interested on **sharpening my hacking skills**, never moved professionally with pentest and I thought the OSCP would be a good start.

## Preparation

With an idea of what would lie ahead, I decided to leave CTF aside and joined [hackthebox.eu](https://www.hackthebox.eu).

Hack The Box is an online platform allowing you to test your penetration testing skills and exchange ideas and methodologies with other members of similar interests. It is a collaborative environment that contains several machines that are constantly updated. Some of them simulating real world scenarios.

![](/content/images/2018/02/Selection_999-502-.png)

The complete list of machines I've owned before starting the PWK course are detailed on the screenshot below.

![](/content/images/2018/02/Selection_999-489-.png)

I struggled on each one of them, they had just been released, no published write-ups and I always refused the most to run behind tips. There are some machines that I got stuck than 1 week. This way of thinking was crucial to success in PWK lab.

### Differences between HTB and PWK Lab

People always ask about the difficulty of PWK/OSCP versus HTB. It's different.

Along HTB you will find awesome machines much more technically difficult to exploit than machines found on PWK lab. But PWK is focused on a real corporation environment. The network has life!

> The flag means nothing. Some machines has dependencies from things that you leaked from a deep packet inspection in another machine inside a internal network that you compromised by orchestrating a client-side attack!

You need to be attentive to the big picture all the time. Trust me, this can be very hard sometimes.

## Tools

Offsec provided the course materials and a **Kali VMware Image** created especially for the course with all the tools that you will theoretically need.

I already have my own custom Kali VM that i've created for my needs, but since Offsec recommended using this for the course, I left my VM aside.

### Converting the VMWare image to VirtualBox

I particularly do not like using VMWare, so I converted the VM to a Virtualbox Machine using **ovftool**.

`ovftool "/path/to/pwk-kali-vm.vmx" "/path/to/pwk-kali-vm.ovf"`

If you need more details, follow [this guide](https://www.maketecheasier.com/convert-virtual-machines-vmware-virtualbox/).

### VM Customization

As recommended I didn't updated the entire Kali installation, just changed the default Kali Window Manager to **XFCE4** and did a few personal customizations.

![](/content/images/2018/02/oscp_desktop.png)

The outdated Kali packages I updated later individually as needed.

### Additional tools

The PWK course forces you to avoid automated tools and focus on doing the things as raw as possible. This is the best way to learn. This way I just have a few tools to recommend.

- [Cherrytree](https://www.giuspen.com/cherrytree/) - Cherrytree is a hierarchical note taking application, featuring rich text and syntax highlighting.

![](/content/images/2018/02/Selection_999-501-.png)

I think this is the best tool I can recommend here! During every stage of OSCP you will need to take notes, screenshots and stay organized as it will accumulate a lot of information. With all this information well organized, it will be easy to generate the reports at the end.

- [SPARTA - Network Infrastructure Penetration Testing](https://github.com/SECFORCE/sparta): This is a python application which simplifies the scanning on the 1st enumeration phase. This tool was developed by a guy while taking the PWK course and it is a awesome time-saver that gives you a overview of the target.
- [terminator](https://github.com/janisozaur/terminator) - Like [tmux](https://gist.github.com/MohamedAlaa/2961058), this tool allows you arranging terminals in grids. You can create more terminals by right clicking on one and choosing to split. This is very useful here, Its normal your screen will w/ 7+ running terminals.
  it vertically or horizontally.
- [gliffy](https://www.gliffy.com/) - Online diagramming tool alternative to MS Visio. This was very useful to illustrate some details of the network in the report.
- [sshuttle](https://github.com/sshuttle/sshuttle) - After understanding how dynamic tunneling and port forwarding works with SSH, try this tool. This is where transparent proxy meets VPN meets SSH. It will help you a lot on pivoting.
- [enum.py](https://www.securitysift.com/download/linuxprivchecker.py) - Scripted local linux wnumeration & privilege escalation checks. The real gem of this script is the recommended privilege escalation exploits given at the conclusion of the script. This is a great starting point for escalation.
- [enum.sh](https://github.com/rebootuser/LinEnum) - Alternative to above, useful when the machine has no Python installed.
- [windows-privesc-check2](https://github.com/pentestmonkey/windows-privesc-check) - This is standalone executable that runs on Windows systems. It tries to find misconfigurations that could allow local unprivileged users to escalate privileges to other users or to access local apps.
- [shutter](http://shutter-project.org/) - The best linux feature-rich screenshot tool!
- [nozzlr](https://github.com/intrd/nozzlr) - Nozzlr is a multithread bruteforcer, trully modular and script-friendly. The other bruteforce tools are amazing, but the hardcoded parameters make it painful to script over complex tasks. Nozzlr comes to solve this problem. All your task parameters/engine is managed directly in the task template(a python script). This tool was developed by me, feel free to help me w/ this project!

So, these are the additional tools that I used, many others are covered by the PWK course materials.

## The PWK Course

Feeling prepared I joined on PWK Labs Network at 16/Dec 2017 and started my journey to OSCP.

![](/content/images/2018/02/Selection_999-492-.png)

Initially I bought only **30 days** of course (not recommended, buy **60 days minimum**, I will explain why), so I tried to save as much time as possible in the materials and exercises.

This way I finished my studies in just 2 days, focusing only on the points I was not yet familiar with.

The course materials is a good start to build your **cheat-sheet**, take note of every command because you will need to reuse it later a lot of times.

The course also covers a **Windows/Linux buffer overflow**, this is one of the most technical part and it scares a lot of people. I decided to leave it aside and **study when I had finished the Labs**, so I would get this subject on the exam with **fresh memory** and this proved to be a good decision.

## PWK Network

The network is awesome, as I mentioned before, this simulates a corporation network with life.

![](/content/images/2018/02/Selection_999-503-.png)

Offsec gives to you a **VPN** access to the Public Network and your task is to [hack all the things](https://www.youtube.com/watch?v=FoUWHfh733Y)! **50+ hosts**, **1 public network and 3 internal**. A wide variety of systems.

The techniques/exploits used to compromise each target rarely recur. Some machines are not directly exploitable and you need to lead a client-side attack or use leaked data from another network to compromise this targets.

So, in 30 days I compromised about **35 machines**. Knowing that I would not have enough time to finish the labs I decided to extend my access for **+30 days**.

After spending almost 2 months fully dedicated to OSCP, I finally compromised the **entire lab**(50+ machines) and I still have **7 days** to review some points and already prepare my **PWK Lab Report**.

![](/content/images/2018/02/Selection_999-507-.png)

Offsec provides you some templates that you can use to write your report. The PWK Labs Report gives you **5 additional points**.

### Recommendations regarding PWK Labs

- The forum is very useful to learn and share alternative methods of compromising the same target. Avoid using this to get tips! Use it only when you are really stuck for days! Trust me, the **rabbit roles teaches much more than a direct tip**.
- The lab was created in 2014 and updated recently but some machines are vulnerable to recent exploits that take you directly to administrator access w/ a single skiddie shot, skiping all over indented way. **It's not a speedrun!** Try to find the **intended way** to compromise each target.
- Don't be scared about that **big four** technically hardest machines that everyone talks about. You will face much worse challenges in the lab, simple things that end in a beautiful facepalm.

## The brutal 24 hour exam timeline

**13:00** - Feeling very confident, I received the email containing details for VPN access to the Exam network including a debugging VM. In order to pass I would need score **70+ points**.

I properly enumerated all the targets and already outlined a strategy. I decided to start with the machine that was technically more difficult and also gave a good amount of points.

**15:00** - Thanks to my studies, mastering the technique, I owned this machine so fast. This has already made me feel good to continue. So I left the lowest scoring machine (10 pts) for the final and went on to deeply enumerate the other 3 machines.

**22:00** - Things were starting to get complicated, this task took me a lot of hours and finally I popped a low-privilege shell on a 20 pts machine and got a very restricted access to another 20 pts one.

**01:30** - Finally owned the 20 pts machine and quickly owned the 10 pts machine.

Now with 55 pts, knowing that I would only need to finish one of the two remaining machines, one of which I already had low-priv access, very mentally exhausted I decided to take a nap.

**06:00** - Of course I slept very poorly, woke up about 6 a.m. and I decided to continue my journey.

**10:00** - After entering the deepest and darkest rabbit hole ever I finally got administrator access on that machine totaling 75 pts, enough to pass.

**12:45** - Now with a fresh head, without pressure, leaving only one machine to complete the 100 pts I got a low-priv access on the last one, then my suddenly VPN dropped! **Time is over**! I did not even have time to dump the user level proof.

But okay, feeling happy that I had passed the exam I went back to sleep and I woke up later.

**18:00** - After a good rest, very focused, very careful not to let anything behind, following all the rules, I wrote the Exam Report.

I also sent my entire raw pentest data that I created w/ Cherrytree. It's not necessary but it was proof that I fought for every target along PWK Labs and Exam.

![](/content/images/2018/02/Selection_999-504-.png)

And finally, 24 hours after publishing my report I received the confirmation through the well desired email, all my hard work paid off.

I will miss the OSCP labs access, but for sure I will continue on the forum helping everyone who need nudges on PWK Labs and learning even more through alternative solutions.

## Conclusions

Different from other certifications that is all about theory and multiple choice questions, OSCP/PWK is a trully **hands-on** certification that puts you to the test in every possible way.

The admins are very professional, they have a protocol for everything. And they build an awesome community behind.

I strongly recommend it for everyone who wants to start in this area and also for those who already work with.

Regardless of your skills, be **Humble**, you will **Try harder**.

<iframe allow="autoplay" frameborder="no" height="166" scrolling="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/190459005&amp;color=%23446c74&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true" width="100%"></iframe>

## Resources

- Shellterlabs : Writing exploits - <https://shellterlabs.com/en/training/get-started/writing-exploits/>
- Shellter Hacking Express challenges - <https://shellterlabs.com/en/contests/challenges/?event=10>
- Windows BOF PCMan FTP - <http://netsec.ws/?p=180>
- Hack the box - <http://hackthebox.eu>
- Nishang : PowerShell scripts - <https://github.com/samratashok/nishang>
- Windows Privilege Escalation Fundamentals - <http://www.fuzzysecurity.com/tutorials/16.html>
- Basic Linux Privilege Escalation - <https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/>
- Pentest Tips and Tricks - <https://jivoi.github.io/2015/07/01/pentest-tips-and-tricks/>
- Nmap cheat sheet - <https://highon.coffee/blog/nmap-cheat-sheet/>
- SANS Institute : Port Knocking basics - <https://www.sans.org/reading-room/whitepapers/sysadmin/port-knocking-basics-1634>
- Teck_K2 OSCP review - <https://teckk2.github.io/category/OSCP.html>
- m4lv0id OSCP review - <https://medium.com/@m4lv0id/and-i-did-oscp-589babbfea19>
- The definitive hacking playlist - <https://soundcloud.com/intrd/sets/hacking>
