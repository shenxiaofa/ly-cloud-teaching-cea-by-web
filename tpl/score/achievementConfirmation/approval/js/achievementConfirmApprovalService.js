;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_achievementConfirmApprovalService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
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
        this.update = function(jkjswh,yj) {
            $log.debug("exam_invigilationTeachersManageService run ...");
            $log.debug(jkjswh);
           /* $http.put(app.api.address + '/kwgl/jkjswh', jkjswh)
                .then(function successCallback(response) {
                    $log.debug(response);
                }, function errorCallback(response) {
                    $log.debug(response);
                });*/
        }

        // 修改
        this.update = function(jkjswh,yj,item) {
            $log.debug("exam_invigilationTeachersManageService run ...");
            $log.debug(jkjswh);
            /* $http.put(app.api.address + '/kwgl/jkjswh', jkjswh)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }
        
        // 批量审批
        this.batchApproval = function(ids,yj) {
            $log.debug(ids);
            $log.debug(yj);
            /*$http.delete(app.api.address + '/pyfa/pyfabzkz/'+ids)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        //转入
        this.delete = function(ids) {
            $log.debug(ids);
            /*$http.post(app.api.address + '/pyfa/pyfabzkz/'+ids)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }
    }]);

})(window);