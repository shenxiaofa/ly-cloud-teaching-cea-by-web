;(function (window, undefined) {
    'use strict';

    window.system_dataPermissionResourceManageController = function ($compile, $scope, $uibModal, $rootScope, $window, system_dataPermissionResourceManageService, alertService, app) {
        // 部门查询对象
        $scope.dataPermissionResource = {};
        // 初始化菜单树
        initMenuTree($scope, $window, $rootScope, $compile, app);
        // // 初始化表格
        // initIndexTable($scope, $window, $rootScope, $compile);
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#dataPermissionResourceTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        // 初始化查询表单下拉框数据
        initIndexMetaData($scope, system_dataPermissionResourceManageService, alertService, $compile);

        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/permissionManage/dataPermissionResourceManage/add.html',
                size: '',
                resolve: {
                    resource: function () {
                        return $scope.dataPermissionResource;
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
                templateUrl: 'tpl/system/permissionManage/dataPermissionResourceManage/modify.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    },
                    resource: function () {
                        return $scope.dataPermissionResource;
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
                templateUrl: 'tpl/system/permissionManage/dataPermissionResourceManage/delete.html',
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
    system_dataPermissionResourceManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'system_dataPermissionResourceManageService', 'alertService', 'app'];

    // 初始化菜单树
    var initMenuTree = function ($scope, $window, $rootScope, $compile, app) {
        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight-100
        };
        // 树菜单参数设置
        $scope.isTreeInit = true; // 树菜单初始化
        $scope.zTreeOptions = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            async: {
                enable: true,
                url: app.api.address + "/system/permissionDataRange",
                type: "get",
                autoParam: ["sjqxzybh=sjfw"],
                otherParam: ["pageNum", "1", "pageSize", "0", "sjfw", "root"],
                dataFilter: function (treeId, parentNode, responseData) {
                    if (responseData && responseData.data) {
                        angular.forEach(responseData.data.list, function (data, index, array) {
                            if (data && data.isLeaf == "0") {
                                data.isParent = true;
                            } else {
                                data.isParent = false;
                            }
                        });
                    }
                    return responseData.data.list;
                }
            },
            data: {
                key: {
                    url: "",
                    name: "fwmc"
                },
                simpleData: {
                    enable: true,
                    idKey: "sjqxzybh",
                    pIdKey: "sjfw",
                    rootPId: ""
                }
            },
            callback: {
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    if ($scope.isTreeInit) {
                        // 设置初始化标识
                        $scope.isTreeInit = false;
                        // 加载根节点后，替换 otherParam 配置
                        treeObj.setting.async.otherParam = ["pageNum", "1", "pageSize", "0"];
                        // 模拟点击第一个根节点
                        var node = treeObj.getNodesByFilter(function (node) {
                            return node.level == 0;
                        }, true);
                        treeObj.expandNode(node, true);
                        angular.element("#" + node.tId + "_a").trigger("click");
                        // $scope.deptId 有值后调用
                        initIndexTable($scope, $window, $rootScope, $compile, app);
                    }
                },
                onClick: function (event, treeId, treeNode) {
                    $scope.dataPermissionResource.sjfw = treeNode.sjqxzybh;
                    $scope.dataPermissionResource.sjfwmc = treeNode.fwmc;
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#dataPermissionResourceTable').bootstrapTable('refresh');
                    } catch (e) {}
                },
                onExpand: function (event, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    treeObj.selectNode(treeNode);
                    $scope.dataPermissionResource.sjfw = treeNode.sjqxzybh;
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#dataPermissionResourceTable').bootstrapTable('refresh');
                    } catch (e) {
                    }
                }
            }
        };
    }
    
    // 添加控制器
    var openAddController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, system_dataPermissionResourceManageService,system_dataPermissionManageService, formVerifyService, alertService, resource) {
        // 初始化数据
        // $scope.dataPermissionResource = {};
        // 初始化下拉框数据
        initAddMetaData($scope, system_dataPermissionResourceManageService, alertService, $compile);
        $scope.dataPermission = {};
        $scope.dataPermission.sjfwmc = resource.sjfwmc;
        $scope.dataPermission.sjfw = resource.sjfw;
        console.log($scope.fwbhData);
        // 单位管理员选择器
        // $scope.selectFwbh = function () {
        //     $uibModal.open({
        //         animation: true,
        //         backdrop: 'static',
        //         templateUrl: 'tpl/system/permissionManage/dataPermissionManage/selector.html',
        //         size: 'lg',
        //         resolve: {
        //             item: function () {
        //                 return $scope.dataPermission;
        //             }
        //         },
        //         controller: system_dataPermissionSelectController
        //     });
        // }
        // var selectFwbh = function($scope, system_dataPermissionResourceManageService, alertService, $compile) {
        //     $scope.fwbhData = [
        //         {
        //             bh: '',
        //             mc: '== 请选择 =='
        //         }
        //     ];
        //     system_dataPermissionResourceManageService.findDataDimension({pageNum: 1, pageSize: 0}, function (error, message, data) {
        //         if (error) {
        //             alertService(message);
        //             return;
        //         }
        //         if (data && data.length > 0) {
        //             $scope.fwbhData = $scope.fwbhData.concat(data);
        //         }
        //         var html = '' +
        //             '<select ng-model="dataPermissionResource.fwbh" ui-chosen="dataPermissionResourceAddForm.fwbh" ng-required="true" id="fwbh_select" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
        //             '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>' +
        //             '</select>';
        //         angular.element("#fwbh_select").parent().empty().append(html);
        //         $compile(angular.element("#fwbh_select").parent().contents())($scope);
        //     });
        // }
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_dataPermissionResourceManageService.add($scope.dataPermission, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                refreshTreeNode(alertService);
                angular.element('#dataPermissionResourceTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'system_dataPermissionResourceManageService', 'system_dataPermissionManageService', 'formVerifyService', 'alertService', 'resource'];

    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, $uibModal, item, system_dataPermissionResourceManageService, alertService, formVerifyService, resource) {
        // 数据初始化
        //value="{{sjqxbhItem.sjqxbh}}">{{sjqxbhItem.wdmc}}
        $scope.dataPermission = item;
        $scope.dataPermission.sjfwmc = resource.sjfwmc;
        $scope.dataPermission.sjfw = resource.sjfw;
        initModifyMetaData($scope, system_dataPermissionResourceManageService,item, alertService, $compile);
        // system_dataPermissionResourceManageService.findDataPermissionById(item.sjqxbh, function (error, message, data) {
        //     if (error) {
        //         alertService(message);
        //         return;
        //     };
        //     $scope.dataPermissionResource = data;
        //     // 初始化下拉框数据
        //     initModifyMetaData($scope, system_dataPermissionResourceManageService, alertService, $compile);
        // });
        // 单位管理员选择器
        // $scope.selectFwbh = function () {
        //     $uibModal.open({
        //         animation: true,
        //         backdrop: 'static',
        //         templateUrl: 'tpl/system/permissionManage/dataPermissionManage/selector.html',
        //         size: 'lg',
        //         resolve: {
        //             item: function () {
        //                 return $scope.dataPermission;
        //             }
        //         },
        //         controller: system_dataPermissionSelectController
        //     });
        // }
       
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_dataPermissionResourceManageService.update($scope.dataPermission, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                refreshTreeNode(alertService);
                angular.element('#dataPermissionResourceTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_dataPermissionResourceManageService', 'alertService', 'formVerifyService', 'resource'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_dataPermissionResourceManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_dataPermissionResourceManageService.delete(item.sjqxzybh, function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#dataPermissionResourceTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
            refreshTreeNode(alertService);
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_dataPermissionResourceManageService', 'alertService'];

    // 初始化表格
    var initIndexTable = function($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 194;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var dataPermissionResourceQuery = {};
            angular.forEach($scope.dataPermissionResource, function (data, index, array) {
                if (data) {
                    dataPermissionResourceQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, dataPermissionResourceQuery));
            return angular.extend(pageParam, dataPermissionResourceQuery);
        };
        $scope.dataPermissionResourceTable = {
            //url: 'data_test/system/tableview_dataPermissionResource.json',
            url: app.api.address + '/system/permissionDataRange',
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
            sortName: 'xlh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "sjqxzybh", // 指定主键列
            uniqueId: "sjqxzybh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            singleSelect: true, // 单选
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#dataPermissionResourceTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#dataPermissionResourceTable').contents())($scope);
            },
            columns: [
                {field: "sjqxzybh", title: "数据权限资源编号", visible: false},
                {field: "fwmc", title: "数据权限名称", align: "left", valign: "middle"},
                {field: "fwz", title: "数据权限代码", align: "left", valign: "middle"},
                {field: "wdmc", title: "数据维度名称", align: "left", valign: "middle"},
                {field: "xlh", title: "序列号", align: "left", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='dataPermissionResource:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='dataPermissionResource:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
                        return modifyBtn + "&nbsp;" + deleteBtn;
                    }
                }
            ]
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#dataPermissionResourceTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.dataPermissionResource = {
                sjfw: $scope.dataPermissionResource.sjfw
            };
            // 重新初始化下拉框
            angular.element('form[name="dataPermissionResourceSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#dataPermissionResourceTable').bootstrapTable('selectPage', 1);
        };

        // 若页面已渲染，则替换表格元素
        if (angular.element("#dataPermissionResourceTableDiv").length > 0) {
            var html = '' +
                '<div id="toolbar" class="btn-group">' +
                '<div>' +
                '<button has-permission="dataPermissionResource:insert" type="button" class="btn btn-default add-btn" ng-click="openAdd()">' +
                '<span class="fa fa-plus toolbar-btn-icon"></span>新增' +
                '</button>' +
                '</div>' +
                '</div>' +
                '<table id="dataPermissionResourceTable" ui-jq="bootstrapTable" ui-options="dataPermissionResourceTable" class="table table-responsive"></table>';
            angular.element("#dataPermissionResourceTableDiv").empty().append(html);
            $compile(angular.element("#dataPermissionResourceTableDiv").contents())($scope);
        }
    }

    // 初始化主页下拉框数据
    var initIndexMetaData = function($scope, system_dataPermissionResourceManageService, alertService, $compile) {

        $scope.wdbhItemData = [
            {
                wddm: '',
                wdmc: '== 请选择 =='
            }
        ];
        system_dataPermissionResourceManageService.findDataDimension({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.wdbhItemData = $scope.wdbhItemData.concat(data);
            }
            var html = '' +
                '<select ng-model="dataPermissionResource.wddm" id="wddm" name="wddm" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="wdbhItem in wdbhItemData" value="{{wdbhItem.wddm}}">{{wdbhItem.wdmc}}</option>' +
                '</select>';
            angular.element("#wddm").parent().empty().append(html);
            $compile(angular.element("#wddm").parent().contents())($scope);
        });
    }

    // 初始化添加面板下拉框数据
    var initAddMetaData = function($scope, system_dataPermissionResourceManageService, alertService, $compile) {
        $scope.fwbhData = [
            {
                sjqxbh: '',
                wdmc: '== 请选择 =='
            }
        ];
        system_dataPermissionResourceManageService.findDataDimension({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.fwbhData = $scope.fwbhData.concat(data);

            }
            var html = '' +
                '<select ng-model="dataPermission.sjqxbh" ui-chosen="dataPermissionResourceAddForm.fwbh" ng-required="true" id="fwbh_select" name="fwbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.sjqxbh}}">{{fwbhItem.wdmc}}</option>' +
                '</select>';
            angular.element("#fwbh_select").parent().empty().append(html);
            $compile(angular.element("#fwbh_select").parent().contents())($scope);
        });
    }

    // 初始化修改面板下拉框数据
    var initModifyMetaData = function($scope, system_dataPermissionResourceManageService, item,alertService, $compile) {
        $scope.sjqxbhData = [
            {
                //value="{{sjqxbhItem.sjqxbh}}">{{sjqxbhItem.wdmc}}
                sjqxbh: '',
                wdmc: ''
            }
        ];
        system_dataPermissionResourceManageService.findDataDimension({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {

                $scope.sjqxbhData = $scope.sjqxbhData.concat(data);
            }
            var html = '' +
                '<select ng-model="dataPermission.sjqxbh" ui-chosen="dataPermissionResourceModifyForm.sjqxbh" ng-required="true" id="sjqxbh_select" name="sjqxbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="sjqxbhItem in sjqxbhData" value="{{sjqxbhItem.sjqxbh}}">{{sjqxbhItem.wdmc}}</option>' +
                '</select>';
            angular.element("#sjqxbh_select").parent().empty().append(html);
            $compile(angular.element("#sjqxbh_select").parent().contents())($scope);
        });
    }

    // 刷新菜单节点
    var refreshTreeNode = function (alertService) {
        var treeObj = $.fn.zTree.getZTreeObj("menuTree");
        var nodes = treeObj.getSelectedNodes();
        if (nodes.length == 0) {
            alertService("请先选择上级部门");
            return;
        };
        for (var i=0, l=nodes.length; i<l; i++) {
            nodes[i].isParent = true;
            treeObj.reAsyncChildNodes(nodes[i], "refresh", "false");
            treeObj.selectNode(nodes[i]);
            treeObj.expandNode(nodes[i], true);
        };
    };
})(window);
