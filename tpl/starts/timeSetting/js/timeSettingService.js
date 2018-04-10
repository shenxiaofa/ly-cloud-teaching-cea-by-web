;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_timeSettingService", ['$http', '$log', '$filter', 'app', function($http, $log, $filter, app) {

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

        // 查询当前学年学期
        this.getSemester = function(callback) {
            $log.debug("starts_timeSettingService get run ...");
            $http.get(app.api.address + '/virtual-class/openControl/semester')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 通过学期ID查询开课控制
        this.getTimeData = function(semesterId, callback) {
            $log.debug("starts_timeSettingService getTimeData run ...");
            $log.debug(semesterId);
            $http.get(app.api.address + '/virtual-class/openControl/'+ semesterId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 修改
        this.update = function(timeSetting,callback) {
            $log.debug("starts_timeSettingService update run ...");
            $log.debug(timeSetting);
            var timeSettingDestination = angular.copy(timeSetting, {});
            timeSettingDestination.startTime = $filter("date")(timeSettingDestination.startTime, 'yyyy-MM-dd');
            timeSettingDestination.endTime = $filter("date")(timeSettingDestination.endTime, 'yyyy-MM-dd');
            $http.post(app.api.address + '/virtual-class/openControl',timeSettingDestination)
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