;
(function(window, undefined) {
	'use strict';

	window.arrange_roomTimeDemandController = function($scope, $http, $state, $uibModal, $compile, $rootScope, $window, arrange_roomTimeDemandService, alertService, app) {
		
		$scope.roomTimeDemand = {};
		
		// 表格的高度
        $scope.table_height = $window.innerHeight - 186;
        $scope.emptyDataIsExist = true;	// 检测清空部分的数据是否存在
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在

        // 传3个参数给后台，获取到教师时间要求以及显示学年学期
	    var roomIdTemp = "";
	    var semesterIdTemp = "";
	    var semesterNameTemp = "";
	
	    // 获取到当前的学年学期Id
	    var tempSemesterId = "";
	    
        // 基础资源获取学年学期Id
        $scope.semesterId = [];
        arrange_roomTimeDemandService.getSemesterId(function (error,message,data) {
            $scope.semesterId = data.data;
            var html = '' 
            	+  '<select ui-select2 '
                +  ' ng-model="roomTimeDemand.semesterId" id="semesterId" name="semesterId" '
                +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
                +  '<option value="">==请选择==</option> '
                +  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
	    
		// 获取当前的学年学期
        arrange_roomTimeDemandService.getCurrentSemesterId(function (error,message,data) {
      		// 由于双向绑定有些慢，所以通过下面的变量tempSemesterId获取结果并作为需要请求的值
			$scope.roomTimeDemand.semesterId = data.data.rows[0].semesterId;
			tempSemesterId = data.data.rows[0].semesterId;
			loadRoomTimeDemandTable(tempSemesterId);
        });
		
        var loadRoomTimeDemandTable = function(tempSemesterId){
			// 查询参数
	        $scope.queryParams = function queryParams(params) {
	            var pageParam = {
	            	type : 'select',
	            	roomNum : $scope.roomTimeDemand.roomNum,
	            	semesterId : tempSemesterId,	// 通过请求后的当前Id获取到
	            	arrangeEnableSign : $scope.roomTimeDemand.arrangeEnableSign,
	                pageSize: params.pageSize,   //页面大小
	                pageNo: params.pageNumber  //页码
	            };
	            return angular.extend(pageParam, $scope.roomTimeDemand);
	        };
		    
			$scope.roomTimeDemandTable = {
				url: app.api.address + '/arrange/roomTimeDemand',
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
	            idField : "number", // 指定主键列
	            uniqueId: "number", // 每行唯一标识
	        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
				queryParams: $scope.queryParams,//传递参数（*）
				search: false,
				showColumns: true,
				showRefresh: true,
				onLoadSuccess: function() {
					$compile(angular.element('#roomTimeDemandTable').contents())($scope);
				},
				responseHandler: function(data) {
					// 若传回来的数据不为空
	            	if(data.data.rows.length !== 0){
	            		$scope.emptyDataIsExist = true;
	            	}
	            	// 若传回来的数据为空，则清空时显示“当前没数据可清空”
	            	if(data.data.rows.length == 0){
	            		$scope.emptyDataIsExist = false;
	            	}
	                return {
	                    "total": data.data.total,//总页数
	                    "rows": data.data.rows   //数据
	                };
	        	},
				clickToSelect: true,
				columns: [{checkbox: true,width: "3%"},
					{  
	                    field : 'number',title : '序号',align:"center",valign:"middle",width:"5%",
	                    formatter : function(value, row, index) {  
	                        var page = angular.element('#roomTimeDemandTable').bootstrapTable("getPage");  
	                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
	                    }  
	                },
					{field: "semesterName",title: "学年学期",align: "center",valign: "middle",width: "25%"},
					{field: "roomNum",title: "教室编号",align: "center",valign: "middle",width: "50%"},
					{field: "arrangeEnableSign",title: "是否设置要求",align: "center",valign: "middle",width: "15%"},
					{title: "操作",align: "center",valign: "middle",width: "5%",
						formatter: function(value, row, index) {
						    var arrangeSetButton = "<button type='button' has-permission='roomTimeDemand:demandSet' ng-click='demandSetting(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>要求设置</button>";
							return arrangeSetButton;
						}
					}
				]
			};
			
	        // 若当前学年学期不为空，则加载出表格
	        if (tempSemesterId !== null) {
	            var html = '' +
	                '<div id="toolbar" class="btn-group">' +
	                '<div>' +
	                '<button type="button" class="btn btn-default " has-permission="roomTimeDemand:delete" ng-click="openEmpty()">' +
	                '<span class="fa fa-trash-o toolbar-btn-icon" ></span>清空要求' +
	                '</button>' +
	                '</div>' +
	                '</div>' +
	                '<table id="roomTimeDemandTable" ui-jq="bootstrapTable" ui-options="roomTimeDemandTable" class="table table-responsive"></table>';
	            
				setTimeout(function() {
		            angular.element("#roomTimeDemandTableDiv").empty().append(html);
		            $compile(angular.element("#roomTimeDemandTableDiv").contents())($scope);
		        }, 100);
	        }
        }

		// 要求设置按钮
		$scope.demandSetting = function(row) {
		    roomIdTemp = row.roomId;
		    semesterIdTemp = row.semesterId;
	    	semesterNameTemp = row.semesterName;
			// 跳转URL 并把需要的参数传给下一个页面
			var obj = {
				roomId : row.roomId,
				semesterId : row.semesterId,
				semesterName : row.semesterName
			}
			// 把json数据转换为json字符串
			var params = angular.toJson(obj);
			$state.go("home.common.roomTimeSet",{
				"params" : params
			});
		};

		// 打开清空面板 id为场地Id 删除的是“教师时间要求表的Id”
		$scope.openEmpty = function(){
			var rows = angular.element('#roomTimeDemandTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				if($scope.emptyDataIsExist == true){
					alertService('请先选择要清空的项!');
				}
				if($scope.emptyDataIsExist == false){
					alertService('当前没数据可清空!');
				}
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/arrange/demandSetting/roomTimeDemand/empty.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openEmptyController
			});
		};
		
		// 清空控制器
		var openEmptyController = function ($rootScope, $scope, $uibModalInstance, items, arrange_roomTimeDemandService, alertService) {
			$scope.message = "确定要清空吗？";
			$scope.ok = function () {
				var roomTimeDemandForEmpty = "";
				for(var i=0; i < items.length; i++){
					roomTimeDemandForEmpty += items[i].semesterId + "," + items[i].roomId + "&";
				}
				roomTimeDemandForEmpty = roomTimeDemandForEmpty.substring(0, roomTimeDemandForEmpty.length-1);
				$rootScope.showLoading = true; // 开启加载提示
				arrange_roomTimeDemandService.empty(roomTimeDemandForEmpty, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#roomTimeDemandTable').bootstrapTable('selectPage', 1);
					angular.element('#roomTimeDemandSettingTable').bootstrapTable('selectPage', 1);
					alertService('success', '清空成功');
				});
				$uibModalInstance.close();
			};
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		openEmptyController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'items', 'arrange_roomTimeDemandService', 'alertService'];

        // 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
			loadRoomTimeDemandTable(tempSemesterId);
		};

        // 查询表单重置
        $scope.searchReset = function () {
            $scope.roomTimeDemand = {};
            // 重新初始化下拉框
            angular.element('form[name="roomTimeDemandSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#roomTimeDemandTable').bootstrapTable('selectPage', 1);
        };
		
		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 75;
			} else {
				$scope.table_height = $scope.table_height - 75;
			}
			angular.element('#roomTimeDemandTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	arrange_roomTimeDemandController.$inject = ['$scope', '$http', '$state', '$uibModal', '$compile', '$rootScope', '$window', 'arrange_roomTimeDemandService', 'alertService', 'app'];

})(window);