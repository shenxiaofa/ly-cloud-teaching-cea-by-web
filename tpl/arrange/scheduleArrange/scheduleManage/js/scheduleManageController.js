;(function (window, undefined) {
    'use strict';

	window.arrange_scheduleManageController = function ($rootScope, $state, $http, $compile, $scope, $uibModal, $window, arrange_scheduleManageService, formVerifyService, app) {
		
		$scope.scheduleManage = {};
		
		// 表格的高度
        $scope.table_height = $window.innerHeight - 226;
		
	    // 获取到当前的学年学期Id
	    var tempSemesterId = "";
	    
		// 获取翻页一页条数以及第几页
		var pageSize = 0;
		var pageNumber = 0;
		
        // 单位
        $scope.openDeptId = [];
        arrange_scheduleManageService.getDept(function (error,message,data) {
            $scope.openDeptId = data.data;
            var html = '' +
                '<select ui-select2 '
                +  ' ng-model="scheduleManage.openDeptId" id="openDeptId" name="openDeptId" ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in openDeptId" value="{{a.departmentNumber}}">{{a.departmentName}}</option> '
                +  '</select>';
            angular.element("#openDeptId").parent().empty().append(html);
            $compile(angular.element("#openDeptId").parent().contents())($scope);
        });
	    
        // 课程属性下拉框数据
        $scope.coursePropertyNum = [];
        arrange_scheduleManageService.getCourseProperty('KCSXDM', function (error,message,data) {
            $scope.coursePropertyNum = data.data;
            var htmlFirst = '' 
                +  '<select ui-select2 '
                +  ' ng-model="scheduleManage.coursePropertyNum" id="coursePropertyNum" name="coursePropertyNum" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in coursePropertyNum" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#coursePropertyNum").parent().empty().append(htmlFirst);
            $compile(angular.element("#coursePropertyNum").parent().contents())($scope);
        });
        
        // 查询提交表单
		$scope.searchSubmit = function (form) {
			// 处理前验证input输入框
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			angular.element('#scheduleManageTable').bootstrapTable('selectPage', 1);
		};

        // 重置表单
		$scope.searchReset = function (form) {
            $scope.scheduleManage = {
            	semesterId : $scope.scheduleManage.semesterId	// 即便重置了，也还是从当前的学期Id查出来
            };
            // 重新初始化下拉框
            angular.element('form[name="scheduleManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
			angular.element('#scheduleManageTable').bootstrapTable('selectPage', 1);
		};
		
		// 获取学期Id 把table包起来 一定要获取到tempSemesterId
        arrange_scheduleManageService.getCurrentSemesterId(function (error,message,data) {
			$scope.scheduleManage.semesterId = data.data.rows[0].semesterId;
			tempSemesterId = data.data.rows[0].semesterId;
		});

		// 加载index对应的table
		$scope.queryParams = function queryParams(params) {
			pageSize = params.pageSize;
			pageNumber = params.pageNumber;
			var attributeNamesForOrderBy = {};
			attributeNamesForOrderBy[params.sortName] = params.sortOrder;
			var pageParam = {
				courseName : $scope.scheduleManage.courseName,
				openDeptId : $scope.scheduleManage.openDeptId,
				coursePropertyNum : $scope.scheduleManage.coursePropertyNum,
				courseId : $scope.scheduleManage.courseId,
				semesterId : tempSemesterId,
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				attributeNamesForOrderBy: attributeNamesForOrderBy
			};
			return angular.extend(pageParam, $scope.scheduleManage);
		};

		$scope.scheduleManageTable = {
			url: app.api.address + '/arrange/scheduleManage',
			method: 'get',
			cache: false,
			height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50],
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'courseName', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#scheduleManageTable').contents())($scope);
			},
			responseHandler: function(data) {
				return {
					"total": data.data.total,//总页数
					"rows": data.data.rows   //数据
				};
			},
			columns: [
				{field:"courseName",title:"课程名称",align:"center",valign:"middle",width:"20%"},
				{field:"courseId",title:"课程号",align:"center",valign:"middle",width:"10%"},
				{field:"openDeptName",title:"开课单位",align:"center",valign:"middle",width:"20%"},
				{field:"coursePropertyName",title:"课程属性",align:"center",valign:"middle",width:"10%"},
				{field:"credit",title:"学分",align:"center",valign:"middle",width:"10%"},
				{field:"totalHour",title:"学时",align:"center",valign:"middle",width:"10%"},
				{field:"notArrangeAndTotal",title:"教学任务数(未排/全部)",align:"center",valign:"middle",width:"10%"},
				{title:"操作",align:"center",valign:"middle",width:"10%",
					formatter: function(value, row, index) {
						var arrangeBtn = "<button id='btn_apjxrw' type='button' ng-click='arrangeSet(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>安排教学任务</button>";
						return arrangeBtn;
					}
				}
			]
		};

		// 跳转URL 并把需要的参数传给下一个页面
		$scope.arrangeSet = function(row) {
			var obj = {
				// 通过id能够找到对应的id并显示成蓝色
				id : row.id,
				// 三个为了右边的表查询
				way : row.way,
				courseId : row.courseId,
				semesterId : row.semesterId,
				// 四个为了右边表点出来的数据显示
				openDeptId : row.openDeptId,
				courseName : row.courseName,
				openDeptName : row.openDeptName,
				credit : row.credit,
				totalHour : row.totalHour,
				coursePropertyName : row.coursePropertyName,
				// 分页参数
				pageSize: pageSize,
				pageNumber: pageNumber
			}
			// 把json数据转换为json字符串
			var params = angular.toJson(obj);
			$state.go("home.common.arrangeTeachingTask",{
				"params" : params
			});
		};
        
		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 115;
			} else {
				$scope.table_height = $scope.table_height - 115;
			}
			angular.element('#scheduleManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	arrange_scheduleManageController.$inject = ['$rootScope', '$state', '$http', '$compile', '$scope', '$uibModal', '$window', 'arrange_scheduleManageService', 'formVerifyService', 'app'];


})(window);
