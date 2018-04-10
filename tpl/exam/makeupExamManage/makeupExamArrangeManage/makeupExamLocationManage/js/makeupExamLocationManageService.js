/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("makeupExam_locationManageService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(data,callback) {
            $log.debug("add run ...");
            $log.debug(data);
            $http.post(app.api.address + '/exam/formalManage/examLocation', data)
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

        // 修改
        this.update = function(data,callback) {
            $http.put(app.api.address + '/exam/formalManage/examLocation', data)
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
        this.delete = function(data, callback) {
            $log.debug("delete run ...");
            $http.delete(app.api.address + '/exam/formalManage/examLocation?id='+data)
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


    }]);

})(window);
