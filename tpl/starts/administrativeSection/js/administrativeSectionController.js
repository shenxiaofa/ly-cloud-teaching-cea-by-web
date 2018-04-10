;(function (window, undefined) {
	'use strict';

	window.starts_administrativeSectionController = function ($compile, $scope, $uibModal, $rootScope, $window, starts_administrativeSectionService, alertService, app) {
		// 模块设置查询对象
		$scope.adminSection = {};
		//tree菜单高度
		$scope.leftTreeStyle = {
			"height": $window.innerHeight-70
		};


		// 树菜单参数设置
		$scope.zTreeOptions = {
			view: {
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			async: {
				enable: true,
				url: app.api.address + '/virtual-class/openPlan',
				type:'get',
				dataFilter: function (treeId, parentNode, responseData) {
					var result = [];
					var array = responseData.data;
					for(var i = 0; i < array.length; i++){
						var perArray = array[i];
						for(var n = 0; n < perArray.length; n++){
							var item = {
								id: i + 1
							};
							if(n == 0){
								item.parentId = 0;
								item.name = perArray[0][0];
								item.type = "xnxq";
							}else{
								item.id = n + 10;
								item.parentId = i + 1;
								item.name = perArray[n][1];
								item.type = perArray[n][0];
							}
							result.push(item);
						}
					}
					return result;
				}
			},
			data: {
				key: {
					url: ""
				},
				simpleData: {
					enable:true,
					idKey: "id",
					pIdKey: "parentId",
					rootPId: ""
				}
			},
			callback: {
				onAsyncSuccess: function (event, treeId, treeNode, msg) {
					// 模拟点击树节点
					var treeObj = $.fn.zTree.getZTreeObj(treeId);
					// 展开根节点
					var nodes = treeObj.getNodes();
					angular.forEach(nodes, function(data, index, array){
						treeObj.expandNode(data, true);
					});
					// 模拟点击第一个根节点
					var node = treeObj.getNodesByFilter(function (node) {
						return node.level == 0;
					}, true);
					if(node){
						angular.element("#"+node.tId+"_a").trigger("click");
					}
				},
				onClick: function(event, treeId, treeNode) {
					var type = treeNode.type;
					var name = treeNode.name;


					if (type == "xnxq") { // 项目课程学年学期
						$scope.adminSection.courseId = "";
						$scope.adminSection.semesterId = treeNode.name;
					} else { // 项目课程名称
						$scope.adminSection.courseId = type;
						$scope.courseId = type;
						// $rootScope.xnxq = treeNode.parentNode.name;
						$rootScope.type = type;
					}
					// 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
					try {
						angular.element('#administrativeSectionTable').bootstrapTable('refresh');
					} catch (e) {}
				}
			}
		};

		// 表格的高度
		$scope.table_height = $window.innerHeight - 223;

		//tree菜单高度
		$scope.leftTree = {
			"border-right":"1px solid #e5e5e5",
			"height": $scope.win_height-100,
			"padding-top":"15px"
		}

		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				sortName: params.sortName,
				sortOrder: params.sortOrder
			};
			return angular.extend(pageParam, $scope.adminSection);
		}
		$scope.administrativeSectionTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#administrativeSectionTable').contents())($scope);
			},
			// url: 'data_test/starts/tableview_adminSection.json',
			url: app.api.address + '/virtual-class/projectClassTime',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'createTime', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field:"id", title:"主键", visible:false},
				{field:"courseName", title:"课程名称", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"collegeName",title:"学院",align:"center",valign:"middle",sortable:true},
				{field:"majorName",title:"专业",align:"center",valign:"middle",sortable:true},
				{field:"executiveClassName",title:"行政班级",align:"center",valign:"middle"},
				{field:"plateName",title:"板块",align:"center",valign:"middle"},
				{field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
				{field:"classTime",title:"上课时间",align:"center",valign:"middle"},
				{field:"",title:"操作",align:"center",valign:"middle",formatter: function (value, row, index) {
					var modeSetting = "<button has-permission='administrativeSection:plateSet'  type='button' ng-click='modeSetting(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>板块安排</button>";
					return modeSetting ;
				}
				}
			]
		};


		
		// 查询表单显示和隐藏切换
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function () {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if ($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 115;
			} else {
				$scope.table_height = $scope.table_height - 115;
			}
			angular.element('#administrativeSectionTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		};
		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#administrativeSectionTable').bootstrapTable('selectPage', 1);
			// angular.element('#administrativeSectionTable').bootstrapTable('refresh');
		};
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.adminSection = {courseId: $scope.adminSection.courseId};
			angular.element('#administrativeSectionTable').bootstrapTable('refresh');
		};
		// 打开批量设置面板
		$scope.openAdd = function(){
			var rows = angular.element('#administrativeSectionTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要设置的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/administrativeSection/add.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
					indexScope:function () {
						return $scope;
					},
				},
				controller: openSetPlateController
			});
		};

		//清除板块
		$scope.openDelete = function(){
			var rows = angular.element('#administrativeSectionTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/administrativeSection/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteController
			});
		};

		//删除
		$scope.openDeleteById = function(){
			var rows = angular.element('#administrativeSectionTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/administrativeSection/delete1.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteByIdController
			});
		};
		
		// 打开方式设置
		$scope.modeSetting = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/administrativeSection/setPlate.html',
				size: 'lg',
				resolve: {
					item: function () {
						return data;
					},indexScope:function () {
						return $scope;
					},
				},
				controller: openModifyController
			});
		};
	};
	starts_administrativeSectionController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'starts_administrativeSectionService', 'alertService', 'app'];

	// 设置板块控制器
	var openSetPlateController = function ($compile,items,$scope,indexScope, $uibModalInstance, $uibModal, starts_administrativeSectionService, formVerifyService, alertService) {
		// 对应板块下拉框数据
		$scope.projectPalateData = [
			{
				id: "",
				name:"==请选择=="
			}
		];
		starts_administrativeSectionService.getProjectPlate(function (error, message, data) {
			for(var i = 0; i < data.length; i++){
				$scope.projectPalateData.push(data[i]);
			}
			var html = '' +
				'<select ng-model="adminSection.plateId"  ng-required="true" id="plateId" name="plateId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in projectPalateData" value="{{date.id}}">{{date.name}}</option>'+
				'</select>';
			angular.element("#plateId").parent().empty().append(html);
			$compile(angular.element("#plateId").parent().contents())($scope);

		});
		$scope.ok = function (form) {
			var adminSectionEntity = {};
			var array = [];// 板块号数组
			$scope.adminSection.semesterId = indexScope.adminSection.semesterId;
			if ($scope.adminSection == undefined || $scope.adminSection.plateId == undefined) {
				$scope.adminSection = {};
				$scope.adminSection.plateId = "";
			};
			adminSectionEntity.plateId = $scope.adminSection.plateId;
			// array.push($scope.adminSection.plateId);
			items.forEach (function(adminSection) {
				var entity = {};
				entity.id = adminSection.id;
				entity.semesterId = adminSection.semesterId;
				entity.courseId = adminSection.courseId;
				entity.executiveClassId = adminSection.executiveClassId;
				array.push(entity);
			});
			adminSectionEntity.list = array;
			starts_administrativeSectionService.setPlate(adminSectionEntity, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#administrativeSectionTable').bootstrapTable('refresh');
				alertService('success', '设置成功');
			});
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openSetPlateController.$inject = ['$compile','items','$scope','indexScope', '$uibModalInstance', '$uibModal', 'starts_administrativeSectionService', 'formVerifyService', 'alertService'];

	//板块设置控制器
	var openModifyController = function ($compile,$scope, $uibModalInstance,indexScope, item, starts_administrativeSectionService, alertService, formVerifyService) {

		// 对应板块下拉框数据
		$scope.projectPalateData = [
			{
				id: "",
				name:"==请选择=="
			}
		];
		starts_administrativeSectionService.getProjectPlate(function (error, message, data) {
			for(var i = 0; i < data.length; i++){
				$scope.projectPalateData.push(data[i]);
			}
			var html = '' +
				'<select ng-model="adminSection.plateId"  ng-required="true" id="plateId" name="plateId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in projectPalateData" value="{{date.id}}">{{date.name}}</option>'+
				'</select>';
			angular.element("#plateId").parent().empty().append(html);
			$compile(angular.element("#plateId").parent().contents())($scope);
		});

		// 数据初始化
		$scope.adminSection = item;
		$scope.adminSection.semesterId = indexScope.adminSection.semesterId;
		$scope.ok = function (form) {
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			$scope.adminSection.plateId = angular.element('#plateId').val();
			starts_administrativeSectionService.update($scope.adminSection, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#administrativeSectionTable').bootstrapTable('refresh');
				alertService('success', '修改成功');
			});
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openModifyController.$inject = ['$compile','$scope', '$uibModalInstance','indexScope', 'item', 'starts_administrativeSectionService', 'alertService', 'formVerifyService'];

	// 清除板块控制器
	var openDeleteController = function ($scope, $uibModalInstance, items, starts_administrativeSectionService, alertService) {
		$scope.message = "确定要清空吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(adminSection) {
				ids.push(adminSection.id);
			});
			starts_administrativeSectionService.delete(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#administrativeSectionTable').bootstrapTable('refresh');
				alertService('success', '清除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};




	};
	openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_administrativeSectionService', 'alertService'];

	//删除控制器
	var openDeleteByIdController = function ($scope, $uibModalInstance, items, starts_administrativeSectionService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(adminSection) {
				ids.push(adminSection.id);
			});
			starts_administrativeSectionService.deleteById(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#administrativeSectionTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDeleteByIdController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_administrativeSectionService', 'alertService'];
})(window);
