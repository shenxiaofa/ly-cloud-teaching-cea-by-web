;(function (window, undefined) {
    'use strict';

    window.system_roleManageController = function ($compile, $scope, $uibModal, $rootScope, $window, system_roleManageService, alertService, app) {
        // 初始化页面表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 打开新增面板
        $scope.openAdd = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/roleManage/add.html',
                size: 'lg',
                controller: openAddController
            });
        };
        // 打开修改面板
        $scope.openModify = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/system/organization/roleManage/modify.html',
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
                templateUrl: 'tpl/system/organization/roleManage/delete.html',
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
    system_roleManageController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'system_roleManageService', 'alertService', 'app'];

    // 添加控制器
    var openAddController = function ($rootScope, $compile, $scope, $uibModalInstance, $uibModal, system_roleManageService, formVerifyService, alertService, app) {
        // 初始化数据
        $scope.role = {
            zt: '1', // 状态
            permissionList: {} // 权限（先用 map 再转 list）
        };
        // 级联选择
        $scope.selectRowAll = function (row) {
            if (row) {
                var row_qxbh = $scope.role.permissionList[row.qxbh];
                angular.forEach(row.underPermissionList, function(data, index, array){
                    if (row_qxbh) {
                        $scope.role.permissionList[data.qxbh] = data.qxbh;
                    } else {
                        $scope.role.permissionList[data.qxbh] = "";
                    };
                });
            }
        };
        // 转换返回数据
        var convertResponseForPermissionTable = function (response) {
            var permissionData = [];
            angular.forEach(response.data, function(domain, index, array){
                if (domain && domain.servingList) {
                    angular.forEach(domain.servingList, function(serving, index, array){
                        if (serving && serving.permissionList) {
                            angular.forEach(serving.permissionList, function(permission, index, array){
                                if (permission) {
                                    permission.domain = {
                                        bh: domain.bh,
                                        mc: domain.mc
                                    };
                                    permission.serving = {
                                        bh: serving.bh,
                                        mc: serving.mc
                                    };
                                    permissionData.push(permission);
                                }
                            });
                        }
                    });
                }
            });
            return permissionData;
        };
        // 合并单元格
        var mergeCellsForPermissionTable = function (data) {
            var previous = {
                domain: {
                    startIndex: 0,
                    endIndex: null,
                    bh: null
                },
                serving: {
                    startIndex: 0,
                    endIndex: null,
                    bh: null
                }
            };
            var len = data.length;
            angular.forEach(data, function(permission, index, array){
                if (index == 0) { // 第一行
                    previous.domain.bh = permission.domain.bh;
                    previous.serving.bh = permission.serving.bh;
                } else if (index == len-1){ // 最后一行
                    if (previous.domain && permission.domain && previous.domain.bh == permission.domain.bh) {
                        previous.domain.endIndex = index;
                    }
                    if (previous.domain.endIndex) {
                        angular.element('#permissionTable').bootstrapTable('mergeCells', {index: previous.domain.startIndex, field: 'domain.mc', rowspan: previous.domain.endIndex-previous.domain.startIndex+1});
                    }
                    if (previous.serving && permission.serving && previous.serving.bh == permission.serving.bh) {
                        previous.serving.endIndex = index;
                    }
                    if (previous.serving.endIndex) {
                        angular.element('#permissionTable').bootstrapTable('mergeCells', {index: previous.serving.startIndex, field: 'serving.mc', rowspan: previous.serving.endIndex-previous.serving.startIndex+1});
                    }
                } else {
                    if (previous.domain && permission.domain && previous.domain.bh == permission.domain.bh) {
                        previous.domain.endIndex = index;
                    } else {
                        if (previous.domain.endIndex) {
                            angular.element('#permissionTable').bootstrapTable('mergeCells', {index: previous.domain.startIndex, field: 'domain.mc', rowspan: previous.domain.endIndex-previous.domain.startIndex+1});
                        }
                        previous.domain.startIndex = index;
                        previous.domain.endIndex = null;
                        previous.domain.bh = permission.domain.bh;
                    }
                    if (previous.serving && permission.serving && previous.serving.bh == permission.serving.bh) {
                        previous.serving.endIndex = index;
                    } else {
                        if (previous.serving.endIndex) {
                            angular.element('#permissionTable').bootstrapTable('mergeCells', {index: previous.serving.startIndex, field: 'serving.mc', rowspan: previous.serving.endIndex-previous.serving.startIndex+1});
                        }
                        previous.serving.startIndex = index;
                        previous.serving.endIndex = null;
                        previous.serving.bh = permission.serving.bh;
                    }
                }
            });
        };
        // 适配模块显示
        var formatterMc = function (value, row, index) {
            var param = {
                id: "p_" + index
            };
            var html = '';
            if (value) {
                html += '<div>';
                html += "<input ng-model='role.permissionList[\"" + row.qxbh + "\"]' ng-click='selectRowAll(" + angular.toJson(row) + ")' ng-true-value='\"" + row.qxbh + "\"' ng-false-value='\"\"' id='p_" + index + "' type='checkbox' style='vertical-align:middle; cursor: pointer;'>";
                html += '<label for="p_' + index + '" style="vertical-align:middle; margin-left: 3px; cursor: pointer;">' + value + '</label>';
                html += '</div>';
            }
            return html;
        };
        var formatterUnderPermissionList = function (value, row, index) {
            var _index = index;
            var html = '';
            if (value) {
                angular.forEach(value, function(data, index, array){
                    var param = {
                        id: "p_" + _index + "_" + index
                    };
                    html += '<div style="line-height: 30px;">';
                    html += "<input ng-model='role.permissionList[\"" + data.qxbh + "\"]' ng-true-value='\"" + data.qxbh + "\"' ng-false-value='\"\"' id='p_" + _index + "_" + index + "' type='checkbox' style='vertical-align:middle; cursor: pointer;'>";
                    html += '<label for="p_' + _index + '_' + index + '" style="vertical-align:middle; margin-left: 3px; cursor: pointer;">' + data.mc + '</label>';
                    html += '</div>';
                });
            };
            return html;
        };
        // 权限
        $scope.permissionTable = {
            //url: 'data_test/system/tableview_permission_format.json',
            url: app.api.address + '/system/permission/format',
            method: 'get',
            cache: false,
            striped: true,
            sortable: false, // 禁用排序
            height: 500,
            responseHandler:function(response){
                return convertResponseForPermissionTable(response);
            },
            onLoadSuccess: function(data) {
                // 合并单元格
                mergeCellsForPermissionTable(data);
                $compile(angular.element('#permissionTable').contents())($scope);
            },
            columns: [
                {field:"domain.mc", title:"域",align:"left",valign:"middle"},
                {field:"serving.mc",title:"服务",align:"left",valign:"middle"},
                {field:"lx",title:"类型",align:"left",valign:"middle",
                    formatter : function (value, row, index) {
                        if (value == "function") {
                            return "功能"
                        }
                        return value;
                    }
                },
                {field:"mc",title:"模块",align:"left",valign:"middle", formatter:formatterMc},
                {field:"underPermissionList",title:"操作",align:"left",valign:"middle", formatter:formatterUnderPermissionList}
            ]
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var permissionList = [];
            var permissionListTemp = $scope.role.permissionList;
            angular.forEach(permissionListTemp, function(data, index, array){
                if (data) {
                    permissionList.push(data);
                }
            });
            $scope.role.permissionList = permissionList;
            $rootScope.showLoading = true; // 开启加载提示
            system_roleManageService.add($scope.role, 'role:insert', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    $scope.role.permissionList = permissionListTemp;
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#roleTable').bootstrapTable('refresh');
                alertService('success', '新增成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openAddController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', '$uibModal', 'system_roleManageService', 'formVerifyService', 'alertService', 'app'];

    // 修改控制器
    var openModifyController = function ($rootScope, $timeout, $compile, $scope, $uibModalInstance, item, system_roleManageService, alertService, formVerifyService, app) {
        // 数据初始化
        $scope.role = {
            lx: item.lx,
            permissionList: {} // 权限（先用 map 再转 list）
        };
        // 级联选择
        $scope.selectRowAll = function (row) {
            if (row) {
                var row_qxbh = $scope.role.permissionList[row.qxbh];
                angular.forEach(row.underPermissionList, function(data, index, array){
                    if (row_qxbh) {
                        $scope.role.permissionList[data.qxbh] = data.qxbh;
                    } else {
                        $scope.role.permissionList[data.qxbh] = "";
                    };
                });
            }
        };
        // 转换返回数据
        var convertResponseForPermissionTable = function (response) {
            var permissionData = [];
            angular.forEach(response.data, function(domain, index, array){
                if (domain && domain.servingList) {
                    angular.forEach(domain.servingList, function(serving, index, array){
                        if (serving && serving.permissionList) {
                            angular.forEach(serving.permissionList, function(permission, index, array){
                                if (permission) {
                                    permission.domain = {
                                        bh: domain.bh,
                                        mc: domain.mc
                                    };
                                    permission.serving = {
                                        bh: serving.bh,
                                        mc: serving.mc
                                    };
                                    permissionData.push(permission);
                                }
                            });
                        }
                    });
                }
            });
            return permissionData;
        };
        // 合并单元格
        var mergeCellsForPermissionTable = function (data) {
            var previous = {
                domain: {
                    startIndex: 0,
                    endIndex: null,
                    bh: null
                },
                serving: {
                    startIndex: 0,
                    endIndex: null,
                    bh: null
                }
            };
            var len = data.length;
            angular.forEach(data, function(permission, index, array){
                if (index == 0) { // 第一行
                    previous.domain.bh = permission.domain.bh;
                    previous.serving.bh = permission.serving.bh;
                } else if (index == len-1){ // 最后一行
                    if (previous.domain && permission.domain && previous.domain.bh == permission.domain.bh) {
                        previous.domain.endIndex = index;
                    }
                    if (previous.domain.endIndex) {
                        angular.element('#permissionTable').bootstrapTable('mergeCells', {index: previous.domain.startIndex, field: 'domain.mc', rowspan: previous.domain.endIndex-previous.domain.startIndex+1});
                    }
                    if (previous.serving && permission.serving && previous.serving.bh == permission.serving.bh) {
                        previous.serving.endIndex = index;
                    }
                    if (previous.serving.endIndex) {
                        angular.element('#permissionTable').bootstrapTable('mergeCells', {index: previous.serving.startIndex, field: 'serving.mc', rowspan: previous.serving.endIndex-previous.serving.startIndex+1});
                    }
                } else {
                    if (previous.domain && permission.domain && previous.domain.bh == permission.domain.bh) {
                        previous.domain.endIndex = index;
                    } else {
                        if (previous.domain.endIndex) {
                            angular.element('#permissionTable').bootstrapTable('mergeCells', {index: previous.domain.startIndex, field: 'domain.mc', rowspan: previous.domain.endIndex-previous.domain.startIndex+1});
                        }
                        previous.domain.startIndex = index;
                        previous.domain.endIndex = null;
                        previous.domain.bh = permission.domain.bh;
                    }
                    if (previous.serving && permission.serving && previous.serving.bh == permission.serving.bh) {
                        previous.serving.endIndex = index;
                    } else {
                        if (previous.serving.endIndex) {
                            angular.element('#permissionTable').bootstrapTable('mergeCells', {index: previous.serving.startIndex, field: 'serving.mc', rowspan: previous.serving.endIndex-previous.serving.startIndex+1});
                        }
                        previous.serving.startIndex = index;
                        previous.serving.endIndex = null;
                        previous.serving.bh = permission.serving.bh;
                    }
                }
            });
        };
        // 适配模块显示
        var formatterMc = function (value, row, index) {
            var param = {
                id: "p_" + index
            };
            var html = '';
            if (value) {
                html += '<div>';
                html += "<input ng-model='role.permissionList[\"" + row.qxbh + "\"]' ng-click='selectRowAll(" + angular.toJson(row) + ")' ng-true-value='\"" + row.qxbh + "\"' ng-false-value='\"\"' id='p_" + index + "' type='checkbox' style='vertical-align:middle; cursor: pointer;'>";
                html += '<label for="p_' + index + '" style="vertical-align:middle; margin-left: 3px; cursor: pointer;">' + value + '</label>';
                html += '</div>';
            }
            return html;
        };
        var formatterUnderPermissionList = function (value, row, index) {
            var _index = index;
            var html = '';
            if (value) {
                angular.forEach(value, function(data, index, array){
                    var param = {
                        id: "p_" + _index + "_" + index
                    };
                    html += '<div style="line-height: 30px;">';
                    html += "<input ng-model='role.permissionList[\"" + data.qxbh + "\"]' ng-true-value='\"" + data.qxbh + "\"' ng-false-value='\"\"' id='p_" + _index + "_" + index + "' type='checkbox' style='vertical-align:middle; cursor: pointer;'>";
                    html += '<label for="p_' + _index + '_' + index + '" style="vertical-align:middle; margin-left: 3px; cursor: pointer;">' + data.mc + '</label>';
                    html += '</div>';
                });
            };
            return html;
        };
        // 权限
        $scope.permissionTable = {
            //url: 'data_test/system/tableview_permission_format.json',
            url: app.api.address + '/system/permission/format',
            method: 'get',
            cache: false,
            striped: true,
            sortable: false, // 禁用排序
            height: 500,
            responseHandler:function(response){
                return convertResponseForPermissionTable(response);
            },
            onLoadSuccess: function(data) {
                // 合并单元格
                mergeCellsForPermissionTable(data);
                $compile(angular.element('#permissionTable').contents())($scope);
                // 根据主键查询（回显数据）
                system_roleManageService.findById(item.jsbh, 'role:update', function (error, message, permissionData) {
                    if (error) {
                        alertService(message);
                        return;
                    }
                    $scope.role.jsbh = permissionData.jsbh;
                    $scope.role.mc = permissionData.mc;
                    $scope.role.lx = permissionData.lx;
                    $scope.role.zt = permissionData.zt;
                    if (permissionData) {
                        angular.forEach(permissionData.permissionList, function(qxbh, index, array){
                            $scope.role.permissionList[qxbh] = qxbh;
                        });
                    };
                });
            },
            columns: [
                {field:"domain.mc", title:"域",align:"left",valign:"middle"},
                {field:"serving.mc",title:"服务",align:"left",valign:"middle"},
                {field:"lx",title:"类型",align:"left",valign:"middle",
                    formatter : function (value, row, index) {
                        if (value == "function") {
                            return "功能"
                        }
                        return value;
                    }
                },
                {field:"mc",title:"模块",align:"left",valign:"middle", formatter:formatterMc},
                {field:"underPermissionList",title:"操作",align:"left",valign:"middle", formatter:formatterUnderPermissionList}
            ]
        };
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var permissionList = [];
            var permissionListTemp = $scope.role.permissionList;
            angular.forEach(permissionListTemp, function(data, index, array){
                if (data) {
                    permissionList.push(data);
                }
            });
            $scope.role.permissionList = permissionList;
            $rootScope.showLoading = true; // 开启加载提示
            system_roleManageService.update($scope.role, 'role:update', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    $scope.role.permissionList = permissionListTemp;
                    alertService(message);
                    return;
                }
                $uibModalInstance.close();
                angular.element('#roleTable').bootstrapTable('refresh');
                alertService('success', '修改成功');
            });
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openModifyController.$inject = ['$rootScope', '$timeout', '$compile', '$scope', '$uibModalInstance', 'item', 'system_roleManageService', 'alertService', 'formVerifyService', 'app'];

    // 删除控制器
    var openDeleteController = function ($rootScope, $scope, $uibModalInstance, item, system_roleManageService, alertService) {
        $scope.message = "确定要删除吗？";
        $scope.ok = function () {
            $rootScope.showLoading = true; // 开启加载提示
            system_roleManageService.delete(item.jsbh, 'role:delete', function (error, message) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#roleTable').bootstrapTable('refresh');
                alertService('success', '删除成功');
            });
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'item', 'system_roleManageService', 'alertService'];

    // 初始化页面表格
    var initIndexTable = function ($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 224;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var roleQuery = {};
            angular.forEach($scope.role, function(data, index, array){
                if (data) {
                    roleQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, roleQuery));
            return angular.extend(pageParam, roleQuery);
        };
        $scope.roleTable = {
            //url: 'data_test/system/tableview_role.json',
            url: app.api.address + '/system/role',
            headers: {
                permission: "role:query"
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
            idField: "jsbh", // 指定主键列
            uniqueId: "jsbh", // 每行唯一标识
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
                $compile(angular.element('#roleTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#roleTable').contents())($scope);
            },
            columns: [
                {field: "jsbh", title: "角色编号"},
                {field: "mc", title: "角色名称", align: "left", valign: "middle"},
                {field: "lx", title: "角色类型", align: "left", valign: "middle",
                    formatter: function (value, row, index) {
                        var data = "";
                        switch(value) {
                            case "1":
                                data = "组织类";
                                break;
                            case "2":
                                data = "非组织类";
                                break;
                            case "3":
                                data = "公共类";
                                break;
                            default:
                                data;
                        };
                        return data;
                    }
                },
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
                        var modifyBtn = "<button has-permission='role:update' type='button' class='btn btn-sm btn-default' ng-click='openModify(" + angular.toJson(row) + ")'><span class='fa fa-edit toolbar-btn-icon'></span>修改</button>";
                        var deleteBtn = "<button has-permission='role:delete' type='button' class='btn btn-sm btn-default del-btn' ng-click='openDelete(" + angular.toJson(row) + ")'><span class='fa fa-times toolbar-btn-icon'></span>删除</button>";
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
            angular.element('#roleTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#roleTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.role = {};
            // 重新初始化下拉框
            angular.element('form[name="roleSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#roleTable').bootstrapTable('selectPage', 1);
        }
    }

})(window);
