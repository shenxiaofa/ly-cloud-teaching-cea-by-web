;(function (window, undefined) {
    'use strict';

    window.student_schoolTransactionController = function ($compile, $state, $scope, $uibModal, $rootScope, $window, student_schoolTransactionService, baseinfo_generalService, alertService, app) {
        $scope.schoolTransaction = {};
        // 初始化下拉框数据
        initIndexMetaData($scope, baseinfo_generalService, alertService, $compile);
        // 初始化页面表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/schoolTransaction/add.html',
                size: 'lg',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/schoolTransaction/modify.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openModifyController
            });
        };
        // 打开删除面板
        $scope.openDelete = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/schoolTransaction/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openDeleteController
            });
        };
    };
    student_schoolTransactionController.$inject = ['$compile', '$state', '$scope', '$uibModal', '$rootScope', '$window', 'student_schoolTransactionService', 'baseinfo_generalService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $window, $compile, $scope, $uibModalInstance, $uibModal, student_schoolTransactionService, baseinfo_generalService, formVerifyService, alertService, app) {
        // 初始化面板表格
        initAddTable($uibModal, $scope, $window, $rootScope, $compile, app);
        // 打开进行异动面板
        $scope.openAdd = function(){
            var rows = angular.element('#selectStudentTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择要异动的学生');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/schoolTransaction/input.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return rows[0];
                    },
                },
                controller: openInputController
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$window', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'student_schoolTransactionService', 'baseinfo_generalService', 'formVerifyService', 'alertService', 'app'];

    // 修改控制器
    var openModifyController = function ($rootScope, $filter, $timeout, $compile, $scope, $uibModalInstance, item, student_schoolTransactionService, baseinfo_generalService, alertService, formVerifyService, app) {
        // 学生当前情况
        $scope.student = {};
        // 异动后情况
        $scope.schoolTransaction = {};
        // 根据学号获取学籍信息
        student_schoolTransactionService.findStudentByNum(item.stuNumber, 'schoolTransaction:update', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.student = data;
            $scope.schoolTransaction = {
                stuNumber: data.num, // 学号
                tSource: '录入', // 异动来源
                oCampus: data.campusId, // 原校区
                oSchoolCondition: data.schoolCondition, // 原在校状况
                oCollegeNumber: data.deptId, // 原学院号
                oProfessionalNumber: data.majorId, // 原专业号
                oGrade: data.grade, // 原年级
                oClassNumber: data.executiveClassId, // 原班号
                oSchoolState: data.currentStatusCode // 原学籍状态
            };
        });
        // 异动日期参数配置
        $scope.tDateOptions = {
            opened: false,
            open: function() {
                $scope.tDateOptions.opened = true;
            }
        };
        // 发文日期参数配置
        $scope.dispDateOptions = {
            opened: false,
            open: function() {
                $scope.dispDateOptions.opened = true;
            }
        };
        // 根据学籍异动ID获取学籍异动信息
        student_schoolTransactionService.findById(item.id, 'schoolTransaction:update', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.schoolTransaction = data;
            $scope.schoolTransaction.tSource = '录入'; // 异动来源
            // 初始化下拉框数据
            initModifyMetaData($scope, baseinfo_generalService, alertService, $compile);
        });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            $rootScope.showLoading = true; // 开启加载提示
            student_schoolTransactionService.update($scope.schoolTransaction, 'schoolTransaction:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#schoolTransactionTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$filter', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'student_schoolTransactionService', 'baseinfo_generalService', 'alertService', 'formVerifyService', 'app'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, student_schoolTransactionService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            student_schoolTransactionService.delete(item.id, 'schoolTransaction:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#schoolTransactionTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'student_schoolTransactionService', 'alertService'];

    // 初始化页面表格
    var initIndexTable = function ($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 264;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var schoolTransactionQuery = {};
            angular.forEach($scope.schoolTransaction, function(data, index, array){
                if (data) {
                    schoolTransactionQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, schoolTransactionQuery));
            return angular.extend(pageParam, schoolTransactionQuery);
        };
        $scope.schoolTransactionTable = {
            //url: 'data_test/student/tableview_schoolTransaction.json',
            url: app.api.address + '/student/schoolTransaction',
            headers: {
                permission: "schoolTransaction:query"
            },
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.rows
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#schoolTransactionTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#schoolTransactionTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
                {field: "id", title: "学籍异动信息ID", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    var page = angular.element('#schoolTransactionTable').bootstrapTable("getPage");
                    return page.pageSize * (page.pageNumber-1) + (index + 1);
                }},
                {field: "basicExaNumber", title: "考生号", align: "left", valign: "middle"},
                {field: "basicName", title: "姓名", align: "left", valign: "middle"},
                {field: "classCodeName", title: "异动类型", align: "left", valign: "middle"},
                {field: "approvalDate", title: "批准日期", align: "left", valign: "middle"},
                {field: "dispNumber", title: "文号", align: "left", valign: "middle"},
                {field: "tReasonName", title: "原因", align: "left", valign: "middle"},
                {field: "tExplain", title: "说明", align: "left", valign: "middle"},
                {field: "rollStandard", title: "专业代码", align: "left", valign: "middle"},
                {field: "rollStandardName", title: "专业名称", align: "left", valign: "middle"},
                {field: "rollStateName", title: "学籍", align: "left", valign: "middle"},
                {field: "rollGrade", title: "当前所在年级", align: "left", valign: "middle"},
                {field: "stuNumber", title: "学号", align: "left", valign: "middle"},
                {field: "rollCollegeNumName", title: "分院", align: "left", valign: "middle"},
                {field: "rollDepartmentName", title: "系(所、函授站)", align: "left", valign: "middle"},
                {field: "rollClassName", title: "班级", align: "left", valign: "middle"},
                {field: "rollPredGradDate", title: "预计毕业日期", align: "left", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='schoolTransaction:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='schoolTransaction:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
                        return modifyBtn + "&nbsp;" + deleteBtn;
                    }
                }
            ]
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
            angular.element('#schoolTransactionTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#schoolTransactionTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.schoolTransaction = {};
            // 重新初始化下拉框
            angular.element('form[name="schoolTransactionSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#schoolTransactionTable').bootstrapTable('selectPage', 1);
        }
    }

    // 初始化主页面板下拉框数据
    var initIndexMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
        // 异动类型
        $scope.classCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findcodedataNames('schoolTransaction:query',{datableNumber: "YDLBDM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.classCodeData = $scope.classCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.classCode" id="classCode" name="classCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="classCodeItem in classCodeData" value="{{classCodeItem.dataNumber}}">{{classCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#classCode").parent().empty().append(html);
            $compile(angular.element("#classCode").parent().contents())($scope);
        });
        // 国标专业
        $scope.rollStandardData = [
            {
                code: '',
                name: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findNationProfessionPull("schoolTransaction:query",function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.rollStandardData = $scope.rollStandardData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.rollStandard" id="rollStandard" name="rollStandard" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="rollStandardItem in rollStandardData" value="{{rollStandardItem.code}}">{{rollStandardItem.name}}</option>' +
                '</select>';
            angular.element("#rollStandard").parent().empty().append(html);
            $compile(angular.element("#rollStandard").parent().contents())($scope);
        });
        // 学院
        $scope.rollCollegeNumData = [
            {
                departmentNumber: '',
                departmentName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findDepartmentNamesBox("schoolTransaction:query",function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.rollCollegeNumData = $scope.rollCollegeNumData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.rollCollegeNum" id="rollCollegeNum" name="rollCollegeNum" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="rollCollegeNumItem in rollCollegeNumData" value="{{rollCollegeNumItem.departmentNumber}}">{{rollCollegeNumItem.departmentName}}</option>' +
                '</select>';
            angular.element("#rollCollegeNum").parent().empty().append(html);
            $compile(angular.element("#rollCollegeNum").parent().contents())($scope);
        });
        // 当前所在年级
        $scope.rollGradeData = [
            {
                id: '',
                dataNumber: '== 请选择 =='
            }
        ];
        baseinfo_generalService.gradeList("schoolTransaction:query",function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                var gradeList = [];
                angular.forEach(data.data, function(grade, index){
                    gradeList.push({
                        id: grade.dataNumber,
                        dataNumber: grade.dataNumber
                    });
                });
                $scope.rollGradeData = $scope.rollGradeData.concat(gradeList);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.rollGrade" id="rollGrade" name="rollGrade" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="rollGradeItem in rollGradeData" value="{{rollGradeItem.id}}">{{rollGradeItem.dataNumber}}</option>' +
                '</select>';
            angular.element("#rollGrade").parent().empty().append(html);
            $compile(angular.element("#rollGrade").parent().contents())($scope);
        });
    }

    // 初始化新增面板表格
    var initAddTable = function ($uibModal, $scope, $window, $rootScope, $compile, app) {
        // 学生查询对象
        $scope.student = {};
        // 表格的高度
        $scope.table_height = $window.innerHeight - 435;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var studentQuery = {};
            // 学号/姓名
            $scope.student.name =  $scope.student.name;
            angular.forEach($scope.student, function(data, index, array){
                if (data) {
                    studentQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, studentQuery));
            return angular.extend(pageParam, studentQuery);
        };
        $scope.selectStudentTable = {
            url: app.api.address + '/student/statusInfo',
            headers: {
                permission: "schoolTransaction:insert"
            },
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#selectStudentToolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: false,
            showRefresh: false,
            singleSelect: true, // 单选
            clickToSelect: true, // 单击行选中
            classes: 'table table-hover table-selector', // 自定义样式，默认是 'table table-hover'
            formatRecordsPerPage: function (a) {
                return '';
            },
            formatShowingRows: function (a,b,c) {
                return '';
            },
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.rows
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#selectStudentTable').contents())($scope);
            },
            columns: [
                {radio: true, width: "5%"},
                {field: "id", title: "学生ID", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    var page = angular.element('#selectStudentTable').bootstrapTable("getPage");
                    return page.pageSize * (page.pageNumber-1) + (index + 1);
                }},
                {field: "num", title: "学生学号", align: "left", valign: "middle" },
                {field: "name", title: "学生姓名", align: "left", valign: "middle"},
                {field: "sex", title: "学生性别", align: "left", valign: "middle"},
                {field: "executiveClassName", title: "行政班级", align: "left", valign: "middle"}
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
            angular.element('#selectStudentTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#selectStudentTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.reportRegister = {};
            // 重新初始化下拉框
            angular.element('form[name="studentSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#selectStudentTable').bootstrapTable('selectPage', 1);
        }
    }

    // 进行异动控制器
    var openInputController = function ($rootScope, $filter, $compile, $scope, $uibModalInstance, $uibModal, student_schoolTransactionService, baseinfo_generalService, formVerifyService, alertService, item, app) {
        // 学生当前情况
        $scope.student = {};
        // 异动后情况
        $scope.schoolTransaction = {};
        // 根据学号获取学籍信息
        student_schoolTransactionService.findStudentByNum(item.num, 'schoolTransaction:query', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.student = data;
            $scope.schoolTransaction = {
                stuNumber: data.num, // 学号
                tSource: '录入', // 异动来源
                oCampus: data.campusId, // 原校区
                oSchoolCondition: data.schoolCondition, // 原在校状况
                oCollegeNumber: data.deptId, // 原学院号
                oProfessionalNumber: data.majorId, // 原专业号
                oGrade: data.grade, // 原年级
                oClassNumber: data.executiveClassId, // 原班号
                oSchoolState: data.currentStatusCode // 原学籍状态
            };
        });
        // 异动日期参数配置
        $scope.tDateOptions = {
            opened: false,
            open: function() {
                $scope.tDateOptions.opened = true;
            }
        };
        // 发文日期参数配置
        $scope.dispDateOptions = {
            opened: false,
            open: function() {
                $scope.dispDateOptions.opened = true;
            }
        };
        // 初始化下拉框数据
        initInputMetaData($scope, baseinfo_generalService, alertService, $compile);
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            $rootScope.showLoading = true; // 开启加载提示
            student_schoolTransactionService.add($scope.schoolTransaction, 'schoolTransaction:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#schoolTransactionTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openInputController.$inject = ['$rootScope', '$filter', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'student_schoolTransactionService', 'baseinfo_generalService', 'formVerifyService', 'alertService', 'item', 'app'];

    // 初始化进行异动面板下拉框数据
    var initInputMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
        // 异动类型
        $scope.classCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findcodedataNames({datableNumber: "YDLBDM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.classCodeData = $scope.classCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.classCode" ui-chosen="schoolTransactionAddform.classCode" ng-required="true" id="classCode_select" name="classCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="classCodeItem in classCodeData" value="{{classCodeItem.dataNumber}}">{{classCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#classCode_select").parent().empty().append(html);
            $compile(angular.element("#classCode_select").parent().contents())($scope);
        });
        // 异动原因
        $scope.tReasonData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findcodedataNames({datableNumber: "YDYY"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.tReasonData = $scope.tReasonData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.tReason" ui-chosen="schoolTransactionAddform.tReason" ng-required="true" id="tReason_select" name="tReason" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="tReasonItem in tReasonData" value="{{tReasonItem.dataNumber}}">{{tReasonItem.dataName}}</option>' +
                '</select>';
            angular.element("#tReason_select").parent().empty().append(html);
            $compile(angular.element("#tReason_select").parent().contents())($scope);
        });
        // 学年学期
        $scope.semesterIdData = [
            {
                id: '',
                acadYearSemester: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.semesterIdData = $scope.semesterIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.semesterId" ui-chosen="schoolTransactionAddform.semesterId" ng-required="true" id="semesterId_select" name="semesterId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="semesterIdItem in semesterIdData" value="{{semesterIdItem.id}}">{{semesterIdItem.acadYearSemester}}</option>' +
                '</select>';
            angular.element("#semesterId_select").parent().empty().append(html);
            $compile(angular.element("#semesterId_select").parent().contents())($scope);
        });
        // 院系名称
        $scope.deptIdData = [
            {
                departmentNumber: '',
                departmentName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.deptIdData = $scope.deptIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.deptId" id="deptId_select" name="deptId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="deptIdItem in deptIdData" value="{{deptIdItem.departmentNumber}}">{{deptIdItem.departmentName}}</option>' +
                '</select>';
            angular.element("#deptId_select").parent().empty().append(html);
            $compile(angular.element("#deptId_select").parent().contents())($scope);
        });
        // 所在年级
        $scope.gradeData = [
            {
                id: '',
                dataNumber: '== 请选择 =='
            }
        ];
        baseinfo_generalService.gradeList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                var gradeList = [];
                angular.forEach(data.data, function(grade, index){
                    gradeList.push({
                        id: grade.dataNumber,
                        dataNumber: grade.dataNumber
                    });
                });
                $scope.gradeData = $scope.gradeData.concat(gradeList);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.grade" id="grade_select" name="grade" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="gradeItem in gradeData" value="{{gradeItem.id}}">{{gradeItem.dataNumber}}</option>' +
                '</select>';
            angular.element("#grade_select").parent().empty().append(html);
            $compile(angular.element("#grade_select").parent().contents())($scope);
        });
        // 专业名称
        $scope.tProfessionalNumberData = [
            {
                code: '',
                name: '== 请选择 =='
            }
        ];
        baseinfo_generalService.gradeProfessionPull({}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.tProfessionalNumberData = $scope.tProfessionalNumberData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.tProfessionalNumber" id="tProfessionalNumber_select" name="tProfessionalNumber" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="tProfessionalNumberItem in tProfessionalNumberData" value="{{tProfessionalNumberItem.code}}">{{tProfessionalNumberItem.name}}</option>' +
                '</select>';
            angular.element("#tProfessionalNumber_select").parent().empty().append(html);
            $compile(angular.element("#tProfessionalNumber_select").parent().contents())($scope);
        });
        // 班级名称
        $scope.tClassNumberData = [
            {
                id: '',
                name: '== 请选择 =='
            }
        ];
        baseinfo_generalService.classList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.tClassNumberData = $scope.tClassNumberData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.tClassNumber" ui-chosen="schoolTransactionAddform.tClassNumber" ng-required="true" id="tClassNumber_select" name="tClassNumber" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="tClassNumberItem in tClassNumberData" value="{{tClassNumberItem.id}}">{{tClassNumberItem.name}}</option>' +
                '</select>';
            angular.element("#tClassNumber_select").parent().empty().append(html);
            $compile(angular.element("#tClassNumber_select").parent().contents())($scope);
        });
    }

    // 初始化修改面板下拉框数据
    var initModifyMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
        // 异动类型
        $scope.classCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findcodedataNames('schoolTransaction:update',{datableNumber: "YDLBDM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.classCodeData = $scope.classCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.classCode" ui-chosen="schoolTransactionAddform.classCode" ng-required="true" id="classCode_select" name="classCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="classCodeItem in classCodeData" value="{{classCodeItem.dataNumber}}">{{classCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#classCode_select").parent().empty().append(html);
            $compile(angular.element("#classCode_select").parent().contents())($scope);
        });
        // 异动原因
        $scope.tReasonData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findcodedataNames('schoolTransaction:update',{datableNumber: "YDYY"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.tReasonData = $scope.tReasonData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.tReason" ui-chosen="schoolTransactionAddform.tReason" ng-required="true" id="tReason_select" name="tReason" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="tReasonItem in tReasonData" value="{{tReasonItem.dataNumber}}">{{tReasonItem.dataName}}</option>' +
                '</select>';
            angular.element("#tReason_select").parent().empty().append(html);
            $compile(angular.element("#tReason_select").parent().contents())($scope);
        });
        // 学年学期
        $scope.semesterIdData = [
            {
                id: '',
                acadYearSemester: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findAcadyeartermNamesBox('schoolTransaction:update',function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.semesterIdData = $scope.semesterIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.semesterId" ui-chosen="schoolTransactionAddform.semesterId" ng-required="true" id="semesterId_select" name="semesterId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="semesterIdItem in semesterIdData" value="{{semesterIdItem.id}}">{{semesterIdItem.acadYearSemester}}</option>' +
                '</select>';
            angular.element("#semesterId_select").parent().empty().append(html);
            $compile(angular.element("#semesterId_select").parent().contents())($scope);
        });
        // 院系名称
        $scope.deptIdData = [
            {
                departmentNumber: '',
                departmentName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findDepartmentNamesBox('schoolTransaction:update',function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.deptIdData = $scope.deptIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.deptId" id="deptId_select" name="deptId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="deptIdItem in deptIdData" value="{{deptIdItem.departmentNumber}}">{{deptIdItem.departmentName}}</option>' +
                '</select>';
            angular.element("#deptId_select").parent().empty().append(html);
            $compile(angular.element("#deptId_select").parent().contents())($scope);
        });
        // 所在年级
        $scope.gradeData = [
            {
                id: '',
                dataNumber: '== 请选择 =='
            }
        ];
        baseinfo_generalService.gradeList('schoolTransaction:update',function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                var gradeList = [];
                angular.forEach(data.data, function(grade, index){
                    gradeList.push({
                        id: grade.dataNumber,
                        dataNumber: grade.dataNumber
                    });
                });
                $scope.gradeData = $scope.gradeData.concat(gradeList);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.grade" id="grade_select" name="grade" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="gradeItem in gradeData" value="{{gradeItem.id}}">{{gradeItem.dataNumber}}</option>' +
                '</select>';
            angular.element("#grade_select").parent().empty().append(html);
            $compile(angular.element("#grade_select").parent().contents())($scope);
        });
        // 专业名称
        $scope.tProfessionalNumberData = [
            {
                code: '',
                name: '== 请选择 =='
            }
        ];
        baseinfo_generalService.gradeProfessionPull('schoolTransaction:update',{}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.tProfessionalNumberData = $scope.tProfessionalNumberData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.tProfessionalNumber" id="tProfessionalNumber_select" name="tProfessionalNumber" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="tProfessionalNumberItem in tProfessionalNumberData" value="{{tProfessionalNumberItem.code}}">{{tProfessionalNumberItem.name}}</option>' +
                '</select>';
            angular.element("#tProfessionalNumber_select").parent().empty().append(html);
            $compile(angular.element("#tProfessionalNumber_select").parent().contents())($scope);
        });
        // 班级名称
        $scope.tClassNumberData = [
            {
                id: '',
                name: '== 请选择 =='
            }
        ];
        baseinfo_generalService.classList('schoolTransaction:update',function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.tClassNumberData = $scope.tClassNumberData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="schoolTransaction.tClassNumber" ui-chosen="schoolTransactionAddform.tClassNumber" ng-required="true" id="tClassNumber_select" name="tClassNumber" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="tClassNumberItem in tClassNumberData" value="{{tClassNumberItem.id}}">{{tClassNumberItem.name}}</option>' +
                '</select>';
            angular.element("#tClassNumber_select").parent().empty().append(html);
            $compile(angular.element("#tClassNumber_select").parent().contents())($scope);
        });
    }

})(window);
