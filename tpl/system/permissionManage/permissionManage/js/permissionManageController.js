;(function (window, undefined) {
    'use strict';

    window.system_permissionManageController = function ($compile, $scope, $uibModal, $rootScope, $window, system_permissionManageService, alertService, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 226;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var permissionQuery = {};
            angular.forEach($scope.permission, function(data, index, array){
                if (data) {
                    permissionQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, permissionQuery));
            return angular.extend(pageParam, permissionQuery);
        };
        $scope.permissionTable = {
            //url: 'data_test/system/tableview_permission.json',
            url: app.api.address + '/system/permission',
            headers: {
                permission: "permission:query"
            },
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'qxbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "qxbh", // 指定主键列
            uniqueId: "qxbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function() {
                $compile(angular.element('#permissionTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#permissionTable').contents())($scope);
            },
            columns: [
                {field:"qxbh", title:"权限编号"},
                {field:"mc",title:"权限名称",align:"left",valign:"middle"},
                {field:"ybh",title:"所属域",align:"left",valign:"middle",
                    formatter : function (value, row, index) {
                        return row.ymc;
                    }
                },
                {field:"fwbh",title:"所属服务",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return row.fwmc;
                    }
                },
                {field:"lx",title:"类型",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if (value == "function") {
                            return "功能"
                        }
                        return value;
                    }
                },
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var modifyBtn = "<button has-permission='permission:update' type='button' class='btn btn-sm btn-default' ng-click='openModify("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='permission:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete("+ angular.toJson(row) +")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
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
            angular.element('#permissionTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        // 初始化查询字段
        $scope.permission = {
            ybh: ''
        };
        // 初始化查询表单下拉框数据
        $scope.ybhData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        system_permissionManageService.findDomain({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.ybhData = $scope.ybhData.concat(data);
            };
            var html = '' +
                '<select ng-model="permission.ybh" id="ybh" name="ybh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="ybhItem in ybhData" value="{{ybhItem.bh}}">{{ybhItem.mc}}</option>'+
                '</select>';
            angular.element("#ybh").parent().empty().append(html);
            $compile(angular.element("#ybh").parent().contents())($scope);
        });
        var fwbhTempData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        $scope.fwbhData = fwbhTempData;
        // 刷新服务查询框
        var refreshFwbh = function (data) {
            $scope.fwbhData = data;
            var html = '' +
                '<select ng-model="permission.fwbh" id="fwbh" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>'+
                '</select>';
            angular.element("#fwbh").parent().empty().append(html);
            $compile(angular.element("#fwbh").parent().contents())($scope);
        };
        $scope.$watch('permission.ybh', function (newValue, oldValue) {
            if (!newValue) {
                refreshFwbh(fwbhTempData);
                return;
            };
            angular.forEach($scope.ybhData, function(data, index, array){
                if (data && data.bh == newValue && data.servingList && data.servingList.length > 0) {
                    refreshFwbh(fwbhTempData.concat(data.servingList));
                };
            });
        });
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#permissionTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.permission = {};
            // 重新初始化下拉框
            angular.element('form[name="permissionSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#permissionTable').bootstrapTable('selectPage', 1);
        };
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/permissionManage/add.html',
                size: 'lg',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/permissionManage/modify.html',
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
                templateUrl: 'tpl/system/permissionManage/permissionManage/delete.html',
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
    system_permissionManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'system_permissionManageService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, system_permissionManageService, formVerifyService, alertService) {
        // 初始化数据
        $scope.permission = {};
        // 初始化下拉框数据
        initAddMetaData($scope, system_permissionManageService, alertService, $compile, $timeout);
        // 初始化资源表格数据
        $scope.resourcesData = [];
        // 资源
        $scope.resourcesTable = {
            url: 'data_test/system/tableview_resources.json',
            method: 'get',
            cache: false,
            toolbar: '#resourcesToolbar', //工具按钮用哪个容器
            striped: true,
            sortable: false, // 禁用排序
            idField : "zybh", // 指定主键列
            uniqueId: "zybh", // 每行唯一标识
            responseHandler:function(response){
                return $scope.resourcesData;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#resourcesTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#resourcesTable').contents())($scope);
            },
            columns: [
                {field:"_id_",title:"虚拟标识",visible:false},
                {field:"zybh", title:"资源编号",align:"left",valign:"middle"},
                {field:"zymc",title:"资源名称",align:"left",valign:"middle"},
                {field:"uri",title:"URI",align:"left",valign:"middle"},
                {field:"action",title:"操作类型",align:"left",valign:"middle"},
                {field:"zt",title:"状态",visible:false},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var modifyBtn = "<button has-permission='resources:update' type='button' class='btn btn-sm btn-default' ng-click='resourcesOpenModify("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='resources:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='resourcesOpenDelete("+ angular.toJson(row) +")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
                        return modifyBtn + "&nbsp;" + deleteBtn;
                    }
                }
            ]
        };
        // 打开新增资源面板
        $scope.resourcesOpenAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/resourcesManage/add.html',
                size: '',
                resolve: {
                    data: function () {
                        return $scope.resourcesData;
                    }
                },
                controller: resourcesOpenAddController
            });
        };
        // 打开修改资源面板
        $scope.resourcesOpenModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/resourcesManage/modify.html',
                size: '',
                resolve: {
                    item: function () {
                        return {
                            data: $scope.resourcesData,
                            row: row
                        };
                    }
                },
                controller: resourcesOpenModifyController
            });
        };
        // 打开删除资源面板
        $scope.resourcesOpenDelete = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/resourcesManage/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return {
                            data: $scope.resourcesData,
                            row: row
                        };
                    }
                },
                controller: resourcesOpenDeleteController
            });
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            // 资源数据添加权限编号
            angular.forEach($scope.resourcesData, function(data, index, array){
                data.qxbh = $scope.permission.qxbh;
            });
            // 添加资源数据
            $scope.permission.resources = $scope.resourcesData;
            $rootScope.showLoading = true; // 开启加载提示
            system_permissionManageService.add($scope.permission, 'permission:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#permissionTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'system_permissionManageService', 'formVerifyService', 'alertService'];

    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, item, system_permissionManageService, alertService, formVerifyService, uuid4) {
        // 数据初始化
        $scope.permission = item;
        // 初始化资源表格数据
        $scope.resourcesData = [];
        // 根据主键查询
        system_permissionManageService.findById(item.qxbh, 'permission:update', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.permission = data;
            if (data && data.resources) {
                $scope.resourcesData = data.resources;
                angular.forEach($scope.resourcesData, function(data, index, array){
                    data._id_ = uuid4.generate();
                });
                angular.element('#resourcesTable').bootstrapTable('refresh');
            };
            // 初始化下拉框数据
            initModifyMetaData($scope, system_permissionManageService, alertService, $compile, $timeout);
        });
        // 资源
        $scope.resourcesTable = {
            url: 'data_test/system/tableview_resources.json',
            method: 'get',
            cache: false,
            toolbar: '#resourcesToolbar', //工具按钮用哪个容器
            striped: true,
            sortable: false, // 禁用排序
            idField : "zybh", // 指定主键列
            uniqueId: "zybh", // 每行唯一标识
            responseHandler:function(response){
                return $scope.resourcesData;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#resourcesTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#resourcesTable').contents())($scope);
            },
            columns: [
                {field:"_id_",title:"虚拟标识",visible:false},
                {field:"zybh", title:"资源编号",align:"left",valign:"middle"},
                {field:"zymc",title:"资源名称",align:"left",valign:"middle"},
                {field:"uri",title:"URI",align:"left",valign:"middle"},
                {field:"action",title:"操作类型",align:"left",valign:"middle"},
                {field:"zt",title:"状态",visible:false},
                {field:"operation",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var modifyBtn = "<button has-permission='resources:update' type='button' class='btn btn-sm btn-default' ng-click='resourcesOpenModify("+ angular.toJson(row) +")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='resources:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='resourcesOpenDelete("+ angular.toJson(row) +")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
                        return modifyBtn + "&nbsp;" + deleteBtn;
                    }
                }
            ]
        };
        // 打开新增资源面板
        $scope.resourcesOpenAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/resourcesManage/add.html',
                size: '',
                resolve: {
                    data: function () {
                        return $scope.resourcesData;
                    }
                },
                controller: resourcesOpenAddController
            });
        };
        // 打开修改资源面板
        $scope.resourcesOpenModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/resourcesManage/modify.html',
                size: '',
                resolve: {
                    item: function () {
                        return {
                            data: $scope.resourcesData,
                            row: row
                        };
                    }
                },
                controller: resourcesOpenModifyController
            });
        };
        // 打开删除资源面板
        $scope.resourcesOpenDelete = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/resourcesManage/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return {
                            data: $scope.resourcesData,
                            row: row
                        };
                    }
                },
                controller: resourcesOpenDeleteController
            });
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_permissionManageService.update({originId: item.qxbh, permission: $scope.permission}, 'permission:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#permissionTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_permissionManageService', 'alertService', 'formVerifyService', 'uuid4'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_permissionManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_permissionManageService.delete(item.qxbh, 'permission:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#permissionTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_permissionManageService', 'alertService'];

    // 添加资源控制器
    var resourcesOpenAddController = function ($log, $scope, $uibModalInstance, $uibModal, uuid4, system_permissionManageService, formVerifyService, alertService, data) {
        // 初始化数据
        $scope.resources = {
            _id_: uuid4.generate(),
            zt: '1' // 状态
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $log.debug($scope.resources);
            // 添加资源到父作用域
            data.push($scope.resources);
            $uibModalInstance.close();
            angular.element('#resourcesTable').bootstrapTable('refresh');
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    resourcesOpenAddController.$inject = ['$log', '$scope', '$uibModalInstance', '$uibModal', 'uuid4', 'system_permissionManageService', 'formVerifyService', 'alertService', 'data'];

    // 修改资源控制器
    var resourcesOpenModifyController = function ($log, $scope, $uibModalInstance, item, system_roleManageService, alertService, formVerifyService) {
        // 数据初始化
        $scope.resources = item.row;
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $log.debug($scope.resources);
            var tempData = [];
            angular.forEach(item.data, function(data, index, array){
                if (data._id_ == $scope.resources._id_) {
                    tempData.push($scope.resources);
                } else {
                    tempData.push(data);
                }
            });
            item.data.splice(0, item.data.length);
            angular.forEach(tempData, function(data, index, array){
                item.data.push(data);
            });
            $uibModalInstance.close();
            angular.element('#resourcesTable').bootstrapTable('refresh');
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    resourcesOpenModifyController.$inject = ['$log', '$scope', '$uibModalInstance', 'item', 'system_roleManageService', 'alertService', 'formVerifyService'];

    // 删除资源控制器
    var resourcesOpenDeleteController = function ($log, $scope, $uibModalInstance, item, system_roleManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $uibModalInstance.close();
            $log.debug(item.data);
            var tempData = [];
            angular.forEach(item.data, function(data, index, array){
                if (data._id_ != item.row._id_) {
                    tempData.push(data);
                }
            });
            item.data.splice(0, item.data.length);
            angular.forEach(tempData, function(data, index, array){
                item.data.push(data);
            });
            $log.debug(item.data);
            angular.element('#resourcesTable').bootstrapTable('refresh');
            alertService('success', '删除成功');
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    resourcesOpenDeleteController.$inject = ['$log', '$scope', '$uibModalInstance', 'item', 'system_roleManageService', 'alertService'];

    // 初始化修改面板的下拉框数据
    var initModifyMetaData = function ($scope, system_permissionManageService, alertService, $compile, $timeout) {
        // 初始化表单下拉框数据
        $scope.ybhData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        system_permissionManageService.findDomain({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.ybhData = $scope.ybhData.concat(data);
            }
            var html = '' +
                '<select ng-model="permission.ybh" ui-chosen="permissionAddForm.ybh" ng-required="true" id="ybh_select" name="ybh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="ybhItem in ybhData" value="{{ybhItem.bh}}">{{ybhItem.mc}}</option>' +
                '</select>';
            angular.element("#ybh_select").parent().empty().append(html);
            $compile(angular.element("#ybh_select").parent().contents())($scope);
            $timeout(function () {
                var ybhTemp = $scope.permission.ybh;
                $scope.permission.ybh = "";
                $timeout(function () {
                    $scope.permission.ybh = ybhTemp;
                }, 50);
            }, 50);
        });
        var fwbhTempData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        $scope.fwbhData = fwbhTempData;
        // 刷新服务查询框
        var refreshFwbh = function (data) {
            $scope.fwbhData = data;
            var html = '' +
                '<select ng-model="permission.fwbh" ui-chosen="permissionAddForm.fwbh" ng-required="true" id="fwbh_select" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>' +
                '</select>';
            angular.element("#fwbh_select").parent().empty().append(html);
            $compile(angular.element("#fwbh_select").parent().contents())($scope);
        };
        $scope.$watch('permission.ybh', function (newValue, oldValue) {
            if (!newValue) {
                refreshFwbh(fwbhTempData);
                return;
            }
            angular.forEach($scope.ybhData, function (data, index, array) {
                if (data && data.bh == newValue && data.servingList && data.servingList.length > 0) {
                    refreshFwbh(fwbhTempData.concat(data.servingList));
                };
            });
        });
        var sjbhTempData = [
            {
                qxbh: '',
                mc: '== 请选择 =='
            }
        ];
        $scope.sjbhData = sjbhTempData;
        // 刷新所属权限查询框
        var refreshSjbh = function (data) {
            $scope.sjbhData = data;
            var html = '' +
                '<select ng-model="permission.sjbh" id="sjbh_select" name="sjbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="sjbhItem in sjbhData" value="{{sjbhItem.qxbh}}">{{sjbhItem.mc}}</option>' +
                '</select>';
            angular.element("#sjbh_select").parent().empty().append(html);
            $compile(angular.element("#sjbh_select").parent().contents())($scope);
        };
        $scope.$watch('permission.fwbh', function (newValue, oldValue) {
            if (!newValue) {
                refreshSjbh(sjbhTempData);
                return;
            }
            system_permissionManageService.findPermission({
                pageNum: 1,
                pageSize: 0,
                fwbh: newValue,
                sjbh: '-1'
            }, 'permission:update', function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                if (data && data.length > 0) {
                    refreshSjbh(sjbhTempData.concat(data));
                }
            });
        });
    };

    // 初始化添加面板的下拉框数据
    var initAddMetaData = function ($scope, system_permissionManageService, alertService, $compile, $timeout) {
        // 初始化表单下拉框数据
        $scope.ybhData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        system_permissionManageService.findDomain({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.ybhData = $scope.ybhData.concat(data);
            }
            var html = '' +
                '<select ng-model="permission.ybh" ui-chosen="permissionAddForm.ybh" ng-required="true" id="ybh_select" name="ybh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="ybhItem in ybhData" value="{{ybhItem.bh}}">{{ybhItem.mc}}</option>' +
                '</select>';
            angular.element("#ybh_select").parent().empty().append(html);
            $compile(angular.element("#ybh_select").parent().contents())($scope);
        });
        var fwbhTempData = [
            {
                bh: '',
                mc: '== 请选择 =='
            }
        ];
        $scope.fwbhData = fwbhTempData;
        // 刷新服务查询框
        var refreshFwbh = function (data) {
            $scope.fwbhData = data;
            var html = '' +
                '<select ng-model="permission.fwbh" ui-chosen="permissionAddForm.fwbh" ng-required="true" id="fwbh_select" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>' +
                '</select>';
            angular.element("#fwbh_select").parent().empty().append(html);
            $compile(angular.element("#fwbh_select").parent().contents())($scope);
        };
        $scope.$watch('permission.ybh', function (newValue, oldValue) {
            if (!newValue) {
                refreshFwbh(fwbhTempData);
                return;
            }
            angular.forEach($scope.ybhData, function (data, index, array) {
                if (data && data.bh == newValue && data.servingList && data.servingList.length > 0) {
                    refreshFwbh(fwbhTempData.concat(data.servingList));
                };
            });
        });
        var sjbhTempData = [
            {
                qxbh: '',
                mc: '== 请选择 =='
            }
        ];
        $scope.sjbhData = sjbhTempData;
        // 刷新所属权限查询框
        var refreshSjbh = function (data) {
            $scope.sjbhData = data;
            var html = '' +
                '<select ng-model="permission.sjbh" id="sjbh_select" name="sjbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="sjbhItem in sjbhData" value="{{sjbhItem.qxbh}}">{{sjbhItem.mc}}</option>' +
                '</select>';
            angular.element("#sjbh_select").parent().empty().append(html);
            $compile(angular.element("#sjbh_select").parent().contents())($scope);
        };
        $scope.$watch('permission.fwbh', function (newValue, oldValue) {
            if (!newValue) {
                refreshSjbh(sjbhTempData);
                return;
            }
            system_permissionManageService.findPermission({
                pageNum: 1,
                pageSize: 0,
                fwbh: newValue,
                sjbh: '-1'
            }, function (error, message, data) {
                if (error) {
                    alertService(message);
                    return;
                }
                if (data && data.length > 0) {
                    refreshSjbh(sjbhTempData.concat(data));
                }
            });
        });
    };

})(window);
