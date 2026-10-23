---
title: "SHX10 : misc100-thx"
date: "2017-05-23T01:24:00.000Z"
lastmod: "2017-06-05T15:25:00.000Z"
tags: ["python", "shx10", "pil", "programming", "image manipulation", "ctf"]
slug: "shx10-misc100-thx"
url: "/shx10-misc100-thx/"
---
Can you read the flag?

## Solution

So, i've received only the image `shuffled.png`

![](/content/images/2017/05/Selection_999-075-.png)

It seems that the challenger pasted the flag four times then shuffled it somehow..

![](/content/images/2017/05/Selection_999-076-.png)

Taking a closer look we can see what possibly happened. The image was cutted in `1px` lines then shuffled!

Well, we need to unshuffle it, but how? Doing by hand is not an option.

I started by cropping it from image..

![](/content/images/2017/05/shuffled1.png)

..then, wrote a script to:

- slice the image line by line, 1px of height
- put filenames into an array
- shuffle the array
- rejoin the pieces
- loop it **N** times and join the results

<script src="https://gist.github.com/intrd/4cc3eab3a5d8cf815ca69b2616000f4a.js"></script>

**Sliced samples**

![](/content/images/2017/05/slice_test1_93.png)
![](/content/images/2017/05/slice_test1_92.png)
![](/content/images/2017/05/slice_test1_91.png)
![](/content/images/2017/05/slice_test1_90.png)
![](/content/images/2017/05/slice_test1_89.png)

### Result

The result is `flag.jpg`, a big file w/ 100 iterations..

![](/content/images/2017/05/result.gif)

And luckly you will get a readable iteration..

![](/content/images/2017/05/Selection_999-082-.png)

if not, try again until you get!

> The title tip `Thx` helped me a lot!

## References

- Stackoverflow - Cutting one image into multiple images using the Python Image Library -
  <https://stackoverflow.com/questions/6059217/cutting-one-image-into-multiple-images-using-the-python-image-library>
- Stackoverflow -
  Combine several images horizontally with Python
  -
  <https://stackoverflow.com/questions/30227466/combine-several-images-horizontally-with-python>
