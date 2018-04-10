/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("makeupExam_teacherManageservice", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(data, callback) {
            $http.post(app.api.address + '/exam/formalManage/teacherArrange',data)
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
            /* $http.put(app.api.address + '/kwgl/jkjswh', jkjswh)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        // 删除
        this.delete = function(id, callback) {
            $http.delete(app.api.address + '/exam/formalManage/examTeacher/'+id)
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
