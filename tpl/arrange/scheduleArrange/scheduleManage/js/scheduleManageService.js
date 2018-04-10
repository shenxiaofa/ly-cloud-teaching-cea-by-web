;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_scheduleManageService", ['$http', '$log', 'app', function($http, $log, app) {
        
        // 获取单位下拉框
        this.getDept = function(callback) {
            $http.get(app.api.address + '/base-info/department/findDepartmentNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                }
            );
        };
        
        // 获取课程属性
        this.getCourseProperty = function(code, callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames?datableNumber='+code)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });
        };
        
        /**
         * 获取当前的学年学期
         */
        this.getCurrentSemesterId = function(callback) {
            $http({
				method: 'GET',
				url: app.api.address + '/arrange/arrangeControl',
				params: {
					type : 'selectArrangeSemester'
				}
	      	}).then(function successCallback(response) {
                    callback(null, null, response.data);
                }, function errorCallback(response) {
                }
            );
        };
        
    }]);

})(window);