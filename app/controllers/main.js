angular.module('app')


.controller('MainController', ['$scope', '$state', function($scope, $state) {

    $scope.loggedIn = (Parse.User.current());
    $scope.newQuestionWeek = 1;
    $scope.newQuestionWeek = 1;
    $scope.newQuestionAnswer = 1;
    $scope.qJustAdded = false;
    $scope.currentWeek = 1;
    $scope.currentQuestionNumber = 0;
    $scope.questionAnswered = false;
    $scope.questionCorrect = true;

    if(Parse.User.current()){
        $scope.userEmail = Parse.User.current().get("username");
        $scope.currentUserType = Parse.User.current().get("type");
    }   

    if($scope.currentUserType == 1) {
        $scope.current = 1;
        $scope.pageTitle = 'Home';
    } else {
        $scope.current = 4;
        $scope.pageTitle = 'Teacher Panel';
    }

    $scope.setCurrentQuestion = function(week, number) {

        var query = new Parse.Query("Questions");

        console.log($scope.currentWeek, $scope.currentQuestionNumber);

        query.equalTo("week", $scope.currentWeek);
        query.equalTo("number", $scope.currentQuestionNumber);
        query.descending("updatedAt");

        query.find({

          success: function(results) {

            $scope.questionAnswered = false;

            var q = results[0];

            $scope.currentQuestion = {

                body: q.get("body"),
                choices: q.get("choices"),
                hint: q.get("hint"),
                points: q.get("points"),
                week: q.get("week"),
                number: q.get("number"),
                answer: q.get("answer")
            };

          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
    };

    $scope.setCurrentQuestion(1,0);

    // $scope.currentQuestion = $scope.setCurrentQuestion();

    $scope.loadLeaderboard = function() {
        var query = new Parse.Query("User");

        query.descending("totalPoints");
        query.equalTo("type", 1);

        query.find({

          success: function(results) {

            $scope.students = [];

            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) { 

              var object = results[i];

              $scope.students.push({
                totalPoints: object.get('totalPoints'),
                avatar: object.get('avatar'),
                name: object.get('username'),
                avatarName: object.get('avatarName')
                });

              $scope.$apply();
            }
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
    };

    $scope.loadLeaderboard();

    $scope.resetPassword = function(email) {
        Parse.User.requestPasswordReset(email , {
            success: function () {
               alert("An email to reset your password has been sent!");
            },
            error: function (error) {
               console.log(error);
               alert("Couldn't reset Password!" + error.message);
            }

        });
    };

    $scope.login = function(email, pass) {

    if(email.indexOf("@hamptonu.edu") > -1 || email.indexOf("@my.hamptonu.edu") > -1){

        Parse.User.logIn(email, pass, {
          success: function(user) {
            $scope.loggedIn = true;
            $scope.userEmail=email;
            $scope.currentUserType = Parse.User.current().get("type");  

            if($scope.currentUserType == 1) {
                $scope.current = 1;
                $scope.pageTitle = 'Home';
            } else {
                $scope.current = 4;
                $scope.pageTitle = 'Teacher Panel';
            }    
        },
          error: function(user, error) {
            // The login failed. Check error to see why.
            $scope.error = true;
            $scope.errorMessage = error.message;
          }
        });
    } else {
        $scope.error = true;
        $scope.errorMessage = "Sorry, Dice currently requires a hampton.edu email address.";
    }

    };

    $scope.signup = function(email, pass){

        if(email.indexOf("@hamptonu.edu") > -1){

            console.log("signing up");
            var user = new Parse.User();
            user.set("username", email);
            user.set("email", email);
            user.set("password", pass);
            user.set("type", 2);
            user.signUp(null, {
                success: function(user){
                    $scope.login(user.get("email"),pass);
                },
                error:function(user,error){
                    $scope.error = true;
                    $scope.errorMessage = error.message;
                }

            });
        }else if(email.indexOf("@my.hamptonu.edu") > -1){
            console.log("signing up");
            var user = new Parse.User();
            user.set("username", email);
            user.set("email", email);
            user.set("password", pass);
            user.set("type", 1);
            user.signUp(null, {
                success: function(user){
                    $scope.login(user.get("email"),pass);
                },
                error:function(user,error){
                    $scope.error = true;
                    $scope.errorMessage = error.message;
                }

            });
        } else {
            $scope.error = true;
            $scope.errorMessage = "Sorry, Dice currently requires a hampton.edu email address.";
        }
    }

    $scope.logout = function() {
        Parse.User.logOut();
        $scope.loggedIn = false;
        $scope.error = false;
    };

    $scope.navigate = function(sceneNum) {
        $scope.current = sceneNum;
    }

    $scope.weekSelected = function(num) {
        $scope.newQuestionWeek = num;
    }

    $scope.numberSelected = function(num) {
        $scope.newQuestionNumber = num;
    }

    $scope.studentSelectedNumber = function(num) {
        $scope.currentQuestionNumber = num;
    }

    $scope.studentSelectedWeek = function(num) {
        $scope.currentWeek = num;
    }

    $scope.selectAnswer = function(num) {
        $scope.currentAnswer = num;
        console.log(num, $scope.currentQuestion.answer);
    }

    $scope.submitQuestion = function() {
        // console.log($scope.currentAnswer);
        if($scope.currentAnswer != undefined){

            if($scope.currentAnswer == $scope.currentQuestion.answer){
                $scope.questionAnswered = true;
                $scope.questionCorrect = true;
                var pts = Parse.User.current().get("totalPoints") + $scope.currentQuestion.points;
                console.log("adding" + pts + "points");
                Parse.User.current().set("totalPoints", pts);
                Parse.User.current().save();
                Parse.User.current().fetch();
                $scope.loadLeaderboard();
            } else {
                $scope.questionAnswered = true;
                $scope.questionCorrect = false;
            }
        }

        console.log($scope.questionAnswered, $scope.questionCorrect, $scope.currentAnswer);
    };

      $scope.$watch(
        "currentWeek",
        function( newValue, oldValue ) {

            $scope.setCurrentQuestion(newValue, 0);

        }
    );

    $scope.$watch(
        "currentQuestionNumber",
        function( newValue, oldValue ) {

            $scope.setCurrentQuestion($scope.currentWeek, newValue);

        }
    );

    $scope.studentSelectedNumber = function(num) {
        $scope.currentQuestionNumber = num;
    }


    $scope.answerSelected = function(num) {
        $scope.newQuestionAnswer = num;
    }

    $scope.submitNewQuestion = function() {

        var Questions = Parse.Object.extend("Questions");

        var q = new Questions();

        q.set("body", $('#questionBody').val());

        q.set("hint", $('#hint').val());

        q.set("points", parseInt($('#points').val()));

        var choices = [$('#choice1').val(), $('#choice2').val(), $('#choice3').val(), $('#choice4').val()];

        q.set("choices", choices);

        q.set("week", $scope.newQuestionWeek);

        q.set("number", $scope.newQuestionNumber);

        q.set("answer", $scope.newQuestionAnswer);

        q.save(null, {

            success: function(qst) {
                $scope.qJustAdded = true;
                console.log($scope.qJustAdded);
            }

        });

    }

}]);