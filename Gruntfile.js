'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var gconf = {
    src: {
      root: 'src',
      scripts: 'src/scripts'
    },
    dist: {
      root: 'dist',
      scripts: 'dist/scripts'
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pretty: grunt.option('pretty') || true,
    gconf: gconf,
    clean: {
      dist: ['<%= gconf.dist.root %>']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= gconf.src.scripts %>/**/*.js'
      ]
    },
    uglify: {
      options: {
        compress: true,
        expand: true,
        dot: true,
        mangle: {
          except: ['jQuery', 'Raphael']
        }
      },
      libs: {
        files: {
          '<%= gconf.dist.scripts %>/lib.min.js': [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/raphael/raphael-min.js'
          ]
        }
      },
      dist: {
        files: {
          '<%= gconf.dist.scripts %>/<%= pkg.name %>-<%= pkg.version %>.min.js': [
            '<%= gconf.src.scripts %>/<%= pkg.name %>.js'
          ]
        }
      }
    },
    jade: {
      options: {
        pretty: '<%= pretty %>',
        data: {
          name: grunt.option('name') || '<%= pkg.name %>',
          version: grunt.option('version') || '<%= pkg.version %>'
        }
      },
      compile: {
        files: {
          '<%= gconf.dist.root %>/index.html': '<%= gconf.src.root %>/index.jade'
        }
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        hostname: 'localhost',
        open: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>',
        middleware: function(connect) {
          return [
            connect.static(gconf.dist.root)
          ];
        }
      },
      dev: {}
    },
    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['js']
      },
      jade: {
        files: ['<%= gconf.src.root %>/*.jade'],
        tasks: ['jade'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['<%= gconf.src.scripts %>/**/*.js'],
        tasks: ['js'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('js', ['jshint', 'uglify']);
  grunt.registerTask('build', ['clean', 'js', 'jade']);
  grunt.registerTask('serve', ['build','connect','watch']);
  grunt.registerTask('default', ['build']);
};
