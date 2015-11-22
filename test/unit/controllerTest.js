'use strict';

describe('sorting the list of users', function() {
  it('sorts in descending order by default', function() {
    var users = ['jack', 'igor', 'jeff'];
    //    var sorted = sortUsers(users);
    //    expect(sorted).toEqual(['jeff', 'jack', 'igor']);
  });
});

describe('TodoCtrl', function() {
  beforeEach(module('todomvc'));
  // variables for injection
  var controller;
  var scope;
  var location;
  var firebaseArray;
  var sce;
  var localStorage;
  var window;

  // Injecting variables
  // http://stackoverflow.com/questions/13664144/how-to-unit-test-angularjs-controller-with-location-service
  beforeEach(inject(function($location,
    $rootScope,
    $controller,
    $firebaseArray,
    $localStorage,
    $sce,
    $window){
      // The injector unwraps the underscores (_) from around the parameter names when matching

      scope = $rootScope.$new();

      location = $location;
      controller = $controller;
      firebaseArray = $firebaseArray;
      sce = $sce;
      localStorage = $localStorage;
      window = $window;
      location.path('/test/path');
    }));

    describe('TodoCtrl Testing', function() {
//      it('setFirstAndRestSentence', function() {
//        var ctrl = controller('TodoCtrl', {
//          $scope: scope
//        });
//
//        var testInputs = [
//          {str:"Hello? This is Sung", exp: "Hello?"},
//          {str:"Hello.co? This is Sung", exp: "Hello.co?"},
//          {str:"Hello.co This is Sung", exp: "Hello.co This is Sung"},
//          {str:"Hello.co \nThis is Sung", exp: "Hello.co \n"},
//		  {str:"! Hello.co. This is Sung", exp: "!"},
//          {str:". Hello.co? This is Sung", exp: "."},
//          {str:"Hello?? This is Sung", exp: "Hello??"},
//		  {str:"? . .", exp: "?"},
//        ];
//
//        for (var i in testInputs) {
//          var results = scope.getFirstAndRestSentence(testInputs[i].str);
//          expect(results[0]).toEqual(testInputs[i].exp);
//        }
//      });

      it('RoomId', function() {
        location.path('/new/path');
          
        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location
        });
          
        expect(scope.roomId).toBe("NEW");
      });

      it('toTop Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });

        scope.toTop();
        expect(window.scrollX).toBe(0);
        expect(window.scrollY).toBe(0);
      });

	it('watchCollection Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window,
        });
        
        scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1
          },{
            wholeMsg: "Hi2",
            completed: true,
            timestamp: new Date().getTime(),
            tags: "...",
            like: 2,
            dislike:0,
            order: 2
          },{}];

        scope.$digest();
      });


      it('addTodo Testing', function() {
		
        var ctrl = controller('TodoCtrl', {
          $scope: scope,
        });
          
		scope.input = {};
		scope.input.wholeMsg = "Hello";
        scope.photoAttach ={};
		scope.addTodo();
		expect(scope.input.wholeMsg).toBe("");
		
		scope.input = {};
		scope.input.wholeMsg = "";
        scope.photoAttach ={};
		scope.addTodo();
		expect(scope.input.wholeMsg).toBe("");
        
		scope.input = {};
		scope.input.wholeMsg = "Hello";
        scope.photoAttach ={};
        scope.picLoading = 1;
		scope.addTodo();
		expect(scope.input.wholeMsg).toBe("Hello");
		
      });	  

      it('doneEditing Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		scope.input = {};
		scope.input.wholeMsg = '';
        scope.doneEditing(scope.input);
        expect(scope.editedTodo).toBe(null);
		
		scope.input = {};
		scope.input.wholeMsg = 'abc';
        scope.doneEditing(scope.input);		
      });
        
        it('editTodo Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
            
        scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1
          }];
        scope.$digest();    
        scope.editTodo(scope.todos[0]);
      });


