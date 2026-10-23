---
title: "Powerful USB stick : Grub2 booting Mint, Tails and Hirens + (storages NTFS and ext4 LUKS encrypted)"
date: "2015-09-17T13:18:00.000Z"
lastmod: "2016-03-23T08:24:00.000Z"
tags: ["linux"]
images: ["/content/images/2015/09/photo_2015-09-17_13-18-1r3-1.jpg"]
slug: "grub2-multiboot-usb-linux-mint-tails-and-hirens-boot-cd-luks-encrypted-partition"
url: "/grub2-multiboot-usb-linux-mint-tails-and-hirens-boot-cd-luks-encrypted-partition/"
---
A perfect USB stick for me need in addition to storing files, be a powerful tool for all situations.

Thinking about it, I used the GRUB2 and some tricks to create a bootable stick that runs perfectly:

- Hirens Boot CD 15.2 (Backup & Rescue tools)
- Linux Mint 17.2 (fully functional Live Linux w/ persistence)
- Linux Tails 1.5.1 (privacy and anonymity tasks)

**Partitions**

- NTFS partition (with most of the space of the USB stick to store and access files at all O/Ss)
- Ext4 LUKS encrypted partition, AES-256+password (to store your sensitive files)

** You can add more distros and bootable tools, but for every one will have to adapt the grub config entries.*

### Multi-boot with GRUB

Using a flash drive with at least **8GB**, let's start identifying the stick `disk_device`.

#### Identifying the USB stick disk_device

Open a terminal and..

```bash
sudo su
```

...to get necessary privileges, then

```bash
fdisk -l
```

![](/content/images/2015/09/Selection_005.jpg)
Fdisk is showing that my 64gb `disk_device` is `/dev/sdc`, and his partition_device(s) `/dev/sdc1, /dev/sdc2 and /dev/sdc3`

#### Cleaning USB stick

Use command below to clear partitions and MBR (take care)

```bash
dd if=/dev/zero of=[disk_device] bs=512 count=1
```

...alternatively you can clear partitions, MBR and wipe all data to prevent recover (takes time)

```bash
dd if=/dev/zero of=[disk_device] iflag=nocache oflag=direct bs=4096
```

.. with Shred (this one shows a progress of wiping)

```bash
shred -v [disk_device]
```

#### Creating multi-boot partition

This partition will contain all the config of our boot manager (grub2) and also all files and ISOs needed to boot our tools and distros.

```bash
fdisk [disk_device]
```

(my case: fdisk /dev/sdc)

...inside fdisk, type the following commands

```
n (to create a new partition)  
p (for primary partition)  
1 (to create the first partition)  
Press Enter (to use the first cylinder)  
+5G and Enter (to create a partition w/ 5 Gigabytes)
a (for activate)  
1 (to mark the first partition active "bootable")  
t (for partition type)  
c (to use fat32 partition)  
w (to write the changes and close fdisk)
```

ok, now create the file system

```bash
umount [partition_device]  
mkfs.vfat -F 32 -n MULTIBOOT [partition_device]
```

(my case: mkfs.vfat -F 32 -n MULTIBOOT /dev/sdc1)

#### Installing GRUB

Start mouting the partition

```bash
mkdir /mnt/USB && mount [partition_device] /mnt/USB
```

...and install the Grub2

```bash
grub-install --force --no-floppy --boot-directory=/mnt/USB/boot [partition_device]
```

You can ignore Warnings like `Attempting to install GRUB to a disk with multiple partition labels. This is not supported yet..`, it's normal. But this command needs to run without errors like `Installation is impossible. Aborting`.

Depending the version of Grub is installed on your system and how it is configured(EFI systems), you can get this error. In this is case you need to find your grub-install flags, `grub-install --help` may can help you. Or look for another machine to do this step.

#### Installing Linux ISOs

Now we will download our two bootable Linux ISOs

```bash
mkdir /mnt/USB/iso/  
cd /mnt/USB/iso/  
wget "ftp://ftp.heanet.ie/pub/linuxmint.com/stable/17.2/linuxmint-17.2-xfce-32bit.iso" -O linuxmint.iso  
wget "http://dl.amnesia.boum.org/tails/stable/tails-i386-1.5.1/tails-i386-1.5.1.iso" -O tails.iso
```

**If when you're reading this article, any of this links are broken, google for it!

#### Hirens structure

Hirens needs a tricky structure to boot with grub2.

Start downloading the Hirens ZIP

```bash
wget "http://www.hirensbootcd.org/files/Hirens.BootCD.15.2.zip" -O hirens.iso
```

Open the ZIP with your file manager, and open **Hiren's.BootCD.15.2.iso** inside   
![](/content/images/2015/09/Selection_007.jpg)

Extract the `HBCD` folder to your USB root `/mnt/USB/` and go to `/mnt/USB/HBCD/Dos/`, right click at `dos.gz` and extract `dos.img`   
![](/content/images/2015/09/Selection_010.jpg)

