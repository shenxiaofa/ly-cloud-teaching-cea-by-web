;
(function(window, undefined) {
	'use strict';

	window.choose_teachingTaskMaintainController = function($scope, $state, $http, $uibModal, $compile, $rootScope, $stateParams, $window, choose_teachingTaskMaintainService, alertService, app) {
		var item = angular.fromJson($stateParams.params);
		$scope.chooseCourse = item;
		$scope.teachingTaskMaintain = {};
		$scope.teachingTaskMaintain.subjectId = $scope.chooseCourse.id
		// 表格的高度
		$scope.table_height = $window.innerHeight - 254;
		$scope.deleteDataIsExist = true; // 检测删除部分的数据是否存在
		console.log($window.innerHeight);
		// 基础资源获取学年学期Id
		$scope.semesterId = [];
		choose_teachingTaskMaintainService.getSemesterId(function(error, message, data) {
			$scope.semesterId = data.data;
			var html = '' +
				'<select ui-select2 ' +
				' ng-model="teachingTaskMaintain.semester" id="semesterId" name="semesterId" ' +
				' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > ' +
				'<option value="">==请选择==</option> ' +
				'<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> ' +
				'</select>';
			angular.element("#semesterId").parent().empty().append(html);
			$compile(angular.element("#semesterId").parent().contents())($scope);
		});

		// 基础资源获取年级下拉框
		$scope.grades = [];
		choose_teachingTaskMaintainService.getGrade(function(error, message, data) {
			$scope.grades = data.data;
			var html = '' +
				'<select ui-select2 ng-change="cascadeProfession()" ui-chosen="curriculumGenerateForm.grade" ' +
				' ng-model="teachingTaskMaintain.gradeName" id="grade" name="grade" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> ' +
				'<option value="">==请选择==</option> ' +
				'<option  ng-repeat="grade in grades" value="{{grade.id}}">{{grade.value}}</option> ' +
				'</select>';
			angular.element("#grade").parent().empty().append(html);
			$compile(angular.element("#grade").parent().contents())($scope);
		});

		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize, //页面大小
				pageNo: params.pageNumber //页码
			};
			return angular.extend(pageParam, $scope.teachingTaskMaintain);
		};

		$scope.teachingTaskMaintainTable = {
			url: app.api.address + '/choose/chooseCourse/queryTeachingTask',
			// url: 'data_test/choose/tableview_teachingTaskMaintain.json',
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
			queryParams: $scope.queryParams, //传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#teachingTaskMaintainTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler: function(data) {
				// 若传回来的数据不为空
				//          	if(data.data.rows.length !== 0){
				//          		$scope.deleteDataIsExist = true;
				//          	}
				// 若传回来的数据为空，则清空时显示“当前没数据可清空”
				//          	if(data.data.rows.length == 0){
				//          		$scope.deleteDataIsExist = false;
				//          	}
				return data.data;
			},
			columns: [{
					checkbox: true,
					width: "3%"
				},
				{  
                    field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#teachingTaskMaintainTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
	            },
				{field: "teachingTaskNum",title: "教学班编号",align: "center",valign: "middle"},
				{field: "teachingTaskName",title: "教学班名称",align: "center",valign: "middle"},
				{field: "subjectName",title: "项目名称",align: "center",valign: "middle"},
				{field: "teachingTaskMax",title: "教学班容量",align: "center",valign: "middle"},
				{field: "teacher",title: "任课教师",align: "center",valign: "middle"},
				{field: "timeAndPlace",title: "上课时间地点",align: "center",valign: "middle"},
				{
					title: "操作",
					align: "center",
					valign: "middle",
					width: "15%",
					formatter: function(value, row, index) {
						var deleteButton = "<button type='button' has-permission='' ng-click='singleTeachingTaskDelete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>删除</button>";
						return deleteButton;
					}
				}
			]
		};

		// 批量删除按钮
		$scope.batchDelete = function() {
			var rows = angular.element('#teachingTaskMaintainTable').bootstrapTable('getSelections');
			if(rows.length == 0) {
				if($scope.deleteDataIsExist == true) {
					alertService('请先选择要删除的项!');
				}
				if($scope.deleteDataIsExist == false) {
					alertService('当前没数据可删除!');
				}
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseProcessManage/chooseCourseManage/teachingTaskMaintain/delete.html',
				size: '',
				resolve: {
					items: function() {
						return rows;
					},
				},
				controller: openDeleteController
			});
		};

		// 打开逐条删除按钮
		$scope.singleTeachingTaskDelete = function(row) {
			var rows = [];
			rows.push(row)
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/choose/chooseCourseProcessManage/chooseCourseManage/teachingTaskMaintain/delete.html',
				size: '',
				resolve: {
					items: function() {
					return rows;
					}
				},
				controller: openDeleteController
			});
		};

		// 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function() {
			angular.element('#teachingTaskMaintainTable').bootstrapTable('selectPage', 1);
		};

		// 查询表单重置
		$scope.searchReset = function() {
			$scope.teachingTaskMaintain = {subjectId:$scope.chooseCourse.id};
			// 重新初始化下拉框
			angular.element('form[name="teachingTaskMaintainForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
			angular.element('#teachingTaskMaintainTable').bootstrapTable('selectPage', 1);
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
			angular.element('#teachingTaskMaintainTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	choose_teachingTaskMaintainController.$inject = ['$scope', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$stateParams', '$window', 'choose_teachingTaskMaintainService', 'alertService', 'app'];

	// 删除控制器
	var openDeleteController = function($scope, $uibModalInstance, items, choose_teachingTaskMaintainService, alertService, $rootScope) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function() {
			var courseTimeDemandIds = []; // 代码类型号数组
			items.forEach (function(courseTimeDemand) {
				courseTimeDemandIds.push(courseTimeDemand.id);
			});
			$rootScope.showLoading = true; // 开启加载提示
			choose_teachingTaskMaintainService.delete(courseTimeDemandIds, function (error, message) {
				$rootScope.showLoading = false; // 关闭加载提示
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#teachingTaskMaintainTable').bootstrapTable('selectPage', 1);
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function() {
			$uibModalInstance.close();
		};
	};
	openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_teachingTaskMaintainService', 'alertService', '$rootScope'];
})(window);