//      it('revertEditing  Testing', function() {
//
//        var ctrl = controller('TodoCtrl', {
//          $scope: scope,
//          $location: location,
//          $firebaseArray: firebaseArray,
//          $sce: sce,
//          $localStorage: localStorage,
//          $window: window
//        });
//        scope.input = {};
//		scope.input.wholeMsg = 'Hi';
//        scope.revertEditing();
//        scope.originalTodo.  
//        expect(scope.input).toBe(scope.originalTodo);
//      });

      it('clearCompletedTodos  Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		scope.todos.forEach = function (func){
			var myTodo = {};
			myTodo.completed = true;
			func(myTodo);
		}
        scope.clearCompletedTodos();
		scope.todos.forEach = function (func){
			var myTodo = {};
			myTodo.completed = false;
			func(myTodo);
		}
		scope.clearCompletedTodos();
      });

      it('toggleCompleted   Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		scope.input = {};
		scope.input.wholeMsg = '1';		
        scope.toggleCompleted(scope.input);

      });
	  
      it('markAll  Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		//scope.todos = firebaseArray("www.facebook.com");
		scope.todos.forEach = function (func){
			var myTodo = {};
			myTodo.completed = true;
			func(myTodo);
		}
		
        scope.markAll(true);

      });

      it('FBLogin Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
        scope.FBLogin();
          
      });
        
        it('GoogleLogin Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
        scope.GoogleLogin();
      });    

      it('Logout Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
        scope.Logout();
      });

      it('increaseMax Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		scope.maxQuestion = 10;
		scope.totalCount = 20;
        scope.increaseMax();
		
		scope.maxQuestion = 20;
		scope.totalCount = 10;
		scope.increaseMax();
      });
        
        
      it('searchTag Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		
          scope.searchTag('#tag');
          expect(scope.input.wholeMsg).toBe('#tag');
            
      });
            
      it('Filter Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		
        var test = "shit";
        var result = scope.filter(test);
        expect(result).toEqual("nice");
          
        var test = null;
        var result = scope.filter(test);          
        expect(result).toEqual(null);    
      });
        
      it('checknew Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          
		scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1
          },{
            wholeMsg: "Hi2",
            completed: true,
            timestamp: new Date().getTime(),
            tags: "...",
            like: 2,
            dislike:0,
            order: 2
          }];
        scope.$digest();
          
        var result = scope.checkNew(scope.todos[0]);
        expect(result).toEqual(false);
        result = scope.checkNew(scope.todos[1]);
        expect(result).toEqual(true);
            
      });
        
//    it('like Testing', function() {
//
//        var ctrl = controller('TodoCtrl', {
//          $scope: scope,
//          $location: location,
//          $firebaseArray: firebaseArray,
//          $sce: sce,
//          $localStorage: localStorage,
//          $window: window
//        });
//          
//		scope.todos=[{
//            wholeMsg: "Hi",
//            completed: false,
//            timestamp: 0,
//            tags: "...",
//            like: 1,
//            dislike:0,
//            order: 1
//          },{
//            wholeMsg: "Hi2",
//            completed: true,
//            timestamp: new Date().getTime(),
//            tags: "...",
//            like: 2,
//            dislike:0,
//            order: 2
//          }];
//        
//        scope.$digest();
//          
//        scope.like(scope.todos[0]);
//        expect(scope.todos[0].like).toEqual(2);
//      });
//        
//        it('dislike Testing', function() {
//
//            var ctrl = controller('TodoCtrl', {
//              $scope: scope,
//              $location: location,
//              $firebaseArray: firebaseArray,
//              $sce: sce,
//              $localStorage: localStorage,
//              $window: window
//            });
//
//            scope.todos=[{
//                wholeMsg: "Hi",
//                completed: false,
//                timestamp: 0,
//                tags: "...",
//                like: 1,
//                dislike:0,
//                order: 1
//              }];
//
//            scope.$digest();
//
//            scope.like(scope.todos[0]);
//            expect(scope.todos[0].dislike).toEqual(1);
//          });     
        
            
      it('angular.element Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $window: window
        });
        
          var scrollEvent = window.document.createEvent('CustomEvent');
          scrollEvent.initCustomEvent('scroll', false, false, null);
          window.scrollTo(window.scrollX, window.document.body.offsetHeight + 10);
          window.dispatchEvent(scrollEvent);
          
          scrollEvent.initCustomEvent('scroll', false, false, null);
          window.innerHeight = -10;
          window.scrollTo(window.scrollX, window.document.body.offsetHeight - 10);
          window.dispatchEvent(scrollEvent);
            
      });
