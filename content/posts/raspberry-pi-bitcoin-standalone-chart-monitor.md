---
title: "Bitcoin : Raspberry Pi - Bitcoin standalone chart monitor"
date: "2014-06-18T17:36:07.000Z"
lastmod: "2015-10-22T00:18:58.000Z"
tags: ["bitcoin", "projects", "hardware"]
slug: "raspberry-pi-bitcoin-standalone-chart-monitor"
url: "/raspberry-pi-bitcoin-standalone-chart-monitor/"
---
With this method you will be able to display BitcoinWisdom data or even your custom Tradingview chart into a auto-bootable fullscreen minimalist linux device. The chart stored in the Tradingview can be easily customized from any computer on-the-fly without needing to change anything on Pi.

### Description

This project consists in configure RPi to load a fullscreen **Chromium** instance using the least possible resources. Of course, you can use this same method to display any service you want.

I will show you how to make it from scratch and also provide a ready SD Card image.

> [A video posted by danilo (@intrd)](https://instagram.com/p/opMuN2QQtt/) on May 30, 2014 at 7:02pm PDT

<script async="" defer="" src="//platform.instagram.com/en_US/embeds.js"></script>

### Download SD Card image

1. [RaspberryPi*image*Raspbian*chromium*autoload*fullscreen[v1.1-by*intrd].zip](https://mega.co.nz/#!OEYy2DyB!3cYORl0dsA36923x3zwujSZOU3XJDt_B9AVQQ1nYdvc)
2. Extract image with 7zip   
   Use [w32diskimager](http://sourceforge.net/projects/win32diskimager/files/) to write this image to your SD card (**8gb card minimum**)
3. Halt Pi inicialization w/ the `Emergency halt` method (described at the end of this tutorial) to access terminal as root
4. Reconfigure `/boot/config.txt` (display resolution), `/home/pi/.xinitrc` (service URL and parameters) and /etc/network/interfaces (network configuration)
5. done, reboot

### Creating your own (from scratch)

#### Installing dependences

Considering that you already have Pi running the [pure Raspbian image](https://web.archive.org/web/20140715223414/http://www.raspberrypi.org/downloads), follow the steps below to instal these dependencies:

- matchbox
- chromium
- x11-xserver-utils
- ttf-mscore
- fonts-installer
- xwit
- sqlite3
- libnss3

First, update your distro...

```bash
sudo apt-get update  
sudo apt-get dist-upgrade
```

...then install dependencies

```bash
sudo apt-get install matchbox chromium x11-xserver-utils ttf-mscorefonts-installer xwit sqlite3 libnss3  
sudo reboot
```

#### Setting the fullscreen resolution

Edit the file `/boot/config.txt`, start doing the test using the settings for `1280×720 x 32bit`.

Make several tests(using `startx` command), to get the max resolution supported by your display.

```bash
disable_overscan=1 framebuffer_width=1280  
framebuffer_height=720  
framebuffer_depth=32  
framebuffer_ignore_alpha=1  
hdmi_pixel_encoding=1  
hdmi_group=1
```

#### Preparing X framebuffer and load automatically .xinitrc script

Now edit `/etc/rc.local` to prepare famebuffer to start X and also process our `.xinitrc` script after the Login

```bash
# Print the IP address
_IP=$(hostname -I) || true  
if [ "$_IP" ]; then  
   printf "My IP address is %s\n" "$_IP"
fi

# Wait for the TV-screen to be turned on…
while ! $( tvservice –dumpedid /tmp/edid | fgrep -qv ‘Nothing written!’ ); do bHadToWaitForScreen=true;  
printf "===> Screen is not connected, off or in an unknown mode, waiting for it to become available…\n"  
sleep 10;  
done;

printf "===> Screen is on, extracting preferred mode…\n"  
_DEPTH=32;  
eval $( edidparser /tmp/edid | fgrep ‘preferred mode’ | tail -1 | sed -Ene ‘s/^.+(DMT|CEA) \(([0-9]+)\) ([0-9]+)x([0-9]+)[pi]? @.+/_GROUP=\1;_MODE=\2;_XRES=\3;_YRES=\4;/p’ );

printf "===> Resetting screen to preferred mode: %s-%d (%dx%dx%d)…\n" $_GROUP $_MODE $_XRES $_YRES $_DEPTH  
tvservice –explicit="$_GROUP $_MODE"  
sleep 1;

printf "===> Resetting frame-buffer to %dx%dx%d…\n" $_XRES $_YRES $_DEPTH  
fbset –all –geometry $_XRES $_YRES $_XRES $_YRES $_DEPTH -left 0 -right 0 -upper 0 -lower 0;  
sleep 1;

# autostartx (note: pi is my user)
if [ -f /boot/xinitrc ]; then  
   ln -fs /boot/xinitrc /home/pi/.xinitrc;
   su – pi -c ‘startx’ &
fi  
exit 0
```

… now create `/home/pi/.xinitrc` file (thanks to wcode.org)

```bash
#!/bin/sh
while true; do  
# Clean up previously running apps, gracefully at first then harshly
# killall -TERM chromium 2>/dev/null;
# killall -TERM matchbox-window-manager 2>/dev/null;
# sleep 2; # killall -9 chromium 2>/dev/null;
# killall -9 matchbox-window-manager 2>/dev/null;
# Clean out existing profile information
# rm -rf /home/pi/.cache;
# rm -rf /home/pi/.config;
# rm -rf /home/pi/.pki;
# Generate the bare minimum to keep Chromium happy!
# mkdir -p /home/pi/.config/chromium/Default
# sqlite3 /home/pi/.config/chromium/Default/Web\ Data "CREATE TABLE meta(key LONGVARCHAR NOT NULL UNIQUE PRIMARY KEY, value LONGVARCHAR); INSERT INTO meta VALUES(‘version’,’46′); CREATE TABLE k$
# As you can see.. i’ve disabled all cache cleanup to speedup Chromium start at the known sites (but you can turn this feature depending on your needs)

# Disable DPMS / Screen blanking
xset s off         # don't activate screensaver  
xset -dpms         # disable DPMS (Energy Star) features.  
xset s noblank     # don't blank the video device

# Reset the framebuffer’s colour-depth
fbset -depth $( cat /sys/module/*fb*/parameters/fbdepth );

# Hide the cursor (move it to the bottom-right, comment out if you want mouse interaction)
xwit -root -warp $( cat /sys/module/*fb*/parameters/fbwidth ) $( cat /sys/module/*fb*/parameters/fbheight )

# Start the window manager (remove -use_cursor no if you actually want mouse interaction)
matchbox-window-manager -use_titlebar no -use_cursor no &

# Start the browser (See http://peter.sh/experiments/chromium-command-line-switches/)
# As yoiu can see, i’ve used Bitcoinwisdom, but if you prefer, you can use your Tradingview custom graphics, like https://www.tradingview.com/e/m28VdXEw/#
sleep 10  
sleep 60  
chromium --kiosk "http://bitcoinwisdom.com"  
done;

# stay updated!
# Raspberry Pi @ Bitcoin standalone chart monitor - http://dann.com.br/raspberry-pi-bitcoin-standalone-chart-monitor/
```

#### Auto skipping Login

Edit `/etc/inittab` file and look for this (around line 53)

```bash
#1:2345:respawn:/sbin/getty –noclear 38400 tty1
```

… comment and create a new one

```bash
1:2345:respawn:/bin/login -f pi tty1 </dev/tty1 >/dev/tty1 2>&1  
# where pi is my username
```

#### Force static IP on eth0 (for ethernet PI users)

Considering that its a Graphical standalone monitor, it’s a good idea to cable and force static IP, to do this edit `/etc/network/interfaces` with this sample

```bash
auto lo  
iface lo inet loopback  
auto eth0  
allow-hotplug eth0  
iface eth0 inet static  
address 10.0.0.22  
netmask 255.0.0.0  
gateway 10.0.0.1  
network 10.0.0.0  
broadcast 10.0.0.255
```

done, just reboot your Pi.

### Tips

#### Emergency halt (to enable direct access to terminal)

When Pi is booting and showing the line: `Print the IP address..`

Start pressing `repeatedly Ctrl+C`, only stop when you’re at the prompt, like this...   
![](/content/images/2015/08/image44.png)

#### Removing the Bitcoinwisdom Ads

Yes, you can remove the Bitcoinwisdom ads by using a [Chromium extension](https://chrome.google.com/webstore/detail/bitcoinwisdom-ads-remover/mbeapikemjncbclndfpnijhgbmahahab).

But I highly recommend you pay at least once time the Premium Bitcoinwisdom, considering it is one of the best tools ever invented and the developers deserve some support.

#### Bitcoinwisdom price sound alerter

Use this Chromium extension to enable sound notifications to get informed when a price change occurs based on your criteria.

- Sound alerter chrome Extension – <https://chrome.google.com/webstore/detail/bitcoinwisdom-sound-alert/fmhacmihfjdgiikjcghjmffajebcgjpb>

### Stay updated and give some feedback

![](/content/images/2015/08/image45.png)

### References

- Bitcointalk.org official thread: <https://bitcointalk.org/index.php?topic=658488.msg7405156#msg7405156>
- /r/bitcoin – <http://reddit.com/r/bitcoin>
- Wired – Raspberry Pi + Kiosk mode – <http://blogs.wcode.org/2013/09/howto-boot-your-raspberry-pi-into-a-fullscreen-browser-kiosk/>
