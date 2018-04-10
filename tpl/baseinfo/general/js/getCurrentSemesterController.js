;(function (window, undefined) {
    'use strict';

	window.general_CurrentSemesterController = function ($rootScope, $state, $http, $compile, $scope, $uibModal, $window, baseinfo_generalService, app) {
		
		$scope.scheduleManage = {};
	    // 获取到当前的学年学期Id
	    var tempSemesterId = "";
	    
		// 获取学期Id 把table包起来 一定要获取到tempSemesterId
        baseinfo_generalService.getCurrentSemesterId(function (error,message,data) {
			$scope.scheduleManage.semesterId = data.data.rows[0].semesterId;
			tempSemesterId = data.data.rows[0].semesterId;
		});

	};
	general_CurrentSemesterController.$inject = ['$rootScope', '$state', '$http', '$compile', '$scope', '$uibModal', '$window', 'baseinfo_generalService', 'app'];


})(window);
