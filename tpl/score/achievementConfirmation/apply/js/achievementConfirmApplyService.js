/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_achievementConfirmApplyService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(data,teachingTask) {
            $log.debug("add run ...");
            $log.debug(data);
            $log.debug(teachingTask);
            /*$http.post(app.api.address + '/kwgl/jkjswh', jkjswh)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
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
