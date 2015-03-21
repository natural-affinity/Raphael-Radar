Raphael-Radar
=============
This plugin is a radar or spider chart for the Raphael.js SVG graphics library.

Prerequisites
-------------
* JQuery 1.4.2+
* Raphael.js 1.3.1+
* Nodejs 0.10.x (optional)

Features
--------
* Single Series: editable
* Multi-Series: read-only
* Multi-Series Legend
* Customizable Styles
* Automated Refactor Workflow

Screenshots
-----------
![example](https://raw.githubusercontent.com/natural-affinity/Raphael-Radar/develop/src/images/example.png)

Usage and documentation
-----------------------
Raphael Radar is a browser-based SVG plugin; please see the index.html file
provided for sample usage.


### Setup

Install the Grunt JS CLI to help automate your build-deploy-test workflow:
```bash
$ npm install -g grunt-cli
```

Install all remaining Node JS dependencies via 'npm': 
```bash
$ npm install
```

To build and deploy the plugin simply invoke 'grunt':
```bash
$ grunt
```

Your production-ready artifacts will be created in the 'public' directory:
```bash
$ cd public
```

To build, deploy, and launch a webserver with livereload for testing:
```bash
$ grunt tdd
```

The above will serve deployed files from the 'public' directory and will launch 
a [webserver](http://localhost:9292) for local development.  Any file changes 
will re-trigger the build and deploy process. A refresh of the browser window 
may be required to view the new changes.


### Usage

Include all dependent JS libraries (versions may vary):
```html
<head>
  <script src="assets/js/jquery-1.10.2.min.js"></script>
  <script src="assets/js/raphael-2.1.2.min.js"></script>
  <script src="assets/js/raphael-radar-0.0.5.min.js"></script>
</head>
```

Create an HTML hook for your radar chart widget:
```html
<div id="myChart"></div>
```

Create a JSON object describing your chart:
```javascript
var radar = {
  data: {
    max: 50,
    scores: [[30, 30, 30, 30, 30]],
    labels: ["STR", "VIT", "LCK", "INT", "DEX"]
  },
  size: {
    width: 250,
    height: 275
  },
  style: {
    bg: {"gradient": "270-#fff-#fff:270-#ddd", "stroke-width": "0"},
    polygon: {"stroke": "#555", "stroke-width": "3"},
    scores: [{"fill": "#f90", "fill-opacity": "0.8",
              "stroke-width": "2", "stroke": "#a64"}],
    circle: {'fill': '#888','stroke-width': '0'},
    axis: ["stroke", "#777"],
    label: {'fill': "#555"}
  },
  chart: null
};
```

Initialize the Raphael object, background, and chart with your specs:
```javascript
radar.chart = Raphael("myChart", radar.size.width, radar.size.height);
radar.chart.rect(0, 0, radar.size.width, radar.size.height, 0).attr(radar.style.bg);
radar.chart.radarchart(radar.data, radar.size, radar.style);
```

Wire the radar chart destructor to ensure event cleanup (optional):
```html
<body onunload="radar.chart.destruct()"></body>
```

Special Thanks
--------------
Kurazeko Kyohe ([@tnzk](http://twitter.com/tnzk)) for the original library.  
Tatsuya Ono ([@ono](http://twitter.com/ono)) for the multi-score feature concept.


License
-------
Released under the MIT License.   

**Disclaimer:** Should this license conflict with the original author's wishes, and
any of the original source code remain, this license will be retroactively revoked
and changed to an alternative open-source license.  It is the responsibility
of the user to update his or her copyright information accordingly.
