/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("makeupExam_classManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 创建教学班
        this.add = function(data,callback) {
            $log.debug("add run ...");
            $log.debug(data);
            $http.post(app.api.address + '/exam/formalArrange/createExamClass', data)
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
        // 维护教学班
        this.maintainExamClass = function(data,callback) {
            $log.debug("add run ...");
            $log.debug(data);
            $http.post(app.api.address + '/exam/formalArrange/maintainExamClass', data)
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

        // 获取教学班
        this.getTeachingClass = function(formalId,examClassId,callback) {
            $http.get(app.api.address + '/exam/formalArrange/findClass?formalId='+formalId+'&examClassId='+examClassId)
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
        // 获取流水号
        this.getSerialNumber = function(taskId,callback) {
            $http.get(app.api.address + '/exam/formalArrange/examClassSerialNumber?examTaskId='+taskId)
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
        this.update = function(data) {
            $log.debug("update run ...");
            $log.debug(data);
            /* $http.put(app.api.address + '/kwgl/jkjswh', jkjswh)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        // 删除
        this.delete = function(data,callback) {
            $log.debug("delete run ...");
            $http.delete(app.api.address + '/exam/formalArrange/examClass?id='+data)
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
