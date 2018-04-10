;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_chooseRoomService", ['$http', '$log', 'app', function($http, $log, app) {
    	
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