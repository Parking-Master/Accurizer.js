# Accurizer.js
A simple Node.js package that can predict the loading time of downloading, uploading, bulk-loading, network speed, and page loading speed.

## What is it?
Do you wish you could get an accurate time predictor for when something is done loading/downloading? We can do that for you!

Its name is based off of the accuracy of the predictor, Accurizer.

## Quick start

### Installing

To install it, simply run:
```bash
$ npm install accurizer
```

To install as a dependency:
```bash
$ npm install accurizer --save
```

### Integration

Now, you will need to require it in your script:
```javascript
const Accurizer = require("accurizer");
```

That's it! Now you can use it.

### Example
This example will predict the loading time of a page on the clients' computer.

```javascript
const Accurizer = require("accurizer");

Accurizer("page", 1, {
  url: "https://example.com"
}).then(prediction => console.log(prediction));

// 1.2 seconds
```

### Arguments
```javascript
Accurizer(_function: String[page | download | load | network | multi], _example: Number | Float, _options: {})
```

- `_function`: A string (`page | download | load | network | multi`) that describes what to do

- `_example`: A number representing how long the time usually takes (for a 1GB download file, try _67 seconds_)

- `_options`: An object with available options listed below:

- - `url`: A full URL of a website. This argument works with `page | download | multi`

- - `sources`: An array of URLs for multiple loading times. This argument works with `load | multi`

- - `average`: A boolean telling whether to use an average loading time. This argument works with `download | multi`

- - `functions`: An array of `_function` options to do multiple functions at once. This argument works with `multi`

### Promise handling
Once Accurizer predicts a loading time, you will need to get it using `.then()` from a Promise function.

```javascript
Accurizer(...).then(prediction => /* Use the time (in seconds) */)
```

### More examples

Predict how long a page takes to load
```javascript
Accurizer("page", 1, {
  url: "https://example.com"
}).then(prediction => console.log(prediction));
```

Predict the download speed of a download file
```javascript
Accurizer("download", 2.5, {
  url: "https://example.com/mydownloadfile.dmg"
}).then(prediction => console.log(prediction));
```

Predict a more accurate download speed of a download file
```javascript
Accurizer("download", 2, {
  url: "https://example.com/mydownloadfile.dmg",
  average: true
}).then(prediction => console.log(prediction));
```

Predict the loading speed sum of multiple URLs
```javascript
Accurizer("load", 4, {
  sources: ["https://example.com", "https://npmjs.com", "https://stackoverflow.com"]
}).then(prediction => console.log(prediction));
```

Predict how long your network takes to download a 10MB file
```javascript
Accurizer("network", 1).then(prediction => console.log(prediction));
```

Link multiple functions and get the total time:
```javascript
Accurizer("multi", 5, {
  functions: ["download", "load", "network"]
  url: "https://example.com/mydownloadfile.dmg",
  sources: ["https://example.com", "https://npmjs.com", "https://stackoverflow.com"]
}).then(prediction => console.log(prediction));
```

## Using CDN
This package works on client-side JavaScript, but it has a few more functions using it like that.

Embed the script tag in your page:
```html
<script src="https://cdn.jsdelivr.net/gh/Parking-Master/Accurizer.js@latest/accurizer.js">
```

Or use the _minified_ version:
```html
<script src="https://cdn.jsdelivr.net/gh/Parking-Master/Accurizer.js@latest/accurizer.min.js">
```

## License
MIT

###### Copyright (c) 2021-2023 Parking Master
