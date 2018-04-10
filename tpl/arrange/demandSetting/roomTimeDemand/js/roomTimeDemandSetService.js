/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("arrange_roomTimeDemandSetService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(roomTimeDemand, callback) {
			$http.post(app.api.address + '/arrange/roomTimeDemand', roomTimeDemand)
				.then(function successCallback(response) {
					$log.debug(response);
					if(response.data.code == app.api.code.success){
						callback();
					} else {
						callback(true, response.data.message);
					}
				}, function errorCallback(response) {
					$log.debug(response);
					callback(true, response.data.message);
				});
        };
        
        // 删除
        this.delete = function(roomTimeDemandIds, callback) {
            $http({
                method : 'DELETE',
                params : {'type' : 'deleteByPrimaryKey', 'ids' : roomTimeDemandIds},
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
        
	}]);

})(window);