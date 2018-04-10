;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_teachingClassService", ['$http', '$log', 'app', function($http, $log, app) {
        //获取项目下拉框数据
        this.getMenuTree = function(courseId,callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/projectCode/courseId/' + courseId)
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        //获取项目下拉框数据
        this.getProjectName = function(plateId,callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/projectCode/' + plateId)
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        //获取校区下拉框数据
        this.getCampus = function(callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/base-info/campus/findCampusNamesBox')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        //获取行政班下拉框数据
        this.getPlate = function(callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/executiveClass')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        //获取板块下拉框数据
        this.getProjectPlate = function(callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/projectPlate/all')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 添加
        this.add = function(teachingClass, callback) {
            $log.debug("starts_teachingClassService add run ...");
            $log.debug(teachingClass);
            $http.post(app.api.address + '/virtual-class/projectTeachingTask/', teachingClass)
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

        // 添加学生信息
        this.addStudent = function(xjs, callback) {
            $log.debug("starts_teachingClassService add run ...");
            $log.debug(xjs);
            $http.put(app.api.address + '/virtual-class/courseList/out/'+xjs)
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
        this.update = function(teachingClass, callback) {
            $log.debug("starts_teachingClassService update run ...");
            $log.debug(teachingClass);
            $http.put(app.api.address + '/virtual-class/projectTeachingTask', teachingClass)
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
        this.delete = function(ids, teachingTaskId, callback) {
            $log.debug("starts_teachingClassService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/courseList/'+ids+'/'+teachingTaskId)
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


        this.setPlate = function(array, callback) {
            $log.debug("starts_teachingClassService delete run ...");
            $log.debug(array);
            $http.put(app.api.address + '/virtual-class/projectTeachingTask/setPlate/'+array)
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

        //修读范围数据回显
        this.get = function(classId,callback) {
            $log.debug("starts_teachingClassService select run ...");
            $log.debug(classId);
            $http.get(app.api.address + '/virtual-class/readRange/'+classId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };
        // 修改修读范围
        this.updateRange = function(classId, range , callback) {
            $log.debug("starts_teachingClassService update run ...");
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