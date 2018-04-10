/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //监考教师管理Controller
    window.exam_teacherManageController = function($scope, $filter, baseinfo_generalService, app, $uibModal, $compile, $window, $rootScope, exam_teacherManageservice, alertService) {

        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examTeacherManage.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
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
            return angular.extend(pageParam, $scope.examTeacherManage);
        };

        $scope.examDatetimeTable = {
            url:app.api.address + '/exam/formalManage/findExamLocationInfo',
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
            idField : "kcbh", // 指定主键列
            uniqueId: "kcbh", // 每行唯一标识
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
                {field:"locationName",title:"考试地点",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var btn = "<button id='btn_teacherSet' type='button' ng-click='teacherSet(" + JSON.stringify(row) + ")' class='btn btn-default'>维护监考教师</button>";
                        return btn;

                    }
                }
            ]
        };

        $scope.examTeacherManage={};
        // 开始日期参数配置
        $scope.ksrqOptions = {
            opened: false,
            open: function() {
                $scope.ksrqOptions.opened = true;
            },
            changed : function () {
                $scope.examTeacherManage.startTime = $scope.examTeacherManage.startDate;
            }
        };
        // 结束日期参数配置
        $scope.jsrqOptions = {
            opened: false,
            open: function() {
                $scope.jsrqOptions.opened = true;
            },
            changed : function () {
                $scope.examTeacherManage.endTime = $scope.examTeacherManage.endDate;
            }
        };
        // 结束日期小于开始日期时的提示
        $scope.jsrqTooltipEnableAndOpen = false;
        $scope.$watch('examTeacherManage.endTime', function (newValue) {
            if ($scope.examTeacherManage.startTime && newValue && (newValue < $scope.examTeacherManage.startTime)) {
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
            $scope.examTeacherManage.startTime =  $filter("date")( $scope.examTeacherManage.startTime, app.date.format);
            $scope.examTeacherManage.endTime =  $filter("date")( $scope.examTeacherManage.endTime, app.date.format);
            angular.element('#examDatetimeTable').bootstrapTable('selectPage', 1);
        }; 
        
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examTeacherManage = {};
            angular.element('form[name="examTeacherManageSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examDatetimeTable').bootstrapTable('refresh');
        };

        //教师指定
        $scope.teacherSet = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examTeacherManage/teacherSet.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: finalExamTeacherSetController
            });
        }
    }
    exam_teacherManageController.$inject = ['$scope', '$filter', 'baseinfo_generalService', 'app', '$uibModal', '$compile', '$window', '$rootScope', 'exam_teacherManageservice', 'alertService'];

    //教师指定
    var finalExamTeacherSetController = function($scope, app, $uibModalInstance, $compile, $uibModal, item, exam_teacherManageservice){
        $scope.classInfo = {};
        $scope.classInfo.locationName=item.locationName;
        $scope.classInfo.courseNum=item.courseNum;
        $scope.classInfo.courseName=item.courseName;
        $scope.classInfo.dept=item.dept;
        $scope.classInfo.credit=item.credit;
        $scope.classInfo.studentCount=item.studentCount;
        $scope.classInfo.teacherCount=item.teacherCount;

        $scope.teacherSetTable = {
            url:app.api.address + '/exam/formalManage/findTeacherByExamLocation?examLocationId='+item.locationId,
            method: 'get',
            cache: false,
            height: 357,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: false,
            pagination: false,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
			onLoadSuccess: function() {
				$compile(angular.element('#teacherSetTable').contents())($scope);
			},
            responseHandler:function(response){
                response.data.total = "";
                response.data.rows = response.data;
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"id",title:"工号",align:"center",valign:"middle"},
                {field:"name",title:"姓名",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"idNumber",title:"身份证号",align:"center",valign:"middle"},
                {field:"title",title:"现任职称",align:"center",valign:"middle"},
                {field:"dept",title:"所属单位",align:"center",valign:"middle"},
                {field:"teacherCategory",title:"教师类别",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        var btn = "<button id='btn_teacherDelete' type='button' ng-click='teacherDelete(" + JSON.stringify(row) + ")' class='btn btn-default del-btn'>删除</button>";
                        return btn;

                    }
                }
            ]
        }

        $scope.teacherDelete = function(row){
            
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examTeacherManage/teacherDelete.html',
                size: '',
                resolve: {
                    items: function () {
                        return row;
                    },
                },
                controller: teacherDeleteController
            });
        };
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.teacherAdd = function(){
            // $uibModalInstance.close();
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examArrangeManage/examTeacherManage/teacherAdd.html',
                size: 'lg',
                resolve: {
                    locationId: function () {
                        return item.locationId;
                    }
                },
                controller: finalExamTeacherAddController
            });
        }
    }
    finalExamTeacherSetController.$inject = ['$scope', 'app', '$uibModalInstance', '$compile', '$uibModal', 'item', 'exam_teacherManageservice'];

    // 删除控制器
    var teacherDeleteController = function ($scope, $rootScope, alertService, $uibModalInstance, items, exam_teacherManageservice) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 加载提示
            exam_teacherManageservice.delete(items.locationTeacherId,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '删除成功');
                    angular.element('#teacherSetTable').bootstrapTable('refresh');
                }

            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    teacherDeleteController.$inject = ['$scope', '$rootScope', 'alertService', '$uibModalInstance', 'items', 'exam_teacherManageservice'];


    var finalExamTeacherAddController = function($scope, $rootScope, baseinfo_generalService, app, locationId, $compile, $uibModalInstance, exam_teacherManageservice, alertService) {
        //性别
        baseinfo_generalService.findcodedataNames({datableNumber: "XBM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.sexCode = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in sexCode" '
                +  ' ng-model="teacherInfo.sexCode" id="sexCode" name="sexCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#sexCode").parent().empty().append(html);
            $compile(angular.element("#sexCode").parent().contents())($scope);
        });
        //单位
        baseinfo_generalService.findDepartmentNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.dept_Id = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.departmentNumber as plateObj.departmentName  for plateObj in dept_Id" '
                +  ' ng-model="teacherInfo.dept_Id" id="dept_Id" name="dept_Id" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#dept_Id").parent().empty().append(html);
            $compile(angular.element("#dept_Id").parent().contents())($scope);
        });
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.teacherInfo);
        };

        $scope.teacherInfoTable = {
            url:app.api.address + '/exam/teacher',
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
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "gh", // 指定主键列
            uniqueId: "gh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#teacherInfoTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"id",title:"工号",align:"center",valign:"middle"},
                {field:"name",title:"姓名",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"idNumber",title:"身份证号",align:"center",valign:"middle"},
                {field:"title",title:"现任职称",align:"center",valign:"middle"},
                {field:"dept",title:"所属单位",align:"center",valign:"middle"},
                {field:"teacherCategory",title:"教师类别",align:"center",valign:"middle"}
            ]
        };
       
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#teacherInfoTable').bootstrapTable('selectPage', 1);
        }; 
        
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.teacherInfo = {};
            angular.element('form[name="teacherInfoTable"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#teacherInfoTable').bootstrapTable('refresh');
        };

        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function () {
            var rows = angular.element('#teacherInfoTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要添加的教师');
                return;
            }
            var ids = []; // 培养方案编制控制编号集合
            rows.forEach (function(jkjs) {
                ids.push(jkjs.id);
            });
            var data = {
                locationId : locationId,
                teacherId : ids
            }
            $rootScope.showLoading = true; // 加载提示
            exam_teacherManageservice.add(data,function (error, message,data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '安排成功');
                    angular.element('#teacherSetTable').bootstrapTable('refresh');
                }
            });
            $uibModalInstance.close();
        };

    }

    finalExamTeacherAddController.$inject = ['$scope', '$rootScope', 'baseinfo_generalService', 'app', 'locationId', '$compile', '$uibModalInstance', 'exam_teacherManageservice', 'alertService'];
})(window);
