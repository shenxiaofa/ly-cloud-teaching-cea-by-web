;(function (window, undefined) {
    'use strict';

    window.student_reportRegisterControlController = function ($compile, $filter, $scope, $uibModal, $rootScope, $window, student_reportRegisterControlService, baseinfo_generalService, alertService, app) {
        $scope.reportRegisterControl = {};
        // 初始化时间组件配置
        initIndexTimeConfig($scope);
        // 初始化下拉框数据
        initIndexMetaData($scope, baseinfo_generalService, alertService, $compile);
        // 初始化页面表格
        initIndexTable($filter, $scope, $window, $rootScope, $compile, app);
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/reportRegister/control/add.html',
                size: 'lg',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/student/reportRegister/control/modify.html',
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
                templateUrl: 'tpl/student/reportRegister/control/delete.html',
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
    student_reportRegisterControlController.$inject = ['$compile', '$filter', '$scope', '$uibModal', '$rootScope', '$window', 'student_reportRegisterControlService', 'baseinfo_generalService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $filter, $compile, $scope, $uibModalInstance, $uibModal, student_reportRegisterControlService, baseinfo_generalService, formVerifyService, alertService, app) {
        // 初始化数据
        $scope.reportRegisterControl = {
            registerSemesterSign: '1', // 当前注册学期
            enabledRegisterSign: '1' // 启用缴费注册
        }
        // 注册开始日期参数配置
        $scope.registerStartTimeOptions = {
            opened: false,
            open: function() {
                $scope.registerStartTimeOptions.opened = true;
            }
        };
        // 注册结束日期参数配置
        $scope.registerEndTimeOptions = {
            opened: false,
            open: function() {
                $scope.registerEndTimeOptions.opened = true;
            }
        };
        // 注册结束日期小于注册开始日期时的提示
        $scope.registerEndTimeTooltipEnableAndOpen = false;
        $scope.$watch('reportRegisterControl.registerEndTime', function (newValue) {
            if ($scope.reportRegisterControl.registerStartTime && newValue && (newValue < $scope.reportRegisterControl.registerStartTime)) {
                $scope.registerEndTimeTooltipEnableAndOpen = true;
                return;
            }
            $scope.registerEndTimeTooltipEnableAndOpen = false;
        });
        // 初始化下拉框数据
        initAddMetaData($scope, baseinfo_generalService, alertService, $compile);
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            }
            var reportRegisterControlTemp = angular.copy($scope.reportRegisterControl);
            //转日期格式
            reportRegisterControlTemp.registerStartTime =  $filter("date")(reportRegisterControlTemp.registerStartTime, app.date.formatDate);
            reportRegisterControlTemp.registerEndTime =  $filter("date")(reportRegisterControlTemp.registerEndTime, app.date.formatDate);
            $rootScope.showLoading = true; // 开启加载提示
            student_reportRegisterControlService.add(reportRegisterControlTemp, 'reportRegisterControl:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#reportRegisterControlTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$filter', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'student_reportRegisterControlService', 'baseinfo_generalService', 'formVerifyService', 'alertService', 'app'];

    // 修改控制器
    var openModifyController = function ($rootScope, $filter, $timeout, $compile, $scope, $uibModalInstance, item, student_reportRegisterControlService, baseinfo_generalService, alertService, formVerifyService, app) {
        // 初始化数据
        $scope.reportRegisterControl = {
            registerSemesterSign: '1', // 当前注册学期
            enabledRegisterSign: '1' // 启用缴费注册
        }
        student_reportRegisterControlService.findById(item.id, 'reportRegisterControl:update', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.reportRegisterControl = data;
            $scope.reportRegisterControl.registerStartTime = new Date(data.registerStartTime); // 注册开始日期
            $scope.reportRegisterControl.registerEndTime = new Date(data.registerEndTime); // 注册结束日期
        });
        // 注册开始日期参数配置
        $scope.registerStartTimeOptions = {
            opened: false,
            open: function() {
                $scope.registerStartTimeOptions.opened = true;
            }
        };
        // 注册结束日期参数配置
        $scope.registerEndTimeOptions = {
            opened: false,
            open: function() {
                $scope.registerEndTimeOptions.opened = true;
            }
        };
        // 注册结束日期小于注册开始日期时的提示
        $scope.registerEndTimeTooltipEnableAndOpen = false;
        $scope.$watch('reportRegisterControl.registerEndTime', function (newValue) {
            if ($scope.reportRegisterControl.registerStartTime && newValue && (newValue < $scope.reportRegisterControl.registerStartTime)) {
                $scope.registerEndTimeTooltipEnableAndOpen = true;
                return;
            }
            $scope.registerEndTimeTooltipEnableAndOpen = false;
        });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var reportRegisterControlTemp = angular.copy($scope.reportRegisterControl);
            //转日期格式
            reportRegisterControlTemp.registerStartTime =  $filter("date")(reportRegisterControlTemp.registerStartTime, app.date.formatDate);
            reportRegisterControlTemp.registerEndTime =  $filter("date")(reportRegisterControlTemp.registerEndTime, app.date.formatDate);
            $rootScope.showLoading = true; // 开启加载提示
            student_reportRegisterControlService.update(reportRegisterControlTemp, 'reportRegisterControl:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#reportRegisterControlTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$filter', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'student_reportRegisterControlService', 'baseinfo_generalService', 'alertService', 'formVerifyService', 'app'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, student_reportRegisterControlService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            student_reportRegisterControlService.delete(item.id, 'reportRegisterControl:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#reportRegisterControlTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'student_reportRegisterControlService', 'alertService'];

    // 初始化时间组件配置
    var initIndexTimeConfig = function ($scope) {
        // 注册开始日期参数配置
        $scope.registerStartTimeStartOptions = {
            opened: false,
            open: function () {
                $scope.registerStartTimeStartOptions.opened = true;
            }
        };
        $scope.registerStartTimeEndOptions = {
            opened: false,
            open: function () {
                $scope.registerStartTimeEndOptions.opened = true;
            }
        };
        // 注册结束日期参数配置
        $scope.registerEndTimeStartOptions = {
            opened: false,
            open: function () {
                $scope.registerEndTimeStartOptions.opened = true;
            }
        };
        $scope.registerEndTimeEndOptions = {
            opened: false,
            open: function () {
                $scope.registerEndTimeEndOptions.opened = true;
            }
        };
    }

    // 初始化页面表格
    var initIndexTable = function ($filter, $scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 224;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var reportRegisterControlQuery = {};
            //转日期格式
            var reportRegisterControlTemp = angular.copy($scope.reportRegisterControl);
            if (reportRegisterControlTemp.registerStartTimeStart) {
                reportRegisterControlTemp.registerStartTimeStart =  $filter("date")(reportRegisterControlTemp.registerStartTimeStart, app.date.formatDate);
            }
            if (reportRegisterControlTemp.registerStartTimeEnd) {
                reportRegisterControlTemp.registerStartTimeEnd =  $filter("date")(reportRegisterControlTemp.registerStartTimeEnd, app.date.formatDate);
            }
            if (reportRegisterControlTemp.registerEndTimeStart) {
                reportRegisterControlTemp.registerEndTimeStart =  $filter("date")(reportRegisterControlTemp.registerEndTimeStart, app.date.formatDate);
            }
            if (reportRegisterControlTemp.registerEndTimeEnd) {
                reportRegisterControlTemp.registerEndTimeEnd =  $filter("date")(reportRegisterControlTemp.registerEndTimeEnd, app.date.formatDate);
            }
            angular.forEach(reportRegisterControlTemp, function(data, index, array){
                if (data) {
                    reportRegisterControlQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, reportRegisterControlQuery));
            return angular.extend(pageParam, reportRegisterControlQuery);
        };
        $scope.reportRegisterControlTable = {
            //url: 'data_test/student/tableview_reportRegisterControl.json',
            url: app.api.address + '/student/reportRegisterControl',
            headers: {
                permission: "reportRegisterControl:query"
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
                $compile(angular.element('#reportRegisterControlTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#reportRegisterControlTable').contents())($scope);
            },
            columns: [
                {field: "id", title: "报道注册控制ID", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    var page = angular.element('#reportRegisterControlTable').bootstrapTable("getPage");
                    return page.pageSize * (page.pageNumber-1) + (index + 1);
                }},
                {field: "semesterId", title: "学年学期", align: "left", valign: "middle"},
                {field: "registerStartTime", title: "注册开始时间", align: "left", valign: "middle"},
                {field: "registerEndTime", title: "注册结束时间", align: "left", valign: "middle"},
                {field: "enabledRegisterSign", title: "启用缴费注册", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch(value) {
                            case "0":
                                data = "否";
                                break;
                            case "1":
                                data = "是";
                                break;
                            default:
                                data;
                        };
                        return data;
                    }
                },
                {field: "registerSemesterSign", title: "当前注册学期", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch(value) {
                            case "0":
                                data = "否";
                                break;
                            case "1":
                                data = "是";
                                break;
                            default:
                                data;
                        };
                        return data;
                    }
                },
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='reportRegisterControl:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='reportRegisterControl:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
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
                $scope.table_height = $scope.table_height + 115;
            } else {
                $scope.table_height = $scope.table_height - 115;
            }
            angular.element('#reportRegisterControlTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#reportRegisterControlTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.reportRegisterControl = {};
            // 重新初始化下拉框
            angular.element('form[name="reportRegisterControlSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#reportRegisterControlTable').bootstrapTable('selectPage', 1);
        }
    }

    // 初始化主页面板下拉框数据
    var initIndexMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
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
                '<select ng-model="reportRegisterControl.semesterId" ui-chosen="reportRegisterControlSearchForm.semesterId" id="semesterId" name="semesterId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="semesterIdItem in semesterIdData" value="{{semesterIdItem.id}}">{{semesterIdItem.acadYearSemester}}</option>' +
                '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
    }

    // 初始化添加面板下拉框数据
    var initAddMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
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
                '<select ng-model="reportRegisterControl.semesterId" ui-chosen="reportRegisterControlAddform.semesterId" ng-required="true" id="semesterId_select" name="semesterId" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="semesterIdItem in semesterIdData" value="{{semesterIdItem.id}}">{{semesterIdItem.acadYearSemester}}</option>' +
                '</select>';
            angular.element("#semesterId_select").parent().empty().append(html);
            $compile(angular.element("#semesterId_select").parent().contents())($scope);
        });
    }

})(window);
