/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("makeupExam_courseManageService", ['$http', '$log', 'app', function($http, $log, app) {

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