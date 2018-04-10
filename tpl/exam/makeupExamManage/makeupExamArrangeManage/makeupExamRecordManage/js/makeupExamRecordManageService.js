/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("makeupExam_recordManageService", ['$http', '$log', 'app', function($http, $log, app) {
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

        // 修改
        this.mark = function(data, callback) {
            $http.put(app.api.address + '/exam/formalManage/examineeMark',data)
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

    }]);

})(window);
