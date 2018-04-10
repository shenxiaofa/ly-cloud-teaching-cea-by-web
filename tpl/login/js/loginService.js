;(function (window, undefined) {
    'use strict';

    hiocsApp.service("loginService", ['$http', '$log', 'app', function($http, $log, app) {
        // 登录
        this.login = function(param, callback) {
            $log.debug("loginService login run ...");
            $log.debug(param);
            $http.post(app.api.address + '/api/login', {}, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: param
            })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };

        // 获取管理员验证码
        this.getManagerGeetestCode = function (param, callback) {
            $log.debug("loginService getManagerGeetestCode run ...");
            $log.debug(param);
            $http.get(app.api.address + '/api/verificationCode?pattern=' + param.module)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        }

        // 检测登录状态
        this.checkLoginStatus = function (callback) {
            $log.debug("loginService checkLoginStatus run ...");
            $http.get(app.api.address + '/api/login/status')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        }
    }]);

})(window);