# Install

```
npm i encurtanet
```

# Simple use example

```js
import { EncurtaNet, noAds, interstitialsAds } from "encurtanet/dist"

(async () => {
    const shortener = new EncurtaNet("YOUR API TOKEN HERE")

    const urlInfo = await shortener.shorten(
        "https://marcuth.github.io/", // Your url
        "url-alias", // Alias of the url
        true, // If response is text format
        noAds // Ads type
    )

    const shortenedUrl = urlInfo.getShortenedUrl()

    console.log(shortenedUrl)
})()

```