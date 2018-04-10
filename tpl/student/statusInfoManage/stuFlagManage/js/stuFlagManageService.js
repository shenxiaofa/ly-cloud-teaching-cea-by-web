/**
 * Created by Administrator on 2018/1/17.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_stuFlagManageService", ['$timeout', '$http', '$log', 'app', function($timeout, $http, $log, app) {
        // 添加
        this.add = function(stuFlagInfo, permission, callback) {
            $log.debug("system_stuFlagInfoManageService add run ...");
            $log.debug(stuFlagInfo);
            $http.post(app.api.address + '/student/stuFlagInfo', stuFlagInfo, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 修改
        this.update = function(stuFlagInfo, permission, callback) {
            $log.debug("system_stuFlagInfoManageService update run ...");
            $log.debug(stuFlagInfo);
            $http.put(app.api.address + '/student/stuFlagInfo', stuFlagInfo, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 删除
        this.delete = function(id, permission, callback) {
            $log.debug("system_stuFlagInfoManageService delete run ...");
            $log.debug(id);
            $http.delete(app.api.address + '/student/stuFlagInfo?ids=' + id, {
                    headers : {permission: permission}
                })
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

    }]);

})(window);