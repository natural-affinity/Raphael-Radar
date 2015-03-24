Raphael-Radar
=============
Radar chart for the Raphael.js SVG graphics library.

Prerequisites
-------------
* Nodejs 0.10.x

Features
--------
* Single Series: editable
* Multi-Series: read-only
* Multi-Series Legend
* Customizable Styles

Screenshots
-----------
![example](https://raw.githubusercontent.com/natural-affinity/Raphael-Radar/develop/doc/example.png)

Usage and documentation
-----------------------
Please ensure all runtime dependencies have been installed prior to usage.


### Setup

Switch to the project root directory and run the `setup.sh` script (`setup.bat` for Windows):
```bash
$ cd raphael-radar
$ ./bin/setup.sh
```

### Workflow
The `grunt serve` (watch, livereload) loop is designed to accelerate development workflow:
```bash
$ grunt serve
```

Alternatively, to simply run build the plugin, invoke:
```bash
$ grunt build
```

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
