;(function (window, undefined) {
    'use strict';

    hiocsApp.service("student_reportRegisterControlService", ['$timeout', '$http', '$log', 'app', function($timeout, $http, $log, app) {
        // 添加
        this.add = function(reportRegisterControl, permission, callback) {
            $log.debug("student_reportRegisterControlService add run ...");
            $log.debug(reportRegisterControl);
            $http.post(app.api.address + '/student/reportRegisterControl', reportRegisterControl, {
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
                    callback(true, response.data.message);
                });
        };
        // 修改
        this.update = function(reportRegisterControl, permission, callback) {
            $log.debug("student_reportRegisterControlService update run ...");
            $log.debug(reportRegisterControl);
            $http.put(app.api.address + '/student/reportRegisterControl', reportRegisterControl, {
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
                    callback(true, response.data.message);
                });
        };
        // 删除
        this.delete = function(id, permission, callback) {
            $log.debug("student_reportRegisterControlService delete run ...");
            $log.debug(id);
            $http.delete(app.api.address + '/student/reportRegisterControl/' + id, {
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
                    callback(true, response.data.message);
                });
        };
        // 根据主键查询
        this.findById = function(id, permission, callback) {
            $log.debug("student_reportRegisterControlService findById run ...");
            $log.debug(id);
            $http.get(app.api.address + '/student/reportRegisterControl/' + id, {
                    headers : {permission: permission}
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
    }]);

})(window);