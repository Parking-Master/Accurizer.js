Accurizer = function(_function, _example, _options) {
  return new Promise(function(endResolve, reject) {
    function read(string) {
      let oldString = string;
      string = string.toLowerCase().trim().replace(/\n/gi, "");
      if (/[a-zA-Z]/g.test(string)) {
        return string;
      } else throw new Error("The function argument includes invalid characters: `" + oldString + "`");
    }
    async function checkNetworkBandwidth() {
      return new Promise(function(resolve, reject) {
        let test_start = new Date();
        fetch("/network_test.txt").then(function() {
          let test_end = new Date();
          resolve(10 / (test_end - test_start));
        });
      });
    }

    if (read(_function) == "page") {
      let imports = document.querySelectorAll("script[src]").length;
      let sources = Object.values(document.querySelectorAll("script[src]")).map(x => { return x.src });
      let totalBytes = 0;
      let ready = false;
      if (sources.length < 1) ready = true;
      sources.forEach(src => {
        fetch(src).then(x => { return x.text() }).then(response => {
          let size = response.toString().length;
          totalBytes += size;
          if (sources.indexOf(src) + 1 >= sources.length) ready = true;
        });
      });
      let checkTotal = setInterval(async () => {
        if (ready) {
          let bandwidth = checkNetworkBandwidth().then(bytesPerSecond => {
            bytesPerSecond = bytesPerSecond * 1024 * 1024;
            let sourceBytes = totalBytes;
            let prediction = (((bytesPerSecond / sourceBytes) / 60) / 2).toFixed(1);
            if (prediction - 1 <= _example - 0 && prediction + 1 >= _example - 0) {
              endResolve(prediction);
            } else endResolve(prediction < _example - 0 ? prediction * 2 : prediction / 2);
          });
          clearInterval(checkTotal);
        }
      });
    } else if (read(_function) == "download") {
      if (_options.average) {
        let times = [];
        for (let i = 0; i < 3; i++) {
          let url = _options.url;
          let old = Date.now();
          fetch(url).then(() => {
            let time = Date.now() - old;
            let prediction = (time * 2) / 1000;
            prediction = prediction.toFixed(1) - 0;
            if (prediction - 1 <= _example - 0 && prediction + 1 >= _example - 0) {
              times.push(prediction);
            } else times.push(prediction < _example - 0 ? (prediction * 2) : (prediction / 2));
          });
          if (i + 1 >= 3) {
            setTimeout(() => endResolve(((times[0] + times[1] + times[2]) / 3).toFixed(1) - 0), 500);
          }
        }
      } else {
        let url = _options.url;
        let old = Date.now();
        fetch(url).then(() => {
          let time = Date.now() - old;
          let prediction = (time * 2) / 1000;
          prediction = prediction.toFixed(1) - 0;
          if (prediction - 1 <= _example - 0 && prediction + 1 >= _example - 0) {
            endResolve(prediction);
          } else endResolve(prediction < _example - 0 ? prediction * 2 : prediction / 2);
        });
      }
    } else if (read(_function) == "load") {
      let times = [];
      if (typeof _options.sources == "string") {
        if (_options.sources == "script") _options.sources = Object.values(document.querySelectorAll("script[src]")).map((e) => { return e.src });
        if (_options.sources == "link") _options.sources = Object.values(document.querySelectorAll("link[href]")).map((e) => { return e.href });
      }
      if (_options.sources.length < 1) return endResolve(0);
      _options.sources.forEach(url => {
        let old = Date.now();
        fetch(url).then(() => {
          let time = Date.now() - old;
          let prediction = (time * 2) / 1000;
          prediction = prediction.toFixed(1) - 0;
          if (prediction - 1 <= _example - 0 && prediction + 1 >= _example - 0) {
            times.push(prediction);
          } else times.push(prediction < _example - 0 ? (prediction * 2) : (prediction / 2));
        });
        if (_options.sources.indexOf(url) + 1 >= _options.sources.length) {
          setTimeout(() => endResolve((((times.reduce((a, b) => { return a + b }, 0))) / 2).toFixed(1) - 0), 500);
        }
      });
    } else if (read(_function) == "multi") {
      let orders = [];
      _options.functions.forEach(x => {
        if (x == "link") {
          Accurizer("load", Math.random() * 3, {
            sources: "link"
          }).then(speed => orders.push(speed));
        }
        if (x == "script") {
          Accurizer("load", Math.random() * 3, {
            sources: "script"
          }).then(speed => orders.push(speed));
        }
        if (x == "download") {
          Accurizer("download", Math.random() * 5, {
            url: _options.url,
            average: true
          }).then(speed => orders.push(speed));
        }
        if (x == "load") {
          Accurizer("load", Math.random() * 5, {
            sources: _options.sources
          }).then(speed => orders.push(speed));
        }
        if (x == "page") {
          Accurizer("page", Math.random() * 2).then(speed => orders.push(speed));
        }
        if (_options.functions.indexOf(x) + 1 >= _options.functions.length) {
          setTimeout(() => {
            let prediction = orders.reduce((a, b) => { return a + b }, 0).toFixed(1) - 0;
            endResolve(prediction);
          }, 500);
        }
      });
    }
  });
}