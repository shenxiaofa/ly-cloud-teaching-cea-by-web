;(function (window, undefined) {
    'use strict';

    hiocsApp.service("system_userManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(user, permission, callback) {
            $log.debug("system_userManageService add run ...");
            $log.debug(user);
            $http.post(app.api.address + '/system/user', user, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 修改
        this.update = function(user, permission, callback) {
            $log.debug("system_userManageService update run ...");
            $log.debug(user);
            $http.put(app.api.address + '/system/user', user, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 删除
        this.delete = function(id, permission, callback) {
            $log.debug("system_userManageService delete run ...");
            $log.debug(id);
            $http.delete(app.api.address + '/system/user/' + id, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback();
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }
        // 获取用户
        this.findUserById = function(yhbh, permission, callback) {
            $log.debug("system_userManageService findUserById run ...");
            $log.debug(yhbh);
            $http.get(app.api.address + '/system/user/' + yhbh, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 获取用户
        this.findUser = function(user, permission, callback) {
            $log.debug("system_userManageService findUser run ...");
            $log.debug(user);
            $http.get(app.api.address + '/system/user', {
                params: user, 
                headers : {permission: permission}
            })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback(null, null, response.data.data.list);
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
    }]);

})(window);