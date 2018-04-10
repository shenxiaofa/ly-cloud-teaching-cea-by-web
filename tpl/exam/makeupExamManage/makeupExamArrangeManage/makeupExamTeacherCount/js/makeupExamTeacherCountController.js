/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试安排统计Controller
    window.makeupExam_teacherCountController = function($scope, app, $uibModal, $rootScope, $compile, $window, makeupExam_TeacherCountService, alertService) {
        
		// 表格的高度
        $scope.table_height = $window.innerHeight - 223;
        
		// 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                type : "2"
            };
            return angular.extend(pageParam, $scope.makeupExamTeacherCount);
        };

        $scope.examTeacherCountTable = {
            url:app.api.address + '/exam/formalArrange/examTeacherCount',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）			
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "kcbh", // 指定主键列
            uniqueId: "kcbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examTeacherCountTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field: "semester", title: "学年学期", align: "center", valign: "middle"},
                {field: "id", title: "监考教师工号", align: "center", valign: "middle"},
                {field: "name", title: "监考教师姓名", align: "center", valign: "middle"},
                {field: "dept", title: "所属单位", align: "center", valign: "middle"},
                {field: "minuteCount", title: "时长（分）", align: "center", valign: "middle"},
                {field: "bankNumber", title: "银行账号", align: "center", valign: "middle"}
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
            angular.element('#examTeacherCountTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#examTeacherCountTable').bootstrapTable('selectPage', 1);
        }; 
        
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.makeupExamTeacherCount = {};
            angular.element('form[name="makeupExamTeacherCountSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examTeacherCountTable').bootstrapTable('refresh');
        };

    }
    makeupExam_teacherCountController.$inject = ['$scope', 'app', '$uibModal', '$rootScope', '$compile', '$window', 'makeupExam_TeacherCountService', 'alertService'];

})(window);
