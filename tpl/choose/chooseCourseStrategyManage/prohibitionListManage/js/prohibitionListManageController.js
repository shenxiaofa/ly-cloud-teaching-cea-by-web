;(function(window, undefined) {
	'use strict';

	window.choose_prohibitionListManageController = function($scope, $state, $http, $uibModal, $compile, $rootScope, $window, choose_prohibitionListManageService, alertService, app) {

		$scope.prohibitionListManage = {};
		// 表格的高度
        $scope.table_height = $window.innerHeight - 264;
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
    	
        // 基础资源获取学年学期Id
        $scope.semesterId = [];
        choose_prohibitionListManageService.getSemesterId(function (error,message,data) {
            $scope.semesterId = data.data;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' ng-model="prohibitionListManage.semester" id="semesterId" name="semesterId" '
                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
	    
        // 基础资源获取年级下拉框
        $scope.grades = [];
        choose_prohibitionListManageService.getGrade(function (error,message,data) {
            $scope.grades = data.data;
            var html = '' +
                '<select ui-select2 ng-change="cascadeProfession()" ui-chosen="curriculumGenerateForm.grade" '
                +  ' ng-model="prohibitionListManage.gradeName" id="grade" name="grade" ui-jq="chosen"ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="grade in grades" value="{{grade.id}}">{{grade.value}}</option> '
                +  '</select>';
            angular.element("#grade").parent().empty().append(html);
            $compile(angular.element("#grade").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.prohibitionListManage);
	    };
	    
		$scope.prohibitionListManageTable = {
			url: app.api.address + '/choose/prohibitionList',
//         	url: 'data_test/choose/tableview_prohibitionListManage.json',
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
				$compile(angular.element('#prohibitionListManageTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler: function(data) {
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
        	},
			columns: [{checkbox: true,width: "3%"},
				{field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#prohibitionListManageTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }
                },
				{field:"id", title:"主键", visible:false},
				{field: "semester",title: "学年学期",align: "center",valign: "middle",width:"9%"},
				{field: "studentName",title: "姓名",align: "center",valign: "middle",width:"9%"},
				{field: "deptName",title: "所属学院",align: "center",valign: "middle",width:"11%"},
				{field: "gradeName",title: "所属年级",align: "center",valign: "middle",width:"9%"},
				{field: "majorName",title: "所属专业",align: "center",valign: "middle",width:"9%"},
				{field: "fromClassName",title: "所属班级",align: "center",valign: "middle",width:"9%"},
				{field: "forbidReason",title: "禁选原因",align: "center",valign: "middle",width:"9%"},
				{field: "chooseEnable",title: "是否可选课",align: "center",valign: "middle",width:"9%",
					formatter: function(value) {
						if(value == "0"){
							return "否";
						}else if(value=="1"){
							return "是";
						}else{
							return "";
						}
					}
				},
				{title: "操作",align: "center",valign: "middle",width:"13%",
					formatter: function(value, row, index) {
					    var deleteButton = "<button type='button' has-permission='' ng-click='prohibitionDelete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>删除</button>";
						if(row.chooseEnable == "0"){
							row.chooseEnable = "1";
							var adjustButton = "<button type='button' has-permission='' ng-click='prohibitionAdjust(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>设置为可选</button>";
							return deleteButton + "&nbsp;" + adjustButton;
						}else if(row.chooseEnable == "1"){
							row.chooseEnable = "0";
							var updateButton = "<button type='button' has-permission='' ng-click='prohibitionAdjust(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>设置为不可选</button>";
							return deleteButton + "&nbsp;" + updateButton;
						}
					}
				}
			]
		};
		
		// 选课状态设置
		$scope.prohibitionAdjust = function(row){
			$rootScope.showLoading = true; // 开启加载提示
			choose_prohibitionListManageService.update(row, function (error, message) {
				$rootScope.showLoading = false; // 关闭加载提示
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#prohibitionListManageTable').bootstrapTable('refresh');
				alertService('success', '操作成功');
			});
		};
		
		// 生成禁选名单
		$scope.generateButton = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/prohibitionListManage/generate.html',
				size: '',
				controller: generateController
			});
		};

		// 生成控制器
		var generateController = function ($scope, $uibModalInstance, choose_prohibitionListManageService, formVerifyService, alertService) {
			$scope.semesterId = [];
			choose_prohibitionListManageService.getSemesterId(function (error,message,data) {
			 	$scope.semesterId = data.data;
				 var html = ''
					 +  '<select ui-select2 '
					 +  ' ng-model="prohibitionListManage.semester" id="semesterId" name="semesterId" '
					 +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
					 +  '<option value="">==请选择==</option> '
					 +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
					 +  '</select>';
				 angular.element("#semesterId").parent().empty().append(html);
				 $compile(angular.element("#semesterId").parent().contents())($scope);
				 });
			$scope.ok = function () {
				$rootScope.showLoading = true; // 开启加载提示
				choose_prohibitionListManageService.generate($scope.prohibitionListManage.semester, function (error, message) {
					 $rootScope.showLoading = false; // 关闭加载提示
					 if (error) {
					 	 alertService(message);
						 return;
			 	 	 }
					 angular.element('#prohibitionListManageTable').bootstrapTable('refresh');
					 $uibModalInstance.close();
					 alertService('success', '操作成功');
			 	 });
			}
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		generateController.$inject = ['$scope', '$uibModalInstance', 'choose_prohibitionListManageService', 'formVerifyService', 'alertService'];

		// 打开删除面板
		$scope.batchDelete = function(row){
			var rows = angular.element('#prohibitionListManageTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				if($scope.deleteDataIsExist == true){
					alertService('请先选择要删除的项!');
				}
				if($scope.deleteDataIsExist == false){
					alertService('当前没数据可删除!');
				}
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/prohibitionListManage/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openBatchDeleteController
			});
		};
		
		// 删除控制器
		var openBatchDeleteController = function ($scope, $uibModalInstance, items, choose_prohibitionListManageService, alertService) {
			$scope.message = "确定要删除吗？";
			$scope.ok = function () {
				var ids = []; // 代码类型号数组
				items.forEach (function(courseTimeDemand) {
					ids.push(courseTimeDemand.id);
				});
				$rootScope.showLoading = true; // 开启加载提示
				choose_prohibitionListManageService.delete(ids, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#prohibitionListManageTable').bootstrapTable('selectPage', 1);
					alertService('success', '删除成功');
				});
				$uibModalInstance.close();
			};
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		openBatchDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_prohibitionListManageService', 'alertService'];

		// 打开删除面板
		$scope.prohibitionDelete = function(row){
			var rows = angular.element('#prohibitionListManageTable').bootstrapTable('getSelections');
			if(row){
				rows.push(row);
			}
			if(rows.length == 0){
				if($scope.deleteDataIsExist == true){
					alertService('请先选择要删除的项!');
				}
				if($scope.deleteDataIsExist == false){
					alertService('当前没数据可删除!');
				}
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/prohibitionListManage/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openBatchDeleteController
			});
		};
		
		// 删除控制器
		var openDeleteController = function ($scope, $uibModalInstance, items, choose_prohibitionListManageService, alertService) {
			$scope.message = "确定要删除吗？";
			$scope.ok = function () {
//				var courseTimeDemandIds = []; // 代码类型号数组
//				items.forEach (function(courseTimeDemand) {
//					courseTimeDemandIds.push(courseTimeDemand.id);
//				});
//				$rootScope.showLoading = true; // 开启加载提示
//				choose_prohibitionListManageService.delete(courseTimeDemandIds, function (error, message) {
//					$rootScope.showLoading = false; // 关闭加载提示
//					if (error) {
//						alertService(message);
//						return;
//					}
//					angular.element('#courseTimeDemandTable').bootstrapTable('selectPage', 1);
//					angular.element('#courseTimeDemandSettingTable').bootstrapTable('selectPage', 1);
					alertService('success', '删除成功');
//				});
				$uibModalInstance.close();
			};
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_prohibitionListManageService', 'alertService'];

		// 新增按钮
		$scope.addButton = function() {
			
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/prohibitionListManage/add.html',
				size: 'lg',
				resolve: {
					items: function () {
//						return rows;
					},
				},
				controller: addProhibitionListController
			});
		};

		// 新增控制器
		var addProhibitionListController = function ($scope, $uibModalInstance, formVerifyService, items, choose_prohibitionListManageService, baseinfo_generalService, alertService) {
			$scope.studentTypeObjs = {};
			baseinfo_generalService.findcodedataNames({datableNumber: "XSLBDM"},function (error, message, data) {
				$scope.studentTypeObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="studentTypeObj.dataNumber as studentTypeObj.dataName  for studentTypeObj in studentTypeObjs" '
					+  ' ng-model="prohibitionListManage.studentTypeCode" id="studentTypeId" name="studentTypeId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#studentTypeId").parent().empty().append(html);
				$compile(angular.element("#studentTypeId").parent().contents())($scope);
			});
			
			$scope.campusObjs = {};
			baseinfo_generalService.findCampusNamesBox(function (error, message, data) {
				if (error) {
					alertService(message);
					return;
				}
				$scope.campusObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="campusObj.id as campusObj.campusName  for campusObj in campusObjs" '
					+  ' ng-model="prohibitionListManage.campusId" id="campusId" name="campusId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#campusId").parent().empty().append(html);
				$compile(angular.element("#campusId").parent().contents())($scope);
			});

			$scope.deptObjs = {};
			baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
				if (error) {
					alertService(message);
					return;
				}
				$scope.deptObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="deptObj.id as deptObj.departmentName  for deptObj in deptObjs" '
					+  ' ng-model="prohibitionListManage.deptId" id="deptId" name="deptId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#deptId").parent().empty().append(html);
				$compile(angular.element("#deptId").parent().contents())($scope);
			});

			// 查询参数
		    $scope.queryParams = function queryParams(params) {
	            var pageParam = {
	                pageSize : params.pageSize,   //页面大小
	                pageNo : params.pageNumber  //页码
	            };
	            return angular.extend(pageParam, $scope.prohibitionListManage);
		    };

			// 确定提交表单 新增教师时间要求信息
			$scope.searchSubmit = function () {
				angular.element('#prohibitionListManageAddTable').bootstrapTable('selectPage', 1);
			};

			// 查询表单重置
			$scope.searchReset = function () {
				$scope.prohibitionListManage = {};
				// 重新初始化下拉框
				angular.element('form[name="prohibitionListManageAddForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
				angular.element('#prohibitionListManageAddTable').bootstrapTable('selectPage', 1);
			};
		    
			$scope.prohibitionListManageAddTable = {
				url: app.api.address  + '/student/statusInfo',
	//			url: app.api.address + '/choose/prohibitionListManage',
	//         	url: 'data_test/choose/tableview_classStudentAddManage.json',
				method: 'get',
				cache: false,
	            height: 344, //使高度贴底部
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
					$compile(angular.element('#prohibitionListManageAddTable').contents())($scope);
				},
				clickToSelect: true,
				responseHandler: function(response) {
					return response.data;
	        	},
				columns: [{checkbox: true,width: "3%"},
					{field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
	                    formatter : function(value, row, index) {  
	                        var page = angular.element('#prohibitionListManageAddTable').bootstrapTable("getPage");  
	                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
	                    }
	                },
					{field:"id", title:"主键", visible:false},
					{field: "num",title: "学号",align: "center",valign: "middle",width:"10%"},
					{field: "name",title: "姓名",align: "center",valign: "middle",width:"10%"},
					{field: "studentType",title: "学生类别",align: "center",valign: "middle",width:"10%"},
					{field: "sex",title: "性别",align: "center",valign: "middle",width:"10%"},
					{field: "campusName",title: "校区",align: "center",valign: "middle",width:"10%"},
					{field: "deptName",title: "院系",align: "center",valign: "middle",width:"10%"},
					{field: "majorName",title: "专业",align: "center",valign: "middle",width:"10%"},
					{field: "grade",title: "年级",align: "center",valign: "middle",width:"10%"},
					{field: "executiveClassName",title: "班级",align: "center",valign: "middle",width:"10%"}
				]
			};
			
			//提交确认按钮事件
			$scope.ok = function(form) {
				// 处理前验证input输入框
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					alertService("带 * 为必填字段，请您填写完再保存！");
					return;
				};
				$scope.selectedRows = angular.element('#prohibitionListManageAddTable').bootstrapTable('getSelections');
				$uibModal.open({
					animation: true,
					backdrop: 'static',
					templateUrl: 'tpl/choose/chooseCourseStrategyManage/prohibitionListManage/addData.html',
					size: '',
					resolve: {
						items : function () {
							return $scope.selectedRows;
						},
					},
					controller: AddDataController
				});
				// alertService('success', '操作成功');
				$uibModalInstance.close();
			};

			// 新增控制器
			var AddDataController = function ($scope, $uibModalInstance, items, choose_prohibitionListManageService, alertService) {
				// 基础资源获取学年学期Id
				$scope.prohibitionListAdd = {};
				$scope.semesterId = [];
				choose_prohibitionListManageService.getSemesterId(function (error,message,data) {
					$scope.semesterId = data.data;
					var html = ''
						+  '<select ui-select2 '
						+  ' ng-model="prohibitionListAdd.semesterId" id="semesterId" name="semesterId" '
						+  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
						+  '<option value="">==请选择==</option> '
						+  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
						+  '</select>';
					angular.element("#semesterId").parent().empty().append(html);
					$compile(angular.element("#semesterId").parent().contents())($scope);
				});
				$scope.ok = function () {
				var studentIds = []; // 代码类型号数组
				items.forEach (function(data) {
					studentIds.push(data.id);
				});
				$rootScope.showLoading = true; // 开启加载提示
				choose_prohibitionListManageService.add(studentIds, $scope.prohibitionListAdd, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#prohibitionListManageTable').bootstrapTable('selectPage', 1);
					alertService('success', '新增成功');
					$uibModalInstance.close();
				});
				};
				$scope.close = function () {
					$uibModalInstance.close();
				};
			};
			AddDataController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_prohibitionListManageService', 'alertService'];
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		addProhibitionListController.$inject = ['$scope', '$uibModalInstance', 'formVerifyService', 'items', 'choose_prohibitionListManageService', 'baseinfo_generalService', 'alertService'];

        // 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
            angular.element('#prohibitionListManageTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.prohibitionListManage = {};
            // 重新初始化下拉框
            angular.element('form[name="prohibitionListManageForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#prohibitionListManageTable').bootstrapTable('selectPage', 1);
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
			angular.element('#prohibitionListManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	choose_prohibitionListManageController.$inject = ['$scope', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_prohibitionListManageService', 'alertService', 'app'];

})(window);