;(function (window, undefined) {
    'use strict';

    hiocsApp.directive("uiNav", ['$compile', function($compile) {
        return {
            templateUrl:'js/directive/ui-nav/tpl.html',
            restrict: 'A',
            link: function(scope, element, attributes) {
                // 底部导航栏列表
                scope.bottomNavItems = scope.$root.bottomNavItems;
                scope.$watch('$root.bottomNavItems', function(newValue) {
                    scope.bottomNavItems = newValue;
                });
            }
        };
    }]);

})(window);