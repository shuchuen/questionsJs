/*global todomvc, angular, Firebase */
'use strict';

/**
* The main controller for the app. The controller:
* - retrieves and persists the model via the $firebaseArray service
* - exposes the model to the template and provides event handlers
*/
todomvc.controller('TodoCtrl',
['$scope', '$location', '$firebaseArray', '$sce', '$localStorage', '$window',
function ($scope, $location, $firebaseArray, $sce, $localStorage, $window, Upload) {
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
if (!roomId || roomId.length === 0 || !roomId.match(/^\s*\w*\s*$/)) {
//        roomId = "all";
    $window.location.href = 'index.html?roomNameError=true';
}   

// TODO: Please change this URL for your app
var firebaseURL = "https://instaquest.firebaseio.com/";


$scope.roomId = roomId;
var url = firebaseURL + "rooms/" + roomId + "/questions/";
var echoRef = new Firebase(url);

var commentUrl = firebaseURL + "rooms/" + roomId + "/comment/";
var commentRef = new Firebase(commentUrl);
    
//when access the chatromm, renew the active time
var parentRef = echoRef.parent();

var query = echoRef.orderByChild("timestamp");
// Should we limit?
//.limitToFirst(1000);

var commentQuery = commentRef;
$scope.comments = [];
$scope.replyCounter = [];  

var favUrl= null;   
var favRef = null;
$scope.favList = null;    
    
$scope.todos = $firebaseArray(query);
$firebaseArray(commentQuery).$loaded().then(function(comments){
    comments.forEach(function(commentList){        
        $scope.comments[commentList.$id] = commentList;
    });
    
});
    
//$scope.input.wholeMsg = '';
$scope.editedTodo = null;
    
// bad word filter
$scope.filter = function (s) {
	var filters = [["fuck", "love"],
		["fucking", "peace"],
		["motherfucker", "dutiful"],
		["shit", "nice"],
		["damn", "god"],
		["asshole", "javascript"],
		["ass hole", "java script"],
		["bitch", "beauty"],
		["penis", "spine"],
		["pussy", "putty"],
		["wtf", "Welcome to firebase"]];
		
	for (var i in filters) {
		var reg = new RegExp("\\b" + filters[i][0] + "\\b", "ig");
        if(s!=null)
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
		if (!todo || !todo.wholeMsg) {
			return;
		}
		total++;
		if (todo.completed === false) {
			remaining++;
		}
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

$scope.goFav = function(url){
    $window.location.href = 'question.html#/'+url;
    location.reload();
}    
    
$scope.getFav = function(){
    if($scope.$authData){
        favUrl = firebaseURL+"/userRecord/"+$scope.$authData.uid+"/favorite/";
        favRef = new Firebase(favUrl);
        $scope.favList = $firebaseArray(favRef);
        $scope.favList.$loaded().then(function(favList){
            if(favList)
                favList.forEach(function(fav){
                    if(fav.$value == roomId)
                        $scope.roomAdded = true;
                });
        });
    }else{
        return;
    }
}    
    
$scope.addFav = function(){
    if($scope.$authData){
        var exist = false;
        if($scope.favList)
            $scope.favList.forEach(function(fav){
                if(fav.$value == roomId)
                    exist = true;
            });
        
        if(exist)
            $scope.roomAdded = true;
        
        if(!exist){
            var pushRef = favRef.push();
            pushRef.set(roomId);
            $scope.roomAdded = true;
        }
        
    }
}

$scope.removeFav = function(){
   if($scope.$authData){
       var key = null;
       if($scope.favList)
            $scope.favList.forEach(function(fav){
                if(fav.$value == roomId)
                    key = fav;
            });
        
        if(key){
            $scope.favList.$remove(key);
            $scope.roomAdded = false;
        }else{
           $scope.roomAdded = false; 
        }
       
   }
}
    
    
$scope.getUser = function(){
    
    if($scope.$authData){
        if ($scope.$authData.facebook){

            return $scope.$authData.facebook.email;
        }

        if ($scope.$authData.google){

            return $scope.$authData.google.email;
        }

        if ($scope.$authData.password){

            return $scope.$authData.password.email;
        }
    }
    return "Anonymous";
}

$scope.getHighlight = function(){
    if($scope.$authData){
        if($scope.isStaff){
            return 2;
        }
    }
    return 0;
}

$scope.doPhotoAttach = function(element) {
    $scope.photoAttach = "img/loading.gif"
    $scope.picLoading = true;
    
    $scope.$apply(function(scope) {
         
         var photofile = element.files[0];
         var reader = new FileReader();
         
        
         reader.onloadend = function(e){
             $scope.photoAttach = reader.result;
             $scope.picLoading = false;
             element.files[0] = null;
         }
         
         if(photofile.size <= 5242880){
             if(photofile.size!=0)
                reader.readAsDataURL(photofile);
         }else{
             $scope.picLoading = false;
             $scope.photoAttach = null;
             alert("Max size: 5MB");
         }
     });  
};

$scope.addTodo = function () {
    
//    Method 1
//    var data;
//    var imgLink = null;
//    data = new FormData();
//    data.append('fileToUpload', $('#images')[0].files[0]);
//    var photoName = $('#images')[0].files[0].name;
    
//    $.ajax({
//      url: 'http://ec2-52-27-32-65.us-west-2.compute.amazonaws.com/fileservice/upload/testDir/',
//      data: data,
//      processData: false,
//      contentType: false,
//      type: 'POST',
//      success: function(data){
//        $scope.$apply(function() {
//            imgLink = "http://ec2-52-27-32-65.us-west-2.compute.amazonaws.com/files/public/testDir/" + photoName;
//            console.log(data);
//            console.log(imgLink);
//        });
//          
//      },
//    error: function(xhr, textStatus, errorThrown) {
//        $scope.$apply(function() {
//            console.log("error thrown: " + xhr.responseText + ", " + textStatus + ", " + errorThrown);
//        });
//    }});
    
    if (!$scope.input || $scope.picLoading) {
		return;
	}
    
	var newTodo = $scope.input.wholeMsg.trim();
	
	// No input, so just do nothing
	if (!newTodo.length) {
		return;
	}
    
    var tags = newTodo.match(/#\w+/g);
    var category = $scope.input.category==null? "Other":$scope.input.category;
    var questioner = $scope.getUser();
    var highlightType = $scope.getHighlight();
    
	$scope.todos.$add({
        wholeMsg: newTodo,
        completed: false,
        timestamp: new Date().getTime(),
        tags: tags,
        like: 0,
        dislike: 0,
        category: category,
        questioner: questioner,
        order: 0,
        attachment: $scope.photoAttach,
        highlight: highlightType
	});
    
	// remove the posted question in the input
	$scope.input.wholeMsg = '';
    $scope.photoAttach = '';
//    $scope.input = '';
    
    //renew the access time
    parentRef.child("activeTime").set(new Date().getTime());
    
    echoRef.on("child_added", function(snapshot) {
      var newPost = snapshot.val();
      parentRef.child("recentQuestion").set(snapshot.key());
    });
};

$scope.addComment = function (replyForm, todo) {
    
    if (!replyForm) {
		return;
	}
    
	var newComment = replyForm.msg.trim();
	
	if (!newComment.length) {
		return;
	}

    var tags = newComment.match(/#\w+/g);
    var questioner = $scope.getUser();
    var highlightType = $scope.getHighlight();
    
    $scope.comments[todo.$id] = $firebaseArray(commentRef.child(todo.$id));
    
    $scope.comments[todo.$id].$add({        
        wholeMsg: newComment,
        completed: false,
        timestamp: new Date().getTime(),
        tags: tags,
        like: 0,
        dislike: 0,
        questioner: questioner,
        order: 0,
        attachment:"...",
        highlight: highlightType
    });
    
	// remove the posted question in the input
	replyForm.msg = '';
//    $scope.input = '';
};    
    
//$scope.getComments = function(comment, todoId){
//    var commentRef = new Firebase(commentUrl+todoId);
//    alert(1);
//    comment = $firebaseArray(commentRef); 
//    alert(2);
//}

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

$scope.checkNew = function (todo){
    if(todo.timestamp > new Date().getTime() - 180000)
        return true;
    return false;
}    


$scope.signUpForm = function(){
    var ref = new Firebase(firebaseURL);
    if($scope.signup){
        ref.createUser({
          email    : $scope.signup.username,
          password : $scope.signup.password
        }, function(error, authData) {
          if (error) {
            $scope.$apply(function() {
                $scope.createFail = true;
                $scope.createError = error;
            });
            console.log("Error creating user:", error);  
          } else {
            $scope.$apply(function() {
                $scope.createSuccess = true;
				$scope.signup="";
//                $('#loginModal').modal('hide');
			});
            console.log("Successfully created user account with uid:", authData.uid);  
          }
        });
        $scope.normalLogin = true;
    }
    
}

$scope.loginForm = function(){
    var ref = new Firebase(firebaseURL);
    if($scope.login){
        ref.authWithPassword({
            email    : $scope.login.username,
            password : $scope.login.password
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
            $scope.$apply(function() {
                $scope.authFail = true;
                $scope.authError = error;
            });  
          } else {
            $scope.$apply(function() {
                $scope.$authData = authData;
                $scope.$storage.authData = authData;
                $scope.login = "";
                $scope.getStaffRight();
                $('#loginModal').modal('hide');
            });  
            console.log("Authenticated successfully with payload:", authData);
          }
        });
        
//        $scope.normalLogin = true;
        $scope.getFav();
    }
}
    
$scope.FBLogin = function () {
	var ref = new Firebase(firebaseURL);
	ref.authWithOAuthPopup("facebook", function(error, authData) {
		if (error) {
			console.log("Login Failed!", error);
            $scope.$apply(function() {
                $scope.authFail = true;
                $scope.authError = error;
            });
		} else {
			$scope.$apply(function() {
				$scope.$authData = authData;
                $scope.$storage.authData = authData;
                $('#loginModal').modal('hide');
			});
			console.log("Authenticated successfully with payload:", authData);
		}
	}, { scope: "email" });
//    $scope.FbLogin = true;
    $scope.getFav();
};

$scope.GoogleLogin = function () {
	var ref = new Firebase(firebaseURL);
	ref.authWithOAuthPopup("google", function(error, authData) {
		if (error) {
			console.log("Login Failed!", error);
            $scope.$apply(function() {
                $scope.authFail = true;
                $scope.authError = error;
            });
		} else {
			$scope.$apply(function() {
				$scope.$authData = authData;
                $scope.$storage.authData = authData;
                $('#loginModal').modal('hide');
			});
			console.log("Authenticated successfully with payload:", authData);
		}
	}, {scope: "email"});
//    $scope.googleLogin = true;
    $scope.getFav();
};    
    
$scope.Logout = function() {
    $scope.isStaff = false;
	var ref = new Firebase(firebaseURL);
	ref.unauth();
	delete $scope.$authData;
    delete $scope.$storage.authData
//    $scope.googleLogin = false;
//    $scope.FbLogin = false;
//    $scope.normalLogin = false;
};

$scope.increaseMax = function () {
	if ($scope.maxQuestion < $scope.totalCount) {
		$scope.maxQuestion+=scrollCountDelta;
	}
};

$scope.bestTodo = function (todo) {
    if(todo.highlight === 1){
      todo.highlight = 0; 
    }else if(todo.highlight === 0 || !todo.highlight){
        todo.highlight = 1;
    }
    $scope.todos.$save(todo);
};

$scope.rewardStudent = function(todo){
    if($scope.isStaff){
//    if($scope.$storage[$scope.$authData.uid] == "isStaff"){
       $.post("http://ec2-52-27-32-65.us-west-2.compute.amazonaws.com/fileservice/mail",
              {"sender":$scope.$authData.password.email, "receiver":todo.questioner, "receiverName":"Student", "type":"1"});
    }
}

//$scope.validateCode = "";

$scope.validate = function(){
    
    if($scope.isStaff){
        alert("Entered token code: " +$scope.validateCode);
       $.get("http://ec2-52-27-32-65.us-west-2.compute.amazonaws.com/fileservice/auth/"+$scope.validateCode,
            function(data, status){
           var obj = JSON.parse(data);
           if(obj.auth =='1'){
               alert('authenticated');
           }
            else if (obj.auth == '0')
                alert("not authenticated");
//           alert(obj.auth);
            }
        );
    }
}
    
    
$scope.toTop =function() {
	$window.scrollTo(0,0);
};
    
$scope.refresh = function() {
    $scope.input = '';
	$scope.todos = $firebaseArray(query);
    
};
    
$scope.getStaffRight = function () {
    
    if($scope.$authData){
        var staffUrl = firebaseURL + "users/teachingStaff/"
        var staffRef = new Firebase(staffUrl);
        staffRef.once("value", function(snapshot) {
            if(snapshot.hasChild($scope.$authData.uid)){
                $scope.$apply(function() {
                    $scope.isStaff = true;
			    });
                console.log($scope.$authData.uid, "get the Staff right");
            }
        });
      
    }
}

if($scope.$storage.authData){
    $scope.$authData = $scope.$storage.authData;
    if($scope.$authData.password)
        $scope.getStaffRight();
    $scope.getFav();
} 

//// Not sure what is this code. Todel
//if ($location.path() === '') {
//	$location.path('/');
//}
//$scope.location = $location;

// autoscroll
angular.element($window).bind("scroll", function() {
	if ($window.innerHeight + $window.scrollY >= $window.document.body.offsetHeight) {
//		console.log('Hit the bottom2. innerHeight' +
//		$window.innerHeight + "scrollY" +
//		$window.scrollY + "offsetHeight" + $window.document.body.offsetHeight);

		// update the max value
		$scope.increaseMax();

		// force to update the view (html)
		$scope.$apply();
	}
});
    
$scope.searchTag =function searchTag(tag) {
	$scope.input = {wholeMsg:tag};
};
   

}]);
