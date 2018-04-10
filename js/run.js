;(function (window, undefined) {
    'use strict';

    hiocsApp.run(['$rootScope', '$log', '$cookies', '$state', '$interval', '$localStorage', '$uibModal', 'app', 'alertService', 'logoutService',
        function ($rootScope, $log, $cookies, $state, $interval, $localStorage, $uibModal, app, alertService, logoutService) {
        $rootScope.$log = $log;
        $rootScope.baseinfo = app.baseinfo; // 基础资源 ui 的 url 前缀
        $rootScope.$log.debug("app run ...");
        // ajax 请求拦截
        ajaxRequestInterceptor($rootScope, app);
        // 若关闭调试模式，则加上拦截逻辑
        if (!app.debug) {
            // 定时判断 session 是否过期，若过期，则跳到登录页
            $rootScope.$on('sessionCheck',function(){
                sessionCheck($rootScope, $interval, app, $cookies, logoutService, alertService, $localStorage, $uibModal);
            });
            // 路由拦截
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $rootScope.showLoading = true; // 开启加载提示
                $rootScope.$emit('refreshLastAccessTime');
                // 路由权限检查
                routePrivilegeCheck(toState, $rootScope, $cookies, toParams, event, $state);
                $rootScope.showLoading = false; // 关闭加载提示
            });
            // 未登录或未授权
            $rootScope.$on('userIntercepted',function(event, errorType, message){
                // 用户未登录或者会话已丢失，则跳转到登录页
                if (errorType == 'notLogin') {
                    // 返回之前访问的页面
                    $rootScope.returnState = {
                        name: $state.current.name,
                        params: $state.params
                    }
                    $state.go('login');
                } else {
                    alertService(message);
                }
            });
            // 全局事件，刷新访问时间
            $rootScope.$on('refreshLastAccessTime',function(){
                $rootScope.lastAccessTime = new Date();
            });
            // 登录检查，若已登录，则启用 session 定时器
            var user = angular.fromJson(angular.fromJson($cookies.getObject("user")));
            if (user && user.userName) {
                $rootScope.$emit('sessionCheck');
            }
        }
    }]);

    // 定时判断 session 是否过期，若过期，则跳到登录页
    var sessionCheck = function ($rootScope, $interval, app, $cookies, logoutService, alertService, $localStorage, $uibModal) {
        if ($rootScope.stopSessionCheck) {
            // 每次定义之前，确保清除上一次的定时器
            $interval.cancel($rootScope.stopSessionCheck);
        }
        $rootScope.stopSessionCheck = $interval(function () {
            // 若 cookie 没有用户信息，则会话结束
            var user = angular.fromJson(angular.fromJson($cookies.getObject("user")));
            var currentTime = new Date();
            var lastAccessTime = $rootScope.lastAccessTime ? $rootScope.lastAccessTime : currentTime;
            var accessTimeDiff = (currentTime.getTime() - lastAccessTime.getTime()) / 1000;
            // 若超过闲置时间，则跳到登录页
            if ((!user || !user.userName) || accessTimeDiff > app.api.session.idleTime) {
                $rootScope.returnState = undefined;
                $rootScope.showLoading = true; // 开启加载提示
                // 登出
                logoutService.logout(function (error, message) {
                    $rootScope.showLoading = false; // 关闭加载提示
                    if (error) {
                        alertService(message);
                    }
                    // 清除 $localStorage 数据
                    $localStorage.$reset();
                    // 清除 session 检查定时器
                    $interval.cancel($rootScope.stopSessionCheck);
                    // 重新登录提示面板
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'tpl/login/reloginPrompt.html',
                        size: '',
                        controller: openReloginPromptController
                    });
                });
            }
        }, app.api.session.intervalCheck * 1000);
    }

    // 配置各个 url 的请求头（当组件无法设置请求头时才这样设置）
    /*var setUrlHeaders = function (app, event, jqxhr, settings) {
        var uri = settings.url;
        var index = uri.indexOf('?');
        if (index > 0) {
            uri = uri.substring(0, index);
        }
        if (uri == app.api.address + '/system/department') {
            jqxhr.setRequestHeader('permission', 'department:query');
        }
    }*/

    // ajax 请求拦截
    var ajaxRequestInterceptor = function ($rootScope, app) {
        angular.element(document).ajaxSend(function (event, jqxhr, settings) {
            if (!app.debug) {
                $rootScope.$emit('refreshLastAccessTime');
            }
            // 配置各个 url 的请求头
            //setUrlHeaders(app, event, jqxhr, settings);
        });
    }

    // 路由权限检查
    var routePrivilegeCheck = function (toState, $rootScope, $cookies, toParams, event, $state) {
        var name = toState.name;
        if (name.indexOf('home') != 0) { // 开放路由则不需验证
            if (name.indexOf('login') != 0) {
                $rootScope.returnState = null; // 清空之前返回的页面
            }
            return;
        }
        var user = angular.fromJson(angular.fromJson($cookies.getObject("user")));
        // 用户未登录或者会话已丢失，则跳转到登录页
        if (!user || !user.userName) {
            // 返回之前访问的页面
            $rootScope.returnState = {
                name: name,
                params: toParams
            }
            event.preventDefault();
            $state.go('login');
        }
    }

    // 重新登录控制器
    var openReloginPromptController = function ($rootScope, $state, $scope, $uibModalInstance, app) {
        $scope.message = app.api.message.session.timeout;
        $scope.ok = function () {
            $uibModalInstance.close();
            // 跳转到登录页
            $state.go('login');
        };
    };
    openReloginPromptController.$inject = ['$rootScope', '$state', '$scope', '$uibModalInstance', 'app'];

})(window);