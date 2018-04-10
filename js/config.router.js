;(function (window, undefined) {
    'use strict';

    hiocsApp.config(['$stateProvider', '$urlRouterProvider', 'app', function ($stateProvider, $urlRouterProvider, app) {
        $urlRouterProvider.when('', '/login');
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'tpl/login/login.html',
            controller: loginController
        }).state('logout', {
            url: '/logout',
            controller: logoutController
        }).state('home', {
            url: '/home',
            templateUrl: 'tpl/home.html',
            controller: function(){
                
            },
            ncyBreadcrumb: {
                skip: true
            }
        }).state('home.index', {
            url: '/index',
            templateUrl: 'tpl/index.html',
            controller:  ['$scope', '$cookies', 'baseinfo_generalService',function($scope, $cookies, baseinfo_generalService){
            	var mydate = new Date();
            	var year = mydate.getFullYear();
            	var month = mydate.getMonth()+1;
            	var day = mydate.getDate();
            	var hours = mydate.getHours();
            	var minutes = mydate.getMinutes();
            	if(month<10){
            		month = "0" + month;
            	}
            	if(day<10){
            		day = "0" + day;
            	}
            	if(hours<10){
            		hours = "0" + hours;
            	}
            	if(minutes<10){
            		minutes = "0" + minutes;
            	}
            	//获取存储当前日期
            	var myddy=mydate.getDay();
  				var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
  				var week = weekday[myddy];
            	$scope.time = year+"-"+month+"-"+day+" "+hours+":"+minutes;
            	$scope.week = week;
                // 获取当前用户，存入当前作用域
                $scope.user = angular.fromJson(angular.fromJson($cookies.getObject("user")));
               //获取当前学年学期
                baseinfo_generalService.getCurrentSemester(function (error,message,data){
                	$scope.currentSemester = data.data.acadYearSemester;
                });
                //获取当前学年学期下的第几周
                baseinfo_generalService.getCurrentSemesterWeekly($scope.currentSemester,function(error,message,data){
                	$scope.hideValue = true;
                	if(data.data.nowWeekly!=null){
                		$scope.nowWeekly = data.data.nowWeekly;
                		$scope.hideValue = false;
                	}
                });
            }]
        }).state('home.common', {
            url: '/common?moduleId&ncyBreadcrumbLabel',
            templateUrl: 'tpl/common.html',
            resolve: {
                permissionData:  ['$stateParams', 'system_permissionManageService', 'alertService', 'app',
                    function($stateParams, system_permissionManageService, alertService, app){
                        // 若是调试模式，则返回 null
                        if (app.debug) {
                            return null;
                        }
                        return system_permissionManageService.findPrivilege({
                            fwbh: $stateParams.moduleId // 服务编号
                        }, function (error, message, data) {
                            if (error) {
                                alertService(message);
                                return [];
                            }
                            if (data && data.length > 0) {
                                return data;
                            }
                            return [];
                        });
                    }
                ]
            },
            controller: ['$scope', '$rootScope', '$localStorage', '$stateParams', 'permissionData', function($scope, $rootScope, $localStorage, $stateParams, permissionData){
                if (!app.debug) {
                    // 将服务权限存入 $localStorage
                    if (!$localStorage.__permission__by) {
                        $localStorage.__permission__by = {};
                    }
                    if (!$localStorage.__permission__by[$stateParams.moduleId]) {
                        $localStorage.__permission__by[$stateParams.moduleId] = permissionData;
                    }
                    $rootScope.$log.debug("load permission ...");
                    $rootScope.$log.debug($localStorage.__permission__by);
                }
                $scope.ncyBreadcrumbLabel = $stateParams.ncyBreadcrumbLabel; // 动态改变面包屑
            }],
            ncyBreadcrumb: {
                label: '{{ncyBreadcrumbLabel}}',
            }
        });
    }]);
})(window);


