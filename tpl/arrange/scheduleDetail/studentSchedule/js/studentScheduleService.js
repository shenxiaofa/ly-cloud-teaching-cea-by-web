;(function (window, undefined) {
    'use strict';

    hiocsApp.service("arrange_studentScheduleService", ['$http', '$log', 'app', function($http, $log, app) {
        
        // 获取性别
        this.getSelect = function(code, callback) {
            $http.get(app.api.address + '/base-info/codedata/findcodedataNames?datableNumber='+code)
                .then(function successCallback(response) {
                    callback(true,null,response.data);
                }, function errorCallback(response) {
                }
            );
        };
        
        /**
         * 专业（方向） 下拉框
         */
        this.getmajorInfo = function(callback) {
            $http({
				method: 'GET',
				url: app.api.address + '/student/statusInfo/selectionAddData'
	      	}).then(function successCallback(response) {
                    callback(null, null, response.data.data);
                }, function errorCallback(response) {
                }
            );
        };
        
//      /**
//       * 年级专业下拉框
//       */
//      this.getmajorInfo = function(callback) {
//          $http({
//				method: 'GET',
//				url: app.api.address + '/student/class',
//				params: {
//					type : 'selectMajorInfo'
//				}
//	      	}).then(function successCallback(response) {
//                  callback(null, null, response.data);
//              }, function errorCallback(response) {
//              }
//          );
//      };
        
        // 班级下拉框数据
        this.getClassId = function(callback) {
            $http({
				method: 'GET',
				url: app.api.address + '/student/statusInfo/selectionAddData'
	      	}).then(function successCallback(response) {
                    callback(null, null, response.data.data);
                }, function errorCallback(response) {
                }
            );
        };

    }]);

})(window);