Raphael-Radar
=============
This plugin is a radar or spider chart for the Raphael JS SVG graphics library.

Prerequisites
-------------
* JQuery 1.4.2+
* Raphael 1.3.1+
* NodeJS 0.10.x (optional)

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


### Coming Soon

Additional refactoring coming soon!

Special Thanks
--------------
KURAZEKO Kyohe ([@tnzk](http://twitter.com/tnzk)) for the original library.
