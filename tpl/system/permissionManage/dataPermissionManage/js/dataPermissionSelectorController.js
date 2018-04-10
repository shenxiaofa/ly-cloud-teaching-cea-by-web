;(function (window, undefined) {
    'use strict';

    window.system_dataPermissionSelectController = function ($compile, $scope, $uibModal,$uibModalInstance, $rootScope, $window, system_dataPermissionManageService, alertService, app , item) {
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 初始化查询表单下拉框数据
        initIndexMetaData($scope, system_dataPermissionManageService, alertService, $compile);
        $scope.ok = function () {
            // 处理前验证
            var rows = angular.element('#dataPermissionTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择数据权限');
                return;
            }
            item.sjqxbh = rows[0].sjqxbh;
            item.wddm = rows[0].wddm;
            item.wdmc = rows[0].wdmc;
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    system_dataPermissionSelectController.$inject = ['$compile', '$scope', '$uibModal', '$uibModalInstance', '$rootScope', '$window', 'system_dataPermissionManageService', 'alertService', 'app', 'item'];

    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 333;
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
            url: app.api.address  + '/system/permissionDataDimension',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            // toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            sortName: 'sjqxbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "sjqxbh", // 指定主键列
            uniqueId: "sjqxbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: false,
            showRefresh: false,
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
                $compile(angular.element('#dataPermissionTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#dataPermissionTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {radio:true,width:"5%"},
                {field: "sjqxbh", title: "数据权限编号", visible: false},
                {field: "mc", title: "服务", align: "left", valign: "middle"},
                {field: "wddm", title: "维度代码", align: "left", valign: "middle"},
                {field: "wdmc", title: "维度名称", align: "left", valign: "middle"}
            ]
        };

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 98;
            } else {
                $scope.table_height = $scope.table_height - 98;
            }
            angular.element('#selectUserTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
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
                '<select ng-model="dataPermission.bh" id="bh" name="bh" ui-jq="chosen" ui-options="{search_contains: true}" class="form-control">' +
                '<option ng-repeat="fwbhItem in fwbhData" value="{{fwbhItem.bh}}">{{fwbhItem.mc}}</option>' +
                '</select>';
            angular.element("#bh").parent().empty().append(html);
            $compile(angular.element("#bh").parent().contents())($scope);
        });
    }
    
})(window);
