;(function (window, undefined) {
    'use strict';

    window.system_operationLogController = function ($compile, $scope, $uibModal, $rootScope, $window, $filter, system_operationLogService, alertService, app) {
        // 初始化页面表格
        initIndexTable($scope, $window, $filter, $rootScope, $compile, app);
        // 操作开始时间参数配置
        $scope.startTimeOptions = {
            opened: false,
            open: function() {
                $scope.startTimeOptions.opened = true;
            }
        };
        // 操作结束时间参数配置
        $scope.endTimeOptions = {
            opened: false,
            open: function() {
                $scope.endTimeOptions.opened = true;
            }
        };
        // 打开详情面板
        $scope.openDetail = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/log/operationLog/detail.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: openDetailController
            });
        };
    };
    system_operationLogController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', '$filter', 'system_operationLogService', 'alertService', 'app'];

    // 修改控制器
    var openDetailController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, system_operationLogService, alertService, formVerifyService, app) {
        // 数据初始化
        $scope.role = {
            lx: item.lx,
            permissionList: {} // 权限（先用 map 再转 list）
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDetailController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'system_operationLogService', 'alertService', 'formVerifyService', 'app'];

    // 初始化页面表格
    var initIndexTable = function ($scope, $window, $filter, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 266;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var operationLogQuery = {};
            angular.forEach($scope.operationLog, function(data, index, array){
                if (data) {
                    operationLogQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, operationLogQuery));
            return angular.extend(pageParam, operationLogQuery);
        };
        $scope.operationLogTable = {
            //url: 'data_test/system/tableview_operationLog.json',
            url: app.api.address + '/system/operationLog',
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
            idField: "ri_id", // 指定主键列
            uniqueId: "ri_id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#operationLogTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#operationLogTable').contents())($scope);
            },
            columns: [
                {field: "ri_id", visible: false},
                {field: "mkmc", title: "模块名称", align: "left", valign: "middle"},
                {field: "czlx", title: "操作类型", align: "left", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch(value) {
                            case "0": data = "登录"; break;
                            case "1": data = "新增"; break;
                            case "2": data = "更新"; break;
                            case "3": data = "删除"; break;
                            case "4": data = "查询"; break;
                            case "5": data = "导出"; break;
                            default:;
                        };
                        return data;
                    }
                },
                {field: "czsm", title: "操作说明", align: "left", valign: "middle"},
                {field: "czrxm", title: "操作人姓名", align: "left", valign: "middle"},
                {field: "czrzh", title: "操作人账号", align: "left", valign: "middle"},
                {field: "czsj", title: "操作时间", align: "left", valign: "middle",
                    formatter: function (value, row, index) {
                        return $filter("date")(new Date(value), app.date.format);
                    }
                },
                {field: "ip", title: "IP地址", align: "left", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        return "<button has-permission='operationLog:query' type='button' class='btn btn-sm btn-default' ng-click='openDetail(" + angular.toJson(row) + ")'>查看</button>";
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
            angular.element('#operationLogTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#operationLogTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.operationLog = {};
            // 重新初始化下拉框
            angular.element('form[name="operationLogSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#operationLogTable').bootstrapTable('selectPage', 1);
        }
    }

})(window);
