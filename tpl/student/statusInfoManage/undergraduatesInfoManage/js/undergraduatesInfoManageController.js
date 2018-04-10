;(function (window, undefined) {
    'use strict';

	window.arrange_undergraduatesInfoManageController = function ($state, $compile, $scope, $uibModal, $rootScope, $window, student_undergraduatesInfoManageService, formVerifyService, alertService, app) {
		// 表格的高度
        $scope.table_height = $window.innerHeight - 306;

		var selectionData = [];
		student_undergraduatesInfoManageService.get(function (data) {
			console.log(data);
			selectionData = data;
			findSelectionData();
		});
		var findSelectionData = function () {
			$scope.studentTypeList =selectionData.studentTypeList;
			$scope.sexList =selectionData.sexList;
			$scope.nationList =selectionData.nationList;
			$scope.campusList =selectionData.campusList;
			$scope.deptList =selectionData.deptList;
			$scope.majorList =selectionData.majorList;
			var studentHtml = '<select ng-model="statusInfo.studentTypeCode" ng-options="studentType.id as studentType.name for studentType in studentTypeList"'
				+' name="studentTypeCode" id="studentTypeCode_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value=""> ==请选择== </option>'
				+' </select>';
			var sexHtml = '<select ng-model="statusInfo.sexCode" ng-options="sex.id as sex.name for sex in sexList"'
				+' name="sexCode" id="sexCode_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var nationHtml = '<select ng-model="statusInfo.nationCode" ng-options="nation.id as nation.name for nation in nationList"'
				+' name="nationCode" id="nationCode_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var campusHtml = '<select ng-model="statusInfo.campusId" ng-options="campus.id as campus.name for campus in campusList"'
				+' name="campusId" id="campusId_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var deptHtml = '<select ng-model="statusInfo.deptId" ng-options="dept.id as dept.name for dept in deptList"'
				+' name="deptId" id="deptId_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var majorHtml = '<select ng-model="statusInfo.majorId" ng-options="major.id as major.name for major in majorList"'
				+' name="majorId" id="majorId_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			angular.element("#studentTypeCode_search").parent().empty().append(studentHtml);
			$compile(angular.element("#studentTypeCode_search").parent().contents())($scope);
			angular.element("#sexCode_search").parent().empty().append(sexHtml);
			$compile(angular.element("#sexCode_search").parent().contents())($scope);
			angular.element("#nationCode_search").parent().empty().append(nationHtml);
			$compile(angular.element("#nationCode_search").parent().contents())($scope);
			angular.element("#campusId_search").parent().empty().append(campusHtml);
			$compile(angular.element("#campusId_search").parent().contents())($scope);
			angular.element("#deptId_search").parent().empty().append(deptHtml);
			$compile(angular.element("#deptId_search").parent().contents())($scope);
			angular.element("#majorId_search").parent().empty().append(majorHtml);
			$compile(angular.element("#majorId_search").parent().contents())($scope);
		};
		
        // 查询提交表单
		$scope.searchSubmit = function (form) {
			// 处理前验证input输入框
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			angular.element('#scheduleManageTable').bootstrapTable('selectPage', 1);
			// angular.element('#scheduleManageTable').bootstrapTable('refresh');
		}

        // 重置表单
		$scope.searchReset = function (form) {
            $scope.statusInfo = {};
            // 重新初始化下拉框
            angular.element('form[name="scheduleManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
			angular.element('#scheduleManageTable').bootstrapTable('selectPage', 1);
			// angular.element('#scheduleManageTable').bootstrapTable('refresh');
		}
		
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber  //页码
//              sortName: params.sortName,
//              sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.statusInfo);
        }
        
		$scope.scheduleManageTable = {
			url: app.api.address + '/student/statusInfo',
			method: 'get',
			headers: {
				permission: "undergraduatesInfo:query"
			},
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
			showColumns: true,
			showRefresh: true,
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
				{checkbox: true,align:"center",valign:"middle", width: "5%"},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					var page = angular.element('#scheduleManageTable').bootstrapTable("getPage");
					return page.pageSize * (page.pageNumber-1) + (index + 1);
				}},
				{field:"id", title:"主键", visible:false},
				{field:"num",title:"学号",align:"center",valign:"middle",},
				{field:"name",title:"姓名",align:"center",valign:"middle",},
				{field:"sex",title:"性别",align:"center",valign:"middle",},
				{field:"nation",title:"民族",align:"center",valign:"middle"},
				{field:"deptName",title:"院系",align:"center",valign:"middle"},
				{field:"grade",title:"年级",align:"center",valign:"middle"},
				{field:"executiveClassName",title:"班级",align:"center",valign:"middle"},
				{field:"studentType",title:"学生类别",align:"center",valign:"middle"},
				{title:"操作",align:"center",valign:"middle",width:"10%",
					formatter: function(value, row, index) {
						var arrangeBtn = "<button id='btn_apjxrw' has-permission='undergraduatesInfo:update' type='button' ng-click='arrangeSet(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>进入学籍管理</button>";
						return arrangeBtn;
					}
				}
			]
		};
		
		// 跳转URL
		$scope.arrangeSet = function(data) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/student/statusInfoManage/undergraduatesInfoManage/arrange.html',
				size: 'lg',
				resolve: {
					item: function () {
						return data;
					}
				},
				controller: arrangeSetController
			});
		}

		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/student/statusInfoManage/undergraduatesInfoManage/add.html',
				size: 'lg',
				controller: addController
			});
		};

		// 打开删除面板
		$scope.openDelete = function(){
			var rows = angular.element('#scheduleManageTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/student/statusInfoManage/undergraduatesInfoManage/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteController
			});
		};
        
		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 195;
			} else {
				$scope.table_height = $scope.table_height - 195;
			}
			angular.element('#scheduleManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		}
	};
	arrange_undergraduatesInfoManageController.$inject = ['$state', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'student_undergraduatesInfoManageService', 'formVerifyService', 'alertService', 'app'];

	var addController = function (baseinfo_generalService, $compile, $scope, $uibModalInstance, $uibModal, student_undergraduatesInfoManageService, formVerifyService, alertService) {
		var selectionAddData = [];
		student_undergraduatesInfoManageService.selectionAddData(function (data) {
			console.log(data);
			selectionAddData = data;
			findSelectionAddData();
		});
		var findSelectionAddData = function () {
			$scope.studentTypeList =selectionAddData.studentTypeList;
			$scope.sexList =selectionAddData.sexList;
			$scope.nationList =selectionAddData.nationList;
			$scope.campusList =selectionAddData.campusList;
			$scope.deptList =selectionAddData.deptList;
			$scope.majorList =selectionAddData.majorList;

			$scope.trainWayList =selectionAddData.trainWayList;
			$scope.trainGradeList =selectionAddData.trainGradeList;
			$scope.politicalOutlookList =selectionAddData.politicalOutlookList;
			$scope.entranceWayList =selectionAddData.entranceWayList;
			$scope.identifyTypeList =selectionAddData.identifyTypeList;
			$scope.executiveClassList =selectionAddData.executiveClassList;
			$scope.nativePlaceList =selectionAddData.nativePlaceList;
			var studentHtml = '<select ng-model="statusInfo.studentTypeCode" ng-options="studentType.id as studentType.name for studentType in studentTypeList"  ui-chosen="gradePlateSetting_add_form.studentTypeCode" ng-required="true"'
				+' name="studentTypeCode" id="studentTypeCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value=""> ==请选择== </option>'
				+' </select>';
			var sexHtml = '<select ng-model="statusInfo.sexCode" ng-options="sex.id as sex.name for sex in sexList" ui-chosen="gradePlateSetting_add_form.sexCode" ng-required="true"'
				+' name="sexCode" id="sexCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var nationHtml = '<select ng-model="statusInfo.nationCode" ng-options="nation.id as nation.name for nation in nationList" ui-chosen="gradePlateSetting_add_form.nationCode" ng-required="true"'
				+' name="nationCode" id="nationCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var campusHtml = '<select ng-model="statusInfo.campusId" ng-options="campus.id as campus.name for campus in campusList" ui-chosen="gradePlateSetting_add_form.campusId" ng-required="true"'
				+' name="campusId" id="campusId" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var deptHtml = '<select ng-model="statusInfo.deptId" ng-options="dept.id as dept.name for dept in deptList" ui-chosen="gradePlateSetting_add_form.deptId" ng-required="true"'
				+' name="deptId" id="deptId" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var majorHtml = '<select ng-model="statusInfo.majorId" ng-options="major.id as major.name for major in majorList" ui-chosen="gradePlateSetting_add_form.majorId" ng-required="true"'
				+' name="majorId" id="majorId" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var trainWayHtml = '<select ng-model="statusInfo.trainWayCode" ng-options="trainWay.id as trainWay.name for trainWay in trainWayList" ui-chosen="gradePlateSetting_add_form.trainWayCode" ng-required="true"'
				+' name="trainWayCode" id="trainWayCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var trainGradeHtml = '<select ng-model="statusInfo.trainGradeCode" ng-options="trainGrade.id as trainGrade.name for trainGrade in trainGradeList" ui-chosen="gradePlateSetting_add_form.trainGradeCode" ng-required="true"'
				+' name="trainGradeCode" id="trainGradeCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var politicalOutlookHtml = '<select ng-model="statusInfo.politicalOutlookCode" ng-options="politicalOutlook.id as politicalOutlook.name for politicalOutlook in politicalOutlookList" ui-chosen="gradePlateSetting_add_form.politicalOutlookCode" ng-required="true"'
				+' name="politicalOutlookCode" id="politicalOutlookCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var entranceWayHtml = '<select ng-model="statusInfo.entranceWayCode" ng-options="entranceWay.id as entranceWay.name for entranceWay in entranceWayList" ui-chosen="gradePlateSetting_add_form.entranceWayCode" ng-required="true"'
				+' name="entranceWayCode" id="entranceWayCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var identifyTypeHtml = '<select ng-model="statusInfo.identifyTypeCode" ng-options="identifyType.id as identifyType.name for identifyType in identifyTypeList" ui-chosen="gradePlateSetting_add_form.identifyTypeCode" ng-required="true"'
				+' name="identifyTypeCode" id="identifyTypeCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var executiveClassHtml = '<select ng-model="statusInfo.executiveClassId" ng-options="executiveClass.id as executiveClass.name for executiveClass in executiveClassList" ui-chosen="gradePlateSetting_add_form.executiveClassId" ng-required="true"'
				+' name="executiveClassId" id="executiveClassId" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			/*var nativePlaceHtml = '<select ng-model="statusInfo.nativePlaceCode" ng-options="nativePlace.id as nativePlace.name for nativePlace in nativePlaceList" ui-chosen="gradePlateSetting_add_form.nativePlaceCode" ng-required="true"'
				+' name="nativePlaceCode" id="nativePlaceCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';*/
			
			angular.element("#studentTypeCode").parent().empty().append(studentHtml);
			$compile(angular.element("#studentTypeCode").parent().contents())($scope);
			angular.element("#sexCode").parent().empty().append(sexHtml);
			$compile(angular.element("#sexCode").parent().contents())($scope);
			angular.element("#nationCode").parent().empty().append(nationHtml);
			$compile(angular.element("#nationCode").parent().contents())($scope);
			angular.element("#campusId").parent().empty().append(campusHtml);
			$compile(angular.element("#campusId").parent().contents())($scope);
			angular.element("#deptId").parent().empty().append(deptHtml);
			$compile(angular.element("#deptId").parent().contents())($scope);
			angular.element("#majorId").parent().empty().append(majorHtml);
			$compile(angular.element("#majorId").parent().contents())($scope);

			angular.element("#trainWayCode").parent().empty().append(trainWayHtml);
			$compile(angular.element("#trainWayCode").parent().contents())($scope);
			angular.element("#trainGradeCode").parent().empty().append(trainGradeHtml);
			$compile(angular.element("#trainGradeCode").parent().contents())($scope);
			angular.element("#politicalOutlookCode").parent().empty().append(politicalOutlookHtml);
			$compile(angular.element("#politicalOutlookCode").parent().contents())($scope);
			angular.element("#entranceWayCode").parent().empty().append(entranceWayHtml);
			$compile(angular.element("#entranceWayCode").parent().contents())($scope);
			angular.element("#identifyTypeCode").parent().empty().append(identifyTypeHtml);
			$compile(angular.element("#identifyTypeCode").parent().contents())($scope);
			angular.element("#executiveClassId").parent().empty().append(executiveClassHtml);
			$compile(angular.element("#executiveClassId").parent().contents())($scope);
			//angular.element("#nativePlaceCode").parent().empty().append(nativePlaceHtml);
			//$compile(angular.element("#nativePlaceCode").parent().contents())($scope);
		}

		//$scope.permission='undergraduatesInfo:insert';
		baseinfo_generalService.gradeList('undergraduatesInfo:insert',
			function (error, message, data) {
				if (error) {
					alertService(message);
					return;
				}
				$scope.gradeList = data.data;
				var gradeHtml = '<select ng-model="statusInfo.grade" ng-options="grade.dataNumber as grade.dataNumber for grade in gradeList" ui-chosen="gradePlateSetting_add_form.grade" ng-required="true"'
					+' name="grade" id="grade" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
					+' <option value="">==请选择==</option>'
					+' </select>';
				angular.element("#grade").parent().empty().append(gradeHtml);
				$compile(angular.element("#grade").parent().contents())($scope);
			}
			//,'undergraduatesInfo:insert'
		);
		$scope.ok = function (form) {
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			student_undergraduatesInfoManageService.add($scope.statusInfo, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#scheduleManageTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
		};
		$scope.cancel = function () {
			$uibModalInstance.close();
		};
	};
	addController.$inject = ['baseinfo_generalService', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'student_undergraduatesInfoManageService', 'formVerifyService', 'alertService'];

	var arrangeSetController = function (baseinfo_generalService, $compile, $scope,item, $uibModalInstance, $uibModal, student_undergraduatesInfoManageService, formVerifyService, alertService) {
		$scope.statusInfo = item;
		$scope.statusInfo.learnSystem = parseInt(item.learnSystem);
		var selectionAddData = [];
		student_undergraduatesInfoManageService.selectionAddData(function (data) {
			console.log(data);
			selectionAddData = data;
			findSelectionAddData();
		});
		var findSelectionAddData = function () {
			$scope.studentTypeList =selectionAddData.studentTypeList;
			$scope.sexList =selectionAddData.sexList;
			$scope.nationList =selectionAddData.nationList;
			$scope.campusList =selectionAddData.campusList;
			$scope.deptList =selectionAddData.deptList;
			$scope.majorList =selectionAddData.majorList;

			$scope.trainWayList =selectionAddData.trainWayList;
			$scope.trainGradeList =selectionAddData.trainGradeList;
			$scope.politicalOutlookList =selectionAddData.politicalOutlookList;
			$scope.entranceWayList =selectionAddData.entranceWayList;
			$scope.identifyTypeList =selectionAddData.identifyTypeList;
			$scope.executiveClassList =selectionAddData.executiveClassList;
			//$scope.nativePlaceList =selectionAddData.nativePlaceList;
			var studentHtml = '<select ng-model="statusInfo.studentTypeCode" ng-options="studentType.id as studentType.name for studentType in studentTypeList"  ui-chosen="gradePlateSetting_arrange_form.studentTypeCode" ng-required="true"'
				+' name="studentTypeCode" id="studentTypeCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value=""> ==请选择== </option>'
				+' </select>';
			var sexHtml = '<select ng-model="statusInfo.sexCode" ng-options="sex.id as sex.name for sex in sexList" ui-chosen="gradePlateSetting_arrange_form.sexCode" ng-required="true"'
				+' name="sexCode" id="sexCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var nationHtml = '<select ng-model="statusInfo.nationCode" ng-options="nation.id as nation.name for nation in nationList" ui-chosen="gradePlateSetting_arrange_form.nationCode" ng-required="true"'
				+' name="nationCode" id="nationCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var campusHtml = '<select ng-model="statusInfo.campusId" ng-options="campus.id as campus.name for campus in campusList" ui-chosen="gradePlateSetting_arrange_form.campusId" ng-required="true"'
				+' name="campusId" id="campusId" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var deptHtml = '<select ng-model="statusInfo.deptId" ng-options="dept.id as dept.name for dept in deptList" ui-chosen="gradePlateSetting_arrange_form.deptId" ng-required="true"'
				+' name="deptId" id="deptId" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var majorHtml = '<select ng-model="statusInfo.majorId" ng-options="major.id as major.name for major in majorList" ui-chosen="gradePlateSetting_arrange_form.majorId" ng-required="true"'
				+' name="majorId" id="majorId" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var trainWayHtml = '<select ng-model="statusInfo.trainWayCode" ng-options="trainWay.id as trainWay.name for trainWay in trainWayList" ui-chosen="gradePlateSetting_arrange_form.trainWayCode" ng-required="true"'
				+' name="trainWayCode" id="trainWayCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var trainGradeHtml = '<select ng-model="statusInfo.trainGradeCode" ng-options="trainGrade.id as trainGrade.name for trainGrade in trainGradeList" ui-chosen="gradePlateSetting_arrange_form.trainGradeCode" ng-required="true"'
				+' name="trainGradeCode" id="trainGradeCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var politicalOutlookHtml = '<select ng-model="statusInfo.politicalOutlookCode" ng-options="politicalOutlook.id as politicalOutlook.name for politicalOutlook in politicalOutlookList" ui-chosen="gradePlateSetting_arrange_form.politicalOutlookCode" ng-required="true"'
				+' name="politicalOutlookCode" id="politicalOutlookCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var entranceWayHtml = '<select ng-model="statusInfo.entranceWayCode" ng-options="entranceWay.id as entranceWay.name for entranceWay in entranceWayList" ui-chosen="gradePlateSetting_arrange_form.entranceWayCode" ng-required="true"'
				+' name="entranceWayCode" id="entranceWayCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var identifyTypeHtml = '<select ng-model="statusInfo.identifyTypeCode" ng-options="identifyType.id as identifyType.name for identifyType in identifyTypeList" ui-chosen="gradePlateSetting_arrange_form.identifyTypeCode" ng-required="true"'
				+' name="identifyTypeCode" id="identifyTypeCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			var executiveClassHtml = '<select ng-model="statusInfo.executiveClassId" ng-options="executiveClass.id as executiveClass.name for executiveClass in executiveClassList" ui-chosen="gradePlateSetting_arrange_form.executiveClassId" ng-required="true"'
				+' name="executiveClassId" id="executiveClassId" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';
			/*var nativePlaceHtml = '<select ng-model="statusInfo.nativePlaceCode" ng-options="nativePlace.id as nativePlace.name for nativePlace in nativePlaceList" ui-chosen="gradePlateSetting_add_form.nativePlaceCode" ng-required="true"'
				+' name="nativePlaceCode" id="nativePlaceCode" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
				+' <option value="">==请选择==</option>'
				+' </select>';*/

			angular.element("#studentTypeCode").parent().empty().append(studentHtml);
			$compile(angular.element("#studentTypeCode").parent().contents())($scope);
			angular.element("#sexCode").parent().empty().append(sexHtml);
			$compile(angular.element("#sexCode").parent().contents())($scope);
			angular.element("#nationCode").parent().empty().append(nationHtml);
			$compile(angular.element("#nationCode").parent().contents())($scope);
			angular.element("#campusId").parent().empty().append(campusHtml);
			$compile(angular.element("#campusId").parent().contents())($scope);
			angular.element("#deptId").parent().empty().append(deptHtml);
			$compile(angular.element("#deptId").parent().contents())($scope);
			angular.element("#majorId").parent().empty().append(majorHtml);
			$compile(angular.element("#majorId").parent().contents())($scope);

			angular.element("#trainWayCode").parent().empty().append(trainWayHtml);
			$compile(angular.element("#trainWayCode").parent().contents())($scope);
			angular.element("#trainGradeCode").parent().empty().append(trainGradeHtml);
			$compile(angular.element("#trainGradeCode").parent().contents())($scope);
			angular.element("#politicalOutlookCode").parent().empty().append(politicalOutlookHtml);
			$compile(angular.element("#politicalOutlookCode").parent().contents())($scope);
			angular.element("#entranceWayCode").parent().empty().append(entranceWayHtml);
			$compile(angular.element("#entranceWayCode").parent().contents())($scope);
			angular.element("#identifyTypeCode").parent().empty().append(identifyTypeHtml);
			$compile(angular.element("#identifyTypeCode").parent().contents())($scope);
			angular.element("#executiveClassId").parent().empty().append(executiveClassHtml);
			$compile(angular.element("#executiveClassId").parent().contents())($scope);
			//angular.element("#nativePlaceCode").parent().empty().append(nativePlaceHtml);
			//$compile(angular.element("#nativePlaceCode").parent().contents())($scope);
		}
		baseinfo_generalService.gradeList('undergraduatesInfo:insert',
			function (error, message, data) {
				if (error) {
					alertService(message);
					return;
				}
				$scope.gradeList = data.data;
				var gradeHtml = '<select ng-model="statusInfo.grade" ng-options="grade.dataNumber as grade.dataNumber for grade in gradeList" ui-chosen="gradePlateSetting_arrange_form.grade" ng-required="true"'
					+' name="grade" id="grade" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
					+' <option value="">==请选择==</option>'
					+' </select>';
				angular.element("#grade").parent().empty().append(gradeHtml);
				$compile(angular.element("#grade").parent().contents())($scope);
			}
		);
		$scope.ok = function (form) {
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			student_undergraduatesInfoManageService.update($scope.statusInfo, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#scheduleManageTable').bootstrapTable('refresh');
				alertService('success', '修改成功');
			});
		};
		$scope.cancel = function () {
			$uibModalInstance.close();
		};
	};
	arrangeSetController.$inject = ['baseinfo_generalService', '$compile', '$scope', 'item', '$uibModalInstance', '$uibModal', 'student_undergraduatesInfoManageService', 'formVerifyService', 'alertService'];

	// 删除控制器
	var openDeleteController = function ($scope, $uibModalInstance, items, student_undergraduatesInfoManageService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(data) {
				ids.push(data.id);
			});
			student_undergraduatesInfoManageService.delete(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#scheduleManageTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		// 关闭窗口事件
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'student_undergraduatesInfoManageService', 'alertService'];

})(window);
