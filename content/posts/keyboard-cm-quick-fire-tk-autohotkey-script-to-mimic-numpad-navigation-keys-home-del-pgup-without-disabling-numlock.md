---
title: "Mech keyboard : Quick Fire TK - Custom Numpad (AutoHotKey script)"
date: "2015-07-31T04:44:54.000Z"
lastmod: "2017-05-19T12:47:31.000Z"
tags: ["hardware", "projects"]
images: ["/content/images/2015/07/photo_2015-07-30_14-53-10.jpg"]
slug: "keyboard-cm-quick-fire-tk-autohotkey-script-to-mimic-numpad-navigation-keys-home-del-pgup-without-disabling-numlock"
url: "/keyboard-cm-quick-fire-tk-autohotkey-script-to-mimic-numpad-navigation-keys-home-del-pgup-without-disabling-numlock/"
---
Bought this amazing mechanical keyboard recently. Chose this model precisely because it is compact, but ended up into one inconvenient. The NUMLK needs to be disabled every time you want to use some of the navigation keys(home, del, pgup..), and yes.. this is really annoying when you're coding.

#### Solution?

As suggested [Reddit friends](https://www.reddit.com/r/MechanicalKeyboards/comments/3euar7/help_cm_quick_fire_tk_theres_any_way_to_push/), I developed an simple AutoHotKey script to mimic these keys by pressing **ctrl+numkey**.

```autohotkey
; Cooler Master QuickFire TK - Hotkey script to mimic Numpad navigation keys (Delete, Home, End, Pgdn, Insert, Pgup) by pressing Ctrl+numpad_key
; URL: http://dan.com.br/keyboard-cm-quick-fire-tk-autohotkey-script-to-mimic-numpad-navigation-keys-home-del-pgup
; Coded by intrd

SendMode Input

^Numpad4:: Send {Delete} 
Return  
^Numpad8:: Send {Home} 
Return  
^Numpad5:: Send {End} 
Return  
^Numpad6:: Send {Pgdn} 
Return  
^Numpad7:: Send {Insert} 
Return  
^Numpad9:: Send {Pgup} 
Return

; Remapping CTRL+Arrow keys too...
^NumpadDot:: Send {Right} 
Return  
^Numpad2:: Send {Up} 
Return  
^Numpad0:: Send {Left} 
Return

;modified version of script for double zero key http://www.autohotkey.com/docs/scripts/Numpad000.htm
#MaxThreadsPerHotkey 5  ; Allow multiple threads for this hotkey.
$Numpad0::
#MaxThreadsPerHotkey 1
; Above: Use the $ to force the hook to be used, which prevents an
; infinite loop since this subroutine itself sends Numpad0, which
; would otherwise result in a recursive call to itself.
SetBatchLines, 100 ; Make it run a little faster in this case.  
DelayBetweenKeys = 30 ; Adjust this value if it doesn't work.  
if A_PriorHotkey = %A_ThisHotkey%  
{
    if A_TimeSincePriorHotkey < %DelayBetweenKeys%
    {
        if Numpad0Count =
            Numpad0Count = 2
        else if Numpad0Count = 0
            Numpad0Count = 2
        else
        {
            Numpad0Count = 0
            Send, =
        }
        CalledReentrantly = y
    Send, {Down}  ; ******* converting 00 key to down arrow
        return
    }
}
Numpad0Count = 0  
CalledReentrantly = n  
Sleep, %DelayBetweenKeys%  
if CalledReentrantly = y  
{
    CalledReentrantly = n
    return
}
Send, {Numpad0}  
return
```
