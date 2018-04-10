;(function (window, undefined) {
    'use strict';

    window.arrange_teacherSelectController = function ($compile, $scope, $uibModal,$uibModalInstance, $rootScope, $window, baseinfo_generalService, alertService, app , item) {
        // 初始化表格
        initIndexTable($scope, $window, $rootScope, $compile, app);
        // 初始化查询表单下拉框数据
        initIndexMetaData($scope, baseinfo_generalService, alertService, $compile);
        $scope.save = function () {
            // 处理前验证
            var rows = angular.element('#teacherIntoTable').bootstrapTable('getSelections');
            if(rows.length == 0){
                alertService('请先选择数据权限');
                return;
            }
            item.teacherId = rows[0].user_ID;
            item.teacherName = rows[0].name;
            // item.departmentName = rows[0].deptName;
            // item.semesterMajor = rows[0].majorName;
            // item.className = rows[0].executiveClassName;
            // angular.element('#outsideCourseTable').bootstrapTable('refresh');
            // angular.element('#courseCurriculaTable').bootstrapTable('refresh');

            // item.wddm = rows[0].wddm;
            // item.wdmc = rows[0].wdmc;
            $uibModalInstance.close();
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    arrange_teacherSelectController.$inject = ['$compile', '$scope', '$uibModal', '$uibModalInstance', '$rootScope', '$window', 'baseinfo_generalService', 'alertService', 'app', 'item'];

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
            var searchParamQuery = {};
            angular.forEach($scope.searchParam, function (data, index, array) {
                if (data) {
                    searchParamQuery[index] = data;
                }
            });
            $rootScope.$log.debug(angular.extend(pageParam, searchParamQuery));
            return angular.extend(pageParam, searchParamQuery);
        };
        $scope.teacherIntoTable = {
            //url: 'data_test/system/tableview_dataPermission.json',
            url: app.api.address  + '/score/scoreEntering/queryTeacher',
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
            paginationPreText: '<',
            paginationNextText: '>',
            sortName: 'sjqxbh', // 默认排序字段
            sortOrder: 'asc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField: "user_ID", // 指定主键列
            uniqueId: "user_ID", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            search: false,
            showColumns: false,
            showRefresh: false,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function () {
                $compile(angular.element('#teacherIntoTable').contents())($scope);
            },
            clickToSelect: true,
            columns: [
                {radio: true, width: "5%"},
                {field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                    return index+1;
                }},
                {field:"user_ID",title:"职工号",align:"center",valign:"middle"},
                {field:"name",title:"教师姓名",align:"center",valign:"middle"},
                {field:"IDNumber",title:"身份证号",align:"center",valign:"middle"},
                {field:"sex",title:"性别",align:"center",valign:"middle"},
                {field:"department",title:"所在单位",align:"center",valign:"middle"},
                {field:"teacherCategory",title:"教师类别",align:"center",valign:"middle"}
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
            angular.element('#teacherIntoTable').bootstrapTable('resetView', {height: $scope.table_height});
        }
        $scope.searchSubmit = function () {
            angular.element('#teacherIntoTable').bootstrapTable('selectPage', 1);
        }
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.searchParam = {};
            // 重新初始化下拉框
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#teacherIntoTable').bootstrapTable('selectPage', 1);
        };
    }

    // 初始化主页下拉框数据
    var initIndexMetaData = function($scope, baseinfo_generalService, alertService, $compile) {
        baseinfo_generalService.findcodedataNames({datableNumber: "XBM"},function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.sexObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in sexObjs" '
                +  ' ng-model="searchParam.sex" id="sex" name="sex" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#sex").parent().empty().append(html);
            $compile(angular.element("#sex").parent().contents())($scope);
        });

        baseinfo_generalService.findcodedataNames({datableNumber: "JZGLBM"}, function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.teacherCategoryObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in teacherCategoryObjs" '
                +  ' ng-model="searchParam.teacherCategory" id="teacherCategory" name="teacherCategory" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#teacherCategory").parent().empty().append(html);
            $compile(angular.element("#teacherCategory").parent().contents())($scope);
        });

    }
    
})(window);
