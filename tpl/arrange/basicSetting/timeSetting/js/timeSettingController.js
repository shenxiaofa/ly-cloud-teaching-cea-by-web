;(function (window, undefined) {
    'use strict';

	window.arrange_timeSettingController = function ($compile, $timeout, $http, $scope, $filter, $uibModal, $rootScope, $window, arrange_timeSettingService, formVerifyService, alertService, app) {
        $scope.mainStyle = {
            "height": $window.innerHeight-71
        };

        $scope.timeSetting = {};
        $scope.deptId  = [];

        // 基础资源获取学年学期Id
        $scope.arrangeSemesterSelect = [];
        arrange_timeSettingService.getSemesterId(function (error,message,data) {
            $scope.semesters = data.data;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' ng-model="arrangeSemesterSelect" id="arrangeSemesterSelect" name="arrangeSemesterSelect" '
                +  ' ng-required="true" class="form-control" ng-change="changeFun(arrangeSemesterSelect)" '
                +  ' ui-jq="chosen" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesters" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#arrangeSemesterSelect").parent().empty().append(html);
            $compile(angular.element("#arrangeSemesterSelect").parent().contents())($scope);
        });
	    
        // 排课单位设置下拉框
        $scope.arrangeDept = [];
        arrange_timeSettingService.getDepartment(function (error,message,data) {
            $scope.arrangeDept.availableOptions = data.data;
            var html = '' +
                '<select ui-select2 '
                +  ' ng-model="deptId" id="arrangeDept" ui-jq="multiSelect" '
                +  ' ui-options="arrangeDeptOptions" class="form-control" multiple> '
                +  '<option ng-repeat="option in arrangeDept.availableOptions" '
                +  'value="{{option.departmentNumber}}">{{option.departmentName}}</option> '
                +  '</select>';
            angular.element("#arrangeDept").parent().empty().append(html);
            $compile(angular.element("#arrangeDept").parent().contents())($scope);
        });
	    
        /**
         * 初始化方法
         * @param _params 参数
         * @param _type 1.第一次加载；2.下拉选 onchange
         */
        $scope.initFun = function (_params, _type) {

            $http({
                method : 'GET',
                params : _params,
                url : app.api.address + '/arrange/arrangeControl'
            }).then(function successCallback(response, status, headers, config) {
                $scope.timeSetting = {};
                if(response.data.data.rows && response.data.data.rows.length > 0) {
                	$scope.count = response.data.data.rows.length; //在添加操作时判断表中数据是否至少一条
                    $scope.item = response.data.data.rows[0];
                    $scope.timeSetting = $scope.item;
                    $scope.arrangeSemesterSelect = $scope.item.semesterId;

                    $scope.timeSetting.startTime = new Date($scope.item.startTime);
                    $scope.timeSetting.endTime = new Date($scope.item.endTime);
                    var arrangeSign = $scope.timeSetting.arrangeSign;
                    if('1' == _type && (!arrangeSign || '1' != arrangeSign)){
                        $scope.timeSetting.arrangeSemester = '';
                    }
                    if('1' == _type){
                        $scope.arrangeSemester = $scope.item.arrangeSemester;
                        $scope.timeSetting.arrangeSemester = $scope.item.arrangeSemester;
                    }else{
                        $scope.timeSetting.arrangeSemester = $scope.arrangeSemester;
                    }
                }else {
                    if($scope.arrangeSemester) {
                        $scope.timeSetting.arrangeSemester = $scope.arrangeSemester;
                    }
                }
                if('1' == _type){
                    arrange_timeSettingService.selectArrangeSemester($scope, app, alertService);
                    $scope.arrangeEnableDept($scope.arrangeSemesterSelect);
                }else {
                    $scope.arrangeEnableDept($scope.arrangeSemesterSelect);
                }

                // 开始日期参数配置
                $scope.startTimeOptions = {
                    maxDate : $scope.timeSetting.endTime,
                    opened : false,
                    open : function() {
                        $scope.startTimeOptions.opened = true;
                    }
                };
                // 结束日期参数配置
                $scope.endTimeOptions = {
                    minDate : $scope.timeSetting.startTime,
                    opened : false,
                    open : function() {
                        $scope.endTimeOptions.opened = true;
                    }
                };
                $scope.$watch('timeSetting.startTime', function(newValue, oldValue){
                    $scope.endTimeOptions.minDate = newValue;
                });
                $scope.$watch('timeSetting.endTime', function (newValue, oldValue) {
                    $scope.startTimeOptions.maxDate = newValue;
                });

            }, function errorCallback(response, status, headers, config) {
                alertService(response.data.message);
            });
        };
        //排课单位设置
        $scope.arrangeDeptOptions = {
            selectableHeader : "<div class='custom-header'>不可排学院</div>",
            selectionHeader : "<div class='custom-header'>可排学院</div>",			
            selectableFooter: "<div class='custom-header' id='selectable-footer' style='padding-top: 0;'><button class='btn btn-primary' ng-click='selectableFooterClick()' style='width: 100%;height: 100%;color: #555;background: #fff;border: 1px #fff solid;'>全选</button></div>",
            selectionFooter: "<div class='custom-header' id='selection-footer' style='padding-top: 0;'><button class='btn btn-default' ng-click='selectionFooterClick()' style='width: 100%;height: 100%;color: #555!important;background: #fff!important;border: 1px #fff solid!important;'>取消全选</button></div>",
            afterInit: function (container) {
                $compile(container.find('.custom-header').contents())($scope);
            }
        };

        $scope.initFun({'arrangeSign' : '1','pageSize' : 10, 'pageNo' : 1, 'attributeNamesForOrderBy[editTime]' : 'desc', 'type' : 'select'}, '1');

        $scope.changeFun = function (semesterId) {
            $scope.initFun({'semesterId' : semesterId, 'type' : 'select'}, '2');
        };

        $scope.selectableFooterClick = function () {
            $timeout(function () {
                angular.element('#arrangeDept').multiSelect('select_all');
            }, 200);
        };

        $scope.selectionFooterClick = function () {
            $timeout(function () {
                angular.element('#arrangeDept').multiSelect('deselect_all');
            }, 200);
        };

        /**
         * 保存方法
         * @param _form form表单
         */
		$scope.saveFun = function (_form) {
			if(_form.$invalid) {
				formVerifyService(_form);
				alertService("带 * 为必填字段，请您填写完再保存！")
				return;
			};
            $scope.timeSetting.startTime = $filter("date")($scope.timeSetting.startTime, app.date.format);
            $scope.timeSetting.endTime = $filter("date")($scope.timeSetting.endTime, app.date.format);
            $scope.timeSetting.semesterId = $scope.arrangeSemesterSelect;
            $scope.timeSetting.deptId = $scope.deptId;
            if($scope.timeSetting.id){
                arrange_timeSettingService.updateFun($scope, app, alertService);
            } else {
                arrange_timeSettingService.addFun($scope, app, alertService);
            }
		};

        /**
         * 查询排课单位
         * @param semesterId 学年学期主键
         */
        $scope.arrangeEnableDept = function (semesterId) {
            if(!semesterId){
                return ;
            }
            $http({
                method : 'GET',
                params : {'type' : 'selectBySemesterId', 'semesterId' : semesterId},
                url : app.api.address + '/arrange/arrangeEnableDept'
            }).then(function successCallback(response, status, headers, config) {
                var items = response.data.data.rows;
                var len = items.length;
                var deptIds = new Array(len);
                for(var i=0; i<len; i++){
                    deptIds[i] = items[i].deptId
                }
                $timeout(function () {
                    angular.element('#arrangeDept').multiSelect('deselect_all');
                }, 200);
                $scope.deptId = deptIds;
                $timeout(function () {
                    angular.element('#arrangeDept').multiSelect('select', deptIds);
                }, 200);
            }, function errorCallback(response, status, headers, config) {
                alertService(response.data.message);
            });
        };
    };

	arrange_timeSettingController.$inject = ['$compile', '$timeout', '$http', '$scope', '$filter', '$uibModal', '$rootScope', '$window', 'arrange_timeSettingService', 'formVerifyService', 'alertService', 'app'];

})(window);
