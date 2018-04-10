;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_teacherScheduleService", ['$http', '$log', 'app', function($http, $log, app) {
    
        // 获取单位下拉框
        this.getDept = function(callback) {
            $http.get(app.api.address + '/base-info/department/findDepartmentNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                }
            );
        };
		
        // 获取代码库
        this.getSelect = function(code, callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames?datableNumber='+code)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                }
            );
        };
        
    }]);

})(window);