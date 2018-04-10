;(function (window, undefined) {
    'use strict';

    hiocsApp.service("score_outSideMaintainService", ['$http', '$log', 'app', function($http, $log, app) {
        // 删除
        this.delete = function(ids, callback) {
            $log.debug("score_outSideMaintainService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/score/outSysScoreApply/'+ids)
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

        // 删除
        this.deleteBinding = function(ids, callback) {
            $log.debug("score_outSideMaintainService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/score/outSysScoreApply/deleteBinding/'+ids)
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
        this.add = function(courseArrange , callback) {
            $log.debug("score_outSideMaintainService add run ...");
            // $log.debug(courseArrange);
            $http.post(app.api.address + '/score/outSysScoreApply', courseArrange)
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

        // 添加
        this.courseBinding = function(outSysScoreIds, studentScoreIds , callback) {
            $log.debug("score_outSideMaintainService add run ...");
            // $log.debug(courseArrange);
            $http.post(app.api.address + '/score/outSysScoreApply/courseBinding', {}, {
                    params:{
                        outSysScoreIds:outSysScoreIds,
                        studentScoreIds:studentScoreIds
                    }
                })
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
        this.update = function(courseArrange , callback) {
            $log.debug("score_outSideMaintainService update run ...");
            $log.debug(courseArrange);
            $http.put(app.api.address + '/score/outSysScoreApply/'+courseArrange.id, courseArrange)
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
        this.updateCourseBinding = function(id, outSysScoreIds, studentScoreIds, callback) {
            $log.debug("score_outSideMaintainService update run ...");
            // $log.debug(id);
            $http.put(app.api.address + '/score/outSysScoreApply/updateCourseBinding/'+id,{},{
                    params:{
                        outSysScoreIds:outSysScoreIds,
                        studentScoreIds:studentScoreIds
                    }
            }) .then(function successCallback(response) {
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

        /**
         * 查询课程模块
         * @param callback
         */
        this.findCourseModel = function(callback) {
            $http.get(app.api.address + 'scheme/share/courseModel')
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
        };
    }]);

})(window);