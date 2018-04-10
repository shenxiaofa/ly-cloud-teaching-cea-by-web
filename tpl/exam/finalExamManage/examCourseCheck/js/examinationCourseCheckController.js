/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.exam_courseCheckController = function($scope, $compile, baseinfo_generalService, app, $uibModal, $rootScope, $window, exam_courseCheckService, alertService) {

        //学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examQualification.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });

        // 表格的高度
        $scope.table_height = $window.innerHeight - 226;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder,
                examType:"1"
            };
            return angular.extend(pageParam, $scope.examQualification);
        }

        $scope.examinationCourseCheckTable = {
            url:app.api.address + '/exam/testTask/examCourseManage',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field: "semester", title: "开课学期", align: "center", valign: "middle"},
                {field: "courseNum", title: "课程代码", align: "center", valign: "middle"},
                {field: "courseNanme", title: "课程名称", align: "center", valign: "middle"},
                {field: "courseProperty", title: "课程属性", align: "center", valign: "middle"},
                {field: "dept", title: "开课单位", align: "center", valign: "middle"},
                {field: "credit", title: "学分", align: "center", valign: "middle"},
                {field: "totalHour", title: "总学时", align: "center", valign: "middle"},
                {field: "theoryHour", title: "理论学时", align: "center", valign: "middle"},
                {field: "practiceHour", title: "实践学时", align: "center", valign: "middle"}
             /*   {field:"sfxf",title:"是否下放",align:"center",valign:"middle"}*/
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
            angular.element('#examinationCourseCheckTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };
        
        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#examinationCourseCheckTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examQualification = {};
            angular.element('form[name="pyfabzkz_form"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examinationCourseCheckTable').bootstrapTable('refresh');
        };
    }
    exam_courseCheckController.$inject = ['$scope', '$compile', 'baseinfo_generalService', 'app', '$uibModal', '$rootScope', '$window', 'exam_courseCheckService', 'alertService'];

})(window);
