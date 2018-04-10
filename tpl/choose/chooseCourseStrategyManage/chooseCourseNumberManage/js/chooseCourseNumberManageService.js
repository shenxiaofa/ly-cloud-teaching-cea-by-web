/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_chooseCourseNumberManageService", ['$http', '$log', 'app', function($http, $log, app) {
		
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

        this.queryClass = function(param, callback) {
            $http.post(app.api.address + '/choose/chooseCourseNumber/classPull', param)
                .then(function successCallback(response) {
                        callback(null, null, response.data);
                    }, function errorCallback(response) {
                    }
                );
        };

        // 新增
        this.add = function(chooseCourseNumber, callback) {
            $http.post(app.api.address + '/choose/chooseCourseNumber', chooseCourseNumber)
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

        // 修改
        this.update = function(chooseCourseNumber , callback) {
            $log.debug(chooseCourseNumber);
            $http.put(app.api.address + '/choose/chooseCourseNumber', chooseCourseNumber)
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

        // 删除
        this.delete = function(id, callback) {
            $log.debug(id);
            $http.delete(app.api.address + '/choose/chooseCourseNumber/'+id)
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
        }
        
	}]);

})(window);