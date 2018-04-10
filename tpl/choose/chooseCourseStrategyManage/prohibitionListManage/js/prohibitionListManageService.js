/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_prohibitionListManageService", ['$http', '$log', 'app', function($http, $log, app) {
		
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
        
        // 获取年级下拉框
        this.getGrade = function(callback) {
            $http.get(app.api.address + '/base-info/grade-profession/gradePull')
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                });

        };

        // 获取年级下拉框
        this.generate = function(semesterId,callback) {
            $http.get(app.api.address + '/choose/prohibitionList/generate/'+semesterId)
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

        // 新增
        this.add = function(studentIds, prohibitionListAdd, callback) {
            $http.post(app.api.address + '/choose/prohibitionList/'+studentIds, prohibitionListAdd)
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
        this.delete = function(ids, callback) {
            $log.debug("choose_prohibitionListManageService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/choose/prohibitionList/'+ids)
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

        // 修改
        this.update = function(prohibitionList , callback) {
            $log.debug("choose_prohibitionListManageService update run ...");
            $log.debug(prohibitionList);
            $http.put(app.api.address + '/choose/prohibitionList', prohibitionList)
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