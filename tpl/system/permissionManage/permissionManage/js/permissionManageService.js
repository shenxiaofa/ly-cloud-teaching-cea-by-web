;(function (window, undefined) {
    'use strict';

    hiocsApp.service("system_permissionManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(permission, permissionHeader, callback) {
            $log.debug("system_permissionManageService add run ...");
            $log.debug(permission);
            $http.post(app.api.address + '/system/permission', permission, {
                    headers : {permission: permissionHeader}
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
        this.update = function(param, permission, callback) {
            $log.debug("system_permissionManageService update run ...");
            $log.debug(param);
            $http.put(app.api.address + '/system/permission/' + param.originId, param.permission, {
                params: {v: "1"},
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
        this.delete = function(qxbh, permission, callback) {
            $log.debug("system_permissionManageService delete run ...");
            $log.debug(qxbh);
            $http.delete(app.api.address + '/system/permission/' + qxbh, {
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
        // 根据主键查询
        this.findById = function(qxbh, permission, callback) {
            $log.debug("system_permissionManageService findById run ...");
            $log.debug(qxbh);
            $http.get(app.api.address + '/system/permission/' + qxbh, {
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
        // 获取域
        this.findDomain = function(domain, callback) {
            $log.debug("system_permissionManageService findDomain run ...");
            $log.debug(domain);
            $http.get(app.api.address + '/system/domain', {params: domain})
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
        // 获取权限
        this.findPermission = function(permission, permissionHeader, callback) {
            $log.debug("system_permissionManageService findPermission run ...");
            $log.debug(permission);
            return $http.get(app.api.address + '/system/permission', {
                params: permission,
                headers : {permission: permissionHeader}
            })
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        return callback(null, null, response.data.data.list);
                    } else {
                        return callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    return callback(true, app.api.message.error);
                });
        };
        // 获取当前用户权限
        this.findPrivilege = function(permission, callback) {
            $log.debug("system_permissionManageService findPrivilege run ...");
            $log.debug(permission);
            return $http.get(app.api.address + '/api/privilege', {
                params: permission
            })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        return callback(null, null, response.data.data);
                    } else {
                        return callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    return callback(true, response.data.message);
                });
        };
    }]);

})(window);