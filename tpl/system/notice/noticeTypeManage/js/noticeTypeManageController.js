;(function (window, undefined) {
    'use strict';

    window.system_noticeTypeManageController = function ($compile, $scope, $uibModal, $rootScope, $window, system_noticeTypeManageService, alertService, app) {
        // 公告类型查询对象
        $scope.noticeType = {};
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, app, $compile, system_noticeTypeManageService, alertService);
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/notice/noticeTypeManage/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.noticeType;
                    }
                },
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/notice/noticeTypeManage/modify.html',
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
                templateUrl: 'tpl/system/notice/noticeTypeManage/delete.html',
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
    system_noticeTypeManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'system_noticeTypeManageService', 'alertService', 'app'];


    // 添加控制器
    var openAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, system_noticeTypeManageService, formVerifyService, alertService, app) {
        // 初始化数据
        $scope.noticeType = {
            noticeTypeName: '', // 公告类型名称
            sortNum: '', // 排序号
            describe: '' // 描述
        };

        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_noticeTypeManageService.add($scope.noticeType, 'noticeType:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#noticeTypeTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'system_noticeTypeManageService', 'formVerifyService', 'alertService', 'app'];
    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, system_noticeTypeManageService, alertService, formVerifyService, app) {
        // 初始化数据
        $scope.noticeType = {
            noticeTypeId:item.noticeTypeId, // 公告类型id
            noticeTypeName: item.noticeTypeName, // 公告类型名称
            sortNum: item.sortNum, // 排序号
            describe: item.describe// 描述
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_noticeTypeManageService.update($scope.noticeType, 'noticeType:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#noticeTypeTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'system_noticeTypeManageService', 'alertService', 'formVerifyService', 'app'];
    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_noticeTypeManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_noticeTypeManageService.delete(item.noticeTypeId, 'noticeType:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#noticeTypeTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_noticeTypeManageService', 'alertService'];

    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, app, $compile, system_noticeTypeManageService, alertService) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 154;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var noticeTypeQuery = {};
            angular.forEach($scope.noticeType, function (data, index, array) {
                if (data) {
                    noticeTypeQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, noticeTypeQuery));
            return angular.extend(pageParam, noticeTypeQuery);
        };
        $scope.noticeTypeTable = {
            //url: 'data_test/system/tableview_noticeType.json',
            url: app.api.address + '/system/noticeType',
            headers: {
                permission: "noticeType:query"
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
            sortName: 'dwh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "dwh", // 指定主键列
            uniqueId: "dwh", // 每行唯一标识
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
                $compile(angular.element('#noticeTypeTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#noticeTypeTable').contents())($scope);
            },
            columns: [
                {field: "noticeTypeName", title: "类型名称", align: "left", valign: "middle"},
                {field: "describe", title: "类型描述", align: "left", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='noticeType:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='noticeType:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
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
                $scope.table_height = $scope.table_height + 45;
            } else {
                $scope.table_height = $scope.table_height - 45;
            }
            angular.element('#noticeTypeTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#noticeTypeTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.noticeType = {};
            // 重新初始化下拉框
            angular.element('form[name="noticeTypeSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#noticeTypeTable').bootstrapTable('selectPage', 1);
        }
    }

})(window);