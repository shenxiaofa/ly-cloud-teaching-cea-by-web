;(function (window, undefined) {
    'use strict';

    hiocsApp.service("student_schoolTransactionService", ['$timeout', '$http', '$log', 'app', function($timeout, $http, $log, app) {
        // 添加
        this.add = function(schoolTransaction, permission, callback) {
            $log.debug("student_schoolTransactionService add run ...");
            $log.debug(schoolTransaction);
            $http.post(app.api.address + '/student/schoolTransaction', schoolTransaction, {
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
        this.update = function(schoolTransaction, permission, callback) {
            $log.debug("student_schoolTransactionService update run ...");
            $log.debug(schoolTransaction);
            $http.put(app.api.address + '/student/schoolTransaction', schoolTransaction, {
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
            $log.debug("student_schoolTransactionService delete run ...");
            $log.debug(id);
            $http.delete(app.api.address + '/student/schoolTransaction/' + id, {
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
        /// 根据学籍异动ID获取学籍异动信息
        this.findById = function(id, permission, callback) {
            $log.debug("student_schoolTransactionService findStudentById run ...");
            $log.debug(id);
            $http.get(app.api.address + '/student/schoolTransaction/' + id, {
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
        // 根据学号查询学籍
        this.findStudentByNum = function(num, permission, callback) {
            $log.debug("student_schoolTransactionService findStudentByNum run ...");
            $log.debug(num);
            $http.get(app.api.address + '/student/statusInfo/' + num, {
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