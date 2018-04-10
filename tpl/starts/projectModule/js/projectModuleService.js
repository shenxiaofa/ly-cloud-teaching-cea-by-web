;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_projectModuleService", ['$http', '$log', 'app', function($http, $log, app) {
        // 查询学年学期
        this.get = function(callback) {
            $log.debug("starts_timeSettingService get run ...");
            $http.get(app.api.address + '/base-info/acadyearterm/findAcadyeartermNamesBox')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        //项目时间数据回显
        this.getTime = function(plateId,callback) {
            $log.debug("starts_gradePlateSettingService get run ...");
            $log.debug(plateId);
            $http.get(app.api.address + '/virtual-class/projectPlateTime/plateId/'+plateId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };
        // // 查询学年学期
        // this.get = function(callback) {
        //     $log.debug("starts_timeSettingService get run ...");
        //     $http.get(app.api.address + '/virtual-class/openPlan/selectSemester')
        //         .then(function successCallback(response) {
        //             callback( response.data.data);
        //         });
        // };
        // 添加
        this.add = function(projectModule, callback) {
            $log.debug("starts_projectModuleService add run ...");
            $log.debug(projectModule);
            $http.post(app.api.address + '/virtual-class/projectPlate', projectModule)
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

        // 添加时间
        this.addTime = function(time, callback) {
            $log.debug("starts_projectModuleService add run ...");
            $log.debug(time);
            $http.post(app.api.address + '/virtual-class/projectPlateTime/list', time)
                // .then(function successCallback(response) {
                //     if (response.data.code == app.api.code.success) {
                //         callback();
                //     } else {
                //         callback(true, response.data.message);
                //     }
                // }, function errorCallback(response) {
                //     $log.debug(response);
                //     callback(true, app.api.message.error);
                // });
        };
        // 修改
        this.update = function(projectModule, callback) {
            $log.debug("starts_projectModuleService update run ...");
            $log.debug(projectModule);
            $http.put(app.api.address + '/virtual-class/projectPlate', projectModule)
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
            $log.debug("starts_projectModuleService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/projectPlate/'+ids)
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

        // 删除时间
        this.deleteTime = function(ids, callback) {
            $log.debug("starts_projectModuleService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/projectPlateTime/'+ids)
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