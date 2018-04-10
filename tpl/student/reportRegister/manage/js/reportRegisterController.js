;(function (window, undefined) {
    'use strict';

    window.student_reportRegisterController = function ($compile, $scope, $uibModal, $rootScope, $window, student_reportRegisterService, baseinfo_generalService, alertService, app) {
        // 初始化下拉框数据
        initIndexMetaData($scope, baseinfo_generalService, alertService, $compile);
        // 初始化页面表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 打开批量注册面板
        $scope.openBatchAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/reportRegister/manage/batchAdd.html',
                size: 'lg',
                controller: openBatchAddController
            });
        };
        // 打开注册面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/reportRegister/manage/add.html',
                size: 'lg',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/reportRegister/manage/modify.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openModifyController
            });
        };
    };
    student_reportRegisterController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'student_reportRegisterService', 'baseinfo_generalService', 'alertService', 'app'];

    // 批量注册控制器
    var openBatchAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, student_reportRegisterService, baseinfo_generalService, formVerifyService, alertService, app) {
        // 初始化下拉框数据
        initBatchAddMetaData($scope, baseinfo_generalService, alertService, $compile);
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            $rootScope.showLoading = true; // 开启加载提示
            student_reportRegisterService.batchAdd($scope.reportRegister, 'reportRegister:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#reportRegisterTable').bootstrapTable('refresh');
                alertService('success', '批量注册成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openBatchAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'student_reportRegisterService', 'baseinfo_generalService', 'formVerifyService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, $window, student_reportRegisterService, baseinfo_generalService, formVerifyService, alertService, app) {
        $scope.reportRegister = {};
        // 初始化面板表格
        initAddTable($scope, $window, $rootScope, $compile, app);
        // 初始化下拉框数据
        initAddMetaData($scope, baseinfo_generalService, alertService, $compile);
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            // 注册方式，默认是 2（录入）
            $scope.reportRegister.registerWay = '2';
            $rootScope.showLoading = true; // 开启加载提示
            student_reportRegisterService.add($scope.reportRegister, 'reportRegister:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#reportRegisterTable').bootstrapTable('refresh');
                alertService('success', '注册成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', '$window', 'student_reportRegisterService', 'baseinfo_generalService', 'formVerifyService', 'alertService', 'app'];

    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, student_reportRegisterService, baseinfo_generalService, alertService, formVerifyService, app) {
        // 初始化数据
        $scope.reportRegister = {};
        student_reportRegisterService.findById(item.id, 'reportRegister:update', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.reportRegister = data;
            // 初始化下拉框数据
            initModifyMetaData($scope, baseinfo_generalService, alertService, $compile);
        });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            student_reportRegisterService.update($scope.reportRegister, 'reportRegister:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#reportRegisterTable').bootstrapTable('refresh');
                alertService('success', '注册成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'student_reportRegisterService', 'baseinfo_generalService', 'alertService', 'formVerifyService', 'app'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, student_reportRegisterService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            student_reportRegisterService.delete(item.id, 'reportRegister:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#reportRegisterTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'student_reportRegisterService', 'alertService'];

    // 初始化页面表格
    var initIndexTable = function ($scope, $window, $rootScope, $compile, app) {
        $scope.reportRegister = {};
        // 表格的高度
        $scope.table_height = $window.innerHeight - 264;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var reportRegisterQuery = {};
            // 学号/姓名
            $scope.reportRegister.studentName =  $scope.reportRegister.studentNum;
            angular.forEach($scope.reportRegister, function(data, index, array){
                if (data) {
                    reportRegisterQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, reportRegisterQuery));
            return angular.extend(pageParam, reportRegisterQuery);
        };
        $scope.reportRegisterTable = {
            //url: 'data_test/student/tableview_reportRegister.json',
            url: app.api.address + '/student/reportRegisterInfo',
            headers: {
                permission: "reportRegister:query"
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
                $compile(angular.element('#reportRegisterTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#reportRegisterTable').contents())($scope);
            },
            columns: [
                {field: "id", title: "报道注册ID", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    var page = angular.element('#reportRegisterTable').bootstrapTable("getPage");
                    return page.pageSize * (page.pageNumber-1) + (index + 1);
                }},
                {field: "payStatus", title: "缴费状态", align: "left", valign: "middle" },
                {field: "registerStatusName", title: "注册状态", align: "left", valign: "middle"},
                {field: "studentNum", title: "学生学号", align: "left", valign: "middle"},
                {field: "studentName", title: "学生姓名", align: "left", valign: "middle"},
                {field: "deptName", title: "院系名称", align: "left", valign: "middle"},
                {field: "majorName", title: "专业名称", align: "left", valign: "middle"},
                {field: "gradeName", title: "上课年级", align: "left", valign: "middle"},
                {field: "executiveClassName", title: "班级名称", align: "left", valign: "middle"},
                {field: "semesterId", title: "学年学期", align: "left", valign: "middle"},
                {field: "registerWay", title: "注册方式", align: "left", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch(value) {
                            case "1":
                                data = "终端";
                                break;
                            case "2":
                                data = "录入";
                                break;
                            default:
                                data;
                        };
                        return data;
                    }
                },
                {field: "unregisterReasonName", title: "未注册原因", align: "left", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='reportRegister:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>注册</button>";
                        return modifyBtn;
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
            angular.element('#reportRegisterTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#reportRegisterTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.reportRegister = {};
            // 重新初始化下拉框
            angular.element('form[name="reportRegisterSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#reportRegisterTable').bootstrapTable('selectPage', 1);
        }
    }

    // 初始化注册面板表格
    var initAddTable = function ($scope, $window, $rootScope, $compile, app) {
        // 学生查询对象
        $scope.student = {};
        // 表格的高度
        $scope.table_height = $window.innerHeight - 505;
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
                permission: "undergraduatesInfo:query"
            },
            method: 'get',
            cache: false,
            height: $scope.table_height,
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
            onCheck: function (row) {
                // 选择时带入学生信息
                $scope.$apply(function () {
                    $scope.reportRegister.studentNum = row.num;
                    $scope.reportRegister.studentName = row.name;
                    $scope.reportRegister.studentSex = row.sex;
                    $scope.reportRegister.executiveClassName = row.executiveClassName;
                    $scope.reportRegister.deptName = row.deptName;
                    $scope.reportRegister.gradeName = row.grade;
                    $scope.reportRegister.majorName = row.majorName;
                });
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

    // 初始化主页面板下拉框数据
    var initIndexMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
        // 上课年级
        $scope.gradeNameData = [
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
                $scope.gradeNameData = $scope.gradeNameData.concat(gradeList);
            }
            var html = '' +
                '<select ng-model="reportRegister.gradeName" id="gradeName" name="gradeName" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="gradeNameItem in gradeNameData" value="{{gradeNameItem.id}}">{{gradeNameItem.dataNumber}}</option>' +
                '</select>';
            angular.element("#gradeName").parent().empty().append(html);
            $compile(angular.element("#gradeName").parent().contents())($scope);
        });
        // 注册状态
        $scope.registerStatusCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.registerStatusList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.registerStatusCodeData = $scope.registerStatusCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.registerStatusCode" id="registerStatusCode" name="registerStatusCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="registerStatusCodeItem in registerStatusCodeData" value="{{registerStatusCodeItem.dataNumber}}">{{registerStatusCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#registerStatusCode").parent().empty().append(html);
            $compile(angular.element("#registerStatusCode").parent().contents())($scope);
        });
        // 未注册原因
        $scope.unregisterReasonCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.unregisterReasonList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.unregisterReasonCodeData = $scope.unregisterReasonCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.unregisterReasonCode" id="unregisterReasonCode" name="unregisterReasonCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="unregisterReasonCodeItem in unregisterReasonCodeData" value="{{unregisterReasonCodeItem.dataNumber}}">{{unregisterReasonCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#unregisterReasonCode").parent().empty().append(html);
            $compile(angular.element("#unregisterReasonCode").parent().contents())($scope);
        });
    }

    // 初始化批量注册面板下拉框数据
    var initBatchAddMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
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
                '<select ng-model="reportRegister.semesterId" ui-chosen="reportRegisterBatchAddform.semesterId" ng-required="true" id="semesterId_select" name="semesterId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="semesterIdItem in semesterIdData" value="{{semesterIdItem.id}}">{{semesterIdItem.acadYearSemester}}</option>' +
                '</select>';
            angular.element("#semesterId_select").parent().empty().append(html);
            $compile(angular.element("#semesterId_select").parent().contents())($scope);
        });
        // 学生类别
        $scope.studentTypeCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.findcodedataNames({datableNumber: "XSLBDM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.studentTypeCodeData = $scope.studentTypeCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.studentTypeCode" id="studentTypeCode_select" name="studentTypeCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="studentTypeCodeItem in studentTypeCodeData" value="{{studentTypeCodeItem.dataNumber}}">{{studentTypeCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#studentTypeCode_select").parent().empty().append(html);
            $compile(angular.element("#studentTypeCode_select").parent().contents())($scope);
        });
        // 上课院系
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
                '<select ng-model="reportRegister.deptId" id="deptId_select" name="deptId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="deptIdItem in deptIdData" value="{{deptIdItem.departmentNumber}}">{{deptIdItem.departmentName}}</option>' +
                '</select>';
            angular.element("#deptId_select").parent().empty().append(html);
            $compile(angular.element("#deptId_select").parent().contents())($scope);
        });
        // 上课年级
        $scope.gradeNameData = [
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
                $scope.gradeNameData = $scope.gradeNameData.concat(gradeList);
            }
            var html = '' +
                '<select ng-model="reportRegister.gradeName" id="gradeName_select" name="gradeName" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="gradeNameItem in gradeNameData" value="{{gradeNameItem.id}}">{{gradeNameItem.dataNumber}}</option>' +
                '</select>';
            angular.element("#gradeName_select").parent().empty().append(html);
            $compile(angular.element("#gradeName_select").parent().contents())($scope);
        });
        // 专业名称
        $scope.majorIdData = [
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
                $scope.majorIdData = $scope.majorIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.majorId" id="majorId_select" name="majorId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="majorIdItem in majorIdData" value="{{majorIdItem.code}}">{{majorIdItem.name}}</option>' +
                '</select>';
            angular.element("#majorId_select").parent().empty().append(html);
            $compile(angular.element("#majorId_select").parent().contents())($scope);
        });
        // 班级名称
        $scope.executiveClassIdData = [
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
                $scope.executiveClassIdData = $scope.executiveClassIdData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.executiveClassId" id="executiveClassId_select" name="executiveClassId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="executiveClassIdItem in executiveClassIdData" value="{{executiveClassIdItem.id}}">{{executiveClassIdItem.name}}</option>' +
                '</select>';
            angular.element("#executiveClassId_select").parent().empty().append(html);
            $compile(angular.element("#executiveClassId_select").parent().contents())($scope);
        });
        // 注册状态
        $scope.registerStatusCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.registerStatusList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.registerStatusCodeData = $scope.registerStatusCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.registerStatusCode" id="registerStatusCode_select" name="registerStatusCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="registerStatusCodeItem in registerStatusCodeData" value="{{registerStatusCodeItem.dataNumber}}">{{registerStatusCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#registerStatusCode_select").parent().empty().append(html);
            $compile(angular.element("#registerStatusCode_select").parent().contents())($scope);
        });
        // 未注册原因
        $scope.unregisterReasonCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.unregisterReasonList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.unregisterReasonCodeData = $scope.unregisterReasonCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.unregisterReasonCode" id="unregisterReasonCode_select" name="unregisterReasonCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="unregisterReasonCodeItem in unregisterReasonCodeData" value="{{unregisterReasonCodeItem.dataNumber}}">{{unregisterReasonCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#unregisterReasonCode_select").parent().empty().append(html);
            $compile(angular.element("#unregisterReasonCode_select").parent().contents())($scope);
        });
    }

    // 初始化添加面板下拉框数据
    var initAddMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
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
                '<select ng-model="reportRegister.semesterId" ui-chosen="reportRegisterAddform.semesterId" ng-required="true" id="semesterId_select" name="semesterId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="semesterIdItem in semesterIdData" value="{{semesterIdItem.id}}">{{semesterIdItem.acadYearSemester}}</option>' +
                '</select>';
            angular.element("#semesterId_select").parent().empty().append(html);
            $compile(angular.element("#semesterId_select").parent().contents())($scope);
        });
        // 注册状态
        $scope.registerStatusCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.registerStatusList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.registerStatusCodeData = $scope.registerStatusCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.registerStatusCode" ui-chosen="reportRegisterAddform.registerStatusCode" ng-required="true" id="registerStatusCode_select" name="registerStatusCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="registerStatusCodeItem in registerStatusCodeData" value="{{registerStatusCodeItem.dataNumber}}">{{registerStatusCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#registerStatusCode_select").parent().empty().append(html);
            $compile(angular.element("#registerStatusCode_select").parent().contents())($scope);
        });
        // 未注册原因
        $scope.unregisterReasonCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.unregisterReasonList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.unregisterReasonCodeData = $scope.unregisterReasonCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.unregisterReasonCode" ui-chosen="reportRegisterAddform.unregisterReasonCode" id="unregisterReasonCode_select" name="unregisterReasonCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="unregisterReasonCodeItem in unregisterReasonCodeData" value="{{unregisterReasonCodeItem.dataNumber}}">{{unregisterReasonCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#unregisterReasonCode_select").parent().empty().append(html);
            $compile(angular.element("#unregisterReasonCode_select").parent().contents())($scope);
        });
    }

    // 初始化修改面板下拉框数据
    var initModifyMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
        // 注册状态
        $scope.registerStatusCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.registerStatusList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.registerStatusCodeData = $scope.registerStatusCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.registerStatusCode" ui-chosen="reportRegisterAddform.registerStatusCode" ng-required="true" id="registerStatusCode_select" name="registerStatusCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="registerStatusCodeItem in registerStatusCodeData" value="{{registerStatusCodeItem.dataNumber}}">{{registerStatusCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#registerStatusCode_select").parent().empty().append(html);
            $compile(angular.element("#registerStatusCode_select").parent().contents())($scope);
        });
        // 未注册原因
        $scope.unregisterReasonCodeData = [
            {
                dataNumber: '',
                dataName: '== 请选择 =='
            }
        ];
        baseinfo_generalService.unregisterReasonList(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.data && data.data.length > 0) {
                $scope.unregisterReasonCodeData = $scope.unregisterReasonCodeData.concat(data.data);
            }
            var html = '' +
                '<select ng-model="reportRegister.unregisterReasonCode" ui-chosen="reportRegisterAddform.unregisterReasonCode" id="unregisterReasonCode_select" name="unregisterReasonCode" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="unregisterReasonCodeItem in unregisterReasonCodeData" value="{{unregisterReasonCodeItem.dataNumber}}">{{unregisterReasonCodeItem.dataName}}</option>' +
                '</select>';
            angular.element("#unregisterReasonCode_select").parent().empty().append(html);
            $compile(angular.element("#unregisterReasonCode_select").parent().contents())($scope);
        });
    }

})(window);
