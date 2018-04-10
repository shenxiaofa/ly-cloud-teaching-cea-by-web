;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_scoreEnteringService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.save = function(taskIds,rows,callback) {
            $log.debug("add run ...");
            $log.debug(taskIds);
            $log.debug(rows);
            $http.post(app.api.address + '/score/scoreEntering/'+taskIds,rows)
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

        // 添加
        this.generate = function(data,callback) {
            $log.debug("generate run ...");
            $http.post(app.api.address + '/score/scoreEntering/generateScoreTask',data)
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

        // 删除
        this.delete = function(ids, callback) {
            $log.debug("score_scoreEnteringService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/score/scoreEntering/'+ids)
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
        this.update = function(executorId ,teacherInfo, callback) {
            $log.debug("score_scoreEnteringService update run ...");
            $log.debug(teacherInfo);
            $http.put(app.api.address + '/score/scoreEntering/'+executorId, teacherInfo)
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
        };

        // 修改
        this.updateTime = function(taskIds ,dto, callback) {
            $log.debug("score_scoreEnteringService update run ...");
            $log.debug(dto);
            $http.put(app.api.address + '/score/scoreEntering/updateTime/'+taskIds, dto)
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
        };
    }]);

})(window);