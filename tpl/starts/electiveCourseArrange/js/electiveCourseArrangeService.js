;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_electiveCourseArrangeService", ['$http', '$log', 'app', function($http, $log, app) {
        // 查询学年学期
        this.gets = function(callback) {
            $log.debug("starts_electiveCourseArrangeService get run ...");
            $http.get(app.api.address + '/virtual-class/openPlan/selectFilter')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 添加
        this.add = function(courseArrange , callback) {
            $log.debug("starts_electiveCourseArrangeService add run ...");
            $log.debug(courseArrange);
            $http.post(app.api.address + '/virtual-class/teachingTask', courseArrange)
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
            $log.debug("starts_electiveCourseArrangeService update run ...");
            $log.debug(courseArrange);
            $http.put(app.api.address + '/virtual-class/teachingTask/'+courseArrange.id, courseArrange)
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
        // 删除
        this.delete = function(ids, callback) {
            $log.debug("starts_electiveCourseArrangeService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/teachingTask/'+ids)
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

        //修读范围数据回显
        this.get = function(classId,callback) {
            $log.debug("starts_electiveCourseArrangeService select run ...");
            $log.debug(classId);
            $http.get(app.api.address + '/virtual-class/readRange/'+classId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 修改修读范围
        this.updateRange = function(classId, range , callback) {
            $log.debug("starts_electiveCourseArrangeService updateRange run ...");
            $log.debug(classId +"+++++"+range);
            $http.put(app.api.address + '/virtual-class/readRange/'+classId, range)
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