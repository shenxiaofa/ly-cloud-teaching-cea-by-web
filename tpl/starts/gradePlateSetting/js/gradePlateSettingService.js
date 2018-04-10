;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_gradePlateSettingService", ['$http', '$log', '$filter', 'app', function($http, $log, $filter, app) {

        // 查询学年学期
        this.getSemester = function(callback) {
            $log.debug("starts_gradePlateSettingService get run ...");
            $http.get(app.api.address + '/virtual-class/openPlan/selectSemester')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 通过学期ID查询开课控制
        this.add = function(gradePlate, callback) {
            $log.debug("starts_gradePlateSettingService update run ...");
            $log.debug(gradePlate);
            $http.post(app.api.address + '/virtual-class/gradePlate', gradePlate)
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
        this.update = function(gradePlate,callback) {
            $log.debug("starts_gradePlateSettingService update run ...");
            $log.debug(gradePlate);
            $http.put(app.api.address + '/virtual-class/gradePlate/'+gradePlate.id, gradePlate)
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
            $log.debug("starts_gradePlateSettingService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/gradePlate/'+ids)
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

        //板块时间数据回显
        this.get = function(plateId,callback) {
            $log.debug("starts_gradePlateSettingService get run ...");
            $log.debug(plateId);
            $http.get(app.api.address + '/virtual-class/gradePlate/'+plateId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };
    }]);

})(window);