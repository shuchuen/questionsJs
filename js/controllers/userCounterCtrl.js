//onlineUserCount ref: http://www.ng-newsletter.com/advent2013/#!/day/9

todomvc.controller('onlineUserCtrl', ['$scope', 'onlineUserCountService','$location',
    function($scope, onlineUserCountService) {
      $scope.totalViewers = 0;

      $scope.$on('onOnlineUser', function() {
        $scope.$apply(function() {
          $scope.totalViewers = onlineUserCountService.getOnlineUserCount();
        });
      });
    }
])

.factory('onlineUserCountService', ['$rootScope', '$location','$window',
    function($rootScope, $location, $window) {
      var onlineUsers = 0;
      var splits = $location.path().trim().split("/");
      var roomId = angular.uppercase(splits[1]);
      if (!roomId || roomId.length === 0) {
//        roomId = "all";
          $window.location.href = 'index.html?roomNameError=true';
      }
        
    var fireBaseUrl = 'https://instaquest.firebaseio.com/';
        
      // Create our references
      var listRef = new Firebase(fireBaseUrl+'rooms/'+roomId+'/presence');
      var userRef = listRef.push(); // This creates a unique reference for each user
      var presenceRef = new Firebase(fireBaseUrl+'.info/connected');
    
//      $cookies.put(roomId,true);
//      if($cookies.getObject(roomId)==true){
//          alert("Added cookies");
//      }
      // Add ourselves to presence list when online.
      presenceRef.on('value', function(snap) {
        if (snap.val()) {
          userRef.set(true);
          // Remove ourselves when we disconnect.
          userRef.onDisconnect().remove();
        
        }
      });
        
//      presenceRef.on('child_removed', function(oldChildSnapshot) {
//          // code to handle child removal.
//          $cookies.remove(roomId);
//      });
//        
//      if($cookies.getObject(roomId)==null){
//          alert("deleted cookies");
//      }

      // Get the user count and notify the application
      listRef.on('value', function(snap) {
        onlineUsers = snap.numChildren();
        $rootScope.$broadcast('onOnlineUser');
      });

      var getOnlineUserCount = function() {
        return onlineUsers;
      }

      return {
        getOnlineUserCount: getOnlineUserCount
      }
    }
])