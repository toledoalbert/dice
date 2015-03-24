angular.module('app')


.controller('MainController', ['$scope', '$state', function($scope, $state) {

    $scope.loggedIn = false;
    $scope.current = 1;

    $scope.login = function(email, pass) {

        Parse.User.logIn(email, pass, {
          success: function(user) {
            $scope.loggedIn = true;
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            $scope.error = true;
            $scope.errorMessage = error;
          }
        });

    };

    $scope.logout = function() {
        Parse.User.logOut();
        $scope.loggedIn = false;
        $scope.error = false;
    };

    $scope.navigate = function(sceneNum) {
        $scope.current = sceneNum;
    }

}]);