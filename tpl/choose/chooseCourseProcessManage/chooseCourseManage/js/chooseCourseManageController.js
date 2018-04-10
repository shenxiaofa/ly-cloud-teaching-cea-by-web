;
(function(window, undefined) {
	'use strict';

	window.choose_chooseCourseManageController = function($scope, $state, $http, $uibModal, $compile, $rootScope, $window, choose_chooseCourseManageService, alertService, app) {
		$scope.chooseCourseManage = {};
		$scope.table_height = $window.innerHeight - 154; // 表格的高度
		$scope.deleteDataIsExist = true; // 检测删除部分的数据是否存在

		// 基础资源获取学年学期Id
		$scope.semesterId = [];
		choose_chooseCourseManageService.getSemesterId(function(error, message, data) {
			$scope.semesterId = data.data;
			var html = '' +
				'<select ui-select2 ' +
				' ng-model="chooseCourseManage.semesterId" id="semesterId" name="semesterId" ng-change="showRound()"' +
				' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > ' +
				'<option value="">==请选择==</option> ' +
				'<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> ' +
				'</select>';
			angular.element("#semesterId").parent().empty().append(html);
			$compile(angular.element("#semesterId").parent().contents())($scope);
		});

		$scope.rounds = [];
		choose_chooseCourseManageService.getRound('',function(error, message, data) {
			$scope.rounds = data.data;
			var html = '' +
				'<select ui-select2 ' +
				' ng-model="chooseCourseManage.roundId" id="roundId" name="roundId" ng-required="true" ' +
				' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > ' +
				'<option value="">==请选择==</option> ' +
				'<option  ng-repeat="round in rounds" value="{{round.id}}">{{round.name}}</option> ' +
				'</select>';
			angular.element("#roundId").parent().empty().append(html);
			$compile(angular.element("#roundId").parent().contents())($scope);
		});

		$scope.showRound = function () {
			choose_chooseCourseManageService.getRound($scope.chooseCourseManage.semesterId,function(error, message, data) {
				$scope.rounds = data.data;
				var html = '' +
					'<select ui-select2 ' +
					' ng-model="chooseCourseManage.roundId" id="roundId" name="roundId" ng-required="true" ' +
					' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > ' +
					'<option value="">==请选择==</option> ' +
					'<option  ng-repeat="round in rounds" value="{{round.id}}">{{round.name}}</option> ' +
					'</select>';
				angular.element("#roundId").parent().empty().append(html);
				$compile(angular.element("#roundId").parent().contents())($scope);
			});
		}

		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize, //页面大小
				pageNo: params.pageNumber //页码
			};
			return angular.extend(pageParam, $scope.chooseCourseManage);
		};

		//获取数据以表格形式展示
		$scope.chooseCourseManageTable = {
			url: app.api.address + '/choose/chooseCourse',
			//url: 'data_test/choose/tableview_chooseCourseManage.json',
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
			showColumns: true,
			showRefresh: true,
			onLoadSuccess: function() {
				$compile(angular.element('#chooseCourseManageTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler: function(data) {
				// // 若传回来的数据不为空
				// if(data.rows.length !== 0) {
				// 	$scope.deleteDataIsExist = true;
				// }
				// // 若传回来的数据为空，则清空时显示“当前没数据可清空”
				// if(data.rows.length == 0) {
				// 	$scope.deleteDataIsExist = false;
				// }
				return data.data;
			},
			columns: [
				{checkbox: true, width: "3%"},
				{field: "semester", title: "学年学期", align: "center", valign: "middle", width: "9%"},
				{field: "roundName", title: "选课轮次", align: "center", valign: "middle", width: "9%"},
				{field: "status", title: "选课状态", align: "center", valign: "middle", width: "9%",
					formatter : function(value, row, index) {  
                       	if(row.status=='进行中'){
                       		var html = '<span style="color:green;">进行中</span>';
                       		return html;
                       	}else{
                       		return row.status;
                       	}
                    } 
				},
				{field: "courseNum", title: "课程编号", align: "center", valign: "middle", width: "9%"},
				{field: "courseName", title: "课程名称", align: "center", valign: "middle", width: "9%"},
				{field: "openWay", title: "开课方式", align: "center", valign: "middle", width: "9%"},
				{field: "teachingTaskNum", title: "可选教学班数", align: "center", valign: "middle", width: "9%"},
				{field: "courseType", title: "课程性质", align: "center", valign: "middle", width: "9%"},
				{field: "openDeptName", title: "开课单位", align: "center", valign: "middle", width: "9%"},
				{title: "操作", align: "center", valign: "middle", width: "15%",
					formatter: function(value, row, index) {
						var teachingTaskMaintain = "<button type='button' has-permission='' ng-click='teachingTaskMaintain(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>教学班维护</button>";
						var deleteButton = "<button type='button' has-permission='' ng-click='singleDeleteButton(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>删除</button>";
						return teachingTaskMaintain + "  " + deleteButton;
					}
				}
			]
		};

		// 教学班维护跳转
		$scope.teachingTaskMaintain = function(rows) {
			// 把json数据转换为json字符串
			var params = angular.toJson(rows);
			$state.go("home.common.teachingTaskMaintain", {
				"params": params
			});
		};
		
		//打开逐条删除面板
		$scope.singleDeleteButton = function(row){
			var rows = [];
			rows.push(row);
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseProcessManage/chooseCourseManage/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteController
			});
		};
		
		// 打开批量删除面板
		$scope.batchDelete = function() {
			var rows = angular.element('#chooseCourseManageTable').bootstrapTable('getSelections');
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
				templateUrl: 'tpl/choose/chooseCourseProcessManage/chooseCourseManage/delete.html',
				size: '',
				resolve: {
					items: function() {
						return rows;
					},
				},
				controller: openDeleteController
			});
		};

		// 批量删除控制器
		var openDeleteController = function($scope, $uibModalInstance, items, choose_chooseCourseManageService, alertService) {
			$scope.message = "确定要删除吗？";
			$scope.ok = function() {
				var ids = []; // 代码类型号数组
				items.forEach (function(data) {
					ids.push(data.id);
				});
				$rootScope.showLoading = true; // 开启加载提示
				choose_chooseCourseManageService.delete(ids, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#chooseCourseManageTable').bootstrapTable('selectPage', 1);
					alertService('success', '删除成功');
				});
				$uibModalInstance.close();
			};
			$scope.close = function() {
				$uibModalInstance.close();
			};
		};
		openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseManageService', 'alertService'];

		// 转入教学班按钮
		$scope.transferTeachingTask = function() {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/choose/chooseCourseProcessManage/chooseCourseManage/add.html',
				resolve: {
					items: function() {
						//						return row;
					}
				},
				controller: transferTeachingTaskController
			});
		};

		// 转入教学班控制器
		var transferTeachingTaskController = function($scope, $uibModalInstance, items, formVerifyService, choose_chooseCourseManageService, alertService) {

			$scope.transferTeacherClass = {};
			$scope.transferTeacherClass.chooseLabel = [];
			// 基础资源获取学年学期Id
			$scope.semesterId = [];
			choose_chooseCourseManageService.getSemesterId(function(error, message, data) {
				$scope.semesterId = data.data;
				var html = '' +
					'<select ui-select2 ' +
					' ng-model="transferTeacherClass.semesterId" id="semesterId" name="semesterId" ng-change="showRound()" ' +
					' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" ng-required="true"> ' +
					'<option value="">==请选择==</option> ' +
					'<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> ' +
					'</select>';
				angular.element("#semesterId").parent().empty().append(html);
				$compile(angular.element("#semesterId").parent().contents())($scope);
			});
			
			$scope.showRound = function () {
				choose_chooseCourseManageService.getRound($scope.transferTeacherClass.semesterId,function(error, message, data) {
					$scope.rounds = data.data;
					var html = '' +
						'<select ui-select2 ' +
						' ng-model="transferTeacherClass.roundId" id="roundId" name="roundId" ng-required="true" ' +
						' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > ' +
						'<option value="">==请选择==</option> ' +
						'<option  ng-repeat="round in rounds" value="{{round.id}}">{{round.name}}</option> ' +
						'</select>';
					angular.element("#roundId").parent().empty().append(html);
					$compile(angular.element("#roundId").parent().contents())($scope);
				});
			}

			//提交确认按钮事件
			$scope.ok = function(form) {
				if($scope.transferTeacherClass.semesterId == "" || $scope.transferTeacherClass.semesterId == null ||
					$scope.transferTeacherClass.roundId == "" || $scope.transferTeacherClass.roundId == null ||
					$scope.transferTeacherClass.chooseLabel == "" || $scope.transferTeacherClass.chooseLabel == null
				){
					alertService('带*为必填项！');
					return;
				}
				$rootScope.showLoading = true; // 加载提示
				choose_chooseCourseManageService.classInto($scope.transferTeacherClass,function (error, message,data) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}else{
						alertService('success', '操作成功');
						angular.element('#chooseCourseManageTable').bootstrapTable('refresh');
					}
				});
				$uibModalInstance.close();
			};
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};

		};
		transferTeachingTaskController.$inject = ['$scope', '$uibModalInstance', 'items', 'formVerifyService', 'choose_chooseCourseManageService', 'alertService'];

		// 查询
		$scope.searchSubmit = function() {
			angular.element('#chooseCourseManageTable').bootstrapTable('selectPage', 1);
		};

		// 查询表单重置
		$scope.searchReset = function() {
			$scope.chooseCourseManage = {};
			// 重新初始化下拉框
			angular.element('form[name="chooseCourseManageForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
			angular.element('#chooseCourseManageTable').bootstrapTable('selectPage', 1);
		};

		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm;
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 45;
			} else {
				$scope.table_height = $scope.table_height - 45;
			}
			angular.element('#chooseCourseManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	choose_chooseCourseManageController.$inject = ['$scope', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_chooseCourseManageService', 'alertService', 'app'];

})(window);