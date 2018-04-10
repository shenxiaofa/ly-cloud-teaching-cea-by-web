/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_outsideBindReviewService", ['$http', '$log', 'app', function($http, $log, app) {
        // 审批
        this.review = function(opinion,processInstanceIds,callback) {
            $log.debug("score_outsideReviewService add run ...");
            $log.debug(opinion);
            $log.debug(processInstanceIds);
            $http.post(app.api.address + '/score/outSysScoreReview/'+processInstanceIds,opinion)
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