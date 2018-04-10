;(function(window, undefined) {
	'use strict';

	window.choose_classListManageController = function($scope, $state, $http, $uibModal, $compile, $rootScope, $window, choose_classListManageService, alertService, app) {

		$scope.classListManage = {};
		// 表格的高度
        $scope.table_height = $window.innerHeight - 224;
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
    	
        // 基础资源获取学年学期Id
        $scope.semesterId = [];
        choose_classListManageService.getSemesterId(function (error,message,data) {
            $scope.semesterId = data.data;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' ng-model="classListManage.semesterId" id="semesterId" name="semesterId" '
                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.classListManage);
	    };
	    
		$scope.classListManageTable = {
			url: app.api.address + '/choose/classList',
        	//url: 'data_test/choose/tableview_classListManage.json',
			method: 'get',
			cache: false,
            height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#classListManageTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{field: "semester",title: "学年学期",align: "center",valign: "middle"},
				{field: "courseNum",title: "课程编号",align: "center",valign: "middle"},
				{field: "courseName",title: "课程名称",align: "center",valign: "middle"},
				{field: "dept",title: "开课单位",align: "center",valign: "middle"},
				{field: "courseProperty",title: "课程属性",align: "center",valign: "middle"},
				{field: "credit",title: "学分",align: "center",valign: "middle"},
				{field: "teachingTaskName",title: "教学班名称",align: "center",valign: "middle"},
				{field: "teachingTaskMax",title: "容量",align: "center",valign: "middle"},
				{field: "choosedNum",title: "选上人数",align: "center",valign: "middle"},
				{field: "teacher",title: "任课教师",align: "center",valign: "middle",
					formatter : function (value, row, index) {
						if(value == '' || value == null){
							return "-";
						}
						var names = "";
						angular.forEach(value, function(data, index, array){
							names += data.name + "、";
						});
						if (names.length > 0) {
							names = names.substring(0, names.length - 1);
						}
						return names;
					}
				},
				{title: "操作",align: "center",valign: "middle",width:"5%",
					formatter: function(value, row, index) {
					    var deleteButton = "<button type='button' has-permission='' ng-click='classListMaintain(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>维护班级名称</button>";
						return deleteButton;
					}
				}
			]
		};
		
		// 维护班级名称按钮
		$scope.classListMaintain = function(row){
			// 把json数据转换为json字符串
			var params = angular.toJson(row);
			$state.go("home.common.classListMaintain",{
				"params" : params
			});
		};
		
        // 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
            angular.element('#classListManageTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.classListManage = {};
            // 重新初始化下拉框
            angular.element('form[name="classListManageForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classListManageTable').bootstrapTable('selectPage', 1);
        };
        
		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm;
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 115;
			} else {
				$scope.table_height = $scope.table_height - 115;
			}
			angular.element('#classListManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	choose_classListManageController.$inject = ['$scope', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_classListManageService', 'alertService', 'app'];

})(window);