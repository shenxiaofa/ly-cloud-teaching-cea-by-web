;(function (window, undefined) {
    'use strict';

    hiocsApp.service("Start_plateTeachingTaskService", ['$http', '$log', 'app', function($http, $log, app) {
        // 获取树菜单
        this.add = function(selClassList,callback) {
            $log.debug("Start_plateTeachingTaskService addClassList run ...");
            $log.debug(selClassList);
            $http.post(app.api.address + '/virtual-class/gradePlateArrange', selClassList)
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

        //等级人数
        this.getGradeNum = function(plateTeaching,callback) {
            $log.debug("Start_plateTeachingTaskService get run ...");
            $log.debug(plateTeaching);
            $http.get(app.api.address + '/virtual-class/gradePlateArrange/selectGradeNum/'+ plateTeaching.planId +'/'+ plateTeaching.plateId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        //板块数据
        this.get = function(planId,callback) {
            $log.debug("Start_plateTeachingTaskService get run ...");
            $log.debug(planId);
            $http.get(app.api.address + '/virtual-class/gradePlateArrange/selectGrade/'+planId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 删除
        this.delete = function(ids, callback) {
            $log.debug("Start_plateTeachingTaskService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/gradePlateArrange/'+ids)
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
        this.update = function(courseArrange , callback) {
            $log.debug("Start_plateTeachingTaskService update run ...");
            $log.debug(courseArrange);
            $http.put(app.api.address + '/virtual-class/gradePlateArrange/'+courseArrange.id, courseArrange)
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
            $log.debug("Start_plateTeachingTaskService addClassList run ...");
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

        // 删除班级人员
        this.deleteClassList = function(ids,classId, callback) {
            $log.debug("Start_plateTeachingTaskService deleteClassList run ...");
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

        // 删除班级名单通过教学任务id
        this.deleteCourseList = function(ids, callback) {
            $log.debug("Start_plateTeachingTaskService deleteCourseList run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/gradePlateArrange/deleteClassList/'+ids)
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

    }]);

})(window);