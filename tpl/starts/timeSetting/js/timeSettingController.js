;(function (window, undefined) {
	'use strict';
		window.starts_timeSettingController = function ($compile,$scope, $uibModal, $window, $filter, baseinfo_generalService,starts_timeSettingService,formVerifyService, alertService, app){
			//var data  = {semester : "2014年春",state : false,startTime:new Date("2014-01-21"),endTime :new Date("2014-09-10") };
			$scope.semesterObjs = [];
			var timeData  ={};

			$scope.timeSetting = {};
			
			$scope.relativeHeight = $window.innerHeight - 70;

			starts_timeSettingService.getSemester(function (data) {
				if(data != undefined){
					$scope.timeSetting.semesterId = data.semesterId;
					$scope.timeSetting.openSign = data.openSign;
					$scope.timeSetting.startTime = Date.parse(data.startTime);
					$scope.timeSetting.endTime = Date.parse(data.endTime);
					$scope.timeSetting.id = data.id;
				}
				baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {

					if (error) {
						alertService(message);
						return;
					}
					$scope.semesterObjs = data.data;
					var html = '' +
						'<select ng-change="onChange()" ui-select2 ng-options="semesterObj.id as semesterObj.acadYearSemester  for semesterObj in semesterObjs" ui-chosen="timeSetting.semesterId" ng-required="true" '
						+  ' ng-model="timeSetting.semesterId" id="semesterId_select" name="semesterId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control"> '
						+  '<option value="">==请选择==</option> '
						+  '</select>';
					angular.element("#semesterId_select").parent().empty().append(html);

					$compile(angular.element("#semesterId_select").parent().contents())($scope);

				});

			});

			$scope.onChange = function () {
				var semesterId = $scope.timeSetting.semesterId;
				starts_timeSettingService.getTimeData(semesterId, function (data) {
					timeData = data;
					timeSetting();
				});
			}
			var timeSetting = function () {
				if(timeData){
					$scope.timeSetting.openSign = timeData.openSign;
					$scope.timeSetting.id = timeData.id;
					// if(timeData.openSign=='1'){
					// 	$scope.checkSign = 'true';
					// }else{
					// 	$scope.unCheckSign = 'true';
					// }
					$scope.timeSetting.startTime = timeData.startTime;
					$scope.timeSetting.endTime = timeData.endTime;
				}else{
					// $scope.checkSign = 'true';
					$scope.timeSetting.id = "";
					$scope.timeSetting.openSign = "0";
					$scope.timeSetting.startTime = "";
					$scope.timeSetting.endTime = "";
				}
			}
			//$scope.timeSetting = data;
			// 开始日期参数配置
			$scope.ksrqOptions = {
				opened: false,
				open: function() {
					$scope.ksrqOptions.opened = true;
				}
			};
			// 结束日期参数配置
			$scope.jsrqOptions = {
				opened: false,
				open: function() {
					$scope.jsrqOptions.opened = true;
				}
			};
			// 结束日期小于开始日期时的提示
			$scope.jsrqTooltipEnableAndOpen = false;
			$scope.$watch('timeSetting.endTime', function (newValue) {
				if ($scope.timeSetting.startTime && newValue && (newValue < $scope.timeSetting.startTime)) {
					$scope.jsrqTooltipEnableAndOpen = true;
					return;
				}
				$scope.jsrqTooltipEnableAndOpen = false;
			});
			$scope.ok = function (form) {
				var timeSetting = $scope.timeSetting;
				// 处理前验证
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				starts_timeSettingService.update(timeSetting,function(error,message){
					if (error) {
						alertService(message);
						return;
					}
					alertService('success', '修改成功');
				});
			};
		}
	starts_timeSettingController.$inject = ['$compile','$scope', '$uibModal', '$window', '$filter','baseinfo_generalService', 'starts_timeSettingService', 'formVerifyService', 'alertService', 'app'];
})(window);
