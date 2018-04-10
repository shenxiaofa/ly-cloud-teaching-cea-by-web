;(function (window, undefined) {
    'use strict';

    window.student_newStudentPlacementController = function ($compile, $state, $scope, $uibModal, $rootScope, $window, student_newStudentPlacementService, baseinfo_generalService, alertService, app) {
        $scope.newStudentPlacement = {};
        // 初始化下拉框数据
        initIndexMetaData($scope, baseinfo_generalService, alertService, $compile);
        // 初始化页面表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 跳转到分班页面
        $scope.toPlacement = function(){
            $state.go('home.common.newStudentPlacementManage');
        };
    };
    student_newStudentPlacementController.$inject = ['$compile', '$state', '$scope', '$uibModal', '$rootScope', '$window', 'student_newStudentPlacementService', 'baseinfo_generalService', 'alertService', 'app'];

    // 初始化页面表格
    var initIndexTable = function ($scope, $window, $rootScope, $compile, app) {
        // 表格的高度
        $scope.table_height = $window.innerHeight - 264;
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNum: params.pageNumber  //页码
            };
            // 去除为 null 或 "" 值的查询字段
            var newStudentPlacementQuery = {};
            angular.forEach($scope.newStudentPlacement, function(data, index, array){
                if (data) {
                    newStudentPlacementQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, newStudentPlacementQuery));
            return angular.extend(pageParam, newStudentPlacementQuery);
        };
        $scope.newStudentPlacementTable = {
            url: 'data_test/student/tableview_newStudentPlacement.json',
            //url: app.api.address + '/student/newStudentPlacement',
            headers: {
                permission: "newStudentPlacement:query"
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
            idField: "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler: function (response) {
                return {
                    total: response.data.total,
                    rows: response.data.rows
                };
            },
            onLoadSuccess: function () {
                $compile(angular.element('#newStudentPlacementTable').contents())($scope);
            },
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#newStudentPlacementTable').contents())($scope);
            },
            columns: [
                {checkbox: true, width: "3%"},
                {field: "id", title: "新生学生ID", visible:false},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    var page = angular.element('#newStudentPlacementTable').bootstrapTable("getPage");
                    return page.pageSize * (page.pageNumber-1) + (index + 1);
                }},
                {field: "classNo", title: "班号", align: "left", valign: "middle"},
                {field: "className", title: "班级名称", align: "left", valign: "middle"},
                {field: "peopleNums", title: "班级计划人数", align: "left", valign: "middle"},
                {field: "allpel", title: "学生人数", align: "left", valign: "middle"},
                {field: "male", title: "男", align: "left", valign: "middle"},
                {field: "female", title: "女", align: "left", valign: "middle"},
                {field: "collegeName", title: "学院", align: "left", valign: "middle"},
                {field: "grade", title: "年级", align: "left", valign: "middle"},
                {field: "majorNumber", title: "专业方向码", align: "left", valign: "middle"},
                {field: "majorName", title: "专业方向", align: "left", valign: "middle"},
                {field: "gradeMajorName", title: "年级专业方向", align: "left", valign: "middle"},
                {field: "campusName", title: "校区", align: "left", valign: "middle"}
            ]
        };
        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 155;
            } else {
                $scope.table_height = $scope.table_height - 155;
            }
            angular.element('#newStudentPlacementTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#newStudentPlacementTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.newStudentPlacement = {};
            // 重新初始化下拉框
            angular.element('form[name="newStudentPlacementSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#newStudentPlacementTable').bootstrapTable('selectPage', 1);
        }
    }

    // 初始化主页面板下拉框数据
    var initIndexMetaData = function($scope, baseinfo_generalService, alertService, $compile) {

    }

})(window);
