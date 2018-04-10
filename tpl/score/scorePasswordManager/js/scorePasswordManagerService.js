;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_scorePasswordManagerService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(teacherNums,param,callback) {
            $log.debug("score_scorePasswordManagerService add run ...");
            $log.debug(teacherNums);
            $log.debug(param);
            $http.post(app.api.address + '/score/scorePassword/'+teacherNums,param)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }

        // 修改
        this.update = function(teacherNums , callback) {
            $log.debug("score_scorePasswordManagerService update run ...");
            $log.debug(teacherNums);
            $http.put(app.api.address + '/score/scorePassword/'+teacherNums)
                .then(function successCallback(response) {
                    if (response.status == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
    }]);

})(window);