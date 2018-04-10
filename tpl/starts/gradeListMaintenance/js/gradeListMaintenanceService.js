;(function (window, undefined) {
    'use strict';

    hiocsApp.service("start_gradeListMaintenanceService", ['$http', '$log', 'app', function($http, $log, app) {

        // 查询当前学年学期
        this.getSemester = function(callback) {
            $log.debug("starts_timeSettingService get run ...");
            $http.get(app.api.address + '/virtual-class/openControl/semester')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };
        //获取学生下拉框数据
        this.getStudent = function(callback) {
            $log.debug("start_gradeListMaintenanceService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/studentInformation/dropDownBox')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        //获取等级类型下拉框数据
        this.getRankType = function(callback) {
            $log.debug("start_gradeListMaintenanceService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/levelCodeType/dropDownBox')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        //获取等级代码下拉框数据
        this.getCode = function(callback) {
            $log.debug("start_gradeListMaintenanceService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/levelCode/dropDownBox')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        //获取年级下拉框数据
        this.getGrade = function(callback) {
            $log.debug("start_gradeListMaintenanceService getMenuTree run ...");
            $http.get(app.api.address + '/base-info/grade-profession/gradePull')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        //获取等级类型下拉框数据
        this.getGradeType = function(callback) {
            $log.debug("start_gradeListMaintenanceService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/levelCodeType/dropDownBox')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        //获取行政班下拉框数据
        this.executiveClass = function(callback) {
            $log.debug("start_gradeListMaintenanceService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/executiveClass/all')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        //获取change事件数据
        this.getStudentInfo = function(ids,callback) {
            $log.debug("start_gradeListMaintenanceService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/studentGradeVo/ids/' + ids)
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 添加
        this.add = function(gradeListMaintenance, callback) {
            $log.debug("start_gradeListMaintenanceService add run ...");
            $log.debug(gradeListMaintenance);
            var mergeId = gradeListMaintenance.mergeId;
            var ids = gradeListMaintenance.ids;
            $http.post(app.api.address + '/virtual-class/studentGrade/' + mergeId + "/" + ids)
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
        this.addStudentInfo = function(gradeListMaintenance, callback) {
            $log.debug("start_gradeListMaintenanceService add run ...");
            $log.debug(gradeListMaintenance);
            var mergeId = gradeListMaintenance.mergeId;
            var ids = gradeListMaintenance.ids;
            $http.post(app.api.address + '/virtual-class/studentGrade/' + mergeId + "/" + ids)
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
        this.update = function(gradeListMaintenance, callback) {
            $log.debug("start_gradeListMaintenanceService update run ...");
            $log.debug(gradeListMaintenance);
            var mergeId = gradeListMaintenance.mergeId;
            var ids = gradeListMaintenance.ids;
            $http.put(app.api.address + '/virtual-class/studentGrade/' + mergeId + "/" + ids)
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
            $log.debug("start_gradeListMaintenanceService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/studentGrade/'+ids)
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