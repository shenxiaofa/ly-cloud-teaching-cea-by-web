/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';
    //考试课程维护Controller
    window.score_outsideReviewController = function(baseinfo_generalService, $compile, $scope, $uibModal, $rootScope, $window, score_outsideReviewService, alertService ,app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight - 244;

        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.outsideReview);
        }
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="outsideReview.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        $scope.makeupExaminationListManageTable = {
            onLoadSuccess: function() {
                $compile(angular.element('#makeupExaminationListManageTable').contents())($scope);
            },
            url:app.api.address + '/score/outSysScoreReview',
            //url: 'data_test/exam/tableview_makeupExaminationListManage.json',
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
                {field:"checkbox", checkbox: true, width: "5%"},
                {field:"semesterId",title:"学年学期",align:"center",valign:"middle"},
                {field:"studentNum",title:"学号",align:"center",valign:"middle"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle"},
                {field:"applyTime",title:"申请时间",align:"center",valign:"middle"},
                {field:"cnCourseName",title:"中文课程名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"英文课程名",align:"center",valign:"middle"},
                {field:"courseModule",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
                //{field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
                {field:"score",title:"课程成绩",align:"center",valign:"middle"},
                {field:"auditStatus",title:"审批状态",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        var adjust =  "<button id='btn_update' type='button' ng-click='adjust(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>审核</button>";
                        return   adjust;
                    }
                }
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
            angular.element('#makeupExaminationListManageTable').bootstrapTable('resetView',{ height: $scope.table_height } );
        };

        // 查询表单提交
        $scope.searchSubmit = function () {
            angular.element('#makeupExaminationListManageTable').bootstrapTable('selectPage', 1);
        };
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('#makeupExaminationListManageTable').bootstrapTable('refresh');
        };

        /*
         *批量审批
        */
        $scope.review = function(){
            var rows = angular.element('#makeupExaminationListManageTable').bootstrapTable('getSelections');
            if(rows.length == 0 ){
                alertService('请先选择需要审批的记录');
                return;
            }
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideReview/opinion.html',
                resolve: {
                    items: function () {
                        return rows;
                    }
                },
                controller: opinionController
            });
        }
        /*
         *审批
        */
        $scope.adjust = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideReview/review.html',
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
    score_outsideReviewController.$inject = ['baseinfo_generalService', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'score_outsideReviewService', 'alertService','app'];


    //生成补考任务控制器
    var producedExamClassController = function ($scope, $uibModalInstance, score_outsideReviewService, formVerifyService) {
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            score_outsideReviewService.add($scope.invigilationTeachers);
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    producedExamClassController.$inject = ['$scope', '$uibModalInstance', 'score_outsideReviewService', 'formVerifyService'];

    //审批意见
    var opinionController = function ($scope, $uibModalInstance, items, score_outsideReviewService, formVerifyService) {
        $scope.ok = function (form) {
            // 处理前验证
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
            var processInstanceIds = [];
            items.forEach(function (data) {
                processInstanceIds.push(data.processInstanceId);
            })
            score_outsideReviewService.review($scope.opinion,processInstanceIds, function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }
                angular.element('#makeupExaminationListManageTable').bootstrapTable('refresh');
                $uibModalInstance.close();
                alertService('success', '保存成功');
            });
            
        };
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    };
    opinionController.$inject = ['$scope', '$uibModalInstance', 'items', 'score_outsideReviewService', 'formVerifyService'];

    //更正控制器
    var adjustController = function ($uibModal,$scope, $uibModalInstance, item, score_outsideReviewService) {
        $scope.outsideReview = item;
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
        var items = [];
        items.push(item);
        $scope.review = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/outsideSystemScore/outsideReview/opinion.html',
                resolve: {
                    items: function () {
                        return items;
                    }
                },
                controller: opinionController
            });
            $uibModalInstance.close();
        }

    };
    adjustController.$inject = ['$uibModal','$scope', '$uibModalInstance', 'item', 'score_outsideReviewService'];
})(window);
