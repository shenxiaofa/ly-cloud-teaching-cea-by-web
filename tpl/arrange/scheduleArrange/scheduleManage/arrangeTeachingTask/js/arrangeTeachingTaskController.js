;
(function(window, undefined) {
	'use strict';

	window.arrange_arrangeTeachingTaskController = function($timeout, $state, $stateParams, $compile, $scope, $uibModal, $rootScope, $window, arrange_arrangeTeachingTaskService, app) {
		
		// 表格的高度
		$scope.table_height = $window.innerHeight - 236;
		$scope.table_left_height = $window.innerHeight - 125;
		
		$scope.changeRowCssIsClick = false;	// 检测是否点击了左边的行
		$scope.tempId = "";	// 获取到当前的Id，作用：点击后能够锁定到该行的Id
		
		$scope.topOfTable = {};	// 右侧表格上面展示的数据
		
		// 将传过来的json字符串转换为json格式数据
		var stateParams = JSON.parse($stateParams.params);
		
		// 定义8个参数
		var way = "";
		var courseId = "";
		var semesterId = "";
		var courseName = "";
		var openDeptId = "";
		var openDeptName = "";
		var credit = "";
		var totalHour = "";
		var courseDeptId = "";
		var notArrangeNum = "";
		
		//tree菜单高度
		$scope.leftTree = {
			"border-right": "1px solid #e5e5e5",
			"height": $window.innerHeight - 105,
			"padding-top": "15px"
		};

        // 查询参数 全查出来 并没有针对三个参数做处理
        $scope.queryParams = function (params) {
            var attributeNamesForOrderBy = {};
            attributeNamesForOrderBy[params.sortName] = params.sortOrder;
            var pageParam = {
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber,  //页码
                attributeNamesForOrderBy: attributeNamesForOrderBy
            };
            return angular.extend(pageParam, $scope.arrangeTeachingTask);
        };

		/* start 页面左边数据 */
		$scope.courseArrangeLeftTable = {
			url: app.api.address + '/arrange/scheduleManage',
			method: 'get',
			cache: false,
			height: $scope.table_left_height,
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
            formatRecordsPerPage : function (a) {
                return '';
            },
            formatShowingRows : function (a,b,c) {
                return '';
            },
			pageSize: stateParams.pageSize,
			pageNumber: stateParams.pageNumber,
			pageList: [5, 10, 20, 50],
            sortName: 'courseName', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			onClickRow: function (row, tr) {
			},
			onLoadSuccess: function() {
				// 强制让局部的padding为0，为了让点击的区域变大
				$(".changeRowCss").parent().css("padding","0");
				$compile(angular.element('#courseArrangeLeftTable').contents())($scope);
				// 传初始化的三个值，为了点击过来，通过3个参数，显示对应的条目的信息
		        way = stateParams.way;
				courseId = stateParams.courseId;
				semesterId = stateParams.semesterId;
				// 展示在右侧table上面的几个参数
				$scope.topOfTable.courseId = stateParams.courseId;			// 课程编号
				$scope.topOfTable.courseName = stateParams.courseName;		// 课程名称
				$scope.topOfTable.coursePropertyName = stateParams.coursePropertyName;		// 课程属性
				$scope.topOfTable.credit = stateParams.credit;				// 学分
				$scope.topOfTable.openDeptName = stateParams.openDeptName;	// 开课单位
				if(document.getElementById(stateParams.id) !== null){	// 分页时候，没有找到该页面下的id时候，过滤一下
					// 没有点击changeRowCss()的情况  初始化时候，通过上一个的Id传过来，找到Id并让该行显示为蓝色
					if($scope.changeRowCssIsClick == false){	
						document.getElementById(stateParams.id).parentNode.parentNode.style.backgroundColor = "#2DB7F5";
					}
					// 点击了changeRowCss()的情况  从点击的行中获取到id并让该行显示为蓝色
					else{
						if(document.getElementById($scope.tempId) !== null){	// 分页时候，没有找到该页面下的id时候，过滤一下
							document.getElementById($scope.tempId).parentNode.parentNode.style.backgroundColor = "#2DB7F5";
						}
					}
					angular.element('#courseArrangeTable').bootstrapTable('selectPage', 1);
				}
			},
			responseHandler: function(data) {
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
        	},
			columns: [
				{field: "courseId",title: "课程号",align: "center",valign: "middle",width:"10%",
					formatter: function(value, row, index) {
						var tempId = row.id;
						row.courseId = row.courseId ? row.courseId : "";
						return '<div class="changeRowCss" ng-click=\'changeRowCss('+ angular.toJson(row) +')\' id='+tempId+'>' + row.courseId + '</div>';
					}
				},
				{field: "courseName",title: "课程名称",align: "center",valign: "middle",width:"45%",
							formatter: function(value, row, index) {
								var tempId = row.id;
                                row.courseName = row.courseName ? row.courseName : "";
								return '<div class="changeRowCss" ng-click=\'changeRowCss('+ angular.toJson(row) +')\' id='+tempId+'>' + row.courseName + '</div>';
							}
				},
				{field: "coursePropertyName",title: "课程属性",align: "center",valign: "middle",width:"25%",visible: false,
							formatter: function(value, row, index) {
								var tempId = row.id;
                                row.coursePropertyName = row.coursePropertyName ? row.coursePropertyName : "";
								return '<div class="changeRowCss" ng-click=\'changeRowCss('+ angular.toJson(row) +')\' id='+tempId+'>' + row.coursePropertyName + '</div>';
							}
				},
				{field: "credit",title: "学分",align: "center",valign: "middle",width:"20%",visible: false,
							formatter: function(value, row, index) {
								var tempId = row.id;
                                row.credit = row.credit ? row.credit : "";
								return '<div class="changeRowCss" ng-click=\'changeRowCss('+ angular.toJson(row) +')\' id='+tempId+'>' + row.credit + '</div>';
							}
				}
			]
		};
		/* end 页面左边数据 */
		
		// 触发事件，点击当前行背景变为蓝色，其他行背景为空
		$scope.changeRowCss = function(row){
			$scope.changeRowCssIsClick = true;
	        // 获取3个参数
	        way = row.way;
			courseId = row.courseId;
			semesterId = row.semesterId;
    		// 四个为了右边表点出来的数据显示【第五个的单位Id是为了在筛选场地的时候能用上】
    		courseName = row.courseName;
    		openDeptId = row.openDeptId;
    		openDeptName = row.openDeptName;	// 后来改为courseDeptName >> openDeptName
    		credit = row.credit;
    		totalHour = row.totalHour;
    		// 单独获取 作为弹出窗作的查询参数
    		courseDeptId = row.courseDeptId;
			notArrangeNum = row.notArrangeNum;
			// 展示在右侧table上面的几个参数
			$scope.topOfTable.courseId = row.courseId;			// 课程编号
			$scope.topOfTable.courseName = row.courseName;		// 课程名称
			$scope.topOfTable.coursePropertyName = row.coursePropertyName;		// 课程属性
			$scope.topOfTable.credit = row.credit;				// 学分
			$scope.topOfTable.openDeptName = row.openDeptName;	// 开课单位
			var tableObj = document.getElementById("courseArrangeLeftTable");	// 获取到当前表格
			for (var i = 0; i < tableObj.rows.length; i++) {    // 遍历Table的所有Row
				tableObj.rows[i].style.backgroundColor = "";	// 其他行背景变为空
		    }
			document.getElementById(row.id).parentNode.parentNode.style.backgroundColor = "#2DB7F5";	// 点击的当前行变为蓝色
			// 刷新，让右侧的table显示对应的数据
			angular.element('#courseArrangeTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询参数
        $scope.queryParamsForArrangeTeachingTask = function (params) {
        	if($scope.changeRowCssIsClick == false){	// 未点击
	            var pageParam = {
	            	// 以下3个参数对应的是上个页面传来的值
	            	way : stateParams.way,
	            	courseId : stateParams.courseId,
	            	semesterId : stateParams.semesterId,
	                pageSize : params.pageSize,   //页面大小
	                pageNo : params.pageNumber  //页码
	            };
        	}else{	// 已点击
	            var pageParam = {
	            	// 以下3个参数对应的是点击左侧栏对应的值
	            	way : way,
	            	courseId : courseId,
	            	semesterId : semesterId,
	                pageSize : params.pageSize,   //页面大小
	                pageNo : params.pageNumber  //页码
	            };
        	}
            return angular.extend(pageParam, $scope.arrangeTeachingTask);
        };

		/* start 页面右侧数据 */
		$scope.courseArrangeTable = {
			url: app.api.address + '/arrange/arrangeTeachingTask',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50],
			search: false,
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'courseName', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParamsForArrangeTeachingTask,//传递参数（*）
//			showColumns: true,
//			showRefresh: true,
			responseHandler: function(response) {
				return response.data;
			},
			onLoadSuccess: function() {
				$compile(angular.element('#courseArrangeTable').contents())($scope);
			},
			clickToSelect: true,
			columns: [
				{field: "exeClassName",title: "行政班",align: "center",valign: "middle",width:"15%",
					formatter: function(value, row, index) {
						if(row.exeClassName == null){
							return "";
						}
						return row.exeClassName;
					}
				},
				{field: "className",title: "教学班",align: "center",valign: "middle",width:"15%"},
				{field: "totalNum",title: "学时",align: "center",valign: "middle",width:"10%"},
				{field: "teacherArrange",title: "教师安排情况",align: "center",valign: "middle",width:"10%",
					formatter: function(value, row, index) {
						var teacherArrange = "";
						if(row.teacherArrange == 1){
							teacherArrange = "未安排";
						}if(row.teacherArrange == 2){
							teacherArrange = "部分已安排";
						}if(row.teacherArrange == 3){
							teacherArrange = "全部已安排";
						}
						return teacherArrange;
					}
				},
				{field: "roomArrange",title: "地点安排情况",align: "center",valign: "middle",width:"10%",
					formatter: function(value, row, index) {
						var roomArrange = "";
						if(row.roomArrange == 1){
							roomArrange = "未安排";
						}if(row.roomArrange == 2){
							roomArrange = "部分已安排";
						}if(row.roomArrange == 3){
							roomArrange = "全部已安排";
						}
						return roomArrange;
					}
				},
				{field: "highestCount",title: "上课容量",align: "center",valign: "middle",width:"10%"},
				{field: "notArrangeNum",title: "未排学时",align: "center",valign: "middle",width:"10%"},
				{title: "操作",align: "center",valign: "middle",width: "10%",
					formatter: function(value, row, index) {
						// 没有点击changeRowCss()的情况,从上个页面获取
						if($scope.changeRowCssIsClick == false){	
				        	row.way = stateParams.way;
							row.courseId = stateParams.courseId;
							row.semesterId = stateParams.semesterId;
							row.courseDeptId = stateParams.courseDeptId;// 作为弹出窗作的查询参数
				    		row.courseName = stateParams.courseName;
				    		row.openDeptId = stateParams.openDeptId;
				    		row.openDeptName = stateParams.openDeptName;
				    		row.credit = stateParams.credit;
				    		row.totalHour = stateParams.totalHour;
						}
						// 点击了changeRowCss()的情况，从当前点击里面获取
						else{
				        	row.way = way;
							row.courseId = courseId;
							row.semesterId = semesterId;
							row.courseDeptId = courseDeptId;// 作为弹出窗作的查询参数
				    		row.courseName = courseName;
				    		row.openDeptId = openDeptId;
				    		row.openDeptName = openDeptName;
				    		row.credit = credit;
				    		row.totalHour = totalHour;
						}
						row.id = row.id;// 本id为本id
				    	$scope.tempId = row.id;	// 将id传给临时id  用于改变颜色
						
						var arrangeBtn;
						if(row.totalNum == row.notArrangeNum){	// 未安排
							arrangeBtn = "<button id='btn_fzrsz' has-permission='scheduleManage:query' type='button' ng-click='arrangeSet(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 16px;'>安排</button>";
						}else{									// 已安排
							arrangeBtn = "<button id='btn_fzrsz' has-permission='scheduleManage:query' type='button' ng-click='arrangeSet(" + JSON.stringify(row) + ")' class='btn btn-success btn-sm' style='padding: 0px 16px;'>安排</button>";
						}
						return arrangeBtn;
					}
				}
			]
		};
		/* end 页面右侧数据 */

		// 打开安排面板
		$scope.arrangeSet = function(row) {
            $uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/arrange/scheduleArrange/scheduleManage/arrangeTeachingTask/arrangeSet.html',
				size: 'lg',
				resolve: {
					item: function() {
						return row;
					}
				},
				controller: arrange_arrangeSetController
			});
		};
		
        // 查询提交表单
		$scope.searchSubmit = function (form) { 
			angular.element('#courseArrangeTable').bootstrapTable('selectPage', 1);
		};

        // 重置表单
		$scope.searchReset = function (form) {
            $scope.arrangeTeachingTask = {};
            // 重新初始化下拉框 
            angular.element('form[name="arrangeTeachingTaskSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
			angular.element('#courseArrangeTable').bootstrapTable('selectPage', 1);
		};

		// 查询表单显示和隐藏切换
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 86;
			} else {
				$scope.table_height = $scope.table_height - 86;
			}
			angular.element('#courseArrangeTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};

		// 跳转URL
		$scope.goBack = function() {
        	$state.go("home.common.scheduleManage");
		};

        $timeout(function () {
            $(".pagination-detail").hide();
        }, 200);
		
	};
    arrange_arrangeTeachingTaskController.$inject = ['$timeout', '$state', '$stateParams', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'arrange_arrangeTeachingTaskService', 'app'];

})(window);