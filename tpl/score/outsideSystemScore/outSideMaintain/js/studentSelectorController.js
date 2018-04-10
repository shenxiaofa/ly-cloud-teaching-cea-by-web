;(function (window, undefined) {
    'use strict';

    window.score_studentSelectController = function ($compile, $scope, $uibModal,$uibModalInstance, $rootScope, $window, score_outSideMaintainService, student_undergraduatesInfoManageService, alertService, app , item) {
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 初始化查询表单下拉框数据
        initIndexMetaData($scope, score_outSideMaintainService, student_undergraduatesInfoManageService, alertService, $compile);
        $scope.ok = function () {
            // 处理前验证
            var rows = angular.element('#dataPermissionTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择数据权限');
                return;
            }
            item.studentName = rows[0].name;
            item.studentNum = rows[0].num;
            item.departmentName = rows[0].deptName;
            item.semesterMajor = rows[0].majorName;
            item.className = rows[0].executiveClassName;
            angular.element('#outsideCourseTable').bootstrapTable('refresh');
            angular.element('#courseCurriculaTable').bootstrapTable('refresh');

            // item.wddm = rows[0].wddm;
            // item.wdmc = rows[0].wdmc;
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    score_studentSelectController.$inject = ['$compile', '$scope', '$uibModal', '$uibModalInstance', '$rootScope', '$window', 'score_outSideMaintainService', 'student_undergraduatesInfoManageService', 'alertService', 'app', 'item'];

    // 初始化表格
    var initIndexTable = function ($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 600;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber  //页码
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
            url: app.api.address  + '/student/statusInfo',
            method: 'get',
            cache: false,
            height: 350,
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
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function () {
                $compile(angular.element('#dataPermissionTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {radio:true,width:"5%"},
                {field: "num", title: "学号", align: "left", valign: "middle"},
                {field: "name", title: "姓名",align: "left", valign: "middle"},
                {field: "sex", title: "性别", align: "left", valign: "middle"},
                {field: "deptName", title: "院系", align: "left", valign: "middle"},
                {field: "majorName", title: "专业", align: "left", valign: "middle"},
                {field: "grade", title: "年级", align: "left", valign: "middle"},
                {field: "executiveClassName", title: "班级", align: "left", valign: "middle"}
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
    var initIndexMetaData = function($scope, score_outSideMaintainService, student_undergraduatesInfoManageService, alertService, $compile) {
        var selectionData = [];
        student_undergraduatesInfoManageService.get(function (data) {
            // console.log(data);
            selectionData = data;
            findSelectionData();
        });
        var findSelectionData = function () {
            $scope.sexList =selectionData.sexList;
            $scope.deptList =selectionData.deptList;
            $scope.majorList =selectionData.majorList;
            var sexHtml = '<select ng-model="dataPermission.sexCode" ng-options="sex.id as sex.name for sex in sexList"'
                +' name="sexCode" id="sexCode_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
                +' <option value="">==请选择==</option>'
                +' </select>';
            var deptHtml = '<select ng-model="dataPermission.deptId" ng-options="dept.id as dept.name for dept in deptList"'
                +' name="deptId" id="deptId_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
                +' <option value="">==请选择==</option>'
                +' </select>';
            var majorHtml = '<select ng-model="dataPermission.majorId" ng-options="major.id as major.name for major in majorList"'
                +' name="majorId" id="majorId_search" class="form-control" ui-jq="chosen" ui-options="{search_contains: true}">'
                +' <option value="">==请选择==</option>'
                +' </select>';
            angular.element("#sexCode_search").parent().empty().append(sexHtml);
            $compile(angular.element("#sexCode_search").parent().contents())($scope);
            angular.element("#deptId_search").parent().empty().append(deptHtml);
            $compile(angular.element("#deptId_search").parent().contents())($scope);
            angular.element("#majorId_search").parent().empty().append(majorHtml);
            $compile(angular.element("#majorId_search").parent().contents())($scope);
        };
    }
    
})(window);
