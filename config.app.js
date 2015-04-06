/*
 * Configurations for the application
 *
 */
module.exports = {
  /**
   * `build_dir` is where the appspecific files are minified and concatenated
   */
  build_dir: 'public',

  // Uncompiled app logic
  src_files: {
    styles: [
      "src/**/*.less"
    ],
    scripts: [
      "src/**/*.js"
    ]
  },

  // Uncompilerd vendor css and js.
  lib_files: {
    styles: [
      "http://fonts.googleapis.com/css?family=Open+Sans",
      "lib/bootstrap/dist/css/bootstrap.css",
      "lib/fontawesome/css/font-awesome.css",
      "lib/angular-motion/dist/angular-motion.css",
      "assets/icomoon/style.css"
    ],
    scripts: [
      "lib/angular/angular.js",
      "lib/angular-animate/angular-animate.js",
      "lib/jquery/dist/jquery.js",
      "lib/angular-bootstrap/ui-bootstrap.js",
      "lib/angular-bootstrap/ui-bootstrap-tpls.js",
      "lib/angular-mocks/angular-mocks.js",
      "lib/angular-resource/angular-resource.js",
      "lib/angular-ui-router/release/angular-ui-router.js",
      "lib/angular-ui-utils/ui-utils-ieshiv.js",
      "lib/angular-ui-utils/ui-utils.js",
      "lib/bootstrap/dist/js/bootstrap.js",
    ]
  },

  // CDN during production for faster loading time.
  cdn_files: {
    styles: [
      "http://fonts.googleapis.com/css?family=Open+Sans",
      "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/css/bootstrap.min.css",
      "//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css",
      "//rawgithub.com/mgcrea/angular-motion/master/dist/angular-motion.min.css",
      "assets/icomoon/style.css"
    ],
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.14/angular.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.14/angular-mocks.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.14/angular-resource.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-utils/0.1.1/angular-ui-utils.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.14/angular-animate.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.min.js"
    ]
  },

  // Compiled files after grunt tasks have runned
  bin_files: {
    styles: [
      "css/main.css"
    ],
    scripts: [
      "js/main.js"
    ]
  }

};
