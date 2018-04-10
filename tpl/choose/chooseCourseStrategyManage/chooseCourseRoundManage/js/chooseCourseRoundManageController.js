;(function(window, undefined) {
	'use strict';

	window.choose_chooseCourseRoundManageController = function($scope, $state, $http, $uibModal, $compile, $rootScope, $window, choose_chooseCourseRoundManageService, alertService, app) {

		$scope.chooseCourseRoundManage = {};
		// 表格的高度
        $scope.table_height = $window.innerHeight - 154;
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在

        // 基础资源获取学年学期Id
        $scope.semesterId = [];
        choose_chooseCourseRoundManageService.getSemesterId(function (error,message,data) {
            $scope.semesterId = data.data;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' ng-model="chooseCourseRoundManage.semesterId" id="semesterId" name="semesterId" '
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
            return angular.extend(pageParam, $scope.chooseCourseRoundManage);
	    };
	    
		$scope.chooseCourseRoundManageTable = {
			url: app.api.address + '/choose/chooseCourseRound',
//         	url: 'data_test/choose/tableview_chooseCourseRoundManage.json',
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
				$compile(angular.element('#chooseCourseRoundManageTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler: function(response) {
                return response.data;
        	},
			columns: [
				{field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#chooseCourseRoundManageTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "semester",title: "学年学期",align: "center",valign: "middle",width:"16%"},
				{field: "roundName",title: "选课轮次名称",align: "center",valign: "middle",width:"16%"},
				{field: "startTime",title: "开始时间",align: "center",valign: "middle",width:"16%"},
				{field: "endTime",title: "结束时间",align: "center",valign: "middle",width:"16%"},
				{field: "releaseSign",title: "是否发布",align: "center",valign: "middle",width:"16%",
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
				{title: "操作",align: "center",valign: "middle",width:"15%",
					formatter: function(value, row, index) {
					    var updateButton = "<button type='button' has-permission='' ng-click='prohibitionUpdate(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>修改</button>";
					    var deleteButton = "<button type='button' has-permission='' ng-click='prohibitionDelete(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>删除</button>";
					    var maintainButton = "<button type='button' has-permission='' ng-click='prohibitionMaintain(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>范围维护</button>";
						var releaseButton = "<button type='button' has-permission='' ng-click='prohibitionRelease(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>发布</button>";
						if(row.releaseSign=="0"){
							return updateButton + "&nbsp;" + deleteButton	+ "&nbsp;" + maintainButton + "&nbsp;" + releaseButton;
						}else{
							return updateButton + "&nbsp;" + deleteButton	+ "&nbsp;" + maintainButton ;
						}
					}
				}
			]
		};
		
		// 新增按钮
		$scope.addButton = function() {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseRoundManage/add.html',
				size: 'lg',
				resolve: {
					items: function () {
					},
				},
				controller: addChooseCourseRoundManageController
			});
		};

		// 新增控制器
		var addChooseCourseRoundManageController = function ($scope, $uibModalInstance, items, choose_chooseCourseRoundManageService, formVerifyService, $filter, alertService) {
			$scope.chooseCourseRoundManage = {
				releaseSign:'0',
				chosenControl:'1',
				teachingNumControl:'1',
				perCourseRetreatSign:'1',
				allowConflictSign:'1',
				way:'1'
			};
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
			$scope.$watch('chooseCourseRoundManage.endDate', function (newValue) {
				if ($scope.chooseCourseRoundManage.startDate && newValue && (newValue < $scope.chooseCourseRoundManage.startDate)) {
					$scope.jsrqTooltipEnableAndOpen = true;
					return;
				}
				$scope.jsrqTooltipEnableAndOpen = false;
			});

	        // 基础资源获取学年学期Id
	        $scope.semesterId = [];
	        choose_chooseCourseRoundManageService.getSemesterId(function (error,message,data) {

	            $scope.semesterIdAdd = data.data;
	            var htmlAdd = '' 
	            	+  '<select ui-select2 '
	                +  ' ng-model="chooseCourseRoundManage.semesterId" id="semesterIdAdd" name="semesterIdAdd" '
	                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" ui-chosen="chooseCourseRoundManageAddForm.semesterIdAdd" > '
	                +  '<option value="">==请选择==</option> '
	                +  '<option  ng-repeat="semester in semesterIdAdd" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
	                +  '</select>';
	            angular.element("#semesterIdAdd").parent().empty().append(htmlAdd);
	            $compile(angular.element("#semesterIdAdd").parent().contents())($scope);
	        });
        
			$scope.ok = function (form) {
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				var mark = [];
				if($scope.chooseCourseRoundManage.mark1){
					mark.push('1');
				}
				if($scope.chooseCourseRoundManage.mark2){
					mark.push('2');
				}
				if($scope.chooseCourseRoundManage.mark3){
					mark.push('3');
				}
				if($scope.chooseCourseRoundManage.mark4){
					mark.push('4');
				}
				$scope.chooseCourseRoundManage.mark = mark.toString();
				$scope.chooseCourseRoundManage.everyDayStartTime = $filter("date")($scope.chooseCourseRoundManage.startTime, 'hh:mm');
				$scope.chooseCourseRoundManage.everyDayEndTime = $filter("date")($scope.chooseCourseRoundManage.endTime, 'hh:mm');
				$scope.chooseCourseRoundManage.startTime = $filter("date")($scope.chooseCourseRoundManage.startDate, 'yyyy-MM-dd');
				$scope.chooseCourseRoundManage.endTime = $filter("date")($scope.chooseCourseRoundManage.endDate, 'yyyy-MM-dd');
				// console.log($scope.chooseCourseRoundManage);
				$rootScope.showLoading = true; // 开启加载提示
				choose_chooseCourseRoundManageService.add($scope.chooseCourseRoundManage, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						$rootScope.showLoading = false; // 关闭加载提示
						return;
					}
					angular.element('#chooseCourseRoundManageTable').bootstrapTable('refresh');
					alertService('success', '操作成功');
					$uibModalInstance.close();
				});

			};
				
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		addChooseCourseRoundManageController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseRoundManageService', 'formVerifyService', '$filter', 'alertService'];

		// 打开删除面板
		$scope.prohibitionDelete = function(row){
			var rows = angular.element('#chooseCourseRoundManageTable').bootstrapTable('getSelections');
			if(row){
				rows.push(row);
			}
			if(rows.length == 0){
				alertService('请先选择要删除的项!');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseRoundManage/delete.html',
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
		var openDeleteController = function ($scope, $uibModalInstance, items, choose_chooseCourseRoundManageService, alertService) {
			$scope.message = "确定要删除吗？";
			$scope.ok = function () {
				var ids = []; // 代码类型号数组
				items.forEach (function(data) {
					ids.push(data.id);
				});
				$rootScope.showLoading = true; // 开启加载提示
				choose_chooseCourseRoundManageService.delete(ids, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						$rootScope.showLoading = false; // 关闭加载提示
						alertService(message);
						return;
					}
					angular.element('#chooseCourseRoundManageTable').bootstrapTable('selectPage', 1);
					$uibModalInstance.close();
					alertService('success', '删除成功');
				});
				
			};
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'choose_chooseCourseRoundManageService', 'alertService'];

		// 新增按钮
		$scope.addProhibitionList = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseRoundManage/add.html',
				size: 'lg',
				resolve: {
					item: function () {
						return row;
					},
				},
				controller: addChooseCourseRoundManageController
			});
		};

		// 新增控制器
		var addProhibitionListController = function ($scope, $uibModalInstance, item, choose_chooseCourseRoundManageService, alertService) {

			$scope.ok = function () {
				alertService('success', '操作成功');
				$uibModalInstance.close();
			};
				
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		addProhibitionListController.$inject = ['$scope', '$uibModalInstance', 'item', 'choose_chooseCourseRoundManageService', 'alertService'];

		//发布
		$scope.prohibitionRelease = function(row) {
			choose_chooseCourseRoundManageService.release(row, function (error, message) {
				$rootScope.showLoading = false; // 关闭加载提示
				if (error) {
					alertService(message);
					$rootScope.showLoading = false; // 关闭加载提示
					return;
				}
				angular.element('#chooseCourseRoundManageTable').bootstrapTable('refresh');
				alertService('success', '操作成功');
				$uibModalInstance.close();
			});
		};		
		
		// 修改按钮
		$scope.prohibitionUpdate = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseRoundManage/update.html',
				size: 'lg',
				resolve: {
					item: function () {
						return row;
					},
				},
				controller: updateProhibitionListController
			});
		};

		// 修改控制器
		var updateProhibitionListController = function ($scope, $uibModalInstance, item, choose_chooseCourseRoundManageService, formVerifyService, $filter, alertService) {
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
			$scope.$watch('chooseCourseRoundManage.endDate', function (newValue) {
				if ($scope.chooseCourseRoundManage.startDate && newValue && (newValue < $scope.chooseCourseRoundManage.startDate)) {
					$scope.jsrqTooltipEnableAndOpen = true;
					return;
				}
				$scope.jsrqTooltipEnableAndOpen = false;
			});
			// 基础资源获取学年学期Id
			$scope.semesterId = [];
			choose_chooseCourseRoundManageService.getSemesterId(function (error,message,data) {

				$scope.semesterIdAdd = data.data;
				var htmlAdd = ''
					+  '<select ui-select2 '
					+  ' ng-model="chooseCourseRoundManage.semesterId" id="semesterIdAdd" name="semesterIdAdd" '
					+  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" ui-chosen="chooseCourseRoundManageAddForm.semesterIdAdd" > '
					+  '<option value="">==请选择==</option> '
					+  '<option  ng-repeat="semester in semesterIdAdd" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
					+  '</select>';
				angular.element("#semesterIdAdd").parent().empty().append(htmlAdd);
				$compile(angular.element("#semesterIdAdd").parent().contents())($scope);
			});
			$scope.chooseCourseRoundManage = item;
			$scope.chooseCourseRoundManage.startDate = Date.parse(item.startTime);
			$scope.chooseCourseRoundManage.endDate = Date.parse(item.endTime);
			$scope.chooseCourseRoundManage.startTime = Date.parse(item.startTime +' '+ item.everyDayStartTime);
			$scope.chooseCourseRoundManage.endTime = Date.parse(item.endTime +' '+ item.everyDayEndTime);
			var mark = item.mark.split(',');
			mark.forEach (function(data) {
				if(data=='1'){
					$scope.chooseCourseRoundManage.mark1 = true;
				}
				if(data=='2'){
					$scope.chooseCourseRoundManage.mark2 = true;
				}
				if(data=='3'){
					$scope.chooseCourseRoundManage.mark3 = true;
				}
				if(data=='4'){
					$scope.chooseCourseRoundManage.mark4 = true;
				}
			});
			$scope.ok = function (form) {
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				var mark = [];
				if($scope.chooseCourseRoundManage.mark1){
					mark.push('1');
				}
				if($scope.chooseCourseRoundManage.mark2){
					mark.push('2');
				}
				if($scope.chooseCourseRoundManage.mark3){
					mark.push('3');
				}
				if($scope.chooseCourseRoundManage.mark4){
					mark.push('4');
				}
				$scope.chooseCourseRoundManage.mark = mark.toString();
				$scope.chooseCourseRoundManage.everyDayStartTime = $filter("date")($scope.chooseCourseRoundManage.startTime, 'hh:mm');
				$scope.chooseCourseRoundManage.everyDayEndTime = $filter("date")($scope.chooseCourseRoundManage.endTime, 'hh:mm');
				$scope.chooseCourseRoundManage.startTime = $filter("date")($scope.chooseCourseRoundManage.startDate, 'yyyy-MM-dd');
				$scope.chooseCourseRoundManage.endTime = $filter("date")($scope.chooseCourseRoundManage.endDate, 'yyyy-MM-dd');
				$rootScope.showLoading = true; // 开启加载提示
				choose_chooseCourseRoundManageService.update($scope.chooseCourseRoundManage, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						$rootScope.showLoading = false; // 关闭加载提示
						return;
					}
					angular.element('#chooseCourseRoundManageTable').bootstrapTable('refresh');
					alertService('success', '操作成功');
					$uibModalInstance.close();
				});
			};
				
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		updateProhibitionListController.$inject = ['$scope', '$uibModalInstance', 'item', 'choose_chooseCourseRoundManageService', 'formVerifyService', '$filter', 'alertService'];

		// 维护范围按钮
		$scope.prohibitionMaintain = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/chooseCourseRoundManage/maintain.html',
				size: 'lg',
				resolve: {
					item: function () {
						return row;
					},
				},
				controller: openMaintainController
			});
		};

		// 维护范围控制器
		var openMaintainController = function ($scope, $uibModalInstance, item, choose_chooseCourseRoundManageService, alertService) {
			var classId = item.id;
			var rangeData = [];
			choose_chooseCourseRoundManageService.get(classId, function (data) {
				console.log(data);
				rangeData = data;
				rangeDate();
			});
			var rangeDate = function () {
				$scope.arrays = rangeData.deptData;
				$scope.arrays2 = rangeData.gradeData;
				$scope.arrays3 = rangeData.majorData;
				$scope.arrays4 = rangeData.classData;
				$scope.arrays5 = rangeData.studentTypeData;
				$scope.arraySeled =rangeData.deptReadRangeData;
				$scope.arraySeled2 =rangeData.gradeReadRangeData;
				$scope.arraySeled3 =rangeData.majorReadRangeData;
				$scope.arraySeled4 =rangeData.classReadRangeData;
				$scope.arraySeled5 =rangeData.studentTypeReadRangeData;
				changeData($scope.arraySeled);
				changeData($scope.arraySeled2);
				changeData($scope.arraySeled3);
				changeData($scope.arraySeled4);
				changeData($scope.arraySeled5);

				function changeData(arraySeled){
					angular.forEach(arraySeled , function(data){
						if(data.selectSign == '1'){
							data.selectSign = true;
						}else{
							data.selectSign = false;
						}
					});
				}
				$scope.selectChildArrays = function(array){
					var remark = angular.element('#selectRemark')[0].value;
					if(remark == "可选"){
						array.selectSign = true;
					}else{
						array.selectSign = false;
					}
					var index = $scope.arrays.indexOf(array);
					$scope.arrays.splice(index,1);
					$scope.arraySeled.push(array);
				};

				$scope.selectedChildArrays = function(array){
					var remark = angular.element('#selectRemark')[0].value;
					var index = $scope.arraySeled.indexOf(array);
					$scope.arraySeled.splice(index,1);
					$scope.arrays.push(array);
				};

				$scope.selectChildArrays2 = function(array){

					var remark = angular.element('#selectRemark2')[0].value;
					if(remark == "可选"){
						array.selectSign = true;
					}else{
						array.selectSign = false;
					}
					var index = $scope.arrays2.indexOf(array);
					$scope.arrays2.splice(index,1);
					$scope.arraySeled2.push(array);
				};

				$scope.selectedChildArrays2 = function(array){
					var remark = angular.element('#selectRemark2')[0].value;
					var index = $scope.arraySeled2.indexOf(array);
					$scope.arraySeled2.splice(index,1);
					$scope.arrays2.push(array);
				};

				$scope.selectChildArrays3 = function(array){

					var remark = angular.element('#selectRemark3')[0].value;
					if(remark == "可选"){
						array.selectSign = true;
					}else{
						array.selectSign = false;
					}
					var index = $scope.arrays3.indexOf(array);
					$scope.arrays3.splice(index,1);
					$scope.arraySeled3.push(array);
				};

				$scope.selectedChildArrays3 = function(array){
					var remark = angular.element('#selectRemark3')[0].value;
					var index = $scope.arraySeled3.indexOf(array);
					$scope.arraySeled3.splice(index,1);
					$scope.arrays3.push(array);
				};

				$scope.selectChildArrays4 = function(array){

					var remark = angular.element('#selectRemark4')[0].value;
					if(remark == "可选"){
						array.selectSign = true;
					}else{
						array.selectSign = false;
					}
					var index = $scope.arrays4.indexOf(array);
					$scope.arrays4.splice(index,1);
					$scope.arraySeled4.push(array);
				};

				$scope.selectedChildArrays4 = function(array){
					var remark = angular.element('#selectRemark4')[0].value;
					var index = $scope.arraySeled4.indexOf(array);
					$scope.arraySeled4.splice(index,1);
					$scope.arrays4.push(array);
				};

				$scope.selectChildArrays5 = function(array){

					var remark = angular.element('#selectRemark5')[0].value;
					if(remark == "可选"){
						array.selectSign = true;
					}else{
						array.selectSign = false;
					}
					var index = $scope.arrays5.indexOf(array);
					$scope.arrays5.splice(index,1);
					$scope.arraySeled5.push(array);
				};

				$scope.selectedChildArrays5 = function(array){
					var remark = angular.element('#selectRemark5')[0].value;
					var index = $scope.arraySeled5.indexOf(array);
					$scope.arraySeled5.splice(index,1);
					$scope.arrays5.push(array);
				};

				$scope.ok = function (form) {
					// 处理前验证
					if(form.$invalid) {
						// 调用共用服务验证（效果：验证不通过的输入框会变红色）
						formVerifyService(form);
						return;
					};
					var arraySeled = [] ;
					angular.forEach($scope.arraySeled , function(data){
						data.rangeType = '1';
						data.val = data.id;
						arraySeled.push(data);
					});
					angular.forEach($scope.arraySeled2 , function(data){
						data.rangeType = '2';
						data.val = data.id;
						arraySeled.push(data);
					});
					angular.forEach($scope.arraySeled3 , function(data){
						data.rangeType = '3';
						data.val = data.id;
						arraySeled.push(data);
					});
					angular.forEach($scope.arraySeled4 , function(data){
						data.rangeType = '4';
						data.val = data.id;
						arraySeled.push(data);
					});
					angular.forEach($scope.arraySeled5 , function(data){
						data.rangeType = '5';
						data.val = data.id;
						arraySeled.push(data);
					});
					console.log(arraySeled);
					choose_chooseCourseRoundManageService.updateRange(classId, arraySeled, function (error, message) {
						if (error) {
							alertService(message);
							return;
						}
						$uibModalInstance.close();
						// angular.element('#electiveCourseTable').bootstrapTable('refresh');
						alertService('success', '修改成功');
					});
				};
			};
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
		};
		openMaintainController.$inject = ['$scope', '$uibModalInstance', 'item', 'choose_chooseCourseRoundManageService', 'alertService'];

        // 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
            angular.element('#chooseCourseRoundManageTable').bootstrapTable('selectPage', 1);
		};
		
        // 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
            angular.element('#chooseCourseRoundManageTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.chooseCourseRoundManage = {};
            // 重新初始化下拉框
            angular.element('form[name="chooseCourseRoundManageForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#chooseCourseRoundManageTable').bootstrapTable('selectPage', 1);
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
			angular.element('#chooseCourseRoundManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	choose_chooseCourseRoundManageController.$inject = ['$scope', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_chooseCourseRoundManageService', 'alertService', 'app'];

})(window);