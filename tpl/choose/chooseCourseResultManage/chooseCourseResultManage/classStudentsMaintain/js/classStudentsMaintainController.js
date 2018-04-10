;
(function(window, undefined) {
	'use strict';

	window.choose_classStudentsMaintainController = function($scope, $stateParams, $state, $http, $uibModal, $compile, $rootScope, $window, choose_classStudentsMaintainService, alertService, app) {
		$scope.chooseResult = JSON.parse($stateParams.params);
		$scope.classStudentsMaintain = {};
		// 表格的高度
		$scope.table_height = $window.innerHeight - 166;
		$scope.deleteDataIsExist = true; // 检测删除部分的数据是否存在

		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize, //页面大小
				pageNo: params.pageNumber //页码
			};
			return angular.extend(pageParam, $scope.classStudentsMaintain);
		};

		$scope.classStudentsMaintainTable = {
			url: app.api.address + '/choose/chooseResult/findStudents?teachingTaskId='+$scope.chooseResult.id,
			//url: 'data_test/choose/tableview_classStudentsMaintain.json',
			method: 'get',
			cache: false,
			height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar1', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: false,
			pagination: false,
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
				$compile(angular.element('#classStudentsMaintainTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler:function(response){
				var data ={}
				data.rows = response.data;
				return data;
			},
			columns: [
				{checkbox: true, width: "3%"},
				{field: "studentNum", title: "学号", align: "center", valign: "middle"},
				{field: "name", title: "姓名", align: "center", valign: "middle"},
				{field: "dept", title: "所属学院", align: "center", valign: "middle"},
				{field: "grade", title: "年级", align: "center", valign: "middle"},
				{field: "major", title: "专业", align: "center", valign: "middle"},
				{field: "className", title: "班级", align: "center", valign: "middle"},
				{title: "操作", align: "center", valign: "middle", width: "5%",
					formatter: function(value, row, index) {
						var removeStudentFromClassButton = "<button type='button' has-permission='' ng-click='singleRemoveClassButton(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>移出班级</button>";
						return removeStudentFromClassButton;
					}
				}
			]
		};

		// 返回上一页
		$scope.goBack = function () {
			$state.go("home.common.chooseCourseResultManage");
		}

		// 新增学生面板
		$scope.addStudentButton = function() {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseResultManage/chooseCourseResultManage/classStudentsMaintain/add.html',
				size: 'lg',
				resolve: {
					items: function() {
						return $scope.chooseResult.id;
					},
				},
				controller: addStudentController
			});
		};

		//打开逐条删除面板
		$scope.singleRemoveClassButton = function(row) {
			var ids = [];
			ids.push(row.id);
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseResultManage/chooseCourseResultManage/classStudentsMaintain/delete.html',
				size: '',
				resolve: {
					items: function() {
						return ids;
					},
				},
				controller: openDeleteController
			});
		};

		// 批量移除班级按钮
		$scope.batchRemoveClassButton = function() {
			var ids = [];
			var rows = angular.element('#classStudentsMaintainTable').bootstrapTable('getSelections');
			if(rows.length == 0) {
				if($scope.deleteDataIsExist == true) {
					alertService('请先选择要删除的项!');
				}
				if($scope.deleteDataIsExist == false) {
					alertService('当前没数据可删除!');
				}
				return;
			}
			rows.forEach (function(row) {
				ids.push(row.id);
			})
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseResultManage/chooseCourseResultManage/classStudentsMaintain/delete.html',
				size: '',
				resolve: {
					items: function() {
						return ids;
					},
				},
				controller: openDeleteController
			});
		};
	};
	choose_classStudentsMaintainController.$inject = ['$scope', '$stateParams', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_classStudentsMaintainService', 'alertService', 'app'];

	// 新增学生控制器
	var addStudentController = function($scope, $compile, app, baseinfo_generalService, $uibModalInstance, formVerifyService, items, choose_classStudentsMaintainService, alertService) {
		$scope.deptObjs = {};
		baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
			if (error) {
				alertService(message);
				return;
			}
			$scope.deptObjs = data.data;
			var html = '' +
				'<select ui-select2 ng-options="deptObj.id as deptObj.departmentName  for deptObj in deptObjs" '
				+  ' ng-model="student.deptId" id="deptId" name="deptId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
				+  '<option value="">==请选择==</option> '
				+  '</select>';
			angular.element("#deptId").parent().empty().append(html);
			$compile(angular.element("#deptId").parent().contents())($scope);
		});
		
		//学生类别
		baseinfo_generalService.findcodedataNames({datableNumber: "XSLBDM"},function (error, message,data) {
			if (error) {
				alertService(message);
				return;
			}
			$scope.classType = data.data;
			var html = '' +
				'<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in classType" '
				+  ' ng-model="student.studentTypeCode" id="studentTypeCode" name="studentTypeCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
				+  '<option value="">==请选择==</option> '
				+  '</select>';
			angular.element("#studentTypeCode").parent().empty().append(html);
			$compile(angular.element("#studentTypeCode").parent().contents())($scope);
		});

		//校区
		baseinfo_generalService.findCampusNamesBox(function (error, message,data) {
			if (error) {
				alertService(message);
				return;
			}
			$scope.classType = data.data;
			var html = '' +
				'<select ui-select2 ng-options="plateObj.campusNumber as plateObj.campusName  for plateObj in classType" '
				+  ' ng-model="student.campusId" id="campusId" name="campusId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
				+  '<option value="">==请选择==</option> '
				+  '</select>';
			angular.element("#campusId").parent().empty().append(html);
			$compile(angular.element("#campusId").parent().contents())($scope);
		});


		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize, //页面大小
				pageNo: params.pageNumber //页码
			};
			return angular.extend(pageParam, $scope.student);
		};
		$scope.classListMaintainAddTable = {
			url: app.api.address  + '/student/statusInfo',
			method: 'get',
			cache: false,
			height: 344, //使高度贴底部
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
				$compile(angular.element('#classListMaintainAddTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{checkbox: true, width: "3%"},
				{field: "num", title: "学号", align: "center", valign: "middle"},
				{field: "name", title: "姓名", align: "center", valign: "middle"},
				{field: "studentType", title: "学生类别", align: "center", valign: "middle"},
				{field: "sex", title: "性别", align: "center", valign: "middle"},
				{field: "campusName", title: "校区", align: "center", valign: "middle"},
				{field: "deptName", title: "院系", align: "center", valign: "middle"},
				{field: "majorName", title: "专业", align: "center", valign: "middle"},
				{field: "grade", title: "年级", align: "center", valign: "middle"},
				{field: "executiveClassName", title: "班级", align: "center", valign: "middle"}
			]
		};

		// 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function() {
			angular.element('#classListMaintainAddTable').bootstrapTable('selectPage', 1);
		};

		// 查询表单重置
		$scope.searchReset = function() {
			$scope.student = {};
			// 重新初始化下拉框
			angular.element('form[name="classListMaintainAddForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
			angular.element('#classListMaintainAddTable').bootstrapTable('selectPage', 1);
		};

		//提交确认按钮事件
		$scope.ok = function(form) {
			var params = [];
			var rows = angular.element('#classListMaintainAddTable').bootstrapTable('getSelections');
			if(rows.length == 0) {
				alertService('请先选择学生!');
				return;
			}
			rows.forEach (function(row) {
				var param = {
					chooseTeachingClassId : items,
					studentNum : row.id
				}
				params.push(param);
			})
			choose_classStudentsMaintainService.add(params, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classStudentsMaintainTable').bootstrapTable('refresh');
				alertService('success', '操作成功');
			});
			$uibModalInstance.close();
		};

		//关闭窗口事件
		$scope.close = function() {
			$uibModalInstance.close();
		};

		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.showHideSearchList = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm;
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 115;
			} else {
				$scope.table_height = $scope.table_height - 115;
			}
			angular.element('#classListMaintainAddTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	addStudentController.$inject = ['$scope', '$compile', 'app', 'baseinfo_generalService', '$uibModalInstance', 'formVerifyService','items', 'choose_classStudentsMaintainService', 'alertService'];

	// 批量移除班级控制器
	var openDeleteController = function($scope, $uibModalInstance, items, choose_classStudentsMaintainService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function() {
			choose_classStudentsMaintainService.delete(items, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classStudentsMaintainTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function() {
			$uibModalInstance.close();
		};
	};
	openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_classStudentsMaintainService', 'alertService'];
})(window);