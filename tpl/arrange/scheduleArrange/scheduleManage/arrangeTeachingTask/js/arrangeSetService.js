;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_arrangeSetService", ['$http', '$log', 'app', function($http, $log, app) {
        // 添加
        this.add = function(arrangeTeachingTask, callback) {
			$http.post(app.api.address + '/arrange/scheduleArrange', arrangeTeachingTask)
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
				}
			);
        };
        // 修改
        this.update = function(param) {
			
        };
        // 删除
        this.delete = function(arrangeTeachingTaskParams, callback) {
        	$http({
                method : 'DELETE',
                params : {
                	'type' : 'deleteByParams',
                	'semesterId' : arrangeTeachingTaskParams.semesterId,
                	'way' : arrangeTeachingTaskParams.way,
                	'value' : arrangeTeachingTaskParams.value
                },
                url : app.api.address + '/arrange/scheduleArrange'
            }).then(function successCallback(response) {
					$log.debug(response);
					if(response.data.code == app.api.code.success){
						callback();
					} else {
						callback(true, response.data.message);
					}
				}, function errorCallback(response) {
					$log.debug(response);
					callback(true, response.data.message);
				}
			);
        };
        
        /**
         * 任课老师下拉框（无参）
         * @param callback
         */
        this.getTeacherId = function(callback) {
            $http.get(app.api.address + '/base-info/base-teacher/pull')
                .then(function successCallback(response) {
                    callback(null, null, response.data);
                }, function errorCallback(response) {
                }
            );
        };
        
    }]);

})(window);