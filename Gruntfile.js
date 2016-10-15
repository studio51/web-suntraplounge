module.exports = function(grunt) {

  var mozjpeg   = require('imagemin-mozjpeg');
  var appConfig = {
    host: 'localhost',
    port: 1337,
    working_directory: 'src/',
    preview_directory: 'dist/'
  };

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appConfig: appConfig,

    watch: {
      grunt: {
        files: 'Gruntfile.js'
      },

      sass: {
        files: ['<%= appConfig.working_directory %>css/**/*.scss'],
        tasks: ['sass', 'postcss', 'cssnext']
      },

      uglify: {
        files: ['<%= appConfig.working_directory %>js/**/*.js'],
        tasks: ['uglify']
      },

      jade: {
        files: ['<%= appConfig.working_directory %>**/*.jade'],
        tasks: ['jade']
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '<%= appConfig.preview_directory %>css/*.css',
            '<%= appConfig.preview_directory %>js/*.js',
            '<%= appConfig.preview_directory %>*.html'
          ],
        },

        options: {
          watchTask: true,
          server: {
            baseDir: appConfig.preview_directory
          },

          debugInfo: true,
          logConnections: true,
          notify: true,
          plugins: [
            {
              module: 'bs-html-injector',
              options: {
                files: '<%= appConfig.preview_directory %>*.html'
              }
            }
          ],

          ghostMode: {
            scroll: true,
            links: true,
            forms: true
          }
        },

        bsReload: {
          all: {
            reload: true
          }
        }
      }
    },

    clean: {
      options: {
        dot: true
      },

      dist: {
        src: ['<%= appConfig.preview_directory %>']
      }
    },

    sass: {
      options: {
        sourceMap: true
      },

      dist: {
        files: {
          '<%= appConfig.preview_directory %>css/main.min.css': '<%= appConfig.working_directory %>css/main.scss'
        }
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer-core')({
            browsers: ['last 5 versions', '> 15%', 'IE 10']
          })
        ]
      },

      dist: {
        src: ['<%= appConfig.preview_directory %>css/main.min.css']
      }
    },

    cssnext: {
      options: { sourcemap: false },
      dist: {
        files: {
          '<%= appConfig.preview_directory %>css/main.min.css': '<%= appConfig.preview_directory %>css/main.min.css'
        }
      }
    },

    cssbeautifier: {
      files: ['<%= appConfig.preview_directory %>css/main.min.css'],
      options : {
        indent: ' ',
        openbrace: 'end-of-line',
        autosemicolon: true
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },

      target: {
        files: { '<%= appConfig.preview_directory %>css/main.min.css': ['<%= appConfig.preview_directory %>css/main.min.css'] }
      }
    },

    concat: {
      options: {
        stripBanners: true,
        separator: ';'
      },

      dist: {
        src: [
          '<%= appConfig.working_directory %>js/modernizr.custom.js',
          '<%= appConfig.working_directory %>js/helper.js',
          '<%= appConfig.working_directory %>js/grid3d.js',
          '<%= appConfig.working_directory %>js/main.js'
        ],
        dest: '<%= appConfig.preview_directory %>js/app.js'
      },
    },

    uglify: {
      dist: {
        options: {
          banner: '/* \n' +
                  ' * <%= pkg.homepage %>\n' +
                  ' * v<%= pkg.version %> - <%= grunt.template.today("dd/mm/yyyy") %>\n' +
                  ' * \n' +
                  ' * <%= pkg.description %>\n' +
                  ' * \n' +
                  ' * Author: <%= pkg.author %>\n' +
                  ' * Author URL: <%= pkg.author_url %>\n' +
                  ' * \n' +
                  ' */\n' +
                  '\n'
        },

        files: {
          '<%= appConfig.preview_directory %>js/app.min.js': ['<%= appConfig.preview_directory %>js/app.js']
        }
      }
    },

    bower_concat: {
      all: {
        dest: {
          'js': '<%= appConfig.preview_directory %>js/dependencies.js',
          'css': '<%= appConfig.preview_directory %>css/dependencies.css'
        },
        bowerOptions: { relative: false }
      }
    },

    jade: {
      html: {
        options: {
          client: false,
          pretty: true
        },

        files: { '<%= appConfig.preview_directory %>': ['<%= appConfig.working_directory %>*.jade'] }
      }
    },

    'ftp-deploy': {
      build: {
        auth: {
          host    : 'suntraplounge.co.uk',
          port    : 21,
          authKey : 'studio51'
        },

        src: 'dist',
        dest: '/',
        exclusions: ['**/.DS_Store']
      }
    },

    imagemin: {
      options: {
        optimizationLevel: 7,
        use: [mozjpeg()],
        svgoPlugins: [{
          removeViewBox: false
        }]
      },

      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.working_directory %>img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= appConfig.preview_directory %>img/'
        }]
      }
    }
  });

  grunt.registerTask('compile-css',  [ 'sass', 'postcss', 'cssnext' ]);
  grunt.registerTask('compress-img', ['imagemin']);
  grunt.registerTask('compile-js',   ['concat', 'uglify', 'bower_concat']);
  grunt.registerTask('compile-html', ['jade']);

  grunt.registerTask('compile-theme', [
    'compile-css',
    'compile-js',
    'compress-img',
    'compile-html'
  ]);

  grunt.registerTask('prettify', [
    'cssbeautifier',
    'cssmin'
  ]);

  grunt.registerTask('preview', [
    'compile-theme',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('default', ['clean', 'preview']);
  grunt.registerTask('prepare', ['clean', 'compile-theme', 'prettify']);
  grunt.registerTask('deploy',  ['prepare', 'ftp-deploy'])
}
