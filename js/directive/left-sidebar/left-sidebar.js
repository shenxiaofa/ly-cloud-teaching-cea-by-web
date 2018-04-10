;(function (window, undefined) {
    'use strict';

    hiocsApp.directive('leftSidebar', ['$location', '$rootScope','$localStorage','$http','$q', 'app', function($location, $rootScope, $localStorage, $http, $q, app) {
	    return {
		    templateUrl:'js/directive/left-sidebar/tpl.html',
		    restrict: 'AE',
		    link: function(scope) {
                // 左侧菜单栏状态切换
                scope.thinLeftNav = scope.$root.$storage.thinLeftNav;
                scope.$watch('$root.$storage.thinLeftNav', function(newValue) {
                    scope.thinLeftNav = newValue;
                });

                // 根据权限过滤菜单
                var filterMenu = function (sidebarMenu, permissionData) {
                    var menu = [];
                    angular.forEach(sidebarMenu, function(data, index, array){
                        if (data && data.child) { // 存在二级菜单
                            var preMenuItem = angular.copy(data); // 克隆一份
                            preMenuItem.child = []; // 清空子菜单
                            angular.forEach(data.child, function(child, index, array){
                                angular.forEach(permissionData, function(permission, index, array){
                                    if (child.permission == permission.qxbh) { // 权限值相同则匹配
                                        preMenuItem.child.push(angular.copy(child));
                                    }
                                });
                            });
                            if (preMenuItem.child.length > 0) {
                                menu.push(preMenuItem);
                            }
                        } else {
                            angular.forEach(permissionData, function(permission, index, array){
                                if (data.permission == permission.qxbh) { // 权限值相同则匹配
                                    menu.push(angular.copy(data));
                                }
                            });
                        }
                    });
                    return menu;
                }

                // 获取菜单
                var moduleId = $location.search().moduleId;
                $http.get('data/menu/'+$location.search().moduleId+'.json')
                    .then(function successCallback(response) {
                        //$rootScope.$log.debug("filter menu ...");
                        //$rootScope.$log.debug($rootScope.permission[moduleId]);
                        // 若为调试模式，则不过滤
                        if (app.debug) {
                            scope.sidebarMenu = response.data;
                        } else {
                            // 根据权限过滤菜单
                            scope.sidebarMenu = filterMenu(response.data, $localStorage.__permission__by[moduleId]);
                        }
                    }, function errorCallback(response) {
                        $log.error(response);
                    });

                scope.check = function(x) {
                    if(x==scope.collapseVar)
                        scope.collapseVar = 0;
                    else
                        scope.collapseVar = x;
		        };
                scope.selectedChildMenu = function (target) {
                    scope.$stateUrl = target;
                };
		    }
	    };
	}]);

})(window);