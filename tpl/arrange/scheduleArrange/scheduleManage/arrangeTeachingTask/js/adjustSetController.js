/**
 * 教学任务安排 已安排时间地点 调整
 */
;(function (window, undefined) {
    'use strict';
	window.arrange_adjustSetController = function ($rootScope, $compile, $scope, $uibModalInstance, arrange_adjustSetService, alertService, app, itemForRoom) {

		$scope.openDeptName = $scope.data.openDeptName;	// 单位名称【从上最开始的页面传递过来】
		
        // 单位 【原本是下拉框，后来改成直接显示出单位名称】
//      $scope.deptId = [];
//      arrange_adjustSetService.getDept(function (error,message,data) {
//          $scope.deptId = data.data;
//          var html = '' +
//              '<select ui-select2 '
//              +  ' ng-model="arrangeTeachingTask.deptId" id="deptId" name="deptId" ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
//              +  '<option value="">==请选择==</option> '
//              +  '<option  ng-repeat="a in deptId" value="{{a.departmentNumber}}">{{a.departmentName}}</option> '
//              +  '</select>';
//          angular.element("#deptId").parent().empty().append(html);
//          $compile(angular.element("#deptId").parent().contents())($scope);
//      });
	    
        // 查询参数
        $scope.queryParams = function (params) {
            var pageParam = {
            	// 除了以下几个条件，还有3个输入框以及1个下拉框的数据
                type : 'selectRoomInfoAdjust',
                semesterId : $scope.data.semesterId,
                startWeek : $scope.data.week,	// 这里的week直接通过startWeek传给后台
                weekDaySectionId : $scope.data.weekDaySectionId,
                deptId : $scope.data.openDeptId,	// 单位Id【从上最开始的页面传递过来】
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.arrangeTeachingTask);
        };

        $scope.arrangeTeachingTaskAdjustSetTable = {
			url: app.api.address + '/arrange/roomTimeDemand',
            method: 'get',
            cache: false,
            height: 392, //使高度贴底部
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
            idField : "number", // 指定主键列
            uniqueId: "number", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            onLoadSuccess: function() {
                $compile(angular.element('#arrangeTeachingTaskAdjustSetTable').contents())($scope);
            },
			responseHandler: function(data) {
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
        	},
            clickToSelect: true,
            columns: [{checkbox: true,width: "5%"},
                {
                    field:'number',title :'序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {
                        var page = angular.element('#arrangeTeachingTaskAdjustSetTable').bootstrapTable("getPage");
                        return page.pageSize * (page.pageNumber - 1) + index + 1;
                    }
                },
                {field:"roomName",title:"教室编号",align:"center",valign:"middle",width:"30%"},
                {field:"deptName",title:"管理单位",align:"center",valign:"middle",width:"40%"},
                {field:"seatNum",title:"座位数",align:"center",valign:"middle",width:"20%"}
            ]
        };

        // 查询提交表单
        $scope.searchSubmit = function (form) {
            angular.element('#arrangeTeachingTaskAdjustSetTable').bootstrapTable('selectPage', 1);
        };

        // 重置表单
        $scope.searchReset = function () {
            $scope.arrangeTeachingTask = {};
            // 重新初始化下拉框
            angular.element('form[name="arrangeTeachingTaskAdjustSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#arrangeTeachingTaskAdjustSetTable').bootstrapTable('selectPage', 1);
        };

        $scope.ok = function () {
			var rows = angular.element('#arrangeTeachingTaskAdjustSetTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择上课地点');
				return;
			}
			if(rows.length >= 2){
				alertService('只能选择一条');
				return;
			}
			
			var updateParams = {
				type : 'updateByPrimaryKey',
				id : $scope.data.id,
				roomId : rows[0].roomId
			};
			
			// 修改操作
			if(updateParams.roomId){
                $rootScope.showLoading = true; // 开启加载提示
				arrange_adjustSetService.update(updateParams, function(error, message){
                    $rootScope.showLoading = false; // 关闭加载提示
					if(error) {
						alertService(message);
						return;
					}else {
						// 不需要刷新任何页面，仅仅添加到总表
						alertService('success', '修改场地成功');
	        			angular.element('#timeRoomAlreadyArrangeTable').bootstrapTable('refresh');
	        			angular.element('#arrangeTeachingTaskAdjustSetTable').bootstrapTable('refresh');
					}
					
				});
			}else{
				alertService('修改场地失败，请选择场地！');
        	}
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };
    };

	arrange_adjustSetController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', 'arrange_adjustSetService', 'alertService', 'app', 'itemForRoom'];

})(window);
