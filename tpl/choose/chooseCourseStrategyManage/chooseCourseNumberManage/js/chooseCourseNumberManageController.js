;(function(window, undefined) {
	'use strict';

	window.choose_chooseCourseNumberManageController = function($scope, $state, $http, $uibModal, $compile, $rootScope, $window, choose_chooseCourseNumberManageService, alertService, app) {

		$scope.chooseCourseNumberManage = {type:'1'};
        
        $scope.left_table_height = $window.innerHeight-150;		// 选课门数控制表格的高度
        $scope.center_table_height = $window.innerHeight-305;	// 按范围设置选课门数控制表格的高度
        $scope.right_table_height = $window.innerHeight-300;	// 按标签设置选课门数控制表格的高度

        // 基础资源获取学年学期Id
        $scope.semesterId = [];
        choose_chooseCourseNumberManageService.getSemesterId(function (error,message,data) {
            $scope.semesterId = data.data;
            var htmlCenter = '' 
            	+  '<select ui-select2 '
                +  ' ng-model="chooseCourseNumberManage.semesterId" id="semesterIdCenter" name="semesterIdCenter" '
                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            var htmlRight = '' 
            	+  '<select ui-select2 '
                +  ' ng-model="chooseCourseNumberManage.semesterId" id="semesterIdRight" name="semesterIdRight" '
                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#semesterIdCenter").parent().empty().append(htmlCenter);
            angular.element("#semesterIdRight").parent().empty().append(htmlRight);
            $compile(angular.element("#semesterIdCenter").parent().contents())($scope);
            $compile(angular.element("#semesterIdRight").parent().contents())($scope);
        });
	    
		// 左侧
	    $scope.leftQueryParams = function queryParams(params) {
            var pageParam = {
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.chooseCourseNumberManage);
	    };
	    
	    // 左侧
		$scope.chooseCourseNumberManageTable = {
			url: app.api.address + '/choose/chooseCourseNumber',
//         	url: 'data_test/choose/tableview_chooseCourseNumberManage1.json',
			method: 'get',
			cache: false,
            height: $scope.left_table_height, //使高度贴底部
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
			queryParams: $scope.leftQueryParams,//传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#chooseCourseNumberManageTable').contents())($scope);
			},
			clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
			columns: [
				{field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#chooseCourseNumberManageTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "semester",title: "学年学期",align: "center",valign: "middle",width:"21%"},
				{field: "highestNum",title: "最高选课门数",align: "center",valign: "middle",width:"21%"},
				{field: "schoolNum",title: "校公选门数",align: "center",valign: "middle",width:"21%"},
				{field: "deptNum",title: "院系选修门数",align: "center",valign: "middle",width:"21%"},
				{title: "操作",align: "center",valign: "middle",width:"10%",
					formatter: function(value, row, index) {
					    var deleteButton = "<button type='button' has-permission='' ng-click='leftDelete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>删除</button>";
					    var updateButton = "<button type='button' has-permission='' ng-click='leftUpdate(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>修改</button>";
						return deleteButton + " " + updateButton;
					}
				}
			]
		};
		
		// 左侧删除按钮
		$scope.leftDelete = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/delete.html',
				size: '',
				resolve: {
					item: function() {
						return row;
					},
				},
				controller: leftDeleteController
			});
		};

		// 左侧删除控制器
		var leftDeleteController = function ($scope, $uibModalInstance, item, choose_chooseCourseNumberManageService, alertService) {
			
			$scope.message = "确定要删除吗？";
			
			// 确定
			$scope.ok = function() {
				$rootScope.showLoading = true; // 开启加载提示
				choose_chooseCourseNumberManageService.delete(item.id , function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						$rootScope.showLoading = false; // 关闭加载提示
						alertService(message);
						return;
					}
					angular.element('#chooseCourseNumberManageTable').bootstrapTable('selectPage', 1);
					$uibModalInstance.close();
					alertService('success', '删除成功');
				});
			};
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		leftDeleteController.$inject = ['$scope', '$uibModalInstance', 'item', 'choose_chooseCourseNumberManageService', 'alertService'];

		// 左侧修改按钮
		$scope.leftUpdate = function(row) {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/leftUpdate.html',
				size: '',
				resolve: {
					item: function() {
						return row;
					}
				},
				controller: leftUpdateController
			});
		};

		// 左侧修改控制器
		var leftUpdateController = function ($scope, $uibModalInstance, item, choose_chooseCourseNumberManageService, formVerifyService, alertService) {
			$scope.chooseCourseNumberManage = item;
			$scope.chooseCourseNumberManage.highestNum = parseInt(item.highestNum);
			$scope.chooseCourseNumberManage.schoolNum = parseInt(item.schoolNum);
			$scope.chooseCourseNumberManage.deptNum = parseInt(item.deptNum);
			// 确定
			$scope.ok = function(form) {
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				$rootScope.showLoading = true; // 开启加载提示
				choose_chooseCourseNumberManageService.update($scope.chooseCourseNumberManage, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						$rootScope.showLoading = false; // 关闭加载提示
						return;
					}
					angular.element('#chooseCourseNumberManageTable').bootstrapTable('refresh');
					alertService('success', '操作成功');
					$uibModalInstance.close();
				});
			};
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		leftUpdateController.$inject = ['$scope', '$uibModalInstance', 'item', 'choose_chooseCourseNumberManageService', 'formVerifyService', 'alertService'];

		// 左侧添加按钮
		$scope.leftAdd = function() {
			
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/leftAdd.html',
				size: '',
				resolve: {
					items: function() {
					}
				},
				controller: leftAddController
			});
		};

		// 左侧添加控制器
		var leftAddController = function ($scope, $uibModalInstance, items, choose_chooseCourseNumberManageService, formVerifyService, alertService) {
			
	        // 基础资源获取学年学期Id
	        $scope.semesterId = [];
	        choose_chooseCourseNumberManageService.getSemesterId(function (error,message,data) {
	            $scope.semesterId = data.data;
	            var html = '' 
	            	+  '<select ui-select2 '
	                +  ' ng-model="chooseCourseNumberManage.semesterId" id="semesterIdLeftAdd" name="semesterIdLeftAdd" ui-chosen="chooseCourseNumberManageAddForm.semesterIdLeftAdd"'
	                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" ng-required="true"> '
	                +  '<option value="">==请选择==</option> '
	                +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
	                +  '</select>';
	            angular.element("#semesterIdLeftAdd").parent().empty().append(html);
	            $compile(angular.element("#semesterIdLeftAdd").parent().contents())($scope);
	        });
		    
			// 确定
			$scope.ok = function(form) {
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				choose_chooseCourseNumberManageService.add($scope.chooseCourseNumberManage, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						$rootScope.showLoading = false; // 关闭加载提示
						return;
					}
					angular.element('#chooseCourseNumberManageTable').bootstrapTable('refresh');
					alertService('success', '操作成功');
					$uibModalInstance.close();
				});
			};
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		leftAddController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseNumberManageService', 'formVerifyService', 'alertService'];




		// 中间
	    $scope.centerQueryParams = function queryParams(params) {
			$scope.chooseCourseNumberManage.type = '2';
            var pageParam = {
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.chooseCourseNumberManage);
	    };
	    
	    // 中间
		$scope.chooseCourseNumberManageByRangeTable = {
			url: app.api.address + '/choose/chooseCourseNumber',
//         	url: 'data_test/choose/tableview_chooseCourseNumberManage2.json',
			method: 'get',
			cache: false,
            height: $scope.center_table_height, //使高度贴底部
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
			queryParams: $scope.centerQueryParams,//传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#chooseCourseNumberManageByRangeTable').contents())($scope);
			},
			clickToSelect: true,
            responseHandler:function(data){
                return data.data;
            },
			columns: [
				{field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#chooseCourseNumberManageByRangeTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }
                },
				{field: "semester",title: "学年学期",align: "center",valign: "middle",width:"10%"},
				{field: "deptName",title: "上课院系",align: "center",valign: "middle",width:"10%"},
				{field: "gradeName",title: "上课年级",align: "center",valign: "middle",width:"10%"},
				{field: "majorName",title: "上课专业",align: "center",valign: "middle",width:"10%"},
				{field: "fromClassName",title: "上课班级",align: "center",valign: "middle",width:"10%"},
				{field: "highestNum",title: "最高选课门数",align: "center",valign: "middle",width:"10%"},
				{field: "schoolNum",title: "校公选门数",align: "center",valign: "middle",width:"10%"},
				{field: "deptNum",title: "院系选修门数",align: "center",valign: "middle",width:"10%"},
				{title: "操作",align: "center",valign: "middle",width:"8%",
					formatter: function(value, row, index) {
					    var deleteButton = "<button type='button' has-permission='' ng-click='centerDelete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>删除</button>";
					    var updateButton = "<button type='button' has-permission='' ng-click='centerUpdate(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>修改</button>";
						return deleteButton + " " + updateButton;
					}
				}
			]
		};
		
		// 刷新一下table
		$scope.centerClickAlready = function(row) {
			angular.element('#chooseCourseNumberManageByRangeTable').bootstrapTable('selectPage', 1);
		};

		// 中间删除按钮
		$scope.centerDelete = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/delete.html',
				size: '',
				resolve: {
					item: function() {
						return row;
					},
				},
				controller: centerDeleteController
			});
		};

		// 中间删除控制器
		var centerDeleteController = function ($scope, $uibModalInstance, items, choose_chooseCourseNumberManageService, alertService) {
			$scope.message = "确定要删除吗？";

			// 确定
			$scope.ok = function() {
				$rootScope.showLoading = true; // 开启加载提示
				choose_chooseCourseNumberManageService.delete(item.id , function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						$rootScope.showLoading = false; // 关闭加载提示
						alertService(message);
						return;
					}
					angular.element('#chooseCourseNumberManageByRangeTable').bootstrapTable('selectPage', 1);
					$uibModalInstance.close();
					alertService('success', '删除成功');
				});
			};

			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
		};
		centerDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseNumberManageService', 'alertService'];

		// 中间修改按钮
		$scope.centerUpdate = function(row) {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/centerUpdate.html',
				size: 'lg',
				resolve: {
					item: function() {
						return row;
					}
				},
				controller: centerUpdateController
			});
		};

		// 中间修改控制器
		var centerUpdateController = function ($scope, $uibModalInstance, item, choose_chooseCourseNumberManageService,baseinfo_generalService, formVerifyService, alertService) {
			$scope.chooseCourseNumberManage = item;
			$scope.chooseCourseNumberManage.highestNum = parseInt(item.highestNum);
			$scope.chooseCourseNumberManage.schoolNum = parseInt(item.schoolNum);
			$scope.chooseCourseNumberManage.deptNum = parseInt(item.deptNum);
			$scope.chooseCourseNumberManage.val = item.classId;
			$scope.param = {};
			// 基础资源获取学年学期Id
			$scope.semesterId = [];
			choose_chooseCourseNumberManageService.getSemesterId(function (error,message,data) {
				$scope.semesterId = data.data;
				var html = ''
					+  '<select ui-select2 '
					+  ' ng-model="chooseCourseNumberManage.semesterId" id="semesterIdCenterUpdate" name="semesterIdCenterUpdate" '
					+  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
					+  '<option value="">==请选择==</option> '
					+  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
					+  '</select>';
				angular.element("#semesterIdCenterUpdate").parent().empty().append(html);
				$compile(angular.element("#semesterIdCenterUpdate").parent().contents())($scope);
			});

			$scope.deptObjs = {};
			baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
				if (error) {
					alertService(message);
					return;
				}
				$scope.deptObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="deptObj.id as deptObj.departmentName  for deptObj in deptObjs" ng-change="changeParam()"'
					+  ' ng-model="chooseCourseNumberManage.deptId" id="deptId" name="deptId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#deptId").parent().empty().append(html);
				$compile(angular.element("#deptId").parent().contents())($scope);
			});

			$scope.gradeObjs = {};
			baseinfo_generalService.findcodedataNames({datableNumber: "NJDM"},function (error, message, data) {
				$scope.gradeObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="gradeObj.dataNumber as gradeObj.dataName  for gradeObj in gradeObjs" ng-change="changeParam()" '
					+  ' ng-model="chooseCourseNumberManage.gradeId" id="gradeId" name="gradeId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#gradeId").parent().empty().append(html);
				$compile(angular.element("#gradeId").parent().contents())($scope);
			});

			$scope.majorObjs = {};
			baseinfo_generalService.gradeProfessionPull({grade: $scope.chooseCourseNumberManage.gradeId},function (error, message, data) {
				$scope.majorObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="majorObj.id as majorObj.name  for majorObj in majorObjs"  ng-change="changeParam()"'
					+  ' ng-model="chooseCourseNumberManage.majorId" id="majorId" name="majorId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#majorId").parent().empty().append(html);
				$compile(angular.element("#majorId").parent().contents())($scope);
			});

			$scope.classObjs = {};
			baseinfo_generalService.classList(function (error, message, data) {
				$scope.classObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="classObj.id as classObj.name  for classObj in classObjs" '
					+  ' ng-model="chooseCourseNumberManage.val" id="classId" name="classId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#classId").parent().empty().append(html);
				$compile(angular.element("#classId").parent().contents())($scope);
			});

			$scope.changeParam = function() {
				$scope.classObjs = {};
				$scope.param.deptId = $scope.chooseCourseNumberManage.deptId;
				$scope.param.gradeId = $scope.chooseCourseNumberManage.gradeId;
				$scope.param.majorId = $scope.chooseCourseNumberManage.majorId;
				choose_chooseCourseNumberManageService.queryClass($scope.param,function (error,message,data) {
					$scope.classObjs = data.data;
					var html = '' +
						'<select ui-select2 ng-options="classObj.id as classObj.name  for classObj in classObjs" '
						+  ' ng-model="chooseCourseNumberManage.val" id="classId" name="classId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
						+  '<option value="">==请选择==</option> '
						+  '</select>';
					angular.element("#classId").parent().empty().append(html);
					$compile(angular.element("#classId").parent().contents())($scope);
				});
			}
		    
			// 确定
			$scope.ok = function(form) {
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				$scope.chooseCourseNumberManage.rangeType = '4';
				choose_chooseCourseNumberManageService.update($scope.chooseCourseNumberManage, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						$rootScope.showLoading = false; // 关闭加载提示
						return;
					}
					angular.element('#chooseCourseNumberManageByRangeTable').bootstrapTable('refresh');
					alertService('success', '操作成功');
					$uibModalInstance.close();
				});
			};
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		centerUpdateController.$inject = ['$scope', '$uibModalInstance', 'item', 'choose_chooseCourseNumberManageService', 'baseinfo_generalService', 'formVerifyService', 'alertService'];

		// 中间添加按钮
		$scope.centerAdd = function() {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/centerAdd.html',
				size: 'lg',
				resolve: {
					items: function() {
					}
				},
				controller: centerAddController
			});
		};

		// 中间添加控制器
		var centerAddController = function ($scope, $uibModalInstance, items, choose_chooseCourseNumberManageService, baseinfo_generalService, formVerifyService, alertService) {
			$scope.param = {};
	        // 基础资源获取学年学期Id
	        $scope.semesterId = [];
	        choose_chooseCourseNumberManageService.getSemesterId(function (error,message,data) {
	            $scope.semesterId = data.data;
	            var html = '' 
	            	+  '<select ui-select2 '
	                +  ' ng-model="chooseCourseNumberManage.semesterId" id="semesterIdCenterAdd" name="semesterIdCenterAdd" '
	                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
	                +  '<option value="">==请选择==</option> '
	                +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
	                +  '</select>';
	            angular.element("#semesterIdCenterAdd").parent().empty().append(html);
	            $compile(angular.element("#semesterIdCenterAdd").parent().contents())($scope);
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
					+  ' ng-model="chooseCourseNumberManage.deptId" id="deptId" name="deptId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#deptId").parent().empty().append(html);
				$compile(angular.element("#deptId").parent().contents())($scope);
			});
			
			$scope.gradeObjs = {};
			baseinfo_generalService.findcodedataNames({datableNumber: "NJDM"},function (error, message, data) {
				$scope.gradeObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="gradeObj.dataNumber as gradeObj.dataName  for gradeObj in gradeObjs" ng-change="changeParam()" '
					+  ' ng-model="chooseCourseNumberManage.gradeId" id="gradeId" name="gradeId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#gradeId").parent().empty().append(html);
				$compile(angular.element("#gradeId").parent().contents())($scope);
			});

			$scope.majorObjs = {};
			baseinfo_generalService.gradeProfessionPull({grade: $scope.chooseCourseNumberManage.gradeId},function (error, message, data) {
				$scope.majorObjs = data.data;
				var html = '' +
					'<select ui-select2 ng-options="majorObj.id as majorObj.name  for majorObj in majorObjs"  ng-change="changeParam()"'
					+  ' ng-model="chooseCourseNumberManage.majorId" id="majorId" name="majorId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
					+  '<option value="">==请选择==</option> '
					+  '</select>';
				angular.element("#majorId").parent().empty().append(html);
				$compile(angular.element("#majorId").parent().contents())($scope); 
			});

			$scope.changeParam = function() {
				$scope.classObjs = {};
				$scope.param.deptId = $scope.chooseCourseNumberManage.deptId;
				$scope.param.gradeId = $scope.chooseCourseNumberManage.gradeId;
				$scope.param.majorId = $scope.chooseCourseNumberManage.majorId;
				choose_chooseCourseNumberManageService.queryClass($scope.param,function (error,message,data) {
					$scope.classObjs = data.data;
					var html = '' +
						'<select ui-select2 ng-options="classObj.id as classObj.name  for classObj in classObjs" '
						+  ' ng-model="chooseCourseNumberManage.val" id="classId" name="classId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
						+  '<option value="">==请选择==</option> '
						+  '</select>';
					angular.element("#classId").parent().empty().append(html);
					$compile(angular.element("#classId").parent().contents())($scope);
				});
			}

			// 确定
			$scope.ok = function(form) {
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				$scope.chooseCourseNumberManage.rangeType = '4';
				choose_chooseCourseNumberManageService.add($scope.chooseCourseNumberManage, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						$rootScope.showLoading = false; // 关闭加载提示
						return;
					}
					angular.element('#chooseCourseNumberManageByRangeTable').bootstrapTable('refresh');
					alertService('success', '操作成功');
					$uibModalInstance.close();
				});
			};
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		centerAddController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseNumberManageService', 'baseinfo_generalService', 'formVerifyService', 'alertService'];

        // 按范围设置选课门数控制查询
		$scope.centerSearchSubmit = function () {
            angular.element('#chooseCourseNumberManageByRangeTable').bootstrapTable('selectPage', 1);
		};
		
        // 按范围设置选课门数控制查询表单重置
        $scope.centerSearchReset = function () {
            $scope.chooseCourseNumberManage = {type:'2'};
            // 重新初始化下拉框
            angular.element('form[name="chooseCourseNumberbyRangeManageform"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#chooseCourseNumberManageByRangeTable').bootstrapTable('selectPage', 1);
        };
        
		// 按范围设置选课门数控制显示隐藏
		$scope.centerIsHideSearchForm = false; // 默认显示
		$scope.centerSearchFormHideToggle = function() {
			$scope.centerIsHideSearchForm = !$scope.centerIsHideSearchForm;
			if($scope.centerIsHideSearchForm) {
				$scope.center_table_height = $scope.center_table_height + 115;
			} else {
				$scope.center_table_height = $scope.center_table_height - 115;
			}
			angular.element('#chooseCourseNumberManageByRangeTable').bootstrapTable('resetView', {
				height: $scope.center_table_height
			});
		};
		
        
        
        
        
        
        
        
        
        
        
        
        
		// 右侧
	    $scope.rightQueryParams = function queryParams(params) {
            var pageParam = {
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.chooseCourseNumberManage);
	    };
	    
	    // 右侧
		$scope.chooseCourseNumberManageByMarkTable = {
//			url: app.api.address + '/choose/chooseCourseNumberManage',
        	url: 'data_test/choose/tableview_chooseCourseNumberManage3.json',
			method: 'get',
			cache: false,
            height: $scope.right_table_height, //使高度贴底部
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
			queryParams: $scope.rightQueryParams,//传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#chooseCourseNumberManageByMarkTable').contents())($scope);
				angular.element('#chooseCourseNumberManageByMarkTable').bootstrapTable('selectPage', 1);
			},
			clickToSelect: true,
            responseHandler:function(data){
                return {
                    "total": data.total,//总页数
                    "rows": data.rows   //数据
                };
            },
			columns: [
				{field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#chooseCourseNumberManageByMarkTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "semester",title: "学年学期",align: "center",valign: "middle",width:"17%"},
				{field: "studentMark",title: "学生标签",align: "center",valign: "middle",width:"17%"},
				{field: "highestNum",title: "最高选课门数",align: "center",valign: "middle",width:"17%"},
				{field: "schoolNum",title: "校公选门数",align: "center",valign: "middle",width:"17%"},
				{field: "deptNum",title: "院系选修门数",align: "center",valign: "middle",width:"17%"},
				{title: "操作",align: "center",valign: "middle",width:"10%",
					formatter: function(value, row, index) {
					    var deleteButton = "<button type='button' has-permission='' ng-click='rightDelete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>删除</button>";
					    var updateButton = "<button type='button' has-permission='' ng-click='rightUpdate(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>修改</button>";
						return deleteButton + " " + updateButton;
					}
				}
			]
		};
		
		// 右侧删除按钮
		$scope.rightDelete = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/delete.html',
				size: '',
				resolve: {
					items: function() {
						return row;
					},
				},
				controller: rightDeleteController
			});
		};

		// 右侧删除控制器
		var rightDeleteController = function ($scope, $uibModalInstance, items, choose_chooseCourseNumberManageService, alertService) {
			
			$scope.message = "确定要删除吗？";
			
			// 确定
			$scope.ok = function() {
				alertService('success', '操作成功');
				$uibModalInstance.close();
			};
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		rightDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseNumberManageService', 'alertService'];

		// 右侧修改按钮
		$scope.rightUpdate = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/rightUpdate.html',
				size: 'lg',
				resolve: {
					items: function() {
						return row;
					},
				},
				controller: rightUpdateController
			});
		};

		// 右侧修改控制器
		var rightUpdateController = function ($scope, $uibModalInstance, items, choose_chooseCourseNumberManageService, alertService) {
			
			// 确定
			$scope.ok = function() {
				alertService('success', '操作成功');
				$uibModalInstance.close();
			};
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		rightUpdateController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseNumberManageService', 'alertService'];

		// 右侧添加按钮
		$scope.rightAdd = function(row) {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseNumberManage/rightAdd.html',
				size: 'lg',
				resolve: {
					items: function() {
					}
				},
				controller: rightAddController
			});
		};

		// 右侧添加控制器
		var rightAddController = function ($scope, $uibModalInstance, items, choose_chooseCourseNumberManageService, alertService) {
			
	        // 基础资源获取学年学期Id
	        $scope.semesterId = [];
	        choose_chooseCourseNumberManageService.getSemesterId(function (error,message,data) {
	            $scope.semesterId = data.data;
	            var html = '' 
	            	+  '<select ui-select2 '
	                +  ' ng-model="chooseCourseNumberManage.semester" id="semesterIdRightAdd" name="semesterIdRightAdd" '
	                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
	                +  '<option value="">==请选择==</option> '
	                +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
	                +  '</select>';
	            angular.element("#semesterIdRightAdd").parent().empty().append(html);
	            $compile(angular.element("#semesterIdRightAdd").parent().contents())($scope);
	        });
		    
			// 确定
			$scope.ok = function() {
				alertService('success', '操作成功');
				$uibModalInstance.close();
			};
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		rightAddController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseNumberManageService', 'alertService'];

        // 按标签设置选课门数控制查询
		$scope.rightSearchSubmit = function () {
            angular.element('#chooseCourseNumberManageByMarkTable').bootstrapTable('selectPage', 1);
		};
		
        // 按标签设置选课门数控制查询表单重置
        $scope.rightSearchReset = function () {
            $scope.chooseCourseNumberManage = {};
            // 重新初始化下拉框
            angular.element('form[name="chooseCourseNumberbyMarkManageform"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#chooseCourseNumberManageByMarkTable').bootstrapTable('selectPage', 1);
        };
        
		// 按范围设置选课门数控制显示隐藏
		$scope.rightIsHideSearchForm = false; // 默认显示
		$scope.rightSearchFormHideToggle = function() {
			$scope.rightIsHideSearchForm = !$scope.rightIsHideSearchForm;
			if($scope.rightIsHideSearchForm) {
				$scope.right_table_height = $scope.right_table_height + 45;
			} else {
				$scope.right_table_height = $scope.right_table_height - 45;
			}
			angular.element('#chooseCourseNumberManageByMarkTable').bootstrapTable('resetView', {
				height: $scope.right_table_height
			});
		};
        
	};
	choose_chooseCourseNumberManageController.$inject = ['$scope', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_chooseCourseNumberManageService', 'alertService', 'app'];

})(window);