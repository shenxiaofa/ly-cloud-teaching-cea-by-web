;(function(window, undefined) {
	'use strict';

	window.student_executiveClassController = function($scope, $http, $uibModal, $compile, $rootScope, $window, student_executiveClassService, alertService, app) {

		// 表格的高度
        $scope.table_height = $window.innerHeight - 226;
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在

		// 新增中用到的Id
		var finalId = "";
	    var classIdTemp = "";
	    $scope.executiveClass = {};
        
        // 获取所属院系
        $scope.deptId = [];
        student_executiveClassService.getSelect(function (error,message,data) {
            $scope.deptId = data.deptList;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' id="deptId" name="deptId" class="form-control" ui-jq="chosen" '
                +  ' ng-model="executiveClass.deptId" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in deptId" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#deptId").parent().empty().append(html);
            $compile(angular.element("#deptId").parent().contents())($scope);
        });
		
        // 获取年级Id
        $scope.grade = [];
        student_executiveClassService.getGradeInfo(function (error,message,data) {
            $scope.grade = data.data.rows;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' id="grade" name="grade" class="form-control" ui-jq="chosen" '
                +  ' ng-model="executiveClass.grade" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in grade" value="{{a.grade}}">{{a.grade}}</option> '
                +  '</select>';
            angular.element("#grade").parent().empty().append(html);
            $compile(angular.element("#grade").parent().contents())($scope);
        });
		
        // 基础资源获取学年学期Id
        $scope.gradeMajorId = [];
        student_executiveClassService.getSelect(function (error,message,data) {
            $scope.gradeMajorId = data.majorList;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' id="gradeMajorId" name="gradeMajorId" class="form-control" ui-jq="chosen" '
                +  ' ng-model="executiveClass.gradeMajorId" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in gradeMajorId" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#gradeMajorId").parent().empty().append(html);
            $compile(angular.element("#gradeMajorId").parent().contents())($scope);
        });
		
        // 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function (form) {
            angular.element('#executiveClassTable').bootstrapTable('selectPage', 1);
		};

		// 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
            	type : 'select',
            	deptId : $scope.executiveClass.deptId,
            	grade : $scope.executiveClass.grade,
            	majoyId : $scope.executiveClass.majoyId,
            	classCode : $scope.executiveClass.classCode,
            	className : $scope.executiveClass.className,
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber,  //页码
            };
            return angular.extend(pageParam, $scope.executiveClass);
        };
        
		$scope.executiveClassTable = {
			url: app.api.address + '/student/class',
			headers: {
				permission: "executiveClass:query"
			},
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
            sortName: 'classCode', // 默认排序字段
            sortOrder: 'classCode', // 默认排序方式	
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "number", // 指定主键列
            uniqueId: "number", // 每行唯一标识
        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			onLoadSuccess: function() {
				$compile(angular.element('#executiveClassTable').contents())($scope);
			},
			responseHandler: function(data) {
				// 若传回来的数据不为空
            	if(data.data.rows.length !== 0){
            		$scope.deleteDataIsExist = true;
            	}
            	// 若传回来的数据为空，则清空时显示“当前没数据可清空”
            	if(data.data.rows.length == 0){
            		$scope.deleteDataIsExist = false;
            	}
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
        	},
			clickToSelect: true,
			columns: [{checkbox: true,width: "3%"},
				{  
                    field : 'number',title : '序号',align: "center",valign: "middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#executiveClassTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "classCode",title: "班级号",align: "center",valign: "middle",width:"10%"},
				{field: "className",title: "班级名称",align: "center",valign: "middle",width:"15%"},
				{field: "deptName",title: "所属院系",align: "center",valign: "middle",width:"15%"},
				{field: "grade",title: "年级",align: "center",valign: "middle",width:"5%"},
				{field: "majorName",title: "年级专业",align: "center",valign: "middle",width:"10%"},
				{field: "entranceTime",title: "入学时间",align: "center",valign: "middle",width:"10%",
					formatter: function(value, row, index) {
						// value = Date.parse(value);
						if(value){
							row.entranceTime = new Date(value);
						}
						return value;
					}},
				{field: "leaveTime",title: "离校时间",align: "center",valign: "middle",width:"10%",
					formatter: function(value, row, index) {
						// value = Date.parse(value);
						if(value){
							row.leaveTime = new Date(value);
						}
						return value;
					}},
				{field: "educationYear",title: "学制",align: "center",valign: "middle",width:"5%"},
				{title: "操作",align: "center",valign: "middle",width:"15%",
					formatter: function(value, row, index) {
					    var updateButton = "<button type='button' has-permission='executiveClass:update' ng-click='openUpdate(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>修改</button>";
					    var selectStudentButton = "<button type='button' has-permission='executiveClass:queryStudent' ng-click='openSelectStudent(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>学生查询</button>";
                        return updateButton+"&nbsp"+selectStudentButton;
					}
				}
			]
		};
		
		// 打开修改面板
		$scope.openUpdate = function(row) {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/student/classManage/executiveClass/update.html',
				size: 'lg',
				resolve: {
					item: function() {
						return row;
					}
				},
				controller: updateInfoController
			});
		};

		// 修改控制器
		var updateInfoController = function ($scope, $uibModalInstance, item, student_executiveClassService, formVerifyService, alertService, $filter) {
	        
	        // 获取所属院系
	        $scope.deptId = [];
	        student_executiveClassService.getSelect(function (error,message,data) {
	            $scope.deptId = data.deptList;
	            var html = '' 
	            	+  '<select ui-select2 '
	                +  ' id="deptId" name="deptIdUpdate" class="form-control" ui-jq="chosen" '
	                +  ' ng-model="executiveClass.deptId" ui-options="{search_contains: true}" > '
	                +  '<option value="">==请选择==</option> '
	                +  '<option ng-repeat="a in deptId" value="{{a.id}}">{{a.name}}</option> '
	                +  '</select>';
	            angular.element("#deptId").parent().empty().append(html);
	            $compile(angular.element("#deptId").parent().contents())($scope);
	        });
			
	        // 获取年级Id
	        $scope.grade = [];
	        student_executiveClassService.getGradeInfo(function (error,message,data) {
	            $scope.grade = data.data.rows;
	            var html = '' 
	            	+  '<select ui-select2 '
	                +  ' id="grade" name="gradeUpdate" class="form-control" ui-jq="chosen" '
	                +  ' ng-model="executiveClass.grade" ui-options="{search_contains: true}" > '
	                +  '<option value="">==请选择==</option> '
	                +  '<option ng-repeat="a in grade" value="{{a.grade}}">{{a.grade}}</option> '
	                +  '</select>';
	            angular.element("#grade").parent().empty().append(html);
	            $compile(angular.element("#grade").parent().contents())($scope);
	        });
			
	        // 获取年级专业Id
	        $scope.gradeMajorId = [];
	        student_executiveClassService.getSelect(function (error,message,data) {
	            $scope.gradeMajorId = data.majorList;
	            var html = '' 
	            	+  ' <select ui-select2 '
	                +  ' ng-model="executiveClass.gradeMajorId" id="gradeMajorId" name="gradeMajorIdUpdate" '
	                +  ' ng-required="true" ui-chosen="executiveClass.gradeMajorId" '
	                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
	                +  ' <option value="">==请选择==</option> '
	                +  ' <option  ng-repeat="a in gradeMajorId" value="{{a.id}}">{{a.name}}</option> '
	                +  ' </select> ';
	            angular.element("#gradeMajorId").parent().empty().append(html);
	            $compile(angular.element("#gradeMajorId").parent().contents())($scope);
	        });
			
	        // $scope.executiveClass = {
	        //     type : 'updateByPrimaryKey',
	        //     classCode : item.classCode,
	        //     className : item.className,
	        //     deptId : item.deptId,
	        //     grade : item.grade,
	        //     gradeMajorId : item.gradeMajorId,
	        //     id : item.id,
				// entranceTime : new Date(item.entranceTime),
				// leaveTime : new Date(item.leaveTime),
				// educationYear : item.educationYear
	        // };

			$scope.executiveClass = item;
			$scope.executiveClass.type = 'updateByPrimaryKey';
			if(item.entranceTime){
				$scope.executiveClass.entranceTime = new Date(item.entranceTime);
			}
			if(item.leaveTime){
				$scope.executiveClass.leaveTime = new Date(item.leaveTime);
			}
				// 开始日期参数配置
			$scope.ksrqOptions = {
				opened: false,
				open: function() {
					$scope.ksrqOptions.opened = true;
				}
			};
			// 结束日期参数配置
			$scope.jsrqOptions = {
				opened: false,
				open: function() {
					$scope.jsrqOptions.opened = true;
				}
			};
			// 结束日期小于开始日期时的提示
			$scope.jsrqTooltipEnableAndOpen = false;
			$scope.$watch('executiveClass.leaveTime', function (newValue) {
				if ($scope.executiveClass.entranceTime && newValue && (newValue < $scope.executiveClass.entranceTime)) {
					$scope.jsrqTooltipEnableAndOpen = true;
					return;
				}
				$scope.jsrqTooltipEnableAndOpen = false;
			});

			$scope.ok = function (form) {
	            if(form.$invalid) {
	                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
	                formVerifyService(form);
	                return;
	            };
				
	            student_executiveClassService.update($scope.executiveClass, function (error, message) {
	                if (error) {
	                    alertService(message);
	                    return;
	                }
	                $uibModalInstance.close();
	                angular.element('#executiveClassTable').bootstrapTable('selectPage', 1);
	                alertService('success', '修改成功');
	            });
			};
			// 关闭窗口事件
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		updateInfoController.$inject = ['$scope', '$uibModalInstance', 'item', 'student_executiveClassService', 'formVerifyService', 'alertService', '$filter'];

		// 打开学生查询面板
		$scope.openSelectStudent = function(row) {
		    classIdTemp = row.id;
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/student/classManage/executiveClass/studentInfo.html',
				size: 'lg',
				resolve: {
					item: function() {
						return row;
					}
				},
				controller: studentInfoController
			});
		};

		// 学生查询控制器
		var studentInfoController = function ($compile, $scope, $uibModalInstance, item, student_executiveClassService, alertService) {
			
			$scope.executiveClass = {};
			
	        // 查询
			$scope.searchSubmit = function (form) {
	            angular.element('#studentInfoTable').bootstrapTable('selectPage', 1);
			};
	
	        // 表单重置
	        $scope.searchReset = function () {
	            $scope.executiveClass = {};
	            angular.element('#studentInfoTable').bootstrapTable('selectPage', 1);
	        };
	        
			// 显示隐藏
			$scope.isHideSearchForm = false; // 默认显示
			$scope.searchFormHideToggle = function() {
				$scope.isHideSearchForm = !$scope.isHideSearchForm;
				if($scope.isHideSearchForm) {
					$scope.table_height = $scope.table_height + 147;
				} else {
					$scope.table_height = $scope.table_height - 147;
				}
				angular.element('#studentInfoTable').bootstrapTable('resetView', {
					height: $scope.table_height
				});
			};
        	
			// 查询参数
	        $scope.queryParams = function queryParams(params) {
	            var pageParam = {
	            	type : 'selectStudentInfo',
	            	classId : classIdTemp,
	            	studentNum : $scope.executiveClass.studentNum,
	            	studentName : $scope.executiveClass.studentName,
	                pageSize : params.pageSize,   //页面大小
	                pageNo : params.pageNumber  //页码
	            };
	            return angular.extend(pageParam, $scope.executiveClass);
	        };
	        
			$scope.studentInfoTable = {
				url: app.api.address + '/student/class',
				headers: {
					permission: "executiveClass:queryStudent"
				},
				method: 'get',
				cache: false,
	            height: $scope.table_height, //使高度贴底部
				toolbar: '', //工具按钮用哪个容器
				sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
				striped: true,
				pagination: true,
				pageSize: 10,
				pageNumber: 1,
				pageList: [5, 10, 20, 50], // 设置可供选择的页面数据条数
	            paginationPreText: '上一页',
	            paginationNextText: '下一页',
	            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
	            idField : "number", // 指定主键列
	            uniqueId: "number", // 每行唯一标识
	        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
				queryParams: $scope.queryParams,//传递参数（*）
				search: false,
//				refresh: getPage,
//				showColumns: true,
//				showRefresh: true,
				onLoadSuccess: function() {
					$compile(angular.element('#studentInfoTable').contents())($scope);
				},
				responseHandler: function(data) {
	                return {
	                    "total": data.data.total,//总页数
	                    "rows": data.data.rows   //数据
	                };
	        	},
				clickToSelect: true,
				columns: [
					{  
	                    field : 'number',title : '序号',align: "center",valign: "middle",width:"5%",
	                    formatter : function(value, row, index) {  
	                        var page = angular.element('#studentInfoTable').bootstrapTable("getPage");  
	                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
	                    }  
	                },
					{field: "studentNum",title: "学号",align: "center",valign: "middle",width:"15%"},
					{field: "studentName",title: "姓名",align: "center",valign: "middle",width:"10%"},
					{field: "sexCode",title: "性别",align: "center",valign: "middle",width:"5%",
	                    formatter : function(value, row, index) {
	                    	var sex = "";
	                    	if(row.sexCode == 1){
	                    		sex = "男";
	                    	}
	                    	if(row.sexCode == 2){
	                    		sex = "女";
	                    	}
	                        return sex;  
	                    }  
					},
					{field: "gradeMajorName",title: "专业",align: "center",valign: "middle",width:"20%"},
					{field: "grade",title: "年级",align: "center",valign: "middle",width:"10%"},
					{field: "deptName",title: "学院",align: "center",valign: "middle",width:"20%"}
				]
			};
			
			// 关闭窗口事件
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		studentInfoController.$inject = ['$compile', '$scope', '$uibModalInstance', 'item', 'student_executiveClassService', 'alertService'];

		// 打开新增面板
		$scope.openAdd = function() {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/student/classManage/executiveClass/add.html',
				size: 'lg',
				resolve: {
					item: function() {
//						return row;
					}
				},
				controller: addInfoController
			});
		};

		// 新增控制器
		var addInfoController = function ($scope, $compile, $http, $uibModalInstance, student_executiveClassService, formVerifyService, alertService, $filter) {
	        
			// 初始化
			$scope.executiveClass = {};
			// 开始日期参数配置
			$scope.ksrqOptions = {
				opened: false,
				open: function() {
					$scope.ksrqOptions.opened = true;
				}
			};
			// 结束日期参数配置
			$scope.jsrqOptions = {
				opened: false,
				open: function() {
					$scope.jsrqOptions.opened = true;
				}
			};
			// 结束日期小于开始日期时的提示
			$scope.jsrqTooltipEnableAndOpen = false;
			$scope.$watch('executiveClass.leaveTime', function (newValue) {
				if ($scope.executiveClass.entranceTime && newValue && (newValue < $scope.executiveClass.entranceTime)) {
					$scope.jsrqTooltipEnableAndOpen = true;
					return;
				}
				$scope.jsrqTooltipEnableAndOpen = false;
			});
	        // 获取所属院系
	        $scope.deptId = [];
	        student_executiveClassService.getSelect(function (error,message,data) {
	            $scope.deptId = data.deptList;
	            var html = '' 
	            	+  '<select ui-select2 '
	                +  ' id="deptId" name="deptIdAdd" class="form-control" ui-jq="chosen" '
	                +  ' ng-model="executiveClass.deptId" ui-options="{search_contains: true}" > '
	                +  '<option value="">==请选择==</option> '
	                +  '<option ng-repeat="a in deptId" value="{{a.id}}">{{a.name}}</option> '
	                +  '</select>';
	            angular.element("#deptId").parent().empty().append(html);
	            $compile(angular.element("#deptId").parent().contents())($scope);
	        });
			
	        // 获取年级Id
	        $scope.grade = [];
	        student_executiveClassService.getGradeInfo(function (error,message,data) {
	            $scope.grade = data.data.rows;
	            var html = '' 
	            	+  '<select ui-select2 '
	                +  ' id="grade" name="gradeAdd" class="form-control" ui-jq="chosen" '
	                +  ' ng-model="executiveClass.grade" ui-options="{search_contains: true}" > '
	                +  '<option value="">==请选择==</option> '
	                +  '<option ng-repeat="a in grade" value="{{a.grade}}">{{a.grade}}</option> '
	                +  '</select>';
	            angular.element("#grade").parent().empty().append(html);
	            $compile(angular.element("#grade").parent().contents())($scope);
	        });
			
	        // 获取年级专业Id
	        $scope.gradeMajorId = [];
	        student_executiveClassService.getSelect(function (error,message,data) {
	            $scope.gradeMajorId = data.majorList;
	            var html = '' 
	            	+  '<select ui-select2 '
	                +  ' ng-change="testChange()" ng-model="executiveClass.gradeMajorId" '
	                +  ' id="gradeMajorId" name="gradeMajorIdAdd" ng-required="true" '
	                +  ' ui-chosen="executiveClass.gradeMajorId" class="form-control" '
	                +  ' ui-jq="chosen" ui-options="{search_contains: true}" > '
	                +  '<option value="">==请选择==</option> '
	                +  '<option  ng-repeat="a in gradeMajorId" value="{{a.id}}">{{a.name}}</option> '
	                +  '</select>';
	            angular.element("#gradeMajorId").parent().empty().append(html);
	            $compile(angular.element("#gradeMajorId").parent().contents())($scope);
	        });

			var finalId = "";
			
			// 每次改变下拉框都执行一次
	        $scope.testChange = function(){
	            if(!$scope.executiveClass.gradeMajorId){
	                $scope.executiveClass.classCode = "";
	                $scope.executiveClass.className = "";
	            }else{
					$http({
						headers: {
							permission: "executiveClass:insert"
						},
						method: 'GET',
						url: app.api.address + '/student/class/num/' + $scope.executiveClass.gradeMajorId
		            }).then(function successCallback(response) {
							var finalIdTemp = response.data.data;
							finalIdTemp = finalIdTemp.substring(finalIdTemp.length-2);
							finalId = parseInt(finalIdTemp) + 1;	// 得到的值+1
							// 得到的值若是个位数，前面加0
							if(finalId < 10){
								$scope.executiveClass.classCode = $scope.executiveClass.gradeMajorId + "0" + finalId;
							}else{
								$scope.executiveClass.classCode = $scope.executiveClass.gradeMajorId + finalId;
							}
							// 初始化需要遍历得到的年级专业名
							var majoyNameTemp = "";
							for(var i=0; i<$scope.gradeMajorId.length; i++){
								if($scope.gradeMajorId[i].majorId == $scope.executiveClass.gradeMajorId){
									majoyNameTemp = $scope.gradeMajorId[i].majorName;
								}
							}
							$scope.executiveClass.className = majoyNameTemp + finalId + "班";
						}, function errorCallback(response) {
							// 请求失败执行代码
						}
					);
	            }
	       };
			
			// 点击确认
			$scope.ok = function (form) {
				// 处理前验证input输入框
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				
				var executiveClass = {};	// 初始化没有的数据 5条必须的
				var executiveClassFinalResult = [];	// 最终提交结果
				// $scope.executiveClass.entranceTime = $scope.executiveClass.entranceTime.toLocaleDateString();
				$scope.executiveClass.entranceTime = $filter("date")($scope.executiveClass.entranceTime, 'yyyy-MM-dd');
				$scope.executiveClass.leaveTime = $filter("date")($scope.executiveClass.leaveTime, 'yyyy-MM-dd');
				$scope.executiveClass.id = $scope.executiveClass.classCode;
				// executiveClass = {
				// 	"id" : $scope.executiveClass.classCode,
				// 	"deptId" : $scope.executiveClass.deptId,
				// 	"grade" : $scope.executiveClass.grade,
				// 	"gradeMajorId" : $scope.executiveClass.gradeMajorId,
				// 	"classCode" : $scope.executiveClass.classCode,
				// 	"className" : $scope.executiveClass.className
				// };
				executiveClass = $scope.executiveClass;
				executiveClassFinalResult.push(executiveClass);
				console.log(executiveClassFinalResult);
				
				if(executiveClassFinalResult.length !== 0 && executiveClassFinalResult !== 'undefined'){
					student_executiveClassService.add(executiveClassFinalResult, function(error, message){
						if(error) {
							alertService(message);
							return;
						}
						$uibModalInstance.close();
						angular.element('#executiveClassTable').bootstrapTable('selectPage', 1);
						alertService('success', '新增成功');
					});
				}else{
					alertService('新增失败，请选择节次！');
				}
				
//				$uibModalInstance.close();
			};
			// 关闭窗口事件
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		addInfoController.$inject = ['$scope', '$compile', '$http', '$uibModalInstance', 'student_executiveClassService', 'formVerifyService', 'alertService', '$filter'];

		// 打开删除面板
		$scope.openDelete = function(){
			var rows = angular.element('#executiveClassTable').bootstrapTable('getSelections');
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
				templateUrl: 'tpl/student/classManage/executiveClass/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteController
			});
		};
		
		// 删除控制器
		var openDeleteController = function ($scope, $uibModalInstance, items, student_executiveClassService, alertService) {
			$scope.message = "确定要删除吗？";
			$scope.ok = function () {
				var executiveClassIds = []; // 代码类型号数组
				items.forEach (function(executiveClass) {
					executiveClassIds.push(executiveClass.id);
				});
				student_executiveClassService.delete(executiveClassIds, function (error, message) {
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#executiveClassTable').bootstrapTable('selectPage', 1);
					alertService('success', '删除成功');
				});
				$uibModalInstance.close();
			};
			// 关闭窗口事件
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'student_executiveClassService', 'alertService'];
        
        // 表单重置
        $scope.searchReset = function () {
            $scope.executiveClass = {};
            // 重新初始化下拉框
            angular.element('form[name="executiveClassSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#executiveClassTable').bootstrapTable('selectPage', 1);
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
			angular.element('#executiveClassTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	student_executiveClassController.$inject = ['$scope', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'student_executiveClassService', 'alertService', 'app'];

})(window);