/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("choose_chooseCourseRoundManageService", ['$http', '$log', 'app', function($http, $log, app) {
		
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

        // 新增
        this.add = function(chooseCourseRoundManage, callback) {
            $http.post(app.api.address + '/choose/chooseCourseRound', chooseCourseRoundManage)
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
        this.update = function(chooseCourseRoundManage , callback) {
            $log.debug(chooseCourseRoundManage);
            $http.put(app.api.address + '/choose/chooseCourseRound', chooseCourseRoundManage)
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
        this.release = function(chooseCourseRoundManage , callback) {
            $log.debug(chooseCourseRoundManage);
            $http.put(app.api.address + '/choose/chooseCourseRound/release', chooseCourseRoundManage)
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
            $log.debug(ids);
            $http.delete(app.api.address + '/choose/chooseCourseRound/'+ids)
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

        //选修范围数据回显
        this.get = function(roundId,callback) {
            $log.debug("choose_chooseCourseRoundManageService select run ...");
            $log.debug(roundId);
            $http.get(app.api.address + '/choose/chooseCourseRound/readRange/'+roundId)
                .then(function successCallback(response) {
                    callback( response.data.data);
                });
        };

        // 修改选修范围
        this.updateRange = function(classId, range , callback) {
            $log.debug("choose_chooseCourseRoundManageService updateRange run ...");
            $log.debug(classId +"+++++"+range);
            $http.put(app.api.address + '/choose/chooseCourseRound/readRange/'+classId, range)
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