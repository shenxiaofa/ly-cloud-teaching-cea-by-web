/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_makeupScoreEnterService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(data) {
            $log.debug("add run ...");
            $log.debug(data);
            /*$http.post(app.api.address + '/kwgl/jkjswh', jkjswh)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        // 录入成绩、更正成绩
        this.update = function(data,callback) {
            $log.debug("update run ...");
            $http.put(app.api.address + '/score/makeupExamScore/inputMakeupScore', data)
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
        this.delete = function(data) {
            $log.debug("delete run ...");
            /*$http.delete(app.api.address + '/pyfa/pyfabzkz/'+ids)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        // 导出模板
        this.exportTemplate = function(data, callback) {
            $log.debug("exportTemplate run ...");
            $log.debug(data);
            $http.get(app.api.address + '/score/makeupExamScore/exportTemplate', {
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
                url: app.api.address + '/score/makeupExamScore/import',
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
        
        // 导出
        this.exportData = function(data, callback) {
            $log.debug("exportData run ...");
            $log.debug(data);
            $http.get(app.api.address + '/score/makeupExamScore/exportMakeupScoreList', {
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
    }]);

})(window);