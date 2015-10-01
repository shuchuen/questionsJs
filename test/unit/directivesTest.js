'use strict';
beforeEach(module('todomvc'));

  var triggerKeyDown = function (element, keyCode) {
    var _e = jQuery.Event("keydown");
    _e.keyCode = keyCode;
    element.triggerHandler(_e);
  };

  var triggerBlur = function (element) {
    var _e = jQuery.Event("blur");
    element.triggerHandler(_e);
  };

  describe('directive testing', function () {
    var scope, compile, browser, timeout;

    beforeEach(inject(function ($rootScope, $compile, $browser, $timeout) {
      scope = $rootScope.$new();
      compile = $compile;
      browser = $browser;
      timeout = $timeout;
    }));


    it('todoBlur Testing', function () {
      var temp = false,
      element = angular.element('<input todo-blur="todoBlur()">');

      scope.todoBlur = function () {
        temp = !temp;
      };

      compile(element)(scope);

      temp = true,
      triggerBlur(element);
      expect(temp).toBe(false);
	  
      triggerBlur(element);
      expect(temp).toBe(true);


      spyOn(element, 'unbind');
      scope.$destroy();
      
    });
	
    it('todoFocus Testing', function () {
      var element = angular.element('<input todo-focus="focus">');
      scope.focus = false;

      compile(element)(scope);
      expect(browser.deferredFns.length).toBe(0);

      scope.$apply(function () {
        scope.focus = true;
      });
      expect(browser.deferredFns.length).toBe(1);

	  
      spyOn(element[0],'focus');
      timeout.flush();
      expect(element[0].focus).toHaveBeenCalled();

      scope.$apply(function () {
        scope.focus = false;
      });
      expect(browser.deferredFns.length).toBe(0);

    });

	
    it('todoEscape Testing', function () {
      var temp = false,
      element = angular.element('<input todo-blur="todoEscape()">');

      scope.todoEscape = function () {
        temp = !temp;
      };

      compile(element)(scope);

	  temp = false,
      triggerKeyDown(element, 12);
      expect(temp).toBe(false);
	  
      triggerKeyDown(element, 27);
      expect(temp).toBe(true);


      spyOn(element, 'unbind');
      scope.$destroy();
      
    });

    it('todoFocus Testing', function () {
      var element = angular.element('<input todo-focus="focus">');
      scope.focus = false;

      compile(element)(scope);
      expect(browser.deferredFns.length).toBe(0);

      scope.$apply(function () {
        scope.focus = true;
      });
      expect(browser.deferredFns.length).toBe(1);

      spyOn(element[0],'focus');
      timeout.flush();
      expect(element[0].focus).toHaveBeenCalled();

      scope.$apply(function () {
        scope.focus = false;
      });

    });

  });