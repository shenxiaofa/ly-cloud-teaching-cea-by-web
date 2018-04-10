;(function(window, undefined) {
	'use strict';

	window.choose_chooseCourseScreenManageController = function($scope, $state, $http, $uibModal, $compile, $rootScope, $window, choose_chooseCourseScreenManageService, alertService, app) {

		$scope.chooseCourseScreenManage = {};
		// 表格的高度
        $scope.table_height = $window.innerHeight - 224;
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
    	
        // 基础资源获取学年学期Id
        $scope.semesterId = [];
        choose_chooseCourseScreenManageService.getSemesterId(function (error,message,data) {
            $scope.semesterId = data.data;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' ng-model="chooseCourseScreenManage.semester" id="semesterId" name="semesterId" '
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
            return angular.extend(pageParam, $scope.chooseCourseScreenManage);
	    };
	    
		$scope.chooseCourseScreenManageTable = {
			url: app.api.address + '/choose/chooseResult',
//        	url: 'data_test/choose/tableview_chooseCourseScreenManage.json',
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
				$compile(angular.element('#chooseCourseResultManageTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{checkbox: true, width: "3%"},
				{field: "semester",title: "学年学期",align: "center",valign: "middle"},
				{field: "roundName",title: "选课轮次",align: "center",valign: "middle"},
				{field: "chosenControl",title: "选课控制",align: "center",valign: "middle",
					formatter : function(value, row, index) {
						if(value=='1'){
							return "可退可选 ";
						}else if(value=='2'){
							return "只可选课";
						}else if(value=='3'){
							return "只可退课";
						}
						return "-";
					}
				},
				{field: "courseNum",title: "课程编号",align: "center",valign: "middle"},
				{field: "courseName",title: "课程名称",align: "center",valign: "middle"},
				{field: "filterStatus",title: "筛选状态",align: "center",valign: "middle",
					formatter : function(value, row, index) {
						if(value=='0'){
							return "未筛选";
						}else if(value=='1'){
							return "筛选";
						}
						return "-";
					} },
				{field: "dept",title: "开课单位",align: "center",valign: "middle"},
				{field: "courseProperty",title: "课程属性",align: "center",valign: "middle"},
				{field: "credit",title: "学分",align: "center",valign: "middle"},
				{field: "teachingTaskName",title: "教学班名称",align: "center",valign: "middle"},
				{field: "teacher",title: "任课教师",align: "center",valign: "middle"},
				{field: "teachingTaskMax",title: "容量",align: "center",valign: "middle"},
				{field: "beChoosedNum",title: "已选人数",align: "center",valign: "middle"},
				{field: "choosedNum",title: "选上人数",align: "center",valign: "middle"}
			]
		};
		
		// 抽签筛选按钮
		$scope.lotteryScreening = function(){
			var ids = [];
			var rows = angular.element('#chooseCourseScreenManageTable').bootstrapTable('getSelections');
			if(rows.length == 0) {
				alertService('请先选择要抽签筛选的班级!');
				return;
			}
			rows.forEach (function(row) {
				ids.push(row.id);
			})
			$rootScope.showLoading = true; // 加载提示
			choose_chooseCourseScreenManageService.filterChoose(ids, function (error, message) {
				$rootScope.showLoading = false; // 关闭加载提示
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#chooseCourseScreenManageTable').bootstrapTable('refresh');
				alertService('success', '操作成功');
			});

		};


        // 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
            angular.element('#chooseCourseScreenManageTable').bootstrapTable('selectPage', 1);
		};

        // 查询表单重置
        $scope.searchReset = function () {
            $scope.chooseCourseScreenManage = {};
            // 重新初始化下拉框
            angular.element('form[name="chooseCourseScreenManageForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#chooseCourseScreenManageTable').bootstrapTable('selectPage', 1);
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
			angular.element('#chooseCourseScreenManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	choose_chooseCourseScreenManageController.$inject = ['$scope', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_chooseCourseScreenManageService', 'alertService', 'app'];

})(window);