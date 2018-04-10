/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_monitorAdjustManageService", ['$http', '$log', 'app', function($http, $log, app) {
		
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

        this.getRound = function(semesterId,callback) {
            $http.get(app.api.address + '/choose/classList/roundPull?semesterId='+semesterId)
                .then(function successCallback(response) {
                        callback(null, null, response.data);
                    }, function errorCallback(response) {
                    }
                );
        };

        // 按查询结果转入
        this.adjust = function(param,callback) {
            $http.put(app.api.address + '/choose/monitor/capacity?id='+param.id+'&capacity='+param.capacity)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }
        
	}]);

})(window);