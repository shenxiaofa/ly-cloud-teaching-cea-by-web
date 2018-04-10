/**
 * Created by shenxiaofa.
 */
;(function(window, undefined) {
	'use strict';

	hiocsApp.service("student_executiveClassService", ['$http', '$log', 'app', '$filter', function($http, $log, app, $filter) {
		// 添加
		this.add = function(executiveClass, callback) {
			$http({
                method:'post',
                headers: {
                    permission: "executiveClass:insert"
                },
                url:app.api.address + '/student/class',
                data: executiveClass
            }).then(function successCallback(response) {
					if(response.data.code == app.api.code.success){
						callback();
					} else {
						callback(true, response.data.message);
					}
				}, function errorCallback(response) {
					callback(true, app.api.message.error);
				});
		};
		
		// 删除
		this.delete = function(executiveClassIds, callback) {
            $http({
                headers: {
                    permission: "executiveClass:delete"
                },
                method : 'DELETE',
                params : {
                	'type' : 'deleteByPrimaryKey',
                	'ids' : executiveClassIds
                },
                url : app.api.address + '/student/class'
            }).then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    callback(true, app.api.message.error);
                });
		};
		
        // 修改
        this.update = function(executiveClass, callback) {
            executiveClass.entranceTime = $filter("date")(executiveClass.entranceTime, 'yyyy-MM-dd');
            executiveClass.leaveTime = $filter("date")(executiveClass.leaveTime, 'yyyy-MM-dd');
            $http({
                method : 'PUT',
                data : executiveClass,
                headers: {
                    permission: "executiveClass:update"
                },
                url : app.api.address + '/student/class'
            }).then(function successCallback(response) {
                callback();
            }, function errorCallback(response) {
                callback(true, app.api.message.error);
            });
        };

        /**
         * 年级专业 所属院系 下拉框
         */
        this.getSelect = function(callback) {
            $http({
				method: 'GET',
                headers: {
                    permission: "executiveClass:query"
                },
				url: app.api.address + '/student/statusInfo/selectionAddData'
	      	}).then(function successCallback(response) {
                    callback(null, null, response.data.data);
                }, function errorCallback(response) {
                }
            );
        };
        
        /**
         * 年级下拉框
         */
        this.getGradeInfo = function(callback) {
            $http({
				method: 'GET',

				url: app.api.address + '/student/class',
                headers: {
                    permission: "executiveClass:query"
                },
				params: {
					type : 'selectGradeInfo'
				}
	      	}).then(function successCallback(response) {
                    callback(null, null, response.data);
                }, function errorCallback(response) {
                }
            );
        };

	}]);

})(window);