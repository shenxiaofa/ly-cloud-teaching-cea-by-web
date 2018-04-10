/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("makeupExam_listManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.create = function(data,callback) {
            $log.debug("update run ...");
            $http.post(app.api.address + '/exam/formalArrange/generateMakeupExamList',data)
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
        // 获取当前学年学期
        this.currentSemester = function(data,callback) {
            $log.debug("update run ...");
            $http.get(app.api.address + '/exam/formalArrange/currentSemester',data)
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
        this.classPull = function(data, callback) {
            $http.get(app.api.address + '/exam/share/classPull', {params: data})
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
        //招生单位
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

        //获取开课单位
        this.courseDeptPull = function(callback) {
            $http.get(app.api.address + '/exam/share/courseDeptPull')
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
        this.examEnable = function(id,status,callback) {
            $log.debug("update run ...");
            $http.put(app.api.address + '/exam/formalList/examEnable?id='+id+'&enable='+status)
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
        // 修改
        this.studentEnable = function(id,status,callback) {
            $log.debug("update run ...");
            $http.put(app.api.address + '/exam/formalList/studentEnable?id='+id+'&enable='+status)
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