Now right click `dos.img` and open with your **Disk Image Mounter**   
![](/content/images/2015/09/Selection_011.jpg)
...extract and move `grub.exe` to your USB root `/mnt/USB/`.

```
> @vikas feedback:
..tried and tested from lubuntu12.04 live usb. A note dos.img did not got mounted via GUI i used this command "mount dos.img /mnt -o loop"
```

Final dir. structure looks this..

![](/content/images/2015/09/Selection_008-1.jpg)
..and `/iso/`
![](/content/images/2015/09/Selection_012.jpg)

#### GRUB2 configuration file for Mint, Tails and Hirens

Now we will create and edit **grub.cfg** file w/ menu entry args for every tool

```bash
grub-mkconfig -o /mnt/USB/boot/grub/grub.cfg  
cd /mnt/USB/boot/grub  
rm grub.cfg  
wget pendrivelinux.com/downloads/multibootlinux/grub.cfg  
nano /mnt/USB/boot/grub/grub.cfg
```

Replace **grub.cfg** w/ this content

```
set timeout=10  
set default=0

menuentry "LINUX MINT" {  
 loopback loop /iso/linuxmint.iso
 linux (loop)/casper/vmlinuz file=/cdrom/preseed/mint.seed boot=casper initrd=/casper/initrd.lz iso-scan/filename=/iso/linuxmint.iso noeject noprompt splash --
 initrd (loop)/casper/initrd.lz
}

menuentry "LINUX TAILS" {  
 loopback loop /iso/tails.iso
 linux (loop)/live/vmlinuz boot=live config live-media=removable nopersistent noswap noprompt timezone=Etc/UTC block.events_dfl_poll_msecs=1000 splash nox11autologin module=Tails quiet
 initrd (loop)/live/initrd.img
}

menuentry "HIRENS TOOLS" {  
 linux16 /grub.exe —config-file="find —set-root /HBCD/menu.lst; configfile /HBCD/menu.lst" 
}
```

okay, let's test!

#### Testing Multi-boot..

Boot your PC from your USB stick and you will get this menu   
![](/content/images/2015/09/photo_2015-09-17_13-18-13.jpg)

To test linux distros, just start and see if they're booting properly.   
![](/content/images/2015/09/linux-mint-17-2-rafaela-officially-out-with-cinnamon-2-6-screenshot-tour-485684-4.jpg)
![](/content/images/2015/09/url.jpeg)

To test Hirens, try to start `Parted Magic` and `Mini WinXP`, if these two tools are working, whole Hirens are working!   
![](/content/images/2015/09/photo_2015-09-17_13-19-18.jpg)
![](/content/images/2015/09/photo_2015-09-17_13-19-26.jpg)
![](/content/images/2015/09/photo_2015-09-17_13-37-08.jpg)
..if not, check again your `grub.cfg` paths and directory structure.

### Creating Default & Encrypted storage

With your multiboot ok, let's create additional partitions for storage.

Install and run `gparted`

```bash
sudo apt-get install gparted  
sudo gparted
```

At the top right of gparted screen, choose your USB `disk_device` and..

1. create a new `NTFS` partition using the most of the space of the USB stick, leaving about 5gb to last partition.
2. with this resting 5gb, create a new `ext4` partition.

Save and apply, your gparted window need looks like this   
![](/content/images/2015/09/Selection_013.jpg)

Close the `gparted` window, back to terminal

```bash
sudo cryptsetup -y -v luksFormat /dev/[partition_device_of_your_5gb_partition]
```

Type a password for this partition,   
...yes, choose a very strong password!

When it finish, unplug/plug USB stick, type a password to unlock your encrypted partition. You will get an `Invalid Format` error, its normal..

Just open `Disks` utility and format the last partition(not LUKS partition) as `ext4`.

And, done!   
![](/content/images/2015/09/Selection_014.jpg)

### Persistence at Linux Mint

To enable persistence at Linux Mint, you need another ext4 partition.

1. Extract the Mint ISO to this partition root,
2. Update `grub.cfg` paths pointing to it
3. Delete `casper-rw` file, more details [here](http://tuxtweaks.com/2014/03/create-linux-mint-persistent-live-usb/).

All done,   
Feedback please.

### Refs

- GNU GRUB2 Manual - [https://www.gnu.org/software/grub/manual/html*node/Installing-GRUB-using-grub*002dinstall.html](https://www.gnu.org/software/grub/manual/html_node/Installing-GRUB-using-grub_002dinstall.html)
- Bootable USB on Ubuntu from Hiren's Boot CD ISO for Windows? - <http://askubuntu.com/a/598974>
- Boot Multiple ISO from USB via Grub2 using Linux - <http://www.pendrivelinux.com/boot-multiple-iso-from-usb-via-grub2-using-linux/>
- How To Create a Linux Mint Persistent Live USB - <http://tuxtweaks.com/2014/03/create-linux-mint-persistent-live-usb/>
