;(function (window, undefined) {
    'use strict';

    hiocsApp.service("exam_invigilationTeachersManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加监考教师
        this.add = function(jkjswh) {
            $log.debug("exam_invigilationTeachersManageService run ...");
            $log.debug(jkjswh);
            /*$http.post(app.api.address + '/kwgl/jkjswh', jkjswh)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        // 修改
        this.update = function(jkjswh,callback) {
            $log.debug("exam_invigilationTeachersManageService run ...");
            $log.debug(jkjswh);
            $http.put(app.api.address + '/exam/teacher/',jkjswh)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }

        // 删除
        this.delete = function(ids,callback) {
            $log.debug("scheme_schemeVersionService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/exam/teacher/'+ids)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }

        //转入
        this.into = function(data,callback) {
            $log.debug("update run ...");
            $http.post(app.api.address + '/exam/teacher/into', data)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }

        // 导出模板下载
        this.exportTemplate = function(data, callback) {
            $log.debug("exportTemplate run ...");
            $log.debug(data);
            $http.get(app.api.address + '/exam/teacher/exportTemplate', {
                    params: data,
                    responseType: 'blob'
                })
                .then(function successCallback(response) {
                    callback(response.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }
        // 导出
        this.exportData = function(data, callback) {
            $log.debug("exportData run ...");
            $log.debug(data);
            $http.get(app.api.address + '/exam/teacher/exportExamTeacherList', {
                    params: data,
                    responseType: 'blob'
                })
                .then(function successCallback(response) {
                    callback(response.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }
        // 导入
        this.importData = function(data, callback) {
            $log.debug("importData run ...");
            $log.debug(data);
            $http({
                method: 'POST',
                url: app.api.address + '/exam/teacher/importTeacher',
                data: data,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function successCallback(response) {
                if (response.data.code == app.api.code.success) {
                    callback();
                } else {
                    callback(true, response.data.data);
                }
            }, function errorCallback(response) {
                $log.debug(response);
                callback(true, app.api.message.error);
            });
        }
    }]);

})(window);