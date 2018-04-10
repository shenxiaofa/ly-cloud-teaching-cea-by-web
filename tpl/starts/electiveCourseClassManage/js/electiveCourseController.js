;(function (window, undefined) {
	'use strict';

	window.starts_electiveCourseController = function (baseinfo_generalService,$compile, $scope, $state, $uibModal, $rootScope, $window, starts_electiveCourseService, alertService, app) {
		// 表格的高度
		$scope.table_height = $window.innerHeight - 223;
		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var attributeNamesForOrderBy = {};
			attributeNamesForOrderBy[params.sortName] = params.sortOrder;
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				attributeNamesForOrderBy: attributeNamesForOrderBy,
				courseProperty : '2'
			};
			$rootScope.$log.debug(angular.extend(pageParam, $scope.classManage));
			return angular.extend(pageParam, $scope.classManage);
		};

		$scope.classManage = {};
		$scope.semesterObjs = [];
		starts_electiveCourseService.getSemester(function (data) {
			if(data != undefined){
				$scope.classManage.semesterId = data.semesterId;
			}

			baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
				if (error) {
					alertService(message);
					return;
				}
				$scope.semesterObjs = data.data;
				var html = '' +
					'<select ng-change="testChange()" ui-select2 ng-options="semesterObj.id as semesterObj.acadYearSemester  for semesterObj in semesterObjs" '
					+  ' ng-model="classManage.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#semesterId").parent().empty().append(html);
				$compile(angular.element("#semesterId").parent().contents())($scope);
			});



		});

		$scope.electiveClassManageTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#electiveClassManageTable').contents())($scope);
			},
			//url: 'data_test/starts/tableview_codeCategory.json',
			url:app.api.address + '/virtual-class/openPlan/select',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'createTime', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field:"id", title:"主键", visible:false},
				{field:"courseProperty", visible:false},
				{field:"semesterId", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"semesterName",title:"学期学年",align:"center",valign:"middle"},
				{field:"courseNum",title:"课程号",align:"center",valign:"middle"},
				{field:"courseName",title:"课程名称",align:"center",valign:"middle"},
				{field:"deptName",title:"开课学院",align:"center",valign:"middle"},
				{field:"moduleName",title:"课程模块",align:"center",valign:"middle"},
				{field:"coursePropertyName",title:"课程属性",align:"center",valign:"middle"},
				{field:"credit",title:"学分",align:"center",valign:"middle"},
				{field:"totalNum",title:"总学时",align:"center",valign:"middle"},
				{field:"actualCount",title:"实际开班数",align:"center",valign:"middle"},
				{field:"",title:"操作",align:"center",valign:"middle",formatter: function (value, row, index) {
					var courseManage = "<button has-permission='electiveCourseClassManage:arrange' type='button' ng-click='courseManage(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>教学班安排</button>";
					return courseManage;
				}
				}
			]
		};
		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#electiveClassManageTable').bootstrapTable('selectPage', 1);
			// angular.element('#electiveClassManageTable').bootstrapTable('refresh');
		};
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.classManage = {};
			$scope.classManage.semesterId ="";
			angular.element('#electiveClassManageTable').bootstrapTable('refresh');
			angular.element('form[name="classManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
		};



		// 查询表单显示和隐藏切换
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function () {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if ($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 115;
			} else {
				$scope.table_height = $scope.table_height - 115;
			}
			angular.element('#electiveClassManageTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		};

		// 打开新增面板
		$scope.courseManage = function(data){
			$state.go("home.common.electiveCourseArrange",data);
			console.log(data.id);
		};
	};
	starts_electiveCourseController.$inject = ['baseinfo_generalService','$compile' ,'$scope', '$state', '$uibModal', '$rootScope', '$window', 'starts_electiveCourseService', 'alertService', 'app'];

})(window);
