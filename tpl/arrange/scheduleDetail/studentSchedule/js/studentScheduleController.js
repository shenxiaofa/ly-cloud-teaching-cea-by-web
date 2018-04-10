;(function (window, undefined) {
    'use strict';

	window.arrange_studentScheduleController = function ($scope, $http, $state, $compile, $uibModal, $rootScope, $window, arrange_studentScheduleService, alertService, app) {
		// 表格的高度
        $scope.table_height = $window.innerHeight - 226;
		
        // 性别下拉框数据
        $scope.sexCode = [];
        arrange_studentScheduleService.getSelect('XBM', function (error,message,data) {
            $scope.sexCode = data.data;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="studentSchedule.sexCode" id="sexCode" name="sexCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in sexCode" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#sexCode").parent().empty().append(htmlFirst);
            $compile(angular.element("#sexCode").parent().contents())($scope);
        });
        
        // 获取年级专业下拉框
        $scope.majorId = [];
        arrange_studentScheduleService.getmajorInfo(function (error,message,data) {
            $scope.majorId = data.majorList;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="studentSchedule.majorId" id="majorId" name="majorId" '
                +  ' ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in majorId" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#majorId").parent().empty().append(htmlFirst);
            $compile(angular.element("#majorId").parent().contents())($scope);
        });
        
        // 获取年级专业下拉框
        $scope.classId = [];
        arrange_studentScheduleService.getClassId(function (error,message,data) {
            $scope.classId = data.executiveClassList;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="studentSchedule.classId" id="classId" name="classId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in classId" value="{{a.id}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#classId").parent().empty().append(htmlFirst);
            $compile(angular.element("#classId").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
            	type : 'select',
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.studentSchedule);
	    };
	        
		$scope.studentScheduleTable = {
			url: app.api.address + '/arrange/studentSchedule',
			method: 'get',
			cache: false,
            height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "number", // 指定主键列
            uniqueId: "number", // 每行唯一标识
        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
//			showColumns: true,
//			showRefresh: true,
			onLoadSuccess: function() {
				$compile(angular.element('#studentScheduleTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler: function(data) {
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
        	},
			columns: [{checkbox: true,width: "3%"},
				{  
                    field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#studentScheduleTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "studentName",title: "姓名",align: "center",valign: "middle",width: "10%"},
				{field: "sexName",title: "性别",align: "center",valign: "middle",width: "5%"},
				{field: "majorName",title: "专业",align: "center",valign: "middle",width: "22%"},
				{field: "gradeId",title: "年级",align: "center",valign: "middle",width: "10%"},
				{field: "className",title: "班级",align: "center",valign: "middle",width: "15%"},
				{field: "studentNum",title: "学号",align: "center",valign: "middle",width: "15%"},
				{field: "dunday",title: "操作",align: "center",valign: "middle",width: "10%",
					formatter: function(value, row, index) {
					    var arrangeSetButton = "<button type='button' has-permission='studentSchedule:studentQuery:studentScheduleQuery' ng-click='checkSchedule(" + JSON.stringify(row) + ")'"
					    	+ " class='btn btn-default btn-sm' style='padding: 0px 3px;'>课表查看</button>";
						return arrangeSetButton;
					}
				}
			]
		};
		
		// 课表查看按钮
		$scope.checkSchedule = function(row) {
			var resInfo = "";
			$http.get(app.api.address + '/arrange/teacherSchedule/resID/32798')
                .then(function successCallback(response) {
					var obj = {
						resID : '32798',
						resInfo : response.data.data,
		        		studentId : row.studentId,
		        		studentName : row.studentName
					}
					// 把json数据转换为json字符串
					var params = angular.toJson(obj);
		        	$state.go("home.common.studentScheduleDetail",{
		        		"params" : params
		        	});
                }, function errorCallback(response) {
                }
            );
		};

        // 查询刷新表单
		$scope.searchSubmit = function (form) {
			angular.element('#studentScheduleTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.studentSchedule = {};
            // 重新初始化下拉框
            angular.element('form[name="studentScheduleSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#studentScheduleTable').bootstrapTable('selectPage', 1);
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
			angular.element('#studentScheduleTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	arrange_studentScheduleController.$inject = ['$scope', '$http', '$state', '$compile', '$uibModal', '$rootScope', '$window', 'arrange_studentScheduleService', 'alertService', 'app'];


})(window);
