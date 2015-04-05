angular.module('login.directives.passwordverify', [])

.directive('passwordVerify', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      passwordVerify: '='
    },
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(
        // value function returns the value being watched
        function() {
          var combined;
          if (scope.passwordVerify || ctrl.$viewValue) {
            combined = scope.passwordVerify + '_' + ctrl.$viewValue;
          }
          return combined;
        },
        // The listener function: Called only when the value from the current
        // combined and the previous call to combined are not
        // equal.
        function(value) {
          if (value) {
            ctrl.$parsers.unshift(function(viewValue) {
              var origin = scope.passwordVerify;
              if (origin !== viewValue) {
                ctrl.$setValidity("passwordVerify", false);
                return undefined;
              } else {
                ctrl.$setValidity("passwordVerify", true);
                return viewValue;
              }
            });
          }
        }
      );
    }

  };
});
