/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('TodoCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window) {
	// set local storage
	$scope.$storage = $localStorage;

	var scrollCountDelta = 10;
	$scope.maxQuestion = scrollCountDelta;

	
//	$window.scroll(function(){
//	if($(window).scrollTop() > 0) {
//        $("#btn_top").show();
//    } else {
//        $("#btn_top").hide();
//    }
//    });

var splits = $location.path().trim().split("/");
var roomId = angular.uppercase(splits[1]);
if (!roomId || roomId.length === 0 ) {
//        roomId = "all";
    $window.location.href = 'index.html?roomNameError=true';
}
    
if(!roomId.match(/^\s*\w*\s*$/)){
    $window.location.href = 'index.html?roomNameError=true';
}    

// TODO: Please change this URL for your app
var firebaseURL = "https://instaquest.firebaseio.com/rooms/";


$scope.roomId = roomId;
var url = firebaseURL + roomId + "/questions/";
var echoRef = new Firebase(url);

//when access the chatromm, renew the active time
var parentRef = echoRef.parent();

var query = echoRef.orderByChild("timestamp");
// Should we limit?
//.limitToFirst(1000);
$scope.todos = $firebaseArray(query);
//$scope.input.category = 'Other';
    
//$scope.input.wholeMsg = '';
$scope.editedTodo = null;

// bad word filter
$scope.filter = function (s) {
	var filters = [["fuck", "love"],
		["shit", "banana"],
		["damn", "praise"]];
	for (var i in filters) {
		var reg = new RegExp("\\b" + filters[i][0] + "\\b", "ig");
		s = s.replace(reg, filters[i][1]);
	}
	return s;
};
                
// pre-precessing for collection
$scope.$watchCollection('todos', function () {
	var total = 0;
	var remaining = 0;
	$scope.todos.forEach(function (todo) {
		// Skip invalid entries so they don't break the entire app.
		if (!todo ) {
			return;
		}

		total++;
		if (todo.completed === false) {
			remaining++;
		}

		// set time
//		todo.dateString = new Date(todo.timestamp).toString();
		todo.tags = todo.wholeMsg.match(/#\w+/g);

//		todo.trustedDesc = $sce.trustAsHtml(todo.linkedDesc);
	});

	$scope.totalCount = total;
	$scope.remainingCount = remaining;
	$scope.completedCount = total - remaining;
	$scope.allChecked = remaining === 0;
	$scope.absurl = $location.absUrl();
}, true);

// Get the first sentence and rest
//$scope.getFirstAndRestSentence = function($string) {
//	var head = $string;
//	var desc = "";
//
//	var separators = [". ", "? ", "! ", '\n', ' #'];
//
//	var firstIndex = -1;
//	for (var i in separators) {
//		var index = $string.indexOf(separators[i]);
//		if (index == -1) continue;
//		if (firstIndex == -1) {firstIndex = index; continue;}
//		if (firstIndex > index) {firstIndex = index;}
//	}
//
//	if (firstIndex !=-1) {
//		head = $string.slice(0, firstIndex+1);
//		desc = $string.slice(firstIndex+1);
//	}
//	return [head, desc];
//};

$scope.addTodo = function () {
	var newTodo = $scope.input.wholeMsg.trim();
	
	// No input, so just do nothing
	if (!newTodo.length) {
		return;
	}

//	var firstAndLast = $scope.getFirstAndRestSentence(newTodo);
//	var head = firstAndLast[0];
//	var desc = firstAndLast[1];
//    var tags = newTodo.match(/#\w+/g);
    
    
	$scope.todos.$add({
		wholeMsg: newTodo,
//		head: head,
//		headLastChar: head.slice(-1),
//		desc: desc,
//		linkedDesc: Autolinker.link(desc, {newWindow: false, stripPrefix: false}),
		completed: false,
		timestamp: new Date().getTime(),
		tags: newTodo.match(/#\w+/g),
		like: 0,
		dislike: 0,
        category: $scope.input.category==null? "Other":$scope.input.category,
        questioner:"...",
        order: 0,
        attachment:"..."
	});
    
	// remove the posted question in the input
	$scope.input.wholeMsg = '';
    $scope.input = '';
    
    //renew the access time
    parentRef.child("activeTime").set(new Date().getTime());
    
    echoRef.on("child_added", function(snapshot) {
      var newPost = snapshot.val();
      parentRef.child("recentQuestion").set(snapshot.key());
    });
};

$scope.editTodo = function (todo) {
	$scope.editedTodo = todo;
	$scope.originalTodo = angular.extend({}, $scope.editedTodo);
};

$scope.like = function (todo) {
	$scope.editedTodo = todo;
	todo.like = todo.like + 1;
	// Hack to order using this order.
//	todo.order = todo.order -1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = "echoed";
};
    
$scope.dislike = function (todo) {
	$scope.editedTodo = todo;
	todo.dislike = todo.dislike + 1;
	// Hack to order using this order.
//	todo.order = todo.order -1;
	$scope.todos.$save(todo);

	// Disable the button
	$scope.$storage[todo.$id] = "echoed";
};    

$scope.doneEditing = function (todo) {
	$scope.editedTodo = null;
	var wholeMsg = todo.wholeMsg.trim();
	if (wholeMsg) {
		$scope.todos.$save(todo);
	} else {
		$scope.removeTodo(todo);
	}
};

$scope.revertEditing = function (todo) {
	todo.wholeMsg = $scope.originalTodo.wholeMsg;
	$scope.doneEditing(todo);
};

$scope.removeTodo = function (todo) {
	$scope.todos.$remove(todo);
};

$scope.clearCompletedTodos = function () {
	$scope.todos.forEach(function (todo) {
		if (todo.completed) {
			$scope.removeTodo(todo);
		}
	});
};

$scope.toggleCompleted = function (todo) {
	todo.completed = !todo.completed;
	$scope.todos.$save(todo);
};

$scope.markAll = function (allCompleted) {
	$scope.todos.forEach(function (todo) {
		todo.completed = allCompleted;
		$scope.todos.$save(todo);
	});
};

$scope.normalSignUp = function () {
	var ref = new Firebase(firebaseURL);
	
};    
    
    
$scope.FBLogin = function () {
	var ref = new Firebase(firebaseURL);
	ref.authWithOAuthPopup("facebook", function(error, authData) {
		if (error) {
			console.log("Login Failed!", error);
		} else {
			$scope.$apply(function() {
				$scope.$authData = authData;
                $('#loginModal').modal('hide')
			});
			console.log("Authenticated successfully with payload:", authData);
		}
	});
    $scope.FbLogin = true;
};

$scope.GoogleLogin = function () {
	var ref = new Firebase(firebaseURL);
	ref.authWithOAuthPopup("google", function(error, authData) {
		if (error) {
			console.log("Login Failed!", error);
		} else {
			$scope.$apply(function() {
				$scope.$authData = authData;
                $('#loginModal').modal('hide')
			});
			console.log("Authenticated successfully with payload:", authData);
		}
	});
    $scope.googleLogin = true;
    
};    
    
$scope.Logout = function () {
	var ref = new Firebase(firebaseURL);
	ref.unauth();
	delete $scope.$authData;
    $scope.googleLogin = false;
    $scope.FbLogin = false;
};

$scope.increaseMax = function () {
	if ($scope.maxQuestion < $scope.totalCount) {
		$scope.maxQuestion+=scrollCountDelta;
	}
};

$scope.toTop =function toTop() {
	$window.scrollTo(0,0);
};
    
$scope.refresh = function refreshPage() {
    $scope.input = '';
	$scope.todos = $firebaseArray(query);
    
};

//// Not sure what is this code. Todel
//if ($location.path() === '') {
//	$location.path('/');
//}
//$scope.location = $location;

// autoscroll
angular.element($window).bind("scroll", function() {
	if ($window.innerHeight + $window.scrollY >= $window.document.body.offsetHeight) {
		console.log('Hit the bottom2. innerHeight' +
		$window.innerHeight + "scrollY" +
		$window.scrollY + "offsetHeight" + $window.document.body.offsetHeight);

		// update the max value
		$scope.increaseMax();

		// force to update the view (html)
		$scope.$apply();
	}
});
    
$scope.searchTag =function searchTag(tag) {
	$scope.input = {wholeMsg:tag};
};
   

}])

.controller('onlineUserCtrl', ['$scope', 'onlineUserCountService','$location',
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
]);

//onlineUserCount ref: http://www.ng-newsletter.com/advent2013/#!/day/9