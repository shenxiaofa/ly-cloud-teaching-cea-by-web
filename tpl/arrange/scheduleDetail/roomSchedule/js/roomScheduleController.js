;(function (window, undefined) {
    'use strict';

	window.arrange_roomScheduleController = function ($scope, $http, $state, $compile, $uibModal, $rootScope, $window, arrange_roomScheduleService, alertService, app) {
		// 表格的高度
        $scope.table_height = $window.innerHeight - 266;
		
        // 校区下拉框数据
        $scope.campusId = [];
        arrange_roomScheduleService.getCampus(function (error,message,data) {
            $scope.campusId = data.data;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="roomSchedule.campusId" id="campusId" name="campusId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in campusId" value="{{a.campusNumber}}">{{a.campusName}}</option> '
                +  '</select>';
            angular.element("#campusId").parent().empty().append(htmlFirst);
            $compile(angular.element("#campusId").parent().contents())($scope);
        });
        
        // 教学楼下拉框数据
        $scope.teachingBuildingId = [];
        arrange_roomScheduleService.getTeachingBuildingPull(function (error,message,data) {
            $scope.teachingBuildingId = data.data;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="roomSchedule.teachingBuildingId" id="teachingBuildingId" name="teachingBuildingId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in teachingBuildingId" value="{{a.code}}">{{a.name}}</option> '
                +  '</select>';
            angular.element("#teachingBuildingId").parent().empty().append(htmlFirst);
            $compile(angular.element("#teachingBuildingId").parent().contents())($scope);
        });
        
        // 教室类型下拉框数据
        $scope.roomTypeCode = [];
        arrange_roomScheduleService.getSelect('YJXK', function (error,message,data) {
            $scope.roomTypeCode = data.data;
            var htmlFirst = '' +
                '<select ui-select2 '
                +  ' ng-model="roomSchedule.roomTypeCode" id="roomTypeCode" name="roomTypeCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option ng-repeat="a in roomTypeCode" value="{{a.dataNumber}}">{{a.dataName}}</option> '
                +  '</select>';
            angular.element("#roomTypeCode").parent().empty().append(htmlFirst);
            $compile(angular.element("#roomTypeCode").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
            	type : 'select',
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.roomSchedule);
	    };
	        
		$scope.roomScheduleTable = {
			url: app.api.address + '/arrange/roomSchedule',
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
				$compile(angular.element('#roomScheduleTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler: function(data) {
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
        	},
			columns: [
				{  
                    field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#roomScheduleTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "campusName",title: "校区",align: "center",valign: "middle",width: "10%"},
				{field: "teachingBuildingName",title: "教学楼名称",align: "center",valign: "middle",width: "12%",
					formatter: function(value, row, index) {
						if(row.teachingBuildingName !== null){
							return row.teachingBuildingName;
						}else{
							return "";
						}
					}
				},
				{field: "roomNum",title: "教室编号",align: "center",valign: "middle",width: "10%"},
				{field: "roomTypeName",title: "教室类型",align: "center",valign: "middle",width: "12%"},
				{field: "floorNum",title: "所在楼层",align: "center",valign: "middle",width: "5%"},
				{field: "seatNum",title: "座位数",align: "center",valign: "middle",width: "5%"},
				{field: "standardSeatNum",title: "有效座位数",align: "center",valign: "middle",width: "6%"},
				{field: "examSeatNum",title: "考试座位数",align: "center",valign: "middle",width: "6%"},
				{field: "enableSign",title: "是否启用",align: "center",valign: "middle",width: "5%",
					formatter: function(value, row, index) {
						var enableSign = "";
						if(row.enableSign == 0){
							enableSign = "否";
						}if(row.enableSign == 1){
							enableSign = "是";
						}
						return enableSign;
					}
				},
				{field: "dunday",title: "操作",align: "center",valign: "middle",width: "10%",
					formatter: function(value, row, index) {
					    var arrangeSetButton = "<button type='button' has-permission='roomSchedule:scheduleQuery:teacherSchedulequery' ng-click='checkSchedule(" + JSON.stringify(row) + ")'"
					    	+ " class='btn btn-default btn-sm' style='padding: 0px 3px;'>课表查看</button>";
						return arrangeSetButton;
					}
				}
			]
		};
		
		// 课表查看按钮
		$scope.checkSchedule = function(row) {
			var resInfo = "";
			$http.get(app.api.address + '/arrange/teacherSchedule/resID/32795')
                .then(function successCallback(response) {
					var obj = {
						resID : '32795',
						resInfo : response.data.data,
		        		roomNum : row.roomNum,
		        		roomId : row.roomId
					}
					// 把json数据转换为json字符串
					var params = angular.toJson(obj);
		        	$state.go("home.common.roomScheduleDetail",{
		        		"params" : params
		        	});
                }, function errorCallback(response) {
                }
            );
		};

        // 查询刷新表单
		$scope.searchSubmit = function (form) {
			angular.element('#roomScheduleTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.roomSchedule = {};
            // 重新初始化下拉框
            angular.element('form[name="roomScheduleSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#roomScheduleTable').bootstrapTable('selectPage', 1);
        };
        
		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 155;
			} else {
				$scope.table_height = $scope.table_height - 155;
			}
			angular.element('#roomScheduleTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	arrange_roomScheduleController.$inject = ['$scope', '$http', '$state', '$compile', '$uibModal', '$rootScope', '$window', 'arrange_roomScheduleService', 'alertService', 'app'];


})(window);
