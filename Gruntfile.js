module.exports = function ( grunt ) {

  var appConfig = require('./config.app.js');

  var tasksConfig = {
    // Global settings for application
    pkg: grunt.file.readJSON('package.json'),

    // This is runned before deployment
    clean: {
      all: ['<%= build_dir %>/js', '<%= build_dir %>/css'],
      scripts: ['<%= build_dir %>/js'],
      styles: ['<%= build_dir %>/css']
    },

    /**
     * Watches for changes in js, templates and css
     */
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['clean:scripts', 'concat']
      },
      styles: {
        files: ['src/**/*.less'],
        tasks: ['clean:styles', 'less:develop'],
      },
      templates: {
        files: ['src/**/*.tpl.html'],
        tasks: ['clean:scripts', 'html2js']
      }
    },

    /**
     * Concatenates all js files to one and wraps in IFFE.
     */
    concat: {
      dist: {
        src: [
          'app.prefix',
          '<%= src_files.scripts %>',
          'app.suffix'
        ],
        dest: '<%= build_dir %>/js/main.js',
      }
    },

    /**
     * TODO: (Not used yet) Minifies deployment js from concat result.
     */
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= build_dir %>/js/main.js',
        dest: '<%= build_dir %>/main.min.js'
      }
    },

    /**
     * Compiles all less files
     */
    less: {
      develop: {
        files: {
          // dest : src
          "<%= build_dir %>/css/main.css": "src/less/main.less"
        }
      },
      deploy: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2,
        },
        files: {
          // dest : src
          "<%= build_dir %>/css/main.css": "src/less/main.less"
        }
      }
    },

    /**
     * This plugin converts a group of templates to JavaScript and assembles
     * them into an Angular module that primes the cache directly when the
     * module is loaded. When we concatenate this module with our main
     * application code Angular does not need to make any additional
     * server requests to initialize the application. Shoul be named Cool
     * instead of html2js :-) .
     */
    html2js: {
      options: {
        singleModule: true,
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      main: {
        src: ['src/**/*.tpl.html'],
        dest: 'src/templates.js'
      }
    },

    /**
     * Replaces cdn_files to lib_files when grunt develop is used and vice
     * versa.
     */
    'string-replace': {
      develop: {
        src: './server.js',
        dest: './server.js',
        options: {
          replacements: [{
            pattern: /cdn_files/g,
            replacement: 'lib_files'
          }]
        }
      },
      deploy: {
        src: './server.js',
        dest: './server.js',
        options: {
          replacements: [{
            pattern: /lib_files/g,
            replacement: 'cdn_files'
          }]
        }
      }
    },

    /**
     * Run nodemon as a grunt task for integration with the rest of our workflow
     */
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    /**
     * Run nodemon and watch concurrently in one terminal session.
     */
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }

  };

  // Join tasksConfig and appConfig into one config in init
  grunt.config.init(grunt.util._.extend(tasksConfig, appConfig));

  // Load grunt tasks
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-string-replace');

  // Register tasks
  // Compile and watch rest during development
  grunt.registerTask('develop',
      ['clean:all', 'html2js', 'concat', 'less:develop', 'string-replace:develop', 'concurrent:target']);
  // Runned when pushed to Heroku
  grunt.registerTask('deploy',
      ['clean:all', 'html2js', 'concat', 'less:deploy', 'string-replace:deploy']);


};
