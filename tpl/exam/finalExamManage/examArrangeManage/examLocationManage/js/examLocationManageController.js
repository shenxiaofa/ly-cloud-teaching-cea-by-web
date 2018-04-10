/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试时间管理Controller
    window.exam_locationManageController = function($scope, $filter, baseinfo_generalService, app, $uibModal, $compile, $window, $rootScope, exam_locationManageService, alertService) {


        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examLocationManage.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

		// 表格的高度
        $scope.table_height = $window.innerHeight - 264;
        
		// 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                examType:"1"
            };
            return angular.extend(pageParam, $scope.examLocationManage);
        };

        $scope.examDatetimeTable = {
            //url: 'data_test/exam/tableview_examDatetime.json',
            url:app.api.address + '/exam/formalManage/findExamClassInfo',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "ksbbh", // 指定主键列
            uniqueId: "ksbbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
			onLoadSuccess: function() {
				$compile(angular.element('#examDatetimeTable').contents())($scope);
			},
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"id",title:"考试班编号",align:"center",valign:"middle"},
                {field:"name",title:"考试班名称",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"studentCount",title:"考生数",align:"center",valign:"middle"},
                {field:"startTime",title:"考试开始时间",align:"center",valign:"middle"},
                {field:"endTime",title:"考试结束时间",align:"center",valign:"middle"},
                {field:"location",title:"考试地点",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == '' || value == null){
                            return "-";
                        }
                        var names = "";
                        angular.forEach(value, function(data, index, array){
                            names += data.classRoomNum + "、";
                        });
                        if (names.length > 0) {
                            names = names.substring(0, names.length - 1);
                        }
                        return names;
                    }},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var btn = "<button id='btn_datetime' type='button' ng-click='locationSet(" + JSON.stringify(row) + ")' class='btn btn-default'>地点指定</button>";
                        return btn;

                    }
                }
            ]
        };

        $scope.examLocationManage={};
        // 开始日期参数配置
        $scope.ksrqOptions = {
            opened: false,
            open: function() {
                $scope.ksrqOptions.opened = true;
            },
            changed : function () {
                $scope.examLocationManage.startTime = $scope.examLocationManage.startDate;
            }
        };
        // 结束日期参数配置
        $scope.jsrqOptions = {
            opened: false,
            open: function() {
                $scope.jsrqOptions.opened = true;
            },
            changed : function () {
                $scope.examLocationManage.endTime = $scope.examLocationManage.endDate;
            }
        };
        // 结束日期小于开始日期时的提示
        $scope.jsrqTooltipEnableAndOpen = false;
        $scope.$watch('examLocationManage.endTime', function (newValue) {
            if ($scope.examLocationManage.startTime && newValue && (newValue < $scope.examLocationManage.startTime)) {
                $scope.jsrqTooltipEnableAndOpen = true;
                return;
            }
            $scope.jsrqTooltipEnableAndOpen = false;
        });

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 155;
            } else {
                $scope.table_height = $scope.table_height - 155;
            }
            angular.element('#examDatetimeTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        
        // 查询表单提交
        $scope.searchSubmit = function () {
            $scope.examLocationManage.startTime =  $filter("date")( $scope.examLocationManage.startTime, app.date.format);
            $scope.examLocationManage.endTime =  $filter("date")( $scope.examLocationManage.endTime, app.date.format);
            angular.element('#examDatetimeTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examLocationManage = {};
            angular.element('form[name="examLocationManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examDatetimeTable').bootstrapTable('refresh');
        };

        //地点指定
        $scope.locationSet = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examLocationManage/locationSet.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: finalExamLocationSetController
            });
        };
    }
    exam_locationManageController.$inject = ['$scope', '$filter', 'baseinfo_generalService', 'app', '$uibModal', '$compile', '$window', '$rootScope', 'exam_locationManageService', 'alertService'];

    //地点指定
    var finalExamLocationSetController = function($scope, alertService, app, $uibModalInstance, $compile, $uibModal, item, exam_locationManageService){
        $scope.classInfo = {};
        $scope.classInfo.id=item.id;
        $scope.classInfo.name=item.name;
        $scope.classInfo.courseNum=item.courseNum;
        $scope.classInfo.courseName=item.courseName;
        $scope.classInfo.dept=item.dept;
        $scope.classInfo.totalHour=item.totalHour;
        $scope.classInfo.credit=item.credit;
        $scope.classInfo.studentCount=item.studentCount;

        $scope.examLocationSetTable = {
            url:app.api.address + '/exam/formalManage/examLocationInfo?id='+item.id,
            method: 'get',
            cache: false,
            height: 357,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "ksbbh", // 指定主键列
            uniqueId: "ksbbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
			onLoadSuccess: function() {
				$compile(angular.element('#examLocationSetTable').contents())($scope);
			},
            responseHandler:function(response){
                var data = {
                    rows :response.data,
                    total : response.data.length
                }
                return data;
            },
            columns: [
                {field:"buildingName",title:"教室楼",align:"center",valign:"middle"},
                {field:"classRoomNum",title:"教室号",align:"center",valign:"middle"},
                {field:"examSeatCount",title:"座位数",align:"center",valign:"middle"},
                {field:"studentCount",title:"安排学生数",align:"center",valign:"middle",width:"20%",
                    formatter : function (value, row, index) {
                        return '<input type="number" min="0" data-id="' + row.id + '" name="studentCount" value="' + value + '" style="width: 100px;"/>';
                    }
                },
                {field:"teacherCount",title:"安排监考教师数",align:"center",valign:"middle",width:"20%",
                    formatter : function (value, row, index) {
                        return '<input type="number" min="0" data-id="' + row.id + '" name="teacherCount" value="' + value + '" style="width: 100px;"/>';
                    }
                },
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<button type='button'  class='btn btn-default del-btn' ng-click='delete("+ angular.toJson(row) +")'><span class='glyphicon glyphicon-remove toolbar-btn-icon'></span>删除</button>";
                    }
                }
            ]
        }
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function () {
            var studentCount = $scope.classInfo.studentCount;
            var studentSet = 0;
            var data = [];
            var rows = angular.element('#examLocationSetTable').bootstrapTable('getOptions').data;
            var studentCounts = angular.element('#examLocationSetTable input[name="studentCount"]');
            var teacherCounts = angular.element('#examLocationSetTable input[name="teacherCount"]');
            for (var i=0; i<studentCounts.length; i++) {
                data[i] = {};
                data[i].id = rows[i].id;
                data[i].studentCount = studentCounts.eq(i).val();
                studentSet += isNaN(parseInt(studentCounts.eq(i).val()))?0:parseInt(studentCounts.eq(i).val());;
                data[i].teacherCount = teacherCounts.eq(i).val();
            }

            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examLocationManage/confirm.html',
                size: '',
                resolve: {
                    data: function () {
                        return data;
                    },
                    studentCount: function () {
                        return studentCount;
                    },
                    studentSet: function () {
                        return studentSet;
                    },
                    puibModal: function () {
                        return $uibModalInstance;
                    },
                },
                controller: openConfoirmController
            });


        };
        $scope.delete = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examLocationManage/delete.html',
                size: '',
                resolve: {
                    id: function () {
                        return row.id;
                    },
                },
                controller: openDeleteController
            });
        };
        $scope.setLocation = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examLocationManage/classroomInfo.html',
                size: 'lg',
                controller: finalExamSetLocationController,
                resolve: {
                    examClassId: function () {
                        return item.id;
                    }
                }
            });
        }
    }
    finalExamLocationSetController.$inject = ['$scope', 'alertService', 'app', '$uibModalInstance', '$compile', '$uibModal', 'item', 'exam_locationManageService'];

    //确认制器
    var openConfoirmController = function ($rootScope, $scope, puibModal, $uibModalInstance, data, studentCount, studentSet, exam_locationManageService, alertService) {
        $scope.message = "总参考学生"+studentCount+"人,教室已安排考试人数"+studentSet+"人,确定继续执行？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            exam_locationManageService.update(data,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '保存成功');
                    angular.element('#examLocationSetTable').bootstrapTable('refresh');
                    angular.element('#examDatetimeTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                    puibModal.close();
                }

            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openConfoirmController.$inject = ['$rootScope', '$scope', 'puibModal', '$uibModalInstance', 'data', 'studentCount', 'studentSet', 'exam_locationManageService', 'alertService'];


    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, id, exam_locationManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true;
            exam_locationManageService.delete(id, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examLocationSetTable').bootstrapTable('refresh');
                    angular.element('#examDatetimeTable').bootstrapTable('refresh');
                    //alertService('success', '删除成功');
                }
                $uibModalInstance.close();
            });

        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'id', 'exam_locationManageService', 'alertService'];

    //指定地点
    var finalExamSetLocationController = function($scope, $rootScope, baseinfo_generalService, app, examClassId, $uibModalInstance, $compile, exam_locationManageService, alertService){
        $scope.roomInfo = {};

        //校区
        baseinfo_generalService.findCampusNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.campusId = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.campusNumber as plateObj.campusName  for plateObj in campusId" '
                +  ' ng-model="roomInfo.campusId" id="campusId" name="campusId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#campusId").parent().empty().append(html);
            $compile(angular.element("#campusId").parent().contents())($scope);
        });

        //教学楼
        baseinfo_generalService.teachingBuildingPull(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.teachingBuilding = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.code as plateObj.name  for plateObj in teachingBuilding" '
                +  ' ng-model="roomInfo.teachingBuilding" id="teachingBuilding" name="teachingBuilding" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#teachingBuilding").parent().empty().append(html);
            $compile(angular.element("#teachingBuilding").parent().contents())($scope);
        });

        //教室类型
        baseinfo_generalService.findcodedataNames({datableNumber: "JSLXM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.classType = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in classType" '
                +  ' ng-model="roomInfo.classType" id="classType" name="classType" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#classType").parent().empty().append(html);
            $compile(angular.element("#classType").parent().contents())($scope);
        });

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.roomInfo);
        };

        $scope.classroomInfoTable = {
            //url: 'data_test/exam/tableview_classroomInfo.json',
            url:app.api.address + '/exam/formalManage/classRoomInfo',
            method: 'get',
            cache: false,
            height: 357,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
			onLoadSuccess: function() {
				$compile(angular.element('#examLocationSetTable').contents())($scope);
			},
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"campus",title:"校区",align:"center",valign:"middle"},
                {field:"buildingName",title:"教学楼名称",align:"center",valign:"middle"},
                {field:"classRoomNum",title:"教室号",align:"center",valign:"middle"},
                {field:"type",title:"教室类型",align:"center",valign:"middle"},
                {field:"floor",title:"所属楼层",align:"center",valign:"middle"},
                {field:"seatCount",title:"座位数",align:"center",valign:"middle"},
                {field:"examSeatCount",title:"考试座位数",align:"center",valign:"middle"},
                {field:"dept",title:"管理单位",align:"center",valign:"middle"}
            ]
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#classroomInfoTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examLocationManage = {};
            angular.element('form[name="classroomInfoSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#classroomInfoTable').bootstrapTable('refresh');
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 155;
            } else {
                $scope.table_height = $scope.table_height - 155;
            }
            angular.element('#classroomInfoTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (form) {
            var rows = angular.element('#classroomInfoTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要添加的项');
                return;
            }
            for(var i = 0; i<rows.length; i++){
                rows[i].examClassId = examClassId
            }
            $rootScope.showLoading = true; // 加载提示
            exam_locationManageService.add(rows,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '保存成功');
                    angular.element('#examLocationSetTable').bootstrapTable('refresh');
                    angular.element('#examDatetimeTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
    }
    finalExamSetLocationController.$inject = ['$scope', '$rootScope', 'baseinfo_generalService', 'app', 'examClassId', '$uibModalInstance', '$compile', 'exam_locationManageService', 'alertService'];
})(window);
