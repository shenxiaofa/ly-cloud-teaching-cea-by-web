;(function (window, undefined) {
    'use strict';

    window.scheme_mandatoryStudiedController = function ($compile, $scope, $uibModal, $rootScope, $window, $timeout, alertService) {
        /*
        * 按课程统计通过率
        * */

        //tree菜单高度
        $scope.leftTreeStyle = {
            "border-right":"1px solid #e5e5e5",
            "height": $window.innerHeight-100,
            "padding-top":"15px"
        };

        // 按课程通过率统计表格的高度
        $scope.coursePassRateTableHeight = $window.innerHeight - 250;

        $scope.coursePassRateTable = {
            url: 'data_test/curriculum/course_pass_rate.json',
            method: 'get',
            cache: false,
            height: $scope.coursePassRateTableHeight,
            toolbar: '#coursePassRateToolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#coursePassRateTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {field:"courseNum", title:"课程号", align:"center",valign:"middle"},
                {field:"courseName", title:"课程名称", align:"center",valign:"middle"},
                {field:"studentCount",title:"学生总人数",align:"left",valign:"middle"},
                {field:"passCount", title:"已通过人数", align:"left",valign:"middle"},
                {field:"passRate",title:"已通过比例",align:"center",valign:"middle"},
                {field:"unPassCount",title:"未通过人数",align:"center",valign:"middle"}
            ]
        };

        // 查询表单显示和隐藏切换
        $scope.isHideCoursePassRateSearchForm = false; // 默认显示
        $scope.coursePassRateSearchFormHideToggle = function () {
            $scope.isHideCoursePassRateSearchForm = !$scope.isHideCoursePassRateSearchForm
            if ($scope.isHideCoursePassRateSearchForm) {
                $scope.coursePassRateTableHeight = $scope.coursePassRateTableHeight + 75;
            } else {
                $scope.coursePassRateTableHeight = $scope.coursePassRateTableHeight - 75;
            }
            angular.element('#coursePassRateTable').bootstrapTable('resetView',{ height: $scope.coursePassRateTableHeight } );
        };

        /*
        * 按班级统计通过率
        * */

        // 按课程通过率统计表格的高度
        $scope.classPassRateTableHeight = $window.innerHeight - 289;

        $scope.classPassRateTable = {
            url: 'data_test/curriculum/class_pass_rate.json',
            method: 'get',
            cache: false,
            height: $scope.classPassRateTableHeight,
            toolbar: '#classPassRateToolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#classPassRateTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {field:"grade", title:"年级", align:"center",valign:"middle"},
                {field:"deptName", title:"学院", align:"center",valign:"middle"},
                {field:"marjorName",title:"专业方向",align:"left",valign:"middle"},
                {field:"executiveClassName",title:"班级",align:"left",valign:"middle"},
                {field:"courseModle",title:"课程模块",align:"left",valign:"middle"},
                {field:"courseNum",title:"课程号",align:"left",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"left",valign:"middle"},
                {field:"studentCount",title:"班级人数",align:"left",valign:"middle"},
                {field:"passCount", title:"已通过人数", align:"left",valign:"middle"},
                {field:"passRate",title:"已通过比例",align:"center",valign:"middle"},
                {field:"unPassCount",title:"未通过人数",align:"center",valign:"middle"}
            ]
        };
        
        // 判断卡片是都被点击
        $scope.clickAlready = function(){
			angular.element('#classPassRateTable').bootstrapTable('refresh');
        };

        // 查询表单显示和隐藏切换
        $scope.isHideClassPassRateSearchForm = false; // 默认显示
        $scope.classPassRateSearchFormHideToggle = function () {
            $scope.isHideClassPassRateSearchForm = !$scope.isHideClassPassRateSearchForm
            if ($scope.isHideClassPassRateSearchForm) {
                $scope.classPassRateTableHeight = $scope.classPassRateTableHeight + 115;
            } else {
                $scope.classPassRateTableHeight = $scope.classPassRateTableHeight - 115;
            }
            angular.element('#classPassRateTable').bootstrapTable('resetView',{ height: $scope.classPassRateTableHeight } );
        };

        var apple_selected, treedata_avm;
        treedata_avm = [
            {
                label: '北京电影学院',
                onSelect:  function(branch) {
                    return $scope.output = "Vegetable: " + branch.data;
                },
                children: [
                    {
                        label: '导演学院'
                    }, {
                        label: '表演学院'
                    }, {
                        label: '声乐学院'
                    }
                ]
            }
        ];

        $scope.menuTreeData = treedata_avm;
    };
    scheme_mandatoryStudiedController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'alertService', 'app'];

})(window);
