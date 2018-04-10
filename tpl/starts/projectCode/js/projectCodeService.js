;(function (window, undefined) {
    'use strict';

    hiocsApp.service("starts_projectCodeService", ['$http', '$log', 'app', function($http, $log, app) {

        // 添加
        this.addCode = function(code, callback) {
            $log.debug("starts_projectCodeMaintenanceService add run ...");
            $log.debug(code);
            $http.post(app.api.address + '/virtual-class/projectCode', code)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.areadyExists.error);
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
                    callback(true, app.api.areadyExists.error);
                });
        };
        // 删除
        this.deleteCode = function(ids, callback) {
            $log.debug("starts_projectCodeMaintenanceService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/projectCode/'+ids)
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