/**
 * Created by shenxiaofa.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_roomTimeDemandService", ['$http', '$log', 'app', function($http, $log, app) {
        
		// 删除
		this.empty = function(finalRoomTimeDemand, callback) {
            $http({
                method : 'DELETE',
                params : {
                	'type' : 'deleteBySemesterIdAndRoomId',
                	'semesterId' : finalRoomTimeDemand
                },
                url : app.api.address + '/arrange/roomTimeDemand'
            }).then(function successCallback(response) {
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
		
        /**
         * 学年学期下拉框（无参）
         * @param callback
         */
        this.getSemesterId = function(callback) {
            $http.get(app.api.address + '/base-info/acadyearterm/findAcadyeartermNamesBox')
                .then(function successCallback(response) {
                    callback(null, null, response.data);
                }, function errorCallback(response) {
                }
            );
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