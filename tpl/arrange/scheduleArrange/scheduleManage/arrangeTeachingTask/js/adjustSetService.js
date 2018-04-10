;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_adjustSetService", ['$http', '$log', 'app', function($http, $log, app) {
        
        // 修改
        this.update = function(updateParams, callback) {
            $http({
                method : 'PUT',
                data : updateParams,
                url : app.api.address + '/arrange/scheduleArrange'
            }).then(function successCallback(response) {
                if (response.data.code == app.api.code.success) {
                    callback();
                } else {
                    callback(true, response.data.message);
                }
            }, function errorCallback(response) {
                callback(true, response.data.message);
            });
        };

        // 获取单位下拉框
        this.getDept = function(callback) {
            $http.get(app.api.address + '/base-info/department/findDepartmentNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                }
            );
        };
        
    }]);

})(window);