/**
 * 教学任务安排 已安排时间地点 选择上课地点
 */
;(function (window, undefined) {
    'use strict';
	window.arrange_chooseRoomController = function ($compile, $scope, $uibModalInstance, arrange_chooseRoomService, alertService, app, itemForRoom) {

        // 单位
        $scope.deptId = [];
        arrange_chooseRoomService.getDept(function (error,message,data) {
            $scope.deptId = data.data;
            var html = '' +
                '<select ui-select2 '
                +  ' ng-model="arrangeTeachingTask.deptId" id="deptId" name="deptId" ui-options="{search_contains: true}" ui-jq="chosen" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="a in deptId" value="{{a.departmentNumber}}">{{a.departmentName}}</option> '
                +  '</select>';
            angular.element("#deptId").parent().empty().append(html);
            $compile(angular.element("#deptId").parent().contents())($scope);
        });
	    
        // 查询参数
        $scope.queryParams = function (params) {
            var pageParam = {
                type : 'selectRoomInfo',
                semesterId : $scope.data.semesterId,
                roomId : $scope.data.roomId,	// 该roomId为空
                startWeek : $scope.data.startWeek,
                endWeek : $scope.data.endWeek,
                oddEvenWeek : $scope.data.oddEvenWeek,
                weekDaySectionId : $scope.data.weekDaySectionId,
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.arrangeTeachingTask);
        };

        $scope.arrangeTeachingChooseRoomSetTable = {
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
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            onLoadSuccess: function() {
                $compile(angular.element('#arrangeTeachingChooseRoomSetTable').contents())($scope);
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
                        var page = angular.element('#arrangeTeachingChooseRoomSetTable').bootstrapTable("getPage");
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
            angular.element('#arrangeTeachingChooseRoomSetTable').bootstrapTable('selectPage', 1);
        };

        // 重置表单
        $scope.searchReset = function (form) {
            $scope.arrangeTeachingTask = {};
            // 重新初始化下拉框
            angular.element('form[name="arrangeTeachingTaskChooseRoomSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#arrangeTeachingChooseRoomSetTable').bootstrapTable('selectPage', 1);
        };

        $scope.ok = function () {
			var rows = angular.element('#arrangeTeachingChooseRoomSetTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择上课地点');
				return;
			}
			if(rows.length > 1){
				alertService('只能选择一条');
				return;
			}
			itemForRoom.roomId = rows[0].roomId;	// 传值给上一个controller
			itemForRoom.roomName = rows[0].roomName;	// 传值给上一个controller
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };
    };

	arrange_chooseRoomController.$inject = ['$compile', '$scope', '$uibModalInstance', 'arrange_chooseRoomService', 'alertService', 'app', 'itemForRoom'];

})(window);
