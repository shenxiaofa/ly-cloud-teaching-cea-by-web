;(function (window, undefined) {
    'use strict';

    hiocsApp.service("system_dataPermissionManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(dataPermission, callback) {
            $log.debug("system_dataPermissionManageService dataPermission run ...");
            $log.debug(dataPermission);
            $http.post(app.api.address + '/system/permissionDataDimension', dataPermission)
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
        this.update = function(dataPermission, callback) {
            $log.debug("system_dataPermissionManageService update run ...");
            $log.debug(dataPermission);
            $http.put(app.api.address + '/system/permissionDataDimension', dataPermission)
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
        this.delete = function(sjqxbh, callback) {
            $log.debug("system_dataPermissionManageService delete run ...");
            $log.debug(sjqxbh);
            $http.delete(app.api.address + '/system/permissionDataDimension/' + sjqxbh)
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
        this.findDataPermissionById = function(sjqxbh, callback) {
            $log.debug("system_dataPermissionManageService findDataPermissionById run ...");
            $log.debug(sjqxbh);
            //$http.get(app.api.address + '/system/dataPermission/' + sjqxbh)
            $http.get('data_test/system/tableview_dataPermission_findById.json')
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
        // 获取服务
        this.findServing = function(serving, callback) {
            $log.debug("system_dataPermissionManageService findServing run ...");
            $log.debug(serving);
            $http.get(app.api.address + '/system/serving', {params: serving})
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