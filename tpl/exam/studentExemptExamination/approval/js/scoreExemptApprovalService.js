;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_exemptApprovalService", ['$http', '$log', 'app', function($http, $log, app) {
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
        this.batchApproval = function(data,callback) {
            $http.post(app.api.address + '/exam/examReview/review',data)
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