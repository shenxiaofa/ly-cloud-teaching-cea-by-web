;(function (window, undefined) {
	'use strict';

	window.starts_teachingClassController = function ($compile, $scope, $uibModal, $rootScope, $window, starts_teachingClassService, alertService, app) {
		// 模块设置查询对象
		$scope.teachingClass = {};
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
						$scope.teachingClass.courseId = "";
					} else { // 项目课程名称
						$scope.teachingClass.courseId = type;
						// $rootScope.xnxq = treeNode.parentNode.name;
						$rootScope.type = type;
						$rootScope.name = name;
					}
					// 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
					try {
						angular.element('#projectTeachingClassTable').bootstrapTable('refresh');
					} catch (e) {}
				}
			}
		};

		// 表格的高度
		$scope.table_height = $window.innerHeight - 184;

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
			return angular.extend(pageParam, $scope.teachingClass);
		}
		$scope.projectTeachingClassTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#projectTeachingClassTable').contents())($scope);
			},
			// url: 'data_test/starts/tableview_projectTeaching.json',
			url: app.api.address + '/virtual-class/projectTeachingTask',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			width: 1000,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [5,10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'projectNum', // 默认排序字段
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
				{checkbox: true, width: "4%"},
				{field:"id", title:"主键", visible:false},
				{field:"executiveClassId", title:"对应行政班Id", visible:false},
				{field:"courseId", title:"课程Id", visible:false},
				{field:"semesterId", title:"学期Id", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"projectNum",title:"项目号",align:"center",valign:"middle"},
				{field:"projectName",title:"项目名称",align:"center",valign:"middle"},
				{field:"num",title:"教学班号",align:"center",valign:"middle",width: "20%"},
				{field:"name",title:"教学班名称",align:"center",valign:"middle",width: "20%"},
				{field:"lowestCount",title:"最低开班人数",align:"center",valign:"middle"},
				{field:"highestCount",title:"最高容纳人数",align:"center",valign:"middle"},
				{field:"executiveClassName",title:"对应行政班",align:"center",valign:"middle"},
				{field:"plateName",title:"板块名称",align:"center",valign:"middle"},
				{field:"classTime",title:"上课时间",align:"center",valign:"middle"},
				{field:"",title:"操作",align:"center",valign:"middle", width: "20%", formatter: function (value, row, index) {
					var openModify = "<button has-permission='projectTeachingClass:update' type='button' ng-click='openModify(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
					var classList = "<button has-permission='projectTeachingClass:classListSet' type='button' ng-click='classList(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>班级名单</button>";
					return openModify + "&nbsp;" + classList;
				}
				}
			]
		};



		// 查询表单显示和隐藏切换
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function () {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if ($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 75;
			} else {
				$scope.table_height = $scope.table_height - 75;
			}
			angular.element('#projectTeachingClassTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		}
		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#projectTeachingClassTable').bootstrapTable('selectPage', 1);
			// angular.element('#projectTeachingClassTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.teachingClass = {};
			angular.element('#projectTeachingClassTable').bootstrapTable('refresh');
		}
		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectTeachingClass/add.html',
				size: 'lg',
				resolve: {
					item: function () {
						return $scope.teachingClass;
					}
				},
				controller: openAddController
			});
		};
		//打开修改面板
		$scope.openModify = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectTeachingClass/modify.html',
				size: 'lg',
				resolve: {
					item: function () {
						return data;
					},
					courseId: function () {
						return $scope.teachingClass.courseId;
					}
				},
				controller: openModifyController
			});
		};
		//打开删除面板
		$scope.openDelete = function(){
			var rows = angular.element('#projectTeachingClassTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectTeachingClass/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteController
			});
		};

		//打开板块设置面板
		$scope.openSetPlate = function(){
			var rows = angular.element('#projectTeachingClassTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要设置的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectTeachingClass/setPlate.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openSetPlateController
			});
		};

		// 打开班级名单
		$scope.classList = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectTeachingClass/list/classList.html',
				resolve: {
					item: function () {
						return data;
					}
				},
				size: 'lg',
				controller: openListController
			});
		};

		// 打开修读范围面板
		$scope.openRange = function(){
			var rows = angular.element('#projectTeachingClassTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要设置的项');
				return;
			}
			if(rows.length > 1){
				alertService('请只选择一项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectTeachingClass/range.html',
				size: 'lg',
				resolve: {
					item: function () {
						return rows[0];
					}
				},
				controller: openRangeController
			});
		};

	};
	starts_teachingClassController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'starts_teachingClassService', 'alertService', 'app'];

	// 添加控制器
	var openAddController = function ($compile,item,$rootScope,$scope, $uibModalInstance, $uibModal, starts_teachingClassService, formVerifyService, alertService) {
		// 项目下拉框数据
		$scope.dropDownData = [
			{
				id: "",
				name:"==请选择=="
			}
		];
		starts_teachingClassService.getMenuTree(item.courseId,function (error, message, data) {
			// $scope.dropDownData.concat(data.rows);
			for(var i = 0; i < data.length; i++){
				$scope.dropDownData.push(data[i]);
			};
			var html = '' +
				'<select ng-model="teachingClass.projectId" ng-required="true" ng-change="look()" ng-required="true" id="projectId" name="projectId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in dropDownData" value="{{date.id}}">{{date.name}}</option>'+
				'</select>';
			angular.element("#projectId").parent().empty().append(html);
			$compile(angular.element("#projectId").parent().contents())($scope);
		});

		$scope.tcId = "";
		$scope.look = function () {
			//$scope.teachingClass = {};
			var projectId = angular.element('#projectId').val();
			$scope.tcId = projectId;
			starts_teachingClassService.getProjectName(projectId,function (error, message, data) {
				var name = data.name;
				var courceName = $rootScope.name;
				$scope.teachingClass.className = name+"(" + courceName + ")";
				// angular.element('#className').val(addName);
			});
		};

		// 板块下拉框数据
		$scope.projectPalateData = [
			{
				id: "",
				name:"==请选择=="
			}
		];
		starts_teachingClassService.getProjectPlate(function (error, message, data) {
			for(var i = 0; i < data.length; i++){
				$scope.projectPalateData.push(data[i]);
			}
			var html = '' +
				'<select ng-model="teachingClass.plateId"  ng-required="true" id="plateId" name="plateId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in projectPalateData" value="{{date.id}}">{{date.name}}</option>'+
				'</select>';
			angular.element("#plateId").parent().empty().append(html);
			$compile(angular.element("#plateId").parent().contents())($scope);

		});

		// 校区下拉框数据
		$scope.campusData = [
			{
				id: "",
				campusName:"==请选择=="
			}
		];
		starts_teachingClassService.getCampus(function (error, message, data) {
			for(var i = 0; i < data.length; i++){
				$scope.campusData.push(data[i]);
			}
			var html = '' +
				'<select ng-model="teachingClass.campusId" ng-required="true" id="campusId" name="campusId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in campusData" value="{{date.id}}">{{date.campusName}}</option>'+
				'</select>';
			angular.element("#campusId").parent().empty().append(html);
			$compile(angular.element("#campusId").parent().contents())($scope);
		});

		$scope.ok = function (form) {

			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			$scope.teachingClass.courseId = $rootScope.type;
			$scope.teachingClass.projectId = $scope.tcId;
			starts_teachingClassService.add($scope.teachingClass, function (error, message) {

				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#projectTeachingClassTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openAddController.$inject = ['$compile','item','$rootScope','$scope', '$uibModalInstance', '$uibModal', 'starts_teachingClassService', 'formVerifyService', 'alertService'];

	var openRangeController = function ($scope, $uibModalInstance, item, starts_teachingClassService, alertService, formVerifyService) {
		// $scope.rangeData = item.rangeData;
		var classId = item.id;

		var rangeData = [];
		starts_teachingClassService.get(classId, function (data) {
			console.log(data);
			rangeData = data;
			rangeDate();
		});
		var rangeDate = function () {
			$scope.arrays = rangeData.deptData;
			$scope.arrays2 = [{val: "2014",name: "2014",selectSign: false,rangeType:2},{val: "2015",name: "2015",selectSign: false,rangeType:2},
				{val: "2016",name: "2016",selectSign: false,rangeType:2},{val: "2017",name: "2017",selectSign: false,rangeType:2}];
			$scope.arrays3 = rangeData.majorData;
			$scope.arrays4 = rangeData.classData;
			$scope.arraySeled =rangeData.deptReadRangeData;
			$scope.arraySeled2 =rangeData.gradeReadRangeData;
			angular.forEach($scope.arraySeled2 , function(seled,i,arraySel){
				angular.forEach($scope.arrays2 , function(sel,index,array){
					if(seled.val == sel.val){
						var index = $scope.arrays2.indexOf(sel);
						$scope.arrays2.splice(index,1);
					}
				});

			});
			$scope.arraySeled3 =rangeData.majorReadRangeData;
			$scope.arraySeled4 =rangeData.classReadRangeData;
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

			$scope.ok = function (form) {
				// 处理前验证
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				var arraySeled = [] ;
				angular.forEach($scope.arraySeled , function(data,index,array){
					arraySeled.push(data);
				});
				angular.forEach($scope.arraySeled2 , function(data,index,array){
					arraySeled.push(data);
				});
				angular.forEach($scope.arraySeled3 , function(data,index,array){
					arraySeled.push(data);
				});
				angular.forEach($scope.arraySeled4 , function(data,index,array){
					arraySeled.push(data);
				});
				console.log(arraySeled);
				starts_teachingClassService.updateRange(classId, arraySeled, function (error, message) {
					if (error) {
						alertService(message);
						return;
					}
					$uibModalInstance.close();
					angular.element('#classCourseTable').bootstrapTable('refresh');
					alertService('success', '修改成功');
				});
			};
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openRangeController.$inject = ['$scope', '$uibModalInstance', 'item', 'starts_teachingClassService', 'alertService', 'formVerifyService'];
	//修改控制器
	var openModifyController = function ($compile,$scope, $uibModalInstance, courseId, item, starts_teachingClassService, alertService, formVerifyService) {
		// 项目下拉框数据
		$scope.dropDownData = [
			{
				id: "",
				name:"==请选择=="
			}
		];
		starts_teachingClassService.getMenuTree(courseId,function (error, message, data) {
			// $scope.dropDownData.concat(data.rows);
			for(var i = 0; i < data.length; i++){
				$scope.dropDownData.push(data[i]);
			}
			var html = '' +
				'<select ng-model="teachingClass.projectId"  id="projectId" name="projectId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in dropDownData" value="{{date.id}}">{{date.name}}</option>'+
				'</select>';
			angular.element("#projectId").parent().empty().append(html);
			$compile(angular.element("#projectId").parent().contents())($scope);
		});

		// 对应行政班下拉框数据
		$scope.palateData = [];

		starts_teachingClassService.getPlate(function (error, message, data) {
			for(var i = 0; i < data.rows.length; i++){
				$scope.palateData.push(data.rows[i]);
			}
			var html = '' +
				'<select ng-model="teachingClass.executiveClassIds"  id="executiveClassIds" name="executiveClassIds" ui-jq="chosen" ui-options="{search_contains: true}"  multiple class="form-control">'+
				'<option ng-repeat="date in palateData" value="{{date.id}}">{{date.name}}</option>'+
				'</select>';
			angular.element("#executiveClassIds").parent().empty().append(html);
			$compile(angular.element("#executiveClassIds").parent().contents())($scope);
		});

		// 对应板块下拉框数据
		$scope.projectPalateData = [];
		starts_teachingClassService.getProjectPlate(function (error, message, data) {
			for(var i = 0; i < data.length; i++){
				$scope.projectPalateData.push(data[i]);
			}

			var html = '' +
				'<select ng-model="teachingClass.plateId"  id="plateId" name="plateId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in projectPalateData" value="{{date.id}}">{{date.name}}</option>'+
				'</select>';
			angular.element("#plateId").parent().empty().append(html);
			$compile(angular.element("#plateId").parent().contents())($scope);
		});

		// 数据初始化
		$scope.teachingClass = item;
		$scope.teachingClass.executiveClassIds = [];
		var executiveClassId = item.executiveClassId;
		if(executiveClassId != undefined){
			var classArray = item.executiveClassId.split(",");
			classArray.forEach (function(id) {
				$scope.teachingClass.executiveClassIds.push(id);
			});
		};
		$scope.ok = function (form) {
			// 数据初始化
			// if($scope.teachingClass.executiveClassId != undefined){
			// 	$scope.teachingClass.executiveClassIds = $scope.teachingClass.executiveClassId.split(",");
			// };
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			$scope.teachingClass.courseId = courseId;

			starts_teachingClassService.update($scope.teachingClass, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#projectTeachingClassTable').bootstrapTable('refresh');
				alertService('success', '修改成功');
			});
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openModifyController.$inject = ['$compile','$scope', '$uibModalInstance', 'courseId', 'item', 'starts_teachingClassService', 'alertService', 'formVerifyService'];

	// 删除控制器
	var openDeleteController = function ($scope, $uibModalInstance, items, starts_teachingClassService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var codeTypeIds = []; // 代码类型号数组
			items.forEach (function(teachingClass) {
				codeTypeIds.push(teachingClass.codeTypeId);
			});
			starts_teachingClassService.delete(codeTypeIds, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#projectTeachingClassTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_teachingClassService', 'alertService'];

	// 设置板块控制器
	var openSetPlateController = function ($scope,$compile, $uibModalInstance, items, starts_teachingClassService, alertService) {
		// 对应板块下拉框数据
		$scope.projectPalateData = [];
		starts_teachingClassService.getProjectPlate(function (error, message, data) {
			for(var i = 0; i < data.length; i++){
				$scope.projectPalateData.push(data[i]);
			}
			var html = '' +
				'<select ng-model="teachingClass.plateId" ng-required="true" id="plateId" name="plateId" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control"> '+
				'<option ng-repeat="data in projectPalateData" value="{{data.id}}">{{data.name}}</option>'+
				'</select>';
			angular.element("#plateId").parent().empty().append(html);
			$compile(angular.element("#plateId").parent().contents())($scope);

		});
		$scope.message = "确定要设置吗？";
		$scope.ok = function (form) {
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			var array = [];// 板块号数组
			if ($scope.teachingClass == undefined || $scope.teachingClass.plateId == undefined) {
				$scope.teachingClass = {};
				$scope.teachingClass.plateId = "";
			};
			array.push($scope.teachingClass.plateId);
			items.forEach (function(teachingClass) {
				array.push(teachingClass.id);
			});
			starts_teachingClassService.setPlate(array, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#projectTeachingClassTable').bootstrapTable('refresh');
				alertService('success', '设置成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openSetPlateController.$inject = ['$scope','$compile', '$uibModalInstance', 'items', 'starts_teachingClassService', 'alertService'];

	var openListController = function (app,$scope, item,$uibModalInstance, $uibModal, starts_teachingClassService, formVerifyService, alertService) {

		//查询参数
		$scope.queryParams1 = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				sortName: params.sortName,
				sortOrder: params.sortOrder,
				// executiveClassId : item.executiveClassId,
				// semesterId : item.semesterId,
				// courseId : item.courseId
				classId:item.id
			};
			return angular.extend(pageParam, $scope.courseArrange);
		}

		$scope.classListTable = {
			// url: 'data_test/starts/tableview_classList.json',
			url: app.api.address + '/virtual-class/classList',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [10, 20], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'num', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams1,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field: "id", title: "主键", visible: false},
				{field: "executiveClassId", title: "行政班级Id", visible: false},
				{field: "semesterId", title: "学期Id", visible: false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field: "num", title: "学号", align: "center", valign: "middle"},
				{field: "name", title: "姓名", align: "center", valign: "middle"},

				{field: "executiveClassName", title: "行政班级", align: "center", valign: "middle"}
			]
		};
		//打开新增面板
		$scope.openStudentInfo = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectTeachingClass/list/add.html',
				size: 'lg',
				resolve: {
					item1: function () {
						return item;
					}
				},
				controller: openAddController1
			});
		};
		//删除
		$scope.openDeleteStudentInfo = function(){
			var rows = angular.element('#classListTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/list/delete.html',
				size: '',
				resolve: {
					item: function () {
						return item;
					}
				},
				controller: openDelete1
			});
		};
        //
		// $scope.isHideSearchForm = false; // 默认显示
		// $scope.searchFormHideToggle = function () {
		// 	$scope.isHideSearchForm = !$scope.isHideSearchForm
		// 	if ($scope.isHideSearchForm) {
		// 		$scope.table_height = $scope.table_height + 98;
		// 	} else {
		// 		$scope.table_height = $scope.table_height - 98;
		// 	}
		// 	angular.element('#classListTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		// }
		// // 查询表单提交
		// $scope.searchSubmit = function () {
		// 	angular.element('#classListTable').bootstrapTable('refresh');
		// }
		// // 查询表单重置
		// $scope.searchReset = function () {
		// 	$scope.courseArrange = {};
		// 	angular.element('#classListTable').bootstrapTable('refresh');
		// }
        //
		// $scope.ok = function (form) {
		// 	// 处理前验证
		// 	if(form.$invalid) {
		// 		// 调用共用服务验证（效果：验证不通过的输入框会变红色）
		// 		formVerifyService(form);
		// 		return;
		// 	};
        //
		// 	// starts_teachingClassService.add($scope.courseArrange, function (error, message) {
		// 	// 	if (error) {
		// 	// 		alertService(message);
		// 	// 		return;
		// 	// 	}
		// 	// 	$uibModalInstance.close();
		// 	// 	angular.element('#classCourseTable').bootstrapTable('refresh');
		// 	// 	alertService('success', '新增成功');
		// 	// });
		// 	starts_teachingClassService.add($scope.courseArrange);
		// 	$uibModalInstance.close();
		// };
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openListController.$inject = ['app','$scope', 'item','$uibModalInstance', '$uibModal', 'starts_teachingClassService', 'formVerifyService', 'alertService'];

	// 添加控制器
	var openAddController1 = function (item1,app,$rootScope,$scope, $uibModalInstance, $uibModal, starts_teachingClassService, formVerifyService, alertService) {
		//查询参数
		$scope.queryParams2 = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				sortName: params.sortName,
				sortOrder: params.sortOrder,
				executiveClassId : item1.executiveClassId,
				teachingTaskId : item1.id,
				// courseId : item1.courseId
			};
			return angular.extend(pageParam, $scope.studentInfo);
		}

		$scope.classListTable1 = {
			// url: 'data_test/starts/tableview_classList.json', courseId
			url: app.api.address + '/virtual-class/courseList/out',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [10, 20], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'num', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams2,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field: "id", title: "主键", visible: false},
				{field: "executiveClassId", title: "行政班级Id", visible: false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field: "num", title: "学号", align: "center", valign: "middle"},
				{field: "name", title: "姓名", align: "center", valign: "middle"},

				{field: "executiveClassName", title: "行政班级", align: "center", valign: "middle"}
			]
		};
		$scope.ok = function (form) {
			var rows = angular.element('#classListTable1').bootstrapTable('getSelections');
			var xjs = []; //
			xjs.push(item1.semesterId);
			xjs.push(item1.id);
			rows.forEach (function(studentInfo) {
				xjs.push(studentInfo.schoolId);
			});
				starts_teachingClassService.addStudent(xjs, function (error, message) {
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#classListTable').bootstrapTable('refresh');
					alertService('success', '新增成功');
				});
				$uibModalInstance.close();
			};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openAddController1.$inject = ['item1','app','$rootScope','$scope', '$uibModalInstance', '$uibModal', 'starts_teachingClassService', 'formVerifyService', 'alertService'];

	// 删除学生信息控制器
	var openDelete1 = function (app,$rootScope,$scope, item, $uibModalInstance, $uibModal, starts_teachingClassService, formVerifyService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var rows = angular.element('#classListTable').bootstrapTable('getSelections');
			var ids = []; //
			rows.forEach (function(studentInfo) {
				ids.push(studentInfo.id);
			});
			starts_teachingClassService.delete(ids,item.id, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classListTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDelete1.$inject = ['app','$rootScope','$scope', 'item', '$uibModalInstance', '$uibModal', 'starts_teachingClassService', 'formVerifyService', 'alertService'];
})(window);
