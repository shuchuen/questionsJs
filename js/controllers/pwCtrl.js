/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('PWCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window) {
	var ref = new Firebase("https://instaquest.firebaseio.com");
    
    $scope.changePassword = function(){
        if(!$scope.change)
            return;
        
        ref.changePassword({
          email: $scope.$authData.password.email,
          oldPassword: $scope.change.oldpassword,
          newPassword: $scope.change.newpassword,
        }, function(error) {
          if (error) {
              $scope.$apply(function() {
                $scope.changePWError = error;
                $scope.changeSuccess = false;
              });
            switch (error.code) {
              case "INVALID_PASSWORD":
                console.log("The specified user account password is incorrect.");
                break;
              case "INVALID_USER":
                console.log("The specified user account does not exist.");
                break;
              default:
                console.log("Error changing password:", error);
            }
          } else {
              $scope.$apply(function() {
                $scope.changeSuccess = true;
                $scope.changePWError = null;
              });
            console.log("User password changed successfully!");
          }
        });
        
        $scope.change = "";
    }
    
    $scope.resetPassword = function(){
        
        if(!$scope.reset)
            return
        
        ref.resetPassword({
          email: $scope.reset.email
        }, function(error) {
          if (error) {
              $scope.$apply(function() {
                $scope.resetSent = false;
                $scope.resetPWError = error;
              }); 
              
            switch (error.code) {
              case "INVALID_USER":
                console.log("The specified user account does not exist.");
                break;
              default:
                console.log("Error resetting password:", error);
            }
          } else {
            $scope.$apply(function() {
                $scope.resetSent = true;
                $scope.resetPWError = null;
              });  
            console.log("Password reset email sent successfully!");
          }
        });
    }
    
    
}]);
