;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_projectCodeMaintenanceService", ['$http', '$log', 'app', function($http, $log, app) {

        //获取项目类型下拉框数据
        this.getProjet = function(callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/projectCode')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        //获取项目类型下拉框数据
        this.getprojetType = function(callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/virtual-class/projectType')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        //获取对应课程信息下拉框数据
        this.getCourse = function(callback) {
            $log.debug("Start_plateSettingService getMenuTree run ...");
            $http.get(app.api.address + '/base-info/courseLibrary/showAlllist')
                .then(function successCallback(response) {
                    $log.debug(response);
                    callback(false, null, response.data.data);
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        // 添加
        this.add = function(projectCode, callback) {
            $log.debug("starts_projectCodeMaintenanceService add run ...");
            $log.debug(projectCode);
            $http.post(app.api.address + '/virtual-class/projectType', projectCode)
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
        this.update = function(projectCode , callback) {
            $log.debug("starts_projectCodeMaintenanceService update run ...");
            $log.debug(projectCode);
            $http.put(app.api.address + '/virtual-class/projectType/'+projectCode.id, projectCode)
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
            $log.debug("starts_projectCodeMaintenanceService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/projectType/'+ids)
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
        this.addCode = function(rows, callback) {
            $log.debug("starts_projectCodeMaintenanceService add run ...");
            $log.debug(rows);
            var projectTypeId = rows.projectTypeId;
            var projectIds = rows.ids;
            $http.post(app.api.address + '/virtual-class/projectTypeSettingVo/' + projectTypeId + "/" + projectIds)
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
        this.updateCode = function(code, callback) {
            $log.debug("starts_projectCodeMaintenanceService update run ...");
            $log.debug(code);
            $http.put(app.api.address + '/virtual-class/projectCode/'+code.id, code)
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
        this.deleteCode = function(ids, callback) {
            $log.debug("starts_projectCodeMaintenanceService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/projectTypeSettingVo/'+ids)
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