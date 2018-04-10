;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_requiredCourseArrangeService", ['$http', '$log', 'app', function($http, $log, app) {
        // 查询学年学期
        this.gets = function(callback) {
            $log.debug("starts_requiredCourseArrangeService get run ...");
            $http.get(app.api.address + '/virtual-class/openPlan/selectFilter')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };
        // 添加
        this.add = function(courseArrange , callback) {
            $log.debug("starts_requiredCourseArrangeService add run ...");
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
        // 添加班级人员
        this.addClassList = function(selClassList , callback) {
            $log.debug("starts_requiredCourseArrangeService addClassList run ...");
            $log.debug(selClassList);
            $http.post(app.api.address + '/virtual-class/classList', selClassList)
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
            $log.debug("starts_requiredCourseArrangeService update run ...");
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
        // 删除班级人员
        this.deleteClassList = function(ids,classId, callback) {
            $log.debug("starts_requiredCourseArrangeService deleteClassList run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/classList/'+ classId +'/'+ ids)
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
        this.delete = function(ids, callback) {
            $log.debug("starts_requiredCourseArrangeService delete run ...");
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
            $log.debug("starts_requiredCourseArrangeService select run ...");
            $log.debug(classId);
            $http.get(app.api.address + '/virtual-class/readRange/'+classId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 修改修读范围
        this.updateRange = function(classId, range , callback) {
            $log.debug("starts_requiredCourseArrangeService update run ...");
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

        // 合班
        this.mergeClass = function(ids, classInfo , callback) {
            $log.debug("starts_requiredCourseArrangeService mergeClass run ...");
            $log.debug(ids);
            $log.debug(classInfo);
            $http.put(app.api.address + '/virtual-class/teachingTask/'+ids+'/lowestCountAndHighestCount',classInfo )
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

        // 拆班
        this.splitClass = function(openPlanId, classInfo , callback) {
            $log.debug("starts_requiredCourseArrangeService splitClass run ...");
            $log.debug(openPlanId);
            $log.debug(classInfo);
            $http.put(app.api.address + '/virtual-class/teachingTask/'+openPlanId+'/executiveClass',classInfo )
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