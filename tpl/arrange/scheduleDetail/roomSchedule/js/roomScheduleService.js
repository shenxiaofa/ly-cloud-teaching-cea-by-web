;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_roomScheduleService", ['$http', '$log', 'app', function($http, $log, app) {
        // 获取校区下拉框
        this.getCampus = function(callback) {
            $http.get(app.api.address + '/base-info/campus/findCampusNamesBox')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                }
            );
        };
        
        // 查询教学楼下拉框（无参）
        this.getTeachingBuildingPull = function(callback) {
            $http.get(app.api.address + '/base-info/teaching-building/pull')
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                }
            );
        };
        
        // 获取教室类型
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