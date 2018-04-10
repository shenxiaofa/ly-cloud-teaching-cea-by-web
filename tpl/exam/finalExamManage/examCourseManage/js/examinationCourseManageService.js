/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("exam_courseManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(data) {
            $log.debug("add run ...");
            /*$http.post(app.api.address + '/kwgl/jkjswh', jkjswh)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        // 下放
        this.update = function(id,status,deptId,callback) {
            $http.put(app.api.address + '/exam/testTask/examTaskToggle?id='+id+'&status='+status+'&deptId='+deptId)
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
        // 批量下放
        this.batchDown = function(param,callback) {
            $http.put(app.api.address + '/exam/testTask/batchDown',param)
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