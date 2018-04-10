;(function (window, undefined) {
    'use strict';

    window.system_departmentManageController = function ($compile, $scope, $uibModal, $rootScope, $window, system_departmentManageService, alertService, app) {
        // 部门查询对象
        $scope.department = {};
        // 初始化菜单树
        initMenuTree($scope, $window, app);
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, app, $compile, system_departmentManageService, alertService);
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/departmentManage/add.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.department;
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
                templateUrl: 'tpl/system/organization/departmentManage/modify.html',
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
                templateUrl: 'tpl/system/organization/departmentManage/delete.html',
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
    system_departmentManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'system_departmentManageService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, system_departmentManageService, system_userManageService, system_roleManageService, formVerifyService, alertService, item) {
        // 初始数据
        $scope.department = {
            sjdwh: item.sjdwh // 上级部门
        };
        // 初始化查询单位类型
        $scope.dwlxbhData = [
            {
                dwlbbh: '',
                lxmc: '== 请选择 =='
            }
        ];
        system_departmentManageService.findDepartmentType({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.dwlxbhData = $scope.dwlxbhData.concat(data);
            };
            var html = '' +
                '<select ng-model="department.dwlxbh" ui-chosen="departmentAddForm.dwlxbh" ng-required="true" id="dwlxbh_select" name="dwlxbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="dwlxbhItem in dwlxbhData" value="{{dwlxbhItem.dwlbbh}}">{{dwlxbhItem.lxmc}}</option>'+
                '</select>';
            angular.element("#dwlxbh_select").parent().empty().append(html);
            $compile(angular.element("#dwlxbh_select").parent().contents())($scope);
        });
        // 初始化查询上级部门
        $scope.sjdwhData = [
            {
                dwh: '',
                dwmc: '== 请选择 =='
            }
        ];
        system_departmentManageService.findDepartmentById($scope.department.sjdwh, 'department:insert', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.sjdwhData = [
                {
                    dwh: data.dwh,
                    dwmc: data.dwmc
                }
            ];
            var html = '' +
                '<select ng-model="department.sjdwh" ui-chosen="departmentAddForm.sjdwh" ng-required="true" id="sjdwh_select" name="sjdwh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="sjdwhItem in sjdwhData" value="{{sjdwhItem.dwh}}">{{sjdwhItem.dwmc}}</option>'+
                '</select>';
            angular.element("#sjdwh_select").parent().empty().append(html);
            $compile(angular.element("#sjdwh_select").parent().contents())($scope);
        });
        // 初始化查询角色
        $scope.jsbhData = [];
        system_roleManageService.findRole({pageNum: 1, pageSize: 0, zt: "1"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.jsbhData = data;
            };
            var html = '' +
                '<select ng-model="department.jsbh" id="jsbh_select" name="jsbh" ui-jq="chosen" ui-options="{search_contains: true}" multiple class="form-control">'+
                '<option ng-repeat="jsbhItem in jsbhData" value="{{jsbhItem.jsbh}}">{{jsbhItem.mc}}</option>'+
                '</select>';
            angular.element("#jsbh_select").parent().empty().append(html);
            $compile(angular.element("#jsbh_select").parent().contents())($scope);
        });
        // 初始化查询单位管理员
        $scope.bmglyData = [
            {
                yhbh: '',
                xm: '== 请选择 =='
            }
        ];
        // 单位管理员选择器
        $scope.selectBmgly = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userManage/selector.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.department;
                    }
                },
                controller: system_userSelectController
            });
        }
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_departmentManageService.add($scope.department, 'department:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                refreshTreeNode(alertService); // 刷新菜单树
                angular.element('#departmentTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'system_departmentManageService', 'system_userManageService', 'system_roleManageService', 'formVerifyService', 'alertService', 'item'];

    // 修改控制器
    var openModifyController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, item, system_departmentManageService, system_userManageService, system_roleManageService, alertService, formVerifyService) {
        // 数据初始化
        $scope.department = item;
        system_departmentManageService.findDepartmentById(item.dwh, 'department:update', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.department = data;
            if (data.bmglyst) {
                $scope.department.bmglymc = data.bmglyst.xm;
            }
        });
        // 初始化查询单位类型
        $scope.dwlxbhData = [
            {
                dwlbbh: '',
                lxmc: '== 请选择 =='
            }
        ];
        system_departmentManageService.findDepartmentType({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.dwlxbhData = $scope.dwlxbhData.concat(data);
            };
            var html = '' +
                '<select ng-model="department.dwlxbh" ui-chosen="departmentAddForm.dwlxbh" ng-required="true" id="dwlxbh_select" name="dwlxbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="dwlxbhItem in dwlxbhData" value="{{dwlxbhItem.dwlbbh}}">{{dwlxbhItem.lxmc}}</option>'+
                '</select>';
            angular.element("#dwlxbh_select").parent().empty().append(html);
            $compile(angular.element("#dwlxbh_select").parent().contents())($scope);
        });
        // 初始化查询上级部门
        $scope.sjdwhData = [
            {
                dwh: '',
                dwmc: '== 请选择 =='
            }
        ];
        system_departmentManageService.findDepartmentById($scope.department.sjdwh, 'department:update', function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            $scope.sjdwhData = [
                {
                    dwh: data.dwh,
                    dwmc: data.dwmc
                }
            ];
            var html = '' +
                '<select ng-model="department.sjdwh" ui-chosen="departmentAddForm.sjdwh" ng-required="true" id="sjdwh_select" name="sjdwh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">'+
                '<option ng-repeat="sjdwhItem in sjdwhData" value="{{sjdwhItem.dwh}}">{{sjdwhItem.dwmc}}</option>'+
                '</select>';
            angular.element("#sjdwh_select").parent().empty().append(html);
            $compile(angular.element("#sjdwh_select").parent().contents())($scope);
        });
        // 初始化查询角色
        $scope.jsbhData = [];
        system_roleManageService.findRole({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            };
            if (data && data.length > 0) {
                $scope.jsbhData = data;
            };
            var html = '' +
                '<select ng-model="department.jsbh" id="jsbh_select" name="jsbh" ui-jq="chosen" ui-options="{search_contains: true}" multiple class="form-control">'+
                '<option ng-repeat="jsbhItem in jsbhData" value="{{jsbhItem.jsbh}}">{{jsbhItem.mc}}</option>'+
                '</select>';
            angular.element("#jsbh_select").parent().empty().append(html);
            $compile(angular.element("#jsbh_select").parent().contents())($scope);
        });
        // 初始化查询单位管理员
        $scope.bmglyData = [
            {
                yhbh: '',
                xm: '== 请选择 =='
            }
        ];
        // 单位管理员选择器
        $scope.selectBmgly = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/userManage/selector.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.department;
                    }
                },
                controller: system_userSelectController
            });
        }
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            $rootScope.showLoading = true; // 开启加载提示
            system_departmentManageService.update($scope.department, 'department:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                refreshTreeNode(alertService); // 刷新菜单树
                angular.element('#departmentTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'item', 'system_departmentManageService', 'system_userManageService', 'system_roleManageService', 'alertService', 'formVerifyService'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_departmentManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_departmentManageService.delete(item.dwh, 'department:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                };
                refreshTreeNode(alertService); // 刷新菜单树
                angular.element('#departmentTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_departmentManageService', 'alertService'];

    // 初始化菜单树
    var initMenuTree = function ($scope, $window, app) {
        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight - 100
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
                    permission: "department:query"
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
                        angular.element("#" + node.tId + "_a").trigger("click");
                    }
                    ;
                },
                onClick: function (event, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    treeObj.expandNode(treeNode, true);
                    $scope.department.sjdwh = treeNode.dwh;
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#departmentTable').bootstrapTable('refresh');
                    } catch (e) {
                    }
                },
                onExpand: function (event, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    treeObj.selectNode(treeNode);
                    $scope.department.sjdwh = treeNode.dwh;
                    // 刷新右边内容数据（若是初始化，由于表格未初始化，报异常，不需处理）
                    try {
                        angular.element('#departmentTable').bootstrapTable('refresh');
                    } catch (e) {
                    }
                }
            }
        };
    }

    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, app, $compile, system_departmentManageService, alertService) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 194;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var departmentQuery = {};
            angular.forEach($scope.department, function (data, index, array) {
                if (data) {
                    departmentQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, departmentQuery));
            return angular.extend(pageParam, departmentQuery);
        };
        $scope.departmentTable = {
            //url: 'data_test/system/tableview_department.json',
            url: app.api.address + '/system/department',
            headers: {
                permission: "department:query"
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
                $compile(angular.element('#departmentTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#departmentTable').contents())($scope);
            },
            columns: [
                {field: "dwh", title: "单位编号", align: "left", valign: "middle"},
                {field: "dwmc", title: "单位名称", align: "left", valign: "middle"},
                {
                    field: "dwlxbh", title: "单位类型", align: "left", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch (value) {
                            case "school":
                                data = "学校";
                                break;
                            case "college":
                                data = "学院";
                                break;
                            case "major":
                                data = "专业";
                                break;
                            case "class":
                                data = "班级";
                                break;
                            case "department":
                                data = "部门";
                                break;
                            case "category":
                                data = "分类";
                                break;
                            default:
                                data;
                        }
                        ;
                        return data;
                    }
                },
                {field: "dh", title: "电话", align: "center", valign: "middle"},
                {field: "bmglymc", title: "单位管理员", align: "center", valign: "middle"},
                {
                    field: "operation", title: "操作", align: "center", valign: "middle",
                    formatter: function (value, row, index) {
                        var modifyBtn = "<button has-permission='department:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='department:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
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
                $scope.table_height = $scope.table_height + 75;
            } else {
                $scope.table_height = $scope.table_height - 75;
            }
            angular.element('#departmentTable').bootstrapTable('resetView', {height: $scope.table_height});
        };
        // 初始化查询表单下拉框数据
        $scope.dwlxbhData = [
            {
                dwlbbh: '',
                lxmc: '== 请选择 =='
            }
        ];
        system_departmentManageService.findDepartmentType({pageNum: 1, pageSize: 0}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            ;
            if (data && data.length > 0) {
                $scope.dwlxbhData = $scope.dwlxbhData.concat(data);
            }
            ;
            var html = '' +
                '<select ng-model="department.dwlxbh" id="dwlxbh" name="dwlxbh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="dwlxbhItem in dwlxbhData" value="{{dwlxbhItem.dwlbbh}}">{{dwlxbhItem.lxmc}}</option>' +
                '</select>';
            angular.element("#dwlxbh").parent().empty().append(html);
            $compile(angular.element("#dwlxbh").parent().contents())($scope);
        });
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#departmentTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.department = {
                sjdwh: $scope.department.sjdwh
            };
            // 重新初始化下拉框
            angular.element('form[name="departmentSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#departmentTable').bootstrapTable('selectPage', 1);
        }
    }

    // 刷新菜单节点
    var refreshTreeNode = function (alertService) {
        var treeObj = $.fn.zTree.getZTreeObj("menuTree");
        var nodes = treeObj.getSelectedNodes();
        if (nodes.length == 0) {
            alertService("请先选择上级部门");
            return;
        }
        for (var i=0, l=nodes.length; i<l; i++) {
            nodes[i].isParent = true;
            treeObj.reAsyncChildNodes(nodes[i], "refresh", "false");
            treeObj.selectNode(nodes[i]);
            treeObj.expandNode(nodes[i], true);
        }
    };
})(window);
