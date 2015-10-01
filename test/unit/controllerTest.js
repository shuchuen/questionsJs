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
    }));

    describe('TodoCtrl Testing', function() {
      it('setFirstAndRestSentence', function() {
        var ctrl = controller('TodoCtrl', {
          $scope: scope
        });

        var testInputs = [
          {str:"Hello? This is Sung", exp: "Hello?"},
          {str:"Hello.co? This is Sung", exp: "Hello.co?"},
          {str:"Hello.co This is Sung", exp: "Hello.co This is Sung"},
          {str:"Hello.co \nThis is Sung", exp: "Hello.co \n"},
		  {str:"! Hello.co. This is Sung", exp: "!"},
          {str:". Hello.co? This is Sung", exp: "."},
          {str:"Hello?? This is Sung", exp: "Hello??"},
		  {str:"? . .", exp: "?"},
        ];

        for (var i in testInputs) {
          var results = scope.getFirstAndRestSentence(testInputs[i].str);
          expect(results[0]).toEqual(testInputs[i].exp);
        }
      });

      it('RoomId', function() {
        location.path('/new/path');

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location
        });

        expect(scope.roomId).toBe("new");
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

      it('addTodo Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		scope.input={};
		scope.input.wholeMsg="new todo";
        scope.addTodo();
        expect(scope.input.wholeMsg).toBe('');
		
		scope.input.wholeMsg="";
        scope.addTodo();
        expect(scope.input.wholeMsg).toBe('');		
		
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
            head: "head",
            headLastChar: "?",
            desc: "desc",
            linkedDesc: "linkedDesc",
            completed: false,
            timestamp: 0,
            tags: "...",
            echo: 1,
            order: 1
          },{ },{
            wholeMsg: "Hi2",
            head: "head",
            headLastChar: "?",
            desc: "desc",
            linkedDesc: "linkedDesc",
            completed: true,
            timestamp: new Date().getTime(),
            tags: "...",
            echo: 2,
            order: 2
          }];

        scope.$digest();
      });

      it('addEcho Testing', function() {

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
        scope.addEcho(scope.input);
        expect(scope.editedTodo).toBe(todo);
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

      it('revertEditing  Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });

        scope.revertEditing(scope.input);
        expect(scope.input.wholeMsg).toBe(scope.originalTodo.wholeMsg);
      });

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
		scope.todos.push({ name: 'testing.'});
        scope.$digest();
      });

      it('FBLogout  Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
        scope.FBLogout();
      });

      it('increaseMax   Testing', function() {

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
	  
      it('angular.element   Testing', function() {

        var ctrl = controller('TodoCtrl', {
          $scope: scope,
          $location: location,
          $firebaseArray: firebaseArray,
          $sce: sce,
          $localStorage: localStorage,
          $window: window
        });
		window.innerHeight = 10;
		window.scrollY = 10;
		window.document.body.offsetHeight = 10;
		scope.increaseMax();
		scope.$apply();
      });
	  
    });
  });