//-------------------mile stone2--------------------//
      it('getUser Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window,
        });
          scope.$authData = true;
          scope.getUser();
          
          scope.$authData = false;
          scope.getUser();
          
          scope.$authData = {};
          scope.$authData.facebook = true;
          scope.getUser();
          scope.$authData.facebook = false;
          
          scope.$authData = {};
          scope.$authData.google = true;
          scope.getUser();
          scope.$authData.google = false;
          
          scope.$authData = {};
          scope.$authData.password = true;
          scope.getUser();
          scope.$authData.password = false;
            
      });
        
      it('getHighlight Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          scope.$authData = true;
          scope.isStaff = true;
          scope.getHighlight();
          
          scope.$authData = false;
          scope.isStaff = true;
          scope.getHighlight();
           
          scope.$authData = true;
          scope.isStaff = false;
          scope.getHighlight();
      }); 

      it('doPhotoAttach Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
            var element = {};
            element.files = [];
            element.files[0] = {size:52428801};       
            scope.doPhotoAttach(element);
          
            element.files[0] = {size:0};
            scope.doPhotoAttach(element);
          
            element.files[0] = {size:1};
            scope.doPhotoAttach(element);
      });
        
       it('addComment  Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
           
           var replyForms={};
           replyForms.msg = {};
           replyForms.msg.trim= function(){return ""};          
           
            scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1
          },{
            wholeMsg: "Hi2",
            completed: true,
            timestamp: new Date().getTime(),
            tags: "...",
            like: 2,
            dislike:0,
            order: 2
          },{}];
           
        scope.addComment(replyForms, scope.todos[0]);
        var replyForms = false;
        scope.addComment(replyForms, scope.todos[0]);
           
      });       
        
      it('like Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          
        scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1
          }];
          
        scope.todos.$save = function(todo){
            
        }
        scope.$digest();    
        scope.like(scope.todos[0]);
          
      });        
        
        
       it('dislike Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          
        scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1
          }];
          
        scope.todos.$save = function(todo){
            
        }
        scope.$digest();    
        scope.dislike(scope.todos[0]);
          
      });        
        
       it('revertEditing  Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          
        scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1
          }];
        scope.todos.$save = function(todo){};  
        scope.originalTodo = {};
        scope.originalTodo.wholeMsg = "abc";   
           
        scope.$digest();    
        scope.revertEditing (scope.todos[0]);
          
      });        
        
       it('signUpForm  Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          
//        scope.signup = {};
//        scope.signup.email = "abc@hotmail.com";
//        scope.signup.passowrd = "12345";
        scope.signup = false;
           
        scope.$digest();    
        scope.signUpForm();
          
      });
        
        it('loginForm  Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          
//        scope.signup = {};
//        scope.signup.email = "abc@hotmail.com";
//        scope.signup.passowrd = "12345";
        scope.signup = false;
           
        scope.$digest();    
        scope.loginForm();
          
      });       
       it('bestTodo Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          
        scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1,
            highlight: 1
          },{            
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1,
            highlight: 0},
            {            
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1,
            highlight: -1}];
        scope.todos.$save = function(todo){};  
           
        scope.$digest();    
        scope.bestTodo (scope.todos[0]);
        scope.bestTodo (scope.todos[1]);
        scope.bestTodo (scope.todos[2]);
          
      });
        
        it('rewardStudent Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
          
        scope.todos=[{
            wholeMsg: "Hi",
            completed: false,
            timestamp: 0,
            tags: "...",
            like: 1,
            dislike:0,
            order: 1,
            highlight: 1,
            questioner: "abc"
          }];
        
        scope.isStaff = false;
        scope.rewardStudent(scope.todos[0]);
        
        scope.isStaff = true;
        scope.$authData = {};
        scope.$authData.password = {};
        scope.$authData.password.email = "abc.hotmail.com";        
        scope.rewardStudent(scope.todos[0]);
        
          
      });       
       
         it('refresh Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
        scope.refresh();
        expect(scope.input).toBe('');
          
      });        
        
        it('getStaffRight Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
              
        scope.$authData = false;
        scope.getStaffRight();
          
      });        
        
        it('validate Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
              
        scope.isStaff = false;
        scope.validate();
            
        scope.isStaff = true;
        scope.validateCode = 124;
        scope.validate();
          
      });
        
        it('getStaffRight Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
              
        scope.$authData = false;
        scope.$storage = {};
        scope.$storage.authData = true;
        scope.getStaffRight();
            
        scope.$authData = true;
        scope.getStaffRight();
          
      });        
        
        it('getFav Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
            
            scope.$authData={};
            scope.getFav();
            
            scope.$authData=false;
            scope.getFav();
          
      });
        
        it('addFav Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
            
            scope.$authData=false;
            scope.addFav();
            
            scope.$authData={};
            scope.favList = false;
            scope.addFav();
          
      });
     
        it('removeFav Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
            
            scope.$authData=false;
            scope.removeFav();
            
            scope.$authData={};
            scope.favList = false;
            scope.removeFav();
            
            scope.$authData={};
            scope.favList = true;
            scope.removeFav();
          
      });
        
    });
  });
