angular.module('app')


.controller('MainController', ['$scope', '$state', function($scope, $state) {

    $scope.loggedIn = false;
    $scope.current = 1;

    $scope.login = function(email, pass) {

        Parse.User.logIn(email, pass, {
          success: function(user) {
            $scope.loggedIn = true;
            $scope.userEmail=email;
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            $scope.error = true;
            $scope.errorMessage = error.message;
          }
        });

    };

    $scope.signup = function(email, pass){
        console.log("signing up");
        var user = new Parse.User();
        user.set("username", email);
        user.set("email", email);
        user.set("password", pass);
        user.signUp(null, {
            success: function(user){
                $scope.login(user.get("email"),pass);
            },
            error:function(user,error){
                $scope.error = true;
                $scope.errorMessage = error.message;
            }

        })
    }

    $scope.logout = function() {
        Parse.User.logOut();
        $scope.loggedIn = false;
        $scope.error = false;
    };

    $scope.navigate = function(sceneNum) {
        $scope.current = sceneNum;
    }

}]);