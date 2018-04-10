;(function (window, undefined) {
    'use strict';

    hiocsApp.service("logoutService", ['$http', '$log', 'app', function($http, $log, app) {
        // 登出
        this.logout = function(callback) {
            $log.debug("logoutService logout run ...");
            $http.get(app.api.address + '/api/logout')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, response.data.message);
                });
        };
    }]);

})(window);