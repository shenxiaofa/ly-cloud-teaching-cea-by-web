/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试资格管理Controller
    window.exam_qualificationManageController = function($scope, app, $compile, baseinfo_generalService, $uibModal, $rootScope, $window, exam_qualificationManageService, alertService){

        // 表格的高度
        $scope.table_height = $window.innerHeight - 223;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.examQualification);
        }
        //考试方式
        baseinfo_generalService.findcodedataNames({datableNumber: "KSFSDM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in semesterObjs" '
                +  ' ng-model="examQualification.examWay" id="examWay" name="examWay" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#examWay").parent().empty().append(html);
            $compile(angular.element("#examWay").parent().contents())($scope);
        });


        $scope.examQualificationTable = {
            url:app.api.address + '/exam/testTask/examQualifications',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examQualificationTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"examWay",title:"考试方式",align:"center",valign:"middle"},
                {field:"noExamQualificationsType",title:"无考试资格类型",align:"center",valign:"middle"},
                {field:"noExamQualificationsReason",title:"无考试资格原因",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        return "<button  type='button' ng-click='update(" + JSON.stringify(row) + ")' class='btn btn-default'>修改</button>";
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
            angular.element('#examQualificationTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#examQualificationTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examQualification = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examQualificationTable').bootstrapTable('refresh');
        };

        // 打开新增面板
        $scope.add = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examQualificationManage/index_add.html',
                size: 'lg',
                controller: examQualificationAdd
            });
        };
        // 打开修改面板
        $scope.update = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/finalExamManage/examQualificationManage/index_update.html',
                size: 'lg',
                resolve: {
                    items: function () {
                        return row;
                    },
                },
                controller: examQualificationUpdate
            });
        };
        // 打开删除面板
        $scope.delete = function(){
            var rows = $('#examQualificationTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要删除的项');
                return;
            }
            $uibModal.open({
                animation: true,
                templateUrl: 'tpl/exam/finalExamManage/examQualificationManage/index_delete.html',
                size: '',
                resolve: {
                    items: function () {
                        return rows;
                    },
                },
                controller: examQualificationDelete
            });
        };
    }
    exam_qualificationManageController.$inject = ['$scope', 'app', '$compile', 'baseinfo_generalService', '$uibModal', '$rootScope', '$window', 'exam_qualificationManageService', 'alertService'];

    //添加控制器
    var examQualificationAdd =  function ($scope, $rootScope, app, $compile, alertService, baseinfo_generalService, $uibModalInstance, exam_qualificationManageService){

        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="student.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        //专业
        exam_qualificationManageService.majorPull(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.nationProfession = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in nationProfession" '
                +  ' ng-model="student.majorId" id="majorId" name="majorId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#majorId").parent().empty().append(html);
            $compile(angular.element("#majorId").parent().contents())($scope);
        });
        //招生单位
        exam_qualificationManageService.deptPull(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.dept = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in dept" '
                +  ' ng-model="student.deptId" id="deptId" name="deptId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#deptId").parent().empty().append(html);
            $compile(angular.element("#deptId").parent().contents())($scope);
        });

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
            };
            return angular.extend(pageParam, $scope.student);
        };
        $scope.examQualificationAddTable = {
            url:app.api.address + '/exam/testTask/examStudents',
            method: 'get',
            cache: false,
            height: 321,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examQualificationTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"totalHour",title:"课程学时",align:"center",valign:"middle"},
                {field:"credit",title:"课程学分",align:"center",valign:"middle"},
                {field:"dept",title:"院系",align:"center",valign:"middle"},
                {field:"major",title:"专业",align:"center",valign:"middle"},
                {field:"grade",title:"年级",align:"center",valign:"middle"},
                {field:"className",title:"班级",align:"center",valign:"middle"}
            ]
        }
        $scope.student = {
        }

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#examQualificationAddTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.student = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examQualificationAddTable').bootstrapTable('refresh');
        };

        //取消
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        //确认
        $scope.ok = function () {
            var rows = $('#examQualificationAddTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要转入的项');
                return;
            }
            $rootScope.showLoading = true; // 开启加载提示
            exam_qualificationManageService.add(rows,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examQualificationTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
    }
    examQualificationAdd.$inject = ['$scope', '$rootScope', 'app', '$compile', 'alertService', 'baseinfo_generalService', '$uibModalInstance', 'exam_qualificationManageService'];


    // 删除控制器
    var examQualificationDelete = function ($scope, $rootScope, alertService, $uibModalInstance, items, exam_qualificationManageService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            var ids = []; // 培养方案编制控制编号集合
            items.forEach (function(student) {
                ids.push(student.id);
            });
            $rootScope.showLoading = true; // 开启加载提示
            exam_qualificationManageService.delete(ids,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '删除成功');
                    angular.element('#examQualificationTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    examQualificationDelete.$inject = ['$scope', '$rootScope', 'alertService', '$uibModalInstance', 'items', 'exam_qualificationManageService'];
    // 修改控制器
    var examQualificationUpdate = function ($scope, $rootScope, $compile, baseinfo_generalService, alertService, $uibModalInstance, items, exam_qualificationManageService) {
        $scope.stu = items;

        //无资格类别
        baseinfo_generalService.findcodedataNames({datableNumber: "WKSZGLBDM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in semesterObjs" '
                +  ' ng-model="stu.noExamQualificationsTypeCode" id="noExamQualificationsTypeCode" name="noExamQualificationsTypeCode" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#noExamQualificationsTypeCode").parent().empty().append(html);
            $compile(angular.element("#noExamQualificationsTypeCode").parent().contents())($scope);
        });

        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            exam_qualificationManageService.update($scope.stu,function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }else{
                    alertService('success', '修改成功');
                    angular.element('#examQualificationTable').bootstrapTable('refresh');
                    $uibModalInstance.close();
                }

            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    examQualificationUpdate.$inject = ['$scope', '$rootScope0', '$compile', 'baseinfo_generalService', 'alertService', '$uibModalInstance', 'items', 'exam_qualificationManageService'];
})(window);
