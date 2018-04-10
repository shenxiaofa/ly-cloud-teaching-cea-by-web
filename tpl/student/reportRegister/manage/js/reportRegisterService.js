;(function (window, undefined) {
    'use strict';

    hiocsApp.service("student_reportRegisterService", ['$timeout', '$http', '$log', 'app', function($timeout, $http, $log, app) {
        // 添加
        this.add = function(reportRegister, permission, callback) {
            $log.debug("student_reportRegisterService add run ...");
            $log.debug(reportRegister);
            $http.post(app.api.address + '/student/reportRegisterInfo', reportRegister, {
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
        // 批量注册
        this.batchAdd = function(reportRegister, permission, callback) {
            $log.debug("student_reportRegisterService batchAdd run ...");
            $log.debug(reportRegister);
            $http.post(app.api.address + '/student/reportRegisterInfo/batch', reportRegister, {
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
        this.update = function(reportRegister, permission, callback) {
            $log.debug("student_reportRegisterService update run ...");
            $log.debug(reportRegister);
            $http.put(app.api.address + '/student/reportRegisterInfo', reportRegister, {
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
            $log.debug("student_reportRegisterService findById run ...");
            $log.debug(id);
            $http.get(app.api.address + '/student/reportRegisterInfo/' + id, {
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