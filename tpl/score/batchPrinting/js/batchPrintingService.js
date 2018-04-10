;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_batchPrintingService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加监考教师
        this.queryScoreInfo = function(studentNum,type,callback) {
            $log.debug("score_batchPrintingService run ...");
            $log.debug(studentNum,type);
            $http.get(app.api.address + '/score/scorePrinting/'+studentNum+'/'+type)
             .then(function successCallback(response) {
                 if (response.data.code == app.api.code.success) {
                     callback(null, null, response.data);
                 } else {
                     callback(true, response.data.message);
                 }
             }, function errorCallback(response) {
                 $log.debug(response);
                 callback(true, response.data.message);
             });
        }

        // 修改
        this.update = function(jkjswh) {
            $log.debug("score_batchPrintingService run ...");
            $log.debug(jkjswh);
           /* $http.put(app.api.address + '/kwgl/jkjswh', jkjswh)
                .then(function successCallback(response) {
                    $log.debug(response);
                }, function errorCallback(response) {
                    $log.debug(response);
                });*/
        }

        // 删除
        this.delete = function(ids) {
            $log.debug(ids);
            /*$http.delete(app.api.address + '/pyfa/pyfabzkz/'+ids)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }

        //转入
        this.into = function(jkjswh) {
            $log.debug(jkjswh);
            /*$http.post(app.api.address + '/pyfa/pyfabzkz/'+ids)
             .then(function successCallback(response) {
             $log.debug(response);
             }, function errorCallback(response) {
             $log.debug(response);
             });*/
        }
    }]);

})(window);