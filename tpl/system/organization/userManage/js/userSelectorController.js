;(function (window, undefined) {
    'use strict';

    window.system_userSelectController = function ($compile, $scope, $window, $uibModalInstance, $rootScope, system_userManageService, alertService, app, item) {
        // 用户查询对象
        $scope.user = {};
        // 初始化菜单树
        initMenuTree($scope, $window, $rootScope, $compile, app);
        // 选择单位管理员重置
        $scope.selectBmglyReset = function () {
            item.bmgly = '';
            item.bmglymc = '';
            $uibModalInstance.close();
        };
        $scope.ok = function () {
            // 处理前验证
            var rows = angular.element('#selectUserTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择单位管理员');
                return;
            }
            item.bmgly = rows[0].yhbh;
            item.bmglymc = rows[0].xm;
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    system_userSelectController.$inject = ['$compile', '$scope', '$window', '$uibModalInstance', '$rootScope', 'system_userManageService', 'alertService', 'app', 'item'];

    // 初始化菜单树
    var initMenuTree = function ($scope, $window, $rootScope, $compile, app) {
        //tree菜单高度
        $scope.leftTreeStyle = {
            "height": $window.innerHeight-270
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
                        angular.element('#selectUserTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + $scope.deptId + "/users"});
                    } catch (e) {}
                }
            }
        };
    }

    // 初始化 index 页面的 selectUserTable
    var initIndexTable = function ($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 425;
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
        $scope.selectUserTable = {
            //url: 'data_test/system/tableview_user.json',
            url: app.api.address + '/system/department/' + $scope.deptId + "/users",
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
            sortName: 'yhbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "yhbh", // 指定主键列
            uniqueId: "yhbh", // 每行唯一标识
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
                    rows: response.data.list
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#selectUserTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#selectUserTable').contents())($scope);
            },
            columns: [
                {radio: true, width: "5%"},
                {field: "yhbh", title: "用户名",},
                {field: "xm", title: "姓名", align: "left", valign: "middle"},
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
            angular.element('#selectUserTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#selectUserTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + $scope.deptId + "/users"});
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.user = {
                dwh: $scope.user.dwh
            };
            // 重新初始化下拉框
            angular.element('form[name="userSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#selectUserTable').bootstrapTable('refresh', {url: app.api.address + '/system/department/' + $scope.deptId + "/users"});
        }
        // 若页面已渲染，则替换表格元素
        if (angular.element("#selectUserTableDiv").length > 0) {
            var html = '' +
                '<table id="selectUserTable" ui-jq="bootstrapTable" ui-options="selectUserTable" class="table table-responsive"></table>';
            angular.element("#selectUserTableDiv").empty().append(html);
            $compile(angular.element("#selectUserTableDiv").contents())($scope);
        }
    }

})(window);
