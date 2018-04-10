/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_chooseCourseManageService", ['$http', '$log', 'app', function($http, $log, app) {
		
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

        // 转入教学班
        this.classInto = function(data,callback) {
            $http.post(app.api.address + '/choose/chooseCourse/intoTeachingClass?', data)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(false,null,response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, response.data.message);
                });
        }

        // 删除
        this.delete = function(ids, callback) {
            $log.debug("choose_chooseCourseManageService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/choose/chooseCourse/'+ids)
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