;(function (window, undefined) {
    'use strict';

    window.system_userManageController = function ($timeout, $compile, $scope, $uibModal, $rootScope, $window, system_userManageService, alertService, app) {
        // 用户查询对象
        $scope.user = {};
        // 初始化菜单树
        initMenuTree($scope, $window, $rootScope, $compile, $timeout, app);
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userManage/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return angular.extend($scope.user, {bmbh: $scope.deptId});
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
                templateUrl: 'tpl/system/organization/userManage/modify.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return angular.extend(row, {bmbh: $scope.deptId});
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
                templateUrl: 'tpl/system/organization/userManage/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return angular.extend(row, {bmbh: $scope.deptId});
                    }
                },
                controller: openDeleteController
            });
        };
    };
    system_userManageController.$inject = ['$timeout', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'system_userManageService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, system_userManageService, system_departmentManageService, system_roleManageService, formVerifyService, alertService, item, app) {
        // 初始数据
        $scope.user = {
            bmbh: item.bmbh, // 所属部门
            xbm: "1", // 性别
            zt: "1" // 状态
        };
        // 初始化下拉框数据
        initAddAndModifyMetaData($scope, system_departmentManageService, item, alertService, $compile, system_roleManageService);
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_userManageService.add($scope.user, 'user:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#userTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + item.bmbh + "/users"});
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'system_userManageService', 'system_departmentManageService', 'system_roleManageService', 'formVerifyService', 'alertService', 'item', 'app'];

    // 修改控制器
    var openModifyController = function ($rootScope, $compile, $scope, $uibModalInstance, item, system_userManageService, system_departmentManageService, system_roleManageService, alertService, formVerifyService, app) {
        // 数据初始化
        $scope.user = item;
        system_userManageService.findUserById(item.yhbh, 'user:update', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.user = data;
            $scope.user.mm = ""; // 密码不返回
            // 初始化下拉框数据
            initAddAndModifyMetaData($scope, system_departmentManageService, $scope.user, alertService, $compile, system_roleManageService);
        });
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_userManageService.update($scope.user, 'user:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#userTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + item.bmbh + "/users"});
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', 'item', 'system_userManageService', 'system_departmentManageService', 'system_roleManageService', 'alertService', 'formVerifyService', 'app'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_userManageService, alertService, app) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_userManageService.delete(item.yhbh, 'user:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#userTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + item.bmbh + "/users"});
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_userManageService', 'alertService', 'app'];

    // 初始化菜单树
    var initMenuTree = function ($scope, $window, $rootScope, $compile, $timeout, app) {
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
                headers: {
                    permission: "user:query"
                },
                url: app.api.address + "/system/department",
                type: "get",
                autoParam: ["dwh=sjdwh"],
                otherParam: ["pageNum", "1", "pageSize", "0", "sjdwh", "root"],
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
                    name: "dwmc"
                },
                simpleData: {
                    enable: true,
                    idKey: "dwh",
                    pIdKey: "sjdwh",
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
                    $scope.deptId = treeNode.dwh;
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#userTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + $scope.deptId + "/users"});
                    } catch (e) {}
                }
            }
        };
    }

    // 初始化 index 页面的 userTable
    var initIndexTable = function ($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 196;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var userQuery = {};
            angular.forEach($scope.user, function(data, index, array){
                if (data) {
                    userQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, userQuery));
            return angular.extend(pageParam, userQuery);
        };
        $scope.userTable = {
            //url: 'data_test/system/tableview_user.json',
            url: app.api.address + '/system/department/' + $scope.deptId + "/users",
            headers: {
                permission: "user:query"
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
            sortName: 'yhbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "yhbh", // 指定主键列
            uniqueId: "yhbh", // 每行唯一标识
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
                $compile(angular.element('#userTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#userTable').contents())($scope);
            },
            columns: [
                {field: "yhbh", title: "用户名",},
                {field: "xm", title: "姓名", align: "left", valign: "middle"},
                {field: "nc", title: "昵称", align: "left", valign: "middle"},
                {field: "yddh", title: "移动电话", align: "center", valign: "middle"},
                {field: "dzyx", title: "电子邮箱", align: "center", valign: "middle"},
                {field: "qq", title: "QQ", align: "center", valign: "middle"},
                {field: "zt", title: "状态", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch(value) {
                            case "0":
                                data = "停用";
                                break;
                            case "1":
                                data = "启用";
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
                        var privilegeBtn = "<button has-permission='user:query' type='button' class='btn btn-sm btn-default' ng-click=''><span class='fa fa-search toolbar-btn-icon'></span>查看权限</button>";
                        var modifyBtn = "<button has-permission='user:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='user:delete' type='button' class='btn btn-sm btn-default' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
                        return privilegeBtn + "&nbsp;" + modifyBtn + "&nbsp;" + deleteBtn;
                    }
                }
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
            angular.element('#userTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#userTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + $scope.deptId + "/users"});
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.user = {
                dwh: $scope.user.dwh
            };
            // 重新初始化下拉框
            angular.element('form[name="userSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#userTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + $scope.deptId + "/users"});
        }
        // 若页面已渲染，则替换表格元素
        if (angular.element("#userTableDiv").length > 0) {
            var html = '' +
                '<div id="toolbar" class="btn-group">' +
                '<div>' +
                '<button has-permission="user:insert" type="button" class="btn btn-default add-btn" ng-click="openAdd()">' +
                '<span class="fa fa-plus toolbar-btn-icon"></span>新增' +
                '</button>' +
                '</div>' +
                '</div>' +
                '<table id="userTable" ui-jq="bootstrapTable" ui-options="userTable" class="table table-responsive"></table>';
            angular.element("#userTableDiv").empty().append(html);
            $compile(angular.element("#userTableDiv").contents())($scope);
        }
    }

    // 初始化添加和修改面板下拉框数据
    var initAddAndModifyMetaData = function ($scope, system_departmentManageService, item, alertService, $compile, system_roleManageService) {
        // 初始化查询所属部门
        $scope.bmbhData = [
            {
                dwh: '',
                dwmc: '== 请选择 =='
            }
        ];
        system_departmentManageService.findDepartmentById(item.bmbh, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.bmbhData = [
                {
                    dwh: data.dwh,
                    dwmc: data.dwmc
                }
            ];
            var html = '' +
                '<select ng-model="user.bmbh" ui-chosen="userAddForm.bmbh" ng-required="true" id="bmbh_select" name="bmbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="bmbhItem in bmbhData" value="{{bmbhItem.dwh}}">{{bmbhItem.dwmc}}</option>' +
                '</select>';
            angular.element("#bmbh_select").parent().empty().append(html);
            $compile(angular.element("#bmbh_select").parent().contents())($scope);
        });
        // 初始化角色
        $scope.yhjsData = [];
        system_roleManageService.findRole({pageNum: 1, pageSize: 0, zt: "1"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if (data && data.length > 0) {
                $scope.yhjsData = data;
            }
            var html = '' +
                '<select ng-model="user.yhjs" id="yhjs_select" name="yhjs" ui-jq="chosen" multiple ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="yhjsItem in yhjsData" value="{{yhjsItem.jsbh}}">{{yhjsItem.mc}}</option>' +
                '</select>';
            angular.element("#yhjs_select").parent().empty().append(html);
            $compile(angular.element("#yhjs_select").parent().contents())($scope);
        });
    }

})(window);
