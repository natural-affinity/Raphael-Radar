'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      options: {
        'no-write': false
      },
      release: ['public']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js'
      ]
    },
    uglify: {
      options: {
        banner: '/* All external plugins are licensed/copyright by their respective owners. ' +
                   'All other artifacts are licensed under <%= pkg.license %> */'
      },
      target: {
        files: {
          'public/assets/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['src/**/<%= pkg.name %>.js']
        }
      }
    },
    copy: {
      html: {
        expand: true,
        cwd: 'src/',
        src: 'index.html',
        dest: 'public/',
        filter: 'isFile'
      },
      lib: {
        expand: true,
        cwd: 'src/js/lib/',
        src: '*',
        dest: 'public/assets/js/',
        filter: 'isFile'
      }
    },
    'regex-replace': {
      html: {
        src: ['public/index.html'],
        actions: [{
            name: 'replace-version',
            search: '<%= pkg.name %>.js',
            replace: '<%= pkg.name %>-<%= pkg.version %>.min.js',
            flags: ''
          },
          {
            name: 'replace-lib-path',
            search: 'js/lib/|js/',
            replace: 'assets/js/',
            flags: 'g'
        }]
      },
    },
    connect: {
      server: {
        options: {
          open: true,
          port: 9292,
          base: 'public'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      files: ['src/**/*', 'package.json'],
      tasks: ['default']
    }
  });

  //register tasks and default task
  grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'copy', 'regex-replace']);
  grunt.registerTask('tdd', ['default', 'connect', 'watch']);
};
