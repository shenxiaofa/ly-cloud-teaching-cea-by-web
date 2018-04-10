/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_teacherScoreEnterController = function($compile, $scope, $uibModal, $rootScope, $window, makeupExam_listManageService, alertService) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 252;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.makeupExaminationList);
        }

        $scope.teacherInputTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#teacherInputTable').contents())($scope);
            },
            url: 'data_test/exam/tableview_makeupExaminationListManage.json',
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
            columns: [
                {field:"semester",title:"开课学期",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程代码",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"department",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"notInputCount",title:"未录入人数",align:"center",valign:"middle"},
                {field:"inputStatus",title:"录入完毕",align:"center",valign:"middle"},
                {field:"reviewStatus",title:"审核状态",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width:"20%",
                    formatter : function (value, row, index) {
                        var maintain =  "<button id='btn_update' type='button' ng-click='maintain(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>录入</button>";
                        var adjust =  "<button id='btn_update' type='button' ng-click='adjust(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>更正</button>";
                        var enabled =  "<button id='btn_update' type='button' ng-click='enabled()'  class='btn btn-default btn-sm''>查看</button>";
                        return    maintain+ "&nbsp;"+ enabled+ "&nbsp;"+adjust;
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
            angular.element('#teacherInputTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#teacherInputTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('#teacherInputTable').bootstrapTable('refresh');
        };

        // 打开生成补考任务
        $scope.produced = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/exam/makeupExamManage/makeupExamListManage/producedExamClass.html',
                size: 'lg',
                controller: producedExamClassController
            });
        };

        /*
         *录入
        */
        $scope.maintain = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/formalExamScore/teacherScoreEnter/enter.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: enterController
            });
        }
        /*
         *更正
        */
        $scope.adjust = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/formalExamScore/teacherScoreEnter/adjust.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: adjustController
            });
        }
    }
    score_teacherScoreEnterController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'makeupExam_listManageService', 'alertService'];


    //生成补考任务控制器
    var producedExamClassController = function ($scope, $uibModalInstance, makeupExam_listManageService, formVerifyService) {
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            makeupExam_listManageService.add($scope.invigilationTeachers);
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    producedExamClassController.$inject = ['$scope', '$uibModalInstance', 'makeupExam_listManageService', 'formVerifyService'];

    //录入控制器
    var enterController = function ($scope, $uibModalInstance, item, makeupExam_listManageService) {
        console.log(item.kcbh);
        $scope.item = item;
        $scope.teacherEnter = {
            url: 'data_test/exam/tableview_studentList.json',
            method: 'get',
            cache: false,
            height: 357,
            //toolbar:"#toolbar",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            columns: [
                {field:"rowId",title:"序号",align:"center",valign:"middle"},
                {field:"studentId",title:"学生学号",align:"center",valign:"middle"},
                {field:"studentName",title:"学生姓名",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"usualScore",title:"平时成绩",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                    return "<input type='text' size='3'  class='form-control'/>"
                }},
                {field:"examScore",title:"正考成绩",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<input type='text' size='3'  class='form-control'/>"
                    }},
                {field:"scoreCount",title:"总成绩",align:"center",valign:"middle"},
                {field:"scoreFlag",title:"成绩标记",align:"center",valign:"middle"},
                {field:"inputName",title:"录入人",align:"center",valign:"middle"},
                {field:"editeTime",title:"修改时间",align:"center",valign:"middle"}
            ]
        }
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    enterController.$inject = ['$scope', '$uibModalInstance', 'item', 'makeupExam_listManageService'];
    //更正控制器
    var adjustController = function ($scope, $uibModalInstance, item, makeupExam_listManageService) {
        console.log(item.kcbh);
        $scope.item = item;
        $scope.teacherEnter = {
            url: 'data_test/exam/tableview_studentList.json',
            method: 'get',
            cache: false,
            height: 357,
            //toolbar:"#toolbar",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            clickToSelect: true,
            columns: [
                {field:"rowId",title:"序号",align:"center",valign:"middle"},
                {field:"studentId",title:"学生学号",align:"center",valign:"middle"},
                {field:"studentName",title:"学生姓名",align:"center",valign:"middle"},
                {field:"className",title:"班级名称",align:"center",valign:"middle"},
                {field:"usualScore",title:"平时成绩",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                    return "<input type='text' size='3'  class='form-control'/>"
                }},
                {field:"examScore",title:"正考成绩",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        return "<input type='text' size='3'  class='form-control'/>"
                    }},
                {field:"scoreCount",title:"总成绩",align:"center",valign:"middle"},
                {field:"scoreFlag",title:"成绩标记",align:"center",valign:"middle"},
                {field:"inputName",title:"录入人",align:"center",valign:"middle"},
                {field:"editeTime",title:"修改时间",align:"center",valign:"middle"}
            ]
        }
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    adjustController.$inject = ['$scope', '$uibModalInstance', 'item', 'makeupExam_listManageService'];
})(window);
