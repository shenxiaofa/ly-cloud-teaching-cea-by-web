;(function (window, undefined) {
    'use strict';

    window.system_dataPermissionManageController = function ($compile, $scope, $uibModal, $rootScope, $window, system_dataPermissionManageService, alertService, app) {
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#dataPermissionTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        // 初始化查询表单下拉框数据
        initIndexMetaData($scope, system_dataPermissionManageService, alertService, $compile);
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#dataPermissionTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.dataPermission = {};
            // 重新初始化下拉框
            angular.element('form[name="dataPermissionSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#dataPermissionTable').bootstrapTable('selectPage', 1);
        };
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/dataPermissionManage/add.html',
                size: '',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/dataPermissionManage/modify.html',
                size: '',
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
                templateUrl: 'tpl/system/permissionManage/dataPermissionManage/delete.html',
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
    system_dataPermissionManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'system_dataPermissionManageService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, system_dataPermissionManageService, formVerifyService, alertService) {
        // 初始化数据
        $scope.dataPermission = {};
        // 初始化下拉框数据
        initAddMetaData($scope, system_dataPermissionManageService, alertService, $compile);
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_dataPermissionManageService.add($scope.dataPermission, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#dataPermissionTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'system_dataPermissionManageService', 'formVerifyService', 'alertService'];

    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, item, system_dataPermissionManageService, alertService, formVerifyService) {
        // 数据初始化
        
        // system_dataPermissionManageService.findDataPermissionById(item.sjqxbh, function (error, message, data) {
        //     if (error) {
        //         alertService(message);
        //         return;
        //     };
        //     $scope.dataPermission = data;
        //     // 初始化下拉框数据
            initModifyMetaData($scope, system_dataPermissionManageService, alertService, $compile);
        $scope.dataPermission = item;
        // });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_dataPermissionManageService.update($scope.dataPermission, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#dataPermissionTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_dataPermissionManageService', 'alertService', 'formVerifyService'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_dataPermissionManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_dataPermissionManageService.delete(item.sjqxbh, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#dataPermissionTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_dataPermissionManageService', 'alertService'];

    // 初始化表格
    var initIndexTable = function($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 184;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var dataPermissionQuery = {};
            angular.forEach($scope.dataPermission, function (data, index, array) {
                if (data) {
                    dataPermissionQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, dataPermissionQuery));
            return angular.extend(pageParam, dataPermissionQuery);
        };
        $scope.dataPermissionTable = {
            //url: 'data_test/system/tableview_dataPermission.json',
            url: app.api.address + '/system/permissionDataDimension',
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
            sortName: 'bh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "sjqxbh", // 指定主键列
            uniqueId: "sjqxbh", // 每行唯一标识
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
                $compile(angular.element('#dataPermissionTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#dataPermissionTable').contents())($scope);
            },
            columns: [
                {field: "sjqxbh", title: "数据权限编号", visible: false},
                {field: "mc", title: "服务", align: "left", valign: "middle"},
                {field: "wddm", title: "维度代码", align: "left", valign: "middle"},
                {field: "wdmc", title: "维度名称", align: "left", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='dataPermission:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='dataPermission:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
                        return modifyBtn + "&nbsp;" + deleteBtn;
                    }
                }
            ]
        };
    }

    // 初始化主页下拉框数据
    var initIndexMetaData = function($scope, system_dataPermissionManageService, alertService, $compile) {
        $scope.fwbhData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        system_dataPermissionManageService.findServing({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.fwbhData = $scope.fwbhData.concat(data);
            }
            var html = '' +
                '<select ng-model="dataPermission.fwbh" id="fwbh" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>' +
                '</select>';
            angular.element("#fwbh").parent().empty().append(html);
            $compile(angular.element("#fwbh").parent().contents())($scope);
        });
    }

    // 初始化添加面板下拉框数据
    var initAddMetaData = function($scope, system_dataPermissionManageService, alertService, $compile) {
        $scope.fwbhData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        system_dataPermissionManageService.findServing({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.fwbhData = $scope.fwbhData.concat(data);
            }
            var html = '' +
                '<select ng-model="dataPermission.fwbh" ui-chosen="dataPermissionAddForm.fwbh" ng-required="true" id="fwbh_select" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>' +
                '</select>';
            angular.element("#fwbh_select").parent().empty().append(html);
            $compile(angular.element("#fwbh_select").parent().contents())($scope);
        });
    }

    // 初始化修改面板下拉框数据
    var initModifyMetaData = function($scope, system_dataPermissionManageService, alertService, $compile) {
        $scope.fwbhData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        system_dataPermissionManageService.findServing({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.fwbhData = $scope.fwbhData.concat(data);
            }
            var html = '' +
                '<select ng-model="dataPermission.fwbh" ui-chosen="dataPermissionModifyForm.fwbh" ng-required="true" id="fwbh_select" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>' +
                '</select>';
            angular.element("#fwbh_select").parent().empty().append(html);
            $compile(angular.element("#fwbh_select").parent().contents())($scope);
        });
    }
    
})(window);
