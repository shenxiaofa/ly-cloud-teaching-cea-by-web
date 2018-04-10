/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_chooseCourseResultManageService", ['$http', '$log', 'app', function($http, $log, app) {
		
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
        
        this.synchronizationContent = function(callback){
//      	$http.get(app.api.address + '/base-info/acadyearterm/findAcadyeartermNamesBox')
			$http.get('data_test/choose/tableview_synchronizationContent.json')
                .then(function successCallback(response) {
                    callback(null, null, response.data);
                }, function errorCallback(response) {
                }
            );
        }

        // 按选中结果/当前页转入
        this.turnInto = function(param,callback) {
            $http.post(app.api.address + '/choose/chooseResult/intoBySelected',param)
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

        // 按查询结果转入
        this.turnIntoByResult = function(param,callback) {
            $http.post(app.api.address + '/choose/chooseResult/intoByResult',param)
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