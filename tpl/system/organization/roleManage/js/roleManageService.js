;(function (window, undefined) {
    'use strict';

    hiocsApp.service("system_roleManageService", ['$timeout', '$http', '$log', 'app', function($timeout, $http, $log, app) {
        // 添加
        this.add = function(role, permission, callback) {
            $log.debug("system_roleManageService add run ...");
            $log.debug(role);
            $http.post(app.api.address + '/system/role', role, {
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
        this.update = function(role, permission, callback) {
            $log.debug("system_roleManageService update run ...");
            $log.debug(role);
            $http.put(app.api.address + '/system/role', role, {
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
            $log.debug("system_roleManageService delete run ...");
            $log.debug(id);
            $http.delete(app.api.address + '/system/role/' + id, {
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
        // 根据主键查询
        this.findById = function(jsbh, permission, callback) {
            $log.debug("system_roleManageService findById run ...");
            $log.debug(jsbh);
            $http.get(app.api.address + '/system/role/' + jsbh, {
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
        // 获取角色
        this.findRole = function(role, permission, callback) {
            $log.debug("system_roleManageService findRole run ...");
            $log.debug(role);
            $http.get(app.api.address + '/system/role', {
                params: role,
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