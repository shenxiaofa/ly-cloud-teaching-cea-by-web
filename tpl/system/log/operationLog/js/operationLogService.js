;(function (window, undefined) {
    'use strict';

    hiocsApp.service("system_operationLogService", ['$timeout', '$http', '$log', 'app', function($timeout, $http, $log, app) {
        // 根据主键查询
        this.findById = function(jsbh, callback) {
            $log.debug("system_roleManageService findById run ...");
            $log.debug(jsbh);
            $http.get(app.api.address + '/system/role/' + jsbh)
                .then(function successCallback(response) {
                    if (response.data.meta.success) {
                        callback(null, null, response.data.data);
                    } else {
                        callback(true, response.data.meta.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
    }]);

})(window);