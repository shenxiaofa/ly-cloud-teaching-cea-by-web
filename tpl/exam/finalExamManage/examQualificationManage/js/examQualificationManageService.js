/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("exam_qualificationManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(data,callback) {
            $log.debug("add run ...");
            $log.debug(data);
            $http.post(app.api.address + '/exam/testTask/examQualifications', data)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(false,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }

        this.deptPull = function(callback) {
            $http.get(app.api.address + '/exam/share/deptPull',
                {params: {recruitSign:"1"}})
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };

        this.majorPull = function(callback) {
            $http.get(app.api.address + '/exam/share/majorPull')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
        // 修改
        this.update = function(data,callback) {
            $log.debug("delete run ...");
            $http.put(app.api.address + '/exam/testTask/examQualifications',data)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(false,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }

        // 删除
        this.delete = function(data,callback) {
            $log.debug("delete run ...");
            $http.delete(app.api.address + '/exam/testTask/examQualifications/'+data)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(false,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }

    }]);

})(window);