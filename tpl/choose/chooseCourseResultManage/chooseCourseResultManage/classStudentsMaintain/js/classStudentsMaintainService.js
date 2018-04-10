/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_classStudentsMaintainService", ['$http', '$log', 'app', function($http, $log, app) {
		// 添加
		this.add = function(param,callback) {
			$http.post(app.api.address + '/choose/chooseResult/addStudents',param)
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

		// 移除
		this.delete = function(ids,callback) {
			$http.put(app.api.address + '/choose/chooseResult/removeStudents?ids='+ids)
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