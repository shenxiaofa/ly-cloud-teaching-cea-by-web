;(function (window, undefined) {
    'use strict';

    hiocsApp.service("Start_plateSettingService", ['$http', '$log', 'app', function($http, $log, app) {
        
        //板块数据
        this.get = function(callback) {
            $log.debug("Start_plateSettingService get run ...");
            $http.get(app.api.address + '/virtual-class/gradePlateSetting/selectPlate')
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        this.update = function(gradePlateSetting , callback) {
            $log.debug("Start_plateSettingService update run ...");
            $log.debug(gradePlateSetting);
            $http.post(app.api.address + '/virtual-class/gradePlateSetting', gradePlateSetting)
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
            $log.debug("Start_plateSettingService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/virtual-class/gradePlateSetting/'+ids)
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