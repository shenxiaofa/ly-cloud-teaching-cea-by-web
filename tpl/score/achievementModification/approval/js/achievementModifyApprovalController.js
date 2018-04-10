;(function (window, undefined) {
    'use strict';
    window.score_achievementApprovalController = function($compile, $scope, $uibModal, $rootScope, $window, score_achievementApprovalService, alertService){

        // 表格的高度
        $scope.table_height = $window.innerHeight-130;

        // 审核tab表格的高度
        $scope.shTable_height = $window.innerHeight-285;

        // 维护tab表格的高度
        $scope.whTable_height = $window.innerHeight-348;

        // 查询参数
        $scope.shQueryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.makeupExaminationList);
        }

        //考试方式审批 table
        $scope.examinationMethodApprovalTable = {
            url: 'data_test/exam/tableview_examinationMethodApproval.json',
            method: 'get',
            cache: false,
            height: $scope.shTable_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "xnxq", // 指定主键列
            uniqueId: "xnxq", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.shQueryParams,//传递参数（*）
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            search: false,
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examinationMethodApprovalTable').contents())($scope);
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"xnxq",title:"学年学期",align:"center",valign:"middle"},
                {field:"xnxq",title:"学号",align:"center",valign:"middle"},
                {field:"sqr",title:"姓名",align:"center",valign:"middle"},
                {field:"xnxq",title:"课程编号",align:"center",valign:"middle"},
                {field:"xnxq",title:"课程名称",align:"center",valign:"middle"},
                {field:"sqrszxy",title:"开课单位",align:"center",valign:"middle"},
                {field:"xnxq",title:"学分",align:"center",valign:"middle"},
                {field:"xnxq",title:"考试状态",align:"center",valign:"middle"},
                {field:"sqsj",title:"考试方式",align:"center",valign:"middle"},
                {field:"spzt",title:"审批状态",align:"center",valign:"middle"},
                {field:"id",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        return "<button id='btn_delete'  type='button' ng-click='approval(" + JSON.stringify(row) + ")' class='btn btn-default'>审批</button>";
                    }
                }
            ],
        };
        
        /**
         * 点击考试方案审核
         */
        $scope.shClickAlready = function() {
			angular.element('#examinationMethodApprovalTable').bootstrapTable('refresh');
        };
        
        // 查询表单显示和隐藏切换
        $scope.shIsHideSearchForm = false; // 默认显示
        $scope.shSearchFormHideToggle = function () {
            $scope.shIsHideSearchForm = !$scope.shIsHideSearchForm
            if ($scope.shIsHideSearchForm) {
                $scope.shTable_height = $scope.shTable_height + 115;
            } else {
                $scope.shTable_height = $scope.shTable_height - 115;
            }
            angular.element('#examinationMethodApprovalTable').bootstrapTable('resetView',{ height: $scope.shTable_height } );
        };
        
        // 查询表单提交
        $scope.shSearchSubmit = function () {
            angular.element('#examinationMethodApprovalTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单重置
        $scope.shSearchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('#examinationMethodApprovalTable').bootstrapTable('refresh');
        };

        //批量审批
        $scope.batchApproval = function(){
            var rows = $('#examinationMethodApprovalTable').bootstrapTable('getSelections');
            if(rows.length==0){
                alertService('请先选择要审批的项');
            }else{
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'tpl/score/achievementModification/approval/batchApproval.html',
                    size: 'lg',
                    resolve: {
                        items: function () {
                            return rows;
                        },
                    },
                    controller: examinationMethodBatchApproval
                });
            }
        }

        //审批
        $scope.approval = function(data){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/score/achievementModification/approval/approval.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                },
                controller: examinationMethodApproval
            });
        }


        $scope.ok = function () {
            var data = angular.element('#examinationMethodMaintainTable').bootstrapTable('getData');
            data.forEach (function(obj) {
                obj.ksfs = angular.element('#ksfs'+obj.id)[0].value;
                obj.pscjbl = angular.element('#pscjbl'+obj.id)[0].value;
                obj.qmcjbl = angular.element('#qmcjbl'+obj.id)[0].value;
            });
            score_achievementApprovalService.add(data);
        }

    }
    score_achievementApprovalController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'score_achievementApprovalService', 'alertService'];

    //批量审批
    var examinationMethodBatchApproval = function ($scope, $uibModalInstance, items, score_achievementApprovalService) {
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function () {
            var ids = []; // 培养方案编制控制编号集合
            items.forEach (function(data) {
                ids.push(data.sqbd);
            });
            score_achievementApprovalService.batchApproval(ids,$scope.spyj);
            $uibModalInstance.close();
        };
    }
    examinationMethodBatchApproval.$inject = ['$scope', '$uibModalInstance', 'items', 'score_achievementApprovalService'];

    //审批
    var examinationMethodApproval = function ($scope, $uibModalInstance, item, score_achievementApprovalService, alertService) {
        $scope.cancel= function(){
            $uibModalInstance.close();
        }
        $scope.ok = function (form) {
            // var data = angular.element('#examinationMethodApprovalTable2').bootstrapTable('getData');
            // data.forEach (function(obj) {
            //     obj.ksfs = angular.element('#ksfs'+obj.id)[0].value;
            //     obj.pscjbl = angular.element('#pscjbl'+obj.id)[0].value;
            //     obj.qmcjbl = angular.element('#qmcjbl'+obj.id)[0].value;
            // });
            // var yj = $scope.spyj;
            // if(yj==undefined){
            //     alertService('请填写审批意见');
            //     return;
            // }
            // score_achievementApprovalService.update(data,yj,item);
            $uibModalInstance.close();
        };
    }
    examinationMethodApproval.$inject = ['$scope', '$uibModalInstance', 'item', 'score_achievementApprovalService', 'alertService'];
})(window);
