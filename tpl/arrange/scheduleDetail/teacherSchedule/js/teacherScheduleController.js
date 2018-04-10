;(function (window, undefined) {
    'use strict';

	window.arrange_teacherScheduleController = function ($scope, $http, $state, $compile, $uibModal, $rootScope, $window, arrange_teacherScheduleService, alertService, app) {
		// 表格的高度
        $scope.table_height = $window.innerHeight - 226;
		
        //单位
        $scope.deptId = [];
        arrange_teacherScheduleService.getDept(function (error,message,data) {
            $scope.deptId = data.data;
            var html = '' +
                '<select ui-select2 '
                +  ' ng-model="teacherSchedule.deptId" id="deptId" name="deptId" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in deptId" value="{{a.departmentNumber}}">{{a.departmentName}}</option> '
                +  '</select>';
            angular.element("#deptId").parent().empty().append(html);
            $compile(angular.element("#deptId").parent().contents())($scope);
        });
	    
        // 性别下拉框数据
        $scope.sexCode = [];
        arrange_teacherScheduleService.getSelect('XBM', function (error,message,data) {
            $scope.sexCode = data.data;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="teacherSchedule.sexCode" id="sexCode" name="sexCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in sexCode" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#sexCode").parent().empty().append(htmlFirst);
            $compile(angular.element("#sexCode").parent().contents())($scope);
        });
        
        // 教职工类别下拉框数据
        $scope.teacherCategory = [];
        arrange_teacherScheduleService.getSelect('JZGLBM', function (error,message,data) {
            $scope.teacherCategory = data.data;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="teacherSchedule.teacherCategory" id="teacherCategory" name="teacherCategory" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in teacherCategory" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#teacherCategory").parent().empty().append(htmlFirst);
            $compile(angular.element("#teacherCategory").parent().contents())($scope);
        });
        
        // 当前状态下拉框数据
        $scope.currentState = [];
        arrange_teacherScheduleService.getSelect('JZGDQZTM', function (error,message,data) {
            $scope.currentState = data.data;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="teacherSchedule.currentState" id="currentState" name="currentState" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in currentState" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#currentState").parent().empty().append(htmlFirst);
            $compile(angular.element("#currentState").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
            	type : 'select',
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.teacherSchedule);
	    };
	        
		$scope.teacherScheduleTable = {
			url: app.api.address + '/arrange/teacherSchedule',
			method: 'get',
			cache: false,
            height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "number", // 指定主键列
            uniqueId: "number", // 每行唯一标识
        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#teacherScheduleTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler: function(data) {
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
        	},
			columns: [
				{  
                    field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#teacherScheduleTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "deptName",title: "所属单位",align: "center",valign: "middle", width: "40%"},
				{field: "teacherNum",title: "教工号",align: "center",valign: "middle", width: "10%"},
				{field: "teacherName",title: "姓名",align: "center",valign: "middle", width: "10%"},
				{field: "sexName",title: "性别",align: "center",valign: "middle", width: "5%"},
				{field: "teacherCategoryName",title: "教职工类别",align: "center",valign: "middle", width: "10%"},
				{field: "currentStateName",title: "当前状态",align: "center",valign: "middle", width: "10%"},
				{field: "caozuo",title: "操作",align: "center",valign: "middle", width: "10%",
					formatter: function(value, row, index) {
					    var arrangeSetButton = "<button type='button' has-permission='teacherSchedule:teacherQuery:teacherScheduleQuery' ng-click='checkSchedule(" + JSON.stringify(row) + ")'"
					    	+ " class='btn btn-default' style='padding: 0px 3px;'>课表查看</button>";
						return arrangeSetButton;
					}
				}
			]
		};
		
		// 课表查看按钮
		$scope.checkSchedule = function(row) {
			var resInfo = "";
			$http.get(app.api.address + '/arrange/teacherSchedule/resID/32786')
                .then(function successCallback(response) {
					var obj = {
						resID : '32786',
						resInfo : response.data.data,
		        		teacherId : row.teacherId,
		        		teacherName : row.teacherName
					}
					// 把json数据转换为json字符串
					var params = angular.toJson(obj);
		        	$state.go("home.common.teacherScheduleDetail",{
		        		"params" : params
		        	});
                }, function errorCallback(response) {
                }
            );
		};

        // 查询刷新表单
		$scope.searchSubmit = function (form) {
			angular.element('#teacherScheduleTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.teacherSchedule = {};
            // 重新初始化下拉框
            angular.element('form[name="teacherScheduleSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#teacherScheduleTable').bootstrapTable('selectPage', 1);
        };
        
		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 115;
			} else {
				$scope.table_height = $scope.table_height - 115;
			}
			angular.element('#teacherScheduleTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	arrange_teacherScheduleController.$inject = ['$scope', '$http', '$state', '$compile', '$uibModal', '$rootScope', '$window', 'arrange_teacherScheduleService', 'alertService', 'app'];
})(window);
