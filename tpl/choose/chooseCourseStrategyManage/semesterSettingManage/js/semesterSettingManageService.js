/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_semesterSettingManageService", ['$http', '$log', 'app', function($http, $log, app) {
		
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

        // 添加
        this.add = function(semesterSettingManage , callback) {
            $log.debug("choose_semesterSettingManageService add run ...");
            $log.debug(semesterSettingManage);
            $http.post(app.api.address + '/choose/semesterSet', semesterSettingManage)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 添加
        this.update = function(semesterSettingManage , callback) {
            $log.debug("choose_semesterSettingManageService update run ...");
            $log.debug(semesterSettingManage);
            $http.put(app.api.address + '/choose/semesterSet', semesterSettingManage)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };
        
	}]);

})(window);